import Link from "next/link";
import { Building2 } from "lucide-react";

interface CompanyTagsBadgesProps {
  companyTags: string[];
}

const COMPANY_COLORS: Record<string, string> = {
  amazon: "bg-orange-100 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20",
  google: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary border-default dark:border-default/20",
  meta: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary border-default dark:border-default/20",
  microsoft: "bg-cyan-100 dark:bg-cyan-950/20 text-primary dark:text-primary border-default dark:border-default/20",
  netflix: "bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-default dark:border-default/20",
  apple: "bg-surface text-foreground border-border",
  stripe: "bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
  uber: "bg-surface text-foreground border-border",
  airbnb: "bg-rose-100 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
  linkedin: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary border-default dark:border-default/20",
  shopify: "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-default dark:border-default/20",
  confluent: "bg-teal-100 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-500/20",
};

export function CompanyTagsBadges({ companyTags }: CompanyTagsBadgesProps) {
  if (!companyTags?.length) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      {companyTags.map(company => (
        <Link
          key={company}
          href={`/companies/${company}`}
          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all hover:shadow-sm hover:scale-105 ${
            COMPANY_COLORS[company] ?? "bg-surface text-muted-foreground border-border"
          }`}
        >
          {company.charAt(0).toUpperCase() + company.slice(1)}
        </Link>
      ))}
    </div>
  );
}
