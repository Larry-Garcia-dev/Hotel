import React, { useState, useEffect } from 'react';
import roomService from '../../services/roomService';
import './AdminPages.css';

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [roomsData, typesData] = await Promise.all([
        roomService.getRooms(),
        roomService.getRoomTypes()
      ]);
      setRooms(roomsData);
      setRoomTypes(typesData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  function openModal(room = null) {
    setEditingRoom(room);
    setShowModal(true);
  }

  async function handleDelete(id) {
    if (!window.confirm('Eliminar esta habitacion?')) return;
    try {
      await roomService.deleteRoom(id);
      loadData();
    } catch (error) {
      alert('Error al eliminar');
    }
  }

  return (
    <div className="admin-page">
      <PageHeader title="Habitaciones" count={rooms.length} onAdd={() => openModal()} />

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Numero</th>
                <th>Tipo</th>
                <th>Piso</th>
                <th>Estado</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td><strong>#{room.room_number}</strong></td>
                  <td>{room.room_type_name}</td>
                  <td>Piso {room.floor}</td>
                  <td><StatusBadge status={room.status} /></td>
                  <td>${room.base_price}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon" onClick={() => openModal(room)}>Editar</button>
                      <button className="btn-icon danger" onClick={() => handleDelete(room.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <RoomModal
          room={editingRoom}
          roomTypes={roomTypes}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); loadData(); }}
        />
      )}
    </div>
  );
}

function RoomModal({ room, roomTypes, onClose, onSave }) {
  const [formData, setFormData] = useState({
    room_number: room?.room_number || '',
    room_type_id: room?.room_type_id || '',
    floor: room?.floor || 1,
    status: room?.status || 'available',
    notes: room?.notes || ''
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (room) {
        await roomService.updateRoom(room.id, formData);
      } else {
        await roomService.createRoom(formData);
      }
      onSave();
    } catch (error) {
      alert('Error al guardar');
    }
  }

  return (
    <Modal title={room ? 'Editar Habitacion' : 'Nueva Habitacion'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormGroup label="Numero de Habitacion">
          <input className="input" value={formData.room_number} onChange={(e) => setFormData({...formData, room_number: e.target.value})} required />
        </FormGroup>
        <FormGroup label="Tipo de Habitacion">
          <select className="input" value={formData.room_type_id} onChange={(e) => setFormData({...formData, room_type_id: e.target.value})} required>
            <option value="">Seleccionar...</option>
            {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
          </select>
        </FormGroup>
        <FormGroup label="Piso">
          <input type="number" className="input" value={formData.floor} onChange={(e) => setFormData({...formData, floor: e.target.value})} />
        </FormGroup>
        <FormGroup label="Estado">
          <select className="input" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
            <option value="available">Disponible</option>
            <option value="occupied">Ocupada</option>
            <option value="maintenance">Mantenimiento</option>
            <option value="cleaning">Limpieza</option>
          </select>
        </FormGroup>
        <div className="modal-actions">
          <button type="button" className="btn btn-outline-dark" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary">Guardar</button>
        </div>
      </form>
    </Modal>
  );
}

function PageHeader({ title, count, onAdd }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{count} registros</p>
      </div>
      <button className="btn btn-primary" onClick={onAdd}>+ Agregar</button>
    </div>
  );
}

function StatusBadge({ status }) {
  const labels = { available: 'Disponible', occupied: 'Ocupada', maintenance: 'Mantenimiento', cleaning: 'Limpieza' };
  return <span className={`status-badge ${status}`}>{labels[status]}</span>;
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>x</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormGroup({ label, children }) {
  return (
    <div className="form-group">
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

export { PageHeader, StatusBadge, Modal, FormGroup };
export default RoomsPage;
