"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDashboardSummary, DashboardSummary } from "@/lib/api";
import { Zap, Target, Flame, Trophy } from "lucide-react";

// Mock data for graphs (would be fetched in a real scenario)
const progressData = [
  { name: "Mon", questions: 4 },
  { name: "Tue", questions: 7 },
  { name: "Wed", questions: 5 },
  { name: "Thu", questions: 12 },
  { name: "Fri", questions: 9 },
  { name: "Sat", questions: 15 },
  { name: "Sun", questions: 10 },
];

const masteryData = [
  { name: "Frontend", value: 85, fill: "#00F2FE" },
  { name: "Backend", value: 65, fill: "#4FACFE" },
  { name: "Fullstack", value: 45, fill: "#7C3AED" },
  { name: "System Design", value: 30, fill: "#FF00D4" },
];

export function DashboardContent() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary()
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard data", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 rounded-3xl glass" />)}
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Mastery", value: `${summary?.completedQuestions || 0} `, icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Daily Streak", value: `${summary?.dailyStreak || 0} Days`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Focus Score", value: "92%", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
          { label: "Rankings", value: "Top 5%", icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-3xl glass-strong border-white/5 relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Progress Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 p-8 rounded-3xl glass border-white/5"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Execution Trend</h3>
            <div className="text-sm text-primary font-medium px-3 py-1 bg-primary/10 rounded-full">Weekly View</div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="colorQuestions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border) / 0.5)', backdropFilter: 'blur(10px)' }}
                />
                <Area type="monotone" dataKey="questions" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorQuestions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Radial Mastery Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-3xl glass border-white/5"
        >
          <h3 className="text-xl font-bold mb-8">Skill Distribution</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={15} data={masteryData}>
                <RadialBar
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  dataKey="value"
                  cornerRadius={10}
                />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0, fontSize: '12px' }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
