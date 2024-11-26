'use client';

import { useJsApiLoader } from "@react-google-maps/api";
import React, { ReactNode, createContext, useContext, useState, useEffect } from "react";

type MarkerPosition = { lat: number; lng: number } | null;
type Attempt = { position: MarkerPosition; distance: number; attempt: number };

type MapContextType = {
  markerPosition: MarkerPosition;
  setMarkerPosition: React.Dispatch<React.SetStateAction<MarkerPosition>>;
  attempts: Attempt[];
  addAttempt: (distance: number) => void;
  maxAttempts: number;
  isSuccessful?: boolean;
};

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { isLoaded: scriptLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const [markerPosition, setMarkerPosition] = useState<MarkerPosition>(() => {
    if (typeof window !== "undefined") {
      const storedMarkerPosition = localStorage.getItem("markerPosition");
      return storedMarkerPosition ? JSON.parse(storedMarkerPosition) : null;
    }
    return null;
  });

  const [attempts, setAttempts] = useState<Attempt[]>(() => {
    if (typeof window !== "undefined") {
      const storedAttempts = localStorage.getItem("attempts");
      return storedAttempts ? JSON.parse(storedAttempts) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        if (markerPosition !== null) {
          localStorage.setItem("markerPosition", JSON.stringify(markerPosition));
        } else {
          localStorage.removeItem("markerPosition");
        }
      } catch (error) {
        console.error("Failed to save markerPosition to localStorage:", error);
      }
    }
  }, [markerPosition]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("attempts", JSON.stringify(attempts));
      } catch (error) {
        console.error("Failed to save attempts to localStorage:", error);
      }
    }
  }, [attempts]);

  // Sync state across tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "markerPosition") {
        setMarkerPosition(event.newValue ? JSON.parse(event.newValue) : null);
      }
      if (event.key === "attempts") {
        setAttempts(event.newValue ? JSON.parse(event.newValue) : []);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const addAttempt = (distance: number) => {
    if (markerPosition) {
      const newAttempt = {
        position: markerPosition,
        distance,
        attempt: attempts.length + 1,
      };
      setAttempts((prev) => [...prev, newAttempt]);
      // localStorage update is handled by useEffect
    }
  };

  if (!isMounted || !scriptLoaded) {
    return <p>Loading...</p>;
  }

  if (loadError) {
    return <p>Encountered error while loading Google Maps</p>;
  }

  return (
    <MapContext.Provider
      value={{
        markerPosition,
        setMarkerPosition,
        attempts,
        addAttempt,
        maxAttempts: 3,
        isSuccessful:
          attempts.length > 0 && attempts[attempts.length - 1].distance <= 20,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};
