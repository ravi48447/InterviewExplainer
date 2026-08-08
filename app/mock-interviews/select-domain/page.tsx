import type { Metadata } from "next";
import { Suspense } from "react";
import { getCanonicalOrigin } from "@/lib/seo/config";
import { SelectDomainContent } from "@/components/mock-interviews-v2";

export const metadata: Metadata = {
  title: "Select Domain | Mock Interviews | InterviewExplainer",
  description:
    "Choose your interview domain and difficulty level to start a targeted AI mock interview. Practice Java, system design, SQL, frontend, and more.",
  alternates: { canonical: `${getCanonicalOrigin()}/mock-interviews/select-domain` },
  robots: { index: false, follow: true },
};

export default function SelectDomainPage() {
  return (
    <Suspense>
      <SelectDomainContent />
    </Suspense>
  );
}
