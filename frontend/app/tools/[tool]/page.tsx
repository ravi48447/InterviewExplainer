import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  loadToolHub,
  buildToolMetadata,
  buildToolFallbackMetadata,
  allToolSlugs,
} from "@/lib/tools";
import { ToolDetail } from "@/components/tools-v2";

export const revalidate = 3600;

export async function generateStaticParams() {
  return allToolSlugs().map((tool) => ({ tool }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}): Promise<Metadata> {
  const { tool } = await params;
  const data = loadToolHub(tool);
  return data ? buildToolMetadata(data) : buildToolFallbackMetadata(tool);
}

export default async function ToolHubPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool } = await params;
  const data = loadToolHub(tool);
  if (!data) notFound();
  return <ToolDetail data={data} />;
}
