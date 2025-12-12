import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

type HeaderProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header__inner">

          {/* Logo clickable */}
          <Link to="/" className="header__logo">
            MORENT
          </Link>

          <nav className="header__nav">
            <a href="#" className="header__nav-link header__nav-link--active">
              Home
            </a>
            <a href="#" className="header__nav-link">
              Vehicles
            </a>
            <a href="#" className="header__nav-link">
              About
            </a>
          </nav>

          <div className="header__actions">
            <button className="header__login-btn">Login</button>
          </div>

          <button className="header__menu-btn" aria-label="Open menu">
            ☰
          </button>
        </div>
      </div>

      <div className="container">
        <SearchBar value={searchTerm} onChange={onSearchChange} />
      </div>
    </header>
  );
};
