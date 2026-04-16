import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Logo from '../../components/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'client' | 'transitaire'>('client');
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'transitaire') {
      setUser({ id: 'u2', name: 'Admin Transify', email, role: 'transitaire', companyId: 'c1', subscription: 'pro' });
      navigate('/transitaire/dashboard');
    } else {
      setUser({ id: 'u1', name: 'Jean Client', email, role: 'client', favorites: ['c1'] });
      navigate('/client/dashboard');
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
          <div className="p-8 md:p-12">
            {/* Header Logo */}
            <div className="flex justify-center mb-8">
              <Logo size={48} />
            </div>

            <div className="text-center mb-10">
              <h2 className="text-[24px] font-bold text-slate-900 mb-2">Bon retour sur Transify</h2>
              <p className="text-slate-500 text-[15px]">Connectez-vous pour accéder à votre dashboard</p>
            </div>

            {/* Role Selector (Sellio style) */}
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

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-[15px] font-medium text-slate-900 mb-2.5">Adresse email</label>
                <div className="relative group">
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 bg-[#eff6ff] border-none rounded-[12px] focus:ring-2 focus:ring-[#3b82f6]/20 focus:bg-white transition-all text-[15px] font-medium placeholder:text-slate-400"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <label className="text-[15px] font-medium text-slate-900">Mot de passe</label>
                  <Link to="#" className="text-[13px] font-medium text-[#3b82f6] hover:underline">Mot de passe oublié ?</Link>
                </div>
                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-[#eff6ff] border-none rounded-[12px] focus:ring-2 focus:ring-[#3b82f6]/20 focus:bg-white transition-all text-[15px] font-medium placeholder:text-slate-400"
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

              <button 
                type="submit"
                className="w-full py-4 bg-[#3b82f6] text-white rounded-[12px] font-bold text-[16px] hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] mt-2"
              >
                Se connecter
              </button>
            </form>
          </div>

          <div className="bg-[#fcfdfe] border-t border-slate-50 p-6 text-center">
            <p className="text-slate-500 text-[14px]">
              Pas encore de compte ? <Link to="/signup" className="text-[#3b82f6] font-medium hover:underline ml-1">Créer un compte</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
