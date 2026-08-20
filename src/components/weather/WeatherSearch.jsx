import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { searchLocations } from "@/lib/weatherApi";

export default function WeatherSearch({ onSelect, onUseMyLocation, locating }) {
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
        <Search className="absolute left-3 w-4 h-4 text-white/60 pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder="Search city or place…"
          className="w-full h-10 pl-10 pr-16 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 transition"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-12 w-6 h-6 flex items-center justify-center text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onUseMyLocation}
          title="Use my location"
          className="absolute right-2 w-7 h-7 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/15 transition"
        >
          {locating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
        </button>
      </div>

      {open && (results.length > 0 || (loading && query.length >= 2)) && (
        <div className="absolute top-12 left-0 right-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 border border-white/40">
          {loading && results.length === 0 && (
            <div className="flex items-center justify-center py-4 text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Searching…
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