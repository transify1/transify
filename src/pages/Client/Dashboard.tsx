import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Home, Search, Package, Heart, User, 
  Plus, ArrowRight, Star, CheckCircle2, 
  Clock, Ship, Plane, Zap, MapPin, 
  Bell, Navigation, Info, AlertCircle, MessageSquare,
  TrendingUp, ShieldCheck, Globe2
} from 'lucide-react';
import { formatDate, cn } from '../../lib/utils';

import ClientSidebar from '../../components/Client/Sidebar';

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 lg:hidden">
    <Link to="/client/dashboard" className="flex flex-col items-center gap-1 text-blue-600">
      <Home size={22} strokeWidth={2.5} />
      <span className="text-[11px] font-medium">Accueil</span>
    </Link>
    <Link to="/client/explorer" className="flex flex-col items-center gap-1 text-slate-400">
      <Search size={22} strokeWidth={2} />
      <span className="text-[11px] font-medium">Explorer</span>
    </Link>
    <Link to="/client/orders" className="flex flex-col items-center gap-1 text-slate-400">
      <Package size={22} strokeWidth={2} />
      <span className="text-[11px] font-medium">Colis</span>
    </Link>
    <Link to="/client/messages" className="flex flex-col items-center gap-1 text-slate-400">
      <MessageSquare size={22} strokeWidth={2} />
      <span className="text-[11px] font-medium">Messages</span>
    </Link>
    <Link to="/client/profile" className="flex flex-col items-center gap-1 text-slate-400">
      <User size={22} strokeWidth={2} />
      <span className="text-[11px] font-medium">Profil</span>
    </Link>
  </nav>
);

const TrackingMap = ({ progress, type }: { progress: number, type: 'maritime' | 'aérien' }) => (
  <div className="relative w-full h-48 bg-slate-900 rounded-[12px] overflow-hidden shadow-lg">
    {/* Stylized Map Background */}
    <div className="absolute inset-0 opacity-20">
      <svg width="100%" height="100%" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 250C100 200 200 200 250 250C300 300 400 300 450 250C500 200 600 200 650 250" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M150 100C200 50 300 50 350 100C400 150 500 150 550 100C600 50 700 50 750 100" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
      </svg>
    </div>

    {/* Route Path */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
      <defs>
        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0071e3" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0071e3" />
        </linearGradient>
      </defs>
      <motion.path 
        id="mainRoute"
        d="M100 250C200 150 400 150 500 250C600 350 700 250 750 200" 
        stroke="url(#routeGradient)" 
        strokeWidth="6" 
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      
      <motion.g
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: `${progress}%` }}
        transition={{ duration: 3, ease: "linear", repeat: Infinity }}
        style={{ 
          offsetPath: "path('M100 250C200 150 400 150 500 250C600 350 700 250 750 200')",
        }}
      >
        <circle r="14" fill="#0071e3" className="shadow-lg" />
        <circle r="6" fill="white" />
        <foreignObject x="-12" y="-40" width="24" height="24">
          <div className="text-white">
            {type === 'aérien' ? <Plane size={18} /> : <Ship size={18} />}
          </div>
        </foreignObject>
      </motion.g>
    </svg>

    {/* Labels */}
    <div className="absolute top-4 left-6">
      <p className="text-label text-white/40 mb-0.5">Origine</p>
      <p className="text-white font-semibold text-[16px] tracking-tight">Guangzhou, CN</p>
    </div>

    <div className="absolute bottom-4 right-6 text-right">
      <p className="text-label text-white/40 mb-0.5">Destination</p>
      <p className="text-white font-semibold text-[16px] tracking-tight">Dakar, SN</p>
    </div>

    {/* Progress Badge */}
    <div className="absolute top-4 right-6 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-[10px] border border-white/10">
      <p className="text-label text-white/40 mb-0.5">Progression</p>
      <p className="text-white font-bold text-[18px] tracking-tighter">{progress}%</p>
    </div>
  </div>
);

