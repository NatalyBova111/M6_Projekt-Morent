// src/pages/FilterPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Vehicle } from "../types/vehicle";
import { CarCard } from "../components/CarCard";
import { FilterSidebar } from "../components/FilterSidebar";
import { RentalPanel } from "../components/RentalPanel";

type FilterPageProps = {
  searchTerm: string;
};

const FilterPage: React.FC<FilterPageProps> = ({ searchTerm }) => {
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

  return (
    <div className="filter-page">
      <div className="container">
        <div className="filter-page__layout">
          <aside className="filter-page__sidebar">
            <FilterSidebar />
          </aside>

          <section className="filter-page__content">
            <RentalPanel />

            <section className="home-cars home-cars--filter">
              <div className="home-cars__header">
                <div>
                  <h1>Available Cars</h1>
                  <p>{filteredVehicles.length} car(s) found</p>
                </div>
              </div>

              {loading && <p>Loading cars...</p>}
              {error && <p className="error">Failed to load cars: {error}</p>}

              {!loading && !error && (
                <div className="home-cars__grid home-cars__grid--3">
                  
                  {filteredVehicles.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}

                  {filteredVehicles.length === 0 && (
                    <div className="home-cars__empty">
                      No cars found for “{searchTerm}”.
                    </div>
                  )}
                </div>
              )}
            </section>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FilterPage;

