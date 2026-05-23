import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { PageHeader, Modal, FormGroup } from './RoomsPage';
import './AdminPages.css';

function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await api.get('/guests');
      setGuests(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Eliminar este huesped?')) return;
    try {
      await api.delete(`/guests/${id}`);
      loadData();
    } catch (error) {
      alert('Error al eliminar');
    }
  }

  return (
    <div className="admin-page">
      <PageHeader title="Huespedes" count={guests.length} onAdd={() => { setEditingGuest(null); setShowModal(true); }} />

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Documento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest.id}>
                  <td><strong>{guest.first_name} {guest.last_name}</strong></td>
                  <td>{guest.email || '-'}</td>
                  <td>{guest.phone || '-'}</td>
                  <td>{guest.document_number || '-'}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon" onClick={() => { setEditingGuest(guest); setShowModal(true); }}>Editar</button>
                      <button className="btn-icon danger" onClick={() => handleDelete(guest.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <GuestModal
          guest={editingGuest}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); loadData(); }}
        />
      )}
    </div>
  );
}

function GuestModal({ guest, onClose, onSave }) {
  const [formData, setFormData] = useState({
    first_name: guest?.first_name || '',
    last_name: guest?.last_name || '',
    email: guest?.email || '',
    phone: guest?.phone || '',
    document_type: guest?.document_type || '',
    document_number: guest?.document_number || '',
    address: guest?.address || ''
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (guest) {
        await api.put(`/guests/${guest.id}`, formData);
      } else {
        await api.post('/guests', formData);
      }
      onSave();
    } catch (error) {
      alert('Error al guardar');
    }
  }

  function handleChange(field, value) {
    setFormData({ ...formData, [field]: value });
  }

  return (
    <Modal title={guest ? 'Editar Huesped' : 'Nuevo Huesped'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <FormGroup label="Nombre">
            <input className="input" value={formData.first_name} onChange={(e) => handleChange('first_name', e.target.value)} required />
          </FormGroup>
          <FormGroup label="Apellido">
            <input className="input" value={formData.last_name} onChange={(e) => handleChange('last_name', e.target.value)} required />
          </FormGroup>
        </div>
        <FormGroup label="Email">
          <input type="email" className="input" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
        </FormGroup>
        <FormGroup label="Telefono">
          <input className="input" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
        </FormGroup>
        <div className="form-row">
          <FormGroup label="Tipo Documento">
            <select className="input" value={formData.document_type} onChange={(e) => handleChange('document_type', e.target.value)}>
              <option value="">Seleccionar...</option>
              <option value="DNI">DNI</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Licencia">Licencia</option>
            </select>
          </FormGroup>
          <FormGroup label="Numero Documento">
            <input className="input" value={formData.document_number} onChange={(e) => handleChange('document_number', e.target.value)} />
          </FormGroup>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-outline-dark" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary">Guardar</button>
        </div>
      </form>
    </Modal>
  );
}

export default GuestsPage;
