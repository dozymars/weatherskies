import React from "react";
import { Newspaper, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function WeatherNews({ newsData, loading }) {
  const { t } = useLanguage();
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
      <p className="text-sm text-slate-400 py-6 text-center">{t("news.unable")}</p>
    );
  }
  if (newsData.length === 0) {
    return (
      <p className="text-sm text-slate-500 py-6 text-center">{t("news.empty")}</p>
    );
  }
  return (
    <div className="space-y-2">
      {newsData.map((a, i) => (
        <div
          key={i}
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
                <p className="text-sm text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{a.summary}</p>
              )}
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                {a.locality && (
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                      a.locality === "local"
                        ? "bg-emerald-100 text-emerald-700"
                        : a.locality === "national"
                        ? "bg-sky-100 text-sky-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {a.locality === "local"
                      ? t("news.local")
                      : a.locality === "national"
                      ? t("news.national")
                      : t("news.global")}
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  {[a.source, a.date].filter(Boolean).join(" · ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
      <p className="text-xs text-slate-400 pt-1">{t("news.footer")}</p>
    </div>
  );
}