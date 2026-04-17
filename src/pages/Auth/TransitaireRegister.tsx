import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, User, Building2, Mail, Lock, Phone, 
  Globe, Upload, Plane, Ship, Truck, ShieldCheck, 
  CheckCircle2, ArrowRight, ArrowLeft, Clock, AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import Logo from '../../components/Logo';
import { WEST_AFRICAN_COUNTRIES } from '../../constants';
import { supabase } from '../../lib/supabase';

type Step = 1 | 2 | 3;

export default function TransitaireRegister() {
  const { setUser, addCompany } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state || {};
  const [step, setStep] = useState<Step>(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    managerName: initialData.name || '',
    phone: initialData.phone || '',
    phoneIndicator: initialData.phoneIndicator || WEST_AFRICAN_COUNTRIES[0].indicator,
    email: initialData.email || '',
    password: initialData.password || '',
    services: [] as string[],
    country: initialData.country || WEST_AFRICAN_COUNTRIES[0].name,
  });

  const validateStep = () => {
    setError(null);
    if (step === 1) {
      if (!formData.companyName.trim()) {
        setError("Veuillez entrer le nom de votre entreprise.");
        return false;
      }
      if (!formData.country) {
        setError("Veuillez sélectionner votre pays d'opération.");
        return false;
      }
    } else if (step === 2) {
      if (!formData.managerName.trim()) {
        setError("Veuillez entrer votre nom complet.");
        return false;
      }
      if (!formData.phone.trim()) {
        setError("Veuillez entrer votre numéro de téléphone.");
        return false;
      }
      if (!formData.email.trim()) {
        setError("Veuillez entrer votre email professionnel.");
        return false;
      }
      if (!formData.email.includes('@')) {
        setError("Veuillez entrer un email valide.");
        return false;
      }
    } else if (step === 3) {
      if (formData.services.length === 0) {
        setError("Veuillez sélectionner au moins un service.");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, 3) as Step);
    }
  };
  const prevStep = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 1) as Step);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Sign Up User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.managerName,
            role: 'transitaire',
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create Company
        const newCompanyData = {
          name: formData.companyName,
          logo: `https://ui-avatars.com/api/?name=${formData.companyName}&background=random`,
          banner: 'https://picsum.photos/seed/logistics/1200/400',
          slogan: "Votre partenaire logistique fiable",
          description: `Spécialiste de la logistique et du transport. Pays d'opération : ${formData.country}`,
          address_china: "",
          address_africa: "",
          countries: [formData.country],
          verified: false,
          rating: 0,
          review_count: 0,
          services: formData.services.map(s => ({
            id: 's_' + s + '_' + Date.now(),
            type: s,
            delay: s === 'express' ? '3-5 jours' : s === 'aérien' ? '7-10 jours' : '30-45 jours',
            priceInfo: 'À définir',
            pricePerUnit: 0,
            unit: s === 'maritime' ? 'cbm' : 'kg',
            active: true
          })),
          contact: {
            phone: `${formData.phoneIndicator} ${formData.phone}`,
            whatsapp: `${formData.phoneIndicator} ${formData.phone}`,
            email: formData.email
          },
          locations: {
            africa: true,
            china: true
          },
          gallery: [],
          style: 'minimalist',
          status: 'open',
          show_price: 'full',
          show_reviews: true,
          owner_id: authData.user.id
        };

        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .insert([newCompanyData])
          .select()
          .single();

        if (companyError) throw companyError;

        const companyId = companyData.id;

        // 3. Create Profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            name: formData.managerName,
            email: formData.email,
            role: 'transitaire',
            company_id: companyId,
            country: formData.country,
            phone: `${formData.phoneIndicator} ${formData.phone}`,
            profile_progress: 25
          }]);

        if (profileError) throw profileError;

        // Update local state
        addCompany({
          ...companyData,
          addressChina: "",
          addressAfrica: "",
          reviewCount: 0,
          showTotalPackages: true,
          showPrice: 'full',
          showReviews: true
        } as any);

        setIsSuccess(true);
        setTimeout(() => {
          navigate('/transitaire/dashboard');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
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

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 text-red-500 rounded-2xl flex items-center gap-3 text-[13px] font-medium"
                  >
                    <AlertTriangle size={18} />
                    {error}
                  </motion.div>
                )}

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
                        className={cn(
                          "w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-2 focus:ring-apple-blue/10 focus:bg-white focus:border-apple-blue transition-all outline-none text-[15px] font-medium",
                          error && !formData.companyName && "border-red-200 bg-red-50/30"
                        )}
                        placeholder="Ex: Global Logistics"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Pays de résidence</label>
                    <div className="relative group">
                      <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-apple-blue transition-colors" size={18} />
                      <select 
                        required
                        value={formData.country}
                        onChange={(e) => {
                          const countryName = e.target.value;
                          const country = WEST_AFRICAN_COUNTRIES.find(c => c.name === countryName);
                          setFormData({
                            ...formData, 
                            country: countryName,
                            phoneIndicator: country?.indicator || formData.phoneIndicator
                          });
                        }}
                        className={cn(
                          "w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-2 focus:ring-apple-blue/10 focus:bg-white focus:border-apple-blue transition-all outline-none text-[15px] font-medium appearance-none",
                          error && !formData.country && "border-red-200 bg-red-50/30"
                        )}
                      >
                        {WEST_AFRICAN_COUNTRIES.map(c => (
                          <option key={c.code} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ArrowRight size={16} className="rotate-90" />
                      </div>
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

                {error && (
                  <div className="p-4 bg-red-50 text-red-500 rounded-2xl flex items-center gap-3 text-[13px] font-medium">
                    <AlertTriangle size={18} />
                    {error}
                  </div>
                )}

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
                        className={cn(
                          "w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-2 focus:ring-apple-blue/10 focus:bg-white focus:border-apple-blue transition-all outline-none text-[15px] font-medium",
                          error && !formData.managerName && "border-red-200 bg-red-50/30"
                        )}
                        placeholder="Jean Dupont"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Téléphone</label>
                    <div className="flex gap-3">
                      <div className="relative group w-32">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-apple-blue transition-colors" size={18} />
                        <select
                          value={formData.phoneIndicator}
                          onChange={(e) => setFormData({...formData, phoneIndicator: e.target.value})}
                          className="w-full pl-14 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-2 focus:ring-apple-blue/10 focus:bg-white focus:border-apple-blue transition-all outline-none text-[14px] font-bold appearance-none px-2"
                        >
                          {WEST_AFRICAN_COUNTRIES.map(c => (
                            <option key={c.code} value={c.indicator}>{c.indicator}</option>
                          ))}
                        </select>
                      </div>
                      <div className="relative group flex-1">
                        <input 
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className={cn(
                            "w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-2 focus:ring-apple-blue/10 focus:bg-white focus:border-apple-blue transition-all outline-none text-[15px] font-medium",
                            error && !formData.phone && "border-red-200 bg-red-50/30"
                          )}
                          placeholder="77 000 00 00"
                        />
                      </div>
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
                        className={cn(
                          "w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-2 focus:ring-apple-blue/10 focus:bg-white focus:border-apple-blue transition-all outline-none text-[15px] font-medium",
                          error && (!formData.email || !formData.email.includes('@')) && "border-red-200 bg-red-50/30"
                        )}
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

                {error && (
                  <div className="p-4 bg-red-50 text-red-500 rounded-2xl flex items-center gap-3 text-[13px] font-medium">
                    <AlertTriangle size={18} />
                    {error}
                  </div>
                )}

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
                    disabled={isSubmitting || isSuccess}
                    className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                    <ArrowLeft size={18} /> Retour
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || isSuccess}
                    className="flex-[2] py-5 bg-apple-blue text-white rounded-[24px] font-black text-[13px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/25 flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                  >
                    {isSubmitting ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <Zap size={20} />
                      </motion.div>
                    ) : isSuccess ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <>
                        Finaliser <CheckCircle2 size={18} />
                      </>
                    )}
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
