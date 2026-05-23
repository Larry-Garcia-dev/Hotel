import React from 'react';
import './Amenities.css';

const amenities = [
  { icon: 'wifi', label: 'Wi-Fi Gratis' },
  { icon: 'coffee', label: 'Cafetera' },
  { icon: 'car', label: 'Acceso Aeropuerto' },
  { icon: 'accessibility', label: 'Habitaciones ADA' }
];

const icons = {
  wifi: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
    </svg>
  ),
  coffee: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8zM6 2v3M10 2v3M14 2v3"/>
    </svg>
  ),
  car: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 3h3v18h-3M1 3h3v18H1M4 9h12M4 15h12M10 3v18"/>
    </svg>
  ),
  accessibility: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="4" r="2"/>
      <path d="M12 6v6m0 0-4 4m4-4 4 4M6 12h12"/>
    </svg>
  )
};

function Amenities() {
  return (
    <section className="amenities section">
      <div className="container">
        <div className="amenity-grid">
          {amenities.map((item) => (
            <div key={item.label} className="amenity-card">
              <div className="amenity-icon">
                {icons[item.icon]}
              </div>
              <p className="amenity-label">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Amenities;
