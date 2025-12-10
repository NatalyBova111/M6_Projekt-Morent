// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Vehicle } from "../types/vehicle";
import { CarCard } from "../components/CarCard";

type HomePageProps = {
  searchTerm: string;
};

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
  );
};

export default HomePage;

