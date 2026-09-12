import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { searchLocations } from "@/lib/weatherApi";
import { useLanguage } from "@/lib/LanguageContext";

export default function WeatherSearch({ onSelect, onUseMyLocation, locating }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
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
      } catch (e) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [query]);

  function handleSelect(loc) {
    onSelect(loc);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div ref={boxRef} className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder={t("search.placeholder")}
          className="w-full h-10 pl-10 pr-16 rounded-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-12 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onUseMyLocation}
          title={t("search.useMyLocation")}
          className="absolute right-2 w-7 h-7 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          {locating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
        </button>
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
              onClick={() => handleSelect(r)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-100 transition border-b border-slate-100 last:border-0"
            >
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-800 truncate">
                  {r.name}
                </div>
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