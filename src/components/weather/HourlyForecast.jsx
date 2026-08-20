import React from "react";
import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import { getWeatherInfo } from "@/lib/weatherCodes";
import { usePreferences } from "@/lib/PreferencesContext";
import { convertTemp } from "@/lib/units";

export default function HourlyForecast({ hourly, timezone }) {
  const { units } = usePreferences();
  if (!hourly) return null;
  const now = new Date();
  const times = hourly.time.map((t) => new Date(t));
  let startIdx = times.findIndex((t) => t >= new Date(now.getTime() - 60 * 60 * 1000));
  if (startIdx < 0) startIdx = 0;
  const hours = Array.from({ length: 24 }, (_, i) => startIdx + i).filter(
    (i) => i < hourly.time.length
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-3xl bg-slate-100 border border-slate-200 p-5 sm:p-6"
    >
      <h3 className="text-slate-700 text-sm font-semibold uppercase tracking-wider mb-4">
        Hourly Forecast
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
        {hours.map((idx, i) => {
          const info = getWeatherInfo(hourly.weather_code[idx]);
          const Icon = info.icon;
          const time = new Date(hourly.time[idx]);
          const isNow = i === 0;
          return (
            <div
              key={idx}
              className={`flex flex-col items-center gap-2 min-w-[68px] rounded-2xl px-3 py-3 transition ${
                isNow ? "bg-white border border-slate-300" : "hover:bg-slate-200"
              }`}
            >
              <span className="text-xs font-medium text-slate-500">
                {isNow ? "Now" : time.toLocaleTimeString([], { hour: "numeric" })}
              </span>
              <Icon className="w-7 h-7 text-slate-700" strokeWidth={1.5} />
              <span className="text-base font-semibold text-slate-900">
                {Math.round(convertTemp(hourly.temperature_2m[idx], units))}°
              </span>
              <span className="flex items-center gap-0.5 text-[11px] text-sky-600">
                <Droplets className="w-3 h-3" />
                {hourly.precipitation_probability?.[idx] ?? 0}%
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}