import type { Metadata } from "next";
import { Suspense } from "react";
import { getCanonicalOrigin } from "@/lib/seo/config";
import { AudioMockInterviewContent } from "@/components/mock-interviews-v2";

export const metadata: Metadata = {
  title: "AI Voice Mock Interview | InterviewExplainer",
  description:
    "Practice with an AI voice interviewer. Speak your answers aloud, get real-time transcription, and receive automated feedback on your mock interview.",
  alternates: { canonical: `${getCanonicalOrigin()}/mock-interviews/audio` },
  robots: { index: false, follow: true },
};

export default function AudioMockInterviewPage() {
  return (
    <Suspense>
      <AudioMockInterviewContent />
    </Suspense>
  );
}
