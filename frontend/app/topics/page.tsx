import { Metadata } from "next";
import { buildTopicsHubMetadata } from "@/lib/topics";
import { TopicsHub } from "@/components/topics-v2";

export const revalidate = 3600;

export const metadata: Metadata = buildTopicsHubMetadata();

export default function TopicsPage() {
  return <TopicsHub />;
}
