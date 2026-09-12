import React from "react";
import { useLanguage } from "@/lib/LanguageContext";

const AQI_SCALE = [
  { max: 50, labelKey: "aqi.good", adviceKey: "aqi.goodAdvice", color: "#4caf50", dark: false },
  { max: 100, labelKey: "aqi.moderate", adviceKey: "aqi.moderateAdvice", color: "#ffeb3b", dark: true },
  { max: 150, labelKey: "aqi.usg", adviceKey: "aqi.usgAdvice", color: "#ff9800", dark: false },
  { max: 200, labelKey: "aqi.unhealthy", adviceKey: "aqi.unhealthyAdvice", color: "#f44336", dark: false },
  { max: 300, labelKey: "aqi.veryUnhealthy", adviceKey: "aqi.veryUnhealthyAdvice", color: "#9c27b0", dark: false },
  { max: 500, labelKey: "aqi.hazardous", adviceKey: "aqi.hazardousAdvice", color: "#7e0023", dark: false },
];

const POLLUTANTS = [
  { key: "pm25", label: "PM2.5", unit: "µg/m³" },
  { key: "pm10", label: "PM10", unit: "µg/m³" },
  { key: "ozone", label: "O₃", unit: "µg/m³" },
  { key: "no2", label: "NO₂", unit: "µg/m³" },
];

export default function AirAtmosphere({ airData }) {
  const { t } = useLanguage();
  if (!airData) {
    return (
      <p className="text-sm text-slate-400 py-6 text-center">{t("air.unavailable")}</p>
    );
  }
  const aqi = airData.usAqi;
  const level =
    aqi != null
      ? AQI_SCALE.find((s) => aqi <= s.max) || AQI_SCALE[AQI_SCALE.length - 1]
      : null;

  function pollenLevelText(v) {
    if (v == null) return "—";
    if (v < 5) return t("pollen.low");
    if (v <= 20) return t("pollen.moderate");
    return t("pollen.high");
  }
  function pollenColor(v) {
    if (v == null) return "text-slate-400";
    if (v < 5) return "text-emerald-600";
    if (v <= 20) return "text-amber-600";
    return "text-rose-600";
  }

  return (
    <div className="space-y-4">
      {level && (
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0"
            style={{ backgroundColor: level.color, color: level.dark ? "#1f2937" : "#fff" }}
          >
            {Math.round(aqi)}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900">{t(level.labelKey)}</div>
            <p className="text-xs text-slate-500 mt-0.5">{t(level.adviceKey)}</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {POLLUTANTS.map((p) => (
          <div key={p.key} className="rounded-xl bg-white border border-slate-200 px-3 py-2">
            <div className="text-[11px] text-slate-500 uppercase tracking-wide">{p.label}</div>
            <div className="text-sm font-semibold text-slate-900">
              {airData[p.key] != null ? airData[p.key].toFixed(1) : "—"}
              <span className="text-[10px] font-normal text-slate-400 ml-1">{p.unit}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {[
          { label: t("pollen.tree"), value: airData.pollen?.tree },
          { label: t("pollen.grass"), value: airData.pollen?.grass },
          { label: t("pollen.weed"), value: airData.pollen?.weed },
        ].map((pl) => {
          const lvl = pollenLevelText(pl.value);
          const color = pollenColor(pl.value);
          return (
            <div
              key={pl.label}
              className="flex-1 rounded-xl bg-white border border-slate-200 px-3 py-2 text-center"
            >
              <div className="text-[11px] text-slate-500 uppercase tracking-wide">{pl.label}</div>
              <div className={`text-sm font-semibold ${color}`}>{lvl}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}