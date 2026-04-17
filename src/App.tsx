/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { hasSupabaseConfig } from './lib/supabase';
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
import OrderTracker from './pages/OrderTracker';
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
  const { loading } = useApp();

  if (!hasSupabaseConfig) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-slate-100 text-center">
          <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">Configuration Requise</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Pour activer les fonctionnalités de Transify, veuillez configurer votre projet Supabase dans les 
            <strong> Paramètres </strong> de l'application.
          </p>
          <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Variables requises :</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <div className="w-2 h-2 rounded-full bg-slate-300" /> VITE_SUPABASE_URL
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <div className="w-2 h-2 rounded-full bg-slate-300" /> VITE_SUPABASE_ANON_KEY
              </li>
            </ul>
          </div>
          <p className="text-xs text-slate-400">L'application redémarrera automatiquement après avoir fourni les clés.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-[#3b82f6]/10 border-t-[#3b82f6] rounded-full animate-spin mb-6" />
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Transify.</h2>
        <p className="text-slate-400 font-medium mt-2">Chargement de votre univers logistique...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/register/transitaire" element={<TransitaireRegister />} />
      <Route path="/track/:orderId" element={<OrderTracker />} />
      
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

