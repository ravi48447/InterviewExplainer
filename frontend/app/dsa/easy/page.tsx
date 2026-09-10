import { DSADifficultyPage } from "@/components/dsa/DifficultyPage"
import { buildDSADifficultyMetadata } from "@/lib/dsa"

export const revalidate = 3600

export const metadata = buildDSADifficultyMetadata("easy")

export default function Page() {
  return (
    <DSADifficultyPage
      difficulty="easy"
      title="Easy DSA Interview Questions"
      tagline="Foundation-level problems that each map cleanly to one pattern. Master these first — they are the gateway to every medium and hard question an interviewer will throw at you."
    />
  )
}
