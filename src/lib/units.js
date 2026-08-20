// Unit conversion helpers. Open-Meteo returns celsius + km/h; convert client-side.
export function convertTemp(celsius, units) {
  return units === "imperial" ? (celsius * 9) / 5 + 32 : celsius;
}

export function tempUnit(units) {
  return units === "imperial" ? "°F" : "°C";
}

export function convertWind(kmh, units) {
  return units === "imperial" ? kmh * 0.621371 : kmh;
}

export function windUnit(units) {
  return units === "imperial" ? "mph" : "km/h";
}