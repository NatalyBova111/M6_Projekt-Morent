// src/components/RentalPanel.tsx
import React from "react";
import { useBooking } from "../context/BookingContext";

export const RentalPanel: React.FC = () => {
  const { pickup, dropoff, setPickup, setDropoff, swap } = useBooking();

  return (
    <section className="rental-panel">
      <div className="rental-panel__grid container">
        {/* Pickup card */}
        <article className="rental-card">
          <header className="rental-card__header">
            <h3 className="rental-card__title">Pickup</h3>
            <span className="rental-card__step">Step 1 of 4</span>
          </header>

          <div className="rental-card__fields">
            {/* Location */}
            <div className="rental-card__field">
              <label className="rental-card__label">Location</label>
              <select
                className="rental-card__input"
                value={pickup.location}
                onChange={(e) =>
                  setPickup((prev) => ({ ...prev, location: e.target.value }))
                }
              >
                <option value="">Please select</option>
                <option value="Bremen">Bremen</option>
                <option value="Hamburg">Hamburg</option>
                <option value="Berlin">Berlin</option>
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
                  setPickup((prev) => ({ ...prev, date: e.target.value }))
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
                  setPickup((prev) => ({ ...prev, time: e.target.value }))
                }
              />
            </div>
          </div>
        </article>

        {/* Middle swap button */}
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
            <span className="rental-card__step">Step 2 of 4</span>
          </header>

          <div className="rental-card__fields">
            {/* Location */}
            <div className="rental-card__field">
              <label className="rental-card__label">Location</label>
              <select
                className="rental-card__input"
                value={dropoff.location}
                onChange={(e) =>
                  setDropoff((prev) => ({ ...prev, location: e.target.value }))
                }
              >
                <option value="">Please select</option>
                <option value="Bremen">Bremen</option>
                <option value="Hamburg">Hamburg</option>
                <option value="Berlin">Berlin</option>
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
                  setDropoff((prev) => ({ ...prev, date: e.target.value }))
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
                  setDropoff((prev) => ({ ...prev, time: e.target.value }))
                }
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
