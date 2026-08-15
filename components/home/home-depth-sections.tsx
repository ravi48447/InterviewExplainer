import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  Braces,
  Check,
  ChevronRight,
  CircleDot,
  Code2,
  FileSearch,
  Gauge,
  GitBranch,
  Layers3,
  MessageSquareText,
  Mic2,
  MoveHorizontal,
  Network,
  Play,
  Search,
  Sparkles,
  Target,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { ScoreRing } from "@/components/ui/score-ring";
import { TechIcon } from "@/components/tech-icon";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";
import {
  HOME_SAMPLE_LESSON,
  HOME_TECHNOLOGIES,
  getHomeDSAPatterns,
  getHomeFeaturedQuestions,
  getHomeFooterLinkGroups,
  getHomeMockShowcase,
  getHomeResumeShowcase,
  getHomeUSPPillars,
} from "@/lib/home/home-data";
import { cn } from "@/lib/utils";

const DSA_ICONS: Record<string, LucideIcon> = {
  "arrays-hashing": Layers3,
  "two-pointers": MoveHorizontal,
  "sliding-window": Braces,
  trees: GitBranch,
  graphs: Network,
  "dynamic-programming": Workflow,
};

const DSA_ACCENTS = [
  "border-[#CFE0F5] bg-[#F2F7FD] text-[#3279C9]",
  "border-[#CFE6DE] bg-[#EFF9F6] text-[#126B63]",
  "border-[#F1D7BC] bg-[#FFF7ED] text-[#B85A08]",
  "border-[#DED3F3] bg-[#F7F3FD] text-[#7857D8]",
  "border-[#D9E4F3] bg-[#F4F8FC] text-[#476A94]",
  "border-[#E8D8E3] bg-[#FBF4F9] text-[#94517F]",
] as const;

function SectionIntro({
  eyebrow,
  title,
  detail,
  id,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  detail: string;
  id: string;
  centered?: boolean;
}) {
  return (
    <div className={cn("max-w-3xl", centered && "mx-auto text-center")}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D9603B]">{eyebrow}</p>
      <h2 id={id} className="mt-2 font-display text-[1.55rem] font-semibold leading-tight tracking-[-0.025em] text-foreground sm:text-[2rem]">
        {title}
      </h2>
      <p className={cn("mt-3 text-[13px] leading-6 text-muted-foreground sm:text-sm", centered && "mx-auto max-w-2xl")}>
        {detail}
      </p>
    </div>
  );
}

