import React from "react";

const AQI_SCALE = [
  { max: 50, label: "Good", color: "#4caf50", dark: false, advice: "Air quality is satisfactory; air pollution poses little or no risk." },
  { max: 100, label: "Moderate", color: "#ffeb3b", dark: true, advice: "Unusually sensitive people should consider limiting prolonged outdoor exertion." },
  { max: 150, label: "Unhealthy for Sensitive Groups", color: "#ff9800", dark: false, advice: "Sensitive groups should limit outdoor exertion." },
  { max: 200, label: "Unhealthy", color: "#f44336", dark: false, advice: "Everyone may begin to experience health effects; limit outdoor activity." },
  { max: 300, label: "Very Unhealthy", color: "#9c27b0", dark: false, advice: "Health alert: avoid prolonged outdoor exertion." },
  { max: 500, label: "Hazardous", color: "#7e0023", dark: false, advice: "Emergency conditions. Everyone should avoid outdoor activity." },
];

const POLLUTANTS = [
  { key: "pm25", label: "PM2.5", unit: "µg/m³" },
  { key: "pm10", label: "PM10", unit: "µg/m³" },
  { key: "ozone", label: "Ozone", unit: "µg/m³" },
  { key: "no2", label: "NO₂", unit: "µg/m³" },
];

function pollenLevel(v) {
  if (v == null) return { label: "—", color: "text-slate-400" };
  if (v < 5) return { label: "Low", color: "text-emerald-600" };
  if (v <= 20) return { label: "Moderate", color: "text-amber-600" };
  return { label: "High", color: "text-rose-600" };
}

export default function AirAtmosphere({ airData }) {
  if (!airData) {
    return (
      <p className="text-sm text-slate-400 py-6 text-center">Air data unavailable.</p>
    );
  }
  const aqi = airData.usAqi;
  const level =
    aqi != null
      ? AQI_SCALE.find((s) => aqi <= s.max) || AQI_SCALE[AQI_SCALE.length - 1]
      : null;

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
            <div className="text-sm font-semibold text-slate-900">{level.label}</div>
            <p className="text-xs text-slate-500 mt-0.5">{level.advice}</p>
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
          { label: "Tree", value: airData.pollen?.tree },
          { label: "Grass", value: airData.pollen?.grass },
          { label: "Weed", value: airData.pollen?.weed },
        ].map((pl) => {
          const lvl = pollenLevel(pl.value);
          return (
            <div
              key={pl.label}
              className="flex-1 rounded-xl bg-white border border-slate-200 px-3 py-2 text-center"
            >
              <div className="text-[11px] text-slate-500 uppercase tracking-wide">{pl.label}</div>
              <div className={`text-sm font-semibold ${lvl.color}`}>{lvl.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}