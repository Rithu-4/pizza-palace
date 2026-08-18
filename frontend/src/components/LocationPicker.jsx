import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

// --------------------------------------------------
// Fix Leaflet marker icons for Vite
// --------------------------------------------------

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// --------------------------------------------------
// Move map when location changes
// --------------------------------------------------

function MapCenter({ position }) {
  const map = useMap();

  if (position) {
    map.flyTo(position, 16, {
      duration: 1.2,
    });
  }

  return null;
}

// --------------------------------------------------
// Detect map click
// --------------------------------------------------

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

// --------------------------------------------------
// Location Picker
// --------------------------------------------------

function LocationPicker({ position, setPosition }) {
  const [locating, setLocating] = useState(false);

  // Chennai default location
  const defaultPosition = [13.0827, 80.2707];

  // ------------------------------------------------
  // Get current location
  // ------------------------------------------------

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by your browser."
      );

      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const newPosition = [
          location.coords.latitude,
          location.coords.longitude,
        ];

        setPosition(newPosition);

        setLocating(false);
      },

      (error) => {
        console.error(
          "Location error:",
          error
        );

        alert(
          "Unable to get your location. Please allow location access."
        );

        setLocating(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="space-y-4">

      {/* =================================================
          MAP CARD
      ================================================= */}

      <div className="overflow-hidden rounded-3xl border border-[#e8dfd5] bg-white shadow-sm">

        {/* MAP HEADER */}

        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">

              <span className="text-lg">
                📍
              </span>

            </div>

            <div>

              <h3 className="text-sm font-black text-gray-900">
                Choose Delivery Location
              </h3>

              <p className="mt-0.5 text-[11px] text-gray-400">
                Click on the map to select your location
              </p>

            </div>

          </div>

          {position && (
            <div className="hidden rounded-full bg-green-50 px-3 py-1.5 text-[10px] font-bold text-green-600 sm:block">
              ✓ Location Selected
            </div>
          )}

        </div>

        {/* MAP */}

        <div className="relative">

          <MapContainer
            center={position || defaultPosition}
            zoom={position ? 16 : 12}
            scrollWheelZoom={true}
            className="h-[320px] w-full"
          >

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationMarker
              position={position}
              setPosition={setPosition}
            />

            <MapCenter
              position={position}
            />

          </MapContainer>

          {/* MAP INSTRUCTION */}

          <div className="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2">

            <div className="whitespace-nowrap rounded-full bg-[#151515]/90 px-4 py-2 text-[11px] font-semibold text-white shadow-lg backdrop-blur">

              {position
                ? "✓ Delivery location selected"
                : "📍 Tap the map to choose your location"}

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          CURRENT LOCATION BUTTON
      ================================================= */}

      <button
        type="button"
        onClick={getCurrentLocation}
        disabled={locating}
        className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-orange-500 bg-orange-50 px-5 py-3.5 text-sm font-black text-orange-600 transition duration-300 hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >

        <span className="text-lg transition group-hover:scale-110">
          📍
        </span>

        {locating
          ? "Finding your location..."
          : "Use My Current Location"}

      </button>

      {/* =================================================
          SELECTED LOCATION
      ================================================= */}

      {position && (
        <div className="rounded-2xl border border-green-100 bg-green-50 p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">

              ✓

            </div>

            <div className="min-w-0">

              <p className="text-xs font-black uppercase tracking-wide text-green-700">
                Delivery Location Selected
              </p>

              <p className="mt-1 truncate text-xs font-semibold text-green-800">

                {position[0].toFixed(6)},{" "}
                {position[1].toFixed(6)}

              </p>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          HELPER TEXT
      ================================================= */}

      <div className="flex items-start gap-3 rounded-2xl bg-gray-50 px-4 py-3">

        <span className="mt-0.5">
          💡
        </span>

        <p className="text-[11px] leading-5 text-gray-500">
          For accurate delivery, select your exact
          location on the map or use your current
          location.
        </p>

      </div>

    </div>
  );
}

export default LocationPicker;