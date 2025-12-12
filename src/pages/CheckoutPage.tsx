// src/pages/CheckoutPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Vehicle } from "../types/vehicle";
import { useBooking } from "../context/BookingContext";

const CheckoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { pickup, dropoff } = useBooking();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

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

  return (
    <div className="checkout-page">
      <div className="checkout-page__layout">
        {/* LEFT COLUMN */}
        <section className="checkout-column">
          {/* Billing Info */}
          <article className="checkout-card">
            <header className="checkout-card__header">
              <div>
                <h2 className="checkout-card__title">Billing Info</h2>
                <p className="checkout-card__subtitle">
                  Please enter your billing info
                </p>
              </div>
              <span className="checkout-card__step">Step 1 of 4</span>
            </header>

            <div className="checkout-card__grid">
              <div className="checkout-field">
                <label className="checkout-field__label">Name</label>
                <input
                  className="checkout-field__input"
                  placeholder="Your name"
                />
              </div>

              <div className="checkout-field">
                <label className="checkout-field__label">Phone Number</label>
                <input
                  className="checkout-field__input"
                  placeholder="Phone number"
                />
              </div>

              <div className="checkout-field checkout-field--full">
                <label className="checkout-field__label">Address</label>
                <input
                  className="checkout-field__input"
                  placeholder="Address"
                />
              </div>

              <div className="checkout-field">
                <label className="checkout-field__label">Town / City</label>
                <input
                  className="checkout-field__input"
                  placeholder="Town or city"
                />
              </div>
            </div>
          </article>

          {/* Rental Info */}
          <article className="checkout-card">
            <header className="checkout-card__header">
              <div>
                <h2 className="checkout-card__title">Rental Info</h2>
                <p className="checkout-card__subtitle">
                  Rental data from previous step
                </p>
              </div>
              <span className="checkout-card__step">Step 2 of 4</span>
            </header>

            {/* Pick-Up */}
            <div className="checkout-card__subsection">
              <h3 className="checkout-card__subheading">Pick-Up</h3>

              <div className="checkout-card__grid">
                <div className="checkout-field">
                  <label className="checkout-field__label">Location</label>
                  <input
                    className="checkout-field__input"
                    value={pickup.location || "-"}
                    readOnly
                  />
                </div>

                <div className="checkout-field">
                  <label className="checkout-field__label">Date</label>
                  <input
                    className="checkout-field__input"
                    value={pickup.date || "-"}
                    readOnly
                  />
                </div>

                <div className="checkout-field">
                  <label className="checkout-field__label">Time</label>
                  <input
                    className="checkout-field__input"
                    value={pickup.time || "-"}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Drop-Off */}
            <div className="checkout-card__subsection">
              <h3 className="checkout-card__subheading">Drop-Off</h3>

              <div className="checkout-card__grid">
                <div className="checkout-field">
                  <label className="checkout-field__label">Location</label>
                  <input
                    className="checkout-field__input"
                    value={dropoff.location || "-"}
                    readOnly
                  />
                </div>

                <div className="checkout-field">
                  <label className="checkout-field__label">Date</label>
                  <input
                    className="checkout-field__input"
                    value={dropoff.date || "-"}
                    readOnly
                  />
                </div>

                <div className="checkout-field">
                  <label className="checkout-field__label">Time</label>
                  <input
                    className="checkout-field__input"
                    value={dropoff.time || "-"}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* RIGHT COLUMN */}
        <aside className="checkout-summary">
          <article className="checkout-summary__card">
            <h2 className="checkout-summary__title">Rental Summary</h2>
            <p className="checkout-summary__subtitle">
              Prices may change depending on the length of the rental.
            </p>

            {loading && <p>Loading car...</p>}
            {error && <p className="error">Failed to load car: {error}</p>}

            {!loading && !error && vehicle && (
              <div className="checkout-summary__car">
                <div className="checkout-summary__car-main">
                  <img
                    src={vehicle.carimg}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="checkout-summary__car-image"
                  />
                  <div>
                    <h3 className="checkout-summary__car-name">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="checkout-summary__car-type">
                      {vehicle.vehicletype}
                    </p>
                  </div>
                </div>

                <div className="checkout-summary__price-row">
                  <span className="checkout-summary__price-label">
                    Price per day
                  </span>
                  <span className="checkout-summary__price-value">
                    ${vehicle.priceperday.toFixed(0)}.00
                  </span>
                </div>
              </div>
            )}
          </article>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
