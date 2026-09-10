import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, CheckCircle2, Flame, Mic2, PlayCircle, Sparkles, Star } from "lucide-react";
import { HOME_HERO, REFERENCE_HOME_DOMAINS } from "@/lib/home/home-data";
import { HomeVisualIcon } from "./home-visual-icon";

const DOMAIN_COLORS = ["text-primary bg-[#EAF3FF]", "text-[#0F9D77] bg-[#E8F8F1]", "text-[#E87500] bg-[#FFF2E4]", "text-[#7857D8] bg-[#F1EDFF]", "text-[#3776AB] bg-[#EDF5FF]", "text-[#168D73] bg-[#E8F7F2]"];
const DOMAIN_LOGOS: Record<string, string | null> = {
  java: "/logos/java.svg",
  frontend: "/logos/javascript.svg",
  python: "/logos/python.svg",
};

export function HomeHero() {
  return (
    <section aria-labelledby="home-hero-heading" className="relative overflow-hidden border-b border-[#dce7f5] bg-white pb-20 dark:bg-card lg:pb-24">
      <div className="relative mx-auto w-full max-w-[1800px] min-h-[720px] pt-20 sm:pt-24 lg:min-h-[920px] lg:pt-[68px]">
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <Image src="/images/home/hero-learning-immersive-v4.png" alt="Developer learning in a branded interview-preparation workspace" fill priority sizes="100vw" className="object-cover object-center" />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[590px] max-w-[1440px] items-center px-8 sm:px-10 lg:min-h-[810px] lg:grid-cols-[42%_58%] lg:px-8">
          <div className="max-w-[525px] py-6 lg:pb-24 lg:pt-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.055] px-3 py-1.5 text-[11px] font-semibold text-primary"><Sparkles className="h-3.5 w-3.5" />Structured learning. Real interviews. Faster growth.</div>
            <h1 id="home-hero-heading" className="mt-7 font-display text-[clamp(2.15rem,2.9vw,3rem)] font-semibold leading-[1.13] tracking-[-0.04em] text-[#0B1D3A] [text-shadow:0_1px_0_rgba(255,255,255,.55)] dark:text-foreground">Understand Every Concept.<span className="mt-1.5 block">Crack <span className="text-primary">Every Interview.</span></span></h1>
            <p className="mt-6 max-w-[530px] rounded-xl border border-white/65 bg-white/[0.78] px-4 py-3 text-[15px] font-medium leading-7 text-[#294869] shadow-[0_7px_20px_rgba(15,35,70,.045)]">{HOME_HERO.supporting}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={HOME_HERO.primaryCta.href} className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(30,122,242,.22)] transition hover:-translate-y-0.5 hover:bg-[#1268d5]">Start learning <ArrowRight className="h-4 w-4" /></Link>
              <Link href={HOME_HERO.secondaryCta.href} className="inline-flex h-12 items-center gap-2 rounded-lg border border-[#d5dfeb] bg-white/90 px-6 text-[13px] font-semibold text-[#0F2346] shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35"><PlayCircle className="h-4 w-4 text-primary" />Watch a visual lesson</Link>
            </div>
            <div className="mt-8 inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-white/70 bg-white/[0.82] px-3 py-2 text-[11px] text-[#60738F] shadow-sm backdrop-blur-sm">
              <div className="flex -space-x-2" aria-hidden="true">{["RK", "AS", "NM", "SP"].map((name, i) => <span key={name} className="grid h-8 w-8 place-items-center rounded-full border-2 border-white text-[9px] font-bold text-white" style={{ background: ["#1E7AF2", "#39A86B", "#E87500", "#7857D8"][i] }}>{name}</span>)}</div>
              <span><span className="flex items-center gap-1 font-semibold text-[#0F2346]"><Star className="h-3.5 w-3.5 fill-[#FF9D23] text-[#FF9D23]" />50,000+ focused learners</span>Trusted by developers preparing seriously</span>
            </div>
          </div>

          <div className="relative min-h-[430px] lg:min-h-full">
            <div className="absolute inset-0 overflow-hidden rounded-[24px] bg-[#edf5ff] lg:hidden"><Image src="/images/home/hero-learning-immersive-v4.png" alt="Developer learning from a rear-facing desk view" fill sizes="100vw" className="object-cover object-[62%_center]" /></div>
            <ProgressPanel />
            <WeeklyPanel />
            <div className="absolute right-[4%] top-[8%] hidden items-center gap-2 rounded-xl border border-[#FFD9AE] bg-white/[0.94] px-3 py-2 shadow-[0_10px_24px_rgba(15,35,70,.10)] lg:flex"><Flame className="h-4 w-4 text-[#E87500]"/><span className="text-[9px] text-[#60738F]"><b className="block text-[10px] text-[#0F2346]">12 day streak</b>keep learning</span></div>
          </div>
        </div>

        <div className="absolute inset-x-4 -bottom-20 z-20 rounded-[18px] border border-white/80 bg-white/[0.9] p-4 shadow-[0_18px_44px_rgba(15,35,70,.11)] sm:inset-x-6 lg:left-1/2 lg:w-[calc(100%-4rem)] lg:max-w-[1440px] lg:bg-white/[0.28] lg:[transform:translateX(-50%)_perspective(1600px)_rotateX(2.2deg)] lg:[transform-origin:center_bottom]">
          <div className="mb-4 flex items-end justify-between"><div><h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[#0B1D3A]">Choose your domain</h2><p className="mt-1 text-[11px] font-medium text-[#536B8C]">Start with the skill your next interview will test.</p></div><Link href="/domains" className="hidden items-center gap-1 text-[11px] font-semibold text-primary sm:flex">View all domains <ArrowRight className="h-3.5 w-3.5"/></Link></div>
          <div className="flex snap-x gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] lg:grid lg:grid-cols-6">
            {REFERENCE_HOME_DOMAINS.map((domain, i) => <Link key={domain.id} href={domain.href} className="group relative min-w-[158px] snap-start overflow-hidden rounded-xl border border-white/85 bg-white/[0.96] px-3.5 py-3.5 shadow-[0_8px_0_rgba(186,204,226,.48),0_14px_23px_rgba(15,35,70,.07)] transition duration-200 hover:z-10 hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-[0_12px_0_rgba(169,197,231,.6),0_22px_30px_rgba(15,35,70,.13)] lg:min-w-0 lg:bg-white/[0.75]"><span aria-hidden="true" className="absolute inset-x-5 top-0 h-px bg-white/90"/><span className={`grid h-11 w-11 place-items-center rounded-[12px] ring-1 ring-white/75 shadow-[0_5px_10px_rgba(15,35,70,.08)] ${DOMAIN_COLORS[i]}`}>{DOMAIN_LOGOS[domain.id] ? <Image src={DOMAIN_LOGOS[domain.id]!} alt="" width={25} height={25} className="h-6 w-6 object-contain"/> : <HomeVisualIcon kind={domain.icon} className="h-6 w-6"/>}</span><span className="mt-2.5 block text-[12px] font-semibold leading-4 text-[#10264A]">{domain.title}</span><span className="mt-1 block text-[10px] font-medium leading-3.5 text-[#58708F]">{domain.summary}</span></Link>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressPanel() {
  return <div className="absolute left-2 top-4 z-10 w-[180px] rounded-2xl border border-[#D8E4F2] bg-white/[0.95] p-4 shadow-[0_14px_35px_rgba(15,35,70,.13)] backdrop-blur sm:left-4 lg:left-[52%] lg:top-[10%] lg:w-[245px]"><p className="text-[11px] font-semibold text-[#0F2346]">Your progress</p><div className="mt-3 flex items-center gap-4"><span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-[7px] border-primary/15 border-r-primary border-t-primary text-[16px] font-bold text-[#0F2346]">72%</span><div><b className="text-[11px] text-[#0F2346]">Overall progress</b><svg viewBox="0 0 120 44" className="mt-2 h-11 w-28"><polyline points="2,38 23,27 44,33 64,13 85,24 118,5" fill="none" stroke="#1E7AF2" strokeWidth="2.5"/><g fill="#1E7AF2">{[[2,38],[23,27],[44,33],[64,13],[85,24],[118,5]].map(([x,y])=><circle key={`${x}-${y}`} cx={x} cy={y} r="3"/>)}</g></svg></div></div></div>;
}

function WeeklyPanel() {
  return <div className="absolute bottom-[16%] right-[-1%] z-10 hidden w-[190px] rounded-2xl border border-[#D8E4F2] bg-white/[0.95] p-4 shadow-[0_14px_35px_rgba(15,35,70,.13)] backdrop-blur lg:block"><p className="text-[10px] font-semibold text-[#0F2346]">This week</p><div className="mt-3 space-y-2.5 text-[9px] text-[#60738F]"><Metric icon={<BookOpenCheck className="text-primary"/>} label="Topics learned" value="8"/><Metric icon={<CheckCircle2 className="text-success"/>} label="Problems solved" value="24"/><Metric icon={<Mic2 className="text-accent"/>} label="Mock interviews" value="3"/></div></div>;
}
function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <span className="flex items-center justify-between"><span className="flex items-center gap-1.5 [&_svg]:h-3.5 [&_svg]:w-3.5">{icon}{label}</span><b className="text-[#0F2346]">{value}</b></span>; }
