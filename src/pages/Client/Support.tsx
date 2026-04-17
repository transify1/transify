import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../lib/utils';
import { 
  HelpCircle, Search, MessageSquare, Phone, 
  Mail, ChevronRight, ArrowLeft, Package,
  CreditCard, Shield, User, Zap, Plus,
  CheckCircle2, Clock, AlertCircle, X, Home, Package as PackageIcon, User as UserIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
      <PackageIcon size={22} strokeWidth={2} />
      <span className="text-[11px] font-medium">Colis</span>
    </Link>
    <Link to="/client/messages" className="flex flex-col items-center gap-1 text-slate-400">
      <MessageSquare size={22} strokeWidth={2} />
      <span className="text-[11px] font-medium">Messages</span>
    </Link>
    <Link to="/client/profile" className="flex flex-col items-center gap-1 text-slate-400">
      <UserIcon size={22} strokeWidth={2} />
      <span className="text-[11px] font-medium">Profil</span>
    </Link>
  </nav>
);

export default function ClientSupport() {
  const { tickets, addTicket, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets'>('faq');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newTicket, setNewTicket] = useState({
    subject: '',
    content: '',
    category: 'general',
    priority: 'medium'
  });

  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.content) return;
    
    setIsSubmitting(true);
    try {
      await addTicket(newTicket);
      setShowNewTicket(false);
      setNewTicket({ subject: '', content: '', category: 'general', priority: 'medium' });
      addNotification({
        title: 'Ticket créé',
        content: 'Votre demande de support a été enregistrée.',
        type: 'system'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    { q: "Comment suivre mon colis ?", a: "Vous pouvez suivre votre colis en temps réel dans l'onglet 'Mes expéditions' en cliquant sur le colis concerné." },
    { q: "Comment payer mon expédition ?", a: "Le paiement s'effectue généralement à la réception du colis, ou en ligne via Mobile Money selon le transitaire." },
    { q: "Que faire si mon colis est en retard ?", a: "Contactez directement votre transitaire via le bouton d'appel ou de message dans les détails de votre commande." },
    { q: "Comment contacter le transitaire ?", a: "Chaque transitaire a un profil avec ses coordonnées directes et un chat intégré." },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-600';
      case 'in_progress': return 'bg-yellow-100 text-yellow-600';
      case 'problem': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24 fluid-bg">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/client/dashboard" className="p-2 hover:bg-slate-50 rounded-[10px] transition-all">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-[17px] font-bold tracking-tight">Support & Aide</h1>
        </div>
        <div className="flex border-t border-slate-100">
          <button 
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-3 text-[12px] font-bold transition-all border-b-2 ${activeTab === 'faq' ? 'border-apple-blue text-apple-blue' : 'border-transparent text-slate-400'}`}
          >
            FAQ
          </button>
          <button 
            onClick={() => setActiveTab('tickets')}
            className={`flex-1 py-3 text-[12px] font-bold transition-all border-b-2 ${activeTab === 'tickets' ? 'border-apple-blue text-apple-blue' : 'border-transparent text-slate-400'}`}
          >
            Mes Tickets
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4">
        {activeTab === 'faq' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Search FAQ */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher une question..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-medium text-[13px]"
              />
            </div>

            {/* Quick Contact */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="p-5 bg-apple-blue text-white rounded-[12px] shadow-lg shadow-blue-50 flex flex-col items-center gap-2 hover:bg-blue-700 transition-all">
                <MessageSquare size={24} />
                <span className="font-bold text-[13px]">Chat Direct</span>
              </button>
              <button className="p-5 bg-white text-slate-900 rounded-[12px] border border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:bg-slate-50 transition-all">
                <Phone size={24} className="text-apple-blue" />
                <span className="font-bold text-[13px]">Appeler</span>
              </button>
            </div>

            {/* FAQ Categories */}
            <h3 className="text-[16px] font-bold mb-4">Questions fréquentes</h3>
            <div className="space-y-2 mb-6">
              {faqs.map((faq, i) => (
                <details key={i} className="group bg-white rounded-[12px] border border-slate-100 shadow-sm overflow-hidden">
                  <summary className="p-4 flex items-center justify-between cursor-pointer list-none">
                    <span className="font-bold text-slate-900 text-[13px]">{faq.q}</span>
                    <ChevronRight size={16} className="text-slate-300 group-open:rotate-90 transition-all" />
                  </summary>
                  <div className="px-4 pb-4 text-slate-600 leading-relaxed font-medium text-[12px]">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>

            {/* Contact Info */}
            <div className="bg-slate-900 text-white p-6 rounded-[12px] shadow-xl shadow-slate-200">
              <h3 className="text-[16px] font-bold mb-5 text-white">Besoin d'autre chose ?</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-4 p-3 bg-white/5 rounded-[10px]">
                  <Mail className="text-blue-400" size={18} />
                  <div>
                    <p className="text-label text-slate-400">Email</p>
                    <p className="font-bold text-[13px]">support@transify.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-white/5 rounded-[10px]">
                  <Phone className="text-blue-400" size={18} />
                  <div>
                    <p className="text-label text-slate-400">Téléphone</p>
                    <p className="font-bold text-[13px]">+221 33 800 00 00</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[16px] font-bold">Historique des tickets</h3>
              <button 
                onClick={() => setShowNewTicket(true)}
                className="p-2 bg-apple-blue text-white rounded-[8px] shadow-md shadow-blue-50 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider"
              >
                <Plus size={14} /> Nouveau ticket
              </button>
            </div>

            {tickets.map(ticket => (
              <div key={ticket.id} className="apple-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${getStatusColor(ticket.status)}`}>
                    {ticket.status === 'resolved' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-[13px]">{ticket.subject}</p>
                    <p className="text-label">{ticket.id.substring(0, 8)} • {formatDate(ticket.createdAt)}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            ))}

            <div className="p-6 bg-blue-50 rounded-[12px] border border-blue-100 text-center">
              <AlertCircle size={32} className="mx-auto text-apple-blue mb-2" />
              <h4 className="text-[15px] font-bold text-blue-900 mb-1">Un problème urgent ?</h4>
              <p className="text-blue-700 text-[12px] font-medium mb-5">Nos agents sont disponibles 24/7 pour vous aider avec vos expéditions critiques.</p>
              <button className="px-5 py-2.5 bg-apple-blue text-white rounded-[10px] font-bold shadow-md shadow-blue-100 text-[13px]">
                Lancer le chat en direct
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewTicket(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[20px] p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[18px] font-black tracking-tight">Créer un ticket</h3>
                <button onClick={() => setShowNewTicket(false)} className="p-2 hover:bg-slate-50 rounded-full transition-all">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-label mb-1.5 block">Sujet du problème</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Retard de livraison" 
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-bold text-[13px]" 
                  />
                </div>
                <div>
                  <label className="text-label mb-1.5 block">Description détaillée</label>
                  <textarea 
                    rows={4} 
                    placeholder="Décrivez votre problème ici..." 
                    value={newTicket.content}
                    onChange={(e) => setNewTicket({ ...newTicket, content: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-bold resize-none text-[13px]"
                  ></textarea>
                </div>
                <button 
                  onClick={handleCreateTicket}
                  disabled={isSubmitting || !newTicket.subject || !newTicket.content}
                  className="w-full py-3.5 bg-apple-blue text-white rounded-[10px] font-bold shadow-lg shadow-blue-50 hover:bg-blue-700 transition-all text-[13px] uppercase tracking-wider disabled:opacity-50"
                >
                  {isSubmitting ? 'Envoi...' : 'Envoyer le ticket'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}
