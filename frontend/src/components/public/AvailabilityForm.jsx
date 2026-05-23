import React, { useState, useEffect } from 'react';
import roomService from '../../services/roomService';
import reservationService from '../../services/reservationService';
import './AvailabilityForm.css';

function AvailabilityForm() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    roomType: ''
  });
  const [availableRooms, setAvailableRooms] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoomTypes();
  }, []);

  async function loadRoomTypes() {
    try {
      const data = await roomService.getRoomTypes();
      setRoomTypes(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const rooms = await roomService.checkAvailability(
        formData.checkIn,
        formData.checkOut,
        formData.roomType || undefined
      );
      setAvailableRooms(rooms);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="availability section" id="availability">
      <div className="container">
        <div className="availability-panel">
          <div className="availability-info">
            <p className="eyebrow">Disponibilidad</p>
            <h2>Encuentra tu habitacion.</h2>
            <p>Busca fechas, huespedes y tipo de habitacion para tu proxima estancia.</p>
          </div>

          <form className="availability-form" onSubmit={handleSubmit}>
            <FormField label="Check In" name="checkIn" type="date" value={formData.checkIn} onChange={handleChange} />
            <FormField label="Check Out" name="checkOut" type="date" value={formData.checkOut} onChange={handleChange} />
            <FormField label="Huespedes" name="guests" type="select" value={formData.guests} onChange={handleChange}>
              {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Huesped' : 'Huespedes'}</option>)}
            </FormField>
            <FormField label="Tipo" name="roomType" type="select" value={formData.roomType} onChange={handleChange}>
              <option value="">Cualquier tipo</option>
              {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
            </FormField>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar Disponibilidad'}
            </button>
          </form>
        </div>

        {availableRooms && <AvailableRoomsResult rooms={availableRooms} />}
      </div>
    </section>
  );
}

function FormField({ label, name, type, value, onChange, children }) {
  return (
    <div className="form-field">
      <label className="label" htmlFor={name}>{label}</label>
      {type === 'select' ? (
        <select id={name} name={name} value={value} onChange={onChange} className="input">
          {children}
        </select>
      ) : (
        <input id={name} name={name} type={type} value={value} onChange={onChange} className="input" required />
      )}
    </div>
  );
}

function AvailableRoomsResult({ rooms }) {
  if (rooms.length === 0) {
    return (
      <div className="no-rooms">
        <p>No hay habitaciones disponibles para las fechas seleccionadas.</p>
      </div>
    );
  }

  return (
    <div className="available-rooms">
      <h3>Habitaciones Disponibles ({rooms.length})</h3>
      <div className="available-rooms-grid">
        {rooms.map(room => (
          <div key={room.id} className="available-room-card">
            <div className="room-info">
              <span className="room-number">#{room.room_number}</span>
              <span className="room-type">{room.room_type_name}</span>
            </div>
            <div className="room-price">${room.base_price}/noche</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvailabilityForm;
