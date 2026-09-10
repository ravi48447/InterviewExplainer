import { Metadata } from "next";
import { loadPrepHub, buildPrepHubMetadata } from "@/lib/learning";
import { PrepHub } from "@/components/learning-v2";

export const revalidate = 3600;

export const metadata: Metadata = buildPrepHubMetadata();

export default function PrepIndexPage() {
  const data = loadPrepHub();
  return <PrepHub data={data} />;
}
