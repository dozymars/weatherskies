import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { LANGUAGES, getLanguageByCode, detectLanguage, translate, getWeatherLabel } from "@/lib/i18n";

const LANG_KEY = "weather_app_language";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const stored = localStorage.getItem(LANG_KEY);
      if (stored && getLanguageByCode(stored)) return stored;
    } catch {}
    return detectLanguage();
  });

  const meta = getLanguageByCode(lang) || LANGUAGES[0];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.rtl ? "rtl" : "ltr";
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {}
  }, [lang, meta.rtl]);

  const setLang = useCallback((code) => {
    if (getLanguageByCode(code)) setLangState(code);
  }, []);

  const t = useCallback(
    (key, vars) => translate(key, lang, vars),
    [lang]
  );

  const value = {
    lang,
    setLang,
    locale: meta.locale,
    rtl: !!meta.rtl,
    t,
    tw: (code) => getWeatherLabel(code, lang),
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}