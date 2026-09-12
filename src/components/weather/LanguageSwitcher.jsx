import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { LANGUAGES } from "@/lib/i18n";
import { useLanguage } from "@/lib/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 h-9 px-2.5 rounded-full bg-white border border-slate-300 text-slate-700 text-sm hover:bg-slate-100 transition"
        title={current.label}
      >
        <Globe className="w-4 h-4" />
        <span className="font-semibold uppercase">{lang}</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 max-h-80 overflow-y-auto">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-sm text-slate-700 hover:bg-slate-100 transition"
            >
              <span className="text-base leading-none">{l.flag}</span>
              <span className="flex-1">{l.label}</span>
              {lang === l.code && <Check className="w-4 h-4 text-slate-900" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}