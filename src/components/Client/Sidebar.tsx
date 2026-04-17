import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Home, Search, Package, MessageSquare, 
  User, Settings, LogOut, Bell,
  ChevronLeft, ChevronRight, Menu
} from 'lucide-react';
import Logo from '../Logo';
import { cn } from '../../lib/utils';

export default function ClientSidebar() {
  const { logout, user, t, sidebarCollapsed, setSidebarCollapsed, messages } = useApp();
  const location = useLocation();

  const unreadMessagesCount = messages.filter(m => m.receiverId === user?.id && !m.read).length;

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/client/dashboard', icon: <Home size={20} />, label: t('dashboard') },
    { path: '/client/explorer', icon: <Search size={20} />, label: t('explorer') },
    { path: '/client/orders', icon: <Package size={20} />, label: t('orders') },
    { path: '/client/messages', icon: <MessageSquare size={20} />, label: t('messages'), badge: unreadMessagesCount },
  ];

  return (
    <div 
      className={cn(
        "hidden lg:flex fixed left-0 top-0 bottom-0 bg-white/80 backdrop-blur-xl border-r border-slate-100/50 flex-col transition-all duration-300 z-50",
        sidebarCollapsed ? "w-24 p-4" : "w-72 p-8"
      )}
    >
      <div className={cn("mb-12 flex items-center justify-between", sidebarCollapsed ? "flex-col gap-8" : "px-2")}>
        <div className={cn("transition-all", sidebarCollapsed ? "scale-75" : "scale-100")}>
          <Logo size={sidebarCollapsed ? 32 : 40} />
        </div>
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors border border-slate-100 shadow-sm"
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
              "flex items-center gap-4 rounded-[16px] font-medium text-[15px] transition-all group overflow-hidden whitespace-nowrap",
              sidebarCollapsed ? "p-3 justify-center" : "p-3.5",
              isActive(item.path) 
                ? 'bg-apple-blue text-white shadow-xl shadow-blue-500/10' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            )}
            title={sidebarCollapsed ? item.label : ""}
          >
            <div className={cn("transition-transform shrink-0", !sidebarCollapsed && "group-hover:scale-110")}>
              {item.icon}
            </div>
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between flex-1">
                <span className="transition-opacity duration-300 opacity-100">
                  {item.label}
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-lg shadow-red-500/20">
                    {item.badge}
                  </span>
                )}
              </div>
            )}
            {sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
            )}
          </Link>
        ))}
      </nav>

      <div className={cn("pt-8 border-t border-slate-100/50 transition-all", sidebarCollapsed ? "items-center" : "")}>
        <Link 
          to="/client/profile"
          className={cn(
            "flex items-center gap-3 bg-[#1a2b5a] rounded-[20px] shadow-lg hover:bg-[#243b7a] transition-all group overflow-hidden",
            sidebarCollapsed ? "size-14 justify-center mb-6" : "p-4 mb-6 justify-between"
          )}
          title={sidebarCollapsed ? "Mon profil" : ""}
        >
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-[#4a86ff] rounded-[14px] flex items-center justify-center text-white text-sm font-bold shadow-inner shrink-0">
              {user?.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
            </div>
            {!sidebarCollapsed && (
              <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                <p className="font-bold text-[15px] text-white tracking-tight leading-none">{user?.name.split(' ')[0]}</p>
                <p className="text-[11px] font-medium text-blue-200/50 mt-1">
                  Client
                </p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && <Settings size={16} className="text-blue-200/50 group-hover:text-white transition-colors shrink-0" />}
        </Link>
        
        <button 
          onClick={logout}
          className={cn(
            "flex items-center gap-4 text-red-500 hover:bg-red-50 rounded-[16px] font-medium text-[15px] transition-all overflow-hidden whitespace-nowrap",
            sidebarCollapsed ? "p-3 justify-center" : "p-3.5 w-full"
          )}
          title={sidebarCollapsed ? t('logout') : ""}
        >
          <LogOut size={20} className="shrink-0" />
          {!sidebarCollapsed && <span>{t('logout')}</span>}
        </button>
      </div>
    </div>
  );
}
