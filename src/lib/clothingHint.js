// Pure clothing/comfort hint from current conditions.
// Temperatures are celsius, wind km/h (Open-Meteo defaults).

export function getClothingHint(current, daily) {
  if (!current) return "";
  const temp = current.temperature_2m;
  const feels = current.apparent_temperature;
  const wind = current.wind_speed_10m;
  const precip = current.precipitation ?? 0;
  const dayLow = daily?.temperature_2m_min?.[0] ?? temp;

  const hints = [];

  let base;
  if (temp >= 28) base = "Light, breathable clothing";
  else if (temp >= 20) base = "Light layers";
  else if (temp >= 12) base = "A light jacket or sweater";
  else if (temp >= 5) base = "A warm jacket";
  else if (temp >= -5) base = "A heavy coat, hat and gloves";
  else base = "Full winter gear — layer up";
  hints.push(base);

  const drop = temp - dayLow;
  if (drop >= 8 && temp >= 12) hints.push("bring a jacket for the evening");
  else if (drop >= 8 && temp < 12) hints.push("an extra layer for the evening drop");

  if (precip >= 0.5) hints.push("carry an umbrella");
  else if (precip > 0) hints.push("a rain shell just in case");

  if (wind >= 30) hints.push("it's blustery outside");
  else if (wind >= 20 && temp < 15) hints.push("the wind makes it feel colder");

  if (feels - temp <= -5 && !hints.some((h) => h.includes("colder"))) {
    hints.push("it feels colder than it looks");
  }

  return hints.join(" — ");
}