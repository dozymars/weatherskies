import React from "react";
import { motion } from "framer-motion";
import { Footprints, Umbrella, Snowflake, Sprout, CalendarDays } from "lucide-react";
import { ACTIVITIES, scoreAllDays, bestDayForActivity } from "@/lib/activityScores";

const SCORE_COLORS = ["", "#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];

const ACTIVITY_META = {
  running: { icon: Footprints, label: "Running" },
  beach: { icon: Umbrella, label: "Beach" },
  skiing: { icon: Snowflake, label: "Skiing" },
  gardening: { icon: Sprout, label: "Gardening" },
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
        className="text-[11px] font-semibold w-3 text-center"
        style={{ color: SCORE_COLORS[score] }}
      >
        {score}
      </span>
    </div>
  );
}

export default function ActivityIndexGrid({ daily, timezone }) {
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
      <h3 className="text-slate-800 text-base font-semibold">Activity-Friendly Index</h3>
      <p className="text-[11px] text-slate-500 mb-4 uppercase tracking-wider">
        Best day this week per activity
      </p>

      <div className="grid grid-cols-4 gap-2 mb-5">
        {ACTIVITIES.map((a) => {
          const Icon = ACTIVITY_META[a.key].icon;
          const best = bestDays[a.key];
          const bestDate = best
            ? new Date(`${best.date}T12:00:00Z`).toLocaleDateString(undefined, {
                weekday: "short",
                timeZone: timezone,
              })
            : "—";
          return (
            <div
              key={a.key}
              className="rounded-2xl bg-slate-50 border border-slate-200 px-2 py-3 text-center"
            >
              <Icon className="w-5 h-5 mx-auto text-slate-700 mb-1" />
              <div className="text-[11px] font-medium text-slate-700">
                {ACTIVITY_META[a.key].label}
              </div>
              <div
                className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ background: "#e0f2fe", color: "#0369a1" }}
              >
                <CalendarDays className="w-2.5 h-2.5" /> {bestDate}
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-x-auto -mx-2 px-2">
        <div className="min-w-[440px]">
          <div className="grid grid-cols-[64px_repeat(4,1fr)] gap-2 text-[10px] uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
            <div>Day</div>
            {ACTIVITIES.map((a) => (
              <div key={a.key} className="text-center">
                {ACTIVITY_META[a.key].label}
              </div>
            ))}
          </div>
          {days.map((day, i) => {
            const d = new Date(`${day.date}T12:00:00Z`);
            const label =
              i === 0
                ? "Today"
                : d.toLocaleDateString(undefined, { weekday: "short", timeZone: timezone });
            const dateStr = d.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              timeZone: timezone,
            });
            return (
              <div
                key={day.date}
                className="grid grid-cols-[64px_repeat(4,1fr)] gap-2 items-center py-2 border-b border-slate-50 last:border-0"
              >
                <div className="leading-tight">
                  <div className="text-xs font-medium text-slate-800">{label}</div>
                  <div className="text-[10px] text-slate-400">{dateStr}</div>
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