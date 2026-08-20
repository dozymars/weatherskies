import React, { useState, useRef, useEffect } from "react";
import { Star, ChevronDown, MapPin, Trash2 } from "lucide-react";
import { usePreferences } from "@/lib/PreferencesContext";

export default function SavedLocationsDropdown({ currentLocation, onSelect }) {
  const { savedLocations, toggleSaved } = usePreferences();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!savedLocations.length) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-white border border-slate-300 text-slate-700 text-sm hover:bg-slate-100 transition"
      >
        <Star className="w-4 h-4" />
        <span className="hidden sm:inline">Saved</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 max-h-80 overflow-y-auto">
          {savedLocations.map((l) => {
            const key = l.id || `${l.latitude},${l.longitude}`;
            const active =
              currentLocation &&
              Math.abs(currentLocation.latitude - l.latitude) < 0.01 &&
              Math.abs(currentLocation.longitude - l.longitude) < 0.01;
            return (
              <div
                key={key}
                className={`flex items-center group ${
                  active ? "bg-slate-100" : ""
                }`}
              >
                <button
                  onClick={() => {
                    onSelect(l);
                    setOpen(false);
                  }}
                  className="flex-1 flex items-center gap-2 px-3 py-2.5 text-left hover:bg-slate-50 min-w-0"
                >
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">
                      {l.name}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {[l.region, l.country].filter(Boolean).join(", ")}
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => toggleSaved(l)}
                  className="px-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}