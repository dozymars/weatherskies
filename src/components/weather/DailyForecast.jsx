import React from "react";
import { motion } from "framer-motion";
import { Droplets, Wind } from "lucide-react";
import { getWeatherInfo } from "@/lib/weatherCodes";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DailyForecast({ daily }) {
  if (!daily) return null;
  const maxes = daily.temperature_2m_max;
  const mins = daily.temperature_2m_min;
  const globalMax = Math.max(...maxes);
  const globalMin = Math.min(...mins);
  const range = Math.max(globalMax - globalMin, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 p-5 sm:p-6"
    >
      <h3 className="text-white/90 text-sm font-semibold uppercase tracking-wider mb-4">
        10-Day Forecast
      </h3>
      <div className="flex flex-col">
        {daily.time.map((day, i) => {
          const info = getWeatherInfo(daily.weather_code[i]);
          const Icon = info.icon;
          const date = new Date(day);
          const isToday = i === 0;
          const dayLabel = isToday ? "Today" : DAYS[date.getDay()];
          const max = maxes[i];
          const min = mins[i];
          const leftPct = ((min - globalMin) / range) * 100;
          const widthPct = ((max - min) / range) * 100;
          const pop = daily.precipitation_probability_max?.[i] ?? 0;

          return (
            <div
              key={day}
              className="grid grid-cols-[64px_36px_44px_1fr_44px] sm:grid-cols-[80px_40px_52px_1fr_52px] items-center gap-2 sm:gap-3 py-3 border-b border-white/10 last:border-0"
            >
              <span className="text-sm font-medium text-white/90">{dayLabel}</span>
              <Icon className="w-7 h-7 text-white/90 justify-self-center" strokeWidth={1.5} />
              <span className="flex items-center gap-0.5 text-[11px] text-sky-200">
                <Droplets className="w-3 h-3" />
                {pop}%
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60 w-7 text-right">{Math.round(min)}°</span>
                <div className="relative flex-1 h-1.5 rounded-full bg-white/15">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-300 via-amber-300 to-orange-400"
                    style={{
                      left: `${leftPct}%`,
                      width: `${Math.max(widthPct, 8)}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-white w-7">{Math.round(max)}°</span>
              </div>
              <span className="flex items-center gap-0.5 text-[11px] text-white/60 justify-end">
                <Wind className="w-3 h-3" />
                {Math.round(daily.wind_speed_10m_max?.[i] ?? 0)}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}