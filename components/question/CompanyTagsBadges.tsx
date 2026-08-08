import Link from "next/link";
import { Building2 } from "lucide-react";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";

interface CompanyTagsBadgesProps {
  companyTags: string[];
}

export function CompanyTagsBadges({ companyTags }: CompanyTagsBadgesProps) {
  if (!companyTags?.length) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      {companyTags.map(company => (
        <Tag key={company} variant="outline" className={cn("touch-target text-[11px] font-bold")}>
          <Link href={`/companies/${company}`}>
            {company.charAt(0).toUpperCase() + company.slice(1)}
          </Link>
        </Tag>
      ))}
    </div>
  );
}
