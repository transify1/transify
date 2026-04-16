import React, { useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, Star, CheckCircle2, MapPin, 
  Phone, Mail, Globe, Ship, Plane, 
  Zap, Clock, DollarSign, MessageSquare,
  Share2, Heart, ShieldCheck, Award,
  ChevronRight, Camera, Info, ExternalLink, X,
  Package, ArrowRight, MessageCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function TransitaireProfile() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { companies, reviews, user, toggleFavorite } = useApp();
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'about'>('services');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest'>('recent');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showShareToast, setShowShareToast] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const previewData = location.state?.previewData;
  const baseCompany = companies.find(c => c.id === id);
  
  const company = previewData ? { ...baseCompany, ...previewData } : baseCompany;

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <h2 className="text-3xl font-black text-slate-900 mb-6">Transitaire non trouvé</h2>
        <Link to="/client/explorer" className="apple-button-primary">
          Retour à l'explorateur
        </Link>
      </div>
    );
  }

  const companyReviews = reviews.filter(r => r.companyId === id);

  const mockReviews = [
    { id: 'm1', user: 'Amadou K.', rating: 5, comment: 'Service impeccable, mon colis est arrivé en 7 jours par avion. Très professionnel.', date: 'Il y a 2 jours', timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 },
    { id: 'm2', user: 'Sokhna D.', rating: 4, comment: 'Bonne communication. Le maritime a pris un peu plus de temps que prévu mais tout était en bon état.', date: 'Il y a 1 semaine', timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000 },
    { id: 'm3', user: 'Jean P.', rating: 5, comment: 'Le meilleur transitaire pour la Chine. Les tarifs sont transparents.', date: 'Il y a 1 mois', timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000 },
    { id: 'm4', user: 'Mariam T.', rating: 3, comment: 'Correct, mais le suivi pourrait être amélioré.', date: 'Il y a 3 jours', timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000 },
    { id: 'm5', user: 'Ousmane S.', rating: 5, comment: 'Excellent service client, très réactif sur WhatsApp.', date: 'Il y a 5 jours', timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000 },
  ];

  const allReviews = [...companyReviews.map(r => ({
    id: r.id,
    user: r.clientName,
    rating: r.rating,
    comment: r.comment,
    date: new Date(r.createdAt).toLocaleDateString(),
    timestamp: new Date(r.createdAt).getTime()
  })), ...mockReviews];

  const filteredAndSortedReviews = allReviews
    .filter(review => ratingFilter === 'all' ? true : review.rating >= ratingFilter)
    .sort((a, b) => {
      if (sortBy === 'recent') return b.timestamp - a.timestamp;
      if (sortBy === 'highest') return b.rating - a.rating;
      return 0;
    });

  const mockPhotos = [
    'https://picsum.photos/seed/warehouse1/800/600',
    'https://picsum.photos/seed/warehouse2/800/600',
    'https://picsum.photos/seed/warehouse3/800/600',
    'https://picsum.photos/seed/warehouse4/800/600',
  ];

  const availableTabs = [
    { id: 'services', label: 'Services' },
    { id: 'reviews', label: 'Avis', hidden: company.showReviews === false },
    { id: 'about', label: 'À Propos' }
  ].filter(t => !t.hidden);

  return (
    <div className="min-h-screen bg-white pb-32 fluid-bg">
      {/* Preview Mode Banner */}
      {previewData && (
        <div className="bg-apple-blue text-white py-2 px-4 text-center text-[11px] font-black uppercase tracking-[0.2em] sticky top-0 z-[70] flex items-center justify-center gap-4">
          <span>Mode Aperçu : Modifications non enregistrées</span>
          <button 
            onClick={() => navigate(-1)}
            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-all"
          >
            Quitter
          </button>
        </div>
      )}

      {/* Shop Status Banner */}
      {company.status === 'closed' && (
        <div className="bg-red-500 text-white py-2 px-4 text-center text-[11px] font-black uppercase tracking-[0.2em] sticky top-0 z-[60]">
          Cette boutique est temporairement fermée
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-[280px] md:h-[360px] overflow-hidden">
        <img 
          src={company.banner || "https://picsum.photos/seed/logistics/1920/1080"} 
          className="w-full h-full object-cover" 
          alt="Cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
        
        {/* Top Navigation */}
        <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-10">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white/10 backdrop-blur-xl text-white rounded-[12px] hover:bg-white/20 transition-all border border-white/20"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex gap-2.5">
            <button 
              onClick={handleShare}
              className="p-2.5 bg-white/10 backdrop-blur-xl text-white rounded-[12px] hover:bg-white/20 transition-all border border-white/20"
            >
              <Share2 size={18} />
            </button>
            <button 
              onClick={() => toggleFavorite(company.id)}
              className={cn(
                "p-2.5 backdrop-blur-xl rounded-[12px] transition-all border border-white/20",
                user?.favorites?.includes(company.id) ? "bg-red-500 text-white border-red-500" : "bg-white/10 text-white hover:bg-white/20"
              )}
            >
              <Heart size={18} fill={user?.favorites?.includes(company.id) ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-6">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[28px] p-1 shadow-2xl shrink-0 border-2 border-white"
            >
              <img src={company.logo} className="w-full h-full object-cover rounded-[24px]" alt={company.name} />
            </motion.div>
            <div className="flex-1 mb-2">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-[28px] md:text-[36px] font-bold tracking-tight text-slate-900">{company.name}</h1>
                {company.verified && (
                  <div className="bg-apple-blue text-white p-1.5 rounded-full shadow-xl shadow-blue-500/20">
                    <CheckCircle2 size={18} />
                  </div>
                )}
              </div>
              <p className="text-[16px] md:text-[18px] font-medium text-slate-600 mb-4 leading-relaxed">{company.slogan}</p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-400" fill="currentColor" />
                  <span className="text-[15px] font-semibold text-slate-900">{company.rating}</span>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest">({company.reviewCount} avis)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-apple-blue" />
                  <span className="text-[15px] font-semibold text-slate-900">{company.totalPackages?.toLocaleString() || '1,200+'}</span>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest">colis</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-slate-400" />
                  <span className="text-[15px] font-semibold text-slate-900">{company.countries.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Tabs */}
            <div className="flex gap-8 border-b border-slate-100">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "pb-4 text-[11px] font-semibold uppercase tracking-widest transition-all relative",
                    activeTab === tab.id ? "text-apple-blue" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-apple-blue rounded-full shadow-[0_0_10px_rgba(0,113,227,0.5)]" 
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'services' && (
                <motion.div
                  key="services"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid md:grid-cols-2 gap-5"
                >
                  {company.services.filter(s => s.active !== false).map((service) => (
                    <div key={service.id} className="apple-card group !rounded-[24px]">
                      <div className="flex justify-between items-start mb-6">
                        <div className={cn(
                          "w-12 h-12 rounded-[16px] flex items-center justify-center transition-all group-hover:scale-110",
                          service.type === 'maritime' ? "bg-blue-50 text-apple-blue" :
                          service.type === 'aérien' ? "bg-purple-50 text-purple-600" :
                          "bg-orange-50 text-orange-600"
                        )}>
                          {service.type === 'maritime' && <Ship size={24} />}
                          {service.type === 'aérien' && <Plane size={24} />}
                          {service.type === 'express' && <Zap size={24} />}
                        </div>
                        <div className="text-right">
                          {company.showPrice !== 'hide' && (
                            <>
                              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                                {company.showPrice === 'starting' ? 'Dès' : 'Prix'}
                              </p>
                              <p className="text-[17px] font-bold text-slate-900 tracking-tight">{service.priceInfo}</p>
                            </>
                          )}
                        </div>
                      </div>
                      <h3 className="text-[20px] font-bold text-slate-900 mb-2 capitalize tracking-tight">{service.type}</h3>
                      <div className="flex items-center gap-2 text-slate-500 font-semibold mb-6 text-[11px] uppercase tracking-widest">
                        <Clock size={14} className="text-apple-blue" />
                        <span>Délai: {service.delay}</span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-2.5 text-[11px] font-medium text-slate-600 uppercase tracking-widest">
                          <CheckCircle2 size={14} className="text-green-500" /> Suivi en temps réel
                        </li>
                        <li className="flex items-center gap-2.5 text-[11px] font-medium text-slate-600 uppercase tracking-widest">
                          <CheckCircle2 size={14} className="text-green-500" /> Assurance incluse
                        </li>
                        <li className="flex items-center gap-2.5 text-[11px] font-medium text-slate-600 uppercase tracking-widest">
                          <CheckCircle2 size={14} className="text-green-500" /> Dédouanement géré
                        </li>
                      </ul>
                      <Link 
                        to={`/client/order/new/${company.id}?service=${service.id}`}
                        className="w-full py-3.5 bg-slate-50 text-slate-900 rounded-[16px] font-semibold text-[11px] uppercase tracking-widest hover:bg-apple-blue hover:text-white transition-all text-center block shadow-sm"
                      >
                        Choisir ce service
                      </Link>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div>
                      <h3 className="text-[22px] font-bold text-slate-900 tracking-tight">Expériences Clients</h3>
                      <p className="text-[14px] text-slate-600 font-medium tracking-tight">Ce que disent nos utilisateurs.</p>
                    </div>
                    <button className="px-4 py-2 bg-slate-50 text-slate-900 rounded-[10px] font-semibold text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all">
                      Laisser un avis
                    </button>
                  </div>

                  <div className="space-y-4">
                    {filteredAndSortedReviews.map((review) => (
                      <div key={review.id} className="apple-card">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 text-[12px]">
                              {review.user[0]}
                            </div>
                            <div>
                              <h4 className="text-[14px] font-bold text-slate-900">{review.user}</h4>
                              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex gap-0.5 text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                            ))}
                          </div>
                        </div>
                        <p className="text-[15px] text-slate-600 font-normal leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-10"
                >
                  <div className="max-w-3xl">
                    <h3 className="text-[22px] font-bold text-slate-900 mb-5 tracking-tight">Notre Histoire</h3>
                    <p className="text-[15px] text-slate-600 leading-relaxed font-normal mb-5">
                      {company.description}
                    </p>
                    <p className="text-[15px] text-slate-600 leading-relaxed font-normal">
                      Nous sommes fiers de servir nos clients avec intégrité et efficacité. Notre équipe en Chine et en Afrique travaille main dans la main pour garantir que vos marchandises arrivent à bon port.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-5">Nos Implantations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {company.locations?.china && (
                        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-[20px] border border-slate-100">
                          <div className="w-10 h-10 bg-white rounded-[12px] flex items-center justify-center shrink-0 shadow-sm text-apple-blue">
                            <Globe size={20} />
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-slate-900 uppercase tracking-widest mb-1">Entrepôt Chine</p>
                            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{company.addressChina}</p>
                          </div>
                        </div>
                      )}
                      {company.locations?.africa && (
                        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-[20px] border border-slate-100">
                          <div className="w-10 h-10 bg-white rounded-[12px] flex items-center justify-center shrink-0 shadow-sm text-apple-blue">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-slate-900 uppercase tracking-widest mb-1">Bureau Afrique</p>
                            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{company.addressAfrica}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-5">Installations & Entrepôts</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(company.gallery || mockPhotos).map((photo, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedPhoto(photo)}
                          className="aspect-square rounded-[20px] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                          <img src={photo} className="w-full h-full object-cover" alt={`Installation ${i}`} />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="apple-card bg-apple-blue text-white border-none">
                      <Award className="mb-4 opacity-50" size={32} />
                      <h4 className="text-[16px] font-bold mb-2">Expertise Reconnue</h4>
                      <p className="text-[12px] text-white/80 font-medium leading-relaxed">
                        Plus de 10 ans d'expérience dans le transit international entre la Chine et l'Afrique de l'Ouest.
                      </p>
                    </div>
                    <div className="apple-card bg-slate-900 text-white border-none">
                      <ShieldCheck className="mb-4 text-apple-blue opacity-50" size={32} />
                      <h4 className="text-[16px] font-bold mb-2">Sécurité Garantie</h4>
                      <p className="text-[12px] text-white/80 font-medium leading-relaxed">
                        Vos colis sont assurés et suivis à chaque étape de leur voyage.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8">
            {/* Business Card */}
            <div className="apple-card bg-slate-50 border-none relative overflow-hidden group !p-6">
              <div className="absolute top-0 right-0 w-20 h-20 bg-apple-blue/5 rounded-full -mr-10 -mt-10 blur-xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-[10px] font-semibold text-apple-blue uppercase tracking-[0.2em] mb-1">Contact Officiel</p>
                    <h3 className="text-[16px] font-bold text-slate-900">{company.name}</h3>
                  </div>
                  <img src={company.logo} className="w-10 h-10 rounded-[10px] object-cover shadow-sm" alt="" />
                </div>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white rounded-[8px] flex items-center justify-center shrink-0 shadow-sm text-slate-400">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Bureau Principal</p>
                      <p className="text-[13px] font-semibold text-slate-700 leading-snug">{company.addressAfrica}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white rounded-[8px] flex items-center justify-center shrink-0 shadow-sm text-slate-400">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Téléphone</p>
                      <p className="text-[13px] font-semibold text-slate-700">{company.contact?.phone || '+221 33 800 00 00'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white rounded-[8px] flex items-center justify-center shrink-0 shadow-sm text-slate-400">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Email</p>
                      <p className="text-[13px] font-semibold text-slate-700 truncate max-w-[160px]">{company.contact?.email || `contact@${company.name.toLowerCase().replace(/\s+/g, '')}.com`}</p>
                    </div>
                  </div>

                  {company.contact?.whatsapp && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-50 rounded-[8px] flex items-center justify-center shrink-0 shadow-sm text-green-600">
                        <MessageCircle size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">WhatsApp</p>
                        <p className="text-[13px] font-semibold text-slate-700">{company.contact.whatsapp}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
                  <div className="flex gap-2">
                    <button className="w-8 h-8 bg-white rounded-[8px] flex items-center justify-center text-slate-400 hover:text-apple-blue transition-colors shadow-sm">
                      <Globe size={14} />
                    </button>
                    <button className="w-8 h-8 bg-white rounded-[8px] flex items-center justify-center text-slate-400 hover:text-apple-blue transition-colors shadow-sm">
                      <ExternalLink size={14} />
                    </button>
                  </div>
                  <button className="px-3 py-1.5 bg-slate-900 text-white rounded-[8px] font-semibold text-[10px] uppercase tracking-widest">
                    vCard
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="apple-card bg-slate-900 text-white border-none !p-6">
              <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-6">Performances</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[20px] font-bold mb-0.5 tracking-tighter">500+</p>
                  <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Livraisons</p>
                </div>
                <div>
                  <p className="text-[20px] font-bold mb-0.5 tracking-tighter">98%</p>
                  <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Satisfaction</p>
                </div>
                <div>
                  <p className="text-[20px] font-bold mb-0.5 tracking-tighter">10+</p>
                  <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Pays</p>
                </div>
                <div>
                  <p className="text-[20px] font-bold mb-0.5 tracking-tighter">24h</p>
                  <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Réponse</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl p-4 md:p-5 z-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:block">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Prêt à expédier ?</p>
            <p className="text-[15px] font-bold text-slate-900">Expédiez avec {company.name}</p>
          </div>
          <div className="flex-1 md:flex-none flex gap-3">
            <button 
              onClick={() => navigate(`/client/chat/${company.id}`)}
              className="flex-1 md:flex-none px-5 py-2.5 bg-slate-50 text-slate-900 rounded-[12px] font-semibold text-[12px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} /> Message
            </button>
            <Link 
              to={`/client/order/new/${company.id}`}
              className="flex-1 md:flex-none px-6 py-2.5 bg-apple-blue text-white rounded-[12px] font-semibold text-[12px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              Commander <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Share Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-full font-semibold text-[11px] uppercase tracking-widest shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 size={16} className="text-apple-blue" />
            Lien de la boutique copié !
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl w-full aspect-video rounded-[40px] overflow-hidden shadow-2xl"
            >
              <img src={selectedPhoto} className="w-full h-full object-cover" alt="Installation" />
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-xl transition-all border border-white/20"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
