import { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadTrackHub, buildTrackHubMetadata } from "@/lib/curriculum";
import { TrackHub } from "@/components/curriculum-v2";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string; track: string }> }): Promise<Metadata> {
  const { lang, track } = await params;
  const data = loadTrackHub(lang, track);
  return buildTrackHubMetadata(data);
}

export default async function TrackHubPage({ params }: { params: Promise<{ lang: string; track: string }> }) {
  const { lang, track } = await params;
  const data = loadTrackHub(lang, track);
  if (!data) notFound();
  return <TrackHub data={data} />;
}
