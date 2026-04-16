import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, XCircle, ArrowRight, 
  Download, MessageSquare, LayoutDashboard,
  Zap, Rocket, Shield
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function TransitairePaymentStatus() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const planId = searchParams.get('plan') || 'pro';
  const { updateSubscription } = useApp();
  const navigate = useNavigate();

  const isSuccess = status === 'success';

  useEffect(() => {
    if (isSuccess) {
      updateSubscription(planId);
    }
  }, [isSuccess, planId, updateSubscription]);

  const plans: Record<string, any> = {
    starter: { name: 'Starter', price: '0 FCFA', icon: <Zap size={48} /> },
    pro: { name: 'Pro', price: '14 500 FCFA', icon: <Rocket size={48} /> },
    enterprise: { name: 'Enterprise', price: '35 000 FCFA', icon: <Shield size={48} /> }
  };

  const plan = plans[planId] || plans.pro;

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-xl w-full bg-white rounded-[48px] p-10 lg:p-16 shadow-2xl text-center"
      >
        {isSuccess ? (
          <>
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[32px] flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={64} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Paiement réussi !</h1>
            <p className="text-slate-500 font-medium mb-10">
              Bienvenue sur Transify {plan.name}. Votre compte a été mis à jour et toutes vos nouvelles fonctionnalités sont activées.
            </p>

            <div className="bg-slate-50 p-8 rounded-[40px] mb-10 text-left">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                  {plan.icon}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Forfait activé</p>
                  <p className="text-lg font-black text-slate-900">{plan.name}</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Montant payé</span>
                <span className="font-bold text-slate-900">{plan.price}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-slate-500 font-medium">Date</span>
                <span className="font-bold text-slate-900">{new Date().toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => navigate('/transitaire/dashboard')}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
              >
                Accéder au panel complet <LayoutDashboard size={22} />
              </button>
              <button className="w-full py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                <Download size={20} /> Télécharger la facture PDF
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[32px] flex items-center justify-center mx-auto mb-8">
              <XCircle size={64} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Paiement échoué !</h1>
            <p className="text-slate-500 font-medium mb-10">
              Nous n'avons pas pu traiter votre transaction. Cela peut être dû à un solde insuffisant ou à une erreur technique de votre banque.
            </p>

            <div className="bg-red-50 p-6 rounded-3xl mb-10 text-left flex gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm shrink-0">
                <XCircle size={20} />
              </div>
              <div>
                <p className="font-bold text-red-900">Erreur de traitement</p>
                <p className="text-sm text-red-700 font-medium">Veuillez vérifier vos informations de paiement ou essayer un autre moyen.</p>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => navigate(`/transitaire/payment?plan=${planId}`)}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-black/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
              >
                Réessayer le paiement <ArrowRight size={22} />
              </button>
              <Link 
                to="/transitaire/support"
                className="w-full py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
              >
                <MessageSquare size={20} /> Contacter le support
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
