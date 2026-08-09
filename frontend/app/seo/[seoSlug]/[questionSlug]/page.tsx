import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSeoModuleBySlug, getCanonicalFromAlt } from "@/lib/seo-slugs";
import { getQuestionPagePayload, getJBIRawQuestion } from "@/lib/content-reader";
import { levelKeyFromLegacy } from "@/lib/levels";
import QuestionPageLayout from "@/components/question/QuestionPageLayout";
import type {
  RelatedPillarRef,
  V2ExtendedFields,
} from "@/components/question/QuestionPageLayout";
import PillarTreeNav from "@/components/PillarTreeNav";
import {
  completeTrackCtaForModule,
  getModulesForPillar,
  getPillarsForModule,
  getPrimaryPillarForModule,
} from "@/lib/seo-pillars";

/**
 * SEO "canonical question" page — e.g.
 *   /spring-boot-interview-questions/what-is-auto-configuration-in-spring-boot
 *
 * Per content/ARCHITECTURE.md this URL is the canonical, Google-indexed form
 * for a single question. The App URL variant
 *   /{domainSlug}/{moduleSlug}/{questionSlug}
 * points rel=canonical → here.
 */

export const revalidate = 3600;
// Fully static: every {seoSlug, questionSlug} tuple is enumerated by
// generateStaticParams at build time. Unknown tuples 404 rather than
// rendering on-demand — on-demand rendering would call `fs`-based content
// resolvers (getQuestionPagePayload), which do not exist on Cloudflare
// Workers.
export const dynamicParams = false;

