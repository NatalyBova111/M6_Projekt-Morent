import type { Vehicle } from "../types/vehicle";

type Props = {
  car: Vehicle;
};

export function CarCard({ car }: Props) {
  return (
    <article className="car-card">
      <div className="car-card__top">
        <h3 className="car-card__title">
          {car.brand} <span>{car.model}</span>
        </h3>
        <p className="car-card__type">{car.vehicletype}</p>
      </div>

      <div className="car-card__image-wrapper">
        <img
          src={car.carimg}
          alt={`${car.brand} ${car.model}`}
          className="car-card__image"
        />
      </div>

      <div className="car-card__details">
        <span className="car-card__spec">
          {car.geartype === "Automatic" ? "⚙️ Automatic" : "⚙️ Manual"}
        </span>
        <span className="car-card__spec">🪑 {car.seats} seats</span>
        <span className="car-card__spec">⛽ {car.fuel}</span>
      </div>

      <div className="car-card__bottom">
        <div className="car-card__price">
          <span className="car-card__price-main">${car.priceperday}</span>
          <span className="car-card__price-sub">/ day</span>
        </div>
        <button className="car-card__button">Rent now</button>
      </div>
    </article>
  );
}
