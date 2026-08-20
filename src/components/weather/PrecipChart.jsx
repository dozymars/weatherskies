import React from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Droplets } from "lucide-react";

export default function PrecipChart({ hourly }) {
  if (!hourly) return null;
  const now = new Date();
  const times = hourly.time.map((t) => new Date(t));
  let startIdx = times.findIndex(
    (t) => t >= new Date(now.getTime() - 60 * 60 * 1000)
  );
  if (startIdx < 0) startIdx = 0;

  const data = Array.from({ length: 24 }, (_, i) => startIdx + i)
    .filter((i) => i < hourly.time.length)
    .map((i) => ({
      time: new Date(hourly.time[i]).toLocaleTimeString([], { hour: "numeric" }),
      pop: hourly.precipitation_probability?.[i] ?? 0,
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-3xl bg-slate-100 border border-slate-200 p-5 sm:p-6"
    >
      <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold uppercase tracking-wider mb-4">
        <Droplets className="w-4 h-4" /> Precipitation Chance
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
          <defs>
            <linearGradient id="precipFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tick={{ fill: "rgba(71,85,105,0.8)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={3}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(255,255,255,0.95)",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              color: "#0f172a",
              fontSize: 12,
            }}
            labelStyle={{ color: "rgba(71,85,105,0.9)" }}
            formatter={(v) => [`${v}%`, "Precip"]}
          />
          <Area
            type="monotone"
            dataKey="pop"
            stroke="#38bdf8"
            strokeWidth={2}
            fill="url(#precipFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}