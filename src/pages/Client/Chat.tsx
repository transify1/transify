import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, Send, Phone, Info, 
  Package, Truck, MapPin, ChevronRight,
  MoreVertical, Image as ImageIcon, Paperclip,
  CheckCircle2, Clock, MessageSquare, ChevronUp
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ClientChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, messages, companies, addMessage, markAsRead, orders } = useApp();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const company = companies.find(c => c.id === id);
  const companyOrders = orders.filter(o => o.companyId === id);
  const [showHistory, setShowHistory] = useState(false);
  const [showTrackingMap, setShowTrackingMap] = useState(false);
  
  const quickReplies = [
    "Où en est mon colis ?",
    "Quels sont vos tarifs ?",
    "Merci pour votre aide",
    "J'ai un problème avec ma commande"
  ];

  const chatMessages = messages.filter(m => 
    (m.senderId === company.owner_id && m.receiverId === user?.id) || 
    (m.senderId === user?.id && m.receiverId === company.owner_id)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  useEffect(() => {
    if (company?.owner_id) {
      markAsRead(company.owner_id);
    }
  }, [company?.owner_id, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Transitaire non trouvé</h2>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold">
          Retour
        </button>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !company.owner_id) return;

    const message = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      receiverId: company.owner_id, // Use owner_id instead of company.id
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
    <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 p-4 md:p-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={company.logo} 
                alt={company.name} 
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover shadow-sm"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-black text-slate-900 text-sm md:text-base truncate max-w-[150px] md:max-w-none">
                  {company.name}
                </h2>
                {company.verified && <CheckCircle2 size={14} className="text-blue-600" />}
              </div>
              <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">En ligne</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a 
            href="tel:+221338000000"
            className="p-3 text-slate-400 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all"
          >
            <Phone size={20} />
          </a>
          <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Quick Actions Bar */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex gap-4 overflow-x-auto no-scrollbar relative">
        {companyOrders.length > 0 && (
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap hover:bg-blue-100 transition-all"
          >
            <Package size={14} /> Historique ({companyOrders.length})
          </button>
        )}
        <button 
          onClick={() => setShowTrackingMap(!showTrackingMap)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap hover:bg-slate-100 transition-all"
        >
          <Truck size={14} /> Suivre commande
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap hover:bg-slate-100 transition-all">
          <MapPin size={14} /> Détails livraison
        </button>

        {/* Order History Dropdown */}
        <AnimatePresence>
          {showHistory && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-6 mt-2 w-80 bg-white rounded-3xl shadow-xl border border-slate-100 z-50 p-4 max-h-96 overflow-y-auto"
            >
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Historique des commandes</h4>
              <div className="space-y-3">
                {companyOrders.map(order => (
                  <div key={order.id} className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-black text-slate-900">{order.id}</p>
                      <p className="text-[10px] text-slate-500 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="px-2 py-1 bg-white text-[9px] font-black uppercase rounded-lg border border-slate-100">
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mini Tracking Map */}
        <AnimatePresence>
          {showTrackingMap && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-6 md:left-40 mt-2 w-80 bg-white rounded-3xl shadow-xl border border-slate-100 z-50 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Itinéraire du colis</h4>
                <button onClick={() => setShowTrackingMap(false)} className="text-slate-400 hover:text-slate-600">
                  <ArrowLeft size={14} className="rotate-90" />
                </button>
              </div>
              <div className="relative h-32 bg-slate-100 rounded-2xl overflow-hidden mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-blue-200 relative mx-8">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm" />
                    <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm" />
                    <div className="absolute left-2/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-300 rounded-full border-2 border-white shadow-sm" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-300 rounded-full border-2 border-white shadow-sm" />
                    <motion.div 
                      animate={{ left: '45%' }}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-blue-600"
                    >
                      <Truck size={16} fill="currentColor" />
                    </motion.div>
                  </div>
                </div>
                <div className="absolute bottom-2 left-4 text-[9px] font-black text-slate-400 uppercase">Dubaï</div>
                <div className="absolute bottom-2 right-4 text-[9px] font-black text-slate-400 uppercase">Dakar</div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <p className="text-[11px] font-bold text-slate-600">Reçu au dépôt (Dubaï)</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <p className="text-[11px] font-bold text-slate-900">En transit international</p>
                </div>
                <div className="flex items-center gap-3 opacity-40">
                  <div className="w-2 h-2 bg-slate-300 rounded-full" />
                  <p className="text-[11px] font-bold text-slate-600">Arrivée prévue (Dakar)</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8F9FB]">
        {chatMessages.length > 0 ? (
          chatMessages.map((msg, idx) => {
            const isMe = msg.senderId === user?.id;
            const showDate = idx === 0 || new Date(msg.timestamp).toDateString() !== new Date(chatMessages[idx-1].timestamp).toDateString();

            return (
              <React.Fragment key={msg.id}>
                {showDate && (
                  <div className="flex justify-center">
                    <span className="px-4 py-1 bg-slate-200/50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                      {new Date(msg.timestamp).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                  </div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "flex flex-col max-w-[85%] md:max-w-[70%]",
                    isMe ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "p-4 rounded-[24px] shadow-sm relative",
                    isMe 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                  )}>
                    {!isMe && (
                      <div className="absolute -left-2 top-0 text-slate-200">
                        <ChevronUp size={16} className="rotate-[-45deg]" />
                      </div>
                    )}
                    <p className={cn(
                      "text-sm font-medium leading-relaxed",
                      isMe && "client-message-text"
                    )}>{msg.content}</p>
                    <div className={cn(
                      "flex items-center gap-1 mt-2",
                      isMe ? "justify-end text-blue-100" : "justify-start text-slate-400"
                    )}>
                      <span className="text-[9px] font-bold uppercase">
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
          <div className="h-full flex flex-col items-center justify-center text-center p-12">
            <div className="w-20 h-20 bg-white rounded-[32px] shadow-sm flex items-center justify-center text-slate-200 mb-6">
              <MessageSquare size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Dites bonjour ! 👋</h3>
            <p className="text-slate-500 font-medium max-w-xs">
              Envoyez un message à {company.name} pour poser vos questions ou demander un devis.
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-container p-4 md:p-6 border-t border-slate-100">
        {/* Quick Replies */}
        <div className="max-w-4xl mx-auto mb-4 flex gap-2 overflow-x-auto no-scrollbar">
          {quickReplies.map((reply, i) => (
            <button 
              key={i}
              onClick={() => setNewMessage(reply)}
              className="px-4 py-2 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-500 text-[11px] font-bold rounded-full border border-slate-100 transition-all whitespace-nowrap shadow-sm"
            >
              {reply}
            </button>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 md:gap-4 mb-4">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="w-full px-6 py-4 bg-white border-none rounded-[24px] focus:ring-2 focus:ring-blue-600 transition-all font-medium text-sm shadow-sm"
              />
            </div>
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className={cn(
                "p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all",
                !newMessage.trim() && "opacity-50 cursor-not-allowed"
              )}
            >
              <Send size={20} fill="currentColor" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
              <Paperclip size={16} /> Joindre un fichier
            </button>
            <button type="button" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
              <MessageSquare size={16} /> Réponses rapides
            </button>
          </div>
        </form>
        
        <p className="text-[9px] text-center text-slate-400 font-black mt-4 uppercase tracking-[0.2em]">
          Réponse moyenne : 5 minutes
        </p>
      </div>
    </div>
  );
}
