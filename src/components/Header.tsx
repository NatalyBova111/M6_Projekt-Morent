import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/useAuth";

type HeaderProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  const { user, signOut } = useAuth();

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
            <button className="header__icon-btn" aria-label="Notifications">
              <img
                src="/notification.png"
                alt="Notifications"
                className="header__icon"
              />
            </button>

            <button className="header__icon-btn" aria-label="Settings">
              <img
                src="/setting-2.png"
                alt="Settings"
                className="header__icon"
              />
            </button>

            {user ? (
              <button
                className="header__avatar-btn"
                onClick={signOut}
                title="Sign out"
              >
                <img
                  src="/Profil.png"
                  alt="Profile"
                  className="header__avatar"
                />
              </button>
            ) : (
              <Link to="/login" className="header__avatar-btn">
                <img
                  src="/Profil.png"
                  alt="Profile"
                  className="header__avatar"
                />
              </Link>
            )}
          </div>

          {/* Mobile menu */}
          <button className="header__menu-btn" aria-label="Open menu">
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
