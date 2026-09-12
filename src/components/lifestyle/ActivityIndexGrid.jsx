import React from "react";
import { motion } from "framer-motion";
import { Footprints, Umbrella, Snowflake, Sprout, CalendarDays } from "lucide-react";
import { ACTIVITIES, scoreAllDays, bestDayForActivity } from "@/lib/activityScores";
import { useLanguage } from "@/lib/LanguageContext";

const SCORE_COLORS = ["", "#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];

const ACTIVITY_META = {
  running: { icon: Footprints, key: "activity.running", card: "bg-orange-50 border-orange-200", iconColor: "text-orange-500", labelColor: "text-orange-700", pill: "bg-orange-100 text-orange-700" },
  beach: { icon: Umbrella, key: "activity.beach", card: "bg-sky-50 border-sky-200", iconColor: "text-sky-500", labelColor: "text-sky-700", pill: "bg-sky-100 text-sky-700" },
  skiing: { icon: Snowflake, key: "activity.skiing", card: "bg-cyan-50 border-cyan-200", iconColor: "text-cyan-500", labelColor: "text-cyan-700", pill: "bg-cyan-100 text-cyan-700" },
  gardening: { icon: Sprout, key: "activity.gardening", card: "bg-emerald-50 border-emerald-200", iconColor: "text-emerald-500", labelColor: "text-emerald-700", pill: "bg-emerald-100 text-emerald-700" },
};

function ScoreBar({ score }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className="h-1.5 w-2 rounded-full"
            style={{ background: n <= score ? SCORE_COLORS[score] : "#e2e8f0" }}
          />
        ))}
      </div>
      <span
        className="text-xs font-semibold w-3 text-center"
        style={{ color: SCORE_COLORS[score] }}
      >
        {score}
      </span>
    </div>
  );
}

export default function ActivityIndexGrid({ daily, timezone }) {
  const { t, locale } = useLanguage();
  if (!daily || !daily.time) return null;
  const days = scoreAllDays(daily);
  const bestDays = {};
  ACTIVITIES.forEach((a) => {
    bestDays[a.key] = bestDayForActivity(days, a.key);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl bg-white/85 backdrop-blur-md border border-slate-200 p-5 sm:p-6 h-full"
    >
      <h3 className="text-slate-800 text-base font-semibold">{t("lifestyle.activityIndex")}</h3>
      <p className="text-xs text-slate-500 mb-4 uppercase tracking-wider">
        {t("lifestyle.bestDayWeek")}
      </p>

      <div className="grid grid-cols-4 gap-2 mb-5">
        {ACTIVITIES.map((a) => {
          const meta = ACTIVITY_META[a.key];
          const Icon = meta.icon;
          const best = bestDays[a.key];
          const bestDate = best
            ? new Date(`${best.date}T12:00:00Z`).toLocaleDateString(locale, {
                weekday: "short",
                timeZone: timezone,
              })
            : "—";
          return (
            <div
              key={a.key}
              className={`rounded-2xl border px-2 py-3 text-center ${meta.card}`}
            >
              <Icon className={`w-5 h-5 mx-auto mb-1 ${meta.iconColor}`} />
              <div className={`text-xs font-medium ${meta.labelColor}`}>
                {t(meta.key)}
              </div>
              <div
                className={`mt-1.5 inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-full ${meta.pill}`}
              >
                <CalendarDays className="w-3 h-3" /> {bestDate}
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-x-auto -mx-2 px-2">
        <div className="min-w-[500px]">
          <div className="grid grid-cols-[72px_repeat(4,1fr)] gap-2 text-xs uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
            <div>{t("lifestyle.day")}</div>
            {ACTIVITIES.map((a) => (
              <div key={a.key} className="text-center">
                {t(ACTIVITY_META[a.key].key)}
              </div>
            ))}
          </div>
          {days.map((day, i) => {
            const d = new Date(`${day.date}T12:00:00Z`);
            const label =
              i === 0
                ? t("daily.today")
                : d.toLocaleDateString(locale, { weekday: "short", timeZone: timezone });
            const dateStr = d.toLocaleDateString(locale, {
              month: "short",
              day: "numeric",
              timeZone: timezone,
            });
            return (
              <div
                key={day.date}
                className="grid grid-cols-[72px_repeat(4,1fr)] gap-2 items-center py-2 border-b border-slate-50 last:border-0"
              >
                <div className="leading-tight">
                  <div className="text-xs font-medium text-slate-800">{label}</div>
                  <div className="text-xs text-slate-400">{dateStr}</div>
                </div>
                {ACTIVITIES.map((a) => (
                  <div key={a.key} className="flex justify-center">
                    <ScoreBar score={day.scores[a.key]} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}