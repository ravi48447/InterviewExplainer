'use client'

import { ReactNode, useState, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export function DSAProblemTwoPaneShell({
  leftPane,
  rightPane,
  jsonLd,
}: {
  leftPane: ReactNode;
  rightPane: ReactNode;
  jsonLd?: object;
}) {
  const [isDesktop, setIsDesktop] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Two-pane split — collapses to single column on mobile */}
      {!mounted || !isDesktop ? (
        <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-56px)]">
          {/* LEFT PANE — problem statement */}
          <div
            className={[
              // Desktop: fixed-width, scrollable independently
              "lg:w-[42%] lg:max-w-[580px] lg:shrink-0",
              "lg:overflow-y-auto lg:border-r lg:border-border",
              // Light background to distinguish from the right pane
              "bg-background",
              // Mobile: just a normal block
              "px-5 py-6 lg:px-7 lg:py-7",
            ].join(" ")}
          >
            {leftPane}
          </div>

          {/* RIGHT PANE — solution content */}
          <div
            className={[
              "flex-1 min-w-0",
              "lg:overflow-y-auto",
              // Contrast against left pane
              "bg-surface",
              "px-5 py-6 lg:px-8 lg:py-7",
            ].join(" ")}
          >
            {rightPane}
          </div>
        </div>
      ) : (
        <div className="h-[calc(100vh-56px)]">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
              defaultSize={42}
              minSize={25}
              maxSize={70}
              className="bg-background"
            >
              <div className="h-full overflow-y-auto custom-scrollbar px-5 py-6 lg:px-7 lg:py-7">
                {leftPane}
              </div>
            </ResizablePanel>
            <ResizableHandle
              withHandle
              className="w-1 hover:w-2 bg-border hover:bg-blue-500 dark:bg-blue-800/50 transition-all duration-150 ease-out z-10 cursor-col-resize"
            />
            <ResizablePanel
              defaultSize={58}
              minSize={30}
              className="bg-surface"
            >
              <div className="h-full overflow-y-auto custom-scrollbar px-5 py-6 lg:px-8 lg:py-7">
                {rightPane}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </div>
  );
}
