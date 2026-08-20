import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Minimal radar-style map using OpenStreetMap tiles centered on the location.
export default function WeatherMap({ location }) {
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
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
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
    <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 p-5 sm:p-6 overflow-hidden">
      <h3 className="text-white/90 text-sm font-semibold uppercase tracking-wider mb-4">
        Map · {location?.name}
      </h3>
      <div
        ref={containerRef}
        className="w-full h-64 rounded-2xl overflow-hidden border border-white/10"
      />
    </div>
  );
}