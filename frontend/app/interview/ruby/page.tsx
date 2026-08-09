import { Metadata } from "next";
import { loadRolePage, buildRolePageMetadata } from "@/lib/curriculum";
import { RolePage } from "@/components/curriculum-v2";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const data = loadRolePage("ruby");
  if (!data) return { title: "Not Found" };
  return buildRolePageMetadata(data);
}

export default function RubyHubPage() {
  const data = loadRolePage("ruby");
  if (!data) return null;
  return <RolePage data={data} />;
}
