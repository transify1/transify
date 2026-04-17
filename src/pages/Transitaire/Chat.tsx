import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, Send, Phone, Info, 
  Package, Truck, MapPin, ChevronRight,
  MoreVertical, Image as ImageIcon, Paperclip,
  CheckCircle2, User, Zap, MessageSquare
} from 'lucide-react';
import TransitaireSidebar from '../../components/Transitaire/Sidebar';
import { cn } from '../../lib/utils';

export default function TransitaireChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, messages, orders, addMessage, markAsRead, sidebarCollapsed } = useApp();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const clientOrders = orders.filter(o => o.clientId === id && o.companyId === user?.companyId);
  const clientName = clientOrders[0]?.clientName || "Client";
  const [showHistory, setShowHistory] = useState(false);
  
  const quickReplies = [
    "Votre colis est arrivé",
    "Confirmation de réception",
    "Merci",
    "Besoin de plus d'infos"
  ];

  const handleNotifyClient = () => {
    const notificationMessage = `Bonjour ${clientName}, nous vous informons que votre colis ${clientOrders[0]?.trackingNumber || ''} progresse normalement. Prochaine étape : En transit international.`;
    setNewMessage(notificationMessage);
  };

  const chatMessages = messages.filter(m => 
    (m.senderId === id && m.receiverId === user?.id) || 
    (m.senderId === user?.id && m.receiverId === id)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(a.timestamp).getTime());

  useEffect(() => {
    if (id) {
      markAsRead(id);
    }
  }, [id, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      receiverId: id || '',
      senderName: user?.name,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text' as const,
      read: false
    };

    addMessage(message);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col h-screen overflow-hidden">
      <TransitaireSidebar />
      
      <div className={cn(
        "flex flex-col h-full overflow-hidden transition-all duration-300",
        sidebarCollapsed ? "lg:ml-24" : "lg:ml-72"
      )}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100/50 p-4 flex items-center justify-between z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-50 rounded-[10px] transition-all text-slate-400"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 bg-slate-100 rounded-[12px] flex items-center justify-center text-slate-400 shadow-sm">
                  <User size={20} />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <h2 className="font-black text-slate-900 text-[14px] leading-tight">{clientName}</h2>
                <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">En ligne</p>
              </div>
            </div>
            <button 
              onClick={handleNotifyClient}
              className="px-3 py-1.5 bg-apple-blue text-white rounded-[10px] text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-1.5 ml-3 shadow-md shadow-blue-50"
            >
              <Zap size={12} fill="currentColor" /> Notifier
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-[10px] transition-all">
              <Phone size={18} />
            </button>
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-[10px] transition-all">
              <MoreVertical size={18} />
            </button>
          </div>
        </header>

        {/* Quick Actions Bar */}
        <div className="bg-white/50 backdrop-blur-md border-b border-slate-100/50 px-6 py-2 flex gap-3 overflow-x-auto no-scrollbar relative">
          {clientOrders.length > 0 && (
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-apple-blue rounded-[10px] text-[9px] font-black uppercase tracking-widest whitespace-nowrap hover:bg-blue-100 transition-all"
            >
              <Package size={12} /> Historique ({clientOrders.length})
            </button>
          )}
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-[10px] text-[9px] font-black uppercase tracking-widest whitespace-nowrap hover:bg-slate-100 transition-all">
            <Truck size={12} /> Statut
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-[10px] text-[9px] font-black uppercase tracking-widest whitespace-nowrap hover:bg-slate-100 transition-all">
            <MapPin size={12} /> Adresse
          </button>

          {/* Order History Dropdown */}
          <AnimatePresence>
            {showHistory && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-6 mt-2 w-72 bg-white/95 backdrop-blur-2xl rounded-[24px] shadow-2xl border border-white/20 z-50 p-3 max-h-80 overflow-y-auto"
              >
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Historique des commandes</h4>
                <div className="space-y-2">
                  {clientOrders.map(order => (
                    <div key={order.id} className="p-2.5 bg-slate-50/50 rounded-[16px] flex items-center justify-between border border-slate-100/50">
                      <div>
                        <p className="text-[11px] font-black text-slate-900">{order.id}</p>
                        <p className="text-[9px] text-slate-500 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-white text-[8px] font-black uppercase rounded-[6px] border border-slate-100 shadow-sm">
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F8F9FB]">
          {chatMessages.length > 0 ? (
            chatMessages.map((msg, idx) => {
              const isMe = msg.senderId === user?.companyId;
              const showDate = idx === 0 || new Date(msg.timestamp).toDateString() !== new Date(chatMessages[idx-1].timestamp).toDateString();

              return (
                <React.Fragment key={msg.id}>
                  {showDate && (
                    <div className="flex justify-center my-2">
                      <span className="px-3 py-0.5 bg-slate-200/40 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-full">
                        {new Date(msg.timestamp).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </span>
                    </div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "flex flex-col max-w-[75%]",
                      isMe ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className={cn(
                      "p-3.5 rounded-[20px] shadow-sm relative",
                      isMe 
                        ? "bg-apple-blue text-white rounded-tr-none shadow-blue-100" 
                        : "bg-white text-slate-700 rounded-tl-none border border-slate-100/50 shadow-slate-100"
                    )}>
                      <p className="text-[13px] font-medium leading-relaxed">{msg.content}</p>
                      <div className={cn(
                        "flex items-center gap-1 mt-1.5",
                        isMe ? "justify-end text-blue-100" : "justify-start text-slate-400"
                      )}>
                        <span className="text-[8px] font-black uppercase tracking-tighter">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && (
                          <CheckCircle2 size={10} className={msg.read ? "text-blue-200" : "text-blue-400"} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                </React.Fragment>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 bg-white rounded-[24px] shadow-sm flex items-center justify-center text-slate-200 mb-5">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-[18px] font-black text-slate-900 mb-1.5 tracking-tight">Nouvelle conversation</h3>
              <p className="text-slate-500 font-medium max-w-[240px] text-[13px]">
                Envoyez un message à {clientName} pour coordonner sa livraison.
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-xl p-6 border-t border-slate-100/50">
          {/* Quick Replies */}
          <div className="max-w-3xl mx-auto mb-4 flex gap-2 overflow-x-auto no-scrollbar">
            {quickReplies.map((reply, i) => (
              <button 
                key={i}
                onClick={() => setNewMessage(reply)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-apple-blue text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-100 transition-all whitespace-nowrap"
              >
                {reply}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-center gap-3">
            <div className="flex gap-1">
              <button type="button" className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-[10px] transition-all">
                <Paperclip size={18} />
              </button>
              <button type="button" className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-[10px] transition-all">
                <ImageIcon size={18} />
              </button>
            </div>
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="w-full px-5 py-3 bg-slate-50 border-none rounded-[16px] focus:ring-2 focus:ring-apple-blue transition-all font-medium text-[13px]"
              />
            </div>
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className={cn(
                "p-3.5 bg-apple-blue text-white rounded-[14px] shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all",
                !newMessage.trim() && "opacity-50 cursor-not-allowed"
              )}
            >
              <Send size={18} fill="currentColor" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
