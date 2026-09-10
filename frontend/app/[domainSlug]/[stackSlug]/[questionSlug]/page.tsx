/**
 * Question Route — V2 canonical (P06-T041..T060, P06-T281..T320).
 *
 * Server component consuming the canonical question architecture
 * (@/lib/question). Renders a question page: header (breadcrumb nav, H1,
 * metadata row), answer sections (prose, code, callouts, tables, figures),
 * prev/next navigation, related questions, and follow-up questions.
 *
 * The question data resolver (@/lib/question/question-data) is the SINGLE
 * adapter between the content-reader payload and the V2 question page — all
 * question components consume QuestionPageData, never the raw payload
 * (P06-T041/T042). SEO metadata and structured data (FAQPage, BreadcrumbList,
 * speakable) are generated from the canonical data (P06-T281..T320).
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveQuestionPageData } from "@/lib/question";
import {
  buildQuestionMetadata,
  buildQuestionStructuredData,
  buildQuestionBreadcrumbStructuredData,
  buildQuestionSpeakable,
} from "@/lib/question";
import {
  QuestionHeader,
  AnswerRenderer,
  PrevNext,
  RelatedQuestions,
  FollowUpQuestions,
} from "@/components/question-v2";
import { listAllQuestionParams } from "@/lib/content-reader";

export const revalidate = 3600;
// Fully static: every {domainSlug,stackSlug,questionSlug} tuple is enumerated
// by generateStaticParams at build time. Unknown tuples 404 rather than
// rendering on-demand — on-demand rendering would call `fs`-based content
// resolvers, which do not exist on Cloudflare Workers.
export const dynamicParams = false;

export async function generateStaticParams() {
  return listAllQuestionParams();
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
  const data = resolveQuestionPageData(domainSlug, stackSlug, questionSlug);
  if (!data) return { title: "Question Not Found" };
  return buildQuestionMetadata(data);
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
  const data = resolveQuestionPageData(domainSlug, stackSlug, questionSlug);
  if (!data) notFound();

  const faqJsonLd = buildQuestionStructuredData(data);
  const breadcrumbJsonLd = buildQuestionBreadcrumbStructuredData(data);
  const speakable = buildQuestionSpeakable(data);

  return (
    <div className="page-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <QuestionHeader data={data} />

      <article className="reading-container py-8" data-speakable={speakable ? "" : undefined}>
        <AnswerRenderer sections={data.sections} />
      </article>

      {data.prevNext && (data.prevNext.prev || data.prevNext.next) && (
        <section className="py-8 border-t border-border">
          <PrevNext prevNext={data.prevNext} />
        </section>
      )}

      {data.related.length > 0 && (
        <section className="py-8 border-t border-border">
          <h2 className="type-section mb-4">Related Questions</h2>
          <RelatedQuestions questions={data.related} />
        </section>
      )}

      {data.followUps.length > 0 && (
        <section className="py-8 border-t border-border">
          <h2 className="type-section mb-4">Follow-up Questions</h2>
          <FollowUpQuestions questions={data.followUps} />
        </section>
      )}
    </div>
  );
}
