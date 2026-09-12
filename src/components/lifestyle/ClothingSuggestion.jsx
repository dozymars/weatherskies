import React from "react";
import { motion } from "framer-motion";
import { Thermometer, Wind, Droplets, Gauge } from "lucide-react";
import { getClothingHint } from "@/lib/clothingHint";
import { usePreferences } from "@/lib/PreferencesContext";
import { useLanguage } from "@/lib/LanguageContext";
import { convertTemp, tempUnit, convertWind, windUnit } from "@/lib/units";
import { getWeatherInfo } from "@/lib/weatherCodes";

export default function ClothingSuggestion({ current, daily }) {
  const { units } = usePreferences();
  const { t } = useLanguage();
  if (!current) return null;
  const info = getWeatherInfo(current.weather_code);
  const Icon = info.icon;
  const hint = getClothingHint(current, daily);

  const pills = [
    { icon: Thermometer, label: t("chart.temp"), value: `${Math.round(convertTemp(current.temperature_2m, units))}${tempUnit(units)}` },
    { icon: Gauge, label: t("current.feelsLike"), value: `${Math.round(convertTemp(current.apparent_temperature, units))}${tempUnit(units)}` },
    { icon: Wind, label: t("current.wind"), value: `${Math.round(convertWind(current.wind_speed_10m, units))} ${windUnit(units)}` },
    { icon: Droplets, label: t("current.precipitation"), value: `${(current.precipitation ?? 0).toFixed(1)} mm` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl bg-white/85 backdrop-blur-md border border-slate-200 p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Icon className={`w-10 h-10 shrink-0 ${info.color}`} strokeWidth={1.5} />
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-0.5">
              {t("lifestyle.whatToWear")}
            </div>
            <div className="text-lg sm:text-xl font-semibold text-slate-800 leading-snug">
              {hint}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          {pills.map((p) => {
            const PIcon = p.icon;
            return (
              <span
                key={p.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs text-slate-600"
              >
                <PIcon className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">
                  {p.label}
                </span>
                <span className="font-semibold text-slate-800">{p.value}</span>
              </span>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}