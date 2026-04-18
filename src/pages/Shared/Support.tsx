import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { formatDate, cn } from '../../lib/utils';
import { 
  HelpCircle, Search, MessageSquare, Phone, 
  Mail, ChevronRight, ArrowLeft, Package,
  Plus, CheckCircle2, Clock, AlertCircle, X, Home, Package as PackageIcon, User as UserIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Support() {
  const { tickets, addTicket, addNotification, user } = useApp();
  const navigate = useNavigate();
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

  const getFaqs = () => {
    if (user?.role === 'transitaire') {
      return [
        { q: "Comment ajouter un nouveau colis ?", a: "Allez dans 'Commandes' et cliquez sur 'Ajouter un colis'. Vous pouvez aussi scanner le QR code d'un client." },
        { q: "Comment créer une expédition (Groupage) ?", a: "Rendez-vous dans 'Expéditions', créez un voyage (air/mer) et ajoutez-y les colis reçus." },
        { q: "Comment modifier mes tarifs ?", a: "Allez dans 'Ma Boutique' > 'Services' pour activer/désactiver et changer vos prix au kg/CBM." },
        { q: "Mon compte n'est pas vérifié ?", a: "La vérification nécessite l'envoi de vos documents officiels. Contactez-nous via un ticket support." },
      ];
    }
    return [
      { q: "Comment suivre mon colis ?", a: "Vous pouvez suivre votre colis en temps réel dans l'onglet 'Mes expéditions' en cliquant sur le colis concerné." },
      { q: "Comment payer mon expédition ?", a: "Le paiement s'effectue généralement à la réception du colis, ou en ligne via Mobile Money selon le transitaire." },
      { q: "Que faire si mon colis est en retard ?", a: "Contactez directement votre transitaire via le bouton d'appel ou de message dans les détails de votre commande." },
      { q: "Comment contacter le transitaire ?", a: "Chaque transitaire a un profil avec ses coordonnées directes et un chat intégré." },
    ];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-600';
      case 'in_progress': return 'bg-yellow-100 text-yellow-600';
      case 'problem': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const backPath = user?.role === 'transitaire' ? '/transitaire/dashboard' : '/client/dashboard';

  return (
    <div className="min-h-screen bg-white pb-24 fluid-bg">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-[10px] transition-all">
            <ArrowLeft size={18} />
          </button>
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
            MES TICKETS
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'faq' ? (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h2 className="text-[20px] font-bold text-slate-900 mb-6">Questions Fréquentes</h2>
              {getFaqs().map((faq, i) => (
                <div key={i} className="p-5 rounded-[20px] bg-slate-50 border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-[14px] text-slate-500 leading-relaxed font-medium">{faq.a}</p>
                </div>
              ))}

              <div className="mt-12 p-8 rounded-[32px] bg-apple-blue text-white text-center">
                <HelpCircle size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-[20px] font-bold mb-2">Besoin d'aide personnalisée ?</h3>
                <p className="text-white/70 text-[14px] mb-6">Nos agents sont disponibles pour répondre à vos questions techniques ou logistiques.</p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setActiveTab('tickets')}
                    className="w-full py-4 bg-white text-apple-blue rounded-[16px] font-bold text-[15px]"
                  >
                    Ouvrir un ticket
                  </button>
                  <a href="https://wa.me/2210000000" className="w-full py-4 bg-green-500 text-white rounded-[16px] font-bold text-[15px] flex items-center justify-center gap-2">
                    <MessageSquare size={18} /> WhatsApp Support
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tickets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[20px] font-bold text-slate-900">Assistance Technique</h2>
                <button 
                  onClick={() => setShowNewTicket(true)}
                  className="p-2 bg-slate-100 rounded-full text-apple-blue"
                >
                  <Plus size={20} />
                </button>
              </div>

              {tickets.length > 0 ? (
                <div className="space-y-3">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="apple-card p-5 !rounded-[24px]">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">#{ticket.id.slice(0, 8)} • {ticket.category}</p>
                          <h4 className="font-bold text-slate-900">{ticket.subject}</h4>
                        </div>
                        <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", getStatusColor(ticket.status))}>
                          {ticket.status === 'open' ? 'En attente' : ticket.status === 'in_progress' ? 'En cours' : 'Résolu'}
                        </span>
                      </div>
                      <p className="text-[14px] text-slate-500 line-clamp-2 font-medium mb-3">{ticket.content}</p>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                        <span className="text-[11px] text-slate-400 font-medium">{formatDate(ticket.createdAt)}</span>
                        <ChevronRight size={14} className="text-slate-300" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm border border-slate-100">
                    <MessageSquare size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900">Aucun ticket</h3>
                  <p className="text-slate-500 text-[14px] mt-1">Vous n'avez pas encore de demande en cours.</p>
                  <button 
                    onClick={() => setShowNewTicket(true)}
                    className="mt-6 text-apple-blue font-bold text-[14px]"
                  >
                    Créer mon premier ticket
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewTicket && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewTicket(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[22px] font-bold text-slate-900">Nouveau Ticket</h2>
                  <button onClick={() => setShowNewTicket(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-2">Sujet</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Problème de suivi..."
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-[16px] focus:ring-2 focus:ring-apple-blue transition-all"
                      value={newTicket.subject}
                      onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-2">Catégorie</label>
                    <select 
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-[16px] focus:ring-2 focus:ring-apple-blue transition-all"
                      value={newTicket.category}
                      onChange={e => setNewTicket({...newTicket, category: e.target.value})}
                    >
                      <option value="general">Général</option>
                      <option value="billing">Paiements & Facturation</option>
                      <option value="technical">Problème Technique</option>
                      <option value="logistics">Logistique & Délais</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-2">Description</label>
                    <textarea 
                      rows={4}
                      placeholder="Détaillez votre demande ici..."
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-[16px] focus:ring-2 focus:ring-apple-blue transition-all resize-none"
                      value={newTicket.content}
                      onChange={e => setNewTicket({...newTicket, content: e.target.value})}
                    />
                  </div>

                  <button 
                    onClick={handleCreateTicket}
                    disabled={isSubmitting || !newTicket.subject || !newTicket.content}
                    className="w-full py-4 bg-slate-900 text-white rounded-[18px] font-bold text-[15px] hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Envoyer la demande'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);
