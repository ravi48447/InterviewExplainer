import { notFound } from "next/navigation"
import { buildDSACategoryMetadata, loadDSACategory, listCategoryParams } from "@/lib/dsa"
import { DSAListing } from "@/components/dsa-v2"

export const revalidate = 3600

export async function generateStaticParams() {
  return listCategoryParams()
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const data = loadDSACategory(category)
  if (!data) return {}
  return buildDSACategoryMetadata(data)
}

export default async function DSACategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const data = loadDSACategory(category)
  if (!data) notFound()
  return <DSAListing data={data} kicker={`${data.name} guide`} heading={`How to master ${data.name}`} />
}
