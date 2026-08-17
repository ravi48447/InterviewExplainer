"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import {
  ArrowRight, BarChart3, BookOpen, Boxes, BriefcaseBusiness, Check,
  CircleHelp, Cloud, Code2, Compass, Database, GitCompareArrows,
  Layers3, MonitorPlay, Network, RefreshCw, Search, Server, Sparkles, Target,
  TimerReset, UserRound, Workflow,
} from "lucide-react";
import { TechIcon } from "@/components/tech-icon";
import type { ContentDomain } from "@/lib/types/content-domain";
import { cn } from "@/lib/utils";

const INK = "#0f2346";
const BLUE = "#1e7af2";
const TEAL = "#159a8c";
const ORANGE = "#e87500";

const TRACK_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  backend: Server,
  fullstack: Boxes,
  frontend: MonitorPlay,
  cicd: Workflow,
  cloud: Cloud,
  infrastructure: Network,
  sre: Target,
  "data-engineering": Database,
  "ml-ai": Sparkles,
  "sql-analytics": BarChart3,
  analysis: BarChart3,
};

const TRACK_COPY: Record<string, string> = {
  backend: "Build APIs, services and server-side systems.",
  fullstack: "Build complete products across front and back.",
  frontend: "Build accessible, performant user interfaces.",
  cicd: "Automate delivery, testing and deployments.",
  cloud: "Design and operate resilient cloud systems.",
  infrastructure: "Build reliable platforms and foundations.",
  sre: "Run production systems with confidence.",
  "data-engineering": "Build dependable data pipelines and platforms.",
  "ml-ai": "Prepare models, systems and applied AI workflows.",
  "sql-analytics": "Turn data into decisions with SQL and analysis.",
};

type Experience = "beginner" | "intermediate";

export default function DomainsPage() {
  const [domains, setDomains] = useState<ContentDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("java");
  const [track, setTrack] = useState("backend");
  const [level, setLevel] = useState<Experience>("intermediate");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch("/api/content/all-domains", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load interview paths.");
        return response.json() as Promise<ContentDomain[]>;
      })
      .then((items) => {
        setDomains(items.filter((item) => item.hasContent));
        const preferred = items.find((item) => item.slug === "java-backend-intermediate" && item.hasContent)
          ?? items.find((item) => item.hasContent);
        if (preferred) {
          setLanguage(preferred.languageSlug);
          setTrack(preferred.trackSlug);
          setLevel(preferred.level);
        }
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Unable to load interview paths.");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const technologies = useMemo(() => {
    const bySlug = new Map<string, ContentDomain>();
    domains.forEach((item) => {
      const current = bySlug.get(item.languageSlug);
      if (!current || item.questionCount > current.questionCount) bySlug.set(item.languageSlug, item);
    });
    return [...bySlug.values()].sort((a, b) => a.language.localeCompare(b.language));
  }, [domains]);

  const visibleTechnologies = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return technologies;
    return technologies.filter((item) => item.language.toLowerCase().includes(term));
  }, [technologies, query]);

  const roles = useMemo(() => {
    const bySlug = new Map<string, ContentDomain>();
    domains.filter((item) => item.languageSlug === language).forEach((item) => {
      const current = bySlug.get(item.trackSlug);
      if (!current || item.questionCount > current.questionCount) bySlug.set(item.trackSlug, item);
    });
    return [...bySlug.values()].sort((a, b) => b.questionCount - a.questionCount);
  }, [domains, language]);

  useEffect(() => {
    if (roles.length && !roles.some((item) => item.trackSlug === track)) setTrack(roles[0].trackSlug);
  }, [roles, track]);

  const availableLevels = useMemo(() => domains
    .filter((item) => item.languageSlug === language && item.trackSlug === track)
    .map((item) => item.level), [domains, language, track]);

  useEffect(() => {
    if (availableLevels.length && !availableLevels.includes(level)) setLevel(availableLevels[0]);
  }, [availableLevels, level]);

  const selected = useMemo(() => domains.find((item) =>
    item.languageSlug === language && item.trackSlug === track && item.level === level,
  ) ?? roles.find((item) => item.trackSlug === track) ?? domains[0], [domains, language, track, level, roles]);

  const configurationCount = domains.length;
  const chosenTechnology = technologies.find((item) => item.languageSlug === language);

  return (
    <main className="domains-configurator min-h-screen overflow-x-clip bg-[#f7f9fc] text-[#0f2346]">
      <style>{`
        .domains-configurator .text-\\[5px\\] { font-size: 7px; }
        .domains-configurator .text-\\[6px\\] { font-size: 8px; }
        .domains-configurator .text-\\[7px\\] { font-size: 9px; }
        .domains-configurator .text-\\[8px\\] { font-size: 10px; }
        .domains-configurator .text-\\[9px\\] { font-size: 11px; }
      `}</style>
      <Hero configurationCount={configurationCount} />

      <section className="mx-auto max-w-[1536px] px-3 pb-3 sm:px-5">
        {error ? (
          <div className="rounded-[15px] border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">{error}</div>
        ) : (
          <div className="grid items-stretch gap-3 xl:grid-cols-[minmax(0,1.22fr)_minmax(540px,.95fr)]">
            <Configurator
              loading={loading}
              technologies={visibleTechnologies}
              totalTechnologies={technologies.length}
              roles={roles}
              language={language}
              track={track}
              level={level}
              query={query}
              availableLevels={availableLevels}
              onLanguage={setLanguage}
              onTrack={setTrack}
              onLevel={setLevel}
              onQuery={setQuery}
              selected={selected}
              chosenTechnology={chosenTechnology}
            />
            <PlanPreview selected={selected} loading={loading} />
          </div>
        )}
      </section>

      <LearningLoop />
    </main>
  );
}

