import type { Metadata } from "next";
import { getCanonicalOrigin } from "@/lib/seo/config";
import { V2ReviewContent } from "@/components/dev-v2";

export const metadata: Metadata = {
  title: "V2 Design System — Review Surface | InterviewExplainer (dev)",
  description:
    "Dev-only visual QA surface exercising the Phase 01 component set against the design token system. Not linked from public navigation.",
  alternates: { canonical: `${getCanonicalOrigin()}/dev/v2` },
  robots: { index: false, follow: false },
};

export default function V2ReviewPage() {
  return <V2ReviewContent />;
}
