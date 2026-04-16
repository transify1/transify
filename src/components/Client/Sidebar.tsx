import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Home, Search, Package, MessageSquare, 
  User, Settings, LogOut, Bell
} from 'lucide-react';
import Logo from '../Logo';

export default function ClientSidebar() {
  const { logout, user, t } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/client/dashboard', icon: <Home size={18} />, label: t('dashboard') },
    { path: '/client/explorer', icon: <Search size={18} />, label: t('explorer') },
    { path: '/client/orders', icon: <Package size={18} />, label: t('orders') },
    { path: '/client/messages', icon: <MessageSquare size={18} />, label: t('messages') },
  ];

  return (
    <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 bg-white/80 backdrop-blur-xl border-r border-slate-100/50 flex-col p-8 z-50">
      <div className="mb-12 px-2">
        <Logo size={40} />
      </div>

      <nav className="space-y-1.5 flex-1">
        {menuItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`flex items-center gap-4 p-3.5 rounded-[16px] font-medium text-[15px] transition-all ${isActive(item.path) ? 'bg-apple-blue text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>

      <div className="pt-8 border-t border-slate-100/50">
        <Link 
          to="/client/profile"
          className="flex items-center justify-between gap-3 p-4 bg-[#1a2b5a] rounded-[20px] mb-6 shadow-lg hover:bg-[#243b7a] transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4a86ff] rounded-[14px] flex items-center justify-center text-white text-sm font-bold shadow-inner">
              {user?.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
            </div>
            <div>
              <p className="font-bold text-[15px] text-white tracking-tight leading-none">{user?.name.split(' ')[0]}</p>
              <p className="text-[11px] font-medium text-blue-200/50 mt-1">
                Client Particulier
              </p>
            </div>
          </div>
          <Settings size={16} className="text-blue-200/50 group-hover:text-white transition-colors" />
        </Link>
        
        <button 
          onClick={logout}
          className="flex items-center gap-4 p-3.5 w-full text-red-500 hover:bg-red-50 rounded-[16px] font-medium text-[15px] transition-all"
        >
          <LogOut size={18} /> {t('logout')}
        </button>
      </div>
    </div>
  );
}
