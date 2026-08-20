import React from "react";
import { motion } from "framer-motion";
import { MapPin, Wind, Droplets, Gauge, Eye, Sunrise, Sunset, Thermometer } from "lucide-react";
import { getWeatherInfo } from "@/lib/weatherCodes";
import { usePreferences } from "@/lib/PreferencesContext";
import { convertTemp, tempUnit, convertWind, windUnit } from "@/lib/units";
import SaveLocationButton from "./SaveLocationButton";
import ShareButton from "./ShareButton";

function toCardinal(deg) {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

export default function CurrentConditions({ location, current, daily }) {
  const { units } = usePreferences();
  const info = getWeatherInfo(current.weather_code);
  const Icon = info.icon;
  const sunrise = daily?.sunrise?.[0];
  const sunset = daily?.sunset?.[0];

  const details = [
    {
      icon: Thermometer,
      label: "Feels Like",
      value: `${Math.round(convertTemp(current.apparent_temperature, units))}${tempUnit(units)}`,
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: `${current.relative_humidity_2m}%`,
    },
    {
      icon: Wind,
      label: "Wind",
      value: `${Math.round(convertWind(current.wind_speed_10m, units))} ${windUnit(units)} ${toCardinal(current.wind_direction_10m)}`,
    },
    {
      icon: Gauge,
      label: "Pressure",
      value: `${Math.round(current.pressure_msl)} hPa`,
    },
    {
      icon: Eye,
      label: "Precipitation",
      value: `${(current.precipitation ?? 0).toFixed(1)} mm`,
    },
    {
      icon: Sunrise,
      label: "Sunrise",
      value: sunrise
        ? new Date(sunrise).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "—",
    },
    {
      icon: Sunset,
      label: "Sunset",
      value: sunset
        ? new Date(sunset).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "—",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-white"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5 text-white/80 min-w-0">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium tracking-wide truncate">
            {location.label}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <SaveLocationButton location={location} />
          <ShareButton location={location} />
        </div>
      </div>
      <p className="text-xs text-white/60 mb-6">
        {new Date().toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}{" "}
        ·{" "}
        {new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <div className="flex items-center gap-4 sm:gap-6 mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <Icon className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-lg" strokeWidth={1.2} />
        </motion.div>
        <div>
          <div className="flex items-start">
            <span className="text-7xl sm:text-8xl font-extralight leading-none tracking-tighter">
              {Math.round(convertTemp(current.temperature_2m, units))}
            </span>
            <span className="text-3xl font-light mt-2 ml-1">{tempUnit(units)}</span>
          </div>
          <p className="text-lg font-medium text-white/90 mt-1">{info.label}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {details.map((d) => {
          const DIcon = d.icon;
          return (
            <div
              key={d.label}
              className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3"
            >
              <div className="flex items-center gap-1.5 text-white/70 mb-1">
                <DIcon className="w-3.5 h-3.5" />
                <span className="text-[11px] uppercase tracking-wider font-medium">
                  {d.label}
                </span>
              </div>
              <div className="text-base font-semibold">{d.value}</div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}