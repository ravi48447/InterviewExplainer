/**
 * useRoom.mjs — client hook for a 1:1 WebRTC room over the long-poll signaling API.
 * (Named .mjs for engine consistency; imported from client components.)
 *
 * Perfect-negotiation-lite: both sides send SDP + ICE via /api/engine/room,
 * polite guest defers glare. Reconnects the poll loop on error with backoff.
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useRoom() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [role, setRole] = useState<'host' | 'guest' | null>(null);
  const [connected, setConnected] = useState(false);
  const [peerJoined, setPeerJoined] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const tokenRef = useRef<string | null>(null);
  const roleRef = useRef<'host' | 'guest' | null>(null);
  const vRef = useRef(0);
  const pollAbort = useRef(false);
  const localStreamRef = useRef<MediaStream | null>(null);
  const iceQueue = useRef<any[]>([]);
  const remoteDescSet = useRef(false);

  const ensurePC = useCallback(() => {
    if (pcRef.current) return pcRef.current;
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        // TURN: add via env when deployed (coturn); P2P works on most networks without it
      ],
    });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        fetch('/api/engine/room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'signal', roomId: roomIdRef.current, token: tokenRef.current, type: 'ice', data: e.candidate.toJSON() }),
        }).catch(() => {});
      }
    };
    pc.ontrack = (e) => setRemoteStream(e.streams[0]);
    pc.onconnectionstatechange = () => setConnected(pc.connectionState === 'connected');
    if (localStreamRef.current) localStreamRef.current.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current!));
    pcRef.current = pc;
    return pc;
  }, []);

  const roomIdRef = useRef<string | null>(null);
  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  /** create a room (host) */
  const create = useCallback(async () => {
    const res = await fetch('/api/engine/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create' }),
    });
    const data = await res.json();
    if (!data.roomId) throw new Error(data.error || 'create failed');
    setRoomId(data.roomId);
    roomIdRef.current = data.roomId;
    tokenRef.current = data.hostToken;
    roleRef.current = 'host';
    setRole('host');
    return { roomId: data.roomId, hostToken: data.hostToken, guestToken: data.guestToken };
  }, []);

  /** join an existing room (guest) — token arrives via the share URL */
  const join = useCallback(async (id: string, token: string) => {
    const res = await fetch('/api/engine/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'join', roomId: id }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'join failed');
    setRoomId(id);
    roomIdRef.current = id;
    tokenRef.current = token;
    roleRef.current = 'guest';
    setRole('guest');
    setPeerJoined(true);
    return data;
  }, []);

  /** attach local media before connecting */
  const setLocalMedia = useCallback((stream: MediaStream | null) => {
    localStreamRef.current = stream;
    if (pcRef.current && stream) stream.getTracks().forEach((t) => pcRef.current!.addTrack(t, stream));
  }, []);

  /** long-poll loop: receive peer signals, apply them */
  useEffect(() => {
    if (!roomId || !tokenRef.current) return;
    pollAbort.current = false;
    let backoff = 1000;

    const applySignal = async (sig: any) => {
      const pc = ensurePC();
      try {
        if (sig.type === 'sdp-offer' && roleRef.current === 'host') {
          await pc.setRemoteDescription(new RTCSessionDescription(sig.data));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          await fetch('/api/engine/room', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'signal', roomId: roomIdRef.current, token: tokenRef.current, type: 'sdp-answer', data: { type: answer.type, sdp: answer.sdp } }),
          });
        } else if (sig.type === 'sdp-answer') {
          await pc.setRemoteDescription(new RTCSessionDescription(sig.data));
          remoteDescSet.current = true;
          for (const c of iceQueue.current) { try { await pc.addIceCandidate(c); } catch {} }
          iceQueue.current = [];
        } else if (sig.type === 'ice') {
          const cand = sig.data;
          if (!pc.remoteDescription) iceQueue.current.push(cand);
          else { try { await pc.addIceCandidate(cand); } catch {} }
        }
      } catch (e: any) {
        console.warn('signal apply failed', e?.message);
      }
    };

    const poll = async () => {
      if (pollAbort.current) return;
      try {
        const url = `/api/engine/room?roomId=${roomIdRef.current}&token=${tokenRef.current}&v=${vRef.current}`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          backoff = 1000;
          vRef.current = data.v ?? vRef.current;
          if (data.guestJoined) setPeerJoined(true);
          for (const s of data.signals ?? []) await applySignal(s);
          if (data.state === 'ended') {
            setError('Session ended by peer.');
            return;
          }
        }
      } catch {
        backoff = Math.min(backoff * 2, 15000);
      }
      if (!pollAbort.current) setTimeout(poll, backoff);
    };
    poll();
    return () => {
      pollAbort.current = true;
    };
  }, [roomId, ensurePC]);

  /** host: begin the call (send offer) once peer joined */
  const startCall = useCallback(async () => {
    const pc = ensurePC();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await fetch('/api/engine/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'signal', roomId: roomIdRef.current, token: tokenRef.current, type: 'sdp-offer', data: { type: offer.type, sdp: offer.sdp } }),
    });
  }, [ensurePC]);

  const end = useCallback(async () => {
    pollAbort.current = true;
    try {
      await fetch('/api/engine/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'end', roomId: roomIdRef.current, token: tokenRef.current }),
      });
    } catch {}
    try { pcRef.current?.close(); } catch {}
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    setConnected(false);
  }, []);

  return { roomId, role, connected, peerJoined, remoteStream, error, create, join, setLocalMedia, startCall, end, setRole };
}
