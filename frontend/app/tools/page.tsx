import { Metadata } from "next";
import { buildToolsHubMetadata } from "@/lib/tools";
import { ToolsHub } from "@/components/tools-v2";

export const revalidate = 3600;

export const metadata: Metadata = buildToolsHubMetadata();

export default function ToolsIndexPage() {
  return <ToolsHub />;
}
