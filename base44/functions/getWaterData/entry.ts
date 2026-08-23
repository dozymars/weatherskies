import { haversineKm } from "../../shared/distance.ts";

// Returns the nearest USGS stream/river gauges and their current readings.
// USGS Water Services only covers the United States.
export default async function (req) {
  try {
    const body = await req.json().catch(() => ({}));
    const latitude = Number(body.latitude);
    const longitude = Number(body.longitude);
    const country = (body.country || "").toString().toUpperCase();

    if (!isFinite(latitude) || !isFinite(longitude)) {
      return Response.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    // USGS data is US-only.
    if (country && country !== "US") {
      return Response.json({ available: false, reason: "outside_us" });
    }

    // Single call: Instantaneous Values within a bounding box. Returns only
    // active gauges with recent readings, including their coordinates.
    const d = 0.4; // ~45km half-width
    const west = longitude - d;
    const south = latitude - d;
    const east = longitude + d;
    const north = latitude + d;
    const ivUrl = `https://waterservices.usgs.gov/nwis/iv/?format=json&bBox=${west},${south},${east},${north}&parameterCd=00065,00060&period=PT2H&siteStatus=all`;
    const ivRes = await fetch(ivUrl);
    if (!ivRes.ok) {
      return Response.json({ available: false, reason: "service_error" });
    }
    const ivText = await ivRes.text();
    const ivJson = JSON.parse(ivText);
    const series = ivJson?.value?.timeSeries || [];
    if (series.length === 0) {
      return Response.json({ available: false, reason: "no_sites" });
    }

    const bySite = {};
    for (const ts of series) {
      const siteCode = ts.sourceInfo?.siteCode?.[0]?.value;
      if (!siteCode) continue;
      const geo = ts.sourceInfo?.geoLocation || {};
      const lat = parseFloat(geo.geogPoint?.latitude ?? geo.geogLocation?.latitude);
      const lon = parseFloat(geo.geogPoint?.longitude ?? geo.geogLocation?.longitude);
      if (!bySite[siteCode]) {
        bySite[siteCode] = {
          siteNo: siteCode,
          name: ts.sourceInfo?.siteName || "Unnamed gauge",
          lat,
          lon,
          gageHeightSeries: [],
          discharge: null,
          gageHeight: null,
        };
      }
      const varCode = ts.variable?.variableCode?.[0]?.value;
      const vals = ts.values?.[0]?.value || [];
      if (varCode === "00065") {
        bySite[siteCode].gageHeightSeries = vals
          .map((v) => parseFloat(v.value))
          .filter((n) => isFinite(n));
      } else if (varCode === "00060") {
        const latest = vals[vals.length - 1];
        if (latest) bySite[siteCode].discharge = parseFloat(latest.value);
      }
    }

    const gauges = Object.values(bySite)
      .filter((g) => isFinite(g.lat) && isFinite(g.lon))
      .map((g) => {
        if (g.gageHeightSeries.length > 0) {
          g.gageHeight = g.gageHeightSeries[g.gageHeightSeries.length - 1];
        }
        return {
          name: g.name,
          siteNo: g.siteNo,
          distanceKm:
            Math.round(haversineKm(latitude, longitude, g.lat, g.lon) * 10) / 10,
          gageHeightFt: g.gageHeight,
          dischargeCfs: g.discharge,
          status: trendStatus(g.gageHeightSeries),
        };
      })
      .filter((g) => g.gageHeightFt != null || g.dischargeCfs != null)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 6);

    if (gauges.length === 0) {
      return Response.json({ available: false, reason: "no_sites" });
    }
    return Response.json({ available: true, gauges });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

function trendStatus(series) {
  if (!series || series.length < 2) return "Steady";
  const a = series[series.length - 2];
  const b = series[series.length - 1];
  const diff = b - a;
  const eps = 0.05;
  if (diff > eps) return "Rising";
  if (diff < -eps) return "Falling";
  return "Steady";
}