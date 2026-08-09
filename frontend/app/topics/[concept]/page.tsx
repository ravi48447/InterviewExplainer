import { Metadata } from "next";
import { loadTopicConcept, buildTopicConceptMetadata, allTopicSlugs } from "@/lib/topics";
import { TopicConcept } from "@/components/topics-v2";

export const revalidate = 3600;

export async function generateStaticParams() {
  return allTopicSlugs().map((concept) => ({ concept }));
}

export async function generateMetadata({ params }: { params: Promise<{ concept: string }> }): Promise<Metadata> {
  const { concept } = await params;
  const data = loadTopicConcept(concept);
  return buildTopicConceptMetadata(data);
}

export default async function TopicHubPage({ params }: { params: Promise<{ concept: string }> }) {
  const { concept } = await params;
  const data = loadTopicConcept(concept);
  return <TopicConcept data={data} />;
}
