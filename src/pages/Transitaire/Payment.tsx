import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, CreditCard, Smartphone, ShieldCheck, 
  Lock, CheckCircle2, AlertCircle, Loader2, ChevronRight
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function TransitairePayment() {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan') || 'pro';
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    phone: '',
    operator: 'Orange Money'
  });

  const plans: Record<string, any> = {
    starter: { name: 'Starter', price: '0 FCFA' },
    pro: { name: 'Pro', price: '14 500 FCFA' }
  };

  const plan = plans[planId] || plans.pro;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Process and navigate
    try {
      // Small artificial delay for UX (perceived security)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const success = Math.random() > 0.02; // Very high success rate for demo
      if (success) {
        navigate(`/transitaire/payment-status?status=success&plan=${planId}`);
      } else {
        navigate(`/transitaire/payment-status?status=error&plan=${planId}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col fluid-bg">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 lg:p-6 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-slate-50 rounded-[12px] transition-all text-slate-400">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight">Paiement sécurisé</h1>
              <p className="text-[12px] text-slate-500 font-normal">Finalisez votre abonnement en toute sécurité</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full">
            <ShieldCheck size={14} />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Sécurisé par SSL</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 lg:p-12 grid lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Payment Form */}
        <div className="lg:col-span-3 space-y-8">
          <section>
            <h3 className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-6">Moyen de paiement</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setPaymentMethod('card')}
                className={cn(
                  "p-6 rounded-[24px] border-2 transition-all flex flex-col items-center gap-3 group relative overflow-hidden",
                  paymentMethod === 'card' 
                    ? "border-apple-blue bg-blue-50/30 text-apple-blue shadow-lg shadow-blue-50" 
                    : "border-white bg-white text-slate-400 hover:border-slate-100"
                )}
              >
                <CreditCard size={28} className={cn("transition-transform duration-300", paymentMethod === 'card' && "scale-110")} />
                <span className="font-medium text-[15px]">Carte Bancaire</span>
                {paymentMethod === 'card' && (
                  <motion.div layoutId="activeMethod" className="absolute top-2 right-2">
                    <CheckCircle2 size={16} className="text-apple-blue" />
                  </motion.div>
                )}
              </button>
              <button 
                onClick={() => setPaymentMethod('mobile')}
                className={cn(
                  "p-6 rounded-[24px] border-2 transition-all flex flex-col items-center gap-3 group relative overflow-hidden",
                  paymentMethod === 'mobile' 
                    ? "border-apple-blue bg-blue-50/30 text-apple-blue shadow-lg shadow-blue-50" 
                    : "border-white bg-white text-slate-400 hover:border-slate-100"
                )}
              >
                <Smartphone size={28} className={cn("transition-transform duration-300", paymentMethod === 'mobile' && "scale-110")} />
                <span className="font-medium text-[15px]">Mobile Money</span>
                {paymentMethod === 'mobile' && (
                  <motion.div layoutId="activeMethod" className="absolute top-2 right-2">
                    <CheckCircle2 size={16} className="text-apple-blue" />
                  </motion.div>
                )}
              </button>
            </div>
          </section>

          <form onSubmit={handlePayment} className="space-y-6">
            <AnimatePresence mode="wait">
              {paymentMethod === 'card' ? (
                <motion.div 
                  key="card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5"
                >
                  <div className="apple-card">
                    <div className="mb-6">
                      <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Numéro de carte</label>
                      <div className="relative">
                        <input 
                          required
                          type="text" 
                          value={formData.cardNumber}
                          onChange={e => setFormData({...formData, cardNumber: e.target.value})}
                          placeholder="0000 0000 0000 0000" 
                          className="w-full px-5 py-4 bg-slate-50 border-none rounded-[16px] focus:ring-2 focus:ring-apple-blue transition-all font-normal text-[15px] tracking-wider" 
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 opacity-70" alt="Visa" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4 opacity-70" alt="Mastercard" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Expiration</label>
                        <input 
                          required type="text" placeholder="MM/YY" 
                          value={formData.expiry}
                          onChange={e => setFormData({...formData, expiry: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border-none rounded-[16px] focus:ring-2 focus:ring-apple-blue transition-all font-normal text-[15px]" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">CVV</label>
                        <input 
                          required type="text" placeholder="123" 
                          value={formData.cvv}
                          onChange={e => setFormData({...formData, cvv: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border-none rounded-[16px] focus:ring-2 focus:ring-apple-blue transition-all font-normal text-[15px]" 
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="mobile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5"
                >
                  <div className="apple-card">
                    <div className="mb-6">
                      <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Opérateur</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Orange Money', 'Wave', 'Free Money', 'MTN Money'].map(op => (
                          <button
                            key={op}
                            type="button"
                            onClick={() => setFormData({...formData, operator: op})}
                            className={cn(
                              "px-3 py-3 rounded-[12px] text-[11px] font-medium uppercase tracking-wider transition-all border-2",
                              formData.operator === op 
                                ? "bg-apple-blue border-apple-blue text-white shadow-md shadow-blue-100" 
                                : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                            )}
                          >
                            {op}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Numéro de téléphone</label>
                      <input 
                        required type="tel" placeholder="+221 77 000 00 00" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-[16px] focus:ring-2 focus:ring-apple-blue transition-all font-normal text-[15px]" 
                      />
                    </div>
                    <div className="mt-6 p-4 bg-blue-50/50 rounded-[16px] border border-blue-100/50 flex gap-3">
                      <AlertCircle size={18} className="text-apple-blue shrink-0" />
                      <p className="text-[12px] text-blue-700 font-medium leading-relaxed">
                        Une demande de confirmation sera envoyée sur votre téléphone. Veuillez valider la transaction avec votre code secret.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              disabled={isProcessing}
              className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-semibold text-[16px] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> 
                  <span className="tracking-tight">Traitement sécurisé...</span>
                </>
              ) : (
                <>
                  <span className="tracking-tight">Confirmer le paiement de {plan.price}</span>
                  <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-center gap-6 text-slate-400">
            <div className="flex items-center gap-2">
              <Lock size={14} />
              <span className="text-[10px] font-semibold uppercase tracking-widest">Cryptage SSL 256-bit</span>
            </div>
            <div className="w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-semibold uppercase tracking-widest">Protection Fraude</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm sticky top-32">
            <h3 className="text-[16px] font-semibold text-slate-900 mb-6 tracking-tight">Résumé de la commande</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[14px] font-medium">Forfait choisi</span>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-[12px] font-semibold text-slate-900">{plan.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[14px] font-medium">Cycle de facturation</span>
                <span className="text-[14px] font-semibold text-slate-900">Mensuel</span>
              </div>
              <div className="h-px bg-slate-50 w-full" />
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold text-slate-900 text-[16px]">Total à payer</span>
                <span className="font-bold text-apple-blue text-[22px]">{plan.price}</span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50">
              <div className="flex gap-3">
                <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">Activation instantanée de vos fonctionnalités Pro</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">Facture détaillée disponible dans votre espace client</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
