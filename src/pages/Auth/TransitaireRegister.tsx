import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, User, Building2, Mail, Lock, Phone, 
  Globe, Upload, Plane, Ship, Truck, ShieldCheck, 
  CheckCircle2, ArrowRight, ArrowLeft, Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Logo from '../../components/Logo';

type Step = 1 | 2 | 3 | 4;

export default function TransitaireRegister() {
  const { setUser } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    managerName: '',
    phone: '',
    email: '',
    password: '',
    services: [] as string[],
    countries: [] as string[],
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 4) as Step);
  const prevStep = () => setStep((s) => Math.max(s - 1, 1) as Step);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: 't' + Date.now(),
      name: formData.managerName,
      email: formData.email,
      role: 'transitaire',
      companyId: 'c' + Date.now(),
      profileProgress: 20 // Initial progress after registration
    });
    navigate('/transitaire/dashboard');
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service) 
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-apple-blue selection:text-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-50 rounded-full blur-[120px] opacity-60" />
      </div>

      {/* Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <Link to="/" className="hover:scale-105 transition-transform active:scale-95 block">
          <Logo size={56} />
        </Link>
      </motion.div>

      <div className="max-w-md w-full">
        {/* Progress Bar */}
        <div className="mb-10 flex gap-3 px-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${i <= step ? 'bg-apple-blue shadow-lg shadow-blue-500/20' : 'bg-slate-100'}`} 
            />
          ))}
        </div>

        {/* Form Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-[48px] shadow-2xl shadow-slate-200/60 p-10 md:p-12 border border-slate-100/50 relative"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Entreprise.</h2>
                  <p className="text-slate-400 font-medium mt-2">Dites-nous en plus sur votre société.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Nom de l'entreprise</label>
                    <div className="relative group">
                      <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-apple-blue transition-colors" size={18} />
                      <input 
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-2 focus:ring-apple-blue/10 focus:bg-white focus:border-apple-blue transition-all outline-none text-[15px] font-medium"
                        placeholder="Ex: Global Logistics"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Pays d'opération</label>
                    <div className="relative group">
                      <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-apple-blue transition-colors" size={18} />
                      <input 
                        type="text"
                        required
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-2 focus:ring-apple-blue/10 focus:bg-white focus:border-apple-blue transition-all outline-none text-[15px] font-medium"
                        placeholder="Ex: Sénégal, Côte d'Ivoire"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={nextStep}
                  className="w-full py-5 bg-apple-blue text-white rounded-[24px] font-black text-[13px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/25 flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95 mt-4"
                >
                  Continuer <ArrowRight size={20} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Responsable.</h2>
                  <p className="text-slate-400 font-medium mt-2">Qui gérera ce compte ?</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Nom complet</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-apple-blue transition-colors" size={18} />
                      <input 
                        type="text"
                        required
                        value={formData.managerName}
                        onChange={(e) => setFormData({...formData, managerName: e.target.value})}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-2 focus:ring-apple-blue/10 focus:bg-white focus:border-apple-blue transition-all outline-none text-[15px] font-medium"
                        placeholder="Jean Dupont"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Téléphone</label>
                    <div className="relative group">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-apple-blue transition-colors" size={18} />
                      <input 
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-2 focus:ring-apple-blue/10 focus:bg-white focus:border-apple-blue transition-all outline-none text-[15px] font-medium"
                        placeholder="+221 ..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Email professionnel</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-apple-blue transition-colors" size={18} />
                      <input 
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-2 focus:ring-apple-blue/10 focus:bg-white focus:border-apple-blue transition-all outline-none text-[15px] font-medium"
                        placeholder="contact@entreprise.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={prevStep}
                    className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <ArrowLeft size={18} /> Retour
                  </button>
                  <button 
                    onClick={nextStep}
                    className="flex-[2] py-5 bg-apple-blue text-white rounded-[24px] font-black text-[13px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/25 flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95"
                  >
                    Continuer <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Services.</h2>
                  <p className="text-slate-400 font-medium mt-2">Quels types de transport gérez-vous ?</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'maritime', label: 'Maritime', icon: <Ship size={22} />, desc: 'Conteneurs et groupage' },
                    { id: 'aérien', label: 'Aérien', icon: <Plane size={22} />, desc: 'Fret aérien rapide' },
                    { id: 'express', label: 'Express', icon: <Zap size={22} />, desc: 'Livraison porte-à-porte' },
                  ].map((service) => (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`p-6 rounded-[28px] border-2 transition-all text-left flex items-center gap-5 ${formData.services.includes(service.id) ? 'border-apple-blue bg-blue-50/50' : 'border-slate-50 hover:border-blue-100 bg-slate-50/50'}`}
                    >
                      <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0 transition-colors ${formData.services.includes(service.id) ? 'bg-apple-blue text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-300'}`}>
                        {service.icon}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 tracking-tight">{service.label}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">{service.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="space-y-6 pt-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Sécurisez votre compte</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-apple-blue transition-colors" size={18} />
                    <input 
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-2 focus:ring-apple-blue/10 focus:bg-white focus:border-apple-blue transition-all outline-none text-[15px] font-medium"
                      placeholder="Mot de passe"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={prevStep}
                    className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <ArrowLeft size={18} /> Retour
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="flex-[2] py-5 bg-apple-blue text-white rounded-[24px] font-black text-[13px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/25 flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95"
                  >
                    Finaliser <CheckCircle2 size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="mt-10 text-center text-slate-400 font-medium">
          Déjà inscrit ? <Link to="/login" className="text-apple-blue font-black hover:underline ml-1">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
