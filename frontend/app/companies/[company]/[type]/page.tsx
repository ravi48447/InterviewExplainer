import { Metadata } from "next";
import fs from "fs";
import path from "path";
import {
  resolveCompanyType,
  companyTypeFileFor,
  buildCompanyTypeMetadata,
} from "@/lib/companies";
import { CompanyType } from "@/components/companies-v2";

export const revalidate = 3600;

const COMPANIES_ROOT = path.join(process.cwd(), "..", "content", "companies");

function loadTypeContent(
  company: string,
  type: string,
): Record<string, unknown> | null {
  const file = companyTypeFileFor(type);
  if (!file) return null;
  const fpath = path.join(COMPANIES_ROOT, company, file);
  if (!fs.existsSync(fpath)) return null;
  try {
    return JSON.parse(fs.readFileSync(fpath, "utf-8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ company: string; type: string }>;
}): Promise<Metadata> {
  const { company, type } = await params;
  const content = loadTypeContent(company, type);
  const data = resolveCompanyType(company, type, content);
  return buildCompanyTypeMetadata(data);
}

export default async function CompanyTypePage({
  params,
}: {
  params: Promise<{ company: string; type: string }>;
}) {
  const { company, type } = await params;
  const content = loadTypeContent(company, type);
  const data = resolveCompanyType(company, type, content);
  return <CompanyType data={data} />;
}
