import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Vehicle } from "../types/vehicle";
import { CarCard } from "../components/CarCard";
import { FilterSidebar } from "../components/FilterSidebar";
import { RentalPanel } from "../components/RentalPanel";

type FilterValues = {
  types: string[];
  capacity: string[];
  maxPrice: number;
};

const FilterPage: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // FILTER STATE
  const [filters, setFilters] = useState<FilterValues>({
    types: [],
    capacity: [],
    maxPrice: 100,
  });

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

  // -------------------------------------
  // SEARCH FILTER
  // -------------------------------------
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filtered = vehicles.filter((v) => {
    const brand = v.brand?.toLowerCase() ?? "";
    const model = v.model?.toLowerCase() ?? "";
    const type = v.vehicletype?.toLowerCase() ?? "";

    // search filter
    if (
      normalizedSearch &&
      !brand.includes(normalizedSearch) &&
      !model.includes(normalizedSearch) &&
      !type.includes(normalizedSearch)
    ) {
      return false;
    }

    // filter type
    if (filters.types.length > 0 && !filters.types.includes(v.vehicletype)) {
      return false;
    }

    // filter capacity
    if (
      filters.capacity.length > 0 &&
      !filters.capacity.includes(v.seats?.toString() ?? "")
    ) {
      return false;
    }

    // filter price
    if (v.priceperday > filters.maxPrice) {
      return false;
    }

    return true;
  });

  return (
    <div className="filter-page">
      <div className="container">
        <div className="filter-page__layout">

          {/* LEFT SIDEBAR */}
          <FilterSidebar filters={filters} setFilters={setFilters} />

          {/* CONTENT AREA */}
          <section className="filter-page__content">
            <RentalPanel />

            <section className="home-cars home-cars--filter">
              <div className="home-cars__header">
                <h1>Available Cars</h1>
                <p>{filtered.length} car(s) found</p>
              </div>

              {loading && <p>Loading cars...</p>}
              {error && <p className="error">Failed to load cars: {error}</p>}

              {!loading && (
                <div className="home-cars__grid home-cars__grid--3">
                  {filtered.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}

                  {filtered.length === 0 && (
                    <div className="home-cars__empty">
                      No cars found.
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
