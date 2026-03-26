"use client";

import { FadeInUp } from "@/components/motion-wrapper";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { date: "Nov 15", score: 35 },
  { date: "Nov 22", score: 38 },
  { date: "Nov 29", score: 42 },
  { date: "Dec 06", score: 40 },
  { date: "Dec 13", score: 46 },
  { date: "Dec 20", score: 48 },
  { date: "Dec 27", score: 44 },
  { date: "Jan 03", score: 50 },
  { date: "Jan 10", score: 54 },
  { date: "Jan 17", score: 58 },
  { date: "Jan 24", score: 56 },
  { date: "Jan 31", score: 62 },
  { date: "Feb 07", score: 68 },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border/50 bg-card px-2.5 py-1.5 shadow-lg text-xs">
        <p className="text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
}

export function ProgressChart() {
  return (
    <FadeInUp className="rounded-xl border border-border/40 bg-card p-5 glow-soft">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Progress Trend</h3>
        <p className="text-[11px] text-muted-foreground">Last 90 days</p>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} dy={6} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} domain={[30, 75]} tickFormatter={(v: number) => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#progressGrad)" dot={false} activeDot={{ r: 4, fill: "hsl(var(--primary))", stroke: "hsl(var(--card))", strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </FadeInUp>
  );
}
