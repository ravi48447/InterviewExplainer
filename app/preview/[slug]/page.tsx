import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Source_Serif_4, Crimson_Pro } from "next/font/google";
import { loadPreviewArticle, listPreviewSlugs } from "@/lib/preview-loader";
import PreviewArticle from "@/components/preview/PreviewArticle";

import "highlight.js/styles/atom-one-dark.css";

// Self-host both serifs via next/font. We declare them with the actual
// family name (no CSS-variable indirection) so the chain in
// `font-family: 'Source Serif 4', Charter, …` resolves directly.
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

const crimson = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

export const dynamic = "force-static";

export async function generateStaticParams() {
  return listPreviewSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = loadPreviewArticle(slug);
  if (!article) return { title: "Preview not found" };
  return {
    title: article.meta.seo?.metaTitle ?? article.meta.title,
    description:
      article.meta.seo?.metaDescription ?? article.meta.question ?? undefined,
  };
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = loadPreviewArticle(slug);
  if (!article) notFound();
  return (
    <div className={`${sourceSerif.className} ${crimson.className}`} style={{ fontFamily: "inherit" }}>
      <PreviewArticle article={article} />
    </div>
  );
}
