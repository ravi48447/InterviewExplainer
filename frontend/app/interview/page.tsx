import { Metadata } from "next";
import { loadInterviewHub, buildInterviewHubMetadata } from "@/lib/curriculum";
import { InterviewHub } from "@/components/curriculum-v2";

export const revalidate = 3600;

export const metadata: Metadata = buildInterviewHubMetadata();

export default function InterviewIndexPage() {
  const langData = loadInterviewHub();
  return <InterviewHub langData={langData} />;
}
