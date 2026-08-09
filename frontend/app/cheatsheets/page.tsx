import { Metadata } from "next";
import { buildCheatsheetsHubMetadata } from "@/lib/learning";
import { CheatsheetsHub } from "@/components/learning-v2";

export const revalidate = 3600;

export const metadata: Metadata = buildCheatsheetsHubMetadata();

export default function CheatsheetsPage() {
  return <CheatsheetsHub />;
}
