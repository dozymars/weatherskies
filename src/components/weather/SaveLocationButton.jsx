import React from "react";
import { Star } from "lucide-react";
import { usePreferences } from "@/lib/PreferencesContext";

export default function SaveLocationButton({ location }) {
  const { isSaved, toggleSaved } = usePreferences();
  const saved = isSaved(location);
  return (
    <button
      onClick={() => toggleSaved(location)}
      title={saved ? "Remove from saved" : "Save location"}
      className={`flex items-center gap-1.5 h-9 px-3 rounded-full border text-sm transition ${
        saved
          ? "bg-amber-400 text-slate-900 border-amber-300"
          : "bg-white/15 text-white border-white/20 hover:bg-white/25"
      }`}
    >
      <Star className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
      <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
    </button>
  );
}