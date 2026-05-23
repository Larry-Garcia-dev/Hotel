import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="Gateway Hotel home">
          <img src="/images/logo_gatewayhotel.png" alt="Gateway Hotel" />
        </Link>
        
        <input 
          className="menu-toggle" 
          id="mobile-menu-toggle" 
          type="checkbox"
          checked={menuOpen}
          onChange={(e) => setMenuOpen(e.target.checked)}
        />
        <label className="menu-button" htmlFor="mobile-menu-toggle" aria-label="Toggle navigation menu">
          <span aria-hidden="true"></span>
        </label>
        
        <nav className={`nav ${menuOpen ? 'open' : ''}`} aria-label="Primary navigation">
          <a href="#rooms">Rooms</a>
          <a href="#location">Location</a>
          <a href="#attractions">Attractions</a>
          <a href="#contact">Contact</a>
          <Link to="/admin">Admin</Link>
        </nav>
        
        <a href="#availability" className="pill-button">Book Now</a>
      </div>
    </header>
  );
}

export default Header;
