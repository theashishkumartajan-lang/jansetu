"use client";

import { useCallback, useMemo, useState } from "react";
import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { AnimatePresence, motion } from "framer-motion";
import { Layers, MapPin, Navigation, X } from "lucide-react";
import { useAppStore } from "@/stores/app-store";

interface MapMarkerData {
  id: string;
  lat: number;
  lng: number;
  category: string;
  severity: string;
  status: string;
  type: "issue" | "prediction";
}

const FILTERS = ["all", "critical", "high", "medium", "low", "resolved", "predicted"] as const;

const SEVERITY_COLORS: Record<string, string> = {
  Critical: "#DC2626",
  High: "#F59E0B",
  Medium: "#2563EB",
  Low: "#16A34A",
};

const STATUS_COLORS: Record<string, string> = {
  Resolved: "#16A34A",
  Verified: "#059669",
  Escalated: "#DC2626",
  default: "#DC2626",
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  fullscreenControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  clickableIcons: false,
  gestureHandling: "greedy",
  styles: [
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#E7EDF4" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#BBD7F0" }] },
  ],
};

function getMarkerColor(marker: MapMarkerData) {
  if (marker.type === "prediction") return "#635BFF";
  if (marker.status === "Resolved" || marker.status === "Verified") return STATUS_COLORS.Resolved;
  return SEVERITY_COLORS[marker.severity] || STATUS_COLORS.default;
}

function createMarkerIcon(color: string, scale = 1): google.maps.Symbol {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 0.95,
    strokeColor: "#FFFFFF",
    strokeWeight: 2,
    scale: 9 * scale,
  };
}

export default function MapComponent() {
  const { issues, predictions, mapFilter, setMapFilter } = useAppStore();
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerData | null>(null);
  const [showLegend, setShowLegend] = useState(true);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const markers = useMemo(() => {
    const allMarkers: MapMarkerData[] = [];

    if (mapFilter === "all" || mapFilter === "predicted") {
      predictions.forEach((prediction) => {
        allMarkers.push({
          id: `pred-${prediction.id}`,
          lat: prediction.lat,
          lng: prediction.lng,
          category: prediction.category,
          severity: "Low",
          status: "Predicted",
          type: "prediction",
        });
      });
    }

    if (mapFilter !== "predicted") {
      issues.forEach((issue) => {
        const isResolved = issue.status === "Resolved" || issue.status === "Verified";
        if (mapFilter === "resolved" && !isResolved) return;
        if (mapFilter === "critical" && issue.severity !== "Critical") return;
        if (mapFilter === "high" && issue.severity !== "High") return;
        if (mapFilter === "medium" && issue.severity !== "Medium") return;
        if (mapFilter === "low" && issue.severity !== "Low") return;

        allMarkers.push({
          id: issue.id,
          lat: issue.location.lat,
          lng: issue.location.lng,
          category: issue.category,
          severity: issue.severity,
          status: issue.status.replaceAll("_", " "),
          type: "issue",
        });
      });
    }

    return allMarkers;
  }, [issues, predictions, mapFilter]);

  const center = useMemo(() => {
    if (!markers.length) return { lat: 19.076, lng: 72.8777 };
    const totals = markers.reduce(
      (acc, marker) => ({ lat: acc.lat + marker.lat, lng: acc.lng + marker.lng }),
      { lat: 0, lng: 0 }
    );
    return { lat: totals.lat / markers.length, lng: totals.lng / markers.length };
  }, [markers]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "jan-setu-google-map",
    googleMapsApiKey: apiKey,
  });

  const fitVisibleMarkers = useCallback(
    (map: google.maps.Map) => {
      if (!markers.length) {
        map.setCenter(center);
        map.setZoom(12);
        return;
      }

      const bounds = new google.maps.LatLngBounds();
      markers.forEach((marker) => bounds.extend({ lat: marker.lat, lng: marker.lng }));
      map.fitBounds(bounds, 64);

      if (markers.length === 1) {
        map.setZoom(14);
      }
    },
    [center, markers]
  );

  const showFallback = !apiKey || loadError;

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      {showFallback ? (
        <div className="flex h-full items-center justify-center bg-slate-950 px-6 text-center text-white">
          <div>
            <MapPin className="mx-auto mb-3 h-8 w-8 text-[#00D4AA]" />
            <p className="text-sm font-semibold">Map is waiting for configuration</p>
            <p className="mt-1 text-xs text-white/65">Add a valid Google Maps browser key to show live city data.</p>
          </div>
        </div>
      ) : isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          options={mapOptions}
          onLoad={fitVisibleMarkers}
          onClick={() => setSelectedMarker(null)}
        >
          {markers.map((marker) => {
            const color = getMarkerColor(marker);
            return (
              <MarkerF
                key={marker.id}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={createMarkerIcon(color, marker.type === "prediction" ? 0.85 : 1)}
                title={`${marker.category} - ${marker.status}`}
                onClick={() => setSelectedMarker(marker)}
              />
            );
          })}

          {selectedMarker && (
            <InfoWindowF
              position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="min-w-48 pr-2 text-sm text-slate-700">
                <div className="font-semibold text-[#0A2540]">{selectedMarker.category}</div>
                <div className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                  <span className="text-slate-500">ID</span>
                  <span className="font-mono">{selectedMarker.id}</span>
                  <span className="text-slate-500">Severity</span>
                  <span className="font-semibold" style={{ color: getMarkerColor(selectedMarker) }}>
                    {selectedMarker.type === "prediction" ? "Predicted" : selectedMarker.severity}
                  </span>
                  <span className="text-slate-500">Status</span>
                  <span className="font-semibold">{selectedMarker.status}</span>
                </div>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      ) : (
        <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-500">
          Loading map...
        </div>
      )}

      <button
        onClick={() => setShowLegend((value) => !value)}
        className="absolute right-4 top-16 rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        aria-label="Toggle map legend"
      >
        <Layers className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-center gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setMapFilter(filter)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium shadow-sm transition-colors ${
              mapFilter === filter
                ? "bg-[#00D4AA] text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showLegend && (
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="absolute left-4 top-4 rounded-xl border border-slate-200 bg-white/95 p-4 text-slate-700 shadow-sm backdrop-blur"
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Map Legend</span>
              <button onClick={() => setShowLegend(false)} className="text-slate-400 hover:text-slate-700" aria-label="Close legend">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-600" /> Critical</div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> High</div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Medium</div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-green-600" /> Resolved</div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#635BFF]" /> Predicted</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-xs font-semibold text-[#0A2540] shadow-sm backdrop-blur">
        <Navigation className="h-3.5 w-3.5 text-[#00D4AA]" />
        Mumbai Civic Map
      </div>
    </div>
  );
}
