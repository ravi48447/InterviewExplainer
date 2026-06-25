'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ActivityItem {
  title: string;
  detail: string | null;
  activityType: string;
  date: string;
}

interface RecentActivityCardProps {
  recentActivity: ActivityItem[];
  isGuest: boolean;
  relativeDate: (iso: string) => string;
}

export function RecentActivityCard({
  recentActivity,
  isGuest,
  relativeDate,
}: RecentActivityCardProps) {
  return (
    <Card className="flex flex-col bg-card border border-default p-5 shadow-sm h-full rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-[13px] font-bold text-primary tracking-tight">Recent Activity</h2>
      </div>
      {recentActivity.length > 0 ? (
        <div className="space-y-1.5 flex-1 flex flex-col justify-center">
          {recentActivity.slice(0, 5).map((act, i) => (
            <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-surface transition-colors duration-150">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 ring-4 ring-emerald-500/10" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-primary leading-relaxed">
                  {act.title}
                  {act.detail ? <>: <span className="font-semibold text-primary">{act.detail}</span></> : null}
                </p>
                {act.date && <p className="text-[10px] text-muted-foreground mt-0.5">{relativeDate(act.date)}</p>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
          <Activity className="h-7 w-7 mx-auto mb-2 text-muted-foreground" aria-hidden="true" />
          <p className="text-xs text-secondary">{isGuest ? 'Sign in to track activity.' : 'Complete questions to see activity.'}</p>
        </div>
      )}
    </Card>
  );
}
