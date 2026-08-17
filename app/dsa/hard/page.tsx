import { Metadata } from "next";
import { DSADifficultyPage } from "@/components/dsa/DifficultyPage";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    "Hard DSA Interview Questions — LeetCode Hards Explained | InterviewExplainer",
  description:
    "Hard LeetCode-style problems broken down into reusable patterns. Every solution ships in Java and Python with brute-force reasoning, optimal insight, and interview talking points.",
  alternates: { canonical: `${SITE_URL}/dsa/hard` },
};

export default function Page() {
  return (
    <DSADifficultyPage
      difficulty="hard"
      title="Hard DSA Interview Questions"
      tagline="Senior-level problems that chain multiple patterns or demand a non-obvious invariant. We decompose each one into the building blocks you already know, so hards feel like three mediums stacked."
    />
  );
}
