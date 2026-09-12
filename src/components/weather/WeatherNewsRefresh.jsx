import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";

export default function WeatherNewsRefresh({ onRefreshed }) {
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    base44.auth.isAuthenticated().then(async (authed) => {
      if (!authed) return;
      try {
        const me = await base44.auth.me();
        if (active) setIsAdmin(me?.role === "admin");
      } catch {}
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleRefresh() {
    setBusy(true);
    try {
      await base44.functions.invoke("refreshWeatherNews", {});
      onRefreshed?.();
    } catch {}
    setBusy(false);
  }

  if (!isAdmin) return null;

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={busy}
      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50 transition mb-3"
    >
      <RefreshCw className={`w-3.5 h-3.5 ${busy ? "animate-spin" : ""}`} />
      {busy ? t("refresh.refreshing") : t("refresh.now")}
    </button>
  );
}