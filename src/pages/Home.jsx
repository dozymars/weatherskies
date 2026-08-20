import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Cloud } from "lucide-react";
import WeatherSearch from "@/components/weather/WeatherSearch";
import CurrentConditions from "@/components/weather/CurrentConditions";
import HourlyForecast from "@/components/weather/HourlyForecast";
import DailyForecast from "@/components/weather/DailyForecast";
import WeatherMap from "@/components/weather/WeatherMap";
import { getForecast, reverseGeocode } from "@/lib/weatherApi";
import { getWeatherInfo, getBackground } from "@/lib/weatherCodes";

const DEFAULT_LOCATION = {
  id: "nyc",
  name: "New York",
  country: "US",
  region: "NY",
  latitude: 40.7128,
  longitude: -74.006,
  label: "New York, NY, US",
};

const STORAGE_KEY = "weather_app_location";

export default function Home() {
  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locating, setLocating] = useState(false);

  const loadForecast = useCallback(async (loc) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getForecast(loc.latitude, loc.longitude);
      setForecast(data);
    } catch (e) {
      setError("Unable to load forecast. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadForecast(location);
  }, [location, loadForecast]);

  function handleSelect(loc) {
    setLocation(loc);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    } catch {}
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const loc = await reverseGeocode(
            pos.coords.latitude,
            pos.coords.longitude
          );
          handleSelect(loc);
        } catch {
          handleSelect({
            id: "geo",
            name: "My Location",
            country: "",
            region: "",
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            label: "My Location",
          });
        } finally {
          setLocating(false);
        }
      },
      () => {
        setError("Unable to get your location.");
        setLocating(false);
      },
      { timeout: 10000 }
    );
  }

  const current = forecast?.current;
  const info = current ? getWeatherInfo(current.weather_code) : null;
  const bg = info
    ? getBackground(info.theme, current.is_day === 1)
    : "from-slate-700 via-slate-800 to-slate-900";

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bg} transition-colors duration-700`}
    >
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-black/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 text-white shrink-0">
            <Cloud className="w-6 h-6" strokeWidth={1.5} />
            <span className="font-semibold tracking-tight hidden sm:block">
              Skyline
            </span>
          </div>
          <div className="flex-1 flex justify-center">
            <WeatherSearch
              onSelect={handleSelect}
              onUseMyLocation={handleUseMyLocation}
              locating={locating}
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-white/80">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="text-sm">Loading forecast…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-32 text-white">
              <p className="text-base mb-3">{error}</p>
              <button
                onClick={() => loadForecast(location)}
                className="px-5 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-sm font-medium transition"
              >
                Retry
              </button>
            </div>
          ) : (
            <motion.div
              key={location.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-2 gap-6 lg:gap-8"
            >
              {/* Left: current + hourly */}
              <div className="space-y-6">
                <CurrentConditions
                  location={location}
                  current={current}
                  daily={forecast.daily}
                />
                <HourlyForecast hourly={forecast.hourly} timezone={forecast.timezone} />
              </div>
              {/* Right: 10-day + map */}
              <div className="space-y-6">
                <DailyForecast daily={forecast.daily} />
                <WeatherMap location={location} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center text-white/50 text-xs">
        Weather data by Open-Meteo · Built with Skyline
      </footer>
    </div>
  );
}