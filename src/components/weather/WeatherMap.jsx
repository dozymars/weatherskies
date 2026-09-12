import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "@/lib/LanguageContext";

// Minimal radar-style map using OpenStreetMap tiles centered on the location.
export default function WeatherMap({ location }) {
  const { t } = useLanguage();
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !location) return;
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: false,
      }).setView([location.latitude, location.longitude], 8);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 19 }
      ).addTo(mapRef.current);

      const marker = L.marker([location.latitude, location.longitude]).addTo(mapRef.current);
      marker.bindPopup(location.name).openPopup();
    } else {
      mapRef.current.setView([location.latitude, location.longitude], 8);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.latitude, location?.longitude]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="rounded-3xl bg-slate-100 border border-slate-200 p-5 sm:p-6 overflow-hidden">
      <h3 className="text-slate-700 text-sm font-semibold uppercase tracking-wider mb-4">
        {t("map.title", { name: location?.name })}
      </h3>
      <div
        ref={containerRef}
        className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200"
      />
    </div>
  );
}