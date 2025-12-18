// src/pages/CarDetail.tsx
import { useEffect, useMemo, useState } from "react";
import type { FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Vehicle } from "../types/vehicle";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icons (so marker is visible)
type LeafletIconProto = { _getIconUrl?: unknown };
delete (L.Icon.Default.prototype as LeafletIconProto)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// city → coordinates dictionary
const CITY_COORDS: Record<string, [number, number]> = {
  Berlin: [52.52, 13.405],
  Hamburg: [53.5511, 9.9937],
  Bremen: [53.0793, 8.8017],

  Munich: [48.1351, 11.5820],
  Frankfurt: [50.1109, 8.6821],
  Dusseldorf: [51.2277, 6.7735],
};


const FALLBACK_CENTER: [number, number] = [51.1657, 10.4515]; // Germany center

const CarDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchVehicle = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
        setVehicle(null);
      } else {
        setVehicle(data as Vehicle);
        setError(null);
      }

      setLoading(false);
    };

    fetchVehicle();
  }, [id]);

  // locations 
  const locationNames = useMemo<string[]>(() => {
    return (vehicle?.locations ?? []).map((n) => n.trim()).filter(Boolean);
  }, [vehicle]);

  const markers = useMemo<{ name: string; coords: [number, number] }[]>(() => {
    return locationNames
      .map((name) => {
        const coords = CITY_COORDS[name];
        return coords ? { name, coords } : null;
      })
      .filter((m): m is { name: string; coords: [number, number] } => m !== null);
  }, [locationNames]);

  const mapCenter = useMemo<[number, number]>(() => {
    return markers[0]?.coords ?? FALLBACK_CENTER;
  }, [markers]);

  if (!id) {
    return (
      <div className="detail">
        <button className="detail__back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <p className="error">Car not found</p>
      </div>
    );
  }

  if (loading) return <p>Loading car...</p>;

  if (error || !vehicle) {
    return (
      <div className="detail">
        <button className="detail__back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <p className="error">Failed to load car: {error ?? "Unknown error"}</p>
      </div>
    );
  }

  return (
    <section className="detail">
      <button className="detail__back" onClick={() => navigate(-1)}>
        ← Back to results
      </button>

      <div className="detail__layout">
        {/* LEFT */}
        <article className="detail__main-card">
          <div className="detail__title-row">
            <div>
              <h1 className="detail__title">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="detail__subtitle">{vehicle.vehicletype}</p>
            </div>
            <div className="detail__rating-placeholder">⭐ 4.5</div>
          </div>

          <div className="detail__image-wrapper">
            <img
              src={vehicle.carimg}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="detail__image"
            />
          </div>

          <div className="detail__specs">
            <div className="detail__spec-item">
              <span className="detail__spec-label">Year</span>
              <span className="detail__spec-value">{vehicle.year}</span>
            </div>
            <div className="detail__spec-item">
              <span className="detail__spec-label">Fuel</span>
              <span className="detail__spec-value">{vehicle.fuel}</span>
            </div>
            <div className="detail__spec-item">
              <span className="detail__spec-label">Gear Type</span>
              <span className="detail__spec-value">{vehicle.geartype}</span>
            </div>
            <div className="detail__spec-item">
              <span className="detail__spec-label">Seats</span>
              <span className="detail__spec-value">{vehicle.seats}</span>
            </div>
          </div>
        </article>

        {/* RIGHT */}
        <aside className="detail__side-card">
          <h2 className="detail__side-title">Rental Summary</h2>
          <p className="detail__side-text">
            Prices may change depending on the length of the rental and the price of your rental car.
          </p>

          {/* MAP */}
          <div className="detail__side-map">
            <MapContainer
              center={mapCenter}
              zoom={markers.length > 1 ? 6 : 7}
              style={{ height: 200, width: "100%", borderRadius: 12 }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {markers.length === 0 ? (
                <Marker position={mapCenter}>
                  <Popup>No known locations for this car</Popup>
                </Marker>
              ) : (
                markers.map((m) => (
                  <Marker key={m.name} position={m.coords}>
                    <Popup>{m.name}</Popup>
                  </Marker>
                ))
              )}
            </MapContainer>
          </div>

          <div className="detail__side-car-info">
            <div className="detail__side-car-name">
              {vehicle.brand} {vehicle.model}
            </div>
            <div className="detail__side-car-type">{vehicle.vehicletype}</div>
          </div>

          <div className="detail__side-car-price">
            ${vehicle.priceperday}
            <span>/ day</span>
          </div>

          <div className="detail__side-row">
            <span className="detail__side-label">Locations</span>
            <span className="detail__side-value">
              {locationNames.length ? locationNames.join(", ") : "—"}
            </span>
          </div>

<button
  className="detail__side-button"
  type="button"
  onClick={() =>
    navigate(`/checkout/${vehicle.id}`, {
      state: { availableLocations: vehicle.locations },
    })
  }
>
  Rent Now
</button>

        </aside>
      </div>
    </section>
  );
};

export default CarDetailPage;
