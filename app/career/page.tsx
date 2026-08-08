import { Metadata } from "next";
import { buildCareerHubMetadata } from "@/lib/learning";
import { CareerHub } from "@/components/learning-v2";

export const revalidate = 3600;

export const metadata: Metadata = buildCareerHubMetadata();

export default function CareerPage() {
  return <CareerHub />;
}
