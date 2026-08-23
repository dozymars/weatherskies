import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Cloud } from "lucide-react";
import WeatherSearch from "@/components/weather/WeatherSearch";
import CurrentConditions from "@/components/weather/CurrentConditions";
import HourlyForecast from "@/components/weather/HourlyForecast";
import DailyForecast from "@/components/weather/DailyForecast";
import WeatherMap from "@/components/weather/WeatherMap";
import AlertBanner from "@/components/weather/AlertBanner";
import EnvironmentPanel from "@/components/weather/EnvironmentPanel";
import { base44 } from "@/api/base44Client";
import TempPrecipChart from "@/components/weather/TempPrecipChart";
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
  const [airData, setAirData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [newsLoading, setNewsLoading] = useState(false);
  const envRunId = useRef(0);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locating, setLocating] = useState(false);
  const { backgroundTheme, setBackgroundTheme } = usePreferences();

  const loadData = useCallback(async (loc) => {
    setLoading(true);
    setError(null);
    setNewsLoading(true);
    setNewsData(null);
    const myRunId = ++envRunId.current;
    // Environmental data loads in parallel but does not block the forecast.
    Promise.all([
      base44.integrations.Core.InvokeLLM({
        prompt: `Find the latest recent weather news headlines for ${loc.name} (latitude ${loc.latitude}, longitude ${loc.longitude}). Focus on severe weather events, storms, floods, heatwaves, droughts, wildfires, or unusual weather affecting this area in the past few weeks. Return up to 5 of the most recent and relevant items.`,
        add_context_from_internet: true,
        model: "gemini_3_flash",
        response_json_schema: {
          type: "object",
          properties: {
            articles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  source: { type: "string" },
                  url: { type: "string" },
                  date: { type: "string" },
                },
              },
            },
          },
        },
      })
        .then((r) => r.articles || [])
        .catch(() => null),
    ])
      .then(([n]) => {
        if (myRunId !== envRunId.current) return;
        setNewsData(n);
      })
      .finally(() => {
        if (myRunId === envRunId.current) setNewsLoading(false);
      });
    try {
      const [f, air, al] = await Promise.all([
        getForecast(loc.latitude, loc.longitude),
        getAQI(loc.latitude, loc.longitude).catch(() => null),
        getAlerts(loc.latitude, loc.longitude).catch(() => []),
      ]);
      setForecast(f);
      setAirData(air);
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-slate-900 shrink-0 order-1">
            <Cloud className="w-6 h-6" strokeWidth={1.5} />
            <span className="font-semibold tracking-tight hidden lg:block">Weatherskies</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 order-2 ml-auto lg:ml-0 lg:order-3">
            <SavedLocationsDropdown currentLocation={location} onSelect={handleSelect} />
            <BackgroundThemePicker value={backgroundTheme} onChange={setBackgroundTheme} />
            <UnitToggle />
          </div>
          <div className="order-3 lg:order-2 basis-full lg:basis-0 flex-1 flex items-center justify-start lg:justify-center gap-3">
            <span className="text-slate-900 font-semibold text-sm tracking-tight whitespace-nowrap hidden lg:block">
              {location.name}
            </span>
            <WeatherSearch
              onSelect={handleSelect}
              onUseMyLocation={handleUseMyLocation}
              locating={locating}
            />
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
                <TempPrecipChart hourly={forecast.hourly} />
              </div>
              <div className="space-y-6">
                <DailyForecast daily={forecast.daily} hourly={forecast.hourly} timezone={forecast.timezone} />
                <EnvironmentPanel
                  airData={airData}
                  newsData={newsData}
                  newsLoading={newsLoading}
                />
                <WeatherMap location={location} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}