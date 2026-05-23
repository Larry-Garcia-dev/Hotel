import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <div className="brand-logo">GH</div>
          <div className="brand-text">
            <p className="brand-name">Gateway Hotel</p>
            <p className="brand-location">Washington, DC</p>
          </div>
        </Link>
        
        <nav className="nav">
          <Link to="/#rooms">Habitaciones</Link>
          <Link to="/#location">Ubicacion</Link>
          <Link to="/#contact">Contacto</Link>
          <Link to="/admin" className="nav-admin">Admin</Link>
        </nav>
        
        <a href="#availability" className="btn btn-primary">Reservar</a>
      </div>
    </header>
  );
}

export default Header;
