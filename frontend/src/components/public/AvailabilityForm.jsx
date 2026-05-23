import React, { useState } from 'react';
import './AvailabilityForm.css';

function AvailabilityForm() {
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    children: '0',
    roomType: ''
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert('Search functionality will connect to the backend API');
  }

  return (
    <section className="section availability" id="availability">
      <div className="container availability-panel">
        <div>
          <p className="eyebrow">Availability</p>
          <h2>Find your room.</h2>
          <p>Search dates, guests, and room type for your upcoming Gateway Hotel stay.</p>
        </div>
        <form className="availability-form" onSubmit={handleSubmit}>
          <div className="availability-field">
            <label htmlFor="check-in">Check In</label>
            <input 
              id="check-in" 
              name="checkIn" 
              type="date" 
              value={formData.checkIn}
              onChange={handleChange}
            />
          </div>
          <div className="availability-field">
            <label htmlFor="check-out">Check Out</label>
            <input 
              id="check-out" 
              name="checkOut" 
              type="date"
              value={formData.checkOut}
              onChange={handleChange}
            />
          </div>
          <div className="availability-field">
            <label htmlFor="guest-count">Guests</label>
            <select id="guest-count" name="guests" value={formData.guests} onChange={handleChange}>
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
            </select>
          </div>
          <div className="availability-field">
            <label htmlFor="children-count">Children</label>
            <select id="children-count" name="children" value={formData.children} onChange={handleChange}>
              <option value="0">0 Children</option>
              <option value="1">1 Child</option>
              <option value="2">2 Children</option>
              <option value="3">3 Children</option>
              <option value="4">4 Children</option>
            </select>
          </div>
          <div className="availability-field">
            <label htmlFor="room-type">Room Type</label>
            <select id="room-type" name="roomType" value={formData.roomType} onChange={handleChange}>
              <option value="">Any Room</option>
              <option value="king">One King Bed</option>
              <option value="double">Two Double Beds</option>
              <option value="accessible">Accessible Room</option>
            </select>
          </div>
          <button className="pill-button" type="submit">Search Rooms</button>
        </form>
      </div>
    </section>
  );
}

export default AvailabilityForm;
