// src/components/SearchBar.tsx
import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="top-search">
      <div className="top-search__inner">
        <span className="top-search__icon">🔍</span>
        <input
          className="top-search__input"
          type="text"
          placeholder="Search something here"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
