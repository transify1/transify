import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, Package, Users, Settings, 
  BarChart3, LogOut, Star, MessageSquare,
  Store, Truck
} from 'lucide-react';
import Logo from '../Logo';

export default function TransitaireSidebar() {
  const { logout, user } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/transitaire/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { path: '/transitaire/orders', icon: <Package size={18} />, label: 'Commandes' },
    { path: '/transitaire/shipments', icon: <Truck size={18} />, label: 'Expéditions' },
    { path: '/transitaire/messages', icon: <MessageSquare size={18} />, label: 'Messages' },
    { path: '/transitaire/shop', icon: <Store size={18} />, label: 'Ma Boutique' },
    { path: '/transitaire/settings', icon: <Settings size={18} />, label: 'Paramètres' },
  ];

  return (
    <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 bg-slate-900 text-white flex-col p-8 z-50">
      <div className="mb-12 px-2">
        <Logo size={40} textColor="text-white" />
      </div>

      <nav className="space-y-1.5 flex-1">
        {menuItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`flex items-center gap-4 p-3.5 rounded-[16px] text-[15px] font-medium transition-all ${isActive(item.path) ? 'bg-apple-blue text-white shadow-xl shadow-blue-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>

      <div className="pt-8 border-t border-white/5">
        <div className="flex items-center gap-4 mb-8 p-2">
          <div className="w-11 h-11 bg-white/10 rounded-[14px] overflow-hidden border-2 border-white/5">
            <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} className="w-full h-full object-cover" alt="Avatar" />
          </div>
          <div>
            <p className="font-semibold text-[15px] tracking-tight">{user?.name}</p>
            <p className="text-[12px] font-medium text-apple-blue mt-0.5">
              {user?.subscription || 'Starter'}
            </p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-4 p-3.5 w-full text-red-400 hover:bg-red-400/10 rounded-[16px] text-[15px] font-medium transition-all"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </div>
  );
}
