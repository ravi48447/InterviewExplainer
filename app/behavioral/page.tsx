import { Metadata } from "next";
import { buildBehavioralHubMetadata } from "@/lib/learning";
import { BehavioralHub } from "@/components/learning-v2";

export const revalidate = 3600;

export const metadata: Metadata = buildBehavioralHubMetadata();

export default function BehavioralPage() {
  return <BehavioralHub />;
}
