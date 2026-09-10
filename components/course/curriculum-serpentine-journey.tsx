"use client";

import React from "react";
import { AlertTriangle, Clock3, Flag, Flame, Gauge, Lightbulb, Milestone, Route, Target, Trophy } from "lucide-react";
import type { DomainCategory, TechStack } from "@/lib/api";
import { cn } from "@/lib/utils";
import { PillarCurveCard } from "@/components/course/pillar-curve-card";

export type CurriculumPillarRow = DomainCategory & { stacks: TechStack[] };

// Wide horizontal travel with shorter vertical drops creates a diagonal spiral
// that fits more stations into each viewport without turning into a tight snake.
const X_PATTERN = [250, 650, 790, 610, 285, 370, 690, 785, 560, 275, 350, 690] as const;
const GAP_PATTERN = [150, 156, 148, 164, 152, 160, 150, 158, 148, 162, 152, 158] as const;
const STAGES = [
  { label: "FOUNDATION", color: "#1e7af2" },
  { label: "BUILD", color: "#16a566" },
  { label: "INTERVIEW", color: "#ed7900" },
] as const;

type JourneyPoint = { x: number; y: number; stage: number };

function getStage(index: number, count: number) {
  if (count <= 1) return 0;
  return Math.min(2, Math.floor((index / count) * 3));
}

function buildPoints(count: number, expandedIndex: number): JourneyPoint[] {
  let y = 128;
  return Array.from({ length: count }, (_, index) => {
    if (index > 0) {
      y += GAP_PATTERN[(index - 1) % GAP_PATTERN.length];
      // Reserve a real drawer-sized lane below the selected station. This
      // keeps the road and later stations from sitting under the open panel.
      if (index - 1 === expandedIndex) y += 390;
    }
    return {
      x: X_PATTERN[index % X_PATTERN.length],
      y,
      stage: getStage(index, count),
    };
  });
}

function buildRoadPath(points: JourneyPoint[], height: number) {
  if (!points.length) return "";
  const first = points[0];
  let path = `M 0 58 C 92 58, ${first.x - 105} ${first.y - 40}, ${first.x} ${first.y}`;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const deltaY = current.y - previous.y;
    // Both Bézier handles share the station's vertical tangent. The incoming
    // and outgoing road therefore meet with the same direction instead of
    // forming a subtle cusp at every left/right reversal.
    const control1X = previous.x;
    const control1Y = previous.y + deltaY * 0.48;
    const control2X = current.x;
    const control2Y = current.y - deltaY * 0.48;
    path += ` C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${current.x} ${current.y}`;
  }
  const last = points[points.length - 1];
  return `${path} C ${last.x} ${last.y + 60}, ${Math.max(220, last.x - 130)} ${height - 70}, ${Math.max(220, last.x - 130)} ${height - 20}`;
}

const ROADSIDE_COPY = [
  { Icon: Route, eyebrow: "Learning route", text: "Build the foundation before adding framework depth." },
  { Icon: Lightbulb, eyebrow: "Design lens", text: "Connect implementation choices to real system trade-offs." },
  { Icon: Milestone, eyebrow: "Practice checkpoint", text: "Explain the decision, then prove it with a question." },
  { Icon: Flag, eyebrow: "Interview signal", text: "Finish by turning technical depth into a clear answer." },
] as const;

function RoadsideMarker({ point, index, category }: { point: JourneyPoint; index: number; category: DomainCategory }) {
  const note = ROADSIDE_COPY[Math.min(ROADSIDE_COPY.length - 1, Math.floor((index / Math.max(1, 11)) * ROADSIDE_COPY.length))];
  const Icon = note.Icon;
  const putLeft = point.x > 500;
  return (
    <aside
      className="pointer-events-none absolute z-[3] hidden w-[158px] rounded-[12px] border border-[#d8e3ef] bg-white/80 p-3 shadow-[0_14px_32px_-28px_rgba(15,35,70,.65)] backdrop-blur-[3px] lg:block xl:w-[190px]"
      style={{ top: point.y + 68, ...(putLeft ? { left: "3.5%" } : { right: "3.5%" }) }}
      aria-hidden
    >
      <div className="flex items-start gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]" style={{ color: STAGES[point.stage].color, backgroundColor: `${STAGES[point.stage].color}12` }}>
          <Icon className="h-4 w-4" strokeWidth={1.8} />
        </span>
        <span>
          <span className="block text-[9px] font-bold uppercase tracking-[0.13em]" style={{ color: STAGES[point.stage].color }}>{note.eyebrow}</span>
          <span className="mt-1 block text-[10px] font-semibold leading-4 text-[#294362]">{category.name}</span>
          <span className="mt-1 block text-[9px] leading-[14px] text-[#71839b]">{note.text}</span>
        </span>
      </div>
    </aside>
  );
}

