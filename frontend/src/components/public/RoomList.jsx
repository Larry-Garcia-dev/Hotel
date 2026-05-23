import React, { useState, useEffect } from 'react';
import roomService from '../../services/roomService';
import './RoomList.css';

function RoomList() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoomTypes();
  }, []);

  async function loadRoomTypes() {
    try {
      const data = await roomService.getRoomTypes();
      setRoomTypes(data);
    } catch (error) {
      console.error('Error loading room types:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Cargando habitaciones...</div>;
  }

  return (
    <section className="rooms section" id="rooms">
      <div className="container">
        <div className="section-header">
          <div>
            <p className="eyebrow">Habitaciones</p>
            <h2>Simples, comodas, listas para tu estancia.</h2>
          </div>
          <p className="section-desc">
            Cada habitacion incluye aire acondicionado, bano privado, 
            refrigerador/microondas, TV LCD y lo esencial.
          </p>
        </div>

        <div className="room-grid">
          {roomTypes.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RoomCard({ room }) {
  return (
    <article className="room-card card">
      <div className="room-image" />
      <div className="room-body">
        <span className="room-tag">Hasta {room.max_guests} huespedes</span>
        <h3>{room.name}</h3>
        <p>{room.description}</p>
        <div className="room-footer">
          <span className="room-price">${room.base_price}/noche</span>
          <a href="#availability" className="btn btn-outline-dark">Reservar</a>
        </div>
      </div>
    </article>
  );
}

export default RoomList;
