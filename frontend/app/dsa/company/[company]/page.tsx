import { notFound } from "next/navigation"
import { buildDSACompanyMetadata, loadDSACompany, listCompanyParams } from "@/lib/dsa"
import { DSAListing } from "@/components/dsa-v2"

export const revalidate = 3600

export async function generateStaticParams() {
  return listCompanyParams()
}

export async function generateMetadata({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params
  const data = loadDSACompany(company)
  if (!data) return {}
  return buildDSACompanyMetadata(data)
}

export default async function DSACompanyPage({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params
  const data = loadDSACompany(company)
  if (!data) notFound()
  return <DSAListing data={data} kicker={`${data.name} guide`} heading={`How to prepare for ${data.name} coding interviews`} />
}
