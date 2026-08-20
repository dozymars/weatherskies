// Open-Meteo API helpers (free, no API key required)

export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}&count=6&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to search locations");
  const data = await res.json();
  if (!data.results) return [];
  return data.results.map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country_code,
    region: r.admin1 || "",
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
    label: [r.name, r.admin1, r.country_code].filter(Boolean).join(", "),
  }));
}

export async function getForecast(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,precipitation,uv_index",
    hourly:
      "temperature_2m,weather_code,precipitation_probability,is_day",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset,uv_index_max",
    timezone: "auto",
    forecast_days: 10,
    wind_speed_unit: "kmh",
    temperature_unit: "celsius",
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch forecast");
  return res.json();
}

export async function reverseGeocode(lat, lon) {
  const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&format=json`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("reverse geocode failed");
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const r = data.results[0];
      return {
        id: r.id,
        name: r.name,
        country: r.country_code,
        region: r.admin1 || "",
        latitude: r.latitude,
        longitude: r.longitude,
        label: [r.name, r.admin1, r.country_code].filter(Boolean).join(", "),
      };
    }
  } catch (e) {
    // fall through to coordinate label
  }
  return {
    id: `${lat},${lon}`,
    name: "My Location",
    country: "",
    region: "",
    latitude: lat,
    longitude: lon,
    label: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
  };
}