import React, { useState, useRef, useEffect } from "react";
import { Palette, Check } from "lucide-react";
import { BACKGROUND_THEMES } from "@/lib/backgroundThemes";

export default function BackgroundThemePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 transition"
        title="Background theme"
      >
        <Palette className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-50">
          {BACKGROUND_THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                onChange(t.id);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-sm text-slate-700 hover:bg-slate-100 transition"
            >
              <span
                className={`w-5 h-5 rounded-full border border-white/20 bg-gradient-to-br ${
                  t.gradient || "from-slate-600 to-slate-800"
                }`}
              />
              <span className="flex-1">{t.label}</span>
              {value === t.id && <Check className="w-4 h-4 text-slate-900" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}