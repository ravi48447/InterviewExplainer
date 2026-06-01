import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPagePayload, QuestionPagePayload } from "@/lib/api";
import { getQuestionPagePayload, getJBIRawQuestion, isLockedDomain, getNextCurriculumModule, listAllQuestionParams } from "@/lib/content-reader";
import { parseDomainSlug } from "@/lib/domain-display";
import { resolveStackContent } from "@/lib/contentV2";
import type { Level } from "@/lib/contentV2-types";
import { levelKeyFromLegacy } from "@/lib/levels";
import type { ExperienceLevelKey } from "@/lib/levels";
import { getSeoSlugForModule } from "@/lib/seo-slugs";
import { PILLAR_HUBS } from "@/lib/seo-pillars";

import QuestionPageLayout from "@/components/question/QuestionPageLayout";
import type {
  V2ExtendedFields,
  RelatedPillarRef,
  NextCurriculumModuleRef,
} from "@/components/question/QuestionPageLayout";
import ContentTreeNav from "@/components/ContentTreeNav";

/**
 * Returns the canonical domain slug with any legacy numeric level suffix
 * replaced by its canonical word form (beginner / intermediate / advanced).
 * E.g. "java-backend-0-1" → "java-backend-beginner"
 *      "java-backend-beginner" → unchanged
 */
