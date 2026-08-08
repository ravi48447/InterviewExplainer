import { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadLevelHub, buildLevelHubMetadata } from "@/lib/curriculum";
import { LevelHub } from "@/components/curriculum-v2";
import type { Level } from "@/lib/contentV2-types";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string; track: string; level: string }> }): Promise<Metadata> {
  const { lang, track, level } = await params;
  const data = loadLevelHub(lang, track, level as Level);
  if (!data) return { title: "Not Found" };
  return buildLevelHubMetadata(data);
}

export default async function LevelHubPage({ params }: { params: Promise<{ lang: string; track: string; level: string }> }) {
  const { lang, track, level } = await params;
  const data = loadLevelHub(lang, track, level as Level);
  if (!data) notFound();
  return <LevelHub data={data} />;
}
