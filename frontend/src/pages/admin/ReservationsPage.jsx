import React, { useState, useEffect } from 'react';
import reservationService from '../../services/reservationService';
import { PageHeader, StatusBadge } from './RoomsPage';
import './AdminPages.css';

function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);

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
      alert('Error updating status');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this reservation?')) return;
    try {
      await reservationService.delete(id);
      loadData();
    } catch (error) {
      alert('Error deleting reservation');
    }
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      day: '2-digit', month: 'short', year: 'numeric' 
    });
  }

  const filterLabels = {
    '': 'All',
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'checked_in': 'Checked In',
    'checked_out': 'Checked Out',
    'cancelled': 'Cancelled'
  };

  return (
    <div className="admin-page">
      <PageHeader title="Reservations" count={reservations.length} />

      <div className="filter-bar">
        {Object.entries(filterLabels).map(([value, label]) => (
          <button 
            key={value} 
            className={`filter-btn ${filter === value ? 'active' : ''}`} 
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : reservations.length === 0 ? (
        <div className="empty-state">
          <p>No reservations found</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Guest</th>
                <th>Contact</th>
                <th>Room</th>
                <th>Dates</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id}>
                  <td><strong>#{res.id}</strong></td>
                  <td>
                    <div className="guest-info">
                      <strong>{res.first_name} {res.last_name}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <small>{res.email}</small>
                      {res.phone && <small>{res.phone}</small>}
                    </div>
                  </td>
                  <td>#{res.room_number} - {res.room_type_name}</td>
                  <td>
                    <div className="date-range">
                      <span>{formatDate(res.check_in)}</span>
                      <span className="date-arrow">→</span>
                      <span>{formatDate(res.check_out)}</span>
                    </div>
                  </td>
                  <td>{res.adults} adults{res.children > 0 && `, ${res.children} children`}</td>
                  <td><StatusBadge status={res.status} /></td>
                  <td><strong>${res.total_price || 0}</strong></td>
                  <td>
                    <div className="table-actions">
                      <StatusSelect 
                        value={res.status} 
                        onChange={(s) => handleStatusChange(res.id, s)} 
                      />
                      <button 
                        className="btn-icon" 
                        onClick={() => setSelectedReservation(res)}
                        title="View details"
                      >
                        View
                      </button>
                      <button 
                        className="btn-icon danger" 
                        onClick={() => handleDelete(res.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedReservation && (
        <ReservationModal 
          reservation={selectedReservation} 
          onClose={() => setSelectedReservation(null)}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}

function StatusSelect({ value, onChange }) {
  return (
    <select 
      className="status-select" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="checked_in">Checked In</option>
      <option value="checked_out">Checked Out</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}

function ReservationModal({ reservation, onClose, formatDate }) {
  const res = reservation;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Reservation #{res.id}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-section">
              <h4>Guest Information</h4>
              <p><strong>Name:</strong> {res.first_name} {res.last_name}</p>
              <p><strong>Email:</strong> {res.email}</p>
              <p><strong>Phone:</strong> {res.phone || 'Not provided'}</p>
            </div>
            <div className="detail-section">
              <h4>Reservation Details</h4>
              <p><strong>Room:</strong> #{res.room_number} - {res.room_type_name}</p>
              <p><strong>Check-in:</strong> {formatDate(res.check_in)}</p>
              <p><strong>Check-out:</strong> {formatDate(res.check_out)}</p>
              <p><strong>Guests:</strong> {res.adults} adults, {res.children || 0} children</p>
            </div>
            <div className="detail-section">
              <h4>Payment</h4>
              <p><strong>Total:</strong> ${res.total_price || 0}</p>
              <p><strong>Status:</strong> <StatusBadge status={res.status} /></p>
            </div>
            {res.notes && (
              <div className="detail-section full-width">
                <h4>Special Requests</h4>
                <p>{res.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservationsPage;
