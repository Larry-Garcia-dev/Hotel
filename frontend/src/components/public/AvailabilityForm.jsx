import React, { useState } from 'react';
import roomService from '../../services/roomService';
import reservationService from '../../services/reservationService';
import './AvailabilityForm.css';

function AvailabilityForm() {
  const [step, setStep] = useState(1);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [searchData, setSearchData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    children: '0',
    roomType: ''
  });

  const [bookingData, setBookingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    selectedRoom: null,
    notes: ''
  });

  function handleSearchChange(e) {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  }

  function handleBookingChange(e) {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchData.checkIn || !searchData.checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const rooms = await roomService.getAvailable(searchData);
      setAvailableRooms(rooms);
      if (rooms.length > 0) {
        setStep(2);
        setBookingData({ ...bookingData, selectedRoom: rooms[0].id });
      } else {
        setError('No rooms available for selected dates. Please try different dates.');
      }
    } catch (err) {
      setError('Error searching rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleReservation(e) {
    e.preventDefault();
    if (!bookingData.firstName || !bookingData.email || !bookingData.selectedRoom) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const selectedRoom = availableRooms.find(r => r.id === Number(bookingData.selectedRoom));
      const nights = Math.ceil(
        (new Date(searchData.checkOut) - new Date(searchData.checkIn)) / (1000 * 60 * 60 * 24)
      );
      const totalPrice = (selectedRoom?.base_price || 100) * nights;

      await reservationService.create({
        guest: {
          first_name: bookingData.firstName,
          last_name: bookingData.lastName,
          email: bookingData.email,
          phone: bookingData.phone
        },
        room_id: bookingData.selectedRoom,
        check_in: searchData.checkIn,
        check_out: searchData.checkOut,
        adults: parseInt(searchData.guests),
        children: parseInt(searchData.children),
        total_price: totalPrice,
        notes: bookingData.notes
      });
      setSuccess(true);
      setStep(3);
    } catch (err) {
      setError('Error creating reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setStep(1);
    setSuccess(false);
    setError('');
    setSearchData({ checkIn: '', checkOut: '', guests: '2', children: '0', roomType: '' });
    setBookingData({ firstName: '', lastName: '', email: '', phone: '', selectedRoom: null, notes: '' });
    setAvailableRooms([]);
  }

  return (
    <section className="section availability" id="availability">
      <div className="container availability-panel">
        <div className="availability-info">
          <p className="eyebrow">
            {step === 1 ? 'Availability' : step === 2 ? 'Step 2 of 2' : 'Confirmed'}
          </p>
          <h2>{step === 1 ? 'Find your room.' : step === 2 ? 'Complete your booking.' : 'Thank you!'}</h2>
          <p>
            {step === 1 && 'Search dates, guests, and room type for your upcoming Gateway Hotel stay.'}
            {step === 2 && 'Fill in your details to complete the reservation.'}
            {step === 3 && 'Your reservation has been submitted successfully.'}
          </p>
        </div>

        {step === 1 && <SearchForm data={searchData} onChange={handleSearchChange} onSubmit={handleSearch} loading={loading} error={error} />}
        {step === 2 && <BookingForm data={bookingData} searchData={searchData} rooms={availableRooms} onChange={handleBookingChange} onSubmit={handleReservation} onBack={() => setStep(1)} loading={loading} error={error} />}
        {step === 3 && <SuccessMessage onReset={resetForm} />}
      </div>
    </section>
  );
}

function SearchForm({ data, onChange, onSubmit, loading, error }) {
  const today = new Date().toISOString().split('T')[0];
  return (
    <form className="availability-form" onSubmit={onSubmit}>
      <div className="availability-field">
        <label htmlFor="check-in">Check In *</label>
        <input id="check-in" name="checkIn" type="date" min={today} value={data.checkIn} onChange={onChange} required />
      </div>
      <div className="availability-field">
        <label htmlFor="check-out">Check Out *</label>
        <input id="check-out" name="checkOut" type="date" min={data.checkIn || today} value={data.checkOut} onChange={onChange} required />
      </div>
      <div className="availability-field">
        <label htmlFor="guest-count">Guests</label>
        <select id="guest-count" name="guests" value={data.guests} onChange={onChange}>
          <option value="1">1 Guest</option>
          <option value="2">2 Guests</option>
          <option value="3">3 Guests</option>
          <option value="4">4 Guests</option>
        </select>
      </div>
      <div className="availability-field">
        <label htmlFor="children-count">Children</label>
        <select id="children-count" name="children" value={data.children} onChange={onChange}>
          <option value="0">0 Children</option>
          <option value="1">1 Child</option>
          <option value="2">2 Children</option>
          <option value="3">3 Children</option>
        </select>
      </div>
      <div className="availability-field">
        <label htmlFor="room-type">Room Type</label>
        <select id="room-type" name="roomType" value={data.roomType} onChange={onChange}>
          <option value="">Any Room</option>
          <option value="king">One King Bed</option>
          <option value="double">Two Double Beds</option>
          <option value="accessible">Accessible Room</option>
        </select>
      </div>
      {error && <p className="form-error">{error}</p>}
      <button className="pill-button" type="submit" disabled={loading}>
        {loading ? 'Searching...' : 'Search Rooms'}
      </button>
    </form>
  );
}

function BookingForm({ data, searchData, rooms, onChange, onSubmit, onBack, loading, error }) {
  const selectedRoom = rooms.find(r => r.id === Number(data.selectedRoom));
  const nights = Math.ceil((new Date(searchData.checkOut) - new Date(searchData.checkIn)) / (1000 * 60 * 60 * 24));
  const totalPrice = (selectedRoom?.base_price || 100) * nights;

  return (
    <form className="availability-form booking-form" onSubmit={onSubmit}>
      <div className="availability-field">
        <label htmlFor="firstName">First Name *</label>
        <input id="firstName" name="firstName" type="text" placeholder="John" value={data.firstName} onChange={onChange} required />
      </div>
      <div className="availability-field">
        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" name="lastName" type="text" placeholder="Doe" value={data.lastName} onChange={onChange} />
      </div>
      <div className="availability-field">
        <label htmlFor="email">Email *</label>
        <input id="email" name="email" type="email" placeholder="john@example.com" value={data.email} onChange={onChange} required />
      </div>
      <div className="availability-field">
        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" type="tel" placeholder="+1 234 567 8900" value={data.phone} onChange={onChange} />
      </div>
      <div className="availability-field">
        <label htmlFor="selectedRoom">Select Room *</label>
        <select id="selectedRoom" name="selectedRoom" value={data.selectedRoom || ''} onChange={onChange} required>
          {rooms.map(room => (
            <option key={room.id} value={room.id}>
              #{room.room_number} - {room.type_name} (${room.base_price}/night)
            </option>
          ))}
        </select>
      </div>
      <div className="availability-field booking-summary">
        <label>Summary</label>
        <div className="summary-box">
          <span>{nights} night{nights > 1 ? 's' : ''}</span>
          <strong>${totalPrice}</strong>
        </div>
      </div>
      <div className="availability-field full-width">
        <label htmlFor="notes">Special Requests</label>
        <textarea id="notes" name="notes" placeholder="Any special requests or notes..." value={data.notes} onChange={onChange} rows="2" />
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="form-buttons">
        <button type="button" className="pill-button outline" onClick={onBack}>Back</button>
        <button className="pill-button" type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Confirm Reservation'}
        </button>
      </div>
    </form>
  );
}

function SuccessMessage({ onReset }) {
  return (
    <div className="success-message">
      <div className="success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h3>Reservation Submitted!</h3>
      <p>We have received your reservation request. You will receive a confirmation email shortly.</p>
      <button className="pill-button" onClick={onReset}>Make Another Reservation</button>
    </div>
  );
}

export default AvailabilityForm;
