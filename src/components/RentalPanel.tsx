// src/components/RentalPanel.tsx
import React, { useEffect, useState } from "react";
import { useBooking } from "../context/BookingContext";
import { supabase } from "../lib/supabase";

export const RentalPanel: React.FC = () => {
  const { pickup, dropoff, setPickup, setDropoff, swap } = useBooking();

  const [locations, setLocations] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  // load locations from Supabase
  useEffect(() => {
    const loadLocations = async () => {
      setLoadingLocations(true);

      const { data, error } = await supabase
        .from("locations")
        .select("locations")
        .limit(1)
        .single();

      if (!error && data?.locations && Array.isArray(data.locations)) {
        setLocations(data.locations);
      } else {
        console.error("Failed to load locations", error);
      }

      setLoadingLocations(false);
    };

    loadLocations();
  }, []);

  return (
    <section className="rental-panel">
      <div className="rental-panel__grid container">
        {/* Pickup card */}
        <article className="rental-card">
          <header className="rental-card__header">
            <h3 className="rental-card__title">Pickup</h3>
          </header>

          <div className="rental-card__fields">
            {/* Location */}
            <div className="rental-card__field">
              <label className="rental-card__label">Location</label>
              <select
                className="rental-card__input"
                value={pickup.location}
                disabled={loadingLocations}
                onChange={(e) =>
                  setPickup((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              >
                <option value="">Please select</option>
                {locations.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="rental-card__field">
              <label className="rental-card__label">Date</label>
              <input
                type="date"
                className="rental-card__input"
                value={pickup.date}
                onChange={(e) =>
                  setPickup((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
              />
            </div>

            {/* Time */}
            <div className="rental-card__field">
              <label className="rental-card__label">Time</label>
              <input
                type="time"
                className="rental-card__input"
                value={pickup.time}
                onChange={(e) =>
                  setPickup((prev) => ({
                    ...prev,
                    time: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </article>

        {/* Swap button */}
        <div className="rental-panel__swap-wrapper">
          <button
            className="rental-panel__swap-btn"
            type="button"
            onClick={swap}
          >
            ⇅
          </button>
        </div>

        {/* Drop-off card */}
        <article className="rental-card">
          <header className="rental-card__header">
            <h3 className="rental-card__title">Drop-Off</h3>
          </header>

          <div className="rental-card__fields">
            {/* Location */}
            <div className="rental-card__field">
              <label className="rental-card__label">Location</label>
              <select
                className="rental-card__input"
                value={dropoff.location}
                disabled={loadingLocations}
                onChange={(e) =>
                  setDropoff((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              >
                <option value="">Please select</option>
                {locations.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="rental-card__field">
              <label className="rental-card__label">Date</label>
              <input
                type="date"
                className="rental-card__input"
                value={dropoff.date}
                onChange={(e) =>
                  setDropoff((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
              />
            </div>

            {/* Time */}
            <div className="rental-card__field">
              <label className="rental-card__label">Time</label>
              <input
                type="time"
                className="rental-card__input"
                value={dropoff.time}
                onChange={(e) =>
                  setDropoff((prev) => ({
                    ...prev,
                    time: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
