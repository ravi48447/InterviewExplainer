import { Metadata } from "next";
import {
  loadComparePage,
  buildCompareMetadata,
  listCompareParams,
} from "@/lib/compare";
import { CompareDetail } from "@/components/compare-v2";

export const revalidate = 3600;

export async function generateStaticParams() {
  return listCompareParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = loadComparePage(slug);
  return buildCompareMetadata(data);
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = loadComparePage(slug);
  return <CompareDetail data={data} />;
}
