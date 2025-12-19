import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Vehicle } from "../types/vehicle";
import { useBooking } from "../context/BookingContext";
import { useAuth } from "../context/useAuth";

function daysBetweenInclusive(start: string, end: string) {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const diff = e.getTime() - s.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
}

type PaymentMethod = "card" | "paypal" | "bitcoin";

const CheckoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const location = useLocation();
  const availableLocations: string[] =
    (location.state as { availableLocations?: string[] } | null)?.availableLocations ??
    [];

  const { user } = useAuth();
  const { pickup, dropoff, setPickup, setDropoff } = useBooking();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loadingCar, setLoadingCar] = useState(true);
  const [errorCar, setErrorCar] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Step 1 — Billing
  const [billingName, setBillingName] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");

  // Step 3 — Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState(""); // MM/YY
  const [cardCvc, setCardCvc] = useState("");

    const [paypalEmail, setPaypalEmail] = useState("");
  const [btcNetwork, setBtcNetwork] = useState<"BTC" | "Lightning">("BTC");
  const [btcWallet, setBtcWallet] = useState("");


  // Step 4 — Confirmation
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

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

  const rentalReady = useMemo(() => {
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

  const billingReady = useMemo(() => {
    return (
      billingName.trim().length > 1 &&
      billingPhone.trim().length > 4 &&
      billingAddress.trim().length > 3 &&
      billingCity.trim().length > 1
    );
  }, [billingName, billingPhone, billingAddress, billingCity]);

  const paymentReady = useMemo(() => {
    if (paymentMethod === "card") {
      const digits = cardNumber.replace(/\s/g, "");
      const expOk = /^\d{2}\/\d{2}$/.test(cardExp);
      const cvcOk = /^\d{3,4}$/.test(cardCvc);
      return digits.length >= 12 && expOk && cvcOk;
    }

    if (paymentMethod === "paypal") {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail.trim());
      return emailOk;
    }

    // bitcoin
    return btcWallet.trim().length >= 8;
  }, [paymentMethod, cardNumber, cardExp, cardCvc, paypalEmail, btcWallet]);



  const canConfirm = useMemo(() => {
    return rentalReady && billingReady && paymentReady && agreeTerms && !submitting;
  }, [rentalReady, billingReady, paymentReady, agreeTerms, submitting]);

  const totalDays = useMemo(() => {
    if (!pickup.date || !dropoff.date) return 1;
    return daysBetweenInclusive(pickup.date, dropoff.date);
  }, [pickup.date, dropoff.date]);

  const totalPrice = useMemo(() => {
    const pricePerDay = Number(vehicle?.priceperday ?? 0);
    return pricePerDay * totalDays;
  }, [vehicle?.priceperday, totalDays]);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 19);
    const parts = digits.match(/.{1,4}/g) ?? [];
    return parts.join(" ");
  };

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
    if (!rentalReady) {
      setSubmitError("Please fill pickup and drop-off details first.");
      return;
    }
    if (dropoff.date < pickup.date) {
      setSubmitError("Drop-off date cannot be earlier than pickup date.");
      return;
    }
    if (!billingReady) {
      setSubmitError("Please fill billing info.");
      return;
    }
    if (!paymentReady) {
      setSubmitError("Please fill payment details.");
      return;
    }
    if (!agreeTerms) {
      setSubmitError("Please accept Terms & Conditions.");
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


// Notify header that bookings list changed
window.dispatchEvent(new Event("morent:bookings-updated"));


    setSubmitSuccess("Booking created successfully!");

    setTimeout(() => navigate("/my-bookings", { replace: true }), 700);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-page__layout">
        {/* LEFT */}
        <section className="checkout-column">
          {/* Step 1 — Billing Info */}
          <article className="checkout-card">
            <header className="checkout-card__header">
              <div>
                <h2 className="checkout-card__title">Billing Info</h2>
                <p className="checkout-card__subtitle">Please enter your billing info</p>
              </div>
              <span className="checkout-card__step">Step 1 of 4</span>
            </header>

            <div className="checkout-card__grid">
              <div className="checkout-field">
                <label className="checkout-field__label">Name</label>
                <input
                  className="checkout-field__input"
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div className="checkout-field">
                <label className="checkout-field__label">Phone Number</label>
                <input
                  className="checkout-field__input"
                  value={billingPhone}
                  onChange={(e) => setBillingPhone(e.target.value)}
                  placeholder="Phone number"
                />
              </div>

              <div className="checkout-field checkout-field--full">
                <label className="checkout-field__label">Address</label>
                <input
                  className="checkout-field__input"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  placeholder="Address"
                />
              </div>

              <div className="checkout-field">
                <label className="checkout-field__label">Town / City</label>
                <input
                  className="checkout-field__input"
                  value={billingCity}
                  onChange={(e) => setBillingCity(e.target.value)}
                  placeholder="Town or city"
                />
              </div>
            </div>
          </article>

          {/* Step 2 — Rental Info */}
          <article className="checkout-card">
            <header className="checkout-card__header">
              <div>
                <h2 className="checkout-card__title">Rental Info</h2>
                <p className="checkout-card__subtitle">
                  Select pick-up & drop-off from available locations
                </p>
              </div>
              <span className="checkout-card__step">Step 2 of 4</span>
            </header>

            {availableLocations.length === 0 ? (
              <div style={{ marginTop: 8 }}>
                <p className="error" style={{ marginBottom: 10 }}>
                  No available locations were passed to this page.
                </p>
                <button
                  type="button"
                  className="detail__back"
                  onClick={() => navigate("/", { replace: true })}
                >
                  Go to Home
                </button>
              </div>
            ) : (
              <>
                <div className="checkout-card__subsection">
                  <h3 className="checkout-card__subheading">Pick-Up</h3>
                  <div className="checkout-card__grid">
                    <div className="checkout-field">
                      <label className="checkout-field__label">Location</label>
                      <select
                        className="checkout-field__input"
                        value={pickup.location || ""}
                        onChange={(e) =>
                          setPickup((prev) => ({ ...prev, location: e.target.value }))
                        }
                      >
                        <option value="">Select</option>
                        {availableLocations.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
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
                      <select
                        className="checkout-field__input"
                        value={dropoff.location || ""}
                        onChange={(e) =>
                          setDropoff((prev) => ({ ...prev, location: e.target.value }))
                        }
                      >
                        <option value="">Select</option>
                        {availableLocations.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
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
              </>
            )}
          </article>

          {/* Step 3 — Payment Method */}
          <article className="checkout-card">
            <header className="checkout-card__header">
              <div>
                <h2 className="checkout-card__title">Payment Method</h2>
                <p className="checkout-card__subtitle">Please enter your payment method</p>
              </div>
              <span className="checkout-card__step">Step 3 of 4</span>
            </header>

            <div className="pm__options">
              {/* CARD */}
              <label className={`pm__option ${paymentMethod === "card" ? "is-active" : ""}`}>
                <div className="pm__left">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <span className="pm__label">Credit Card</span>
                </div>

<div className="pm__logos" aria-hidden="true">
  <img className="pm__img" src="/Container.png" alt="Visa & Mastercard" />
</div>

              </label>

              {paymentMethod === "card" && (
                <div className="pm__fields">
                  <div className="checkout-card__grid">
                    <div className="checkout-field checkout-field--full">
                      <label className="checkout-field__label">Card Number</label>
                      <input
                        className="checkout-field__input"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        inputMode="numeric"
                      />
                    </div>

                    <div className="checkout-field">
                      <label className="checkout-field__label">Expiration (MM/YY)</label>
                      <input
                        className="checkout-field__input"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value.slice(0, 5))}
                        placeholder="MM/YY"
                      />
                    </div>

                    <div className="checkout-field">
                      <label className="checkout-field__label">CVC</label>
                      <input
                        className="checkout-field__input"
                        value={cardCvc}
                        onChange={(e) =>
                          setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        placeholder="123"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PAYPAL */}
              <label className={`pm__option ${paymentMethod === "paypal" ? "is-active" : ""}`}>
                <div className="pm__left">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                  />
                  <span className="pm__label">PayPal</span>
                </div>

<div className="pm__logos" aria-hidden="true">
  <img className="pm__img" src="/PayPal.png" alt="PayPal" />
</div>

              </label>

              {paymentMethod === "paypal" && (
                <div className="pm__fields">
                  <div className="checkout-field checkout-field--full">
                    <label className="checkout-field__label">PayPal Email</label>
                    <input
                      className="checkout-field__input"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      placeholder="name@example.com"
                      inputMode="email"
                      autoComplete="email"
                    />
                  </div>

                  <p className="pm__hint">
                    We’ll redirect you to PayPal after confirming the booking.
                  </p>
                </div>
              )}

              {/* BITCOIN */}
              <label className={`pm__option ${paymentMethod === "bitcoin" ? "is-active" : ""}`}>
                <div className="pm__left">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "bitcoin"}
                    onChange={() => setPaymentMethod("bitcoin")}
                  />
                  <span className="pm__label">Bitcoin</span>
                </div>

 <div className="pm__logos" aria-hidden="true">
  <img className="pm__img" src="/Bitcoin.png" alt="Bitcoin" />
</div>

              </label>

              {paymentMethod === "bitcoin" && (
                <div className="pm__fields">
                  <div className="checkout-card__grid">
                    <div className="checkout-field">
                      <label className="checkout-field__label">Network</label>
                      <select
                        className="checkout-field__input"
                        value={btcNetwork}
                        onChange={(e) => setBtcNetwork(e.target.value as "BTC" | "Lightning")}
                      >
                        <option value="BTC">Bitcoin (On-chain)</option>
                        <option value="Lightning">Lightning</option>
                      </select>
                    </div>

                    <div className="checkout-field checkout-field--full">
                      <label className="checkout-field__label">
                        {btcNetwork === "Lightning" ? "Lightning Invoice" : "Wallet Address"}
                      </label>
                      <input
                        className="checkout-field__input"
                        value={btcWallet}
                        onChange={(e) => setBtcWallet(e.target.value)}
                        placeholder={btcNetwork === "Lightning" ? "lnbc1..." : "bc1q..."}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <p className="pm__hint">
                    After confirmation we’ll show you the payment details/invoice.
                  </p>
                </div>
              )}
            </div>
          </article>







          {/* Step 4 — Confirmation */}
          <article className="checkout-card">
            <header className="checkout-card__header">
              <div>
                <h2 className="checkout-card__title">Confirmation</h2>
                <p className="checkout-card__subtitle">
                  Just a few clicks and your rental is ready!
                </p>
              </div>
              <span className="checkout-card__step">Step 4 of 4</span>
            </header>

            <div style={{ display: "grid", gap: 12 }}>
              <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={agreeMarketing}
                  onChange={(e) => setAgreeMarketing(e.target.checked)}
                />
                I agree with sending marketing and newsletter emails. No spam, promised!
              </label>

              <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                I agree with our terms and conditions and privacy policy.
              </label>

              {submitError && <p className="error">{submitError}</p>}
              {submitSuccess && <p style={{ color: "#166534" }}>{submitSuccess}</p>}

              {!canConfirm && (
                <div style={{ fontSize: 14, color: "#6b7280" }}>
                  <div>To confirm booking please check:</div>
                  <ul style={{ margin: "6px 0 0 18px" }}>
                    {!rentalReady && <li>Pickup / Drop-off values</li>}
                    {!billingReady && <li>Billing info</li>}
                    {!paymentReady && <li>Payment details</li>}
                    {!agreeTerms && <li>Accept Terms & Conditions</li>}
                  </ul>
                </div>
              )}

              <button
                className="car-card__button"
                type="button"
                onClick={handleConfirm}
                disabled={!canConfirm}
                style={{
                  marginTop: 8,
                  opacity: canConfirm ? 1 : 0.5,
                  cursor: canConfirm ? "pointer" : "not-allowed",
                }}
              >
                {submitting ? "Creating booking..." : "Confirm booking"}
              </button>
            </div>
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
                    <p className="checkout-summary__car-type">{vehicle.vehicletype}</p>
                    <p style={{ margin: 0, color: "#6b7280" }}>{totalDays} day(s)</p>
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