export async function generateStaticParams() {
  const { listAllQuestionParams } = await import("@/lib/content-reader");
  const { getSeoSlugForModule } = await import("@/lib/seo-slugs");
  const seen = new Set<string>();
  const params: { seoSlug: string; questionSlug: string }[] = [];
  for (const { domainSlug, stackSlug, questionSlug } of listAllQuestionParams()) {
    const seoSlug = getSeoSlugForModule(domainSlug, stackSlug);
    if (!seoSlug) continue;
    const key = `${seoSlug}/${questionSlug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    params.push({ seoSlug, questionSlug });
  }
  return params;
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

function toDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ seoSlug: string; questionSlug: string }>;
}): Promise<Metadata> {
  const { seoSlug, questionSlug } = await params;
  const entry = getSeoModuleBySlug(seoSlug);
  if (!entry) return { title: "Question Not Found" };

  const data = getQuestionPagePayload(
    entry.domainSlug,
    entry.moduleSlug,
    questionSlug,
  );
  if (!data) return { title: "Question Not Found" };

  const canonicalUrl = `${SITE_URL}/${entry.seoSlug}/${questionSlug}`;
  const title = data.metaTitle ?? `${data.title} | ${entry.title} Interview Q&A`;
  const description = data.metaDescription ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: "InterviewExplainer",
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}

export default async function SeoQuestionPage({
  params,
}: {
  params: Promise<{ seoSlug: string; questionSlug: string }>;
}) {
  const { seoSlug, questionSlug } = await params;

  // Belt-and-suspenders: middleware already 301s alt slugs, but if someone
  // bypasses it (e.g. internal rewrite bug) don't render duplicate content.
  if (getCanonicalFromAlt(seoSlug)) notFound();

  const entry = getSeoModuleBySlug(seoSlug);
  if (!entry) notFound();

  const data = getQuestionPagePayload(
    entry.domainSlug,
    entry.moduleSlug,
    questionSlug,
  );
  if (!data) notFound();

  // Extended fields live in the JBI tree post-Phase-E (direct_answer,
  // interviewer_intent, company_tags, followup_questions, last_updated,
  // layout_type). SEO URLs only cover migrated (JBI) modules, so we can skip
  // the V2 fallback entirely.
  let v2: V2ExtendedFields = {};
  const raw = getJBIRawQuestion(entry.domainSlug, entry.moduleSlug, questionSlug);
  if (raw) {
    v2 = {
      directAnswer: raw.direct_answer as V2ExtendedFields["directAnswer"],
      interviewerIntent: raw.interviewer_intent as V2ExtendedFields["interviewerIntent"],
      companyTags: raw.company_tags as V2ExtendedFields["companyTags"],
      followupQuestions: raw.followup_questions as V2ExtendedFields["followupQuestions"],
      lastUpdated: raw.last_updated as V2ExtendedFields["lastUpdated"],
      layoutType: raw.layout_type as V2ExtendedFields["layoutType"],
      speakableV2: raw.speakable_v2 as V2ExtendedFields["speakableV2"],
    };
  }

  const levelKey = levelKeyFromLegacy(
    entry.domainSlug.split("-").slice(-1)[0],
  );

  // Resolve the pillar context for this module. The left tree, breadcrumbs,
  // and "related categories" footer all key off this — so a visitor who
  // landed on /spring-boot-interview-questions/<q> sees the Spring sidebar,
  // not the entire Java backend curriculum.
  const primaryPillar = getPrimaryPillarForModule(entry.moduleSlug);
  const pillarModules = primaryPillar
    ? getModulesForPillar(primaryPillar)
    : [entry];

  const trackCta = completeTrackCtaForModule(entry.moduleSlug);

  const allPillarsForModule = getPillarsForModule(entry.moduleSlug);
  const relatedPillars: RelatedPillarRef[] = allPillarsForModule.map((p) => ({
    pillarSlug: p.pillarSlug,
    title: p.title,
    tagline: p.tagline,
  }));

  // Breadcrumbs point to the SEO module landing page, prefixed with the
  // pillar so users have a clear path back up to a topical hub.
  const breadcrumbs = primaryPillar
    ? [
        {
          label: primaryPillar.title.replace(/\s+Interview Prep.*$/, ""),
          href: `/${primaryPillar.pillarSlug}`,
        },
        {
          label: `${entry.title} Interview Questions`,
          href: `/${entry.seoSlug}`,
        },
      ]
    : [
        {
          label: `${entry.title} Interview Questions`,
          href: `/${entry.seoSlug}`,
        },
      ];

  const canonicalUrl = `${SITE_URL}/${entry.seoSlug}/${questionSlug}`;
  const moduleUrl = `${SITE_URL}/${entry.seoSlug}`;
  const speakableText =
    data.answerSections?.find((s) => s.sectionType === "speakable_answer")
      ?.content ?? "";

  // Build BreadcrumbList JSON-LD that mirrors the visible breadcrumb trail
  // (Home → Pillar → Module → Question), or collapses the pillar segment
  // when the module isn't in a registered hub.
  const breadcrumbsJsonLd = primaryPillar
    ? [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: primaryPillar.title.replace(/\s+Interview Prep.*$/, ""),
          item: `${SITE_URL}/${primaryPillar.pillarSlug}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${entry.title} Interview Questions`,
          item: moduleUrl,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: data.title,
          item: canonicalUrl,
        },
      ]
    : [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: `${entry.title} Interview Questions`,
          item: moduleUrl,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: data.title,
          item: canonicalUrl,
        },
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: breadcrumbsJsonLd },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: data.questionText ?? data.title,
            acceptedAnswer: {
              "@type": "Answer",
              text: v2.directAnswer ?? speakableText.slice(0, 500),
            },
          },
        ],
      },
      {
        "@type": "Article",
        headline: data.title,
        description: data.metaDescription ?? undefined,
        url: canonicalUrl,
        author: { "@type": "Organization", name: "InterviewExplainer" },
        publisher: {
          "@type": "Organization",
          name: "InterviewExplainer",
          url: SITE_URL,
        },
        dateModified: new Date().toISOString().split("T")[0],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <QuestionPageLayout
        data={data}
        v2={v2}
        breadcrumbs={breadcrumbs}
        levelKey={levelKey}
        stackSlug={entry.moduleSlug}
        questionSlug={questionSlug}
        questionUrlPrefix={`/${entry.seoSlug}`}
        questionUrlSkipStack
        relatedPillars={relatedPillars}
        roadmapCta={{
          title: trackCta.title,
          tagline: trackCta.tagline,
          href: trackCta.href,
          ctaLabel: trackCta.ctaLabel,
          secondaryHref: trackCta.secondaryHref,
          secondaryLabel: trackCta.secondaryLabel,
        }}
        sidebar={
          <PillarTreeNav
            pillarTitle={primaryPillar?.title ?? entry.title}
            pillarSlug={primaryPillar?.pillarSlug ?? entry.seoSlug}
            modules={pillarModules.map((m) => ({
              seoSlug: m.seoSlug,
              moduleSlug: m.moduleSlug,
              domainSlug: m.domainSlug,
              title: m.title,
            }))}
            activeSeoSlug={entry.seoSlug}
            activeQuestionSlug={questionSlug}
            structuredTrackHref={trackCta.href}
            structuredTrackCtaLabel={trackCta.ctaLabel}
          />
        }
      />
    </>
  );
}
