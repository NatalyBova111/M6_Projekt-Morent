// src/components/RentalPanel.tsx
import React from "react";

export const RentalPanel: React.FC = () => {
  return (
    <section className="rental-panel">
      <div className="rental-panel__grid container">
        {/* Pickup card */}
        <article className="rental-card">
          <header className="rental-card__header">
            <h3 className="rental-card__title">Pickup</h3>
            <span className="rental-card__step">Step 1 of 4</span>
          </header>

          <div className="rental-card__fields">
            <div className="rental-card__field">
              <label className="rental-card__label">Location</label>
              <select className="rental-card__input">
                <option>Please select</option>
                <option>Bremen</option>
                <option>Hamburg</option>
                <option>Berlin</option>
              </select>
            </div>

            <div className="rental-card__field">
              <label className="rental-card__label">Date</label>
              <input
                type="text"
                placeholder="tt.mm.jjjj"
                className="rental-card__input"
              />
            </div>

            <div className="rental-card__field">
              <label className="rental-card__label">Time</label>
              <input
                type="text"
                placeholder="--:--"
                className="rental-card__input"
              />
            </div>
          </div>
        </article>

        {/* Middle swap button */}
        <div className="rental-panel__swap-wrapper">
          <button className="rental-panel__swap-btn" type="button">
            ⇅
          </button>
        </div>

        {/* Drop-off card */}
        <article className="rental-card">
          <header className="rental-card__header">
            <h3 className="rental-card__title">Drop-Off</h3>
            <span className="rental-card__step">Step 2 of 4</span>
          </header>

          <div className="rental-card__fields">
            <div className="rental-card__field">
              <label className="rental-card__label">Location</label>
              <select className="rental-card__input">
                <option>Please select</option>
                <option>Bremen</option>
                <option>Hamburg</option>
                <option>Berlin</option>
              </select>
            </div>

            <div className="rental-card__field">
              <label className="rental-card__label">Date</label>
              <input
                type="text"
                placeholder="tt.mm.jjjj"
                className="rental-card__input"
              />
            </div>

            <div className="rental-card__field">
              <label className="rental-card__label">Time</label>
              <input
                type="text"
                placeholder="--:--"
                className="rental-card__input"
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