export default function ClientDashboard() {
  const { user, companies, orders, toggleFavorite, notifications, markNotificationAsRead, markAllNotificationsAsRead, formatPrice, t, sidebarCollapsed } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const activeOrder = orders.find(o => o.status === 'in_transit' || o.status === 'received');
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreviewedOrder = orders.find(o => o.status === 'delivered' && !o.reviewed);

  // Calculate stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const shipmentsThisMonth = orders.filter(o => {
    const date = new Date(o.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'in_transit': return 'bg-apple-blue/10 text-apple-blue';
      case 'received': return 'bg-yellow-100 text-yellow-600';
      case 'problem': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livré';
      case 'in_transit': return 'En transit';
      case 'received': return 'Reçu';
      case 'problem': return 'Problème';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'pending': return 10;
      case 'received': return 35;
      case 'loaded': return 50;
      case 'in_transit': return 75;
      case 'arrived': return 90;
      case 'delivered': return 100;
      default: return 0;
    }
  };

   return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0 fluid-bg">
      <ClientSidebar />

      {/* Main Content */}
      <main className={cn(
        "p-4 lg:p-8 max-w-7xl mx-auto transition-all duration-300",
        sidebarCollapsed ? "lg:ml-24" : "lg:ml-72"
      )}>
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight mb-1">{t('welcome')}, {user?.name.split(' ')[0]}</h1>
            <p className="text-[15px] text-slate-500 font-normal">Statut de vos expéditions</p>
          </div>
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 apple-card !rounded-[12px] text-slate-600 hover:bg-slate-50 transition-all group"
            >
              <Bell size={18} className="group-hover:scale-110 transition-transform" />
              {unreadNotifications > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-[24px] shadow-2xl border border-slate-100 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                      <h3 className="text-[14px] font-bold tracking-tight text-slate-900">Notifications</h3>
                      <button 
                        onClick={() => markAllNotificationsAsRead()}
                        className="text-[12px] font-medium text-apple-blue hover:underline"
                      >
                        Tout lire
                      </button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => markNotificationAsRead(notif.id)}
                            className={cn(
                              "p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative",
                              !notif.read && "bg-blue-50/30"
                            )}
                          >
                            {!notif.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-apple-blue rounded-full" />}
                            <p className="text-[15px] font-bold text-slate-900 tracking-tight mb-0.5">{notif.title}</p>
                            <p className="text-[13px] text-slate-500 font-normal leading-snug mb-1">{notif.content}</p>
                            <p className="text-[11px] font-medium text-slate-400">{formatDate(notif.createdAt)}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center">
                          <Bell className="mx-auto text-slate-100 mb-3" size={32} />
                          <p className="text-[14px] font-medium text-slate-500">Aucune notification</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <div className="w-10 h-10 bg-slate-50 rounded-[12px] overflow-hidden border-2 border-white shadow-md">
              <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            
            {/* Active Shipment - Hero Card */}
            {activeOrder ? (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">{t('active_shipment')}</h2>
                  <Link to={`/client/orders?id=${activeOrder.id}`} className="text-apple-blue font-medium text-[13px] hover:underline flex items-center gap-1.5">
                    Détails <ArrowRight size={12} />
                  </Link>
                </div>
                
                <div className="apple-card space-y-6 group !p-6 md:!p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-apple-blue rounded-[14px] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-[12px] font-medium text-slate-500 mb-0.5">Numéro de suivi</p>
                        <h3 className="text-[20px] font-bold tracking-tight">{activeOrder.trackingNumber}</h3>
                      </div>
                    </div>
                    <div className={cn("px-3 py-1 rounded-full text-[11px] font-medium", getStatusColor(activeOrder.status))}>
                      {getStatusLabel(activeOrder.status)}
                    </div>
                  </div>

                  <TrackingMap progress={getStatusProgress(activeOrder.status)} type={activeOrder.serviceType === 'aérien' ? 'aérien' : 'maritime'} />

                  <div className="grid md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 bg-slate-50/50 rounded-[16px] flex flex-col gap-0.5">
                      <p className="text-[12px] font-medium text-slate-500 mb-0.5">Transport</p>
                      <p className="text-[16px] font-bold capitalize">{activeOrder.serviceType}</p>
                    </div>
                    <div className="p-4 bg-slate-50/50 rounded-[16px] flex flex-col gap-0.5">
                      <p className="text-[12px] font-medium text-slate-500 mb-0.5">Poids / Volume</p>
                      <p className="text-[16px] font-bold">
                        {activeOrder.weight ? `${activeOrder.weight} kg` : activeOrder.cbm ? `${activeOrder.cbm} CBM` : 'N/A'}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50/50 rounded-[16px] flex flex-col gap-0.5">
                      <p className="text-[12px] font-medium text-slate-500 mb-0.5">Arrivée estimée</p>
                      <p className="text-[16px] font-bold">
                        {activeOrder.estimatedArrival ? formatDate(activeOrder.estimatedArrival) : 'En attente'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section>
                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight mb-5">Suivi Actif</h2>
                <div className="apple-card !p-12 flex flex-col items-center justify-center text-center !rounded-[28px] border-2 border-dashed border-slate-100 bg-slate-50/30">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Package size={32} className="text-slate-200" />
                  </div>
                  <h3 className="text-[18px] font-bold text-slate-900 mb-2 tracking-tight">Aucun envoi actif</h3>
                  <p className="text-[14px] text-slate-500 font-normal max-w-[200px] leading-relaxed mb-6">
                    Commencez par créer une nouvelle expédition.
                  </p>
                  <Link to="/client/explorer" className="apple-button-primary !py-3 !px-8 !rounded-[14px] !text-[14px] font-medium">
                    Nouvel Envoi
                  </Link>
                </div>
              </section>
            )}

            {/* Review CTA */}
            {unreviewedOrder && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-yellow-400 rounded-[28px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-yellow-400/20">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-[18px] flex items-center justify-center text-yellow-500 shadow-sm">
                      <Star size={28} fill="currentColor" />
                    </div>
                    <div>
                      <h3 className="text-[20px] font-bold text-slate-900 tracking-tight">Votre avis compte !</h3>
                      <p className="text-[14px] text-slate-900/60 font-normal">Évaluez votre commande {unreviewedOrder.id} pour aider les autres.</p>
                    </div>
                  </div>
                  <Link 
                    to={`/client/review/${unreviewedOrder.id}`}
                    className="w-full md:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-[16px] font-medium text-[14px] hover:bg-slate-800 transition-all text-center"
                  >
                    Évaluer maintenant
                  </Link>
                </div>
              </motion.section>
            )}

            {/* Quick Actions - Bento Style */}
            <section>
              <h2 className="text-[22px] font-bold text-slate-900 tracking-tight mb-5">Actions Rapides</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Link to="/client/explorer" className="apple-card !p-8 flex flex-col items-center justify-center gap-3 group bg-slate-900 text-white border-none relative overflow-hidden !rounded-[24px]">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-apple-blue/20 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-apple-blue/40 transition-all" />
                  <div className="w-12 h-12 bg-white/10 rounded-[14px] flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                    <Plus size={24} />
                  </div>
                  <span className="text-[15px] font-medium relative z-10">{t('new_order')}</span>
                </Link>
                <Link to="/client/orders" className="apple-card !p-8 flex flex-col items-center justify-center gap-3 group !rounded-[24px]">
                  <div className="w-12 h-12 bg-blue-50 text-apple-blue rounded-[14px] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Search size={24} />
                  </div>
                  <span className="text-[15px] font-medium">Suivre</span>
                </Link>
                <Link to="/client/messages" className="apple-card !p-8 flex flex-col items-center justify-center gap-3 group col-span-2 md:col-span-1 !rounded-[24px]">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-[14px] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare size={24} />
                  </div>
                  <span className="text-[15px] font-medium">Messages</span>
                </Link>
              </div>
            </section>

            {/* Recent Orders List */}
            <section>
              <div className="flex justify-between items-end mb-5">
                <div>
                  <h2 className="text-[20px] font-bold text-slate-900 tracking-tight mb-0.5">{t('history')}</h2>
                  <p className="text-[14px] text-slate-500 font-normal">Vos dernières expéditions</p>
                </div>
                <Link to="/client/orders" className="text-apple-blue font-medium text-[13px] hover:underline">Voir tout</Link>
              </div>
              
              <div className="space-y-3">
                {orders.map(order => (
                  <motion.div 
                    key={order.id}
                    whileHover={{ x: 4 }}
                    className="apple-card flex items-center justify-between group cursor-pointer !p-4 !rounded-[18px]"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-11 h-11 rounded-[12px] flex items-center justify-center transition-all group-hover:scale-105",
                        order.serviceId.includes('s2') ? 'bg-blue-50 text-apple-blue' : 'bg-slate-50 text-slate-400'
                      )}>
                        {order.serviceId.includes('s2') ? <Plane size={18} /> : <Ship size={18} />}
                      </div>
                      <div>
                        <h4 className="text-[16px] font-bold mb-0.5 tracking-tight">{order.trackingNumber}</h4>
                        <p className="text-[12px] font-medium text-slate-400">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="hidden md:block text-center">
                      <p className="text-[11px] font-medium text-slate-500 mb-0.5">Destination</p>
                      <p className="font-bold text-[14px] text-slate-900">{order.destination}</p>
                    </div>
 
                    <div className="text-right">
                      <div className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-medium mb-1 inline-block", getStatusColor(order.status))}>
                        {getStatusLabel(order.status)}
                      </div>
                      <p className="text-[16px] font-bold tracking-tight text-slate-900">{formatPrice(order.price || 0)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Stats Card */}
            <div className="apple-card bg-slate-900 text-white border-none relative overflow-hidden group !rounded-[24px] !p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-apple-blue/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-apple-blue/40 transition-all duration-700" />
              <p className="text-[12px] font-medium text-white/50 mb-6">Envois ce mois</p>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-[48px] font-bold tracking-tight">{shipmentsThisMonth}</span>
                <div className="flex items-center gap-1 text-green-400 font-bold mb-2">
                  <TrendingUp size={16} />
                  <span className="text-[14px]">+24%</span>
                </div>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(shipmentsThisMonth / 16) * 100}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-apple-blue shadow-[0_0_15px_rgba(0,113,227,0.5)]" 
                />
              </div>
              <p className="text-[12px] text-white/50 font-medium mt-3">Objectif: 16 envois</p>
            </div>

            {/* Favorites */}
            <section>
              <h2 className="text-[20px] font-bold text-slate-900 tracking-tight mb-5">{t('favorites')}</h2>
              <div className="space-y-3">
                {companies.filter(c => user?.favorites?.includes(c.id)).map(company => (
                  <motion.div 
                    key={company.id}
                    whileHover={{ y: -2 }}
                    className="apple-card flex items-center gap-3 group !p-3 !rounded-[16px]"
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-[10px] p-1 shadow-sm">
                      <img src={company.logo} alt={company.name} className="w-full h-full rounded-[8px] object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[15px] font-bold mb-0.5 tracking-tight">{company.name}</h3>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={10} fill="currentColor" />
                        <span className="text-[12px] font-medium text-slate-900">{company.rating}</span>
                      </div>
                    </div>
                    <Link to={`/client/transitaire/${company.id}`} className="w-8 h-8 bg-slate-50 text-slate-400 rounded-[10px] flex items-center justify-center group-hover:bg-apple-blue group-hover:text-white transition-all shadow-sm">
                      <ArrowRight size={16} />
                    </Link>
                  </motion.div>
                ))}
                {user?.favorites?.length === 0 && (
                  <div className="p-8 bg-slate-50/50 rounded-[20px] text-center border-2 border-dashed border-slate-100">
                    <Heart size={24} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-[13px] font-medium text-slate-500">Aucun favori</p>
                  </div>
                )}
              </div>
            </section>

            {/* Security Banner */}
            <div className="apple-card bg-slate-50/50 border-none relative overflow-hidden group !rounded-[24px] !p-6">
              <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-green-500/5 rounded-full blur-xl" />
              <div className="w-10 h-10 bg-white text-green-600 rounded-[12px] flex items-center justify-center mb-4 shadow-md border border-slate-50 group-hover:scale-110 transition-transform">
                <ShieldCheck size={20} />
              </div>
              <h4 className="text-[16px] font-bold mb-1.5 tracking-tight">Paiements Sécurisés</h4>
              <p className="text-[14px] text-slate-500 font-normal leading-relaxed">
                Toutes vos transactions sont protégées par notre système de cryptage avancé.
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
