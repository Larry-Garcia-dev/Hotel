import React from 'react';
import './Amenities.css';

const amenities = [
  { 
    icon: 'wifi', 
    label: 'Free Wi-Fi',
    description: 'Stay connected throughout your visit'
  },
  { 
    icon: 'coffee', 
    label: 'In-Room Coffee',
    description: 'Start your morning right'
  },
  { 
    icon: 'shuttle', 
    label: 'Airport Access',
    description: 'Near DCA, IAD, and BWI'
  },
  { 
    icon: 'accessible', 
    label: 'ADA Rooms',
    description: 'Accessible accommodations available'
  }
];

function Amenities() {
  return (
    <section className="amenities section">
      <div className="container">
        <div className="amenity-grid">
          {amenities.map((item) => (
            <div key={item.label} className="amenity-card">
              <div className="amenity-icon">
                {item.icon === 'wifi' && 'W'}
                {item.icon === 'coffee' && 'C'}
                {item.icon === 'shuttle' && 'S'}
                {item.icon === 'accessible' && 'A'}
              </div>
              <p className="amenity-label">{item.label}</p>
              <p className="amenity-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Amenities;
