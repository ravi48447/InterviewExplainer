import Link from "next/link";
import { ArrowRight, GitBranch, Layers3, Lightbulb, MessageSquareText, Network, Play, Route, Scale, Workflow } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { TechIcon } from "@/components/tech-icon";
import { getHomePathways, HOME_TECHNOLOGIES } from "@/lib/home/home-data";

const surface = "rounded-[15px] border border-[#D7E1EE] bg-white shadow-[0_8px_26px_rgba(15,35,70,.045)]";

export function HomePlatformDepth() {
  const paths = getHomePathways().slice(0, 4);

  return (
    <>
      <section aria-labelledby="home-paths-heading" className="border-y border-[#D7E1EE] bg-[#F6F9FD] py-12 sm:py-14">
        <PageContainer wide className="max-w-[1240px]">
          <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#1E7AF2]">Role and experience aware</p>
              <h2 id="home-paths-heading" className="mt-3 max-w-md text-[28px] font-semibold leading-[1.18] tracking-[-.035em] text-[#0F2346] sm:text-[33px]">A path shaped around your actual stack.</h2>
              <p className="mt-4 max-w-lg text-[13px] leading-6 text-[#4E6685]">Choose a role and technology. The sequence adapts from foundation concepts to the interview work that follows.</p>
              <div className="mt-6 grid grid-cols-5 gap-2" aria-label="Supported technologies">
                {HOME_TECHNOLOGIES.map((tech) => (
                  <Link key={tech.name} href={tech.href} title={tech.blurb} className="group grid min-h-20 place-items-center rounded-xl border border-[#D7E1EE] bg-white p-2 text-center transition duration-150 hover:-translate-y-0.5 hover:border-[#1E7AF2]/35">
                    <TechIcon name={tech.icon} className="h-7 w-7" />
                    <span className="mt-1 text-[10px] font-semibold text-[#334A68]">{tech.name}</span>
                  </Link>
                ))}
              </div>
              <Link href="/domains" className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold text-[#1E7AF2]">Explore every learning path <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {paths.map((path, index) => (
                <Link key={path.href} href={path.href} className={`${surface} group relative flex min-h-[150px] gap-4 overflow-hidden p-5 transition duration-200 hover:-translate-y-1 hover:border-[#1E7AF2]/35 hover:shadow-[0_17px_30px_rgba(15,35,70,.10)]`}>
                  <span className="absolute right-0 top-0 h-20 w-20 rounded-bl-[50px] bg-[#EEF5FF]" aria-hidden="true" />
                  <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#EEF5FF] shadow-[0_6px_0_rgba(207,224,245,.7)]"><TechIcon name={path.icon} className="h-7 w-7" /></span>
                  <span className="min-w-0">
                    <span className="flex items-start justify-between gap-2"><strong className="text-[13px] leading-5 text-[#0F2346]">{path.title}</strong><span className="rounded-md bg-[#F2F6FB] px-2 py-1 text-[9px] font-semibold text-[#60738F]">{index + 1}</span></span>
                    <span className="mt-1 block text-[10px] font-semibold text-[#1E7AF2]">{path.level}</span>
                    <span className="mt-2 line-clamp-2 block text-[11px] leading-4 text-[#60738F]">{path.topics}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </PageContainer>
      </section>

      <section aria-labelledby="home-engines-heading" className="border-t border-[#D7E1EE] bg-white py-12 sm:py-14">
        <PageContainer wide className="max-w-[1240px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#E87500]">Two more ways to prepare</p>
            <h2 id="home-engines-heading" className="mt-3 text-[26px] font-semibold tracking-[-.025em] text-[#0F2346] sm:text-[30px]">Architecture and interview answers need different rooms.</h2>
            <p className="mt-3 text-[13px] leading-6 text-[#60738F]">See request flow as a connected system, then practise explaining an answer with the structure an interviewer listens for.</p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <Link href="/system-design" className="group overflow-hidden rounded-[15px] border border-[#F0D9BF] bg-[#FFF9F1] shadow-[0_8px_26px_rgba(157,97,30,.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(157,97,30,.14)]">
              <div className="grid min-h-[304px] md:grid-cols-[.88fr_1.12fr]">
                <div className="p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFE8CA] text-[#C86A06] shadow-[0_6px_0_rgba(243,204,158,.9)]"><Network className="h-6 w-6" /></span><p className="mt-5 text-[10px] font-semibold uppercase tracking-[.14em] text-[#C86A06]">System Design</p><h3 className="mt-2 text-[21px] font-semibold tracking-[-.025em] text-[#42260D]">Follow every request through the system.</h3><p className="mt-3 text-[12px] leading-5 text-[#73553A]">Requirements, request flow, architecture choices, capacity and trade-offs—connected in one visual case.</p><span className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold text-[#C86A06]"><Play className="h-3.5 w-3.5" /> Open architecture walkthrough</span></div>
                <div className="border-t border-[#F0D9BF] bg-[radial-gradient(circle_at_top_right,#FFF0D9,transparent_55%),#FFFDF9] p-5 md:border-l md:border-t-0"><div className="flex items-center justify-between text-[10px] font-semibold text-[#9B6B38]"><span>URL shortener</span><span>Request flow</span></div><div className="mt-8 grid grid-cols-3 items-center gap-2 text-center text-[9px] font-semibold text-[#5B4128]"><span className="rounded-xl border border-[#F0D9BF] bg-white p-3 shadow-sm"><Route className="mx-auto mb-2 h-5 w-5 text-[#E87500]" />Client</span><Workflow className="mx-auto h-4 w-4 text-[#E87500]" /><span className="rounded-xl border border-[#F0D9BF] bg-white p-3 shadow-sm"><Layers3 className="mx-auto mb-2 h-5 w-5 text-[#C86A06]" />API</span><span className="rounded-xl border border-[#F0D9BF] bg-white p-3 shadow-sm"><GitBranch className="mx-auto mb-2 h-5 w-5 text-[#2E9B69]" />Cache</span><Workflow className="mx-auto h-4 w-4 text-[#E87500]" /><span className="rounded-xl border border-[#F0D9BF] bg-white p-3 shadow-sm"><Scale className="mx-auto mb-2 h-5 w-5 text-[#C86A06]" />Database</span></div><div className="mt-7 flex items-center justify-between rounded-xl border border-[#F0D9BF] bg-white/85 px-3 py-2 text-[10px] text-[#73553A]"><span>Capacity</span><strong className="text-[#42260D]">10k req/s</strong><span>Cache hit</span><strong className="text-[#2E9B69]">92%</strong></div></div>
              </div>
            </Link>
            <Link href="/prep" className="group overflow-hidden rounded-[15px] border border-[#CBE8E1] bg-[#F2FBF8] shadow-[0_8px_26px_rgba(17,107,90,.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(17,107,90,.13)]">
              <div className="grid min-h-[304px] md:grid-cols-[.88fr_1.12fr]">
                <div className="p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#D9F3EB] text-[#137A69] shadow-[0_6px_0_rgba(185,229,217,.9)]"><MessageSquareText className="h-6 w-6" /></span><p className="mt-5 text-[10px] font-semibold uppercase tracking-[.14em] text-[#137A69]">Interview answer coach</p><h3 className="mt-2 text-[21px] font-semibold tracking-[-.025em] text-[#123E38]">Turn a correct idea into a clear answer.</h3><p className="mt-3 text-[12px] leading-5 text-[#4C716A]">A short, structured explanation for conceptual questions—what it is, why it matters, and how you would use it.</p><span className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold text-[#137A69]"><Play className="h-3.5 w-3.5" /> Practise an interview answer</span></div>
                <div className="border-t border-[#CBE8E1] bg-[radial-gradient(circle_at_top_right,#D9F5ED,transparent_56%),#FCFFFE] p-5 md:border-l md:border-t-0"><div className="flex items-center justify-between text-[10px] font-semibold text-[#4C716A]"><span>Core Java</span><span>Answer frame</span></div><div className="mt-5 rounded-2xl border border-[#CBE8E1] bg-white p-4 shadow-sm"><div className="flex items-start gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#D9F3EB] text-[#137A69]"><Lightbulb className="h-4 w-4" /></span><div><p className="text-[11px] font-semibold text-[#123E38]">What is dependency injection?</p><p className="mt-1 text-[10px] leading-4 text-[#61837D]">Explain the idea without starting with framework syntax.</p></div></div><div className="mt-4 space-y-2"><span className="block rounded-lg bg-[#E8F8F3] px-3 py-2 text-[10px] text-[#246258]"><b>1. Define:</b> dependencies are supplied from outside.</span><span className="block rounded-lg bg-[#E8F8F3] px-3 py-2 text-[10px] text-[#246258]"><b>2. Why:</b> lower coupling and easier testing.</span><span className="block rounded-lg bg-[#E8F8F3] px-3 py-2 text-[10px] text-[#246258]"><b>3. Apply:</b> constructor injection in Spring.</span></div></div></div>
              </div>
            </Link>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
