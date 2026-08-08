import { DSADifficultyPage } from "@/components/dsa/DifficultyPage"
import { buildDSADifficultyMetadata } from "@/lib/dsa"

export const revalidate = 3600

export const metadata = buildDSADifficultyMetadata("hard")

export default function Page() {
  return (
    <DSADifficultyPage
      difficulty="hard"
      title="Hard DSA Interview Questions"
      tagline="Senior-level problems that chain multiple patterns or demand a non-obvious invariant. We decompose each one into the building blocks you already know, so hards feel like three mediums stacked."
    />
  )
}
