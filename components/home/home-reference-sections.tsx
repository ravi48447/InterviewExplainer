import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Code2,
  Flag,
  LockKeyhole,
  Puzzle,
  Sprout,
  Star,
  Target,
  Trophy,
  UserRound,
  Video,
} from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getReferenceHomeProof,
  REFERENCE_HOME_DOMAINS,
  REFERENCE_HOME_JOURNEY,
  type ReferenceHomeIcon,
} from "@/lib/home/home-data";
import { HomeDomainDiscovery } from "./home-domain-discovery";

const JOURNEY_ICONS: Partial<Record<ReferenceHomeIcon, typeof Flag>> = {
  flag: Flag,
  sprout: Sprout,
  puzzle: Puzzle,
  target: Target,
  trophy: Trophy,
};

const PROOF_ICONS = {
  user: UserRound,
  building: Building2,
  code: Code2,
  video: Video,
} as const;

const JOURNEY_ACCENTS = {
  blue: { ring: "border-primary/25", icon: "bg-primary/10 text-primary", step: "bg-primary" },
  green: { ring: "border-success/30", icon: "bg-success/10 text-success", step: "bg-success" },
  orange: { ring: "border-accent/30", icon: "bg-accent/10 text-accent", step: "bg-accent" },
  violet: { ring: "border-[#7857D8]/30", icon: "bg-[#7857D8]/10 text-[#7857D8]", step: "bg-[#7857D8]" },
  teal: { ring: "border-[#126B63]/30", icon: "bg-[#126B63]/10 text-[#126B63]", step: "bg-[#126B63]" },
} as const;

const PROOF_ACCENTS = [
  "bg-[#126B63]/10 text-[#126B63]",
  "bg-[#7857D8]/10 text-[#7857D8]",
  "bg-[#3279C9]/10 text-[#3279C9]",
  "bg-[#E87500]/10 text-[#E87500]",
] as const;

const TRUST_ACCENTS = [
  "bg-[#126B63]/10 text-[#126B63]",
  "bg-[#3279C9]/10 text-[#3279C9]",
  "bg-[#7857D8]/10 text-[#7857D8]",
  "bg-[#E87500]/10 text-[#E87500]",
] as const;

function SectionHeading({ id, eyebrow, title, supporting }: { id?: string; eyebrow?: string; title: string; supporting: string }) {
  return (
    <div className="mb-8 flex flex-col gap-2 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">{eyebrow}</p>}
        <h2 id={id} className="font-display text-[1.4rem] font-semibold tracking-[-0.02em] text-foreground sm:text-[1.7rem]">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{supporting}</p>
      </div>
    </div>
  );
}

export function HomeDomainSection() {
  return (
    <section aria-labelledby="home-domains-heading" className="bg-background py-12 sm:py-14">
      <PageContainer>
        <FadeInUp>
          <SectionHeading id="home-domains-heading" title="Choose your domain" supporting="Start from the role, language, or problem-solving skill your next interview will test." />
          <HomeDomainDiscovery domains={REFERENCE_HOME_DOMAINS} />
        </FadeInUp>
      </PageContainer>
    </section>
  );
}

