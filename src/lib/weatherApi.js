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
      "temperature_2m,apparent_temperature,weather_code,precipitation_probability,is_day",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant,sunrise,sunset,uv_index_max",
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
  // BigDataCloud's free client-side reverse geocoder (no API key required).
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const r = await res.json();
      const name = r.city || r.locality || r.principalSubdivision || "My Location";
      if (name !== "My Location") {
        return {
          id: `${lat},${lon}`,
          name,
          country: r.countryCode || "",
          region: r.principalSubdivision || "",
          latitude: lat,
          longitude: lon,
          label: [name, r.principalSubdivision, r.countryCode].filter(Boolean).join(", "),
        };
      }
    }
  } catch (e) {
    // fall through to Open-Meteo reverse
  }
  // Fallback: Open-Meteo reverse geocoder.
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&format=json`;
    const res = await fetch(url);
    if (res.ok) {
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

// Air Quality Index via Open-Meteo Air Quality API (no key required).
export async function getAQI(lat, lon) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "us_aqi",
    timezone: "auto",
  });
  const res = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`
  );
  if (!res.ok) throw new Error("Failed to fetch AQI");
  const data = await res.json();
  return data.current?.us_aqi ?? null;
}

// Severe weather alerts via the US National Weather Service (no key required).
// Only covers US locations; returns [] elsewhere.
export async function getAlerts(lat, lon) {
  const res = await fetch(
    `https://api.weather.gov/alerts/active?point=${lat},${lon}`,
    { headers: { Accept: "application/geo+json" } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  if (!data.features) return [];
  return data.features.map((f) => ({
    event: f.properties.event,
    headline: f.properties.headline,
    description: f.properties.description,
    instruction: f.properties.instruction,
    severity: f.properties.severity,
    onset: f.properties.onset,
    expires: f.properties.expires,
    senderName: f.properties.senderName,
  }));
}