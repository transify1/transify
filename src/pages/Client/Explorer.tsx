import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { 
  Search, Filter, Star, CheckCircle2, 
  Ship, Plane, Zap, Heart, ArrowLeft,
  ChevronRight, MapPin, Clock, DollarSign,
  X, SlidersHorizontal, Home, Package, MessageSquare, User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

import ClientSidebar from '../../components/Client/Sidebar';

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 lg:hidden">
    <Link to="/client/dashboard" className="flex flex-col items-center gap-1 text-slate-400">
      <Home size={22} strokeWidth={2} />
      <span className="text-[11px] font-medium">Accueil</span>
    </Link>
    <Link to="/client/explorer" className="flex flex-col items-center gap-1 text-blue-600">
      <Search size={22} strokeWidth={2.5} />
      <span className="text-[11px] font-medium">Explorer</span>
    </Link>
    <Link to="/client/orders" className="flex flex-col items-center gap-1 text-slate-400">
      <Package size={22} strokeWidth={2} />
      <span className="text-[11px] font-medium">Colis</span>
    </Link>
    <Link to="/client/messages" className="flex flex-col items-center gap-1 text-slate-400">
      <MessageSquare size={22} strokeWidth={2} />
      <span className="text-[11px] font-medium">Messages</span>
    </Link>
    <Link to="/client/profile" className="flex flex-col items-center gap-1 text-slate-400">
      <User size={22} strokeWidth={2} />
      <span className="text-[11px] font-medium">Profil</span>
    </Link>
  </nav>
);

