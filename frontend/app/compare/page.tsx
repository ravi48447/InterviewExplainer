import { Metadata } from "next";
import { buildCompareHubMetadata } from "@/lib/compare";
import { CompareHub } from "@/components/compare-v2";

export const revalidate = 3600;

export const metadata: Metadata = buildCompareHubMetadata();

export default function ComparePage() {
  return <CompareHub />;
}
