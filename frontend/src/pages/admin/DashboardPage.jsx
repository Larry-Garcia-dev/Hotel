import React, { useState, useEffect } from 'react';
import roomService from '../../services/roomService';
import reservationService from '../../services/reservationService';
import inventoryService from '../../services/inventoryService';
import './AdminPages.css';

function DashboardPage() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    pendingReservations: 0,
    lowStockItems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [rooms, reservations, inventory] = await Promise.all([
        roomService.getRooms(),
        reservationService.getAll(),
        inventoryService.getItems()
      ]);

      setStats({
        totalRooms: rooms.length,
        availableRooms: rooms.filter(r => r.status === 'available').length,
        pendingReservations: reservations.filter(r => r.status === 'pending').length,
        lowStockItems: inventory.filter(i => i.quantity <= i.min_quantity).length
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen general del hotel</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard value={stats.totalRooms} label="Total Habitaciones" />
        <StatCard value={stats.availableRooms} label="Disponibles" color="green" />
        <StatCard value={stats.pendingReservations} label="Reservas Pendientes" color="orange" />
        <StatCard value={stats.lowStockItems} label="Items Stock Bajo" color="red" />
      </div>

      <div className="dashboard-info">
        <div className="info-card">
          <h3>Acciones Rapidas</h3>
          <ul>
            <li>Gestiona habitaciones desde el menu lateral</li>
            <li>Revisa reservaciones pendientes</li>
            <li>Controla el inventario del hotel</li>
            <li>Administra datos de huespedes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, color = 'emerald' }) {
  const colors = {
    emerald: 'var(--emerald)',
    green: '#16a34a',
    orange: '#ea580c',
    red: '#dc2626'
  };

  return (
    <div className="stat-card">
      <h3 style={{ color: colors[color] }}>{value}</h3>
      <p>{label}</p>
    </div>
  );
}

export default DashboardPage;
