import { Metadata } from "next";
import { loadCompanyGuide, buildCompanyGuideMetadata } from "@/lib/companies";
import { CompanyGuide } from "@/components/companies-v2";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ company: string }>;
}): Promise<Metadata> {
  const { company } = await params;
  const data = loadCompanyGuide(company);
  return buildCompanyGuideMetadata(data);
}

export default async function CompanyHubPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const data = loadCompanyGuide(company);
  return <CompanyGuide data={data} />;
}