function ProductPreview({ index }: { index: number }) {
  if (index === 0) return <div aria-hidden="true" className="relative h-[112px] w-[184px] overflow-hidden rounded-2xl border border-[#A9D3FF] bg-[linear-gradient(145deg,#DCEFFF,#F8FCFF)] p-3 shadow-[0_12px_22px_rgba(30,122,242,.15)]"><span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#1974D2]">Sliding window</span><div className="mt-4 flex gap-1.5">{["a", "b", "c", "a", "b"].map((item, itemIndex) => <span key={`${item}-${itemIndex}`} className={cn("grid h-7 w-7 place-items-center rounded-lg text-[11px] font-bold", itemIndex > 0 && itemIndex < 4 ? "bg-[#1974D2] text-white shadow-[0_4px_0_#0E5DB2]" : "border border-[#A9D3FF] bg-white text-[#52708E]")}>{item}</span>)}</div><span className="absolute bottom-3 left-4 right-4 h-1.5 rounded-full bg-[#1974D2]/20"><span className="block h-full w-3/5 rounded-full bg-[#1974D2]" /></span></div>;
  if (index === 1) return <div aria-hidden="true" className="relative grid h-[112px] w-[184px] place-items-center overflow-hidden rounded-2xl border border-[#D6C5FF] bg-[radial-gradient(circle_at_50%_40%,#F8F4FF_0%,#E9E0FF_65%,#DCCBFF_100%)] shadow-[0_12px_22px_rgba(120,87,216,.15)]"><span className="grid h-14 w-14 place-items-center rounded-full border-[7px] border-[#7857D8]/15 border-t-[#7857D8] border-r-[#7857D8] bg-white text-[13px] font-bold text-[#6040BD]">84</span><div className="absolute bottom-3 left-4 right-4 flex h-6 items-end justify-center gap-1">{[8, 16, 24, 13, 28, 18, 22, 11, 18].map((height, i) => <span key={i} className="w-1.5 rounded-full bg-[#7857D8]" style={{ height }} />)}</div><span className="absolute left-3 top-3 text-[9px] font-bold uppercase tracking-[.12em] text-[#6748C3]">Mock score</span></div>;
  if (index === 2) return <div aria-hidden="true" className="relative h-[112px] w-[184px] overflow-hidden rounded-2xl border border-[#F2C991] bg-[linear-gradient(145deg,#FFF1DF,#FFFCF8)] p-3 shadow-[0_12px_22px_rgba(200,106,6,.15)]"><span className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-xl bg-[#C86A06] text-[12px] font-bold text-white shadow-[0_4px_0_#A95400]">78%</span><span className="block h-2 w-16 rounded-full bg-[#C86A06]/75"/><span className="mt-3 block h-1.5 w-28 rounded-full bg-[#E7B36F]"/><span className="mt-2 block h-1.5 w-24 rounded-full bg-[#EFD1A6]"/><span className="mt-2 block h-1.5 w-20 rounded-full bg-[#EFD1A6]"/><div className="absolute bottom-3 left-3 flex gap-1"><span className="rounded bg-[#DFF3E8] px-2 py-1 text-[8px] font-bold text-[#16734D]">9 strong</span><span className="rounded bg-[#FFE5C4] px-2 py-1 text-[8px] font-bold text-[#A65500]">4 gaps</span></div></div>;
  return <div aria-hidden="true" className="relative h-[112px] w-[184px] overflow-hidden rounded-2xl border border-[#BDE3D8] bg-[linear-gradient(145deg,#E1F8F1,#F9FFFC)] p-3 shadow-[0_12px_22px_rgba(19,122,105,.13)]"><span className="block w-[78%] rounded-2xl rounded-tl-sm bg-[#137A69] px-3 py-2 text-[9px] font-semibold text-white">What is dependency injection?</span><span className="ml-auto mt-2 block w-[88%] rounded-2xl rounded-tr-sm bg-white px-3 py-2 text-[9px] font-semibold leading-3 text-[#276B60] shadow-sm">A dependency is supplied from outside the class.</span><span className="mt-2 inline-flex rounded-full bg-[#CBEFE4] px-2 py-1 text-[8px] font-bold text-[#137A69]">Clear answer · 3 points</span></div>;
}

export function HomeLearningExperience() {
  const lesson = HOME_SAMPLE_LESSON;
  const pillars = getHomeUSPPillars();

  return (
    <section aria-labelledby="home-learning-proof-heading" className="border-y border-border bg-[#fffdfb] py-14 dark:bg-card sm:py-16">
      <PageContainer wide className="max-w-[1240px]">
        <FadeInUp>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <SectionIntro
              id="home-learning-proof-heading"
              eyebrow={lesson.eyebrow}
              title={lesson.title}
              detail={lesson.supporting}
            />
            <Link href="/dsa/problem/longest-substring-without-repeat" className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-semibold text-[#6846C7] hover:text-[#5235A6]">
              Open the complete lesson <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.06} className="mt-9 overflow-hidden rounded-[15px] border border-[#D8E2EF] bg-white shadow-[0_18px_55px_rgba(39,66,105,0.08)] dark:border-border dark:bg-background">
          <div className="grid min-w-0 xl:grid-cols-[0.82fr_1.35fr_0.92fr]">
            <div className="min-w-0 border-b border-[#E2E9F2] p-5 dark:border-border sm:p-6 xl:border-b-0 xl:border-r">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-[#E0D5F1] bg-[#F7F3FD] px-2.5 py-1 text-[10px] font-semibold text-[#6846C7]">Medium</span>
                <span className="text-[10px] font-medium text-muted-foreground">{lesson.problem.pattern}</span>
              </div>
              <h3 className="mt-4 text-[16px] font-semibold leading-6 text-foreground">{lesson.problem.title}</h3>
              <p className="mt-3 text-[12px] leading-5 text-muted-foreground">{lesson.problem.prompt}</p>

              <div className="mt-5 rounded-xl border-l-[3px] border-[#126B63] bg-[#F0F9F6] px-4 py-3 dark:bg-card">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#126B63]">In plain English</p>
                <p className="mt-1.5 text-[12px] leading-5 text-foreground">Grow a clean window. When a repeat appears, move only the left edge needed to make it valid again.</p>
              </div>

              <div className="mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Invariant</p>
                <p className="mt-2 inline-flex rounded-lg border border-[#F0D3B3] bg-[#FFF7ED] px-3 py-2 font-mono text-[11px] text-[#99500D]">
                  window contains no duplicates
                </p>
              </div>
            </div>

            <div className="min-w-0 border-b border-[#E2E9F2] bg-[#FBFCFE] p-5 dark:border-border dark:bg-card sm:p-6 xl:border-b-0 xl:border-r">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#3279C9]">Controlled visual explanation</p>
                  <p className="mt-1 text-[12px] font-semibold text-foreground">Step 4 of 8 · resolve the duplicate</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/dsa/problem/longest-substring-without-repeat" aria-label="Open the controlled visual explanation" className="grid h-9 w-9 place-items-center rounded-lg bg-[#3279C9] text-white shadow-sm transition-colors hover:bg-[#2868AE]">
                    <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                  </Link>
                  <span className="rounded-lg border border-border bg-white px-2.5 py-2 text-[10px] font-semibold text-muted-foreground dark:bg-background">1x speed</span>
                </div>
              </div>

              <div className="mt-8 overflow-x-auto pb-2">
                <div className="flex min-w-[500px] items-end gap-2 px-1">
                  {lesson.visual.values.map((value, index) => {
                    const active = index >= lesson.visual.left && index <= lesson.visual.right;
                    return (
                      <div key={`${value}-${index}`} className="relative flex w-14 flex-col items-center">
                        <div className="mb-1 h-6 text-center">
                          {index === lesson.visual.left && <span className="rounded bg-[#126B63] px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white">left ↓</span>}
                          {index === lesson.visual.right && <span className="rounded bg-[#D9603B] px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white">right ↓</span>}
                        </div>
                        <span className={cn("grid h-12 w-12 place-items-center rounded-xl border-2 font-mono text-sm font-semibold", active ? "border-[#3279C9] bg-[#EAF3FF] text-[#0F2346] shadow-sm" : index < lesson.visual.left ? "border-[#E2E8F0] bg-[#F5F7FA] text-[#9AA8B8]" : "border-[#D7E1EE] bg-white text-[#405674]")}>{value}</span>
                        <span className="mt-1 font-mono text-[9px] text-muted-foreground">{index}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[#CFE0F5] bg-[#EEF6FF] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#3279C9]">What changed?</p>
                <p className="mt-1 text-[12px] leading-5 text-[#334B69]">{lesson.visual.step}</p>
                <code className="mt-2 block font-mono text-[10px] text-[#60738F]">{lesson.visual.state}</code>
              </div>
            </div>

            <div className="min-w-0 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7857D8]">Code connection</p>
                <span className="rounded-md bg-[#F2ECFC] px-2 py-1 text-[9px] font-semibold text-[#6846C7]">Python</span>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl bg-[#101C30] shadow-lg">
                <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2" aria-hidden="true">
                  <span className="h-2 w-2 rounded-full bg-[#E36C5B]" />
                  <span className="h-2 w-2 rounded-full bg-[#E2AF43]" />
                  <span className="h-2 w-2 rounded-full bg-[#55A873]" />
                  <span className="ml-auto font-mono text-[8px] text-[#8295AE]">solution.py</span>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-[10px] leading-6 text-[#DCE8F6]">
                  {lesson.code.map((line, index) => <code key={line} className={cn("block whitespace-pre", index === 1 && "-mx-4 border-l-2 border-[#E87500] bg-[#E87500]/10 px-[14px] text-[#FFD2A4]")}>{line}</code>)}
                </pre>
              </div>
              <div className="mt-4 rounded-xl border border-[#E4DAF2] bg-[#F9F6FD] px-3 py-3 dark:bg-card">
                <p className="text-[10px] font-semibold text-[#6846C7]">Why this line?</p>
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">Jumping directly past the previous duplicate preserves linear time and keeps the invariant true.</p>
              </div>
            </div>
          </div>

          <div className="grid border-t border-[#E2E9F2] sm:grid-cols-2 lg:grid-cols-4 dark:border-border">
            {lesson.moments.map((moment, index) => (
              <div key={moment.label} className={cn("flex gap-3 px-5 py-4", index > 0 && "border-t border-[#E2E9F2] sm:border-l sm:border-t-0 dark:border-border", index === 2 && "sm:border-l-0 lg:border-l", index > 1 && "sm:border-t lg:border-t-0")}>
                <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[11px] font-semibold", ["bg-[#EAF3FF] text-[#3279C9]", "bg-[#EFF9F6] text-[#126B63]", "bg-[#FFF5EA] text-[#D9603B]", "bg-[#F4EFFC] text-[#7857D8]"][index])}>{index + 1}</span>
                <span><strong className="block text-[11px] font-semibold text-foreground">{moment.label}</strong><span className="mt-1 block text-[10px] leading-4 text-muted-foreground">{moment.detail}</span></span>
              </div>
            ))}
          </div>
        </FadeInUp>

        {pillars.length > 0 && (
          <StaggerContainer className="mt-6 grid gap-4 sm:grid-cols-2" staggerDelay={0.04}>
            {pillars.map((pillar, index) => {
              const icons = [BrainCircuit, Mic2, FileSearch, MessageSquareText];
              const Icon = icons[index] ?? Sparkles;
              const surfaces = [
                { card: "border-[#CFE0F5] bg-[#F5FAFF]", icon: "bg-[#DCEEFF] text-[#1974D2]", glow: "bg-[#B9D9FF]", action: "Explore patterns" },
                { card: "border-[#DCD1F3] bg-[#FAF8FF]", icon: "bg-[#EDE6FF] text-[#7857D8]", glow: "bg-[#D9CAFF]", action: "Start a mock" },
                { card: "border-[#F1D9BF] bg-[#FFF9F2]", icon: "bg-[#FFE8CB] text-[#C86A06]", glow: "bg-[#FFD4A5]", action: "Check my resume" },
                { card: "border-[#CBE8E1] bg-[#F3FBF8]", icon: "bg-[#DDF5EE] text-[#137A69]", glow: "bg-[#BFE8DB]", action: "Browse questions" },
              ][index] ?? { card: "border-border bg-card", icon: "bg-muted text-foreground", glow: "bg-muted", action: "Explore" };
              return (
                <StaggerItem key={pillar.href}>
                  <Link href={pillar.href} className={cn("group relative flex min-h-[174px] overflow-hidden rounded-2xl border p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(15,35,70,.11)]", surfaces.card)}>
                    <span aria-hidden="true" className={cn("absolute -right-7 -top-7 h-28 w-28 rounded-full opacity-55 blur-2xl", surfaces.glow)} />
                    <span className="relative flex min-w-0 flex-1 flex-col justify-between sm:max-w-[52%]">
                      <span className="flex items-start justify-between gap-4"><span className={cn("grid h-12 w-12 place-items-center rounded-2xl shadow-[0_6px_0_rgba(255,255,255,.72)]", surfaces.icon)}><Icon className="h-6 w-6" /></span><span className="rounded-full border border-white/80 bg-white/65 px-2.5 py-1 text-[10px] font-semibold text-[#48617E]">{pillar.metric}</span></span>
                      <span><strong className="block text-[16px] font-semibold tracking-[-.02em] text-[#10264A]">{pillar.title}</strong><span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#315B87] transition-transform group-hover:translate-x-1">{surfaces.action} <ArrowRight className="h-3.5 w-3.5" /></span></span>
                    </span>
                    <span className="absolute bottom-5 right-5 hidden sm:block"><ProductPreview index={index} /></span>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </PageContainer>
    </section>
  );
}

export function HomeDSAStudio() {
  const patterns = getHomeDSAPatterns();
  if (patterns.length === 0) return null;

  return (
    <section aria-labelledby="home-dsa-studio-heading" className="bg-background py-14 sm:py-16">
      <PageContainer wide className="max-w-[1240px]">
        <FadeInUp>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionIntro id="home-dsa-studio-heading" eyebrow="DSA learning studio" title="Different algorithms deserve different visual worlds." detail="Practice by pattern, then open a problem to see its own explanation, invariant, controlled animation, dry run, code, complexity, edge cases, and interview follow-ups." />
            <Link href="/dsa" className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-semibold text-[#6846C7] hover:text-[#5235A6]">Explore all DSA <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </FadeInUp>

        <div className="mt-9 grid gap-5 xl:grid-cols-[1.28fr_0.72fr]">
          <StaggerContainer className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.04}>
            {patterns.map((pattern, index) => {
              const Icon = DSA_ICONS[pattern.icon] ?? Layers3;
              return (
                <StaggerItem key={pattern.href}>
                  <Link href={pattern.href} className="group relative flex min-h-[196px] h-full flex-col overflow-hidden rounded-[15px] border border-border bg-card p-5 shadow-xs transition-[transform,border-color,box-shadow] duration-150 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md">
                    <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: ["#3279C9", "#126B63", "#E87500", "#7857D8", "#476A94", "#94517F"][index] }} />
                    <div className="flex items-start justify-between gap-3">
                      <span className={cn("grid h-11 w-11 place-items-center rounded-xl border", DSA_ACCENTS[index])}><Icon className="h-5 w-5" /></span>
                      <span className="rounded-full border border-border bg-background px-2 py-1 text-[9px] font-semibold text-muted-foreground">{pattern.count} problems</span>
                    </div>
                    <h3 className="mt-4 text-[14px] font-semibold text-foreground">{pattern.name}</h3>
                    <p className="mt-2 flex-1 text-[11px] leading-5 text-muted-foreground">{pattern.blurb}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-[#6846C7]">Open pattern <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          <FadeInUp delay={0.08} className="relative overflow-hidden rounded-[15px] border border-[#E5D8F1] bg-[linear-gradient(150deg,#FBF8FD_0%,#FFF9F1_100%)] p-5 dark:border-border dark:bg-card sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#D9603B]">Inside every problem</p><h3 className="mt-2 text-[17px] font-semibold text-foreground">The complete interview flow</h3></div>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#F2ECFC] text-[#7857D8]"><BrainCircuit className="h-5 w-5" /></span>
            </div>
            <ol className="relative mt-6 space-y-0">
              <span className="absolute bottom-4 left-[15px] top-4 w-px bg-gradient-to-b from-[#3279C9] via-[#7857D8] to-[#E87500]" aria-hidden="true" />
              {[
                ["Understand", "Problem, examples, constraints, clarifying questions"],
                ["Compare", "Brute force to optimal with honest trade-offs"],
                ["Watch", "Controlled state changes and synchronized dry run"],
                ["Code", "Java and Python with teaching annotations"],
                ["Interview", "Mistakes, edge cases, follow-ups, and recall"],
              ].map(([title, detail], index) => (
                <li key={title} className="relative flex gap-3 py-2.5">
                  <span className={cn("relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 bg-white text-[10px] font-semibold dark:bg-background", index < 2 ? "border-[#3279C9] text-[#3279C9]" : index < 4 ? "border-[#7857D8] text-[#7857D8]" : "border-[#E87500] text-[#B85A08]")}>{index + 1}</span>
                  <span><strong className="block text-[12px] font-semibold text-foreground">{title}</strong><span className="mt-0.5 block text-[10px] leading-4 text-muted-foreground">{detail}</span></span>
                </li>
              ))}
            </ol>
            <Link href="/dsa/problem/longest-substring-without-repeat" className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#D9603B] px-4 text-[11px] font-semibold text-white shadow-sm hover:bg-[#BD4F30]">
              See a complete problem <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </FadeInUp>
        </div>
      </PageContainer>
    </section>
  );
}

export function HomeRealContent() {
  const questions = getHomeFeaturedQuestions(5);

  return (
    <section aria-labelledby="home-real-content-heading" className="border-y border-border bg-[#F7F9FC] py-14 dark:bg-card sm:py-16">
      <PageContainer wide>
        <FadeInUp>
          <SectionIntro id="home-real-content-heading" eyebrow="Real repository content" title="Browse the material before you commit to a path." detail="The homepage is not a decorative promise. These links open real technology tracks and curated interview questions already available in the product." centered />
        </FadeInUp>

        <FadeInUp delay={0.04} className="mx-auto mt-7 max-w-3xl">
          <form action="/search" method="get" role="search" className="flex items-center gap-2 rounded-[15px] border border-[#D7E1EE] bg-card p-2 shadow-sm focus-within:border-[#7857D8]/55 focus-within:ring-2 focus-within:ring-[#7857D8]/10">
            <label htmlFor="home-content-search" className="sr-only">Search interview concepts and questions</label>
            <Search className="ml-2 h-4 w-4 shrink-0 text-[#7857D8]" aria-hidden="true" />
            <input id="home-content-search" name="q" type="search" placeholder="Search concepts, technologies, or interview questions..." className="h-10 min-w-0 flex-1 bg-transparent px-1 text-[12px] text-foreground outline-none placeholder:text-muted-foreground" />
            <button type="submit" className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-[#6846C7] px-4 text-[11px] font-semibold text-white transition-colors hover:bg-[#5235A6]">Search <ArrowRight className="hidden h-3.5 w-3.5 sm:block" aria-hidden="true" /></button>
          </form>
        </FadeInUp>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
          <FadeInUp className="rounded-[15px] border border-border bg-card p-5 shadow-xs sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#126B63]">Explore by technology</p><h3 className="mt-2 text-[17px] font-semibold text-foreground">Choose your primary stack</h3></div>
              <Code2 className="h-5 w-5 text-[#126B63]" />
            </div>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {HOME_TECHNOLOGIES.map((technology) => (
                <li key={technology.name}>
                  <Link href={technology.href} className="group flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-3 transition-colors hover:border-[#126B63]/35 hover:bg-[#F4FAF8]">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-card"><TechIcon name={technology.icon} className="h-5 w-5" /></span>
                    <span className="min-w-0 flex-1"><strong className="block text-[11px] font-semibold text-foreground">{technology.name}</strong><span className="mt-0.5 block truncate text-[9px] text-muted-foreground">{technology.blurb}</span></span>
                    <span className="text-[9px] tabular-nums text-muted-foreground">{technology.count}+</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/domains" className="mt-5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#126B63]">View every live path <ArrowRight className="h-3.5 w-3.5" /></Link>
          </FadeInUp>

          <FadeInUp delay={0.06} className="overflow-hidden rounded-[15px] border border-border bg-card shadow-xs">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
              <div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7857D8]">Question sampler</p><h3 className="mt-1.5 text-[17px] font-semibold text-foreground">Real interview questions</h3></div>
              <Link href="/domains" className="text-[10px] font-semibold text-[#6846C7]">Browse all</Link>
            </div>
            {questions.length > 0 ? (
              <ol className="divide-y divide-border">
                {questions.map((question, index) => (
                  <li key={`${question.href}-${index}`}>
                    <Link href={question.href} className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[#FAF8FD] sm:px-6">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#F2ECFC] text-[9px] font-semibold text-[#6846C7]">{String(index + 1).padStart(2, "0")}</span>
                      <span className="min-w-0 flex-1"><strong className="block truncate text-[12px] font-medium text-foreground group-hover:text-[#6846C7]">{question.title}</strong><span className="mt-0.5 block text-[9px] text-muted-foreground">{question.context} · explanation and interview answer</span></span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="px-6 py-10 text-center text-sm text-muted-foreground">Question samples are being refreshed. The complete domain library remains available.</p>
            )}
          </FadeInUp>
        </div>
      </PageContainer>
    </section>
  );
}

export function HomeCareerToolkit() {
  const mock = getHomeMockShowcase();
  const resume = getHomeResumeShowcase();
  if (!mock && !resume) return null;

  return (
    <section aria-labelledby="home-toolkit-heading" className="bg-background py-14 sm:py-16">
      <PageContainer wide className="max-w-[1240px]">
        <FadeInUp>
          <SectionIntro id="home-toolkit-heading" eyebrow="Beyond studying" title="Practice the round. Strengthen the application." detail="Learning content is only one part of preparation. Rehearse your answers under interview pressure and check whether your resume matches the role before you apply." centered />
        </FadeInUp>

        <div className="mt-9 grid gap-5 lg:grid-cols-2">
          {mock && (
            <FadeInUp className="overflow-hidden rounded-[15px] border border-[#CFE0F5] bg-[linear-gradient(145deg,#F6FAFF_0%,#FFFFFF_68%)] shadow-xs dark:border-border dark:bg-card">
              <div className="grid h-full sm:grid-cols-[0.74fr_1.26fr]">
                <div className="flex flex-col items-center justify-center border-b border-[#DCE7F3] p-6 sm:border-b-0 sm:border-r">
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-[#CFE0F5] bg-white shadow-md">
                    <ScoreRing value={mock.sampleScore} size={92} stroke={7} label="mock score" colorClassName="text-[#3279C9]" />
                    <span className="absolute -right-2 top-2 grid h-9 w-9 place-items-center rounded-xl bg-[#FFF2E5] text-[#D9603B] shadow-sm"><Mic2 className="h-4 w-4" /></span>
                  </div>
                  <div className="mt-5 flex h-7 items-end gap-1" aria-hidden="true">
                    {[10, 18, 12, 24, 16, 21, 13, 19, 9, 15].map((height, index) => <span key={index} className="w-1 rounded-full bg-[#3279C9]/60" style={{ height }} />)}
                  </div>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[9px] font-semibold text-[#126B63]"><span className="h-1.5 w-1.5 rounded-full bg-[#22A06B]" /> Voice session ready</span>
                </div>
                <div className="p-6 sm:p-7">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#3279C9]">AI mock interviews</p>
                  <h3 className="mt-2 text-[19px] font-semibold leading-7 text-foreground">{mock.headline}</h3>
                  <p className="mt-3 text-[11px] leading-5 text-muted-foreground">{mock.supporting}</p>
                  <ul className="mt-5 space-y-2.5">
                    {mock.points.map((point) => <li key={point.title} className="flex gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#EAF3FF] text-[#3279C9]"><Check className="h-3 w-3" /></span><span><strong className="block text-[10px] font-semibold text-foreground">{point.title}</strong><span className="mt-0.5 block text-[9px] leading-4 text-muted-foreground">{point.detail}</span></span></li>)}
                  </ul>
                  <Link href={mock.cta.href} className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-[#3279C9] px-4 text-[11px] font-semibold text-white shadow-sm hover:bg-[#2868AE]">{mock.cta.label} <ArrowRight className="h-3.5 w-3.5" /></Link>
                </div>
              </div>
            </FadeInUp>
          )}

          {resume && (
            <FadeInUp delay={0.06} className="overflow-hidden rounded-[15px] border border-[#E8D8C5] bg-[linear-gradient(145deg,#FFF9F2_0%,#FFFFFF_68%)] shadow-xs dark:border-border dark:bg-card">
              <div className="grid h-full sm:grid-cols-[0.74fr_1.26fr]">
                <div className="flex flex-col items-center justify-center border-b border-[#F0E1D1] p-6 sm:border-b-0 sm:border-r">
                  <div className="relative rounded-2xl border border-[#E5D7C8] bg-white p-4 shadow-md">
                    <div className="flex items-center gap-2"><FileSearch className="h-4 w-4 text-[#D9603B]" /><span className="text-[9px] font-semibold text-[#405674]">Resume match</span></div>
                    <div className="mt-4 flex items-center gap-3"><ScoreRing value={resume.sampleScore} size={76} stroke={6} label="score" colorClassName="text-[#D9603B]" /><div className="space-y-2 text-[8px] text-muted-foreground"><span className="flex items-center gap-1"><CircleDot className="h-2.5 w-2.5 text-[#126B63]" />9 strong</span><span className="flex items-center gap-1"><CircleDot className="h-2.5 w-2.5 text-[#D08A24]" />4 partial</span><span className="flex items-center gap-1"><CircleDot className="h-2.5 w-2.5 text-[#C8564D]" />3 missing</span></div></div>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#F2EAE1]"><span className="block h-full rounded-full bg-[#D9603B]" style={{ width: `${resume.sampleCoverage}%` }} /></div>
                    <p className="mt-1.5 text-right text-[8px] font-semibold text-[#D9603B]">{resume.sampleCoverage}% coverage</p>
                  </div>
                </div>
                <div className="p-6 sm:p-7">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#D9603B]">Resume intelligence</p>
                  <h3 className="mt-2 text-[19px] font-semibold leading-7 text-foreground">{resume.headline}</h3>
                  <p className="mt-3 text-[11px] leading-5 text-muted-foreground">{resume.supporting}</p>
                  <ul className="mt-5 space-y-2.5">
                    {resume.points.map((point) => <li key={point.title} className="flex gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#FFF2E5] text-[#D9603B]"><Check className="h-3 w-3" /></span><span><strong className="block text-[10px] font-semibold text-foreground">{point.title}</strong><span className="mt-0.5 block text-[9px] leading-4 text-muted-foreground">{point.detail}</span></span></li>)}
                  </ul>
                  <Link href={resume.cta.href} className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-[#D9603B] px-4 text-[11px] font-semibold text-white shadow-sm hover:bg-[#BD4F30]">{resume.cta.label} <ArrowRight className="h-3.5 w-3.5" /></Link>
                </div>
              </div>
            </FadeInUp>
          )}
        </div>
      </PageContainer>
    </section>
  );
}

export function HomeDiscoveryFooter() {
  const groups = getHomeFooterLinkGroups();
  if (groups.length === 0) return null;
  const icons = [BookOpenCheck, Gauge, BarChart3];

  return (
    <nav aria-label="Explore more InterviewExplainer resources" className="border-t border-border bg-[#F7F9FC] dark:bg-card">
      <PageContainer wide className="max-w-[1240px] py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_2.1fr] lg:items-start">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7857D8]">Keep exploring</p><h2 className="mt-2 text-[18px] font-semibold text-foreground">Every major learning tool stays one click away.</h2><p className="mt-2 max-w-md text-[11px] leading-5 text-muted-foreground">Continue by practice type, preparation tool, or technology hub.</p></div>
          <div className="grid gap-5 sm:grid-cols-3">
            {groups.map((group, index) => {
              const Icon = icons[index] ?? Target;
              return (
                <div key={group.label} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2"><span className={cn("grid h-8 w-8 place-items-center rounded-lg", ["bg-[#EAF3FF] text-[#3279C9]", "bg-[#FFF2E5] text-[#D9603B]", "bg-[#EFF9F6] text-[#126B63]"][index])}><Icon className="h-3.5 w-3.5" /></span><h3 className="text-[11px] font-semibold text-foreground">{group.label}</h3></div>
                  <ul className="mt-3 space-y-2">
                    {group.links.map((link) => <li key={link.href}><Link href={link.href} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-[#6846C7]">{link.label}<ChevronRight className="h-3 w-3" /></Link></li>)}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </PageContainer>
    </nav>
  );
}
