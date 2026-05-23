import React, { useState, useEffect } from 'react';
import inventoryService from '../../services/inventoryService';
import { PageHeader, Modal, FormGroup } from './RoomsPage';
import './AdminPages.css';

function InventoryPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, [filter]);

  async function loadData() {
    try {
      const filters = filter === 'low' ? { low_stock: 'true' } : {};
      const [itemsData, categoriesData] = await Promise.all([
        inventoryService.getItems(filters),
        inventoryService.getCategories()
      ]);
      setItems(itemsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Eliminar este item?')) return;
    try {
      await inventoryService.deleteItem(id);
      loadData();
    } catch (error) {
      alert('Error al eliminar');
    }
  }

  const lowStockCount = items.filter(i => i.quantity <= i.min_quantity).length;

  return (
    <div className="admin-page">
      <PageHeader title="Inventario" count={items.length} onAdd={() => { setEditingItem(null); setShowModal(true); }} />

      <div className="filter-bar">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          Todos
        </button>
        <button className={`filter-btn ${filter === 'low' ? 'active' : ''}`} onClick={() => setFilter('low')}>
          Stock Bajo ({lowStockCount})
        </button>
      </div>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Categoria</th>
                <th>Cantidad</th>
                <th>Min.</th>
                <th>Unidad</th>
                <th>Costo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className={item.quantity <= item.min_quantity ? 'low-stock' : ''}>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.category_name || '-'}</td>
                  <td>
                    <span className={item.quantity <= item.min_quantity ? 'text-danger' : ''}>
                      {item.quantity}
                    </span>
                  </td>
                  <td>{item.min_quantity}</td>
                  <td>{item.unit}</td>
                  <td>${item.cost_per_unit || 0}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon" onClick={() => { setEditingItem(item); setShowModal(true); }}>Editar</button>
                      <button className="btn-icon danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <InventoryModal
          item={editingItem}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); loadData(); }}
        />
      )}
    </div>
  );
}

function InventoryModal({ item, categories, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category_id: item?.category_id || '',
    quantity: item?.quantity || 0,
    min_quantity: item?.min_quantity || 5,
    unit: item?.unit || 'unidad',
    cost_per_unit: item?.cost_per_unit || 0,
    location: item?.location || '',
    description: item?.description || ''
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (item) {
        await inventoryService.updateItem(item.id, formData);
      } else {
        await inventoryService.createItem(formData);
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
    <Modal title={item ? 'Editar Item' : 'Nuevo Item'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormGroup label="Nombre">
          <input className="input" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required />
        </FormGroup>
        <FormGroup label="Categoria">
          <select className="input" value={formData.category_id} onChange={(e) => handleChange('category_id', e.target.value)}>
            <option value="">Sin categoria</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </FormGroup>
        <div className="form-row">
          <FormGroup label="Cantidad">
            <input type="number" className="input" value={formData.quantity} onChange={(e) => handleChange('quantity', e.target.value)} />
          </FormGroup>
          <FormGroup label="Minimo">
            <input type="number" className="input" value={formData.min_quantity} onChange={(e) => handleChange('min_quantity', e.target.value)} />
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup label="Unidad">
            <input className="input" value={formData.unit} onChange={(e) => handleChange('unit', e.target.value)} />
          </FormGroup>
          <FormGroup label="Costo por unidad">
            <input type="number" step="0.01" className="input" value={formData.cost_per_unit} onChange={(e) => handleChange('cost_per_unit', e.target.value)} />
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

export default InventoryPage;