function RoadMap({ points, height }: { points: JourneyPoint[]; height: number }) {
  const path = buildRoadPath(points, height);
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      viewBox={`0 0 1000 ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <filter id="road-shadow" x="-30%" y="-10%" width="160%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#0f2346" floodOpacity="0.14" />
        </filter>
        <linearGradient id="road-surface" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#78aff6" />
          <stop offset="0.42" stopColor="#58b985" />
          <stop offset="0.72" stopColor="#64b77c" />
          <stop offset="1" stopColor="#f09a49" />
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke="#ffffff" strokeWidth="52" strokeLinecap="round" strokeLinejoin="round" filter="url(#road-shadow)" opacity=".94" />
      <path d={path} fill="none" stroke="url(#road-surface)" strokeWidth="39" strokeLinecap="round" strokeLinejoin="round" opacity=".28" />
      <path d={path} fill="none" stroke="url(#road-surface)" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round" opacity=".96" />
      <path d={path} fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="10 15" strokeLinecap="round" opacity="0.9" />
      {points.map((point, index) => (
        <g key={`${point.x}-${point.y}`}>
          <circle cx={point.x} cy={point.y} r="9" fill="#fff" stroke={STAGES[point.stage].color} strokeWidth="4" />
          <circle cx={point.x} cy={point.y} r="2.8" fill={STAGES[point.stage].color} />
          {index === 0 ? <circle cx={point.x} cy={point.y} r="15" fill="none" stroke="#e87500" strokeWidth="2.5" opacity="0.5" /> : null}
        </g>
      ))}
    </svg>
  );
}

function StageWash({ stage, top, height }: { stage: number; top: number; height: number }) {
  const washes = [
    { base: "#eaf3ff", deep: "#d6e8ff", line: "#82b5f5" },
    { base: "#e8f8ed", deep: "#d3f0dc", line: "#72c590" },
    { base: "#fff0df", deep: "#ffe1c2", line: "#f3a15a" },
  ];
  const wash = washes[stage];
  return (
    <div
      className="pointer-events-none absolute -left-[5%] -right-[5%] overflow-hidden"
      style={{
        top: top - 28,
        height: height + 56,
        background: `radial-gradient(ellipse at 76% 22%, ${wash.deep} 0%, transparent 43%), linear-gradient(112deg, ${wash.base} 0%, ${wash.base}e8 48%, #fffdf9c9 100%)`,
        clipPath: stage === 0
          ? "polygon(0 1%,100% 0,100% 91%,84% 95%,66% 92%,48% 98%,27% 93%,0 97%)"
          : stage === 1
            ? "polygon(0 5%,22% 1%,45% 6%,66% 2%,85% 7%,100% 3%,100% 94%,79% 98%,61% 93%,39% 99%,18% 94%,0 98%)"
            : "polygon(0 5%,18% 1%,38% 6%,60% 2%,81% 7%,100% 3%,100% 100%,0 100%)",
      }}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:38px_38px]" />
      <div className="absolute -right-[8%] top-[14%] h-[58%] w-[48%] rounded-[50%] border" style={{ borderColor: `${wash.line}38` }} />
      <div className="absolute -right-[3%] top-[22%] h-[42%] w-[38%] rounded-[50%] border border-dashed" style={{ borderColor: `${wash.line}50` }} />
      <div className="absolute bottom-[7%] left-[8%] h-px w-[30%]" style={{ background: `linear-gradient(90deg,transparent,${wash.line}70,transparent)` }} />
      <div className="absolute left-[7%] top-8 max-w-[150px]">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/68 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] shadow-sm backdrop-blur-sm" style={{ color: STAGES[stage].color }}>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STAGES[stage].color, boxShadow: `0 0 0 4px ${STAGES[stage].color}16` }} />
          {STAGES[stage].label}
        </div>
        <div className="ml-4 mt-2 h-8 w-px opacity-45" style={{ backgroundColor: STAGES[stage].color }} />
      </div>
    </div>
  );
}

