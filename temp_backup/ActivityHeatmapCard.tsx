'use client';
import React, { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card } from '@/components/ui/card';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface ActivityHeatmapCardProps {
  heatmapData: { date: string; count: number }[];
  showSample: boolean;
}

export function ActivityHeatmapCard({ heatmapData, showSample }: ActivityHeatmapCardProps) {
  const { theme } = useTheme();

  const heatColor = (count: number, isDark: boolean): string => {
    if (isDark) {
      if (count === 0) return '#111318';
      if (count <= 2) return '#1E3A8A';
      if (count <= 4) return '#2563EB';
      if (count <= 6) return '#60A5FA';
      return '#BFDBFE';
    } else {
      if (count === 0) return '#F8FAFC';
      if (count <= 2) return '#DBEAFE';
      if (count <= 4) return '#93C5FD';
      if (count <= 6) return '#3B82F6';
      return '#1D4ED8';
    }
  };

  const isDark = theme === 'dark';

  const { columns, monthLabels } = useMemo(() => {
    const dataMap = new Map(heatmapData.map(d => [d.date, d.count]));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
      if (cursor.getDay() === 6) {
        cols.push(col);
        col = [];
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    if (col.length) cols.push(col);

    const labels: string[] = [];
    let lastMonth = -1;
    cols.forEach((c, i) => {
      const m = new Date(c[0].date + 'T00:00:00').getMonth();
      if (m !== lastMonth) {
        labels[i] = MONTHS[m];
        lastMonth = m;
      } else {
        labels[i] = '';
      }
    });

    return { columns: cols, monthLabels: labels };
  }, [heatmapData]);

  const colCount = columns.length;
  const gridCols = { gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` };

  return (
    <Card className="flex flex-col p-5 h-full rounded-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-[13px] font-bold tracking-tight text-foreground">Study Activity</h2>
        </div>
        <span className="text-[10px] font-bold text-secondary-foreground bg-surface border px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          Last 12 months
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid gap-[3.5px] mb-2" style={gridCols}>
            {monthLabels.map((l, i) => (
              <div key={i} className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider whitespace-nowrap">
                {l}
              </div>
            ))}
          </div>
          <div className="grid gap-[3.5px]" style={gridCols}>
            {columns.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3.5px]">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    className="aspect-square w-full rounded-[2px] border border-border/20 hover:border-primary transition-all duration-150 cursor-pointer"
                    style={{ backgroundColor: heatColor(day.count, isDark) }}
                    role="img"
                    aria-label={`${day.date}: ${day.count} ${day.count === 1 ? 'question' : 'questions'}`}
                    title={`${day.date}: ${day.count} questions`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            <span>Less</span>
            <div className="flex gap-[3px]">
              {[0, 1, 3, 5, 7].map(i => (
                <div key={i} className="w-2.5 h-2.5 rounded-[2px] border border-border/20" style={{ backgroundColor: heatColor(i, isDark) }} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      {showSample && (
        <p className="text-[10px] text-muted-foreground mt-3 italic text-center">
          Sample data — sign in to see your real activity.
        </p>
      )}
    </Card>
  );
}