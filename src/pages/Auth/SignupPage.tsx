import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Globe, Phone, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Logo from '../../components/Logo';
import { WEST_AFRICAN_COUNTRIES } from '../../constants';
import { supabase } from '../../lib/supabase';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [role, setRole] = useState<'client' | 'transitaire'>('client');
  const [country, setCountry] = useState(WEST_AFRICAN_COUNTRIES[0].name);
  const [phoneIndicator, setPhoneIndicator] = useState(WEST_AFRICAN_COUNTRIES[0].indicator);
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (role === 'transitaire') {
      navigate('/register/transitaire', { 
        state: { name, email, password, country, phone, phoneIndicator } 
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          }
        }
      });

      if (authError) throw authError;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            name,
            email,
            role,
            country,
            phone: `${phoneIndicator} ${phone}`,
            profile_progress: 15
          }]);

        if (profileError) throw profileError;

        setIsSuccess(true);
        setTimeout(() => {
          navigate('/client/dashboard');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[480px] w-full"
      >
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-10">
            {/* Header Logo */}
            <div className="flex justify-center mb-6">
              <Logo size={48} />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-[24px] font-bold text-slate-900 mb-2">Créez votre compte Transify</h2>
              <p className="text-slate-500 text-[15px]">Lancez votre logistique en quelques minutes</p>
            </div>

            {/* Role Selector */}
            <div className="flex p-1 bg-[#f1f5f9] rounded-[14px] mb-8">
              <button 
                onClick={() => setRole('client')}
                className={`flex-1 py-3 rounded-[11px] text-[15px] font-medium transition-all ${role === 'client' ? 'bg-white text-[#3b82f6] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Client
              </button>
              <button 
                onClick={() => setRole('transitaire')}
                className={`flex-1 py-3 rounded-[11px] text-[15px] font-medium transition-all ${role === 'transitaire' ? 'bg-white text-[#3b82f6] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Transitaire
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-[12px] text-[14px] font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="block text-[15px] font-medium text-slate-900 mb-2">Nom complet *</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-3.5 bg-[#f1f5f9] border-none rounded-[12px] focus:ring-2 focus:ring-[#3b82f6]/20 focus:bg-white transition-all text-[15px] font-medium placeholder:text-slate-400"
                  placeholder="Ex: Mamadou Diallo"
                />
              </div>

              <div>
                <label className="block text-[15px] font-medium text-slate-900 mb-2">Pays de résidence *</label>
                <div className="relative group">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#3b82f6] transition-colors" size={18} />
                  <select 
                    value={country}
                    onChange={(e) => {
                      const countryName = e.target.value;
                      const c = WEST_AFRICAN_COUNTRIES.find(item => item.name === countryName);
                      setCountry(countryName);
                      if (c) setPhoneIndicator(c.indicator);
                    }}
                    className="w-full pl-12 pr-10 py-3.5 bg-[#f1f5f9] border-none rounded-[12px] focus:ring-2 focus:ring-[#3b82f6]/20 focus:bg-white transition-all text-[15px] font-medium appearance-none"
                  >
                    {WEST_AFRICAN_COUNTRIES.map(c => (
                      <option key={c.code} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <ArrowRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[15px] font-medium text-slate-900 mb-2">Téléphone *</label>
                <div className="flex gap-2">
                  <div className="relative group w-[100px] shrink-0">
                    <select
                      value={phoneIndicator}
                      onChange={(e) => setPhoneIndicator(e.target.value)}
                      className="w-full px-3 py-3.5 bg-[#f1f5f9] border-none rounded-[12px] focus:ring-2 focus:ring-[#3b82f6]/20 focus:bg-white transition-all text-[14px] font-bold appearance-none text-center"
                    >
                      {WEST_AFRICAN_COUNTRIES.map(c => (
                        <option key={c.code} value={c.indicator}>{c.indicator}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative group flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#3b82f6] transition-colors" size={18} />
                    <input 
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-5 py-3.5 bg-[#f1f5f9] border-none rounded-[12px] focus:ring-2 focus:ring-[#3b82f6]/20 focus:bg-white transition-all text-[15px] font-medium placeholder:text-slate-400"
                      placeholder="77 000 00 00"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[15px] font-medium text-slate-900 mb-2">Adresse email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 bg-[#f1f5f9] border-none rounded-[12px] focus:ring-2 focus:ring-[#3b82f6]/20 focus:bg-white transition-all text-[15px] font-medium placeholder:text-slate-400"
                  placeholder="vous@exemple.com"
                />
              </div>

              <div>
                <label className="block text-[15px] font-medium text-slate-900 mb-2">Mot de passe</label>
                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-3.5 bg-[#f1f5f9] border-none rounded-[12px] focus:ring-2 focus:ring-[#3b82f6]/20 focus:bg-white transition-all text-[15px] font-medium placeholder:text-slate-400"
                    placeholder="••••••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[15px] font-medium text-slate-900 mb-2">Confirmer le mot de passe</label>
                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-5 py-3.5 bg-[#f1f5f9] border-none rounded-[12px] focus:ring-2 focus:ring-[#3b82f6]/20 focus:bg-white transition-all text-[15px] font-medium placeholder:text-slate-400"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-5 h-5 rounded-[6px] border-slate-200 text-[#3b82f6] focus:ring-[#3b82f6]/20"
                />
                <label htmlFor="terms" className="text-[14px] text-slate-500">
                  J'accepte les <Link to="#" className="text-[#3b82f6] hover:underline">Conditions d'utilisation</Link>
                </label>
              </div>

              <button 
                type="submit"
                disabled={!acceptTerms || isSubmitting || isSuccess}
                className="w-full py-4 bg-[#3b82f6] text-white rounded-[12px] font-bold text-[16px] hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                  </motion.div>
                ) : isSuccess ? (
                  "Compte créé !"
                ) : (
                  "Créer mon compte gratuit"
                )}
              </button>
            </form>
          </div>

          <div className="bg-[#fcfdfe] border-t border-slate-50 p-6 text-center">
            <p className="text-slate-500 text-[14px]">
              Déjà un compte ? <Link to="/login" className="text-[#3b82f6] font-medium hover:underline ml-1">Se connecter</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
