import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/useAuth";
import { supabase } from "../lib/supabase";

type HeaderProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

export const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchChange }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Red dot is shown when the user has at least one booking in DB
  const [hasBookings, setHasBookings] = useState(false);

  const refreshBookingsDot = useCallback(async () => {
    if (!user) {
      setHasBookings(false);
      return;
    }

    // Count bookings without downloading all rows
    const { count, error } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (error) {
      // Fail-safe: do not show the dot if we cannot fetch
      setHasBookings(false);
      return;
    }

    setHasBookings((count ?? 0) > 0);
  }, [user]);

  useEffect(() => {
    // Defer state update to avoid "setState in effect" eslint warning
    const id = window.setTimeout(() => {
      refreshBookingsDot();
    }, 0);

    return () => window.clearTimeout(id);
  }, [refreshBookingsDot, location.pathname]);

  useEffect(() => {
    // Listen for booking changes from other parts of the app
    const onUpdated = () => refreshBookingsDot();
    window.addEventListener("morent:bookings-updated", onUpdated);
    return () => window.removeEventListener("morent:bookings-updated", onUpdated);
  }, [refreshBookingsDot]);

  const handleBellClick = () => navigate("/my-bookings");
  const handleFilterClick = () => navigate("/filter");

  const handleAvatarClick = async () => {
    if (user) {
      // If logged in, avatar acts as Logout
      await signOut();
      return;
    }

    // If not logged in, avatar leads to Login
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__inner">
          {/* Logo */}
          <Link to="/" className="header__logo">
            MORENT
          </Link>

          {/* Right icons */}
          <div className="header__actions">
            {/* Notifications -> My Bookings */}
            <button
              type="button"
              className="header__icon-btn header__icon-btn--bell"
              aria-label="My bookings"
              title="My bookings"
              onClick={handleBellClick}
            >
              <img src="/notification.png" alt="Notifications" className="header__icon" />
              {hasBookings && <span className="header__badge-dot" />}
            </button>

            {/* Settings icon -> Filter page */}
            <button
              type="button"
              className="header__icon-btn"
              aria-label="Filter"
              title="Filter cars"
              onClick={handleFilterClick}
            >
              <img src="/setting-2.png" alt="Filter" className="header__icon" />
            </button>

            {/* Avatar: Login when logged out, Logout when logged in */}
            <button
              type="button"
              className="header__avatar-btn"
              aria-label={user ? "Logout" : "Login"}
              title={user ? "Logout" : "Login"}
              onClick={handleAvatarClick}
            >
              <img
                src={user ? "/user.jpeg.png" : "/Profil.png"}
                alt={user ? "Logout" : "Login"}
                className="header__avatar"
              />
            </button>
          </div>

          {/* Mobile menu (currently disabled via CSS) */}
          <button type="button" className="header__menu-btn" aria-label="Open menu">
            ☰
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="container">
        <SearchBar value={searchTerm} onChange={onSearchChange} />
      </div>
    </header>
  );
};
