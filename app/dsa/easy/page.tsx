import { Metadata } from "next";
import { DSADifficultyPage } from "@/components/dsa/DifficultyPage";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    "Easy DSA Interview Questions — Java & Python Line-by-Line | InterviewExplainer",
  description:
    "Every easy DSA interview problem we index, grouped by module (arrays & hashing, two pointers, stacks, trees, and more). Line-by-line solutions in Java and Python.",
  alternates: { canonical: `${SITE_URL}/dsa/easy` },
};

export default function Page() {
  return (
    <DSADifficultyPage
      difficulty="easy"
      title="Easy DSA Interview Questions"
      tagline="Foundation-level problems that each map cleanly to one pattern. Master these first — they are the gateway to every medium and hard question an interviewer will throw at you."
    />
  );
}
