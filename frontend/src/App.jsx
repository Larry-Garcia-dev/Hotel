import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import authService from './services/authService';

import HomePage from './pages/public/HomePage';
import Login from './components/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import RoomsPage from './pages/admin/RoomsPage';
import ReservationsPage from './pages/admin/ReservationsPage';
import InventoryPage from './pages/admin/InventoryPage';
import GuestsPage from './pages/admin/GuestsPage';
import ChatBubble from './components/common/ChatBubble';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = authService.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  function handleLogin(userData) {
    setUser(userData);
  }

  function handleLogout() {
    setUser(null);
  }

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        <Route
          path="/admin"
          element={
            user ? (
              <AdminLayout user={user} onLogout={handleLogout}>
                <DashboardPage />
              </AdminLayout>
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        
        <Route
          path="/admin/rooms"
          element={
            user ? (
              <AdminLayout user={user} onLogout={handleLogout}>
                <RoomsPage />
              </AdminLayout>
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        
        <Route
          path="/admin/reservations"
          element={
            user ? (
              <AdminLayout user={user} onLogout={handleLogout}>
                <ReservationsPage />
              </AdminLayout>
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        
        <Route
          path="/admin/inventory"
          element={
            user ? (
              <AdminLayout user={user} onLogout={handleLogout}>
                <InventoryPage />
              </AdminLayout>
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        
        <Route
          path="/admin/guests"
          element={
            user ? (
              <AdminLayout user={user} onLogout={handleLogout}>
                <GuestsPage />
              </AdminLayout>
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
      </Routes>
      <ChatBubble />
    </BrowserRouter>
  );
}

export default App;
