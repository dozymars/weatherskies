import React from "react";
import { Newspaper, ExternalLink } from "lucide-react";

export default function WeatherNews({ newsData, loading }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-slate-200/70 animate-pulse" />
        ))}
      </div>
    );
  }
  if (!newsData) {
    return (
      <p className="text-sm text-slate-400 py-6 text-center">Unable to load weather news.</p>
    );
  }
  if (newsData.length === 0) {
    return (
      <p className="text-sm text-slate-500 py-6 text-center">No recent weather news found.</p>
    );
  }
  return (
    <div className="space-y-2">
      {newsData.map((a, i) => (
        <a
          key={i}
          href={a.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl bg-white border border-slate-200 px-3 py-2 hover:border-slate-300 transition"
        >
          <div className="flex items-start gap-2">
            <Newspaper className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-slate-900 flex items-start gap-1">
                <span className="line-clamp-2">{a.title}</span>
                {a.url && <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />}
              </div>
              {a.summary && (
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{a.summary}</p>
              )}
              <div className="text-[11px] text-slate-400 mt-0.5">
                {[a.source, a.date].filter(Boolean).join(" · ")}
              </div>
            </div>
          </div>
        </a>
      ))}
      <p className="text-[11px] text-slate-400 pt-1">Latest weather news via web search</p>
    </div>
  );
}