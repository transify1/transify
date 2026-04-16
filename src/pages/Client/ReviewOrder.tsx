import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { 
  Star, ArrowLeft, CheckCircle2, MessageSquare, 
  Truck, ShieldCheck, DollarSign, Clock, Send,
  Package
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ReviewOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, addReview, user } = useApp();
  
  const order = orders.find(o => o.id === orderId);
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [criteria, setCriteria] = useState({
    speed: 0,
    communication: 0,
    safety: 0,
    price: 0
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
        <Package size={64} className="text-slate-200 mb-6" />
        <h2 className="text-[24px] font-black text-slate-900 mb-4 tracking-tighter">Commande non trouvée</h2>
        <Link to="/client/orders" className="px-8 py-4 bg-apple-blue text-white rounded-[20px] font-black text-[12px] uppercase tracking-widest shadow-xl shadow-blue-500/20">
          Retour à mes commandes
        </Link>
      </div>
    );
  }

  if (order.status !== 'delivered') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50 text-center">
        <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-[32px] flex items-center justify-center mb-8">
          <Clock size={48} />
        </div>
        <h2 className="text-[24px] font-black text-slate-900 mb-2 tracking-tighter">Livraison en attente</h2>
        <p className="text-[13px] text-slate-400 font-black uppercase tracking-widest mb-10 max-w-xs">Vous pourrez évaluer ce service une fois que votre colis aura été livré.</p>
        <Link to="/client/orders" className="px-8 py-4 bg-slate-900 text-white rounded-[20px] font-black text-[12px] uppercase tracking-widest shadow-xl shadow-slate-900/10">
          Retour à mes commandes
        </Link>
      </div>
    );
  }

  if (order.reviewed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[32px] flex items-center justify-center mb-8">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-[24px] font-black text-slate-900 mb-2 tracking-tighter">Avis déjà envoyé</h2>
        <p className="text-[13px] text-slate-400 font-black uppercase tracking-widest mb-10 max-w-xs">Merci d'avoir partagé votre expérience avec nous !</p>
        <Link to="/client/orders" className="px-8 py-4 bg-apple-blue text-white rounded-[20px] font-black text-[12px] uppercase tracking-widest shadow-xl shadow-blue-500/20">
          Retour à mes commandes
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    const review = {
      id: `rev-${Date.now()}`,
      orderId: order.id,
      companyId: order.companyId,
      clientId: user?.id || 'anonymous',
      clientName: user?.name || 'Client',
      rating,
      comment,
      criteria,
      createdAt: new Date().toISOString()
    };

    addReview(review);
    setIsSubmitted(true);
    
    setTimeout(() => {
      navigate('/client/orders');
    }, 3000);
  };

  const renderStars = (current: number, setter: (v: number) => void, hover: number, setHover: (v: number) => void) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setter(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <Star 
            size={32} 
            className={cn(
              "transition-colors",
              (hover || current) >= star ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
            )} 
          />
        </button>
      ))}
    </div>
  );

  const criteriaList = [
    { id: 'speed', label: 'Rapidité', icon: <Clock size={16} /> },
    { id: 'communication', label: 'Communication', icon: <MessageSquare size={16} /> },
    { id: 'safety', label: 'Sécurité du colis', icon: <ShieldCheck size={16} /> },
    { id: 'price', label: 'Rapport Prix/Qualité', icon: <DollarSign size={16} /> },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 fluid-bg">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm apple-card"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[24px] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Merci pour votre avis !</h2>
          <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-8">
            Votre évaluation a été enregistrée avec succès. Elle aide la communauté à choisir les meilleurs transitaires.
          </p>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3 }}
              className="h-full bg-apple-blue shadow-[0_0_10px_rgba(0,113,227,0.5)]"
            />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Redirection vers vos commandes...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 fluid-bg">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-slate-50 rounded-[12px] transition-all text-slate-600">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-[17px] font-black tracking-tighter text-slate-900">Évaluer le service</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 lg:p-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="apple-card !p-0 !rounded-[28px] overflow-hidden"
        >
          <div className="p-8 border-b border-slate-50 bg-slate-900 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/10 rounded-[14px] flex items-center justify-center">
                <Package size={24} className="text-apple-blue" />
              </div>
              <div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-0.5">Commande {order.trackingNumber}</p>
                <h2 className="text-[20px] font-black tracking-tighter">{order.companyName}</h2>
              </div>
            </div>
            <p className="text-white/60 text-[13px] font-black uppercase tracking-widest">
              Votre colis a été livré. Comment s'est passée votre expérience ?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {/* Global Rating */}
            <section className="text-center py-4">
              <h3 className="text-[16px] font-black text-slate-900 mb-6 tracking-tight">Note globale <span className="text-red-500">*</span></h3>
              <div className="flex justify-center">
                {renderStars(rating, setRating, hoverRating, setHoverRating)}
              </div>
              {rating > 0 && (
                <p className="mt-6 text-[10px] font-black text-apple-blue uppercase tracking-widest">
                  {rating === 5 ? 'Excellent !' : rating === 4 ? 'Très bien' : rating === 3 ? 'Correct' : rating === 2 ? 'Moyen' : 'Décevant'}
                </p>
              )}
            </section>

            {/* Detailed Criteria */}
            <section className="space-y-6">
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3">Critères détaillés</h3>
              <div className="grid sm:grid-cols-2 gap-8">
                {criteriaList.map((item) => (
                  <div key={item.id} className="space-y-3">
                    <div className="flex items-center gap-2.5 text-slate-900">
                      <span className="text-apple-blue">{item.icon}</span>
                      <span className="text-[13px] font-black uppercase tracking-widest">{item.label}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setCriteria(prev => ({ ...prev, [item.id]: s }))}
                          className={cn(
                            "w-9 h-9 rounded-[10px] flex items-center justify-center text-[11px] font-black transition-all",
                            criteria[item.id as keyof typeof criteria] >= s 
                              ? "bg-apple-blue text-white shadow-xl shadow-blue-500/20" 
                              : "bg-slate-50 text-slate-300 hover:bg-slate-100"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Comment */}
            <section className="space-y-4">
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3">Votre commentaire</h3>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Racontez-nous comment s'est déroulée votre livraison..."
                className="w-full h-40 p-5 bg-slate-50 border-none rounded-[24px] focus:ring-2 focus:ring-apple-blue transition-all text-[14px] font-black tracking-tight resize-none"
              />
            </section>

            <button 
              type="submit"
              disabled={rating === 0}
              className="w-full py-4 bg-apple-blue text-white rounded-[20px] flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none transition-all hover:bg-blue-700"
            >
              <span className="text-[11px] font-black uppercase tracking-widest">Envoyer l'avis</span>
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
