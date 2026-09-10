/**
 * /api/engine/room — WebRTC 1:1 signaling over versioned HTTP long-poll.
 * No WebSocket server required: works on any Next.js host.
 *
 *   POST  { action: 'create' }                    -> { roomId, peerToken, hostToken }
 *   POST  { action: 'join', roomId }               -> { ok } | { error: 'room_full' }
 *   POST  { action: 'signal', roomId, token, data } -> { ok }  (SDP/ICE relay, fanout to peer)
 *   GET   ?roomId&token&v=<lastVersion>            -> long-poll: waits <=25s for new
 *                                                    signals/state, returns { v, signals, state }
 *
 * In-memory store (single-instance dev; Redis-backed swap is the documented seam).
 * Rooms expire after 2h idle. Tokens are random, transported in the join URL.
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type Signal = {
  from: 'host' | 'guest';
  /** sdp-offer | sdp-answer | ice | question (host->guest: current question card) | transcript (guest->host: live words) | state (sync) */
  type: string;
  data: any;
  at: number;
};

type Room = {
  id: string;
  createdAt: number;
  lastActivity: number;
  hostToken: string;
  guestToken: string | null;
  guestJoined: boolean;
  state: 'waiting' | 'live' | 'ended';
  signals: Signal[];
  waiters: Array<{ token: string; version: number; resolve: (payload: unknown) => void; timer: ReturnType<typeof setTimeout> }>;
};

// module-global store (survives across requests in a single Next server process)
const g = globalThis as any;
const rooms: Map<string, Room> = (g.__ieRooms ??= new Map());
const VERS = (g.__ieVers ??= 0);

const TTL_MS = 2 * 60 * 60 * 1000;
const POLL_TIMEOUT_MS = 25_000;

function tok(prefix: string) {
  return `${prefix}${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

function cleanup() {
  const now = Date.now();
  for (const [id, r] of rooms) {
    if (now - r.lastActivity > TTL_MS) {
      for (const w of r.waiters) {
        clearTimeout(w.timer);
        w.resolve({ v: w.version, signals: [], state: 'ended', timeout: true });
      }
      rooms.delete(id);
    }
  }
}

function roleOf(room: Room, token: string): 'host' | 'guest' | null {
  if (token === room.hostToken) return 'host';
  if (room.guestToken && token === room.guestToken) return 'guest';
  return null;
}

function notifyWaiters(room: Room) {
  room.waiters = room.waiters.filter((w) => {
    if (room.signals.length > w.version || true) {
      // waiter version counts signals visible to ITS peer; simple approach: any new signal wakes all
      clearTimeout(w.timer);
      const mine = room.signals.filter((s) => s.from !== w.token);
      w.resolve({
        v: room.signals.length,
        signals: mine.slice(-20),
        state: room.state,
        guestJoined: room.guestJoined,
      });
      return false;
    }
    return true;
  });
}

async function handlePost(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const action = body?.action;

  if (action === 'create') {
    cleanup();
    const id = tok('r-');
    const room: Room = {
      id,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      hostToken: tok('h-'),
      guestToken: tok('g-'),
      guestJoined: false,
      state: 'waiting',
      signals: [],
      waiters: [],
    };
    rooms.set(id, room);
    return NextResponse.json({ roomId: id, hostToken: room.hostToken, guestToken: room.guestToken });
  }

  if (action === 'join') {
    const room = rooms.get(String(body?.roomId ?? ''));
    if (!room) return NextResponse.json({ error: 'room_not_found' }, { status: 404 });
    if (room.guestJoined) return NextResponse.json({ error: 'room_full' }, { status: 409 });
    room.guestJoined = true;
    room.state = 'live';
    room.lastActivity = Date.now();
    notifyWaiters(room);
    return NextResponse.json({ ok: true, guestToken: room.guestToken, state: room.state });
  }

  if (action === 'signal') {
    const room = rooms.get(String(body?.roomId ?? ''));
    if (!room) return NextResponse.json({ error: 'room_not_found' }, { status: 404 });
    const role = roleOf(room, String(body?.token ?? ''));
    if (!role) return NextResponse.json({ error: 'bad_token' }, { status: 403 });
    room.signals.push({ from: role, type: String(body?.type ?? ''), data: body?.data, at: Date.now() });
    if (room.signals.length > 200) room.signals.splice(0, 100);
    room.lastActivity = Date.now();
    notifyWaiters(room);
    return NextResponse.json({ ok: true, v: room.signals.length });
  }

  if (action === 'end') {
    const room = rooms.get(String(body?.roomId ?? ''));
    if (!room) return NextResponse.json({ error: 'room_not_found' }, { status: 404 });
    room.state = 'ended';
    room.lastActivity = Date.now();
    notifyWaiters(room);
    rooms.delete(room.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'unknown_action' }, { status: 400 });
}

async function handleGet(req: NextRequest) {
  cleanup();
  const url = new URL(req.url);
  const roomId = url.searchParams.get('roomId') ?? '';
  const token = url.searchParams.get('token') ?? '';
  const room = rooms.get(roomId);
  if (!room) return NextResponse.json({ error: 'room_not_found' }, { status: 404 });
  const role = roleOf(room, token);
  if (!role) return NextResponse.json({ error: 'bad_token' }, { status: 403 });

  const lastV = Number(url.searchParams.get('v') ?? 0);
  const peerSignals = room.signals.filter((s) => s.from !== role);

  // return immediately if there are unseen signals or state already changed
  if (peerSignals.length > lastV || room.waiters.length === 0) {
    if (peerSignals.length > lastV || room.state === 'ended' || room.guestJoined) {
      return NextResponse.json({
        v: room.signals.length,
        signals: peerSignals.slice(-20),
        state: room.state,
        guestJoined: room.guestJoined,
      });
    }
  }

  // long-poll: park until a signal/end/join arrives or timeout
  return new Promise<Response>((resolve) => {
    const w = {
      token: role,
      version: lastV,
      resolve: (payload: any) => resolve(NextResponse.json(payload)),
      timer: setTimeout(() => {
        room.waiters = room.waiters.filter((x) => x !== w);
        resolve(
          NextResponse.json({
            v: room.signals.length,
            signals: room.signals.filter((s) => s.from !== role).slice(-20),
            state: room.state,
            guestJoined: room.guestJoined,
            timeout: true,
          })
        );
      }, POLL_TIMEOUT_MS),
    };
    room.waiters.push(w);
  });
}

export async function POST(req: NextRequest) {
  try {
    return await handlePost(req);
  } catch (e) {
    return NextResponse.json({ error: 'room_api_failed', message: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    return await handleGet(req);
  } catch (e) {
    return NextResponse.json({ error: 'room_api_failed', message: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}
