import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import WeatherSearch from "@/components/weather/WeatherSearch";
import SavedLocationsDropdown from "@/components/weather/SavedLocationsDropdown";
import BackgroundThemePicker from "@/components/weather/BackgroundThemePicker";
import UnitToggle from "@/components/weather/UnitToggle";
import LanguageSwitcher from "@/components/weather/LanguageSwitcher";
import { useLanguage } from "@/lib/LanguageContext";
import ClothingSuggestion from "@/components/lifestyle/ClothingSuggestion";
import ActivityIndexGrid from "@/components/lifestyle/ActivityIndexGrid";
import TravelComparison from "@/components/lifestyle/TravelComparison";
import Footer from "@/components/Footer";
import { getForecast, reverseGeocode } from "@/lib/weatherApi";
import { BACKGROUND_THEMES } from "@/lib/backgroundThemes";
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
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : DEFAULT_LOCATION;
  } catch {
    return DEFAULT_LOCATION;
  }
}

export default function Lifestyle() {
  const [location, setLocation] = useState(locationFromStorage);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locating, setLocating] = useState(false);
  const { backgroundTheme, setBackgroundTheme, savedLocations } = usePreferences();
  const { t } = useLanguage();

  const loadData = useCallback(async (loc) => {
    setLoading(true);
    setError(null);
    try {
      const f = await getForecast(loc.latitude, loc.longitude);
      setForecast(f);
    } catch {
      setError("error.forecast");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
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
          const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
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

  const themeGradient = BACKGROUND_THEMES.find((t) => t.id === backgroundTheme)?.gradient;
  const bg = themeGradient || "from-white to-slate-100";
  const current = forecast?.current;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bg} transition-colors duration-700 overflow-x-hidden`}
    >
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-slate-900 shrink-0 order-1">
            <img
              src="https://media.base44.com/images/public/6a866866b2a189c37aa2f3d0/9fc2fbc5e_image.png"
              alt="Weatherskies"
              className="w-7 h-7 rounded-lg object-cover"
            />
            <span className="font-semibold tracking-tight">Weatherskies</span>
          </Link>
          <div className="flex items-center gap-2 shrink-0 order-2 ml-auto lg:ml-0 lg:order-3">
            <Link
              to="/lifestyle"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-sky-700 bg-sky-100 ring-1 ring-sky-200 shadow-[0_0_0_3px_rgba(14,165,233,0.15)]"
            >
              <Sparkles className="w-3.5 h-3.5" /> {t("nav.lifestyle")}
            </Link>
            <SavedLocationsDropdown currentLocation={location} onSelect={handleSelect} />
            <BackgroundThemePicker value={backgroundTheme} onChange={setBackgroundTheme} />
            <UnitToggle />
            <LanguageSwitcher />
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="text-sm">{t("loading.lifestyle")}</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-900">
              <p className="text-base mb-3">{t(error)}</p>
              <button
                onClick={() => loadData(location)}
                className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium transition"
              >
                {t("error.retry")}
              </button>
            </div>
          ) : (
            <motion.div
              key={location.id || `${location.latitude}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <ClothingSuggestion current={current} daily={forecast.daily} />
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                  <ActivityIndexGrid daily={forecast.daily} timezone={forecast.timezone} />
                </div>
                <div className="lg:col-span-2">
                  <TravelComparison seedLocations={savedLocations} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}