'use client';

import React, { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface ActivityHeatmapCardProps {
  heatmapData: { date: string; count: number }[];
  showSample: boolean;
}

export function ActivityHeatmapCard({ heatmapData, showSample }: ActivityHeatmapCardProps) {
  const { theme } = useTheme();

  const heatColor = (count: number, isDark: boolean): string => {
    if (isDark) {
      if (count === 0) return '#111111';
      if (count <= 2) return '#262626';
      if (count <= 4) return '#525252';
      if (count <= 6) return '#a3a3a3';
      return '#ffffff';
    } else {
      if (count === 0) return '#f5f5f5';
      if (count <= 2) return '#e5e5e5';
      if (count <= 4) return '#a3a3a3';
      if (count <= 6) return '#525252';
      return '#000000';
    }
  };

  const isDark = theme === 'dark';

  const { columns, monthLabels } = useMemo(() => {
    const dataMap = new Map(heatmapData.map(d => [d.date, d.count]));
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    const weeks = 52;
    start.setDate(start.getDate() - (weeks * 7 - 1));
    start.setDate(start.getDate() - start.getDay()); // align to Sunday

    const cols: { date: string; count: number }[][] = [];
    let col: { date: string; count: number }[] = [];
    const cursor = new Date(start);
    while (cursor <= today) {
      const ds = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
      col.push({ date: ds, count: dataMap.get(ds) ?? 0 });
      if (cursor.getDay() === 6) { cols.push(col); col = []; }
      cursor.setDate(cursor.getDate() + 1);
    }
    if (col.length) cols.push(col);

    const labels: string[] = [];
    let lastMonth = -1;
    cols.forEach((c, i) => {
      const m = new Date(c[0].date + 'T00:00:00').getMonth();
      if (m !== lastMonth) { labels[i] = MONTHS[m]; lastMonth = m; }
      else labels[i] = '';
    });

    return { columns: cols, monthLabels: labels };
  }, [heatmapData]);

  const colCount = columns.length;
  const gridCols = { gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` };

  return (
    <Card className="flex flex-col bg-card border border-default p-5 shadow-sm h-full rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/40 to-transparent" />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-[13px] font-bold text-primary tracking-tight">Study Activity</h2>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground bg-surface border border-default px-2.5 py-0.5 rounded-full uppercase tracking-wider">Last 12 months</span>
      </div>

      <div className="flex-1 flex flex-col justify-center overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid gap-[3.5px] mb-2" style={gridCols}>
            {monthLabels.map((l, i) => (
              <div key={i} className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider whitespace-nowrap">{l}</div>
            ))}
          </div>
          <div className="grid gap-[3.5px]" style={gridCols}>
            {columns.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3.5px]">
                {week.map((day, dIdx) => (
                  <div key={dIdx}
                    className="aspect-square w-full rounded-[2px] border border-default/20 hover:border-primary transition-all duration-150 cursor-pointer"
                    style={{ backgroundColor: heatColor(day.count, isDark) }}
                    role="img"
                    aria-label={`${day.date}: ${day.count} ${day.count === 1 ? 'question' : 'questions'}`}
                    title={`${day.date}: ${day.count} questions`} />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            <span>Less</span>
            <div className="flex gap-[3px]">
              {[0, 1, 3, 5, 7].map(i => (
                <div key={i} className="w-2.5 h-2.5 rounded-[2px] border border-default/20" style={{ backgroundColor: heatColor(i, isDark) }} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
      {showSample && (
        <p className="text-[10px] text-muted-foreground mt-3 italic text-center">Sample data — sign in to see your real activity.</p>
      )}
    </Card>
  );
}
