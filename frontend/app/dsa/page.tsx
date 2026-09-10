import { buildDSAHubMetadata, loadDSAHub } from "@/lib/dsa"
import { DSAHub } from "@/components/dsa-v2"

export const revalidate = 3600

export const metadata = buildDSAHubMetadata()

export default function DSAHubPage() {
  const data = loadDSAHub()
  return <DSAHub data={data} />
}
