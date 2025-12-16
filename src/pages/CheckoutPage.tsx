// src/pages/CheckoutPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Vehicle } from "../types/vehicle";
import { useBooking } from "../context/BookingContext";
import { useAuth } from "../context/useAuth";

function daysBetweenInclusive(start: string, end: string) {
  // start/end: YYYY-MM-DD
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const diff = e.getTime() - s.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return Math.max(1, days); // минимум 1 день
}

const CheckoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { pickup, dropoff } = useBooking();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loadingCar, setLoadingCar] = useState(true);
  const [errorCar, setErrorCar] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) {
        setLoadingCar(false);
        setErrorCar("No car id in URL");
        return;
      }

      setLoadingCar(true);
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setErrorCar(error.message);
        setVehicle(null);
      } else {
        setVehicle(data as Vehicle);
        setErrorCar(null);
      }

      setLoadingCar(false);
    };

    fetchVehicle();
  }, [id]);

  const bookingReady = useMemo(() => {
    return (
      !!user &&
      !!id &&
      !!pickup.location &&
      !!pickup.date &&
      !!pickup.time &&
      !!dropoff.location &&
      !!dropoff.date &&
      !!dropoff.time
    );
  }, [user, id, pickup, dropoff]);

  const totalDays = useMemo(() => {
    if (!pickup.date || !dropoff.date) return 1;
    return daysBetweenInclusive(pickup.date, dropoff.date);
  }, [pickup.date, dropoff.date]);

  const totalPrice = useMemo(() => {
    const pricePerDay = Number(vehicle?.priceperday ?? 0);
    return pricePerDay * totalDays;
  }, [vehicle?.priceperday, totalDays]);

  const handleConfirm = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!user) {
      setSubmitError("You must be logged in to book a car.");
      return;
    }
    if (!vehicle || !id) {
      setSubmitError("Car not loaded.");
      return;
    }
    if (!bookingReady) {
      setSubmitError("Please fill pickup and drop-off details first.");
      return;
    }

    // простая проверка дат: dropoff >= pickup
    if (dropoff.date < pickup.date) {
      setSubmitError("Drop-off date cannot be earlier than pickup date.");
      return;
    }

    setSubmitting(true);

    const payload = {
      user_id: user.id,
      vehicle_id: id,
      pickup_location: pickup.location,
      pickup_date: pickup.date,
      pickup_time: pickup.time,
      dropoff_location: dropoff.location,
      dropoff_date: dropoff.date,
      dropoff_time: dropoff.time,
      total_days: totalDays,
      total_price: totalPrice,
    };

    const { error } = await supabase.from("bookings").insert(payload);

    setSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    setSubmitSuccess("Booking created successfully!");
    // дальше можно сделать страницу /bookings, а пока — на главную
    setTimeout(() => navigate("/", { replace: true }), 700);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-page__layout">
        {/* LEFT */}
        <section className="checkout-column">
          <article className="checkout-card">
            <header className="checkout-card__header">
              <div>
                <h2 className="checkout-card__title">Rental Info</h2>
                <p className="checkout-card__subtitle">
                  These values are taken from Pickup/Drop-Off panel
                </p>
              </div>
              <span className="checkout-card__step">Step 2 of 4</span>
            </header>

            <div className="checkout-card__subsection">
              <h3 className="checkout-card__subheading">Pick-Up</h3>
              <div className="checkout-card__grid">
                <div className="checkout-field">
                  <label className="checkout-field__label">Location</label>
                  <input
                    className="checkout-field__input"
                    value={pickup.location || ""}
                    readOnly
                  />
                </div>
                <div className="checkout-field">
                  <label className="checkout-field__label">Date</label>
                  <input
                    className="checkout-field__input"
                    value={pickup.date || ""}
                    readOnly
                  />
                </div>
                <div className="checkout-field">
                  <label className="checkout-field__label">Time</label>
                  <input
                    className="checkout-field__input"
                    value={pickup.time || ""}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="checkout-card__subsection">
              <h3 className="checkout-card__subheading">Drop-Off</h3>
              <div className="checkout-card__grid">
                <div className="checkout-field">
                  <label className="checkout-field__label">Location</label>
                  <input
                    className="checkout-field__input"
                    value={dropoff.location || ""}
                    readOnly
                  />
                </div>
                <div className="checkout-field">
                  <label className="checkout-field__label">Date</label>
                  <input
                    className="checkout-field__input"
                    value={dropoff.date || ""}
                    readOnly
                  />
                </div>
                <div className="checkout-field">
                  <label className="checkout-field__label">Time</label>
                  <input
                    className="checkout-field__input"
                    value={dropoff.time || ""}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {submitError && <p className="error">{submitError}</p>}
            {submitSuccess && <p style={{ color: "#166534" }}>{submitSuccess}</p>}

            <button
              className="car-card__button"
              type="button"
              onClick={handleConfirm}
              disabled={!bookingReady || submitting}
              style={{ marginTop: 12 }}
            >
              {submitting ? "Creating booking..." : "Confirm booking"}
            </button>
          </article>
        </section>

        {/* RIGHT: Summary */}
        <aside className="checkout-summary">
          <article className="checkout-summary__card">
            <h2 className="checkout-summary__title">Rental Summary</h2>

            {loadingCar && <p>Loading car...</p>}
            {errorCar && <p className="error">Failed to load car: {errorCar}</p>}

            {!loadingCar && !errorCar && vehicle && (
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
                    <p style={{ margin: 0, color: "#6b7280" }}>
                      {totalDays} day(s)
                    </p>
                  </div>
                </div>

                <div className="checkout-summary__price-row">
                  <span className="checkout-summary__price-label">Total</span>
                  <span className="checkout-summary__price-value">
                    ${Number(totalPrice).toFixed(0)}.00
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
