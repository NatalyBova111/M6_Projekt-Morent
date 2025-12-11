// src/components/FilterSidebar.tsx
import React from "react";

type FilterValues = {
  types: string[];
  capacity: string[];
  maxPrice: number;
};

type FilterSidebarProps = {
  filters: FilterValues;
  setFilters: React.Dispatch<React.SetStateAction<FilterValues>>;
};

const typeOptions = [
  { value: "Sport", label: "Sport", count: 10 },
  { value: "SUV", label: "SUV", count: 12 },
  { value: "MPV", label: "MPV", count: 16 },
  { value: "Sedan", label: "Sedan", count: 20 },
  { value: "Coupe", label: "Coupe", count: 14 },
  { value: "Hatchback", label: "Hatchback", count: 14 },
];

const capacityOptions = [
  { value: "2", label: "2 Person", count: 10 },
  { value: "4", label: "4 Person", count: 14 },
  { value: "6", label: "6 Person", count: 12 },
  { value: "8", label: "8 or More", count: 16 },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
}) => {
  const toggleType = (type: string) => {
    setFilters((prev) => {
      const exists = prev.types.includes(type);
      return {
        ...prev,
        types: exists
          ? prev.types.filter((t) => t !== type)
          : [...prev.types, type],
      };
    });
  };

  const toggleCapacity = (value: string) => {
    setFilters((prev) => {
      const exists = prev.capacity.includes(value);
      return {
        ...prev,
        capacity: exists
          ? prev.capacity.filter((c) => c !== value)
          : [...prev.capacity, value],
      };
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setFilters((prev) => ({
      ...prev,
      maxPrice: value,
    }));
  };

  return (
    <aside className="filter-sidebar">
      {/* TYPE */}
      <div className="filter-sidebar__group">
        <h3 className="filter-sidebar__title">Type</h3>
        <div className="filter-sidebar__options">
          {typeOptions.map((opt) => (
            <label key={opt.value} className="filter-option">
              <input
                type="checkbox"
                checked={filters.types.includes(opt.value)}
                onChange={() => toggleType(opt.value)}
              />
              <span className="filter-option__label">
                {opt.label}{" "}
                <span className="filter-option__count">({opt.count})</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* CAPACITY */}
      <div className="filter-sidebar__group">
        <h3 className="filter-sidebar__title">Capacity</h3>
        <div className="filter-sidebar__options">
          {capacityOptions.map((opt) => (
            <label key={opt.value} className="filter-option">
              <input
                type="checkbox"
                checked={filters.capacity.includes(opt.value)}
                onChange={() => toggleCapacity(opt.value)}
              />
              <span className="filter-option__label">
                {opt.label}{" "}
                <span className="filter-option__count">({opt.count})</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* PRICE */}
      <div className="filter-sidebar__group">
        <h3 className="filter-sidebar__title">Price</h3>

        <div className="filter-sidebar__price-row">
          <span className="filter-sidebar__price-label">
            Max. ${filters.maxPrice.toFixed(2)}
          </span>
        </div>

        <input
          type="range"
          min={20}
          max={200}
          value={filters.maxPrice}
          onChange={handlePriceChange}
          className="filter-sidebar__slider"
        />
      </div>
    </aside>
  );
};
