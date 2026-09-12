import React from "react";
import { motion } from "framer-motion";
import { Sunrise, Sunset, Sun, Droplets, Wind, Thermometer } from "lucide-react";
import { getWeatherInfo } from "@/lib/weatherCodes";
import { usePreferences } from "@/lib/PreferencesContext";
import { useLanguage } from "@/lib/LanguageContext";
import { convertTemp, tempUnit, convertWind, windUnit } from "@/lib/units";

function toCardinal(deg) {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

export default function DayDetail({ dayIndex, daily, hourly }) {
  const { units } = usePreferences();
  const { t, locale } = useLanguage();
  const dateStr = daily.time[dayIndex];

  const dayHours = [];
  if (hourly) {
    for (let k = 0; k < hourly.time.length; k++) {
      if (hourly.time[k].startsWith(dateStr)) dayHours.push(k);
    }
  }

  const uv = daily.uv_index_max?.[dayIndex];
  const sunrise = daily.sunrise?.[dayIndex];
  const sunset = daily.sunset?.[dayIndex];
  const pop = daily.precipitation_probability_max?.[dayIndex] ?? 0;
  const precipSum = daily.precipitation_sum?.[dayIndex];
  const windMax = daily.wind_speed_10m_max?.[dayIndex];
  const windDir = daily.wind_direction_10m_dominant?.[dayIndex];
  const appMax = daily.apparent_temperature_max?.[dayIndex];
  const appMin = daily.apparent_temperature_min?.[dayIndex];

  function uvText(uv) {
    if (uv == null) return "—";
    if (uv < 3) return t("uv.low");
    if (uv < 6) return t("uv.moderate");
    if (uv < 8) return t("uv.high");
    if (uv < 11) return t("uv.veryHigh");
    return t("uv.extreme");
  }

  const stats = [
    { icon: Sun, label: t("dayDetail.uvIndex"), value: uv != null ? `${Math.round(uv)} · ${uvText(uv)}` : "—" },
    {
      icon: Droplets,
      label: t("current.precipitation"),
      value: precipSum != null ? `${precipSum.toFixed(1)} mm · ${pop}%` : `${pop}%`,
    },
    {
      icon: Wind,
      label: t("current.wind"),
      value: `${Math.round(convertWind(windMax ?? 0, units))} ${windUnit(units)}${windDir != null ? " " + toCardinal(windDir) : ""}`,
    },
    {
      icon: Thermometer,
      label: t("current.feelsLike"),
      value: appMax != null
        ? `${Math.round(convertTemp(appMin, units))}° / ${Math.round(convertTemp(appMax, units))}°`
        : "—",
    },
    {
      icon: Sunrise,
      label: t("current.sunrise"),
      value: sunrise ? new Date(sunrise).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }) : "—",
    },
    {
      icon: Sunset,
      label: t("current.sunset"),
      value: sunset ? new Date(sunset).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }) : "—",
    },
  ];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="py-4 space-y-4">
        {dayHours.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-2 font-medium">
              {t("dayDetail.hourly")}
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
              {dayHours.map((k) => {
                const info = getWeatherInfo(hourly.weather_code[k]);
                const Icon = info.icon;
                const tm = new Date(hourly.time[k]);
                return (
                  <div
                    key={k}
                    className="flex flex-col items-center gap-1 min-w-[52px] rounded-xl bg-white border border-slate-200 px-2 py-2"
                  >
                    <span className="text-[10px] text-slate-500">
                      {tm.toLocaleTimeString(locale, { hour: "numeric" })}
                    </span>
                    <Icon className={`w-5 h-5 ${info.color}`} strokeWidth={1.5} />
                    <span className="text-xs font-semibold text-slate-900">
                      {Math.round(convertTemp(hourly.temperature_2m[k], units))}°
                    </span>
                    <span className="flex items-center gap-0.5 text-[9px] text-sky-600">
                      <Droplets className="w-2.5 h-2.5" />
                      {hourly.precipitation_probability?.[k] ?? 0}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {stats.map((s) => {
            const SIcon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-xl bg-white border border-slate-200 px-3 py-2 min-w-0"
              >
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <SIcon className="w-3 h-3 shrink-0" />
                  <span className="text-[10px] uppercase tracking-wider font-medium">
                    {s.label}
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-900 break-words">{s.value}</div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}