import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const SEVERITY_STYLES = {
  Extreme: { bg: "bg-red-600/90", border: "border-red-300" },
  Severe: { bg: "bg-orange-600/90", border: "border-orange-300" },
  Moderate: { bg: "bg-amber-500/90", border: "border-amber-200" },
  Minor: { bg: "bg-yellow-500/90", border: "border-yellow-200" },
};

export default function AlertBanner({ alerts }) {
  const { t, locale } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  if (!alerts || !alerts.length) return null;
  const top = alerts[0];
  const style = SEVERITY_STYLES[top.severity] || SEVERITY_STYLES.Moderate;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl ${style.bg} border ${style.border} backdrop-blur-md text-white overflow-hidden`}
    >
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <AlertTriangle className="w-5 h-5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{top.event}</div>
          <div className="text-xs text-white/80 truncate">
            {top.headline || top.senderName || t("alert.active")}
          </div>
        </div>
        {alerts.length > 1 && (
          <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">
            {alerts.length}
          </span>
        )}
        {expanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {alerts.map((a, i) => (
                <div key={i} className="border-t border-white/20 pt-3">
                  <div className="text-sm font-semibold">{a.event}</div>
                  <div className="text-xs text-white/80 mb-1">
                    {t("alert.issuedBy", { name: a.senderName || t("alert.nws") })}
                    {a.expires &&
                      ` · ${t("alert.until", { date: new Date(a.expires).toLocaleString(locale) })}`}
                  </div>
                  {a.description && (
                    <p className="text-xs text-white/90 whitespace-pre-line">
                      {a.description}
                    </p>
                  )}
                  {a.instruction && (
                    <p className="text-xs text-white/80 mt-1 italic">
                      {a.instruction}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}