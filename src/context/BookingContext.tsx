// src/context/BookingContext.tsx
import React, { createContext, useCallback, useContext, useState } from "react";

type LocationData = {
  location: string;
  date: string;
  time: string;
};

type BookingContextValue = {
  pickup: LocationData;
  dropoff: LocationData;
  setPickup: React.Dispatch<React.SetStateAction<LocationData>>;
  setDropoff: React.Dispatch<React.SetStateAction<LocationData>>;
  swap: () => void;
  reset: () => void;
};

const emptyLocation: LocationData = { location: "", date: "", time: "" };

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pickup, setPickup] = useState<LocationData>(emptyLocation);
  const [dropoff, setDropoff] = useState<LocationData>(emptyLocation);

  // Swap pickup <-> dropoff
  const swap = useCallback(() => {
    setPickup((prevPickup) => {
      setDropoff(prevPickup);
      return dropoff;
    });
  }, [dropoff]);

  // Reset both blocks
  const reset = useCallback(() => {
    setPickup(emptyLocation);
    setDropoff(emptyLocation);
  }, []);

  const value: BookingContextValue = {
    pickup,
    dropoff,
    setPickup,
    setDropoff,
    swap,
    reset,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return ctx;
};
