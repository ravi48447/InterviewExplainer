import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, CheckCircle2, Flame, Mic2, PlayCircle, Sparkles, Target } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/page-container";
import { FadeInUp } from "@/components/motion-wrapper";
import { HOME_HERO } from "@/lib/home/home-data";

export function HomeHero() {
  return (
    <section aria-labelledby="home-hero-heading" className="relative overflow-hidden border-b border-border bg-[#fffdfb] dark:bg-card">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_72%_12%,rgba(120,87,216,0.08),transparent_52%)]" />
      <PageContainer className="relative py-12 sm:py-16">
        <div className="grid items-center gap-10 xl:grid-cols-[0.9fr_1.1fr] xl:gap-8">
          <FadeInUp className="relative z-10 max-w-[610px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#7857D8]/20 bg-[#7857D8]/[0.06] px-3 py-1.5 text-[11px] font-medium text-[#6846C7] dark:text-[#bcaaff]">
              <Sparkles className="h-3.5 w-3.5 text-[#E87500]" aria-hidden="true" />
              Structured learning. Real interviews. Faster growth.
            </div>

            <h1 id="home-hero-heading" className="font-display text-[clamp(2.2rem,3.8vw,3.2rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-foreground">
              Understand every concept.
              <span className="mt-1 block text-[#7857D8] dark:text-[#bcaaff]">Crack every interview.</span>
            </h1>

            <p className="mt-5 max-w-[560px] text-[14px] leading-6 text-muted-foreground sm:text-[15px] sm:leading-7">
              {HOME_HERO.supporting}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={HOME_HERO.primaryCta.href} className={cn(buttonVariants({ variant: "primary", size: "lg" }), "h-11 rounded-lg bg-[#126B63] px-5 text-[13px] shadow-md hover:bg-[#0e5b54] transition-transform duration-150 ease-out hover:-translate-y-0.5")}>
                {HOME_HERO.primaryCta.label}
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link href={HOME_HERO.secondaryCta.href} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-lg border-border-strong bg-card px-5 text-[13px] text-foreground shadow-xs transition-transform duration-150 ease-out hover:-translate-y-0.5")}>
                <PlayCircle aria-hidden="true" />
                {HOME_HERO.secondaryCta.label}
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
              <div className="flex -space-x-2" aria-hidden="true">
                {["RK", "AS", "NM", "SP"].map((initials, index) => (
                  <span key={initials} className={cn("grid h-8 w-8 place-items-center rounded-full border-2 border-card text-[9px] font-semibold text-white", ["bg-[#126B63]", "bg-[#7857D8]", "bg-[#D9603B]", "bg-[#3279C9]"][index])}>
                    {initials}
                  </span>
                ))}
              </div>
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground">Built for serious preparation</span>
                <span aria-hidden="true">·</span>
                Java, Python, Go, Ruby &amp; Frontend
              </span>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.08} className="relative min-h-[370px] sm:min-h-[450px] xl:min-h-[465px]">
            <div className="absolute inset-0 overflow-hidden rounded-2xl border border-[#e9e1ef] bg-[#f8f0ef] shadow-[0_22px_60px_rgba(66,46,86,0.10)] dark:border-border dark:bg-card">
              <Image
                src="/images/home/hero-learning-v3.webp"
                alt="Developer with a visible side profile learning algorithms and system design at a guided visual workspace"
                fill
                priority
                sizes="(max-width: 1279px) 100vw, 58vw"
                className="object-cover object-[58%_center] sm:object-[55%_center]"
              />
            </div>

            <div className="absolute left-3 top-4 w-[152px] rounded-xl border border-[#d9d0ed] bg-white/95 p-3 shadow-lg backdrop-blur dark:bg-card/95 sm:left-5 sm:top-6 sm:w-[174px]">
              <p className="text-[10px] font-semibold text-foreground">Learning progress</p>
              <div className="mt-2.5 flex items-center gap-2.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-[5px] border-[#7857D8]/20 border-r-[#7857D8] border-t-[#7857D8] text-[11px] font-semibold text-foreground">72%</span>
                <div className="min-w-0 flex-1">
                  <div className="h-1 overflow-hidden rounded-full bg-muted"><span className="block h-full w-[72%] rounded-full bg-[#7857D8]" /></div>
                  <p className="mt-1.5 text-[9px] leading-3.5 text-muted-foreground">Plan completed</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 right-3 w-[158px] rounded-xl border border-[#d7e7df] bg-white/95 p-3 shadow-lg backdrop-blur dark:bg-card/95 sm:bottom-6 sm:right-5 sm:w-[178px]">
              <p className="text-[10px] font-semibold text-foreground">This week</p>
              <div className="mt-2.5 space-y-1.5 text-[9px] sm:text-[10px]">
                <span className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5 text-muted-foreground"><BookOpenCheck className="h-3.5 w-3.5 text-[#3279C9]" />Topics learned</span><strong className="font-semibold">8</strong></span>
                <span className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5 text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 text-[#16826C]" />Problems solved</span><strong className="font-semibold">24</strong></span>
                <span className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5 text-muted-foreground"><Flame className="h-3.5 w-3.5 text-[#E87500]" />Day streak</span><strong className="font-semibold">12</strong></span>
              </div>
            </div>

            <div className="absolute right-3 top-4 hidden items-center gap-2 rounded-lg border border-[#f2d4c8] bg-[#fff9f5]/95 px-2.5 py-2 text-[9px] text-[#9b4528] shadow-md backdrop-blur sm:flex sm:right-5 sm:top-6">
              <Mic2 className="h-3.5 w-3.5 text-[#D9603B]" aria-hidden="true" />
              <span><strong className="block font-semibold">3 mock rounds</strong>ready to practice</span>
            </div>

            <div className="absolute bottom-5 left-4 hidden items-center gap-2 rounded-lg border border-[#d5e6ea] bg-[#f6fcfb]/95 px-2.5 py-2 text-[9px] text-[#126B63] shadow-md backdrop-blur sm:flex sm:left-6 sm:bottom-7">
              <Target className="h-3.5 w-3.5" aria-hidden="true" />
              <span><strong className="block font-semibold">Next goal</strong>System design</span>
            </div>
          </FadeInUp>
        </div>
      </PageContainer>
    </section>
  );
}
