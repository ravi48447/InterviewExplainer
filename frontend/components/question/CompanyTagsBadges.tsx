import Link from "next/link";
import { Building2 } from "lucide-react";

interface CompanyTagsBadgesProps {
  companyTags: string[];
}

const COMPANY_COLORS: Record<string, string> = {
  amazon: "bg-orange-100 text-orange-700 border-orange-200",
  google: "bg-blue-100 text-blue-700 border-blue-200",
  meta: "bg-indigo-100 text-indigo-700 border-indigo-200",
  microsoft: "bg-cyan-100 text-cyan-700 border-cyan-200",
  netflix: "bg-red-100 text-red-700 border-red-200",
  apple: "bg-slate-100 text-slate-700 border-slate-200",
  stripe: "bg-violet-100 text-violet-700 border-violet-200",
  uber: "bg-slate-100 text-slate-700 border-slate-200",
  airbnb: "bg-rose-100 text-rose-700 border-rose-200",
  linkedin: "bg-blue-100 text-blue-700 border-blue-200",
  shopify: "bg-emerald-100 text-emerald-700 border-emerald-200",
  confluent: "bg-teal-100 text-teal-700 border-teal-200",
};

export function CompanyTagsBadges({ companyTags }: CompanyTagsBadgesProps) {
  if (!companyTags?.length) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
      {companyTags.map(company => (
        <Link
          key={company}
          href={`/companies/${company}`}
          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all hover:shadow-sm hover:scale-105 ${
            COMPANY_COLORS[company] ?? "bg-slate-100 text-slate-600 border-slate-200"
          }`}
        >
          {company.charAt(0).toUpperCase() + company.slice(1)}
        </Link>
      ))}
    </div>
  );
}
