import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Logo from '../../components/Logo';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [role, setRole] = useState<'client' | 'transitaire'>('client');
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'transitaire') {
      navigate('/register/transitaire');
      return;
    }
    setUser({ id: 'u' + Date.now(), name, email, role });
    navigate('/client/dashboard');
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
                disabled={!acceptTerms}
                className="w-full py-4 bg-[#3b82f6] text-white rounded-[12px] font-bold text-[16px] hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer mon compte gratuit
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
