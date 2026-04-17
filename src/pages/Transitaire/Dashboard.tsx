import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, Package, Users, Settings, 
  BarChart3, QrCode, Plus, Search, 
  Bell, LogOut, Ship, Plane, Zap,
  TrendingUp, DollarSign, Clock, AlertCircle, CheckCircle2,
  Truck, ArrowRight, ShieldCheck, Activity
} from 'lucide-react';
import { formatPrice, formatDate, cn } from '../../lib/utils';
import TransitaireSidebar from '../../components/Transitaire/Sidebar';

const StatCard = ({ title, value, icon, trend, color, subtitle }: any) => (
  <div className="apple-card flex flex-col justify-between h-full group !p-6 !rounded-[24px]">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("w-10 h-10 rounded-[12px] flex items-center justify-center transition-transform group-hover:scale-110", color)}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      {trend && (
        <div className={cn("flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium", trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600')}>
          <TrendingUp size={10} className={trend < 0 ? 'rotate-180' : ''} />
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div>
      <p className="text-[13px] font-medium text-slate-400 mb-1">{title}</p>
      <h3 className="text-[26px] font-bold tracking-tight mb-0.5">{value}</h3>
      {subtitle && <p className="text-[14px] text-slate-400 font-normal">{subtitle}</p>}
    </div>
  </div>
);

export default function TransitaireDashboard() {
  const { orders, user, companies, notifications, markNotificationAsRead, markAllNotificationsAsRead, sidebarCollapsed } = useApp();
  const [showChecklist, setShowChecklist] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const company = companies.find(c => c.id === user?.companyId);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const checklistItems = [
    { id: 'name', label: 'Nom de l\'entreprise', completed: !!company?.name, path: '/transitaire/shop?tab=identity' },
    { id: 'logo', label: 'Logo professionnel', completed: !!company?.logo && !company.logo.includes('ui-avatars'), path: '/transitaire/shop?tab=identity' },
    { id: 'banner', label: 'Bannière de boutique', completed: !!company?.banner, path: '/transitaire/shop?tab=identity' },
    { id: 'description', label: 'Description détaillée', completed: !!(company?.description && company.description.length > 20), path: '/transitaire/shop?tab=presentation' },
    { id: 'address', label: "Adresses (Chine & Afrique)", completed: !!(company?.addressChina && company?.addressAfrica), path: '/transitaire/shop?tab=contact' },
    { id: 'services', label: "Services d'expédition", completed: !!(company?.services && company.services.filter(s => s.active !== false).length > 0), path: '/transitaire/shop?tab=services' },
    { id: 'contact', label: 'Contact (Email, Phone, WhatsApp)', completed: !!(company?.contact?.phone && company?.contact?.email), path: '/transitaire/shop?tab=contact' },
    { id: 'gallery', label: 'Galerie photos (min. 3)', completed: !!(company?.gallery && company.gallery.length >= 3), path: '/transitaire/shop?tab=presentation' },
    { id: 'locations', label: 'Implantations (Chine/Afrique)', completed: !!(company?.locations?.africa || company?.locations?.china), path: '/transitaire/shop?tab=contact' },
  ];

  const completedCount = checklistItems.filter(item => item.completed).length;
  const progress = Math.round((completedCount / checklistItems.length) * 100);

  return (
    <div className="min-h-screen bg-white fluid-bg">
      <TransitaireSidebar />
      <main className={cn(
        "p-4 lg:p-8 max-w-7xl mx-auto transition-all duration-300",
        sidebarCollapsed ? "lg:ml-24" : "lg:ml-72"
      )}>
        {/* Checklist Modal */}
        <AnimatePresence>
          {showChecklist && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowChecklist(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative z-10 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Votre Profil</h2>
                      <p className="text-[14px] text-slate-500 font-medium">Complétez ces étapes pour être visible.</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-apple-blue font-bold text-[14px]">
                      {progress}%
                    </div>
                  </div>

                  <div className="space-y-3">
                    {checklistItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-[16px] bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center transition-colors",
                            item.completed ? "bg-green-500 text-white" : "bg-slate-200 text-slate-400"
                          )}>
                            {item.completed ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          </div>
                          <span className={cn("text-[14px] font-medium", item.completed ? "text-slate-900" : "text-slate-400")}>
                            {item.label}
                          </span>
                        </div>
                        {!item.completed && (
                          <Link 
                            to={item.path} 
                            className="text-[12px] font-bold text-apple-blue uppercase tracking-widest"
                            onClick={() => setShowChecklist(false)}
                          >
                            Ajouter
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setShowChecklist(false)}
                    className="w-full mt-8 py-4 bg-slate-900 text-white rounded-[18px] font-bold text-[15px] hover:bg-slate-800 transition-all"
                  >
                    Continuer
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-slate-50 rounded-[14px] overflow-hidden border-2 border-white shadow-md">
                <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              {progress === 100 && (
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-apple-blue text-white rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                  <CheckCircle2 size={10} />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-[28px] font-bold text-slate-900 tracking-tight mb-0.5 flex items-center gap-2">
                {user?.name}
                {progress === 100 && <ShieldCheck size={18} className="text-apple-blue" />}
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[14px] font-medium text-green-500">Opérationnel</span>
                </div>
                <span className="text-slate-200 text-sm">•</span>
                <span className="text-[14px] font-medium text-slate-400">Dashboard Pro</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 apple-card !rounded-[12px] text-slate-600 hover:bg-slate-50 transition-all group"
            >
              <Bell size={18} className="group-hover:scale-110 transition-transform" />
              {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>}
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-white rounded-[24px] shadow-2xl border border-slate-100 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                    <button 
                      onClick={() => markAllNotificationsAsRead()}
                      className="text-[12px] text-apple-blue font-medium hover:underline"
                    >
                      Tout marquer comme lu
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto no-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          onClick={() => {
                            if (!notification.read) markNotificationAsRead(notification.id);
                          }}
                          className={cn(
                            "p-4 border-b border-slate-50 last:border-0 cursor-pointer transition-colors",
                            !notification.read ? "bg-blue-50/30" : "hover:bg-slate-50"
                          )}
                        >
                          <div className="flex gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                              notification.type === 'order' ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                            )}>
                              {notification.type === 'order' ? <Package size={14} /> : <Zap size={14} />}
                            </div>
                            <div className="flex-1">
                              <p className="text-[14px] font-semibold text-slate-900 mb-0.5">{notification.title}</p>
                              <p className="text-[13px] text-slate-500 mb-1 leading-tight">{notification.content}</p>
                              <p className="text-[11px] text-slate-400">{formatDate(notification.createdAt)}</p>
                            </div>
                            {!notification.read && <div className="w-2.5 h-2.5 bg-apple-blue rounded-full mt-1.5 shrink-0" />}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell size={32} className="mx-auto text-slate-200 mb-2" />
                        <p className="text-slate-400 text-sm">Aucune notification</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Link to="/transitaire/scanner" className="apple-button-primary !py-2.5 !px-6 !rounded-[14px] flex items-center gap-2 shadow-xl shadow-blue-500/20">
              <QrCode size={18} /> 
              <span className="text-[15px] font-semibold">Scanner QR</span>
            </Link>
          </div>
        </header>

        {/* Profile Completion Banner */}
        <AnimatePresence>
          {progress < 100 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="apple-card mb-10 bg-slate-900 text-white border-none flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative !p-8 !rounded-[28px]"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-apple-blue/20 rounded-full -mr-24 -mt-24 blur-3xl" />
              
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-14 h-14 bg-white/10 text-white rounded-[16px] flex items-center justify-center shrink-0">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <h3 className="text-[20px] font-semibold text-white tracking-tight mb-1">Complétez votre profil ({progress}%)</h3>
                  <p className="text-[15px] text-white/60 font-normal mb-4 max-w-lg">Boutique non visible • Informations manquantes</p>
                  <div className="w-full max-w-xs h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-apple-blue shadow-[0_0_15px_rgba(0,113,227,0.6)]"
                    />
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowChecklist(true)}
                className="apple-button-primary !bg-white !text-slate-900 !shadow-none hover:!bg-slate-100 whitespace-nowrap relative z-10 !py-3 !px-8 !rounded-[16px] !text-[14px] font-medium"
              >
                Compléter le profil
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid - Bento Style */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Colis Actifs" 
            value="124" 
            icon={<Package />} 
            trend={12} 
            color="bg-blue-50 text-apple-blue"
            subtitle="En transit ou reçus"
          />
          <StatCard 
            title="Revenus Mensuels" 
            value="2.4M FCFA" 
            icon={<DollarSign />} 
            trend={8} 
            color="bg-green-50 text-green-600"
            subtitle="Objectif: 3.0M"
          />
          <StatCard 
            title="Délai Moyen" 
            value="8.2 jours" 
            icon={<Clock />} 
            trend={-5} 
            color="bg-orange-50 text-orange-600"
            subtitle="-0.5j vs mois dernier"
          />
          <StatCard 
            title="Satisfaction" 
            value="4.9/5" 
            icon={<Activity />} 
            color="bg-purple-50 text-purple-600"
            subtitle="Basé sur 128 avis"
          />
        </div>

        {/* Charts Section - Moved from Stats */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <div className="apple-card !p-8 !rounded-[28px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Volume d'expédition</h3>
              <div className="flex gap-4">
                <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-apple-blue">
                  <span className="w-2 h-2 bg-apple-blue rounded-full"></span> Aérien
                </span>
                <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-slate-300">
                  <span className="w-2 h-2 bg-slate-300 rounded-full"></span> Maritime
                </span>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-3">
              {[40, 60, 45, 90, 65, 80, 55, 70, 85, 60, 95, 75].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-50 rounded-t-[6px] relative group overflow-hidden" style={{ height: `100%` }}>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className="absolute bottom-0 left-0 w-full bg-apple-blue rounded-t-[6px] group-hover:bg-blue-600 transition-colors"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="apple-card !p-8 !rounded-[28px]">
            <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight mb-8">Répartition par transport</h3>
            <div className="flex items-center justify-center h-64 relative">
              <div className="w-48 h-48 rounded-full border-[20px] border-apple-blue border-r-slate-100 border-b-orange-400 rotate-45 shadow-inner"></div>
              <div className="absolute flex flex-col items-center">
                <span className="text-[28px] font-bold text-slate-900 tracking-tight">65%</span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Aérien</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Aérien</p>
                <p className="text-[16px] font-bold text-apple-blue">65%</p>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Maritime</p>
                <p className="text-[16px] font-bold text-slate-300">25%</p>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Express</p>
                <p className="text-[16px] font-bold text-orange-400">10%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid xl:grid-cols-3 gap-8">
          {/* Recent Shipments Table */}
          <div className="xl:col-span-2 apple-card overflow-hidden !p-0 !rounded-[24px]">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-[20px] font-semibold text-slate-900 tracking-tight">Expéditions Récentes</h2>
              <Link to="/transitaire/orders" className="text-apple-blue font-medium text-[14px] flex items-center gap-1.5">
                Voir tout <ArrowRight size={12} />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[12px] font-medium text-slate-500">ID Colis</th>
                    <th className="px-6 py-4 text-[12px] font-medium text-slate-500">Client</th>
                    <th className="px-6 py-4 text-[12px] font-medium text-slate-500">Transport</th>
                    <th className="px-6 py-4 text-[12px] font-medium text-slate-500">Statut</th>
                    <th className="px-6 py-4 text-[12px] font-medium text-slate-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                      <td className="px-6 py-5">
                        <span className="font-mono text-[14px] font-semibold text-slate-900 tracking-tight">{order.trackingNumber}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-[8px] flex items-center justify-center text-[12px] font-semibold text-slate-500">
                            {order.clientName?.split(' ').map(n => n[0]).join('') || 'JC'}
                          </div>
                          <span className="font-semibold text-[15px] text-slate-900 tracking-tight">{order.clientName || 'Jean Client'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          {order.serviceId.includes('s2') ? <Plane size={14} /> : <Ship size={14} />}
                          <span className="text-[13px] font-medium">{order.serviceId.includes('s2') ? 'Aérien' : 'Maritime'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-2.5 py-0.5 bg-blue-50 text-apple-blue rounded-full text-[12px] font-medium">
                          En transit
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="w-8 h-8 bg-slate-50 text-slate-400 rounded-[8px] flex items-center justify-center group-hover:bg-apple-blue group-hover:text-white transition-all ml-auto">
                          <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar - Quick Actions & Activity */}
          <div className="space-y-8">
            {/* Quick Actions Bento */}
            <div className="apple-card bg-slate-900 text-white border-none !p-8 !rounded-[24px]">
              <h3 className="text-white text-[18px] font-semibold tracking-tight mb-6">Actions Rapides</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-white/5 hover:bg-white/10 rounded-[16px] flex flex-col items-center gap-3 transition-all group">
                  <div className="w-10 h-10 bg-apple-blue/20 text-apple-blue rounded-[10px] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus size={20} />
                  </div>
                  <span className="text-[15px] font-medium">Nouveau Colis</span>
                </button>
                <Link to="/transitaire/shipments" className="p-4 bg-white/5 hover:bg-white/10 rounded-[16px] flex flex-col items-center gap-3 transition-all group">
                  <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-[10px] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Truck size={20} />
                  </div>
                  <span className="text-[15px] font-medium">Expéditions</span>
                </Link>
                <button className="p-4 bg-white/5 hover:bg-white/10 rounded-[16px] flex flex-col items-center gap-3 transition-all group">
                  <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-[10px] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp size={20} />
                  </div>
                  <span className="text-[15px] font-medium">Rapports</span>
                </button>
                <Link to="/transitaire/settings?tab=team" className="p-4 bg-white/5 hover:bg-white/10 rounded-[16px] flex flex-col items-center gap-3 transition-all group">
                  <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-[10px] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users size={20} />
                  </div>
                  <span className="text-[15px] font-medium">Équipe</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="apple-card !p-8 !rounded-[24px]">
              <h3 className="text-[18px] font-semibold tracking-tight mb-6">Activité Récente</h3>
              <div className="space-y-8">
                {[
                  { time: 'Il y a 2 min', text: 'Colis TRX-2026-001 scanné à Guangzhou', icon: <QrCode size={16} />, color: 'bg-blue-50 text-apple-blue' },
                  { time: 'Il y a 15 min', text: 'Nouveau client inscrit: Marie K.', icon: <Users size={16} />, color: 'bg-purple-50 text-purple-600' },
                  { time: 'Il y a 1h', text: 'Paiement reçu pour commande #892', icon: <DollarSign size={16} />, color: 'bg-green-50 text-green-600' }
                ].map((activity, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className={cn("w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", activity.color)}>
                      {activity.icon}
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-slate-900 leading-snug group-hover:text-apple-blue transition-colors tracking-tight">{activity.text}</p>
                      <p className="text-[12px] font-medium text-slate-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 bg-slate-50 text-slate-400 rounded-[16px] font-medium text-[14px] mt-8 hover:bg-slate-100 transition-all">
                Voir tout le journal
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
