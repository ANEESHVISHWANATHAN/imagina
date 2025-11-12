import React, { useState } from "react";
import "./Header.css";


const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      {/* Left side: logo + name */}
      <div className="logo-section">
        
        <h1 className="logo-text">IMAGINA</h1>
      </div>

      {/* Hamburger menu for mobile */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Navigation links */}
      <nav className={`nav-menu ${menuOpen ? "active" : ""}`}>
        <a href="#home" className="nav-link" onClick={() => setMenuOpen(false)}>
          Home
        </a>
        <a href="#about" className="nav-link" onClick={() => setMenuOpen(false)}>
          About Us
        </a>
        <a href="#convert" className="nav-link" onClick={() => setMenuOpen(false)}>
          Converter
        </a>
      </nav>
    </header>
  );
};

export default Header;
