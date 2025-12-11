// src/components/FilterSidebar.tsx
import React from "react";

export const FilterSidebar: React.FC = () => {
  return (
    <div className="filter-sidebar">
      {/* Type */}
      <div className="filter-sidebar__group">
        <h3 className="filter-sidebar__title">Type</h3>
        <div className="filter-sidebar__options">
          <label className="filter-option">
            <input type="checkbox" defaultChecked />
            <span className="filter-option__label">Sport</span>
            <span className="filter-option__count">(10)</span>
          </label>
          <label className="filter-option">
            <input type="checkbox" />
            <span className="filter-option__label">SUV</span>
            <span className="filter-option__count">(12)</span>
          </label>
          <label className="filter-option">
            <input type="checkbox" />
            <span className="filter-option__label">MPV</span>
            <span className="filter-option__count">(16)</span>
          </label>
          <label className="filter-option">
            <input type="checkbox" />
            <span className="filter-option__label">Sedan</span>
            <span className="filter-option__count">(20)</span>
          </label>
          <label className="filter-option">
            <input type="checkbox" />
            <span className="filter-option__label">Coupe</span>
            <span className="filter-option__count">(14)</span>
          </label>
          <label className="filter-option">
            <input type="checkbox" />
            <span className="filter-option__label">Hatchback</span>
            <span className="filter-option__count">(14)</span>
          </label>
        </div>
      </div>

      {/* Capacity */}
      <div className="filter-sidebar__group">
        <h3 className="filter-sidebar__title">Capacity</h3>
        <div className="filter-sidebar__options">
          <label className="filter-option">
            <input type="checkbox" defaultChecked />
            <span className="filter-option__label">2 Person</span>
            <span className="filter-option__count">(10)</span>
          </label>
          <label className="filter-option">
            <input type="checkbox" />
            <span className="filter-option__label">4 Person</span>
            <span className="filter-option__count">(14)</span>
          </label>
          <label className="filter-option">
            <input type="checkbox" />
            <span className="filter-option__label">6 Person</span>
            <span className="filter-option__count">(12)</span>
          </label>
          <label className="filter-option">
            <input type="checkbox" defaultChecked />
            <span className="filter-option__label">8 or More</span>
            <span className="filter-option__count">(16)</span>
          </label>
        </div>
      </div>

      {/* Price */}
      <div className="filter-sidebar__group">
        <h3 className="filter-sidebar__title">Price</h3>

        <div className="filter-sidebar__price-row">
          <span className="filter-sidebar__price-label">Max. $100.00</span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          defaultValue={100}
          className="filter-sidebar__slider"
        />
      </div>
    </div>
  );
};
