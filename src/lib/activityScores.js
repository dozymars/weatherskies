// Pure client-side activity scoring from Open-Meteo daily forecast fields.
// Temperatures are in celsius, wind in km/h (Open-Meteo defaults).

export const ACTIVITIES = [
  { key: "running", label: "Running" },
  { key: "beach", label: "Beach" },
  { key: "skiing", label: "Skiing" },
  { key: "gardening", label: "Gardening" },
];

const SNOW_CODES = [71, 73, 75, 77, 85, 86];

function clamp(n) {
  return Math.max(1, Math.min(5, Math.round(n)));
}

function meanTemp(d, i) {
  return (d.temperature_2m_max[i] + d.temperature_2m_min[i]) / 2;
}

function scoreRunning(d, i) {
  let s = 5;
  const t = meanTemp(d, i);
  if (t < 5) s -= (5 - t) * 0.4;
  else if (t > 18) s -= (t - 18) * 0.15;
  const wind = d.wind_speed_10m_max?.[i] ?? 0;
  if (wind > 15) s -= (wind - 15) * 0.06;
  if (wind > 35) s -= 1.5;
  const pop = d.precipitation_probability_max?.[i] ?? 0;
  const psum = d.precipitation_sum?.[i] ?? 0;
  if (pop > 40) s -= (pop - 40) * 0.03;
  if (psum > 2) s -= (psum - 2) * 0.3;
  return clamp(s);
}

function scoreBeach(d, i) {
  let s = 5;
  const max = d.temperature_2m_max?.[i] ?? 20;
  if (max < 24) s -= (24 - max) * 0.25;
  else if (max > 32) s -= (max - 32) * 0.15;
  const wind = d.wind_speed_10m_max?.[i] ?? 0;
  if (wind > 15) s -= (wind - 15) * 0.08;
  const pop = d.precipitation_probability_max?.[i] ?? 0;
  if (pop > 30) s -= (pop - 30) * 0.04;
  const uv = d.uv_index_max?.[i] ?? 0;
  if (uv < 3) s -= 0.5;
  return clamp(s);
}

function scoreSkiing(d, i) {
  const code = d.weather_code?.[i] ?? 0;
  const max = d.temperature_2m_max?.[i] ?? 20;
  const min = d.temperature_2m_min?.[i] ?? 10;
  const isSnow = SNOW_CODES.includes(code);
  const coldEnough = max <= 1 || min <= -2;
  let s;
  if (isSnow && coldEnough) s = 5;
  else if (isSnow) s = 3.5;
  else if (coldEnough) s = 2.5;
  else s = 1;
  const wind = d.wind_speed_10m_max?.[i] ?? 0;
  if (wind > 25) s -= (wind - 25) * 0.05;
  const pop = d.precipitation_probability_max?.[i] ?? 0;
  if (!coldEnough && pop > 40) s -= 0.5;
  return clamp(s);
}

function scoreGardening(d, i) {
  let s = 5;
  const t = meanTemp(d, i);
  if (t < 15) s -= (15 - t) * 0.2;
  else if (t > 25) s -= (t - 25) * 0.15;
  const wind = d.wind_speed_10m_max?.[i] ?? 0;
  if (wind > 20) s -= (wind - 20) * 0.06;
  const pop = d.precipitation_probability_max?.[i] ?? 0;
  if (pop > 40) s -= (pop - 40) * 0.04;
  const psum = d.precipitation_sum?.[i] ?? 0;
  if (psum > 5) s -= (psum - 5) * 0.2;
  const uv = d.uv_index_max?.[i] ?? 0;
  if (uv > 8) s -= 0.5;
  return clamp(s);
}

const SCORERS = { running: scoreRunning, beach: scoreBeach, skiing: scoreSkiing, gardening: scoreGardening };

export function scoreDay(daily, i) {
  const out = {};
  for (const a of ACTIVITIES) out[a.key] = SCORERS[a.key](daily, i);
  return out;
}

export function scoreAllDays(daily) {
  if (!daily || !daily.time) return [];
  return daily.time.map((_, i) => ({ date: daily.time[i], scores: scoreDay(daily, i) }));
}

export function bestDayForActivity(days, activity) {
  let best = null;
  let bestScore = -1;
  for (const day of days) {
    const sc = day.scores[activity];
    if (sc > bestScore) {
      bestScore = sc;
      best = day;
    }
  }
  return best;
}

export function comfortScore(daily, i) {
  let s = 5;
  const mean = meanTemp(daily, i);
  if (mean < 15) s -= (15 - mean) * 0.15;
  else if (mean > 28) s -= (mean - 28) * 0.15;
  const wind = daily.wind_speed_10m_max?.[i] ?? 0;
  if (wind > 20) s -= (wind - 20) * 0.05;
  const pop = daily.precipitation_probability_max?.[i] ?? 0;
  if (pop > 30) s -= (pop - 30) * 0.03;
  return s;
}

export function bestDayToGo(daily, days = 7) {
  if (!daily || !daily.time) return null;
  let best = null;
  let bestScore = -1;
  for (let i = 0; i < Math.min(days, daily.time.length); i++) {
    const sc = comfortScore(daily, i);
    if (sc > bestScore) {
      bestScore = sc;
      best = { index: i, score: sc };
    }
  }
  return best;
}