function PathCompass({ count }: { count: number }) {
  const phases = [
    { label: "Prerequisites", detail: "Programming basics", color: "#1e7af2" },
    { label: "Foundation", detail: "Build strong fundamentals", color: "#1e7af2" },
    { label: "Build", detail: "Apply concepts to systems", color: "#16a566" },
    { label: "Interview", detail: "Explain every decision", color: "#ed7900" },
  ];
  return <aside className="sticky top-24 hidden self-start rounded-[16px] border border-[#cfdae7] bg-white/82 px-4 py-5 shadow-[0_18px_45px_-38px_rgba(15,35,70,.7)] backdrop-blur-md xl:block">
    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f2346]">Path compass</div>
    <div className="relative mt-5 space-y-7 before:absolute before:bottom-3 before:left-[7px] before:top-3 before:w-px before:bg-[#cbd8e7]">
      {phases.map((phase, index) => <div key={phase.label} className="relative pl-7"><span className="absolute left-0 top-1 h-[15px] w-[15px] rounded-full border-[4px] border-white shadow-sm" style={{ backgroundColor: phase.color }} /><div className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: phase.color }}>{index === 1 ? "You are here" : `0${index + 1}`}</div><div className="mt-1 text-[12px] font-semibold text-[#173250]">{phase.label}</div><div className="mt-1 text-[9px] leading-4 text-[#71839b]">{phase.detail}</div>{index > 0 ? <div className="mt-1 text-[8px] text-[#8b9aae]">0 / {Math.max(1, Math.round(count / 3))} pillars</div> : null}</div>)}
    </div>
    <div className="mt-8 border-t border-[#dce5ee] pt-4"><Trophy className="h-5 w-5 text-[#0f2346]" /><div className="mt-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#60738f]">Target role</div><div className="mt-1 text-[11px] font-semibold text-[#173250]">Backend engineer</div><div className="text-[9px] text-[#71839b]">Interview ready</div></div>
  </aside>;
}

