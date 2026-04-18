import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, Package, Users, Settings, 
  BarChart3, LogOut, Star, MessageSquare,
  Store, Truck, ChevronLeft, ChevronRight,
  QrCode, HelpCircle
} from 'lucide-react';
import Logo from '../Logo';
import { cn } from '../../lib/utils';

export default function TransitaireSidebar() {
  const { logout, user, sidebarCollapsed, setSidebarCollapsed, messages } = useApp();
  const location = useLocation();

  const unreadMessagesCount = messages.filter(m => m.receiverId === user?.id && !m.read).length;

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/transitaire/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/transitaire/orders', icon: <Package size={20} />, label: 'Commandes' },
    { path: '/transitaire/shipments', icon: <Truck size={20} />, label: 'Expéditions' },
    { path: '/transitaire/messages', icon: <MessageSquare size={20} />, label: 'Messages' },
    { path: '/transitaire/scanner', icon: <QrCode size={20} />, label: 'Scanner QR' },
    { path: '/transitaire/reviews', icon: <Star size={20} />, label: 'Avis Clients' },
    { path: '/transitaire/shop', icon: <Store size={20} />, label: 'Ma Boutique' },
    { path: '/transitaire/support', icon: <HelpCircle size={20} />, label: 'Aide & Support' },
    { path: '/transitaire/settings', icon: <Settings size={20} />, label: 'Paramètres' },
  ];

  return (
    <div 
      className={cn(
        "hidden lg:flex fixed left-0 top-0 bottom-0 bg-slate-900 text-white flex-col transition-all duration-300 z-50 shadow-2xl",
        sidebarCollapsed ? "w-24 p-4" : "w-72 p-8"
      )}
    >
      <div className={cn("mb-12 flex items-center justify-between", sidebarCollapsed ? "flex-col gap-8" : "px-2")}>
        <div className={cn("transition-all", sidebarCollapsed ? "scale-75" : "scale-100")}>
          <Logo size={sidebarCollapsed ? 32 : 40} textColor="text-white" />
        </div>
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-lg transition-all border border-white/5"
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={cn(
              "flex items-center gap-4 rounded-[16px] text-[15px] font-medium transition-all group overflow-hidden whitespace-nowrap",
              sidebarCollapsed ? "p-3 justify-center" : "p-3.5",
              isActive(item.path) 
                ? 'bg-apple-blue text-white shadow-xl shadow-blue-500/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            )}
            title={sidebarCollapsed ? item.label : ""}
          >
            <div className={cn("transition-transform shrink-0", !sidebarCollapsed && "group-hover:scale-110")}>
              {item.icon}
            </div>
            {!sidebarCollapsed && (
              <span className="transition-opacity duration-300 opacity-100">
                {item.label}
              </span>
            )}
            {!sidebarCollapsed && item.label === 'Messages' && unreadMessagesCount > 0 && (
              <span className="ml-auto bg-white text-apple-blue text-[11px] font-black px-2 py-0.5 rounded-full ring-2 ring-apple-blue/10">
                {unreadMessagesCount}
              </span>
            )}
            {sidebarCollapsed && item.label === 'Messages' && unreadMessagesCount > 0 && (
              <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full border-2 border-apple-blue flex items-center justify-center">
                <span className="text-[8px] font-black text-apple-blue">{unreadMessagesCount}</span>
              </div>
            )}
          </Link>
        ))}
      </nav>

      <div className={cn("pt-8 border-t border-white/5 transition-all", sidebarCollapsed ? "items-center" : "")}>
        <div className={cn("flex items-center gap-4 mb-8", sidebarCollapsed ? "justify-center" : "p-2")}>
          <div className="w-11 h-11 bg-white/10 rounded-[14px] overflow-hidden border-2 border-white/10 shrink-0">
            <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} className="w-full h-full object-cover" alt="Avatar" />
          </div>
          {!sidebarCollapsed && (
            <div className="whitespace-nowrap overflow-hidden text-ellipsis">
              <p className="font-semibold text-[15px] tracking-tight">{user?.name}</p>
              <p className="text-[12px] font-medium text-apple-blue mt-0.5 uppercase tracking-wider">
                {user?.subscription || 'Starter'}
              </p>
            </div>
          )}
        </div>
        <button 
          onClick={logout}
          className={cn(
            "flex items-center gap-4 text-red-400 hover:bg-red-400/10 rounded-[16px] text-[15px] font-medium transition-all overflow-hidden whitespace-nowrap",
            sidebarCollapsed ? "p-3 justify-center" : "p-3.5 w-full"
          )}
          title={sidebarCollapsed ? "Déconnexion" : ""}
        >
          <LogOut size={20} className="shrink-0" />
          {!sidebarCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
}