export default function Explorer() {
  const { companies, user, toggleFavorite } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Tous');
  const [selectedTransport, setSelectedTransport] = useState('Tous');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         company.countries.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCountry = selectedCountry === 'Tous' || company.countries.includes(selectedCountry);
    const matchesTransport = selectedTransport === 'Tous' || company.services.some(s => s.type === selectedTransport.toLowerCase());
    const matchesRating = company.rating >= minRating;
    return matchesSearch && matchesCountry && matchesTransport && matchesRating;
  });

  const countries = ['Tous', 'Sénégal', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso', 'Guinée'];
  const transports = ['Tous', 'Maritime', 'Aérien', 'Express'];
  const ratings = [0, 3, 4, 4.5];

  const resetFilters = () => {
    setSelectedCountry('Tous');
    setSelectedTransport('Tous');
    setMinRating(0);
  };

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0 fluid-bg">
      <ClientSidebar />
      
      <div className="lg:ml-72">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 pb-2">
            <div className="flex items-center gap-3 mb-4">
              <Link to="/client/dashboard" className="p-2 hover:bg-slate-50 rounded-[10px] transition-all lg:hidden">
                <ArrowLeft size={18} />
              </Link>
              <div className="flex-1 relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-apple-blue transition-colors" size={14} />
                <input 
                  type="text" 
                  placeholder="Rechercher un transitaire, pays..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-[12px] focus:ring-2 focus:ring-apple-blue focus:bg-white transition-all font-medium text-slate-900 text-[15px] placeholder:text-slate-400 shadow-sm"
                />
              </div>
              <button 
                onClick={() => setShowFilters(true)}
                className="p-2.5 bg-slate-50 rounded-[12px] hover:bg-slate-100 transition-all text-slate-600 relative border border-slate-100"
              >
                <SlidersHorizontal size={18} />
                {(selectedCountry !== 'Tous' || selectedTransport !== 'Tous' || minRating > 0) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-apple-blue rounded-full border-2 border-white" />
                )}
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 lg:-mx-0 lg:px-0">
              <div className="flex items-center gap-2">
                {countries.map(c => (
                  <button
                    key={`quick-country-${c}`}
                    onClick={() => setSelectedCountry(c)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all border uppercase tracking-wider",
                      selectedCountry === c 
                        ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="w-px h-6 bg-slate-200 mx-2 self-center" />
              <div className="flex items-center gap-2">
                {transports.map(t => (
                  <button
                    key={`quick-transport-${t}`}
                    onClick={() => setSelectedTransport(t)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all border uppercase tracking-wider",
                      selectedTransport === t 
                        ? "bg-apple-blue text-white border-apple-blue shadow-md" 
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="w-px h-6 bg-slate-200 mx-2 self-center" />
              <div className="flex items-center gap-2">
                {ratings.map(r => (
                  <button
                    key={`quick-rating-${r}`}
                    onClick={() => setMinRating(r)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all border uppercase tracking-wider flex items-center gap-1.5",
                      minRating === r 
                        ? "bg-yellow-500 text-white border-yellow-500 shadow-md" 
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <Star size={10} fill={minRating === r ? "currentColor" : "none"} />
                    {r === 0 ? 'Toutes notes' : `${r}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 lg:p-8">
          {/* Active Filters Display */}
          {(selectedCountry !== 'Tous' || selectedTransport !== 'Tous' || minRating > 0) && (
            <div className="flex flex-wrap items-center gap-2 mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
              <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mr-2">Filtres actifs</span>
              {selectedCountry !== 'Tous' && (
                <span className="px-3 py-1.5 bg-slate-900 text-white rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm">
                  {selectedCountry}
                  <button onClick={() => setSelectedCountry('Tous')} className="hover:text-red-400 transition-colors"><X size={12} /></button>
                </span>
              )}
              {selectedTransport !== 'Tous' && (
                <span className="px-3 py-1.5 bg-apple-blue text-white rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm">
                  {selectedTransport}
                  <button onClick={() => setSelectedTransport('Tous')} className="hover:text-red-400 transition-colors"><X size={12} /></button>
                </span>
              )}
              {minRating > 0 && (
                <span className="px-3 py-1.5 bg-yellow-500 text-white rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm">
                  {minRating}+ Étoiles
                  <button onClick={() => setMinRating(0)} className="hover:text-red-400 transition-colors"><X size={12} /></button>
                </span>
              )}
              <button 
                onClick={resetFilters}
                className="text-apple-blue text-[12px] font-bold uppercase tracking-widest hover:underline ml-2"
              >
                Tout effacer
              </button>
            </div>
          )}

          {/* Recommandations Section */}
          <div className="mb-10">
            <div className="flex justify-between items-end mb-5">
              <div>
                <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Recommandés</h2>
                <p className="text-[15px] text-slate-500 font-normal">Les meilleurs transitaires</p>
              </div>
              <button className="text-apple-blue font-medium text-[14px] hover:underline">Voir tout</button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
              {companies.slice(0, 3).map(company => (
                <motion.div 
                  key={`rec-${company.id}`}
                  whileHover={{ y: -2 }}
                  className="min-w-[260px] bg-slate-900 text-white p-5 rounded-[20px] shadow-xl shadow-slate-200/50 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-apple-blue/20 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-apple-blue/40 transition-all duration-700" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 bg-white rounded-[10px] p-1 shadow-md">
                        <img src={company.logo} className="w-full h-full rounded-[8px] object-cover" alt="" />
                      </div>
                      <div>
                        <h3 className="text-[16px] text-white font-bold mb-0.5 tracking-tight">{company.name}</h3>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star size={10} fill="currentColor" />
                          <span className="text-[12px] font-medium">{company.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {company.services.map(s => (
                        <span key={s.id} className="px-2.5 py-1 bg-white/10 rounded-full text-[11px] font-medium">{s.type}</span>
                      ))}
                    </div>
                    <Link 
                      to={`/client/transitaire/${company.id}`}
                      className="w-full py-2.5 bg-apple-blue rounded-[12px] font-medium text-[14px] hover:bg-blue-700 transition-all text-center block shadow-lg shadow-blue-500/20"
                    >
                      Voir la boutique
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCompanies.length > 0 ? filteredCompanies.map(company => (
              <motion.div 
                key={company.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="apple-card group overflow-hidden !p-0"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-[12px] p-1 shadow-sm group-hover:scale-105 transition-transform duration-500">
                        <img src={company.logo} alt={company.name} className="w-full h-full rounded-[10px] object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h3 className="font-bold text-[16px] text-slate-900 tracking-tight">{company.name}</h3>
                          {company.verified && <CheckCircle2 size={14} className="text-apple-blue" />}
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex text-yellow-500">
                            <Star size={10} fill="currentColor" />
                          </div>
                          <span className="text-[12px] font-medium text-slate-900">{company.rating}</span>
                          <span className="text-[12px] text-slate-500 font-normal">({company.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleFavorite(company.id)}
                      className={cn(
                        "p-2.5 rounded-[12px] transition-all",
                        user?.favorites?.includes(company.id) ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-300 hover:text-red-500'
                      )}
                    >
                      <Heart size={16} fill={user?.favorites?.includes(company.id) ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <p className="text-slate-500 text-[14px] mb-5 line-clamp-2 font-normal leading-relaxed">{company.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="p-3 bg-slate-50 rounded-[14px] flex flex-col gap-0.5">
                        <span className="text-[12px] font-medium text-slate-500">Destinations</span>
                        <span className="text-[15px] font-bold text-slate-900 truncate">{company.countries.join(', ')}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-[14px] flex flex-col gap-0.5">
                        <span className="text-[12px] font-medium text-slate-500">Délai Moyen</span>
                        <span className="text-[15px] font-bold text-slate-900">{company.services[0]?.delay}</span>
                      </div>
                    </div>

                  <div className="flex gap-2 mb-5">
                    {company.services.map(service => (
                      <div key={service.id} className="w-8 h-8 bg-slate-50 rounded-[10px] flex items-center justify-center text-slate-400 group-hover:text-apple-blue transition-colors">
                        {service.type === 'maritime' && <Ship size={14} />}
                        {service.type === 'aérien' && <Plane size={14} />}
                        {service.type === 'express' && <Zap size={14} />}
                      </div>
                    ))}
                  </div>

                  <Link 
                    to={`/client/transitaire/${company.id}`}
                    className="w-full py-3 bg-slate-900 text-white rounded-[14px] font-medium flex items-center justify-center gap-2 group-hover:bg-apple-blue transition-all text-[15px] shadow-lg shadow-slate-100 group-hover:shadow-blue-50"
                  >
                    Voir profil & Commander <ChevronRight size={14} />
                  </Link>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-[20px] flex items-center justify-center mx-auto mb-5">
                  <Search size={28} className="text-slate-200" />
                </div>
                <h3 className="text-[22px] font-bold text-slate-900 mb-1 tracking-tight">Aucun résultat</h3>
                <p className="text-[15px] text-slate-500 font-normal">Essayez de modifier vos filtres</p>
                <button 
                  onClick={resetFilters}
                  className="mt-6 text-apple-blue font-medium text-[14px] hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Filters Modal */}
        <AnimatePresence>
          {showFilters && (
            <div className="fixed inset-0 z-50 flex items-end justify-center">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative w-full max-w-xl bg-white rounded-t-[32px] p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[85vh]"
              >
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-[24px] font-bold tracking-tight">Filtres</h3>
                  <button onClick={() => setShowFilters(false)} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-full transition-all">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-10">
                  <div>
                    <label className="text-[12px] font-medium text-slate-500 mb-4 block">Destinations</label>
                    <div className="grid grid-cols-2 gap-3">
                      {countries.map(c => (
                        <button 
                          key={`filter-${c}`}
                          onClick={() => setSelectedCountry(c)}
                          className={cn(
                            "py-3.5 rounded-[14px] font-medium text-[14px] transition-all border-2",
                            selectedCountry === c ? 'bg-apple-blue text-white border-apple-blue shadow-lg shadow-blue-50' : 'bg-slate-50 text-slate-600 border-transparent hover:border-slate-200'
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] font-medium text-slate-500 mb-4 block">Type de transport</label>
                    <div className="grid grid-cols-2 gap-3">
                      {transports.map(t => (
                        <button 
                          key={`filter-t-${t}`}
                          onClick={() => setSelectedTransport(t)}
                          className={cn(
                            "py-3.5 rounded-[14px] font-medium text-[14px] transition-all border-2",
                            selectedTransport === t ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-100' : 'bg-slate-50 text-slate-600 border-transparent hover:border-slate-200'
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] font-medium text-slate-500 mb-4 block">Note minimale</label>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          key={star} 
                          onClick={() => setMinRating(star)}
                          className={cn(
                            "flex-1 py-4 rounded-[14px] flex flex-col items-center justify-center gap-1.5 transition-all border-2",
                            minRating >= star ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 'bg-slate-50 text-slate-400 border-transparent'
                          )}
                        >
                          <Star size={16} fill={minRating >= star ? "currentColor" : "none"} />
                          <span className="text-[14px] font-medium text-slate-900">{star}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={resetFilters}
                      className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-[16px] font-medium text-[14px] hover:bg-slate-100 transition-all"
                    >
                      Réinitialiser
                    </button>
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="flex-[2] py-4 bg-apple-blue text-white rounded-[16px] font-medium text-[14px] shadow-lg shadow-blue-50 hover:bg-blue-700 transition-all"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
}
