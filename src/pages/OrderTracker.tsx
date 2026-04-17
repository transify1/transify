import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, AlertCircle, Package, Truck, 
  MapPin, Clock, CheckCircle2, LayoutDashboard,
  ShieldAlert, Lock
} from 'lucide-react';
import { cn, formatDate, formatPrice } from '../lib/utils';

export default function OrderTracker() {
  const { orderId } = useParams();
  const { user, orders, companies, loading } = useApp();
  const navigate = useNavigate();
  const [accessDenied, setAccessDenied] = useState(false);
  const [checking, setChecking] = useState(true);

  const order = orders.find(o => o.id === orderId);
  const company = order ? companies.find(c => c.id === order.companyId) : null;

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // If not logged in, we need to log in first
      navigate(`/login?returnUrl=/track/${orderId}`);
      return;
    }

    if (!order) {
      setChecking(false);
      return;
    }

    // AUTH CHECK: Only a transitaire who owns the company for THIS order can see it.
    // Or the client who placed the order.
    const isTransitaireForOrder = user.role === 'transitaire' && company?.ownerId === user.id;
    const isClientForOrder = user.role === 'client' && order.clientId === user.id;

    if (!isTransitaireForOrder && !isClientForOrder) {
      setAccessDenied(true);
    }
    
    setChecking(false);
  }, [user, order, company, loading, navigate, orderId]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="w-12 h-12 border-4 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
        <Package size={64} className="text-slate-200 mb-6" />
        <h1 className="text-[28px] font-black tracking-tighter text-slate-900 mb-2">Colis introuvable</h1>
        <p className="text-slate-500 mb-8 max-w-sm">
          Nous n'avons pas pu trouver de commande correspondant à cet identifiant.
        </p>
        <Link to="/" className="px-8 py-4 bg-slate-900 text-white rounded-[20px] font-bold text-[13px] uppercase tracking-widest">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[32px] flex items-center justify-center mb-8">
          <ShieldAlert size={48} />
        </div>
        <h1 className="text-[28px] font-black tracking-tighter text-slate-900 mb-2">Accès Refusé</h1>
        <p className="text-slate-500 mb-10 max-w-sm">
          Vous n'avez pas l'autorisation de consulter le contenu de ce QR Code. 
          Seul le transitaire responsable de cette expédition ou le client propriétaire peut y accéder.
        </p>
        <div className="space-y-4 w-full max-w-xs">
          <Link 
            to={user?.role === 'client' ? '/client/dashboard' : '/transitaire/dashboard'} 
            className="block w-full px-8 py-4 bg-slate-900 text-white rounded-[20px] font-bold text-[13px] uppercase tracking-widest"
          >
            Tableau de bord
          </Link>
          <button 
            onClick={() => navigate(-1)}
            className="block w-full px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-[20px] font-bold text-[13px] uppercase tracking-widest"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-apple-blue text-white rounded-[12px] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-[17px] font-bold tracking-tight">Vérification QR Code</h1>
              <p className="text-[11px] text-green-600 font-bold uppercase tracking-wider">Accès Autorisé</p>
            </div>
          </div>
          <button 
            onClick={() => navigate(user.role === 'client' ? '/client/dashboard' : '/transitaire/dashboard')}
            className="p-2.5 bg-slate-50 text-slate-600 rounded-[12px] hover:bg-slate-100 transition-all"
          >
            <LayoutDashboard size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Package size={120} />
          </div>

          <div className="mb-8">
            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4 inline-block">
              Expédition {order.id.substring(0, 8)}
            </span>
            <h2 className="text-[28px] font-black tracking-tight text-slate-900 leading-tight">
              Détails de la <br />Commande
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-[20px]">
              <div className="w-12 h-12 bg-white rounded-[14px] flex items-center justify-center text-apple-blue shadow-sm">
                <Truck size={24} />
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-medium text-slate-400 mb-0.5">Statut Actuel</p>
                <p className="text-[17px] font-bold text-slate-900 capitalize italic italic-status">
                  {order.status.replace('_', ' ')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-white border border-slate-100 rounded-[24px]">
                <p className="text-[12px] font-medium text-slate-400 mb-1">Destinataire</p>
                <p className="font-bold text-slate-900">{order.clientName}</p>
                <p className="text-[12px] text-slate-500 font-medium">{order.clientPhone}</p>
              </div>
              <div className="p-5 bg-white border border-slate-100 rounded-[24px]">
                <p className="text-[12px] font-medium text-slate-400 mb-1">Destination</p>
                <p className="font-bold text-slate-900">{order.destination}</p>
                <p className="text-[12px] text-slate-500 font-medium capitalize">{order.serviceType}</p>
              </div>
            </div>

            <div className="p-6 bg-slate-900 text-white rounded-[24px] shadow-xl shadow-slate-900/10">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[14px] font-medium text-white/50">Montant à régler</p>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                  order.paymentStatus === 'paid' ? "bg-green-500 text-white" : "bg-red-500 text-white"
                )}>
                  {order.paymentStatus === 'paid' ? 'Payé' : 'Non Payé'}
                </div>
              </div>
              <p className="text-[32px] font-black tracking-tighter">{formatPrice(order.price || 0)}</p>
              <div className="h-px bg-white/10 my-4" />
              <div className="flex items-center gap-2 text-white/40 text-[12px]">
                <ShieldCheck size={14} />
                <span>Vérifié par Transify Secure Gateway</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[14px] font-bold text-slate-400 uppercase tracking-widest px-1">Logistique</h3>
              <div className="p-4 bg-white border border-slate-100 rounded-[20px] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-50 rounded-[8px] flex items-center justify-center text-slate-400">
                    <Package size={16} />
                  </div>
                  <span className="text-[14px] font-bold text-slate-600">Poids / Volume</span>
                </div>
                <span className="font-black text-slate-900">
                  {order.serviceType === 'maritime' ? `${order.cbm?.toFixed(3)} CBM` : `${order.weight} kg`}
                </span>
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-[20px] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-50 rounded-[8px] flex items-center justify-center text-slate-400">
                    <Clock size={16} />
                  </div>
                  <span className="text-[14px] font-bold text-slate-600">Délai estimé</span>
                </div>
                <span className="font-black text-slate-900">
                  {order.estimatedArrival ? formatDate(order.estimatedArrival) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 p-6 bg-blue-50/50 rounded-[24px] border border-blue-100 text-center">
          <p className="text-[13px] text-blue-600 font-medium leading-relaxed">
            Cet accès est restreint. Si vous avez scanné ce code par erreur, 
            veuillez ignorer cette page.
          </p>
        </div>
      </main>
    </div>
  );
}
