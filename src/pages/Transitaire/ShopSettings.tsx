import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, Camera, Image as ImageIcon, Globe, 
  Ship, Plane, Zap, ShieldCheck, Star, 
  Phone, Mail, MessageCircle, Eye, Save, 
  CheckCircle2, Plus, Layout, Info,
  MapPin, Clock, ToggleLeft, ToggleRight,
  ArrowRight, X, AlertTriangle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import TransitaireSidebar from '../../components/Transitaire/Sidebar';
import { useApp } from '../../context/AppContext';

export default function ShopSettings() {
  const { user, companies, updateCompany } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as any) || 'identity';
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const company = companies.find(c => c.id === user?.companyId);

  const [shopData, setShopData] = useState({
    name: company?.name || "Sénégal Fret Express",
    slogan: company?.slogan || "Votre partenaire logistique fiable",
    description: company?.description || "Nous sommes spécialisés dans le transport aérien et maritime entre la Chine et l'Afrique. Avec plus de 10 ans d'expérience, nous garantissons la sécurité et la rapidité de vos envois.",
    status: company?.status || 'open',
    showPrice: company?.showPrice || 'full',
    showReviews: company?.showReviews ?? true,
    contact: {
      phone: company?.contact?.phone || '+221 33 800 00 00',
      whatsapp: company?.contact?.whatsapp || '+221 77 000 00 00',
      email: company?.contact?.email || 'contact@fret-express.sn'
    },
    services: {
      express: {
        active: company?.services.find(s => s.type === 'express')?.active ?? true,
        delay: company?.services.find(s => s.type === 'express')?.delay || '3-5 jours',
        pricePerUnit: company?.services.find(s => s.type === 'express')?.pricePerUnit || 9000,
        priceInfo: company?.services.find(s => s.type === 'express')?.priceInfo || '9000 FCFA / kg',
        unit: company?.services.find(s => s.type === 'express')?.unit || 'kg'
      },
      aérien: {
        active: company?.services.find(s => s.type === 'aérien')?.active ?? true,
        delay: company?.services.find(s => s.type === 'aérien')?.delay || '7-10 jours',
        pricePerUnit: company?.services.find(s => s.type === 'aérien')?.pricePerUnit || 6500,
        priceInfo: company?.services.find(s => s.type === 'aérien')?.priceInfo || '6500 FCFA / kg',
        unit: company?.services.find(s => s.type === 'aérien')?.unit || 'kg'
      },
      maritime: {
        active: company?.services.find(s => s.type === 'maritime')?.active ?? true,
        delay: company?.services.find(s => s.type === 'maritime')?.delay || '30-45 jours',
        pricePerUnit: company?.services.find(s => s.type === 'maritime')?.pricePerUnit || 350000,
        priceInfo: company?.services.find(s => s.type === 'maritime')?.priceInfo || '350000 FCFA / CBM',
        unit: company?.services.find(s => s.type === 'maritime')?.unit || 'cbm'
      }
    },
    style: company?.style || 'minimalist',
    locations: company?.locations || {
      africa: true,
      china: true
    },
    gallery: company?.gallery || [
      'https://picsum.photos/seed/ware1/800/600',
      'https://picsum.photos/seed/ware2/800/600',
      'https://picsum.photos/seed/ware3/800/600'
    ],
    logo: company?.logo || 'https://picsum.photos/seed/fret1/200/200',
    banner: company?.banner || 'https://picsum.photos/seed/logistics/1200/400',
    addressChina: company?.addressChina || "",
    addressAfrica: company?.addressAfrica || ""
  });

  const [activeTab, setActiveTab] = useState<'identity' | 'presentation' | 'services' | 'contact'>(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['identity', 'presentation', 'services', 'contact'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  const getTabStatus = (tabId: string) => {
    switch (tabId) {
      case 'identity':
        return !!(shopData.name && shopData.logo && !shopData.logo.includes('ui-avatars') && shopData.banner);
      case 'presentation':
        return !!(shopData.description && shopData.description.length > 20 && shopData.gallery.length >= 3);
      case 'services':
        return Object.values(shopData.services).some((s: any) => s.active);
      case 'contact':
        return !!(shopData.contact.phone && shopData.contact.email && shopData.addressChina && shopData.addressAfrica);
      default:
        return true;
    }
  };

  const tabs = [
    { id: 'identity', label: 'Identité', icon: <ImageIcon size={18} />, completed: getTabStatus('identity') },
    { id: 'presentation', label: 'Présentation', icon: <Info size={18} />, completed: getTabStatus('presentation') },
    { id: 'services', label: 'Services', icon: <Zap size={18} />, completed: getTabStatus('services') },
    { id: 'contact', label: 'Contact', icon: <Phone size={18} />, completed: getTabStatus('contact') },
  ];

  const handleSave = () => {
    if (!user?.companyId || !company) return;
    setIsSaving(true);
    
    // Map services back to the format expected by Company type
    const updatedServices = company.services.map(s => {
      const edited = shopData.services[s.type as keyof typeof shopData.services];
      if (edited) {
        return {
          ...s,
          active: edited.active,
          delay: edited.delay,
          pricePerUnit: Number(edited.pricePerUnit),
          priceInfo: edited.priceInfo
        };
      }
      return s;
    });

    // Update company in context
    updateCompany(user.companyId, {
      name: shopData.name,
      slogan: shopData.slogan,
      description: shopData.description,
      status: shopData.status as any,
      showPrice: shopData.showPrice as any,
      showReviews: shopData.showReviews,
      contact: shopData.contact,
      style: shopData.style,
      locations: shopData.locations,
      gallery: shopData.gallery,
      logo: shopData.logo,
      banner: shopData.banner,
      addressChina: shopData.addressChina,
      addressAfrica: shopData.addressAfrica,
      services: updatedServices as any
    });

    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const handleAddImage = () => {
    const newImage = `https://picsum.photos/seed/ware${Math.floor(Math.random() * 1000)}/800/600`;
    setShopData(prev => ({
      ...prev,
      gallery: [...prev.gallery, newImage]
    }));
  };

  const handleDeleteImage = (index: number) => {
    setShopData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (type: 'logo' | 'banner') => {
    // Simulate file upload
    const newUrl = type === 'logo' 
      ? `https://picsum.photos/seed/logo${Math.floor(Math.random() * 1000)}/200/200`
      : `https://picsum.photos/seed/banner${Math.floor(Math.random() * 1000)}/1200/400`;
    
    setShopData(prev => ({
      ...prev,
      [type]: newUrl
    }));
  };

  return (
    <div className="min-h-screen bg-white fluid-bg">
      <TransitaireSidebar />
      
      <main className="lg:ml-72 p-4 lg:p-8 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-9 h-9 bg-blue-50 text-apple-blue rounded-[10px] flex items-center justify-center">
                <Store size={20} />
              </div>
              <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Ma Boutique</h1>
            </div>
            <p className="text-[14px] text-slate-500 font-normal">Gérez votre image de marque et votre visibilité.</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                // Map services for preview
                const previewServices = company?.services.map(s => {
                  if (s.type === 'express') return { ...s, active: shopData.services.air_express };
                  if (s.type === 'aérien') return { ...s, active: shopData.services.air_fret };
                  if (s.type === 'maritime') return { ...s, active: shopData.services.maritime };
                  return s;
                });

                navigate(`/client/transitaire/${user?.companyId}`, { 
                  state: { 
                    previewData: {
                      ...shopData,
                      services: previewServices
                    } 
                  } 
                });
              }}
              className="apple-button-secondary flex items-center gap-2 !py-2.5 !px-5 !text-[12px] !font-semibold uppercase tracking-wider"
            >
              <Eye size={16} /> Aperçu boutique
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="apple-button-primary flex items-center gap-2 !py-2.5 !px-5 !text-[12px] !font-semibold uppercase tracking-wider"
            >
              {isSaving ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Save size={16} /></motion.div> : <Save size={16} />}
              Enregistrer
            </button>
          </div>
        </header>

        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-500 text-white p-4 rounded-[16px] mb-8 flex items-center gap-3 shadow-xl shadow-green-100"
            >
              <CheckCircle2 size={18} />
              <span className="text-[14px] font-bold italic serif">Boutique mise à jour avec succès !</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-8 border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 py-4 text-[14px] font-medium transition-all relative whitespace-nowrap uppercase tracking-widest",
                activeTab === tab.id ? "text-apple-blue" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <div className="relative">
                {tab.icon}
                {!tab.completed && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse" />
                )}
              </div>
              {tab.label}
              {!tab.completed && (
                <span className="ml-1 text-[10px] text-red-500 font-bold tracking-tight">À remplir</span>
              )}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabShop"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-apple-blue"
                />
              )}
            </button>
          ))}
        </div>

        <div className="grid xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === 'identity' && (
                <motion.div
                  key="identity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Identity */}
                  <section className="apple-card">
                    <h3 className="text-[16px] font-semibold text-slate-900 tracking-tight mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="text-apple-blue" size={20} /> Identité Visuelle
                      </div>
                      {(!shopData.name || !shopData.logo || !shopData.banner) && (
                        <span className="px-2.5 py-1 bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-red-100 flex items-center gap-1.5 animate-pulse">
                          <AlertTriangle size={12} /> À compléter
                        </span>
                      )}
                    </h3>
                    
                    <div className="space-y-6">
                      {/* Banner Upload */}
                      <div>
                        <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2 block">Image de couverture</label>
                        <div 
                          onClick={() => handleFileChange('banner')}
                          className="relative h-48 bg-slate-50 rounded-[24px] overflow-hidden group cursor-pointer border border-dashed border-slate-200 hover:border-apple-blue transition-all duration-500"
                        >
                          <img src={shopData.banner} className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-all duration-700" alt="Cover" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/90 backdrop-blur-xl p-3 rounded-[12px] shadow-2xl flex items-center gap-2 border border-white/20">
                              <Camera size={16} className="text-apple-blue" />
                              <span className="font-medium text-[10px] uppercase tracking-widest">Changer la bannière</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Logo Upload */}
                        <div className="shrink-0">
                          <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2 block">Logo</label>
                          <div 
                            onClick={() => handleFileChange('logo')}
                            className="relative w-24 h-24 bg-slate-50 rounded-[24px] border border-dashed border-slate-200 flex items-center justify-center group cursor-pointer hover:border-apple-blue transition-all duration-500 overflow-hidden"
                          >
                            <img src={shopData.logo} className="w-full h-full object-cover" alt="Logo" />
                            <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500">
                              <Camera size={20} className="text-white" />
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-1.5 block">Nom de la boutique</label>
                            <input 
                              type="text" 
                              value={shopData.name}
                              onChange={(e) => setShopData({...shopData, name: e.target.value})}
                              className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-[12px] focus:ring-2 focus:ring-apple-blue transition-all font-normal text-slate-900 text-[15px]"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-1.5 block">Slogan publicitaire</label>
                            <input 
                              type="text" 
                              value={shopData.slogan}
                              onChange={(e) => setShopData({...shopData, slogan: e.target.value})}
                              className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-[12px] focus:ring-2 focus:ring-apple-blue transition-all font-normal text-slate-600 text-[15px]"
                              placeholder="Ex: Votre partenaire logistique fiable"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === 'presentation' && (
                <motion.div
                  key="presentation"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Presentation */}
                  <section className="apple-card">
                    <h3 className="text-[16px] font-semibold text-slate-900 tracking-tight mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Info className="text-apple-blue" size={20} /> Présentation
                      </div>
                      {(!shopData.description || shopData.description.length <= 20) && (
                        <span className="px-2.5 py-1 bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-red-100 flex items-center gap-1.5 animate-pulse">
                          <AlertTriangle size={12} /> À compléter
                        </span>
                      )}
                    </h3>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2 block">À propos de votre entreprise</label>
                      <textarea 
                        rows={6}
                        value={shopData.description}
                        onChange={(e) => setShopData({...shopData, description: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-[20px] focus:ring-2 focus:ring-apple-blue transition-all font-medium text-slate-600 leading-relaxed text-[15px]"
                      />
                      <p className="mt-2 text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Cette description sera affichée sur votre profil public.</p>
                    </div>
                  </section>

                  {/* Gallery */}
                  <section className="apple-card">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-[16px] font-semibold text-slate-900 tracking-tight flex items-center gap-3">
                        <ImageIcon className="text-apple-blue" size={20} /> Galerie Photos
                        {shopData.gallery.length < 3 && (
                          <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        )}
                      </h3>
                      <button 
                        onClick={handleAddImage}
                        className="apple-button-secondary !py-1.5 !px-3 !text-[10px] !font-semibold uppercase tracking-widest flex items-center gap-2"
                      >
                        <Plus size={14} /> Ajouter
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {shopData.gallery.map((img, i) => (
                        <div key={i} className="aspect-square bg-slate-50 rounded-[20px] overflow-hidden relative group shadow-sm">
                          <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="Gallery" />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500">
                            <button 
                              onClick={() => handleDeleteImage(i)}
                              className="p-2 bg-white/20 backdrop-blur-xl text-white rounded-[8px] hover:bg-red-500 transition-all"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div 
                        onClick={handleAddImage}
                        className="aspect-square border border-dashed border-slate-200 rounded-[20px] flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:border-apple-blue hover:text-apple-blue transition-all duration-500 cursor-pointer group"
                      >
                        <Plus size={24} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-semibold uppercase tracking-widest">Upload</span>
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === 'services' && (
                <motion.div
                  key="services"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Services Visibility */}
                  <section className="apple-card">
                    <h3 className="text-[16px] font-semibold text-slate-900 tracking-tight mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Zap className="text-apple-blue" size={20} /> Services Disponibles
                      </div>
                      {!Object.values(shopData.services).some((s: any) => s.active) && (
                        <span className="px-2.5 py-1 bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-red-100 flex items-center gap-1.5 animate-pulse">
                          <AlertTriangle size={12} /> À compléter
                        </span>
                      )}
                    </h3>
                    <div className="space-y-6">
                      {[
                        { id: 'express', label: 'Aérien Express', icon: <Zap size={16} />, unit: 'kg' },
                        { id: 'aérien', label: 'Fret aérien', icon: <Plane size={16} />, unit: 'kg' },
                        { id: 'maritime', label: 'Maritime', icon: <Ship size={16} />, unit: 'cbm' }
                      ].map((service) => {
                        const sData = shopData.services[service.id as keyof typeof shopData.services];
                        return (
                        <div 
                          key={service.id}
                          className={cn(
                            "p-6 rounded-[24px] border transition-all group",
                            sData.active ? 'border-blue-100 bg-white shadow-sm' : 'border-slate-50 opacity-60 bg-slate-50/50'
                          )}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-10 h-10 rounded-[12px] flex items-center justify-center transition-all",
                                sData.active ? 'bg-apple-blue text-white' : 'bg-slate-200 text-slate-400'
                              )}>
                                {service.icon}
                              </div>
                              <span className="font-bold text-[15px] tracking-tight">{service.label}</span>
                            </div>
                            <button 
                              onClick={() => setShopData({
                                ...shopData, 
                                services: { 
                                  ...shopData.services, 
                                  [service.id]: { ...sData, active: !sData.active } 
                                }
                              })}
                            >
                              {sData.active ? <ToggleRight size={28} className="text-apple-blue" /> : <ToggleLeft size={28} className="text-slate-300" />}
                            </button>
                          </div>
                          
                          {sData.active && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-50"
                            >
                              <div>
                                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Délai estimé</label>
                                <input 
                                  type="text"
                                  value={sData.delay}
                                  onChange={(e) => setShopData({
                                    ...shopData,
                                    services: {
                                      ...shopData.services,
                                      [service.id]: { ...sData, delay: e.target.value }
                                    }
                                  })}
                                  className="w-full px-4 py-2 bg-slate-50 border-none rounded-[12px] focus:ring-1 focus:ring-apple-blue text-[13px]"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Prix par {service.unit}</label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="number"
                                    value={sData.pricePerUnit}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setShopData({
                                        ...shopData,
                                        services: {
                                          ...shopData.services,
                                          [service.id]: { 
                                            ...sData, 
                                            pricePerUnit: Number(val),
                                            priceInfo: `${val} FCFA / ${service.unit}`
                                          }
                                        }
                                      });
                                    }}
                                    className="flex-1 px-4 py-2 bg-slate-50 border-none rounded-[12px] focus:ring-1 focus:ring-apple-blue text-[13px]"
                                  />
                                  <span className="text-[12px] font-bold text-slate-400">FCFA</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )})}
                    </div>
                  </section>

                  {/* Pricing Display */}
                  <section className="apple-card">
                    <h3 className="text-[16px] font-semibold text-slate-900 tracking-tight mb-6 flex items-center gap-3">
                      <Layout className="text-apple-blue" size={20} /> Affichage des Prix
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { id: 'hide', label: 'Masquer', desc: 'Les prix ne sont pas visibles' },
                        { id: 'starting', label: 'À partir de', desc: 'Affiche le prix minimum' },
                        { id: 'full', label: 'Prix complet', desc: 'Affiche tous les tarifs' }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setShopData({...shopData, showPrice: opt.id})}
                          className={cn(
                            "p-4 rounded-[20px] text-left transition-all border",
                            shopData.showPrice === opt.id ? 'border-apple-blue bg-blue-50/30' : 'border-slate-50 bg-slate-50/30 hover:bg-slate-50'
                          )}
                        >
                          <div className={cn(
                            "w-4 h-4 rounded-full border-2 mb-3 flex items-center justify-center",
                            shopData.showPrice === opt.id ? 'border-apple-blue' : 'border-slate-300'
                          )}>
                            {shopData.showPrice === opt.id && <div className="w-2 h-2 bg-apple-blue rounded-full" />}
                          </div>
                          <p className="font-semibold text-[14px] text-slate-900 mb-1">{opt.label}</p>
                          <p className="text-[11px] text-slate-500 font-normal leading-tight">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === 'contact' && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Shop Status */}
                  <section className="apple-card">
                    <h3 className="text-[16px] font-semibold text-slate-900 tracking-tight mb-6 flex items-center gap-3">
                      <Clock className="text-apple-blue" size={20} /> État de la Boutique
                    </h3>
                    <div 
                      onClick={() => setShopData({...shopData, status: shopData.status === 'open' ? 'closed' : 'open'})}
                      className={cn(
                        "p-6 rounded-[24px] border transition-all cursor-pointer flex items-center justify-between group",
                        shopData.status === 'open' ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("w-3 h-3 rounded-full animate-pulse", shopData.status === 'open' ? 'bg-green-500' : 'bg-red-500')} />
                        <div>
                          <span className="font-semibold text-[18px] text-slate-900 block">{shopData.status === 'open' ? 'Boutique Ouverte' : 'Boutique Fermée'}</span>
                          <span className="text-[12px] text-slate-500 font-normal">
                            {shopData.status === 'open' ? 'Les clients peuvent voir vos services et commander.' : 'Votre boutique est temporairement invisible.'}
                          </span>
                        </div>
                      </div>
                      {shopData.status === 'open' ? <ToggleRight size={32} className="text-green-600" /> : <ToggleLeft size={32} className="text-red-600" />}
                    </div>
                  </section>

                  {/* Addresses */}
                  <section className="apple-card">
                    <h3 className="text-[16px] font-semibold text-slate-900 tracking-tight mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="text-apple-blue" size={20} /> Adresses des Bureaux
                      </div>
                      {(!shopData.addressChina || !shopData.addressAfrica) && (
                        <span className="px-2.5 py-1 bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-red-100 flex items-center gap-1.5 animate-pulse">
                          <AlertTriangle size={12} /> À compléter
                        </span>
                      )}
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Adresse en Chine (Entrepôt)</label>
                        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-[16px]">
                          <Globe size={18} className="text-slate-400 mt-0.5" />
                          <textarea 
                            rows={2}
                            value={shopData.addressChina}
                            onChange={(e) => setShopData({...shopData, addressChina: e.target.value})}
                            className="bg-transparent border-none p-0 focus:ring-0 font-medium text-slate-900 text-[14px] flex-1 resize-none"
                            placeholder="Ex: Guangzhou, District de Yuexiu, Rue de la Paix 123"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Adresse en Afrique (Bureau local)</label>
                        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-[16px]">
                          <MapPin size={18} className="text-slate-400 mt-0.5" />
                          <textarea 
                            rows={2}
                            value={shopData.addressAfrica}
                            onChange={(e) => setShopData({...shopData, addressAfrica: e.target.value})}
                            className="bg-transparent border-none p-0 focus:ring-0 font-medium text-slate-900 text-[14px] flex-1 resize-none"
                            placeholder="Ex: Dakar, Plateau, Avenue Lamine Gueye"
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Public Contact */}
                  <section className="apple-card">
                    <h3 className="text-[16px] font-semibold text-slate-900 tracking-tight mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Phone className="text-apple-blue" size={20} /> Informations de Contact
                      </div>
                      {(!shopData.contact.phone || !shopData.contact.email) && (
                        <span className="px-2.5 py-1 bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-red-100 flex items-center gap-1.5 animate-pulse">
                          <AlertTriangle size={12} /> À compléter
                        </span>
                      )}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Téléphone public</label>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-[16px]">
                          <Phone size={18} className="text-slate-400" />
                          <input 
                            type="text" 
                            value={shopData.contact.phone}
                            onChange={(e) => setShopData({...shopData, contact: {...shopData.contact, phone: e.target.value}})}
                            className="bg-transparent border-none p-0 focus:ring-0 font-semibold text-slate-900 text-[15px] flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">WhatsApp</label>
                        <div className="flex items-center gap-3 p-4 bg-green-50/50 rounded-[16px] border border-green-100">
                          <MessageCircle size={18} className="text-green-600" />
                          <input 
                            type="text" 
                            value={shopData.contact.whatsapp}
                            onChange={(e) => setShopData({...shopData, contact: {...shopData.contact, whatsapp: e.target.value}})}
                            className="bg-transparent border-none p-0 focus:ring-0 font-semibold text-slate-900 text-[15px] flex-1"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Email public</label>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-[16px]">
                          <Mail size={18} className="text-slate-400" />
                          <input 
                            type="email" 
                            value={shopData.contact.email}
                            onChange={(e) => setShopData({...shopData, contact: {...shopData.contact, email: e.target.value}})}
                            className="bg-transparent border-none p-0 focus:ring-0 font-semibold text-slate-900 text-[15px] flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Save Button for Mobile/Convenience */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="apple-button-primary flex items-center gap-3 !py-4 !px-10 !text-[14px] !font-bold uppercase tracking-widest shadow-2xl shadow-blue-100"
              >
                {isSaving ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Save size={20} /></motion.div> : <Save size={20} />}
                Enregistrer les modifications
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Shop Preview Card */}
            <div className="apple-card !p-0 overflow-hidden">
              <div className="h-24 bg-slate-100 relative">
                <img src={shopData.banner} className="w-full h-full object-cover opacity-50" alt="Preview Cover" />
                <div className="absolute -bottom-6 left-6 w-12 h-12 bg-white rounded-[12px] shadow-lg p-1">
                  <img src={shopData.logo} className="w-full h-full object-cover rounded-[10px]" alt="Preview Logo" />
                </div>
              </div>
              <div className="p-6 pt-8">
                <h4 className="font-semibold text-slate-900 text-[16px] mb-1">{shopData.name}</h4>
                <p className="text-[12px] text-slate-500 font-normal mb-4">{shopData.slogan}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {Object.entries(shopData.services).map(([key, sData]) => (sData as any).active && (
                    <span key={key} className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded-full text-[9px] font-semibold uppercase tracking-widest">
                      {key}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => {
                    const previewServices = company?.services.map(s => {
                      if (s.type === 'express') return { ...s, active: shopData.services.air_express };
                      if (s.type === 'aérien') return { ...s, active: shopData.services.air_fret };
                      if (s.type === 'maritime') return { ...s, active: shopData.services.maritime };
                      return s;
                    });

                    navigate(`/client/transitaire/${user?.companyId}`, { 
                      state: { 
                        previewData: {
                          ...shopData,
                          services: previewServices
                        } 
                      } 
                    });
                  }}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-[12px] font-semibold text-[12px] uppercase tracking-widest hover:bg-apple-blue transition-all"
                >
                  Voir ma boutique
                </button>
              </div>
            </div>

            {/* Visibility Score */}
            <div className="apple-card !p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight">Score de Visibilité</h3>
                <span className="text-apple-blue font-bold text-[12px]">
                  {(() => {
                    let score = 0;
                    if (shopData.name) score += 10;
                    if (shopData.logo && !shopData.logo.includes('ui-avatars')) score += 10;
                    if (shopData.banner) score += 5;
                    if (shopData.description && shopData.description.length > 20) score += 15;
                    if (shopData.contact?.phone) score += 5;
                    if (shopData.contact?.email) score += 5;
                    if (shopData.contact?.whatsapp) score += 5;
                    if (shopData.gallery && shopData.gallery.length >= 3) score += 5;
                    if (shopData.locations.africa || shopData.locations.china) score += 5;
                    if (Object.values(shopData.services).some(v => v)) score += 15;
                    // Add remaining points to reach 100
                    if (shopData.addressChina) score += 10;
                    if (shopData.addressAfrica) score += 10;
                    return Math.min(score, 100);
                  })()}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(() => {
                    let score = 0;
                    if (shopData.name) score += 10;
                    if (shopData.logo && !shopData.logo.includes('ui-avatars')) score += 10;
                    if (shopData.banner) score += 5;
                    if (shopData.description && shopData.description.length > 20) score += 15;
                    if (shopData.contact?.phone) score += 5;
                    if (shopData.contact?.email) score += 5;
                    if (shopData.contact?.whatsapp) score += 5;
                    if (shopData.gallery && shopData.gallery.length >= 3) score += 5;
                    if (shopData.locations.africa || shopData.locations.china) score += 5;
                    if (Object.values(shopData.services).some(v => v)) score += 15;
                    if (shopData.addressChina) score += 10;
                    if (shopData.addressAfrica) score += 10;
                    return Math.min(score, 100);
                  })()}%` }}
                  className="h-full bg-apple-blue"
                />
              </div>
              <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
                {(() => {
                  const score = (() => {
                    let s = 0;
                    if (shopData.name) s += 10;
                    if (shopData.logo && !shopData.logo.includes('ui-avatars')) s += 10;
                    if (shopData.banner) s += 5;
                    if (shopData.description && shopData.description.length > 20) s += 15;
                    if (shopData.contact?.phone) s += 5;
                    if (shopData.contact?.email) s += 5;
                    if (shopData.contact?.whatsapp) s += 5;
                    if (shopData.gallery && shopData.gallery.length >= 3) s += 5;
                    if (shopData.locations.africa || shopData.locations.china) s += 5;
                    if (Object.values(shopData.services).some(v => v)) s += 15;
                    if (shopData.addressChina) s += 10;
                    if (shopData.addressAfrica) s += 10;
                    return s;
                  })();
                  if (score === 100) return "Félicitations ! Votre profil est complet et optimisé pour la visibilité.";
                  if (shopData.gallery.length < 3) return "Ajoutez au moins 3 photos à votre galerie pour améliorer votre score.";
                  if (shopData.description.length <= 20) return "Rédigez une description plus longue pour mieux présenter vos services.";
                  return "Complétez toutes les sections pour atteindre 100% et être mieux classé.";
                })()}
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
