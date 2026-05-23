import React, { useState, useEffect } from 'react';
import reservationService from '../../services/reservationService';
import { PageHeader, StatusBadge, Modal, FormGroup } from './RoomsPage';
import './AdminPages.css';

function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadData();
  }, [filter]);

  async function loadData() {
    try {
      const filters = filter ? { status: filter } : {};
      const data = await reservationService.getAll(filters);
      setReservations(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await reservationService.updateStatus(id, status);
      loadData();
    } catch (error) {
      alert('Error al actualizar');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Eliminar esta reservacion?')) return;
    try {
      await reservationService.delete(id);
      loadData();
    } catch (error) {
      alert('Error al eliminar');
    }
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  return (
    <div className="admin-page">
      <PageHeader title="Reservaciones" count={reservations.length} onAdd={() => {}} />

      <div className="filter-bar">
        {['', 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map(s => (
          <button key={s} className={`filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === '' ? 'Todas' : { pending: 'Pendientes', confirmed: 'Confirmadas', checked_in: 'Check-In', checked_out: 'Check-Out', cancelled: 'Canceladas' }[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Huesped</th>
                <th>Habitacion</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id}>
                  <td><strong>#{res.id}</strong></td>
                  <td>{res.first_name} {res.last_name}</td>
                  <td>#{res.room_number} - {res.room_type_name}</td>
                  <td>{formatDate(res.check_in)}</td>
                  <td>{formatDate(res.check_out)}</td>
                  <td><StatusBadge status={res.status} /></td>
                  <td>${res.total_price || 0}</td>
                  <td>
                    <div className="table-actions">
                      <StatusSelect value={res.status} onChange={(s) => handleStatusChange(res.id, s)} />
                      <button className="btn-icon danger" onClick={() => handleDelete(res.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusSelect({ value, onChange }) {
  return (
    <select className="status-select" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="pending">Pendiente</option>
      <option value="confirmed">Confirmada</option>
      <option value="checked_in">Check-In</option>
      <option value="checked_out">Check-Out</option>
      <option value="cancelled">Cancelada</option>
    </select>
  );
}

export default ReservationsPage;
