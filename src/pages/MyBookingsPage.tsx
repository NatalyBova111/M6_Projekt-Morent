import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/useAuth";

type VehicleShort = {
  id: string;
  brand: string;
  model: string;
  vehicletype: string | null;
  carimg: string | null;
  priceperday: number | null;
};

type BookingRow = {
  id: string;
  created_at: string;
  pickup_location: string;
  pickup_date: string;
  pickup_time: string;
  dropoff_location: string;
  dropoff_date: string;
  dropoff_time: string;
  total_days: number;
  total_price: number;
  // Supabase может вернуть объект или массив — обработаем оба варианта
  vehicles: VehicleShort | VehicleShort[] | null;
};

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();

  const [items, setItems] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          id,
          created_at,
          pickup_location,
          pickup_date,
          pickup_time,
          dropoff_location,
          dropoff_date,
          dropoff_time,
          total_days,
          total_price,
          vehicles (
            id,
            brand,
            model,
            vehicletype,
            carimg,
            priceperday
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        setItems([]);
      } else {
        setItems((data ?? []) as unknown as BookingRow[]);
      }

      setLoading(false);
    };

    load();
  }, [user]);

  const normalizedItems = useMemo(() => {
    return items.map((b) => {
      const car =
        Array.isArray(b.vehicles) ? b.vehicles[0] ?? null : b.vehicles ?? null;

      return { booking: b, car };
    });
  }, [items]);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="error">Failed to load bookings: {error}</p>;

  return (
    <section className="my-bookings">
      <div className="my-bookings__container">
        <h1 className="my-bookings__title">My Bookings</h1>

        {normalizedItems.length === 0 ? (
          <p className="my-bookings__empty">No bookings yet.</p>
        ) : (
          <div className="my-bookings__grid">
            {normalizedItems.map(({ booking: b, car }) => (
              <article key={b.id} className="my-bookings__card">
                <div className="my-bookings__top">
                  {car?.carimg ? (
                    <img
                      className="my-bookings__img"
                      src={car.carimg}
                      alt={`${car.brand} ${car.model}`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="my-bookings__img my-bookings__img--placeholder" />
                  )}

                  <div className="my-bookings__car-info">
                    <div className="my-bookings__car-name">
                      {car ? `${car.brand} ${car.model}` : "Car"}
                    </div>
                    <div className="my-bookings__car-type">
                      {car?.vehicletype ?? ""}
                    </div>
                  </div>

                  <div className="my-bookings__price">
                    ${Number(b.total_price ?? 0).toFixed(0)}
                  </div>
                </div>

                <div className="my-bookings__details">
                  <div className="my-bookings__row">
                    <span className="my-bookings__label">Pick-up</span>
                    <span className="my-bookings__value">
                      {b.pickup_location} • {b.pickup_date} • {b.pickup_time}
                    </span>
                  </div>

                  <div className="my-bookings__row">
                    <span className="my-bookings__label">Drop-off</span>
                    <span className="my-bookings__value">
                      {b.dropoff_location} • {b.dropoff_date} • {b.dropoff_time}
                    </span>
                  </div>

                  <div className="my-bookings__row">
                    <span className="my-bookings__label">Days</span>
                    <span className="my-bookings__value">{b.total_days}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyBookingsPage;
