"use client";

import { useEffect, useState, useRef } from "react";

interface EventMapProps {
  venue: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export default function EventMap({ venue }: EventMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "found" | "error">("loading");
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!venue || !mapRef.current) return;

    let cancelled = false;

    const init = async () => {
      // Dynamically import Leaflet (avoids SSR window errors)
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !mapRef.current) return;

      // Fix Leaflet's broken default icon paths in webpack/Next.js bundles
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Geocode the venue string with OpenStreetMap Nominatim
      let coords: [number, number] = [20, 0]; // world fallback
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(venue)}&format=json&limit=1`,
          { headers: { "Accept-Language": "en" } }
        );
        const results: NominatimResult[] = await res.json();
        if (results.length > 0) {
          coords = [parseFloat(results[0].lat), parseFloat(results[0].lon)];
          if (!cancelled) setStatus("found");
        } else {
          if (!cancelled) setStatus("error");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }

      if (cancelled || !mapRef.current) return;

      // Destroy any existing map instance (React StrictMode double-mount)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Custom SVG pin marker
      const customIcon = L.divIcon({
        className: "",
        html: `
          <div style="
            width: 36px; height: 36px;
            background: hsl(217 91% 60%);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.35);
            display: flex; align-items: center; justify-content: center;
          ">
            <span style="
              transform: rotate(45deg);
              font-family: 'Material Symbols Outlined';
              font-size: 16px;
              color: white;
              line-height: 1;
            ">location_on</span>
          </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -38],
      });

      const map = L.map(mapRef.current, {
        center: coords,
        zoom: 15,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      });

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      L.marker(coords, { icon: customIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family: system-ui; font-size: 13px; font-weight: 600; min-width: 140px;">${venue}</div>`,
          { closeButton: false, offset: [0, -4] }
        )
        .openPopup();
    };

    init();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [venue]);

  return (
    <div className="relative w-full h-full isolate">
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-container z-10">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            Locating venue…
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-container z-10">
          <div className="flex flex-col items-center gap-1 text-on-surface-variant text-sm text-center px-4">
            <span className="material-symbols-outlined text-2xl text-secondary">location_off</span>
            <span>Could not locate "{venue}" on the map</span>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
