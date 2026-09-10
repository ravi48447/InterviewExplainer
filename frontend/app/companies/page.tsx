import { Metadata } from "next";
import { buildCompaniesHubMetadata } from "@/lib/companies";
import { CompaniesHub } from "@/components/companies-v2";

export const revalidate = 3600;

export const metadata: Metadata = buildCompaniesHubMetadata();

export default function CompaniesPage() {
  return <CompaniesHub />;
}
