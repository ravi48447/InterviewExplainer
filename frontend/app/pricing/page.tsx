import type { Metadata } from "next";
import { getCanonicalOrigin } from "@/lib/seo/config";
import { PricingContent } from "@/components/pricing-v2";

export const metadata: Metadata = {
  title: "Pricing | InterviewExplainer",
  description:
    "All learning content is free forever. Pro unlocks the personalized dashboard, multi-domain workspace, and progress tracking — free during beta.",
  alternates: { canonical: `${getCanonicalOrigin()}/pricing` },
};

export default function PricingPage() {
  return <PricingContent />;
}
