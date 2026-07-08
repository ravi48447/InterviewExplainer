"use client";

import React, { useState, useEffect, useRef } from"react";
import { PanelGroup, Panel, PanelResizeHandle } from"react-resizable-panels";

interface ResizableLayoutProps {
 leftElement: React.ReactNode;
 rightElement: React.ReactNode;
 storageKey: string;
 defaultLeftPercent?: number; // defaults to 40
}

export function ResizableLayout({
 leftElement,
 rightElement,
 storageKey,
 defaultLeftPercent = 40,
}: ResizableLayoutProps) {
 const [isMounted, setIsMounted] = useState(false);
 const [leftSize, setLeftSize] = useState<number>(defaultLeftPercent);
 const containerRef = useRef<HTMLDivElement>(null);
 const [containerWidth, setContainerWidth] = useState<number>(0);

 // Load from localStorage on mount
 useEffect(() => {
 setIsMounted(true);
 try {
 const saved = localStorage.getItem(storageKey);
 if (saved) {
 const parsed = JSON.parse(saved);
 if (Array.isArray(parsed) && typeof parsed[0] ==="number") {
 setLeftSize(parsed[0]);
 }
 }
 } catch (e) {
 console.warn("Failed to load resizable layout state from localStorage:", e);
 }
 }, [storageKey]);

 // Set up ResizeObserver to enforce pixel-based min-size constraints
 useEffect(() => {
 if (!containerRef.current) return;
 const observer = new ResizeObserver((entries) => {
 for (const entry of entries) {
 setContainerWidth(entry.contentRect.width);
 }
 });
 observer.observe(containerRef.current);
 return () => observer.disconnect();
 }, []);

 const handleLayoutChange = (sizes: number[]) => {
 if (sizes && sizes.length > 0) {
 try {
 localStorage.setItem(storageKey, JSON.stringify(sizes));
 } catch (e) {
 console.warn("Failed to save layout sizes to localStorage:", e);
 }
 }
 };

 // Fallback rendering for SSR & initial hydration to prevent layout shifts
 if (!isMounted || containerWidth === 0) {
 return (
 <div className="flex w-full h-full min-h-[calc(100vh-56px)]">
 <div style={{ width: `${leftSize}%` }} className="shrink-0 overflow-y-auto border-r border-border">
 {leftElement}
 </div>
 <div className="flex-1 min-w-0 overflow-y-auto">
 {rightElement}
 </div>
 </div>
 );
 }

 // Calculate percentage constraints dynamically based on container pixel width
 // Left Panel min-width = 350px, Right Panel min-width = 450px
 const leftMinPercent = Math.max(30, Math.min(70, (350 / containerWidth) * 100));
 const rightMinPercent = Math.max(30, Math.min(70, (450 / containerWidth) * 100));
 const leftMaxPercent = 100 - rightMinPercent;

 return (
 <div ref={containerRef} className="w-full h-full min-h-[calc(100vh-56px)] flex">
 <PanelGroup direction="horizontal"onLayout={handleLayoutChange}>
 {/* Left Pane (Question) */}
 <Panel
 defaultSize={leftSize}
 minSize={leftMinPercent}
 maxSize={leftMaxPercent}
 className="flex flex-col overflow-y-auto bg-background"
 >
 {leftElement}
 </Panel>

 {/* Divider / Resize Handle */}
 <PanelResizeHandle className="group relative w-1.5 bg-border/40 hover:bg-blue-500 dark:bg-blue-800/10 active:bg-blue-500 dark:bg-blue-800/20 cursor-col-resize transition-colors z-20">
 {/* Visual highlight line */}
 <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-border/0 group-hover:bg-blue-500 dark:bg-blue-800 group-active:bg-blue-600 transition-colors" />
 </PanelResizeHandle>

 {/* Right Pane (Explanation & Code) */}
 <Panel
 className="flex flex-col overflow-y-auto bg-surface dark:bg-surface"
 >
 {rightElement}
 </Panel>
 </PanelGroup>
 </div>
 );
}