function canonicaliseDomainSlug(domainSlug: string): string {
  const parsed = parseDomainSlug(domainSlug);
  if (!parsed) return domainSlug;
  return `${parsed.langSlug}-${parsed.trackSlug}-${parsed.levelKey}`;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return listAllQuestionParams();
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
  params: Promise<{
    domainSlug: string;
    stackSlug: string;
    questionSlug: string;
  }>;
}): Promise<Metadata> {
  const { domainSlug, stackSlug, questionSlug } = await params;

  const jsonData = getQuestionPagePayload(domainSlug, stackSlug, questionSlug);
  // For locked domains (JBI, JFI, …) the JSON tree is the single source of
  // truth — never hit the Spring Boot backend from dev SSR, because the dev
  // box may not have it running and the fetch adds pointless contention.
  const data =
    jsonData ??
    (isLockedDomain(domainSlug)
      ? null
      : await fetchPagePayload(questionSlug).catch(() => null));
  if (!data) return { title: "Question Not Found" };

  // Canonical resolution (per content/ARCHITECTURE.md):
  //   1. If this module is exposed via a System-2 SEO URL, that is canonical.
  //      App URL → rel=canonical → /{seoSlug}/{questionSlug}.
  //   2. Otherwise fall back to the /interview/... legacy canonical for
  //      non-migrated domains.
  //   3. Last resort: self-canonical on the App URL.
  const parsed = parseDomainSlug(domainSlug);
  const strippedStack = stackSlug.replace(/^\d+-/, "");
  const seoSlug = getSeoSlugForModule(domainSlug, strippedStack);
  const canonicalUrl = seoSlug
    ? `${SITE_URL}/${seoSlug}/${questionSlug}`
    : parsed
      ? `${SITE_URL}/interview/${parsed.langSlug}/${parsed.trackSlug}/${parsed.levelKey}/${strippedStack}/${questionSlug}`
      : `${SITE_URL}/${domainSlug}/${stackSlug}/${questionSlug}`;
  const title = data.metaTitle ?? `${data.title} | InterviewExplainer`;
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
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function QuestionPage({
  params,
}: {
  params: Promise<{
    domainSlug: string;
    stackSlug: string;
    questionSlug: string;
  }>;
}) {
  const { domainSlug, stackSlug, questionSlug } = await params;
  let data: QuestionPagePayload;

  const jsonPayload = getQuestionPagePayload(
    domainSlug,
    stackSlug,
    questionSlug
  );

  if (jsonPayload) {
    data = jsonPayload;
  } else if (isLockedDomain(domainSlug)) {
    // Locked domains have no Spring Boot fallback — JSON tree is canonical.
    notFound();
  } else {
    try {
      data = await fetchPagePayload(questionSlug);
    } catch {
      notFound();
    }
  }

  // Extract extended fields (direct_answer, interviewer_intent, …).
  // Preferred source = locked-domain tree (canonical post-Phase-E). Falls back
  // to V2 for non-migrated domains that still use the content/interview/ tree.
  // For reused modules in a locked domain (e.g. JFI → JBI via contentSource),
  // getJBIRawQuestion transparently follows the fallback.
  let v2: V2ExtendedFields = {};
  const parsed = parseDomainSlug(domainSlug);
  if (isLockedDomain(domainSlug)) {
    const raw = getJBIRawQuestion(domainSlug, stackSlug, questionSlug);
    if (raw) {
      v2 = {
        directAnswer: raw.direct_answer as V2ExtendedFields["directAnswer"],
        interviewerIntent: raw.interviewer_intent as V2ExtendedFields["interviewerIntent"],
        companyTags: raw.company_tags as V2ExtendedFields["companyTags"],
        followupQuestions: raw.followup_questions as V2ExtendedFields["followupQuestions"],
        lastUpdated: raw.last_updated as V2ExtendedFields["lastUpdated"],
        layoutType: raw.layout_type as V2ExtendedFields["layoutType"],
      };
    }
  } else if (parsed) {
    const content = resolveStackContent(
      parsed.langSlug,
      parsed.trackSlug,
      parsed.levelKey as Level,
      stackSlug
    );
    const rawQuestion = content?.questions.find(
      (q) => q.slug === questionSlug
    );
    if (rawQuestion) {
      v2 = {
        directAnswer: rawQuestion.direct_answer,
        interviewerIntent: rawQuestion.interviewer_intent,
        companyTags: rawQuestion.company_tags,
        followupQuestions: rawQuestion.followup_questions,
        lastUpdated: rawQuestion.last_updated,
        layoutType: rawQuestion.layout_type,
      };
    }
  }

  // Level key for badge
  const parts = domainSlug.split("-");
  const suffix = parts[parts.length - 1];
  const levelKey = levelKeyFromLegacy(suffix);

  // Breadcrumbs — always link to canonical (word-level) domain slug
  const breadcrumbs = [
    {
      label: toDisplayName(canonicaliseDomainSlug(domainSlug)),
      href: `/${canonicaliseDomainSlug(domainSlug)}`,
    },
    {
      label: data.stackName ?? toDisplayName(stackSlug),
      href: `/${canonicaliseDomainSlug(domainSlug)}/${stackSlug}`,
    },
  ];

  // JSON-LD structured data — point itemList and Article.url at the SEO URL
  // when available so rich results aggregate on the canonical host.
  const canonicalDomainSlug = canonicaliseDomainSlug(domainSlug);
  const strippedStackJsonLd = stackSlug.replace(/^\d+-/, "");
  const seoSlugJsonLd = getSeoSlugForModule(domainSlug, strippedStackJsonLd);
  const canonicalUrl = seoSlugJsonLd
    ? `${SITE_URL}/${seoSlugJsonLd}/${questionSlug}`
    : `${SITE_URL}/${canonicalDomainSlug}/${stackSlug}/${questionSlug}`;
  const canonicalStackUrl = seoSlugJsonLd
    ? `${SITE_URL}/${seoSlugJsonLd}`
    : `${SITE_URL}/${canonicalDomainSlug}/${stackSlug}`;
  const speakableText =
    data.answerSections?.find((s) => s.sectionType === "speakable_answer")
      ?.content ?? "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: data.stackName ?? "Stack",
            item: canonicalStackUrl,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: data.title,
            item: canonicalUrl,
          },
        ],
      },
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
        educationalLevel: domainSlug.includes("advanced")
          ? "Advanced"
          : domainSlug.includes("beginner")
            ? "Beginner"
            : "Intermediate",
      },
    ],
  };

  // Pillar hubs that contain the current module. Empty for tracks whose
  // modules aren't registered in PILLAR_HUBS (Python, Android, etc.) — in
  // which case the layout simply omits the "Related prep categories" card.
  const moduleSlugForLookup = stackSlug.replace(/^\d+-/, "");
  const relatedPillars: RelatedPillarRef[] = PILLAR_HUBS.filter((p) =>
    p.moduleSlugs.includes(moduleSlugForLookup)
  ).map((p) => ({
    pillarSlug: p.pillarSlug,
    title: p.title,
    tagline: p.tagline,
  }));

  // Next module in the locked-domain curriculum (JBI/JFI). Returns null for
  // non-locked tracks and for the last module — both correctly suppress the
  // "Up next in your roadmap" card.
  const nextModule = getNextCurriculumModule(domainSlug, stackSlug);
  const nextCurriculumModule: NextCurriculumModuleRef | undefined = nextModule
    ? {
        href: `/${domainSlug}/${nextModule.moduleSlug}`,
        title: nextModule.title,
        pillarName: nextModule.pillarName,
        moduleNumber: nextModule.moduleNumber,
      }
    : undefined;

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
        stackSlug={stackSlug}
        questionSlug={questionSlug}
        questionUrlPrefix={`/${domainSlug}`}
        sidebar={
          <ContentTreeNav
            domainSlug={domainSlug}
            activeStackSlug={stackSlug}
            activeQuestionSlug={questionSlug}
          />
        }
        relatedPillars={relatedPillars}
        nextCurriculumModule={nextCurriculumModule}
      />
    </>
  );
}
