import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Search, MessageSquare, ChevronRight, 
  CheckCircle2, Zap, Plus, User
} from 'lucide-react';
import TransitaireSidebar from '../../components/Transitaire/Sidebar';
import { cn } from '../../lib/utils';

export default function TransitaireMessages() {
  const { user, messages, orders } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // For transitaire, we need to find all clients they have chatted with
  // or who have orders with them
  const clientIds = Array.from(new Set([
    ...messages.filter(m => m.senderId === user?.companyId || m.receiverId === user?.companyId)
      .map(m => m.senderId === user?.companyId ? m.receiverId : m.senderId),
    ...orders.filter(o => o.companyId === user?.companyId).map(o => o.clientId)
  ]));

  const conversations = clientIds.map(clientId => {
    const clientMessages = messages.filter(m => 
      (m.senderId === clientId && m.receiverId === user?.companyId) || 
      (m.senderId === user?.companyId && m.receiverId === clientId)
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const lastMessage = clientMessages[0];
    const unreadCount = clientMessages.filter(m => m.receiverId === user?.companyId && !m.read).length;
    
    // Find client name from orders or messages
    const clientName = orders.find(o => o.clientId === clientId)?.clientName || 
                      clientMessages.find(m => m.senderId === clientId)?.senderName || 
                      "Client Inconnu";

    return {
      clientId,
      clientName,
      lastMessage,
      unreadCount,
      timestamp: lastMessage ? new Date(lastMessage.timestamp).getTime() : 0
    };
  }).filter(conv => conv.lastMessage || searchQuery)
    .filter(conv => conv.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="min-h-screen bg-white fluid-bg">
      <TransitaireSidebar />
      
      <main className="lg:ml-72 p-4 lg:p-8 max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1>Centre de Messages</h1>
            <p className="text-secondary">Gérez vos communications avec vos clients.</p>
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
            placeholder="Rechercher un client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-medium text-[13px]"
          />
        </div>

        {/* Conversations List */}
        <div className="space-y-2">
          {conversations.length > 0 ? conversations.map((conv) => (
            <motion.div
              key={conv.clientId}
              whileHover={{ x: 2 }}
              onClick={() => navigate(`/transitaire/chat/${conv.clientId}`)}
              className={cn(
                "apple-card p-4 flex items-center gap-4 group cursor-pointer",
                conv.unreadCount > 0 ? "bg-blue-50/30 border-apple-blue/10" : ""
              )}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-slate-100 rounded-[10px] flex items-center justify-center text-slate-400">
                  <User size={20} />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h3 className="font-bold text-slate-900 truncate text-[14px]">{conv.clientName}</h3>
                  {conv.lastMessage && (
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p className={cn(
                    "text-[13px] truncate",
                    conv.unreadCount > 0 ? "text-slate-900 font-bold" : "text-slate-500 font-medium"
                  )}>
                    {conv.lastMessage ? conv.lastMessage.content : "Aucun message pour le moment"}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-apple-blue text-white text-[10px] font-bold rounded-full">
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
              <p className="font-bold text-slate-400 text-[13px]">Aucune conversation trouvée</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
