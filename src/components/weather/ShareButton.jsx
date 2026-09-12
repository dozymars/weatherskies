import React, { useState } from "react";
import { Share2, Check } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function ShareButton({ location }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  function handleShare() {
    const url = `${window.location.origin}/?lat=${location.latitude}&lon=${location.longitude}&city=${encodeURIComponent(location.name)}`;
    if (navigator.share) {
      navigator.share({ title: t("share.weatherOf", { name: location.name }), url }).catch(() => {});
      return;
    }
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={handleShare}
      title={t("share.title")}
      className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-white border border-slate-300 text-slate-700 text-sm hover:bg-slate-100 transition"
    >
      {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
      <span className="hidden sm:inline">{copied ? t("share.copied") : t("share.share")}</span>
    </button>
  );
}