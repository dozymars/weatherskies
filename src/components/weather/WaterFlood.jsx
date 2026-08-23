import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const STATUS_META = {
  Rising: { icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50" },
  Falling: { icon: TrendingDown, color: "text-emerald-600", bg: "bg-emerald-50" },
  Steady: { icon: Minus, color: "text-slate-500", bg: "bg-slate-100" },
};

export default function WaterFlood({ waterData, loading }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 rounded-xl bg-slate-200/70 animate-pulse" />
        ))}
      </div>
    );
  }
  if (!waterData) {
    return (
      <p className="text-sm text-slate-400 py-6 text-center">Unable to load water data.</p>
    );
  }
  if (!waterData.available) {
    const msg =
      waterData.reason === "outside_us"
        ? "Not available outside the United States."
        : "No nearby stream gauges found.";
    return <p className="text-sm text-slate-500 py-6 text-center">{msg}</p>;
  }
  return (
    <div className="space-y-2">
      {waterData.gauges.map((g) => {
        const meta = STATUS_META[g.status] || STATUS_META.Steady;
        const Icon = meta.icon;
        return (
          <div
            key={g.siteNo}
            className="flex items-center gap-3 rounded-xl bg-white border border-slate-200 px-3 py-2"
          >
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-slate-900 truncate">{g.name}</div>
              <div className="text-[11px] text-slate-500">
                {g.distanceKm != null ? `${g.distanceKm} km away` : ""}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-900">
                {g.gageHeightFt != null ? `${g.gageHeightFt.toFixed(2)} ft` : "—"}
              </div>
              <div className="text-[11px] text-slate-500">
                {g.dischargeCfs != null ? `${g.dischargeCfs.toFixed(0)} cfs` : ""}
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full ${meta.bg} ${meta.color}`}
            >
              <Icon className="w-3 h-3" />
              {g.status}
            </span>
          </div>
        );
      })}
      <p className="text-[11px] text-slate-400 pt-1">
        Gage height &amp; discharge from USGS · status reflects recent trend
      </p>
    </div>
  );
}