import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Wind, ChevronDown } from "lucide-react";
import { getWeatherInfo } from "@/lib/weatherCodes";
import { usePreferences } from "@/lib/PreferencesContext";
import { convertTemp, convertWind, windUnit } from "@/lib/units";
import DayDetail from "./DayDetail";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DailyForecast({ daily, hourly, timezone }) {
  const { units } = usePreferences();
  const [expandedDay, setExpandedDay] = useState(null);
  if (!daily) return null;
  const maxes = daily.temperature_2m_max.map((c) => convertTemp(c, units));
  const mins = daily.temperature_2m_min.map((c) => convertTemp(c, units));
  const globalMax = Math.max(...maxes);
  const globalMin = Math.min(...mins);
  const range = Math.max(globalMax - globalMin, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="rounded-3xl bg-slate-100 border border-slate-200 p-5 sm:p-6"
    >
      <h3 className="text-slate-700 text-sm font-semibold uppercase tracking-wider mb-4">
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
          const isOpen = expandedDay === i;

          return (
            <div key={day} className="border-b border-white/10 last:border-0">
              <button
                type="button"
                onClick={() => setExpandedDay(isOpen ? null : i)}
                className={`w-full grid grid-cols-[64px_36px_44px_1fr_44px] sm:grid-cols-[80px_40px_52px_1fr_52px] items-center gap-2 sm:gap-3 py-3 text-left transition rounded-lg ${
                  isOpen ? "bg-slate-200" : "hover:bg-slate-200"
                }`}
              >
                <span className="text-sm font-medium text-slate-900 flex items-center gap-1">
                  {dayLabel}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
                <Icon className="w-7 h-7 text-slate-700 justify-self-center" strokeWidth={1.5} />
                <span className="flex items-center gap-0.5 text-[11px] text-sky-600">
                  <Droplets className="w-3 h-3" />
                  {pop}%
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 w-7 text-right">{Math.round(min)}°</span>
                  <div className="relative flex-1 h-1.5 rounded-full bg-slate-200">
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-orange-500"
                      style={{
                        left: `${leftPct}%`,
                        width: `${Math.max(widthPct, 8)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 w-7">{Math.round(max)}°</span>
                </div>
                <span className="flex items-center gap-0.5 text-[11px] text-slate-500 justify-end">
                  <Wind className="w-3 h-3" />
                  {Math.round(convertWind(daily.wind_speed_10m_max?.[i] ?? 0, units))}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <div className="px-1">
                    <DayDetail
                      dayIndex={i}
                      daily={daily}
                      hourly={hourly}
                      timezone={timezone}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-slate-400 mt-2 text-right">Wind in {windUnit(units)}</p>
    </motion.div>
  );
}