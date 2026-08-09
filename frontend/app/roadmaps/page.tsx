import { Metadata } from "next";
import { buildRoadmapsHubMetadata } from "@/lib/learning";
import { RoadmapsHub } from "@/components/learning-v2";

export const revalidate = 3600;

export const metadata: Metadata = buildRoadmapsHubMetadata();

export default function RoadmapsPage() {
  return <RoadmapsHub />;
}
