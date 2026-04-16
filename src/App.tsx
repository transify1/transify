/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import TransitaireRegister from './pages/Auth/TransitaireRegister';
import ClientDashboard from './pages/Client/Dashboard';
import TransitaireDashboard from './pages/Transitaire/Dashboard';
import Explorer from './pages/Client/Explorer';
import ClientOrders from './pages/Client/Orders';
import ClientProfile from './pages/Client/Profile';
import ClientSupport from './pages/Client/Support';
import TransitaireProfile from './pages/Client/TransitaireProfile';
import CreateOrder from './pages/Client/CreateOrder';
import ReviewOrder from './pages/Client/ReviewOrder';
import ClientMessages from './pages/Client/Messages';
import ClientChat from './pages/Client/Chat';
import TransitaireOrders from './pages/Transitaire/Orders';
import TransitaireShipments from './pages/Transitaire/Shipments';
import TransitaireSettings from './pages/Transitaire/Settings';
import TransitairePayment from './pages/Transitaire/Payment';
import TransitairePaymentStatus from './pages/Transitaire/PaymentStatus';
import TransitaireScanner from './pages/Transitaire/Scanner';
import TransitaireMessages from './pages/Transitaire/Messages';
import TransitaireChat from './pages/Transitaire/Chat';
import ShopSettings from './pages/Transitaire/ShopSettings';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/register/transitaire" element={<TransitaireRegister />} />
      
      {/* Client Routes */}
      <Route path="/client/*" element={
        <Routes>
          <Route path="dashboard" element={<ProtectedRoute allowedRoles={['client']}><ClientDashboard /></ProtectedRoute>} />
          <Route path="explorer" element={<ProtectedRoute allowedRoles={['client']}><Explorer /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute allowedRoles={['client']}><ClientOrders /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute allowedRoles={['client']}><ClientProfile /></ProtectedRoute>} />
          <Route path="messages" element={<ProtectedRoute allowedRoles={['client']}><ClientMessages /></ProtectedRoute>} />
          <Route path="chat/:id" element={<ProtectedRoute allowedRoles={['client']}><ClientChat /></ProtectedRoute>} />
          <Route path="support" element={<ProtectedRoute allowedRoles={['client']}><ClientSupport /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute allowedRoles={['client']}><Navigate to="/client/profile?tab=settings" replace /></ProtectedRoute>} />
          <Route path="transitaire/:id" element={<ProtectedRoute allowedRoles={['client', 'transitaire']}><TransitaireProfile /></ProtectedRoute>} />
          <Route path="order/new/:companyId" element={<ProtectedRoute allowedRoles={['client']}><CreateOrder /></ProtectedRoute>} />
          <Route path="review/:orderId" element={<ProtectedRoute allowedRoles={['client']}><ReviewOrder /></ProtectedRoute>} />
        </Routes>
      } />

      {/* Transitaire Routes */}
      <Route path="/transitaire/*" element={
        <ProtectedRoute allowedRoles={['transitaire']}>
          <Routes>
            <Route path="dashboard" element={<TransitaireDashboard />} />
            <Route path="orders" element={<TransitaireOrders />} />
            <Route path="shipments" element={<TransitaireShipments />} />
            <Route path="payment" element={<TransitairePayment />} />
            <Route path="payment-status" element={<TransitairePaymentStatus />} />
            <Route path="scanner" element={<TransitaireScanner />} />
            <Route path="messages" element={<TransitaireMessages />} />
            <Route path="chat/:id" element={<TransitaireChat />} />
            <Route path="shop" element={<ShopSettings />} />
            <Route path="settings" element={<TransitaireSettings />} />
          </Routes>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