export function HomeLearningJourney() {
  return (
    <section aria-labelledby="home-journey-heading" className="border-y border-border bg-[#fffdfb] py-12 dark:bg-card sm:py-14">
      <PageContainer>
        <FadeInUp>
          <div className="mb-10 text-center">
            <h2 id="home-journey-heading" className="font-display text-[1.4rem] font-semibold tracking-[-0.02em] text-foreground sm:text-[1.7rem]">Your journey to success</h2>
            <p className="mt-2 text-sm text-muted-foreground">A focused sequence from choosing a goal to performing confidently in the interview.</p>
          </div>
        </FadeInUp>

        <StaggerContainer className="relative grid gap-5 md:grid-cols-5" staggerDelay={0.05}>
          <div className="absolute left-[9%] right-[9%] top-[43px] hidden h-px bg-gradient-to-r from-primary/30 via-[#7857D8]/30 to-accent/30 md:block" aria-hidden="true" />
          {REFERENCE_HOME_JOURNEY.map((item) => {
            const Icon = JOURNEY_ICONS[item.icon] ?? Target;
            const accent = JOURNEY_ACCENTS[item.accent];
            return (
              <StaggerItem key={item.step} className="relative">
                <Link href={item.href} className="group flex h-full gap-4 rounded-xl border border-transparent p-3 transition-[transform,background-color,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-border hover:bg-background md:flex-col md:items-center md:text-center">
                  <div className={cn("relative z-10 grid h-[82px] w-[82px] shrink-0 place-items-center rounded-full border bg-card shadow-sm", accent.ring)}>
                    <span className={cn("grid h-11 w-11 place-items-center rounded-full", accent.icon)}>
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className={cn("absolute -top-1 left-1 grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold text-white", accent.step)}>{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">{item.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.detail}</p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </PageContainer>
    </section>
  );
}

export function HomeCoverageProof() {
  const proof = getReferenceHomeProof();
  return (
    <section aria-labelledby="home-proof-heading" className="bg-background py-10 sm:py-12">
      <PageContainer>
        <FadeInUp className="overflow-hidden rounded-2xl border border-[#e5deed] bg-card shadow-sm dark:border-border">
          <div className="grid lg:grid-cols-[1.25fr_2.75fr]">
            <div className="border-b border-border p-6 lg:border-b-0 lg:border-r lg:p-8">
              <h2 id="home-proof-heading" className="font-display text-lg font-semibold leading-7 text-foreground sm:text-xl">Everything you need to succeed, <span className="text-[#7857D8] dark:text-[#bcaaff]">in one place.</span></h2>
              <span className="mt-3 block h-1 w-16 rounded-full bg-accent" aria-hidden="true" />
            </div>
            <dl className="grid grid-cols-2 md:grid-cols-4">
              {proof.map((item, index) => {
                const Icon = PROOF_ICONS[item.icon];
                return (
                  <div key={item.label} className={cn("p-5 text-center sm:p-6", index % 2 === 1 && "border-l border-border", index > 1 && "border-t border-border md:border-t-0", index > 0 && "md:border-l md:border-border")}>
                    <span className={cn("mx-auto grid h-10 w-10 place-items-center rounded-xl", PROOF_ACCENTS[index])}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                    <dd className="mt-3 text-lg font-semibold tabular-nums text-foreground">{item.value}</dd>
                    <dt className="mt-1 text-[11px] text-muted-foreground">{item.label}</dt>
                  </div>
                );
              })}
            </dl>
          </div>
        </FadeInUp>
      </PageContainer>
    </section>
  );
}

export function HomePersonalizedPath() {
  return (
    <section aria-labelledby="home-path-heading" className="bg-background pb-12 sm:pb-16">
      <PageContainer>
        <FadeInUp className="relative min-h-[330px] overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:min-h-[360px]">
          <Image src="/images/home/path-mountain-v2.webp" alt="A guided learning road with milestones leading to an interview-ready goal" fill sizes="(max-width: 1200px) 100vw, 1200px" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fff9f3] via-[#fff9f3]/95 to-[#fff9f3]/5 dark:from-card dark:via-card/95 dark:to-card/5" aria-hidden="true" />
          <div className="relative z-10 flex min-h-[330px] max-w-xl flex-col justify-center p-7 sm:min-h-[360px] sm:p-10 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Not sure where to start?</p>
            <h2 id="home-path-heading" className="mt-3 font-display text-[1.45rem] font-semibold tracking-[-0.02em] text-foreground sm:text-[1.8rem]">Build a path around your goal and experience.</h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">Choose your role, technology, experience level, and target domain. We’ll turn them into a focused learning sequence.</p>
            <div className="mt-7">
              <Link href="/select" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "h-11 rounded-lg bg-[#D9603B] px-5 text-[13px] shadow-md hover:bg-[#bd4f30] transition-transform duration-150 ease-out hover:-translate-y-0.5")}>
                Find my path <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </FadeInUp>
      </PageContainer>
    </section>
  );
}

export function HomeTrustStrip() {
  const items = [
    { icon: CheckCircle2, title: "No filler", text: "Every section has a learning purpose." },
    { icon: Clock3, title: "Learn at your pace", text: "Resume from the exact place you stopped." },
    { icon: LockKeyhole, title: "Built for developers", text: "Clear, technical, and interview-ready." },
    { icon: Star, title: "Real preparation", text: "Concepts, practice, mocks, and revision." },
  ];
  return (
    <section aria-label="Learning commitments" className="border-y border-border bg-card">
      <PageContainer className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }, index) => (
          <div key={title} className={cn("flex gap-3 py-5 sm:px-5", index === 0 && "sm:pl-0")}>
            <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", TRUST_ACCENTS[index])}><Icon className="h-4 w-4" aria-hidden="true" /></span>
            <div><h2 className="text-xs font-semibold text-foreground">{title}</h2><p className="mt-1 text-[11px] leading-4 text-muted-foreground">{text}</p></div>
          </div>
        ))}
      </PageContainer>
    </section>
  );
}
