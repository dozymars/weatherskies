import React from "react";
import { Flame } from "lucide-react";

function confLabel(c) {
  if (!c) return "—";
  const map = { l: "Low", n: "Nominal", h: "High" };
  return map[c.toLowerCase()] || c;
}

export default function FireSmoke({ fireData, loading }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 rounded-xl bg-slate-200/70 animate-pulse" />
        ))}
      </div>
    );
  }
  if (!fireData) {
    return (
      <p className="text-sm text-slate-400 py-6 text-center">Unable to load fire data.</p>
    );
  }
  if (!fireData.available) {
    const msg =
      fireData.reason === "no_key" || fireData.reason === "invalid_key"
        ? "Fire tracking unavailable (API key not configured)."
        : "Unable to load fire data right now.";
    return <p className="text-sm text-slate-500 py-6 text-center">{msg}</p>;
  }
  if (fireData.fires.length === 0) {
    return (
      <p className="text-sm text-emerald-600 py-6 text-center flex items-center justify-center gap-1">
        <Flame className="w-4 h-4" /> No active fires nearby.
      </p>
    );
  }
  return (
    <div className="space-y-2">
      {fireData.fires.map((f, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl bg-white border border-slate-200 px-3 py-2"
        >
          <Flame className="w-4 h-4 text-orange-500 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-slate-900">
              {f.distanceKm != null ? `${Math.round(f.distanceKm)} km away` : "Nearby"}
            </div>
            <div className="text-[11px] text-slate-500">
              Detected {f.acqDate} · Confidence: {confLabel(f.confidence)}
              {f.frp ? ` · ${f.frp.toFixed(1)} MW` : ""}
            </div>
          </div>
          {f.brightness ? (
            <span className="text-[11px] text-slate-500">{Math.round(f.brightness)} K</span>
          ) : null}
        </div>
      ))}
      <p className="text-[11px] text-slate-400 pt-1">
        Active fire detections from NASA FIRMS (VIIRS)
      </p>
    </div>
  );
}