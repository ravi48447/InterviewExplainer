import { notFound } from "next/navigation"
import { buildDSAPatternMetadata, loadDSAPattern, listPatternParams } from "@/lib/dsa"
import { DSAListing } from "@/components/dsa-v2"

export const revalidate = 3600

export async function generateStaticParams() {
  return listPatternParams()
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = loadDSAPattern(slug)
  if (!data) return {}
  return buildDSAPatternMetadata(data)
}

export default async function DSAPatternPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = loadDSAPattern(slug)
  if (!data) notFound()
  return <DSAListing data={data} kicker="Pattern guide" heading={`Mastering the ${data.name} pattern`} />
}
