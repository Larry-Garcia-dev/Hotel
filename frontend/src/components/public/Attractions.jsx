import React from 'react';
import './Attractions.css';

const attractions = [
  { name: 'Capitol Hill', image: '/images/attractions/capitol_hill.png' },
  { name: 'National Arboretum', image: '/images/attractions/national_arboretum.jpg' },
  { name: 'National Zoo', image: '/images/attractions/national_zoo.jpg' },
  { name: 'Smithsonian Museums', image: '/images/attractions/smithsonian.jpg' }
];

function Attractions() {
  return (
    <section className="section nearby" id="attractions">
      <div className="container">
        <p className="eyebrow">Nearby</p>
        <h2>Explore Washington, DC.</h2>
        <div className="attraction-grid">
          {attractions.map((attraction) => (
            <div key={attraction.name} className="attraction-card thumbnail">
              <img src={attraction.image} alt={attraction.name} />
              <span>{attraction.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Attractions;