function LearningPulse({ questions, activeName }: { questions: number; activeName: string }) {
  return <aside className="sticky top-24 hidden self-start rounded-[16px] border border-[#cfdae7] bg-white/82 px-5 py-5 shadow-[0_18px_45px_-38px_rgba(15,35,70,.7)] backdrop-blur-md xl:block">
    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f2346]"><Gauge className="h-4 w-4 text-[#1e7af2]" /> Learning pulse</div>
    <div className="mt-5 flex items-center gap-3"><div className="relative flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "conic-gradient(#1e7af2 0 35%,#dce7f3 35% 100%)" }}><div className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-white text-xl font-semibold text-[#0f2346]">35%</div></div><div><div className="text-[9px] text-[#71839b]">Questions solved</div><div className="mt-1 text-[12px] font-semibold text-[#173250]">{Math.round(questions * .35)} / {questions}</div></div></div>
    <div className="mt-5 divide-y divide-[#dce5ee] border-y border-[#dce5ee]">
      <div className="flex gap-3 py-4"><Flame className="h-4 w-4 text-[#ed7900]" /><div><div className="text-[9px] font-bold text-[#173250]">Current streak</div><div className="mt-1 text-sm font-semibold">7 days</div></div></div>
      <div className="flex gap-3 py-4"><Flag className="h-4 w-4 text-[#ed7900]" /><div><div className="text-[9px] font-bold text-[#173250]">Next milestone</div><div className="mt-1 text-[10px] font-semibold leading-4">{activeName}</div><div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#dfe8f2]"><div className="h-full w-[35%] rounded-full bg-[#1e7af2]" /></div></div></div>
      <div className="flex gap-3 py-4"><AlertTriangle className="h-4 w-4 text-[#ed7900]" /><div><div className="text-[9px] font-bold text-[#173250]">Weak area</div><div className="mt-1 text-[10px] font-semibold">Complexity analysis</div><div className="text-[9px] text-[#ed7900]">Review suggested</div></div></div>
      <div className="flex gap-3 py-4"><Clock3 className="h-4 w-4 text-[#173250]" /><div><div className="text-[9px] font-bold text-[#173250]">Estimated pace</div><div className="mt-1 text-[10px] font-semibold">~10–12 hours / week</div><div className="mt-3 flex h-10 items-end gap-1">{[45,70,58,82,66,42,28].map((h,i)=><span key={i} className="w-2 rounded-t bg-[#1e7af2]" style={{height:`${h}%`,opacity:.35+i*.07}} />)}</div></div></div>
    </div>
  </aside>;
}

function TechnicalBackdrop({ height }: { height: number }) {
  const blocks = [
    { top: 120, left: "3%", type: "code" },
    { top: 390, right: "3%", type: "service" },
    { top: 720, left: "4%", type: "data" },
    { top: 1040, right: "4%", type: "code" },
    { top: 1370, left: "3%", type: "pipeline" },
    { top: 1690, right: "3%", type: "data" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden font-mono text-[#3974ad]/[0.27]" aria-hidden>
      {blocks.filter((block) => block.top < height - 120).map((block, index) => (
        <div key={`${block.type}-${block.top}`} className="absolute w-[190px] xl:w-[225px]" style={{ top: block.top, left: block.left, right: block.right }}>
          {block.type === "code" ? (
            <div className="space-y-1 text-[9px] leading-4">
              <div>interface Service&lt;T&gt; {'{'}</div>
              <div className="pl-3">findById(id: string): T;</div>
              <div className="pl-3">save(entity: T): Promise&lt;T&gt;;</div>
              <div>{'}'}</div>
              <div className="mt-2 h-px w-full bg-[#3974ad]/20" />
            </div>
          ) : null}
          {block.type === "service" ? (
            <div>
              <div className="mb-3 text-[8px] font-bold uppercase tracking-[0.16em]">Request flow</div>
              <div className="flex items-center justify-between gap-1 text-[8px]">
                {['API', 'Service', 'Queue'].map((label, itemIndex) => (
                  <React.Fragment key={label}>
                    <span className="rounded border border-[#3974ad]/25 bg-white/30 px-2 py-1.5">{label}</span>
                    {itemIndex < 2 ? <span className="h-px flex-1 bg-[#3974ad]/25" /> : null}
                  </React.Fragment>
                ))}
              </div>
              <div className="mx-auto h-6 w-px bg-[#3974ad]/25" /><div className="mx-auto w-fit rounded-full border border-[#3974ad]/25 px-3 py-1 text-[8px]">EVENT</div>
            </div>
          ) : null}
          {block.type === "data" ? (
            <div>
              <div className="mb-3 text-[8px] font-bold uppercase tracking-[0.16em]">Data layer</div>
              <div className="grid grid-cols-3 items-center gap-2 text-center text-[8px]">
                <span className="rounded border border-[#3974ad]/25 bg-white/30 px-1 py-2">CACHE</span>
                <span className="rounded-full border border-[#3974ad]/25 bg-white/30 px-1 py-3">DB</span>
                <span className="rounded border border-[#3974ad]/25 bg-white/30 px-1 py-2">INDEX</span>
              </div>
              <div className="mt-2 border-t border-dashed border-[#3974ad]/25" />
            </div>
          ) : null}
          {block.type === "pipeline" ? (
            <div>
              <div className="mb-3 text-[8px] font-bold uppercase tracking-[0.16em]">Delivery pipeline</div>
              <div className="flex items-center gap-1 text-[8px]">
                {['BUILD', 'TEST', 'SHIP'].map((label, itemIndex) => (
                  <React.Fragment key={label}>
                    <span className="rounded border border-[#3974ad]/25 bg-white/30 px-2 py-1.5">{label}</span>
                    {itemIndex < 2 ? <span>→</span> : null}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : null}
          <div className="absolute -inset-5 rounded-full border border-[#3974ad]/[0.08]" />
          <div className="absolute -inset-10 rounded-full border border-[#3974ad]/[0.05]" />
        </div>
      ))}
    </div>
  );
}

export function CurriculumSerpentineJourney({
  categories,
  pillarRows,
  domainSlug,
  expandedPillarIds,
  onTogglePillar,
  filterActive,
}: {
  categories: DomainCategory[];
  pillarRows: CurriculumPillarRow[];
  domainSlug: string;
  expandedPillarIds: Set<number>;
  onTogglePillar: (id: number) => void;
  filterActive: boolean;
}) {
  const expandedIndex = categories.findIndex((category) => expandedPillarIds.has(category.id));
  const points = buildPoints(categories.length, expandedIndex);
  const height = Math.max(850, (points.at(-1)?.y ?? 600) + 190);
  const stageRanges = STAGES.map((_, stage) => {
    const stagePoints = points.filter((point) => point.stage === stage);
    if (!stagePoints.length) return null;
    const top = Math.max(0, stagePoints[0].y - 130);
    const bottom = Math.min(height, stagePoints[stagePoints.length - 1].y + 145);
    return { stage, top, height: bottom - top };
  }).filter(Boolean) as Array<{ stage: number; top: number; height: number }>;

  return (
    <div className="relative">
      <div className="space-y-5 lg:hidden">
        {categories.map((cat, index) => {
          const stacks = pillarRows.find((pillar) => pillar.id === cat.id)?.stacks ?? [];
          return (
            <div key={cat.id} className="relative pl-5">
              <div className="absolute bottom-[-22px] left-[7px] top-10 w-0.5 bg-gradient-to-b from-blue-300 to-blue-100" aria-hidden />
              <PillarCurveCard
                cat={cat}
                index={index}
                side="right"
                domainSlug={domainSlug}
                stacks={stacks}
                expanded={expandedPillarIds.has(cat.id)}
                disabled={!stacks.length && filterActive}
                filterActive={filterActive}
                onToggle={() => onTogglePillar(cat.id)}
                variant="premium"
              />
            </div>
          );
        })}
      </div>

      <div className="hidden gap-3 lg:grid xl:grid-cols-[170px_minmax(0,1fr)_190px]">
        <PathCompass count={categories.length} />
      <div className="relative min-w-0 overflow-hidden rounded-[18px] border border-[#c9d6e4] bg-[#fbfcfe] shadow-[inset_0_1px_0_rgba(255,255,255,.9)]" style={{ height }}>
        <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(#c8d7e6_1px,transparent_1px),linear-gradient(90deg,#c8d7e6_1px,transparent_1px)] [background-size:44px_44px]" aria-hidden />
        {stageRanges.map((range) => <StageWash key={range.stage} {...range} />)}
        <TechnicalBackdrop height={height} />
        <RoadMap points={points} height={height} />

        {categories.map((category, index) =>
          index % 3 === 1 ? <RoadsideMarker key={`marker-${category.id}`} point={points[index]} index={index} category={category} /> : null,
        )}

        {categories.map((cat, index) => {
          const point = points[index];
          const stacks = pillarRows.find((pillar) => pillar.id === cat.id)?.stacks ?? [];
          const placeRight = point.x < 500;
          const expanded = expandedPillarIds.has(cat.id);
          return (
            <div
              key={cat.id}
              className={cn("absolute z-10 transition-[top,left,right,width] duration-300 ease-out motion-reduce:transition-none", expanded ? "w-[58%] max-w-[620px]" : "w-[27%] max-w-[270px]")}
              style={{
                top: point.y - 64,
                ...(expanded
                  ? { left: "20%" }
                  : placeRight
                    ? { left: `${point.x / 10 + 5.5}%` }
                    : { right: `${(1000 - point.x) / 10 + 5.5}%` }),
              }}
            >
              <span
                className="pointer-events-none absolute top-[55px] h-px w-12 border-t-2 border-dashed opacity-60"
                style={{
                  borderColor: STAGES[point.stage].color,
                  ...(placeRight ? { left: -48 } : { right: -48 }),
                }}
                aria-hidden
              />
              <PillarCurveCard
                cat={cat}
                index={index}
                side={placeRight ? "right" : "left"}
                domainSlug={domainSlug}
                stacks={stacks}
                expanded={expanded}
                disabled={!stacks.length && filterActive}
                filterActive={filterActive}
                onToggle={() => onTogglePillar(cat.id)}
                variant="premium"
              />
            </div>
          );
        })}

        <div className="pointer-events-none absolute bottom-6 right-6 rounded-full border border-blue-200 bg-white/90 px-3 py-2 text-[10px] font-semibold text-[#60738f] shadow-sm" aria-hidden>
          Hover for preview · Click to keep modules open
        </div>
      </div>
        <LearningPulse questions={pillarRows.reduce((sum, pillar) => sum + pillar.stacks.reduce((stackSum, stack) => stackSum + stack.questionCount, 0), 0)} activeName={categories[Math.max(0, expandedIndex)]?.name ?? categories[0]?.name ?? "Next pillar"} />
      </div>
    </div>
  );
}
