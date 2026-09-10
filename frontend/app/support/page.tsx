import type { Metadata } from "next";
import { getCanonicalOrigin } from "@/lib/seo/config";
import { SupportContent } from "@/components/support-v2";

export const metadata: Metadata = {
  title: "Help & Support | InterviewExplainer",
  description:
    "Find answers to common questions about InterviewExplainer, or reach out to our support team. We cover account, progress tracking, content topics, and more.",
  alternates: { canonical: `${getCanonicalOrigin()}/support` },
};

export default function SupportPage() {
  return <SupportContent />;
}
