import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { X, Loader2, MapPin, Search, CalendarCheck } from "lucide-react";
import { getForecast, searchLocations } from "@/lib/weatherApi";
import { usePreferences } from "@/lib/PreferencesContext";
import { useLanguage } from "@/lib/LanguageContext";
import { convertTemp, tempUnit, convertWind, windUnit } from "@/lib/units";
import { getWeatherInfo } from "@/lib/weatherCodes";
import { bestDayToGo } from "@/lib/activityScores";

function AddLocationSearch({ onAdd }) {
  const { t, locale } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await searchLocations(query);
        setResults(r);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [query]);

  function pick(loc) {
    onAdd(loc);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder={t("lifestyle.addCity")}
          className="w-full h-10 pl-10 pr-3 rounded-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 transition"
        />
      </div>
      {open && (results.length > 0 || (loading && query.length >= 2)) && (
        <div className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-slate-200">
          {loading && results.length === 0 && (
            <div className="flex items-center justify-center py-4 text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> {t("search.searching")}
            </div>
          )}
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => pick(r)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-100 transition border-b border-slate-100 last:border-0"
            >
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-800 truncate">{r.name}</div>
                <div className="text-xs text-slate-500 truncate">
                  {[r.region, r.country].filter(Boolean).join(", ")}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LocationColumn({ loc, onRemove, units }) {
  const { t, tw, locale } = useLanguage();
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    getForecast(loc.latitude, loc.longitude)
      .then((f) => {
        if (active) {
          setForecast(f);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [loc.latitude, loc.longitude]);

  const best = forecast ? bestDayToGo(forecast.daily, 7) : null;
  const bestDate =
    best != null
      ? new Date(`${forecast.daily.time[best.index]}T12:00:00Z`).toLocaleDateString(locale, {
          weekday: "short",
          month: "short",
          day: "numeric",
          timeZone: forecast.timezone,
        })
      : "—";

  return (
    <div className="rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200 p-4 flex flex-col h-full">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-800 truncate">{loc.name}</div>
          <div className="text-[11px] text-slate-400 truncate">
            {[loc.region, loc.country].filter(Boolean).join(", ")}
          </div>
        </div>
        <button
          onClick={() => onRemove(loc)}
          className="text-slate-300 hover:text-slate-600 transition shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {best && (
        <div
          className="inline-flex items-center gap-1.5 mb-3 self-start rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: "#e0f2fe", color: "#0369a1" }}
        >
          <CalendarCheck className="w-3 h-3" /> {t("lifestyle.bestDay", { date: bestDate })}
        </div>
      )}

      {loading ? (
        <div className="space-y-2 py-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-8 rounded-lg bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <p className="text-xs text-slate-400 py-6 text-center">{t("lifestyle.couldntLoad")}</p>
      ) : (
        <div className="space-y-1">
          {forecast.daily.time.slice(0, 7).map((day, i) => {
            const info = getWeatherInfo(forecast.daily.weather_code[i]);
            const WIcon = info.icon;
            const hi = convertTemp(forecast.daily.temperature_2m_max[i], units);
            const lo = convertTemp(forecast.daily.temperature_2m_min[i], units);
            const pop = forecast.daily.precipitation_probability_max?.[i] ?? 0;
            const wind = convertWind(forecast.daily.wind_speed_10m_max?.[i] ?? 0, units);
            const isBest = best && best.index === i;
            return (
              <div
                key={day}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${
                  isBest ? "bg-sky-50 border border-sky-200" : "hover:bg-slate-50"
                }`}
              >
                <div className="w-10 text-[11px] text-slate-500 leading-tight">
                  {i === 0
                    ? t("daily.today")
                    : new Date(`${day}T12:00:00Z`).toLocaleDateString(locale, {
                        weekday: "short",
                        timeZone: forecast.timezone,
                      })}
                </div>
                <WIcon className={`w-5 h-5 ${info.color} shrink-0`} strokeWidth={1.5} />
                <div className="flex-1 flex items-baseline gap-1 text-xs">
                  <span className="font-semibold text-slate-800">{Math.round(hi)}°</span>
                  <span className="text-slate-400">{Math.round(lo)}°</span>
                </div>
                <div className="text-[10px] text-sky-600 w-8 text-right">{pop}%</div>
                <div className="text-[10px] text-slate-400 w-10 text-right">
                  {Math.round(wind)}
                </div>
              </div>
            );
          })}
          <p className="text-[10px] text-slate-400 pt-1">
            {t("lifestyle.windUnitTemps", { wunit: windUnit(units), tunit: tempUnit(units) })}
          </p>
        </div>
      )}
    </div>
  );
}

export default function TravelComparison({ seedLocations }) {
  const { t } = useLanguage();
  const { units, savedLocations } = usePreferences();
  const [selected, setSelected] = useState(() =>
    (seedLocations?.length ? seedLocations : savedLocations).slice(0, 2)
  );

  const addLocation = useCallback((loc) => {
    setSelected((prev) => {
      const key = loc.id || `${loc.latitude},${loc.longitude}`;
      if (prev.some((l) => (l.id || `${l.latitude},${l.longitude}`) === key)) return prev;
      if (prev.length >= 3) return prev;
      return [...prev, loc];
    });
  }, []);

  const removeLocation = useCallback((loc) => {
    setSelected((prev) =>
      prev.filter(
        (l) =>
          (l.id || `${l.latitude},${l.longitude}`) !==
          (loc.id || `${loc.latitude},${loc.longitude}`)
      )
    );
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-3xl bg-slate-100/70 border border-slate-200 p-5 sm:p-6 h-full"
    >
      <h3 className="text-slate-800 text-base font-semibold">{t("lifestyle.travelComparison")}</h3>
      <p className="text-[11px] text-slate-500 mb-3 uppercase tracking-wider">
        {t("lifestyle.travelSubtitle")}
      </p>

      <div className="mb-4">
        <AddLocationSearch onAdd={addLocation} />
      </div>

      {selected.length === 0 ? (
        <div className="text-center py-8 text-sm text-slate-500">
          <MapPin className="w-6 h-6 mx-auto text-slate-300 mb-2" />
          {t("lifestyle.addEmpty")}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {selected.map((loc) => (
            <LocationColumn
              key={loc.id || `${loc.latitude},${loc.longitude}`}
              loc={loc}
              onRemove={removeLocation}
              units={units}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}