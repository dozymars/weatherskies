import React, { createContext, useState, useEffect, useCallback, useRef, useContext } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const LOC_KEY = "weather_saved_locations";
const UNITS_KEY = "weather_units";
const BG_KEY = "weather_background_theme";

const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [units, setUnitsState] = useState(
    () => localStorage.getItem(UNITS_KEY) || "metric"
  );
  const [backgroundTheme, setBackgroundThemeState] = useState(
    () => localStorage.getItem(BG_KEY) || "auto"
  );
  const [savedLocations, setSavedLocations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LOC_KEY)) || [];
    } catch {
      return [];
    }
  });
  const syncedUserId = useRef(null);

  // When a user logs in, merge local saved locations into their account.
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (syncedUserId.current === user.id) return;
    syncedUserId.current = user.id;

    const accountLocs = Array.isArray(user.saved_locations)
      ? user.saved_locations
      : [];
    let localLocs = [];
    try {
      localLocs = JSON.parse(localStorage.getItem(LOC_KEY)) || [];
    } catch {
      localLocs = [];
    }

    const seen = new Set();
    const merged = [];
    const add = (l) => {
      const key = l.id || `${l.latitude},${l.longitude}`;
      if (seen.has(key)) return;
      seen.add(key);
      merged.push(l);
    };
    [...localLocs, ...accountLocs].forEach(add);

    setSavedLocations(merged);
    localStorage.setItem(LOC_KEY, JSON.stringify(merged));

    const accountUnits = user.units || "metric";
    if (accountUnits !== units) {
      setUnitsState(accountUnits);
      localStorage.setItem(UNITS_KEY, accountUnits);
    }

    if (merged.length !== accountLocs.length || JSON.stringify(merged) !== JSON.stringify(accountLocs)) {
      base44.auth.updateMe({ saved_locations: merged }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const persistUnits = useCallback(
    (next) => {
      setUnitsState(next);
      localStorage.setItem(UNITS_KEY, next);
      if (isAuthenticated) {
        base44.auth.updateMe({ units: next }).catch(() => {});
      }
    },
    [isAuthenticated]
  );

  const persistBackgroundTheme = useCallback((next) => {
    setBackgroundThemeState(next);
    localStorage.setItem(BG_KEY, next);
  }, []);

  const persistLocations = useCallback(
    (next) => {
      setSavedLocations(next);
      localStorage.setItem(LOC_KEY, JSON.stringify(next));
      if (isAuthenticated) {
        base44.auth.updateMe({ saved_locations: next }).catch(() => {});
      }
    },
    [isAuthenticated]
  );

  const toggleSaved = useCallback(
    (loc) => {
      const key = loc.id || `${loc.latitude},${loc.longitude}`;
      const exists = savedLocations.some(
        (l) => (l.id || `${l.latitude},${l.longitude}`) === key
      );
      const next = exists
        ? savedLocations.filter(
            (l) => (l.id || `${l.latitude},${l.longitude}`) !== key
          )
        : [...savedLocations, loc];
      persistLocations(next);
      return !exists;
    },
    [savedLocations, persistLocations]
  );

  const isSaved = useCallback(
    (loc) => {
      const key = loc.id || `${loc.latitude},${loc.longitude}`;
      return savedLocations.some(
        (l) => (l.id || `${l.latitude},${l.longitude}`) === key
      );
    },
    [savedLocations]
  );

  return (
    <PreferencesContext.Provider
      value={{ units, setUnits: persistUnits, backgroundTheme, setBackgroundTheme: persistBackgroundTheme, savedLocations, toggleSaved, isSaved }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx)
    throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}