function Hero({ configurationCount }: { configurationCount: number }) {
  return (
    <section className="relative border-b border-[#d7e1ee] bg-white">
      <BlueprintBackdrop />
      <div className="relative mx-auto grid max-w-[1536px] gap-5 px-5 py-5 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:py-6">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[.15em] text-[#1268db]">
            {configurationCount || "Real"} path configurations · one focused plan
          </div>
          <h1 className="mt-2 text-[clamp(1.75rem,2.7vw,2.55rem)] font-semibold leading-[1.12] tracking-[-.035em]">
            Build the path your interview actually requires.
          </h1>
          <p className="mt-2 max-w-[650px] text-[12px] leading-5 text-[#526b8a] sm:text-[13px]">
            Choose your stack, role and experience. We’ll assemble the concepts, practice and interview rounds in the right order.
          </p>
        </div>
        <PlanCompilerVisual />
      </div>
    </section>
  );
}

function BlueprintBackdrop() {
  return <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
    <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(#e9eff7_1px,transparent_1px),linear-gradient(90deg,#e9eff7_1px,transparent_1px)] [background-size:38px_38px] [mask-image:linear-gradient(90deg,transparent,black_45%,black)]" />
    <div className="absolute right-[3%] top-4 font-mono text-[9px] leading-4 text-[#c5d3e5]">public class Service &#123;<br />&nbsp;&nbsp;start(interviewPlan);<br />&#125;</div>
  </div>;
}

function PlanCompilerVisual() {
  const rows = [
    [Code2, "Technology", BLUE, "top-[4px]"],
    [UserRound, "Role", TEAL, "top-[51px]"],
    [BarChart3, "Experience", ORANGE, "top-[98px]"],
  ] as const;
  return <div className="relative mx-auto hidden h-[150px] w-full max-w-[650px] md:block" aria-hidden>
    {rows.map(([Icon, label, color, top], index) => <div key={label} className={cn("absolute left-[7%] flex h-10 w-[170px] items-center gap-3 rounded-[9px] border bg-white px-3 shadow-[0_10px_24px_-18px_rgba(15,35,70,.7)]", top)} style={{borderColor:color}}><span className="flex h-7 w-7 items-center justify-center rounded-[7px] text-white" style={{backgroundColor:color}}><Icon className="h-4 w-4" /></span><span className="text-[10px] font-semibold">{label}</span><span className="ml-auto h-2 w-2 rounded-full" style={{backgroundColor:color}} /></div>)}
    <svg viewBox="0 0 650 150" className="absolute inset-0 h-full w-full"><path d="M215 24 H285 Q305 24 305 48 V74" fill="none" stroke={BLUE} strokeWidth="2" strokeDasharray="5 5"/><path d="M215 71 H305" fill="none" stroke={TEAL} strokeWidth="2" strokeDasharray="5 5"/><path d="M215 118 H285 Q305 118 305 94 V74" fill="none" stroke={ORANGE} strokeWidth="2" strokeDasharray="5 5"/><path d="M326 74 H372" fill="none" stroke={BLUE} strokeWidth="2"/><circle cx="315" cy="74" r="17" fill="white" stroke="#b8d5ff"/><circle cx="315" cy="74" r="10" fill={BLUE}/><path d="m311 74 3 3 6-7" fill="none" stroke="white" strokeWidth="2"/></svg>
    <div className="absolute right-[6%] top-[15px] h-[118px] w-[220px] rounded-[13px] border border-[#a9ccff] bg-white p-4 shadow-[0_18px_38px_-25px_rgba(30,122,242,.75)]"><div className="flex items-center gap-2 text-[10px] font-semibold"><Target className="h-4 w-4 text-[#1e7af2]" /> Your study plan</div><div className="mt-2 text-[9px] text-[#60738f]">Roadmap preview</div><div className="relative mt-5 h-5"><div className="absolute left-1 right-1 top-2 h-px bg-[#a8c9f5]" />{[BLUE,BLUE,TEAL,ORANGE,TEAL,"#24a45d"].map((color,index)=><span key={index} className="absolute top-[4px] h-2.5 w-2.5 rounded-full border-2 border-white" style={{left:`${index*18+3}%`,backgroundColor:color}} />)}</div></div>
  </div>;
}

function Configurator(props: {
  loading: boolean;
  technologies: ContentDomain[];
  totalTechnologies: number;
  roles: ContentDomain[];
  language: string;
  track: string;
  level: Experience;
  query: string;
  availableLevels: Experience[];
  onLanguage: (value: string) => void;
  onTrack: (value: string) => void;
  onLevel: (value: Experience) => void;
  onQuery: (value: string) => void;
  selected?: ContentDomain;
  chosenTechnology?: ContentDomain;
}) {
  const { loading, technologies, totalTechnologies, roles, language, track, level, query, availableLevels, onLanguage, onTrack, onLevel, onQuery, selected, chosenTechnology } = props;
  return <div className="overflow-hidden rounded-[15px] border border-[#cddced] bg-white shadow-[0_18px_45px_-38px_rgba(15,35,70,.7)]">
    <div className="grid min-h-[515px] md:grid-cols-[1.08fr_.78fr_.88fr]">
      <SelectionLane number="1" title="Technology" subtitle="Choose the stack you want to master." tone="blue">
        <label className="relative block"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#71839b]"/><input value={query} onChange={(event)=>onQuery(event.target.value)} placeholder="Find technology" className="h-9 w-full rounded-[9px] border border-[#cad8e8] bg-white pl-9 pr-3 text-[10px] outline-none focus:border-[#1e7af2] focus:ring-4 focus:ring-blue-100" /></label>
        {chosenTechnology && <TechnologyChoice domain={chosenTechnology} selected large onClick={()=>onLanguage(chosenTechnology.languageSlug)} />}
        <div className="grid grid-cols-3 gap-2">
          {loading ? Array.from({length:9}).map((_,i)=><div key={i} className="h-[66px] animate-pulse rounded-[9px] bg-blue-100/70" />) : technologies.filter((item)=>item.languageSlug!==language).slice(0,11).map((item)=><TechnologyChoice key={item.languageSlug} domain={item} selected={false} onClick={()=>onLanguage(item.languageSlug)} />)}
        </div>
        {!loading && technologies.length===0 && <div className="rounded-[9px] border border-dashed p-5 text-center text-[10px] text-[#60738f]">No technology matches “{query}”.</div>}
      </SelectionLane>

      <SelectionLane number="2" title="Role" subtitle={`Compatible roles for ${chosenTechnology?.language ?? "your technology"}.`} tone="teal">
        <div className="space-y-2.5">
          {roles.map((item)=><RoleChoice key={item.trackSlug} domain={item} selected={track===item.trackSlug} onClick={()=>onTrack(item.trackSlug)} />)}
        </div>
      </SelectionLane>

      <SelectionLane number="3" title="Experience" subtitle="Tell us your current experience level." tone="orange">
        <ExperienceChoice title="Fresher / Beginner" range="0–2 yrs" detail="Stronger focus on fundamentals, examples and interview basics." selected={level==="beginner"} disabled={!availableLevels.includes("beginner")} onClick={()=>onLevel("beginner")} />
        <ExperienceChoice title="Intermediate" range="2–5 yrs" detail="Balanced concept depth with production and system-design focus." selected={level==="intermediate"} disabled={!availableLevels.includes("intermediate")} onClick={()=>onLevel("intermediate")} />
      </SelectionLane>
    </div>

    <AssemblyRail selected={selected} />
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#dbe5f0] bg-[#fbfdff] px-4 py-3 text-[8px] text-[#5f7390]">
      <span className="flex items-center gap-2"><Database className="h-3.5 w-3.5 text-[#1e7af2]" /> Available combinations update automatically from real curriculum content.</span>
      <span className="ml-auto flex items-center gap-2"><Boxes className="h-3.5 w-3.5" /> Browse all configurations</span>
      <span className="flex items-center gap-2"><GitCompareArrows className="h-3.5 w-3.5" /> Compare two plans</span>
      <span className="flex items-center gap-2"><TimerReset className="h-3.5 w-3.5" /> Take 2-minute diagnostic</span>
      <span className="font-semibold text-[#1e7af2]">{totalTechnologies} technologies</span>
    </div>
  </div>;
}

function SelectionLane({ number, title, subtitle, tone, children }: { number:string; title:string; subtitle:string; tone:"blue"|"teal"|"orange"; children:React.ReactNode }) {
  const color = tone === "blue" ? BLUE : tone === "teal" ? TEAL : ORANGE;
  const background = tone === "blue" ? "bg-[linear-gradient(145deg,#f7fbff,#edf5ff88)]" : tone === "teal" ? "bg-[linear-gradient(145deg,#fbffff,#effaf888)]" : "bg-[linear-gradient(145deg,#fffdfb,#fff5e988)]";
  return <div className={cn("relative border-b border-[#dbe5f0] p-4 md:border-b-0 md:border-r last:border-r-0", background)}><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm" style={{backgroundColor:color}}>{number}</span><h2 className="text-[11px] font-semibold uppercase tracking-[.04em]">{title}</h2><CircleHelp className="h-3.5 w-3.5 text-[#557baa]" /></div><p className="mb-3 mt-2 text-[9px] leading-4 text-[#58708e]">{subtitle}</p><div className="space-y-2.5">{children}</div></div>;
}

function TechnologyChoice({domain, selected, large=false, onClick}:{domain:ContentDomain;selected:boolean;large?:boolean;onClick:()=>void}) {
  return <button onClick={onClick} className={cn("group relative flex w-full items-center rounded-[9px] border bg-white text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md",large?"h-[76px] gap-3 px-4":"h-[66px] flex-col justify-center gap-1 p-2 text-center",selected?"border-[#1e7af2] shadow-[0_12px_26px_-20px_rgba(30,122,242,.9)]":"border-[#d4dfec]")}><TechIcon name={domain.languageSlug} className={large?"h-10 w-10":"h-7 w-7"}/><span className={large?"min-w-0":"min-w-0 max-w-full"}><strong className={cn("block truncate",large?"text-[13px]":"text-[8px]")}>{domain.language}</strong>{large&&<span className="mt-1 block text-[8px] text-[#60738f]">Interview-ready ecosystem</span>}</span>{selected&&<span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#1e7af2] text-white"><Check className="h-3 w-3"/></span>}</button>;
}

function RoleChoice({domain,selected,onClick}:{domain:ContentDomain;selected:boolean;onClick:()=>void}) { const Icon=TRACK_ICONS[domain.trackSlug]??BriefcaseBusiness; return <button onClick={onClick} className={cn("relative flex min-h-[96px] w-full items-center gap-3 rounded-[10px] border bg-white p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md",selected?"border-[#159a8c] shadow-[0_14px_28px_-24px_rgba(21,154,140,.9)]":"border-[#d4dfec]")}><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[9px] bg-[linear-gradient(145deg,#eefbfa,#d9f3ef)] text-[#159a8c]"><Icon className="h-6 w-6"/></span><span className="min-w-0"><strong className={cn("block text-[11px]",selected&&"text-[#0d8277]")}>{domain.track}</strong><span className="mt-1 block text-[8px] leading-4 text-[#60738f]">{TRACK_COPY[domain.trackSlug]??"Follow a role-specific interview curriculum."}</span></span><span className={cn("absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border",selected?"border-[#159a8c] bg-[#159a8c] text-white":"border-[#b8c8d9]")}>{selected&&<Check className="h-3 w-3"/>}</span></button> }

function ExperienceChoice({title,range,detail,selected,disabled,onClick}:{title:string;range:string;detail:string;selected:boolean;disabled:boolean;onClick:()=>void}) { return <button disabled={disabled} onClick={onClick} className={cn("relative min-h-[142px] w-full rounded-[11px] border bg-white p-4 text-left transition",selected?"border-[#e87500] shadow-[0_14px_28px_-24px_rgba(232,117,0,.9)]":"border-[#efd4b9]",disabled&&"cursor-not-allowed opacity-40")}><span className={cn("absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border",selected?"border-[#e87500] bg-[#e87500] text-white":"border-[#b8c8d9]")}>{selected&&<Check className="h-3 w-3"/>}</span><span className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff3e8] text-[#e87500]"><BarChart3 className="h-5 w-5"/></span><span><strong className={cn("block text-[11px]",selected&&"text-[#d86200]")}>{title}</strong><span className="text-[9px] text-[#496889]">{range}</span></span></span><span className="mt-3 block text-[9px] leading-4 text-[#526b8a]">{detail}</span></button> }

function AssemblyRail({selected}:{selected?:ContentDomain}) { return <div className="relative flex flex-wrap items-center justify-center gap-2 border-t border-[#dbe5f0] bg-white px-4 py-3 sm:gap-3"><AssemblyToken icon={<TechIcon name={selected?.languageSlug??"java"} className="h-6 w-6"/>} title={selected?.language??"Technology"} detail="Technology" color={BLUE}/><span className="text-lg text-[#56708d]">+</span><AssemblyToken icon={<Server className="h-5 w-5"/>} title={selected?.track??"Role"} detail="Role" color={TEAL}/><span className="text-lg text-[#56708d]">+</span><AssemblyToken icon={<BarChart3 className="h-5 w-5"/>} title={selected?.levelLabel??"Experience"} detail={selected?.levelRange??"Level"} color={ORANGE}/><ArrowRight className="h-5 w-5 text-[#1e7af2]"/><span className="flex h-10 items-center gap-2 rounded-full bg-[linear-gradient(90deg,#1e7af2,#1465df)] px-6 text-[11px] font-semibold text-white shadow-[0_12px_25px_-12px_rgba(30,122,242,.8)]"><Target className="h-4 w-4"/> Plan ready</span><div className="hidden h-px flex-1 bg-[#1e7af2] sm:block"/><ArrowRight className="hidden h-5 w-5 text-[#1e7af2] sm:block"/></div> }

function AssemblyToken({icon,title,detail,color}:{icon:React.ReactNode;title:string;detail:string;color:string}) { return <span className="flex h-11 min-w-[116px] items-center gap-2 rounded-[12px] border bg-white px-3 shadow-sm" style={{borderColor:color}}><span style={{color}}>{icon}</span><span><strong className="block max-w-[82px] truncate text-[9px]">{title}</strong><span className="block text-[7px] text-[#71839b]">{detail}</span></span></span> }

function PlanPreview({selected,loading}:{selected?:ContentDomain;loading:boolean}) {
  if (loading || !selected) return <div className="min-h-[690px] animate-pulse rounded-[15px] border border-blue-200 bg-blue-50/60"/>;
  const roadmap = roadmapFor(selected);
  return <article className="overflow-hidden rounded-[15px] border border-[#86b9ff] bg-white shadow-[0_22px_48px_-34px_rgba(30,122,242,.75)]">
    <div className="h-1 bg-[linear-gradient(90deg,#1e7af2,#159a8c,#e87500)]"/>
    <div className="p-4 pb-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[11px] border border-[#d6e1ee] bg-white"><TechIcon name={selected.languageSlug} className="h-10 w-10"/></span>
        <div className="min-w-0 flex-1"><h2 className="text-[21px] font-semibold tracking-[-.025em]">{selected.name}</h2><div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]"><span className="font-semibold text-[#e87500]">{selected.levelLabel}</span><span>·</span><span>{selected.levelRange}</span></div><p className="mt-1 text-[11px] text-[#496889]">Production-focused interview mastery.</p></div>
        <div className="grid shrink-0 gap-2"><Link href={`/${selected.slug}`} className="flex h-9 min-w-[155px] items-center justify-center gap-2 rounded-[7px] bg-[#1e7af2] px-4 text-[11px] font-semibold text-white shadow-[0_8px_18px_-10px_rgba(30,122,242,.8)]">Start this plan <ArrowRight className="h-3.5 w-3.5"/></Link><Link href={`/${selected.slug}#interview-road`} className="flex h-9 items-center justify-center rounded-[7px] border border-[#b9cce3] text-[11px] font-medium">Explore roadmap</Link></div>
      </div>
      <div className="mt-3 grid grid-cols-2 divide-x divide-[#dbe5f0] rounded-[9px] border border-[#cad9ea] sm:grid-cols-4"><Metric icon={Layers3} value={selected.stackCount.toLocaleString()} label="modules" color={BLUE}/><Metric icon={Code2} value={selected.questionCount.toLocaleString()} label="questions" color="#7656d8"/><Metric icon={UserRound} value={selected.levelLabel} label={selected.levelRange} color={ORANGE}/><Metric icon={Check} value="Ready" label="curriculum" color={TEAL}/></div>
    </div>
    <PlanSection title="A. Your ordered roadmap"><Roadmap labels={roadmap}/></PlanSection>
    <PlanSection title="B. What your plan includes"><Inclusions selected={selected}/></PlanSection>
    <PlanSection title="C. What this prepares you to do"><div className="grid gap-3 sm:grid-cols-3">{outcomesFor(selected).map((outcome)=><div key={outcome} className="flex gap-2 text-[11px] leading-[1.55]"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#35a766] text-white"><Check className="h-3 w-3"/></span>{outcome}</div>)}</div></PlanSection>
  </article>;
}

function Metric({icon:Icon,value,label,color}:{icon:ComponentType<{className?:string}>;value:string;label:string;color:string}) { return <div className="flex min-h-[58px] items-center justify-center gap-2 p-2"><span style={{color}}><Icon className="h-5 w-5" /></span><span><strong className="block max-w-[110px] truncate text-[15px]">{value}</strong><span className="block text-[10px] text-[#60738f]">{label}</span></span></div> }
function PlanSection({title,children}:{title:string;children:React.ReactNode}) { return <section className="border-t border-[#d7e1ee] px-4 py-4"><h3 className="mb-3 text-[11px] font-semibold text-[#075fc8]">{title}</h3>{children}</section> }

function Roadmap({labels}:{labels:string[]}) { return <div className="relative grid grid-cols-4 gap-y-3 sm:grid-cols-7"><div className="absolute left-[5%] right-[5%] top-[15px] hidden border-t border-dashed border-[#7eaee9] sm:block"/>{labels.map((label,index)=>{const color=index<2?BLUE:index<4?TEAL:index<6?ORANGE:"#239653";return <div key={label} className="relative z-10 text-center"><span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[11px] font-semibold text-white shadow-sm" style={{backgroundColor:color}}>{index+1}</span><span className="mt-2 block text-[10px] font-medium leading-4">{label}</span></div>})}</div> }

function Inclusions({selected}:{selected:ContentDomain}) { const items=[
  [MonitorPlay,"Visual explanations","Diagrams, flows and animations."],
  [BookOpen,"Guided curriculum",`${selected.stackCount} ordered modules.`],
  [Code2,"Coding & dry runs",`${selected.questionCount.toLocaleString()} real questions.`],
  [Compass,"Speakable answers","Follow-ups and clear trade-offs."],
  [Network,"System design cases","Architecture and production decisions."],
  [UserRound,"Mock interviews","Practice rounds and feedback."],
] as const;return <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">{items.map(([Icon,title,copy])=><div key={title} className="flex min-h-[72px] items-center gap-3 rounded-[9px] border border-[#dbe5f0] bg-[#fbfdff] p-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf5ff] text-[#1e7af2]"><Icon className="h-[18px] w-[18px]"/></span><span><strong className="block text-[11px]">{title}</strong><span className="mt-1 block text-[10px] leading-4 text-[#60738f]">{copy}</span></span></div>)}</div> }

function LearningLoop(){const items=[
  [Sparkles,"Understand","Grasp the core concepts with clarity.",BLUE],
  [MonitorPlay,"See it work","Visualize how real systems behave.",TEAL],
  [Code2,"Practice decisions","Solve problems and make trade-offs.",ORANGE],
  [Compass,"Explain aloud","Build speakable answers with confidence.","#7656d8"],
  [BriefcaseBusiness,"Test in a mock","Simulate interviews and get feedback.","#249c55"],
] as const;return <section className="mx-auto max-w-[1536px] px-3 pb-8 sm:px-5"><div className="rounded-[15px] border border-[#cfdded] bg-white p-4 shadow-[0_16px_42px_-36px_rgba(15,35,70,.7)]"><h2 className="text-[12px] font-semibold">One selection unlocks the complete learning loop</h2><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{items.map(([Icon,title,copy,color],index)=><div key={title} className="relative flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm" style={{borderColor:`${color}55`,color}}><Icon className="h-5 w-5"/></span><span><strong className="block text-[8px]">{index+1}. {title}</strong><span className="mt-1 block text-[7px] leading-3 text-[#60738f]">{copy}</span></span>{index<4&&<ArrowRight className="absolute -right-2 hidden h-4 w-4 text-[#b3c4d7] lg:block"/>}</div>)}</div><div className="mt-4 flex items-center justify-end gap-2 border-t border-[#edf1f6] pt-3 text-[8px] text-[#526b8a]"><RefreshCw className="h-4 w-4 text-[#1e7af2]"/> Change your plan anytime. Progress remains saved.</div></div></section> }

function roadmapFor(domain:ContentDomain){const value=`${domain.languageSlug} ${domain.trackSlug}`;if(value.includes("frontend"))return["Web core","JavaScript","Framework","State","Performance","Architecture","Interview ready"];if(value.includes("data")||value.includes("analytics"))return["Foundations","SQL","Analysis","Visualization","Cases","Practice","Interview ready"];if(value.includes("devops")||value.includes("cloud")||value.includes("sre"))return["Linux","Delivery","Containers","Cloud","Reliability","Production","Interview ready"];if(value.includes("fullstack"))return[domain.language,"Frontend","Backend","Data","APIs","Design","Interview ready"];return[`${domain.language} core`,"Framework","Data","APIs","Architecture","Production","Interview ready"]}
function outcomesFor(domain:ContentDomain){return[`Build and explain production-grade ${domain.name} systems.`,`Solve and communicate ${domain.track.toLowerCase()} interview problems.`,`Make engineering decisions and justify the trade-offs.`]}
