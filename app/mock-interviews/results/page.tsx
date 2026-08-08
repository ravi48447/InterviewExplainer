import type { Metadata } from "next";
import { Suspense } from "react";
import { getCanonicalOrigin } from "@/lib/seo/config";
import { MockInterviewResultsContent } from "@/components/mock-interviews-v2";

export const metadata: Metadata = {
  title: "Mock Interview Results | InterviewExplainer",
  description:
    "Review your mock interview performance: overall score, skill breakdown, question-by-question feedback, strengths, and recommended next practice areas.",
  alternates: { canonical: `${getCanonicalOrigin()}/mock-interviews/results` },
  robots: { index: false, follow: true },
};

export default function MockInterviewResultsPage() {
  return (
    <Suspense>
      <MockInterviewResultsContent />
    </Suspense>
  );
}
