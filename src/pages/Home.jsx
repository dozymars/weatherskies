import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Cloud } from "lucide-react";
import WeatherSearch from "@/components/weather/WeatherSearch";
import CurrentConditions from "@/components/weather/CurrentConditions";
import HourlyForecast from "@/components/weather/HourlyForecast";
import DailyForecast from "@/components/weather/DailyForecast";
import WeatherMap from "@/components/weather/WeatherMap";
import AlertBanner from "@/components/weather/AlertBanner";
import AirQualityCard from "@/components/weather/AirQualityCard";
import PrecipChart from "@/components/weather/PrecipChart";
import SavedLocationsDropdown from "@/components/weather/SavedLocationsDropdown";
import UnitToggle from "@/components/weather/UnitToggle";
import { getForecast, getAQI, getAlerts, reverseGeocode } from "@/lib/weatherApi";
import { BACKGROUND_THEMES } from "@/lib/backgroundThemes";
import BackgroundThemePicker from "@/components/weather/BackgroundThemePicker";
import { usePreferences } from "@/lib/PreferencesContext";

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

function locationFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
  } catch {
    return DEFAULT_LOCATION;
  }
}

function locationFromURL() {
  const params = new URLSearchParams(window.location.search);
  const lat = parseFloat(params.get("lat"));
  const lon = parseFloat(params.get("lon"));
  const city = params.get("city");
  if (!isNaN(lat) && !isNaN(lon)) {
    return {
      id: `share-${lat},${lon}`,
      name: city ? decodeURIComponent(city) : "Shared Location",
      country: "",
      region: "",
      latitude: lat,
      longitude: lon,
      label: city
        ? decodeURIComponent(city)
        : `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
    };
  }
  return null;
}

export default function Home() {
  const [location, setLocation] = useState(() => locationFromURL() || locationFromStorage());
  const [forecast, setForecast] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locating, setLocating] = useState(false);
  const { backgroundTheme, setBackgroundTheme } = usePreferences();

  const loadData = useCallback(async (loc) => {
    setLoading(true);
    setError(null);
    try {
      const [f, a, al] = await Promise.all([
        getForecast(loc.latitude, loc.longitude),
        getAQI(loc.latitude, loc.longitude).catch(() => null),
        getAlerts(loc.latitude, loc.longitude).catch(() => []),
      ]);
      setForecast(f);
      setAqi(a);
      setAlerts(al);
    } catch (e) {
      setError("Unable to load forecast. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Clean share params from the URL after applying them
    if (window.location.search) {
      window.history.replaceState({}, "", window.location.pathname);
    }
    loadData(location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.latitude, location.longitude]);

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
  const themeGradient = BACKGROUND_THEMES.find((t) => t.id === backgroundTheme)?.gradient;
  const bg = themeGradient || "from-white to-slate-100";

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bg} transition-colors duration-700`}
    >
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-900 shrink-0">
            <Cloud className="w-6 h-6" strokeWidth={1.5} />
            <span className="font-semibold tracking-tight hidden sm:block">Skyline</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-3">
            <span className="text-slate-900 font-semibold text-sm tracking-tight whitespace-nowrap hidden sm:block">
              {location.name}
            </span>
            <WeatherSearch
              onSelect={handleSelect}
              onUseMyLocation={handleUseMyLocation}
              locating={locating}
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <SavedLocationsDropdown currentLocation={location} onSelect={handleSelect} />
            <BackgroundThemePicker value={backgroundTheme} onChange={setBackgroundTheme} />
            <UnitToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {alerts.length > 0 && !loading && (
          <div className="mb-6">
            <AlertBanner alerts={alerts} />
          </div>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="text-sm">Loading forecast…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-900">
              <p className="text-base mb-3">{error}</p>
              <button
                onClick={() => loadData(location)}
                className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium transition"
              >
                Retry
              </button>
            </div>
          ) : (
            <motion.div
              key={location.id || `${location.latitude}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-2 gap-6 lg:gap-8"
            >
              <div className="space-y-6">
                <CurrentConditions
                  location={location}
                  current={current}
                  daily={forecast.daily}
                />
                <HourlyForecast hourly={forecast.hourly} timezone={forecast.timezone} />
                <PrecipChart hourly={forecast.hourly} />
              </div>
              <div className="space-y-6">
                <DailyForecast daily={forecast.daily} hourly={forecast.hourly} timezone={forecast.timezone} />
                <AirQualityCard aqi={aqi} />
                <WeatherMap location={location} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center text-slate-400 text-xs">
        Weather data by Open-Meteo · Alerts by NWS · AQI by Open-Meteo
      </footer>
    </div>
  );
}