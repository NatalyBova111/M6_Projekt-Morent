import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Vehicle } from "../types/vehicle";

const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

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

  if (loading) {
    return <p>Loading car...</p>;
  }

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
        {/* Left main card */}
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
            <div className="detail__spec-item">
              <span className="detail__spec-label">Horsepower</span>
              <span className="detail__spec-value">{vehicle.horstpower}</span>
            </div>
            <div className="detail__spec-item">
              <span className="detail__spec-label">Consumption</span>
              <span className="detail__spec-value">
                {vehicle.consumption}
              </span>
            </div>
          </div>
        </article>

        {/* Right side card (booking summary) */}
        <aside className="detail__side-card">
          <h2 className="detail__side-title">Rental Summary</h2>
          <p className="detail__side-text">
            Prices may change depending on the length of the rental and the
            price of your rental car.
          </p>

          <div className="detail__side-car">
            <div className="detail__side-car-info">
              <div className="detail__side-car-name">
                {vehicle.brand} {vehicle.model}
              </div>
              <div className="detail__side-car-type">
                {vehicle.vehicletype}
              </div>
            </div>
            <div className="detail__side-car-price">
              ${vehicle.priceperday}
              <span>/ day</span>
            </div>
          </div>

          <div className="detail__side-row">
            <span className="detail__side-label">Locations</span>
            <span className="detail__side-value">
              {Array.isArray(vehicle.locations)
                ? vehicle.locations.join(", ")
                : vehicle.locations}
            </span>
          </div>

          <button
            className="detail__side-button"
            type="button"
            onClick={() => navigate(`/checkout/${vehicle.id}`)}
          >
            Rent Now
          </button>
        </aside>
      </div>
    </section>
  );
};

export default CarDetailPage;
