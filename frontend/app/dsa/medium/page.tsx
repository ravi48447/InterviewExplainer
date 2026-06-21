import { Metadata } from "next";
import { DSADifficultyPage } from "@/components/dsa/DifficultyPage";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    "Medium LeetCode Problems — DSA Interview Questions with Java & Python | InterviewExplainer",
  description:
    "The medium DSA problems that dominate FAANG coding rounds. Grouped by module, solved with brute-force → optimal, and explained line by line in Java and Python.",
  alternates: { canonical: `${SITE_URL}/dsa/medium` },
};

export default function Page() {
  return (
    <DSADifficultyPage
      difficulty="medium"
      title="Medium DSA Interview Questions"
      tagline="Where most FAANG coding rounds are actually won or lost. Each medium problem combines two or three patterns — our walkthroughs show you exactly how to spot the combination."
    />
  );
}
