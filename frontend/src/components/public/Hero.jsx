import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero" id="location" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="badge">Comfortable rooms near DC landmarks</div>
          <h1 id="hero-title">A modern stay with easy access to Washington, DC.</h1>
          <p>
            Gateway Hotel offers convenient lodging near major airports,
            government agencies, and the city&apos;s best-known attractions.
          </p>
          <div className="hero-actions">
            <a href="#rooms" className="outline-button">View Rooms</a>
          </div>
        </div>

        <aside className="hero-card" aria-label="Hotel overview">
          <div className="hero-card-top">
            <div className="hero-card-frame">
              <p>Gateway Hotel</p>
              <h2>Rest easy. Explore more.</h2>
            </div>
          </div>
          <div className="info-grid">
            <div className="info-tile">
              <span className="tile-label">Address</span>
              2700 New York Avenue NE
            </div>
            <div className="info-tile">
              <span className="tile-label">Phone</span>
              +1 202-832-5800
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Hero;
