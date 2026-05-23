import React from 'react';
import './RoomList.css';

const defaultRooms = [
  {
    id: 1,
    name: 'Two Double Beds',
    tag: 'Up to 4 guests',
    description: 'Room for families or small groups, with space to relax after a day in Washington, DC.',
    imageClass: 'double'
  },
  {
    id: 2,
    name: 'One King Bed',
    tag: 'Best for 1-2 guests',
    description: 'A comfortable option for solo travelers or couples looking for a quiet stay.',
    imageClass: 'king'
  },
  {
    id: 3,
    name: 'Accessible Room',
    tag: 'Accessible stay',
    description: 'ADA-friendly room designed for easier access and a more comfortable experience.',
    imageClass: 'accessible'
  }
];

function RoomList() {
  return (
    <section className="section" id="rooms">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Rooms</p>
            <h2>Simple, comfortable, ready for your stay.</h2>
          </div>
          <p>
            Each room includes air conditioning, private bathroom,
            fridge/microwave, LCD TV, and essentials for a practical stay.
          </p>
        </div>

        <div className="room-grid">
          {defaultRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RoomCard({ room }) {
  return (
    <article className="room-card">
      <div className={`room-image ${room.imageClass}`} aria-hidden="true"></div>
      <div className="room-body">
        <span className="tag">{room.tag}</span>
        <h3>{room.name}</h3>
        <p>{room.description}</p>
        <a className="room-button" href="#contact">Book This Room</a>
      </div>
    </article>
  );
}

export default RoomList;
