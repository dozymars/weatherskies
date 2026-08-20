import React from "react";
import { motion } from "framer-motion";
import { Wind } from "lucide-react";

const AQI_SCALE = [
  { max: 50, label: "Good", color: "#4caf50", dark: false, advice: "Air quality is satisfactory; air pollution poses little or no risk." },
  { max: 100, label: "Moderate", color: "#ffeb3b", dark: true, advice: "Unusually sensitive people should consider limiting prolonged outdoor exertion." },
  { max: 150, label: "Unhealthy for Sensitive Groups", color: "#ff9800", dark: false, advice: "Sensitive groups — children, the elderly, those with respiratory issues — should limit outdoor exertion." },
  { max: 200, label: "Unhealthy", color: "#f44336", dark: false, advice: "Everyone may begin to experience health effects; limit outdoor activity." },
  { max: 300, label: "Very Unhealthy", color: "#9c27b0", dark: false, advice: "Health alert: avoid prolonged outdoor exertion." },
  { max: 500, label: "Hazardous", color: "#7e0023", dark: false, advice: "Emergency conditions. Everyone should avoid outdoor activity." },
];

export default function AirQualityCard({ aqi }) {
  if (aqi == null) return null;
  const level =
    AQI_SCALE.find((s) => aqi <= s.max) || AQI_SCALE[AQI_SCALE.length - 1];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-3xl bg-slate-100 border border-slate-200 p-5 sm:p-6"
    >
      <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold uppercase tracking-wider mb-4">
        <Wind className="w-4 h-4" /> Air Quality
      </div>
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0"
          style={{
            backgroundColor: level.color,
            color: level.dark ? "#1f2937" : "#fff",
          }}
        >
          {Math.round(aqi)}
        </div>
        <div className="min-w-0">
          <div className="text-lg font-semibold text-slate-900">{level.label}</div>
          <p className="text-xs text-slate-500 mt-0.5">{level.advice}</p>
        </div>
      </div>
    </motion.div>
  );
}