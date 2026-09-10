import { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadLangHub, buildLangHubMetadata } from "@/lib/curriculum";
import { LangHub } from "@/components/curriculum-v2";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const data = loadLangHub(lang);
  if (!data) return { title: "Not Found" };
  return buildLangHubMetadata(data);
}

export default async function LangHubPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const data = loadLangHub(lang);
  if (!data) notFound();
  return <LangHub data={data} />;
}
