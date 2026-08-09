import { DSADifficultyPage } from "@/components/dsa/DifficultyPage"
import { buildDSADifficultyMetadata } from "@/lib/dsa"

export const revalidate = 3600

export const metadata = buildDSADifficultyMetadata("medium")

export default function Page() {
  return (
    <DSADifficultyPage
      difficulty="medium"
      title="Medium DSA Interview Questions"
      tagline="Where most FAANG coding rounds are actually won or lost. Each medium problem combines two or three patterns — our walkthroughs show you exactly how to spot the combination."
    />
  )
}
