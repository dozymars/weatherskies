// WMO weather interpretation codes -> description + lucide icon name + theme
import {
  Sun,
  CloudSun,
  Cloud,
  Cloudy,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  CloudHail,
} from "lucide-react";

export const WEATHER_CODES = {
  0: { label: "Clear Sky", icon: Sun, theme: "clear", color: "text-amber-500" },
  1: { label: "Mainly Clear", icon: CloudSun, theme: "clear", color: "text-amber-500" },
  2: { label: "Partly Cloudy", icon: CloudSun, theme: "partly", color: "text-amber-500" },
  3: { label: "Overcast", icon: Cloudy, theme: "cloudy", color: "text-slate-400" },
  45: { label: "Fog", icon: CloudFog, theme: "fog", color: "text-slate-400" },
  48: { label: "Rime Fog", icon: CloudFog, theme: "fog", color: "text-slate-400" },
  51: { label: "Light Drizzle", icon: CloudDrizzle, theme: "drizzle", color: "text-sky-500" },
  53: { label: "Drizzle", icon: CloudDrizzle, theme: "drizzle", color: "text-sky-500" },
  55: { label: "Heavy Drizzle", icon: CloudDrizzle, theme: "drizzle", color: "text-sky-600" },
  56: { label: "Freezing Drizzle", icon: CloudHail, theme: "sleet", color: "text-teal-500" },
  57: { label: "Freezing Drizzle", icon: CloudHail, theme: "sleet", color: "text-teal-500" },
  61: { label: "Light Rain", icon: CloudRain, theme: "rain", color: "text-sky-600" },
  63: { label: "Rain", icon: CloudRain, theme: "rain", color: "text-sky-600" },
  65: { label: "Heavy Rain", icon: CloudRainWind, theme: "rain", color: "text-sky-700" },
  66: { label: "Freezing Rain", icon: CloudHail, theme: "sleet", color: "text-teal-500" },
  67: { label: "Freezing Rain", icon: CloudHail, theme: "sleet", color: "text-teal-500" },
  71: { label: "Light Snow", icon: CloudSnow, theme: "snow", color: "text-cyan-400" },
  73: { label: "Snow", icon: CloudSnow, theme: "snow", color: "text-cyan-400" },
  75: { label: "Heavy Snow", icon: Snowflake, theme: "snow", color: "text-cyan-500" },
  77: { label: "Snow Grains", icon: Snowflake, theme: "snow", color: "text-cyan-400" },
  80: { label: "Rain Showers", icon: CloudRain, theme: "rain", color: "text-sky-600" },
  81: { label: "Rain Showers", icon: CloudRain, theme: "rain", color: "text-sky-600" },
  82: { label: "Violent Showers", icon: CloudRainWind, theme: "rain", color: "text-sky-700" },
  85: { label: "Snow Showers", icon: CloudSnow, theme: "snow", color: "text-cyan-400" },
  86: { label: "Snow Showers", icon: Snowflake, theme: "snow", color: "text-cyan-400" },
  95: { label: "Thunderstorm", icon: CloudLightning, theme: "storm", color: "text-indigo-500" },
  96: { label: "Thunderstorm + Hail", icon: CloudLightning, theme: "storm", color: "text-indigo-500" },
  99: { label: "Thunderstorm + Hail", icon: CloudLightning, theme: "storm", color: "text-indigo-600" },
};

export function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { label: "Unknown", icon: Cloud, theme: "cloudy", color: "text-slate-400" };
}

// Background gradient themes keyed by (theme + isDay)
export const BG_THEMES = {
  clear_day: "from-sky-400 via-sky-500 to-blue-600",
  clear_night: "from-indigo-950 via-slate-900 to-blue-950",
  partly_day: "from-sky-500 via-sky-600 to-blue-700",
  partly_night: "from-slate-900 via-indigo-950 to-blue-950",
  cloudy_day: "from-slate-400 via-slate-500 to-slate-600",
  cloudy_night: "from-slate-800 via-slate-900 to-slate-950",
  fog_day: "from-slate-400 via-slate-500 to-slate-600",
  fog_night: "from-slate-800 via-slate-900 to-slate-950",
  drizzle_day: "from-sky-600 via-slate-600 to-slate-700",
  drizzle_night: "from-slate-800 via-slate-900 to-slate-950",
  rain_day: "from-slate-600 via-slate-700 to-slate-800",
  rain_night: "from-slate-900 via-slate-950 to-blue-950",
  snow_day: "from-slate-300 via-slate-400 to-slate-500",
  snow_night: "from-slate-700 via-slate-800 to-slate-900",
  sleet_day: "from-slate-500 via-slate-600 to-slate-700",
  sleet_night: "from-slate-800 via-slate-900 to-slate-950",
  storm_day: "from-slate-700 via-slate-800 to-slate-900",
  storm_night: "from-slate-950 via-slate-900 to-indigo-950",
};

export function getBackground(theme, isDay) {
  const key = `${theme}_${isDay ? "day" : "night"}`;
  return BG_THEMES[key] || BG_THEMES.cloudy_day;
}