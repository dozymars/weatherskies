import React from "react";
import { usePreferences } from "@/lib/PreferencesContext";

export default function UnitToggle() {
  const { units, setUnits } = usePreferences();
  return (
    <div className="flex items-center rounded-full bg-slate-200 border border-slate-300 p-0.5 text-xs font-semibold">
      <button
        onClick={() => setUnits("metric")}
        className={`px-2.5 py-1 rounded-full transition ${
          units === "metric"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        °C
      </button>
      <button
        onClick={() => setUnits("imperial")}
        className={`px-2.5 py-1 rounded-full transition ${
          units === "imperial"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        °F
      </button>
    </div>
  );
}