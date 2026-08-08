import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getV2QuestionPagePayload,
  resolveStackContent,
} from "@/lib/contentV2";
import type { Level } from "@/lib/contentV2-types";
import QuestionPageLayout from "@/components/question/QuestionPageLayout";
import type { V2ExtendedFields } from "@/components/question/QuestionPageLayout";
import V2ContentTreeNav from "@/components/V2ContentTreeNav";
import type { ExperienceLevelKey } from "@/lib/levels";

export const revalidate = 3600;

export async function generateStaticParams() {
  const { listLanguages, listTracks, listLevels, listStacksForPath, resolveStackContent } = await import("@/lib/contentV2");
  const params: { lang: string; track: string; level: string; stack: string; slug: string }[] = [];
  for (const lang of listLanguages()) {
    for (const track of listTracks(lang)) {
      for (const level of listLevels(lang, track)) {
        for (const stack of listStacksForPath(lang, track, level as import("@/lib/contentV2-types").Level)) {
          const content = resolveStackContent(lang, track, level as import("@/lib/contentV2-types").Level, stack);
          for (const q of content?.questions ?? []) {
            if (q.slug && typeof q.slug === "string") {
              params.push({ lang, track, level, stack, slug: q.slug });
            }
          }
        }
      }
    }
  }
  return params;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

function toDisplayName(slug: string): string {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

type PageParams = { lang: string; track: string; level: string; stack: string; slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { lang, track, level, stack, slug } = await params;
  const content = resolveStackContent(lang, track, level as Level, stack);
  const question = content?.questions.find(q => q.slug === slug);

  if (!question) return { title: "Question Not Found" };

  const canonicalUrl = `${SITE_URL}/interview/${lang}/${track}/${level}/${stack}/${slug}`;
  const rawTitle = question.seo?.metaTitle ?? `${question.question} | ${toDisplayName(lang)} ${toDisplayName(track)} Interview`;
  const title = rawTitle.replace(/\s*\|\s*InterviewExplainer\s*$/i, '');
  const description = question.seo?.metaDescription ?? question.direct_answer?.slice(0, 155) ?? undefined;

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
  };
}

export default async function V2QuestionPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { lang, track, level, stack, slug } = await params;
  const validLevel = level as Level;
  const payload = getV2QuestionPagePayload(lang, track, validLevel, stack, slug);
  if (!payload) notFound();

  const content = resolveStackContent(lang, track, validLevel, stack);
  const rawQuestion = content?.questions.find(q => q.slug === slug);

  const v2: V2ExtendedFields = {
    directAnswer: rawQuestion?.direct_answer,
    interviewerIntent: rawQuestion?.interviewer_intent,
    companyTags: rawQuestion?.company_tags,
    followupQuestions: rawQuestion?.followup_questions,
    lastUpdated: rawQuestion?.last_updated,
    layoutType: rawQuestion?.layout_type,
    speakableV2: rawQuestion?.speakable_v2,
  };

  const canonicalUrl = `${SITE_URL}/interview/${lang}/${track}/${level}/${stack}/${slug}`;
  const speakableText = payload.answerSections?.find(s => s.sectionType === "speakable_answer")?.content ?? "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Interview Questions", item: `${SITE_URL}/interview` },
          { "@type": "ListItem", position: 3, name: toDisplayName(lang), item: `${SITE_URL}/interview/${lang}` },
          { "@type": "ListItem", position: 4, name: toDisplayName(track), item: `${SITE_URL}/interview/${lang}/${track}` },
          { "@type": "ListItem", position: 5, name: toDisplayName(level), item: `${SITE_URL}/interview/${lang}/${track}/${level}` },
          { "@type": "ListItem", position: 6, name: toDisplayName(stack), item: `${SITE_URL}/interview/${lang}/${track}/${level}/${stack}` },
          { "@type": "ListItem", position: 7, name: payload.title, item: canonicalUrl },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: payload.questionText ?? payload.title,
            acceptedAnswer: {
              "@type": "Answer",
              text: rawQuestion?.direct_answer ?? speakableText.slice(0, 500),
            },
          },
        ],
      },
      {
        "@type": "TechArticle",
        headline: payload.title,
        description: payload.metaDescription ?? undefined,
        url: canonicalUrl,
        author: { "@type": "Organization", name: "InterviewExplainer" },
        publisher: { "@type": "Organization", name: "InterviewExplainer", url: SITE_URL },
        dateModified: rawQuestion?.last_updated ?? new Date().toISOString().split("T")[0],
        educationalLevel: level === "advanced" ? "Advanced" : level === "beginner" ? "Beginner" : "Intermediate",
        proficiencyLevel: level === "advanced" ? "Expert" : level === "beginner" ? "Beginner" : "Intermediate",
      },
    ],
  };

  const breadcrumbs = [
    { label: "Interview", href: "/interview" },
    { label: toDisplayName(lang), href: `/interview/${lang}` },
    { label: toDisplayName(track), href: `/interview/${lang}/${track}` },
    { label: toDisplayName(level), href: `/interview/${lang}/${track}/${level}` },
    { label: toDisplayName(stack), href: `/interview/${lang}/${track}/${level}/${stack}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <QuestionPageLayout
        data={payload}
        v2={v2}
        breadcrumbs={breadcrumbs}
        levelKey={validLevel as ExperienceLevelKey}
        stackSlug={stack}
        questionSlug={slug}
        questionUrlPrefix={`/interview/${lang}/${track}/${level}`}
        sidebar={
          <V2ContentTreeNav
            lang={lang}
            track={track}
            level={level}
            activeStackSlug={stack}
            activeQuestionSlug={slug}
          />
        }
      />
    </>
  );
}
