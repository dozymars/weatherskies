import { secrets } from "base44:runtime";
import { haversineKm } from "../../shared/distance.ts";

// Returns the nearest active wildfire detections from NASA FIRMS (VIIRS).
// Requires the NASA_FIRMS_KEY secret (free MAP key from firms.modaps.eosdis.nasa.gov).
export default async function (req) {
  try {
    const body = await req.json().catch(() => ({}));
    const latitude = Number(body.latitude);
    const longitude = Number(body.longitude);
    if (!isFinite(latitude) || !isFinite(longitude)) {
      return Response.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    const key = secrets.get("NASA_FIRMS_KEY");
    if (!key) {
      return Response.json({ available: false, reason: "no_key" });
    }

    // ~55km half-width bounding box around the location.
    const d = 0.5;
    const west = longitude - d;
    const east = longitude + d;
    const south = latitude - d;
    const north = latitude + d;

    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${key}/VIIRS_SNPP_NRT/${west},${south},${east},${north}/1`;
    const res = await fetch(url);
    const text = await res.text();
    if (!res.ok) {
      return Response.json({ available: false, reason: "service_error" });
    }

    // FIRMS returns a plain-text error message (not CSV) for an invalid key.
    if (text.trim().toLowerCase().startsWith("invalid")) {
      return Response.json({ available: false, reason: "invalid_key" });
    }

    const fires = parseCsv(text)
      .map((row) => {
        const fLat = parseFloat(row.latitude);
        const fLon = parseFloat(row.longitude);
        return {
          latitude: fLat,
          longitude: fLon,
          brightness: parseFloat(row.bright_ti4 || ""),
          confidence: row.confidence || "",
          acqDate: row.acq_date || "",
          acqTime: row.acq_time || "",
          frp: parseFloat(row.frp || ""),
          distanceKm:
            isFinite(fLat) && isFinite(fLon)
              ? haversineKm(latitude, longitude, fLat, fLon)
              : null,
        };
      })
      .filter((f) => isFinite(f.latitude) && isFinite(f.longitude))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 6);

    return Response.json({ available: true, fires });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(",");
    const obj = {};
    headers.forEach((h, idx) => (obj[h] = cells[idx]?.trim()));
    rows.push(obj);
  }
  return rows;
}