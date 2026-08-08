/**
 * app/community/questions/[id]/page.tsx — Reported question detail route (P13-WF).
 * Indexable (public community content).
 */

import { QuestionDetailShell } from "@/components/community-v2";
import { buildReportedQuestionMetadata } from "@/lib/community";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return buildReportedQuestionMetadata(id);
}

export default async function ReportedQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="page-container py-12">
      <QuestionDetailShell questionId={id} />
    </main>
  );
}
