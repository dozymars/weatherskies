import { createClientFromRequest } from "npm:@base44/sdk@0.8.40";

const WMO = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Rime fog", 51: "Light drizzle", 53: "Drizzle",
  55: "Heavy drizzle", 56: "Freezing drizzle", 57: "Freezing drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain", 66: "Freezing rain",
  67: "Freezing rain", 71: "Light snow", 73: "Snow", 75: "Heavy snow",
  77: "Snow grains", 80: "Rain showers", 81: "Rain showers",
  82: "Violent showers", 85: "Snow showers", 86: "Snow showers",
  95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with hail",
};

async function fetchForecast(lat, lon) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "temperature_2m,weather_code,apparent_temperature,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "1",
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!res.ok) throw new Error("forecast failed");
  return res.json();
}

function buildEmail(summaries) {
  const subject = "Your Daily Skyline Forecast";
  const rows = summaries
    .map(
      (s) => `
      <tr>
        <td style="padding:10px 12px;font-weight:600;font-size:16px;color:#0f172a;">${s.name}</td>
        <td style="padding:10px 12px;color:#334155;">${WMO[s.code] || "—"}</td>
        <td style="padding:10px 12px;font-weight:600;color:#0f172a;">${s.max}° / ${s.min}°</td>
        <td style="padding:10px 12px;color:#0ea5e9;">${s.pop}%</td>
      </tr>`
    )
    .join("");
  const body = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;background:#f8fafc;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:linear-gradient(135deg,#0ea5e9,#1d4ed8);padding:24px;color:#fff;">
        <h1 style="margin:0;font-size:22px;font-weight:700;">Good morning ☀️</h1>
        <p style="margin:4px 0 0;opacity:0.9;font-size:14px;">Here's your forecast for today.</p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#f1f5f9;color:#475569;text-align:left;">
            <th style="padding:10px 12px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Location</th>
            <th style="padding:10px 12px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Conditions</th>
            <th style="padding:10px 12px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">High / Low</th>
            <th style="padding:10px 12px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Precip</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="padding:16px 24px;font-size:12px;color:#94a3b8;text-align:center;">
        Forecast by Open-Meteo · Sent by Skyline
      </div>
    </div>`;
  return { subject, body };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    // Shared secret for scheduled workflow invocations. An admin may also call
    // directly; everyone else must present the cron secret header.
    const providedSecret =
      req.headers.get("x-cron-secret") || (req.headers.get("X-Cron-Secret") ?? "");

    let isAdmin = false;
    try {
      const user = await base44.auth.me();
      if (user) isAdmin = user.role === "admin";
    } catch (e) {
      // No user context — only allowed via the cron secret below.
    }

    const cronSecret = process.env.CRON_SECRET;
    const secretOk = cronSecret && providedSecret && providedSecret === cronSecret;

    if (!isAdmin && !secretOk) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await base44.asServiceRole.entities.User.list("-created_date", 500);

    let sent = 0;
    for (const u of users) {
      const locs = Array.isArray(u.saved_locations) ? u.saved_locations : [];
      if (!locs.length || !u.email) continue;

      const summaries = [];
      for (const loc of locs) {
        try {
          const f = await fetchForecast(loc.latitude, loc.longitude);
          const c = f.current;
          const d = f.daily;
          summaries.push({
            name: loc.name || "Saved location",
            temp: Math.round(c.temperature_2m),
            code: c.weather_code,
            max: Math.round(d.temperature_2m_max[0]),
            min: Math.round(d.temperature_2m_min[0]),
            pop: d.precipitation_probability_max?.[0] ?? 0,
          });
        } catch (e) {
          // skip this location on failure
        }
      }

      if (!summaries.length) continue;

      const { subject, body } = buildEmail(summaries);
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: u.email,
          subject,
          body,
        });
        sent++;
      } catch (e) {
        // skip failed send
      }
    }

    return Response.json({ ok: true, sent, users: users.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}