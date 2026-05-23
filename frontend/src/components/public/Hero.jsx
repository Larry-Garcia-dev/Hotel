import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero" id="location">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="badge">Habitaciones cerca de DC</div>
          <h1>Una estancia moderna con acceso a Washington, DC.</h1>
          <p>
            Gateway Hotel ofrece alojamiento conveniente cerca de aeropuertos, 
            agencias gubernamentales y las atracciones mas conocidas.
          </p>
          <div className="hero-actions">
            <a href="#availability" className="btn btn-gold">Ver Disponibilidad</a>
            <a href="#rooms" className="btn btn-outline">Ver Habitaciones</a>
          </div>
        </div>

        <aside className="hero-card">
          <div className="hero-card-top">
            <div className="hero-card-frame">
              <p className="hero-label">Gateway Hotel</p>
              <h2>Descansa bien. Explora mas.</h2>
            </div>
          </div>
          <div className="info-grid">
            <div className="info-tile">
              <span className="tile-label">Direccion</span>
              2700 New York Avenue NE
            </div>
            <div className="info-tile">
              <span className="tile-label">Telefono</span>
              +1 202-832-5800
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Hero;
