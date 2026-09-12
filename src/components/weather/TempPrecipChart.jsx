import React from "react";
import { motion } from "framer-motion";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Thermometer, Droplets } from "lucide-react";
import { usePreferences } from "@/lib/PreferencesContext";
import { useLanguage } from "@/lib/LanguageContext";
import { convertTemp, tempUnit } from "@/lib/units";

function ChartTooltip({ active, payload, label, units, t }) {
  if (!active || !payload || !payload.length) return null;
  const temp = payload.find((p) => p.dataKey === "temp");
  const pop = payload.find((p) => p.dataKey === "pop");
  return (
    <div className="bg-white/95 border border-slate-200 rounded-xl shadow-lg px-3 py-2 text-xs">
      <div className="font-medium text-slate-700 mb-1">{label}</div>
      {temp && (
        <div className="flex items-center gap-1.5 text-slate-900">
          <Thermometer className="w-3 h-3 text-orange-500" />
          <span className="font-semibold">{temp.value}°{tempUnit(units)}</span>
        </div>
      )}
      {pop && (
        <div className="flex items-center gap-1.5 text-slate-700">
          <Droplets className="w-3 h-3 text-sky-500" />
          <span>{t("chart.precipTooltip", { n: pop.value })}</span>
        </div>
      )}
    </div>
  );
}

export default function TempPrecipChart({ hourly }) {
  const { units } = usePreferences();
  const { t, locale } = useLanguage();
  if (!hourly) return null;
  const now = new Date();
  const times = hourly.time.map((t) => new Date(t));
  let startIdx = times.findIndex((t) => t >= new Date(now.getTime() - 60 * 60 * 1000));
  if (startIdx < 0) startIdx = 0;

  const data = Array.from({ length: 24 }, (_, i) => startIdx + i)
    .filter((i) => i < hourly.time.length)
    .map((i) => ({
      time: new Date(hourly.time[i]).toLocaleTimeString(locale, { hour: "numeric" }),
      temp: Math.round(convertTemp(hourly.temperature_2m[i], units)),
      pop: hourly.precipitation_probability?.[i] ?? 0,
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-3xl bg-slate-100 border border-slate-200 p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-700 text-sm font-semibold uppercase tracking-wider">
          {t("chart.next24")}
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="inline-block w-3 h-0.5 rounded bg-orange-500" />
            {t("chart.temp")}
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="inline-block w-3 h-3 rounded-sm bg-sky-400" />
            {t("chart.precipPct")}
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="popFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.35} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: "rgba(71,85,105,0.8)", fontSize: 11 }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
            interval={2}
          />
          <YAxis
            yAxisId="temp"
            tick={{ fill: "rgba(71,85,105,0.8)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <YAxis
            yAxisId="pop"
            orientation="right"
            domain={[0, 100]}
            tick={{ fill: "rgba(71,85,105,0.8)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={32}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            content={<ChartTooltip units={units} t={t} />}
            cursor={{ fill: "rgba(148,163,184,0.12)" }}
          />
          <Bar
            yAxisId="pop"
            dataKey="pop"
            fill="url(#popFill)"
            radius={[4, 4, 0, 0]}
            maxBarSize={22}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="temp"
            stroke="#f97316"
            strokeWidth={2.5}
            dot={{ r: 2.5, fill: "#f97316", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#f97316", stroke: "#fff", strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
}