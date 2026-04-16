import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Search, MessageSquare, ChevronRight, 
  Clock, CheckCircle2, Home, Package, 
  User, Zap, Plus
} from 'lucide-react';
import { cn } from '../../lib/utils';

import ClientSidebar from '../../components/Client/Sidebar';

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 lg:hidden">
    <Link to="/client/dashboard" className="flex flex-col items-center gap-1 text-slate-400">
      <Home size={22} strokeWidth={2} />
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
    <Link to="/client/messages" className="flex flex-col items-center gap-1 text-blue-600">
      <MessageSquare size={22} strokeWidth={2.5} />
      <span className="text-[11px] font-medium">Messages</span>
    </Link>
    <Link to="/client/profile" className="flex flex-col items-center gap-1 text-slate-400">
      <User size={22} strokeWidth={2} />
      <span className="text-[11px] font-medium">Profil</span>
    </Link>
  </nav>
);

export default function ClientMessages() {
  const { user, messages, companies } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Group messages by conversation (with companies)
  const conversations = companies.map(company => {
    const companyMessages = messages.filter(m => 
      (m.senderId === company.id && m.receiverId === user?.id) || 
      (m.senderId === user?.id && m.receiverId === company.id)
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const lastMessage = companyMessages[0];
    const unreadCount = companyMessages.filter(m => m.senderId === company.id && !m.read).length;

    return {
      company,
      lastMessage,
      unreadCount,
      timestamp: lastMessage ? new Date(lastMessage.timestamp).getTime() : 0
    };
  }).filter(conv => conv.lastMessage || searchQuery) // Show only if there's a message or if searching
    .filter(conv => conv.company.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0 fluid-bg">
      <ClientSidebar />

      <main className="lg:ml-72 p-4 lg:p-8 max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Messages</h1>
            <p className="text-[15px] text-slate-500 font-normal">Discutez avec vos transitaires en temps réel.</p>
          </div>
          <button className="p-2.5 bg-apple-blue text-white rounded-[10px] shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
            <Plus size={20} />
          </button>
        </header>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Rechercher un transitaire..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-medium text-[15px]"
          />
        </div>

        {/* Conversations List */}
        <div className="space-y-2">
          {conversations.length > 0 ? conversations.map((conv) => (
            <motion.div
              key={conv.company.id}
              whileHover={{ x: 2 }}
              onClick={() => navigate(`/client/chat/${conv.company.id}`)}
              className={cn(
                "apple-card p-4 flex items-center gap-4 group cursor-pointer",
                conv.unreadCount > 0 ? "bg-blue-50/30 border-apple-blue/10" : ""
              )}
            >
              <div className="relative">
                <img 
                  src={conv.company.logo} 
                  alt={conv.company.name} 
                  className="w-12 h-12 rounded-[10px] object-cover shadow-sm"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 truncate text-[16px]">{conv.company.name}</h3>
                    {conv.company.verified && <CheckCircle2 size={12} className="text-apple-blue" />}
                  </div>
                  {conv.lastMessage && (
                    <span className="text-[12px] font-medium text-slate-400">
                      {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p className={cn(
                    "text-[15px] truncate",
                    conv.unreadCount > 0 ? "text-slate-900 font-bold" : "text-slate-500 font-medium"
                  )}>
                    {conv.lastMessage ? conv.lastMessage.content : "Aucun message pour le moment"}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-apple-blue text-white text-[12px] font-medium rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight className="text-slate-300 group-hover:text-apple-blue transition-colors" size={16} />
            </motion.div>
          )) : (
            <div className="py-12 text-center apple-card border-dashed">
              <MessageSquare size={32} className="mx-auto text-slate-200 mb-3" />
              <p className="font-medium text-slate-500 text-[15px]">Aucune conversation trouvée</p>
              <Link to="/client/explorer" className="mt-3 inline-block text-apple-blue font-medium text-[14px]">
                Explorer les transitaires
              </Link>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
