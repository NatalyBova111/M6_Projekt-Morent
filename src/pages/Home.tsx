// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Vehicle } from "../types/vehicle";
import { CarCard } from "../components/CarCard";
import { RentalPanel } from "../components/RentalPanel";

type HomePageProps = {
  searchTerm: string;
};

// image URLs from public/hero
const HERO_CAR_1 = `${import.meta.env.BASE_URL}hero/hero-car-1.png`;
const HERO_CAR_2 = `${import.meta.env.BASE_URL}hero/hero-car-2.png`;

const HomePage: React.FC<HomePageProps> = ({ searchTerm }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("priceperday", { ascending: true });

      if (error) {
        setError(error.message);
        setVehicles([]);
      } else {
        setVehicles((data || []) as Vehicle[]);
      }

      setLoading(false);
    };

    fetchVehicles();
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredVehicles = normalizedSearch
    ? vehicles.filter((v) => {
        const brand = v.brand?.toLowerCase() ?? "";
        const model = v.model?.toLowerCase() ?? "";
        const vehicleType = v.vehicletype?.toLowerCase() ?? "";

        return (
          brand.includes(normalizedSearch) ||
          model.includes(normalizedSearch) ||
          vehicleType.includes(normalizedSearch)
        );
      })
    : vehicles;

  if (loading) {
    return (
      <div className="home-cars">
        <p>Loading cars...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-cars">
        <p className="error">Failed to load cars: {error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero section */}
      <section className="hero">
        <div className="hero__grid">
          {/* Left card */}
          <article className="hero-card hero-card--primary">
            <div className="hero-card__content">
              <h1 className="hero-card__title">
                The Best Platform for Car Rental
              </h1>
              <p className="hero-card__subtitle">
                Ease of doing a car rental safely and reliably. Of course at a
                low price.
              </p>
              <button className="hero-card__button">Rental Car</button>
            </div>
            <img
              src={HERO_CAR_2}
              alt="Sports car"
              className="hero-card__image"
            />
          </article>

          {/* Right card */}
          <article className="hero-card hero-card--secondary">
            <div className="hero-card__content">
              <h2 className="hero-card__title">
                Easy way to rent a car at a low price
              </h2>
              <p className="hero-card__subtitle">
                Providing cheap car rental services and safe and comfortable
                facilities.
              </p>
              <button className="hero-card__button hero-card__button--outline">
                Rental Car
              </button>
            </div>
            <img
              src={HERO_CAR_1}
              alt="Silver sports car"
              className="hero-card__image hero-card__image--right"
            />
          </article>
        </div>
      </section>

      {/* Rental search panel (Pickup / Drop-Off) */}
      <RentalPanel />

      {/* Cars list */}
      <section className="home-cars">
        <div className="home-cars__header">
          <div>
            <h1>Available Cars</h1>
            <p>{filteredVehicles.length} car(s) found</p>
          </div>
        </div>

        <div className="home-cars__grid">
          {filteredVehicles.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}

          {filteredVehicles.length === 0 && (
            <div className="home-cars__empty">
              No cars found for “{searchTerm}”.
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;
