import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { WEST_AFRICAN_COUNTRIES } from '../../constants';
import { 
  Settings, Building2, Globe, Ship, 
  Plane, Zap, LayoutDashboard, Package, 
  BarChart3, Users, LogOut, Camera,
  MapPin, Phone, Mail, Shield, Bell,
  CheckCircle2, Save, AlertCircle, Trash2,
  Edit3, Plus, AlertTriangle, X, FileText,
  Download, Store, Layout, ChevronRight,
  Rocket, Check, Star, CreditCard, Search
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../../lib/utils';

import TransitaireSidebar from '../../components/Transitaire/Sidebar';

export default function TransitaireSettings() {
  const { user, companies, updateCompany, sidebarCollapsed } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as any) || 'general';
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<any>(null);
  const [memberToEdit, setMemberToEdit] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'rates' | 'team' | 'locations' | 'subscription' | 'verification'>(initialTab);
  
  React.useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['general', 'rates', 'team', 'locations', 'subscription', 'verification'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  const [verificationDocs, setVerificationDocs] = useState({
    idCard: { status: 'submitted', date: '2024-03-15' },
    businessLicense: { status: 'pending', date: null },
    taxProof: { status: 'none', date: null }
  });
  
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    phoneIndicator: WEST_AFRICAN_COUNTRIES[0].indicator,
    country: WEST_AFRICAN_COUNTRIES[0].name,
    role: 'Agent Logistique'
  });

  const [team, setTeam] = useState([
    { id: 1, name: 'Moussa Diop', role: 'Admin', email: 'moussa@transify.com', phone: '+221 77 123 45 67', country: 'Sénégal', status: 'active' },
    { id: 2, name: 'Chen Wei', role: 'Scanner (Chine)', email: 'chen@transify.com', phone: '+86 138 0000 0000', country: 'Chine', status: 'active' },
    { id: 3, name: 'Fatou Sow', role: 'Support Client', email: 'fatou@transify.com', phone: '+221 78 987 65 43', country: 'Sénégal', status: 'active' },
    { id: 4, name: 'Ibrahima Fall', role: 'Agent Logistique', email: 'ibrahima@transify.com', phone: '+221 70 111 22 33', country: 'Sénégal', status: 'inactive' },
  ]);

  const roles = [
    'Agent Logistique',
    'Support Client',
    'Scanner (Chine)',
    'Scanner (Afrique)',
    'Admin'
  ];

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const member = {
      id: Date.now(),
      ...newMember,
      phone: `${newMember.phoneIndicator} ${newMember.phone}`,
      status: 'active'
    };
    setTeam(prev => [member, ...prev]);
    setShowAddModal(false);
    setNewMember({ name: '', email: '', phone: '', phoneIndicator: WEST_AFRICAN_COUNTRIES[0].indicator, country: WEST_AFRICAN_COUNTRIES[0].name, role: 'Agent Logistique' });
  };

  const handleEditClick = (member: any) => {
    setMemberToEdit({ ...member });
    setShowEditModal(true);
  };

  const handleUpdateMember = (e: React.FormEvent) => {
    e.preventDefault();
    setTeam(prev => prev.map(m => m.id === memberToEdit.id ? memberToEdit : m));
    setShowEditModal(false);
    setMemberToEdit(null);
  };

  const toggleStatus = (id: number) => {
    setTeam(prev => prev.map(m => 
      m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m
    ));
  };

  const filteredTeam = team.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [transportOptions, setTransportOptions] = useState([
    { id: 'maritime', type: 'Maritime', icon: <Ship />, price: '350000', unit: 'CBM', delay: '30-45 jours', active: true },
    { id: 'aérien', type: 'Aérien', icon: <Plane />, price: '6500', unit: 'kg', delay: '5-10 jours', active: true },
    { id: 'express', type: 'Express', icon: <Zap />, price: '12000', unit: 'kg', delay: '3-5 jours', active: false },
  ]);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '0 FCFA',
      period: '15 jours',
      description: 'Idéal pour tester la plateforme et débuter votre activité.',
      features: [
        '50 colis / mois',
        'Gestion commandes basique',
        'Tous types de transport',
        '1 pays desservi',
        'Stats essentielles',
        '3 membres d\'équipe',
        '20 SMS inclus',
        'Support Email (48h)'
      ],
      color: 'bg-slate-100',
      textColor: 'text-slate-900',
      buttonColor: 'bg-slate-900',
      icon: <Zap size={24} className="text-slate-600" />
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '14 500 FCFA',
      period: 'par mois',
      description: 'Pour les transitaires en pleine croissance.',
      features: [
        'Colis illimités',
        'Gestion commandes avancée',
        'Pays illimités',
        'Stats & Reporting complets',
        '15 membres d\'équipe',
        '500 SMS inclus',
        'Badge "Vérifié"',
        'Support Chat (24h)'
      ],
      color: 'bg-blue-600',
      textColor: 'text-white',
      buttonColor: 'bg-white text-blue-600',
      icon: <Rocket size={24} className="text-white" />,
      popular: true
    }
  ];

  const handleSubscribe = (planId: string) => {
    navigate(`/transitaire/payment?plan=${planId}`);
  };

  const handleRateChange = (id: string, field: string, value: string | boolean) => {
    setTransportOptions(prev => prev.map(opt => 
      opt.id === id ? { ...opt, [field]: value } : opt
    ));
  };

  const company = companies.find(c => c.id === user?.companyId);

  const [generalData, setGeneralData] = useState({
    name: company?.name || "Sénégal Fret Express",
    description: company?.description || "Spécialiste du transport Chine-Sénégal depuis 10 ans.",
    email: company?.contact?.email || 'contact@fret-express.sn',
    phone: company?.contact?.phone || '+221 33 800 00 00',
    type: 'Transitaire',
    country: company?.locations?.china ? 'Chine' : 'Sénégal',
    addressChina: company?.addressChina || 'Guangzhou, District de Yuexiu, Rue de la Paix 123',
    addressAfrica: company?.addressAfrica || 'Dakar, Plateau, Avenue Lamine Gueye'
  });

  // Sync state with company data from context
  React.useEffect(() => {
    if (company) {
      setGeneralData({
        name: company.name || "",
        description: company.description || "",
        email: company.contact?.email || "",
        phone: company.contact?.phone || "",
        type: 'Transitaire',
        country: company.locations?.china ? 'Chine' : 'Sénégal',
        addressChina: company.addressChina || "",
        addressAfrica: company.addressAfrica || ""
      });
    }
  }, [company?.id]);

  const handleSave = () => {
    if (!user?.companyId) return;
    setIsSaving(true);
    
    updateCompany(user.companyId, {
      name: generalData.name,
      description: generalData.description,
      addressChina: generalData.addressChina,
      addressAfrica: generalData.addressAfrica,
      contact: {
        ...company?.contact,
        email: generalData.email,
        phone: generalData.phone
      } as any
    });

    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const handleDeleteClick = (member: any) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (memberToDelete) {
      setTeam(prev => prev.filter(m => m.id !== memberToDelete.id));
      setShowDeleteModal(false);
      setMemberToDelete(null);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-blue-100 text-blue-600';
      case 'Scanner (Chine)': return 'bg-purple-100 text-purple-600';
      case 'Scanner (Afrique)': return 'bg-orange-100 text-orange-600';
      case 'Support Client': return 'bg-green-100 text-green-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getTabStatus = (tabId: string) => {
    switch (tabId) {
      case 'general':
        return !!(generalData.name && generalData.description && generalData.email && generalData.phone);
      case 'rates':
        return transportOptions.some(opt => opt.active);
      case 'locations':
        return !!(generalData.addressChina && generalData.addressAfrica);
      case 'team':
        return team.length > 0;
      default:
        return true;
    }
  };

  const tabs = [
    { id: 'general', label: 'Entreprise', icon: <Building2 size={18} />, completed: getTabStatus('general') },
    { id: 'rates', label: 'Services & Tarifs', icon: <Ship size={18} />, completed: getTabStatus('rates') },
    { id: 'verification', label: 'Vérification', icon: <Shield size={18} />, completed: true },
    { id: 'team', label: 'Équipe', icon: <Users size={18} />, completed: getTabStatus('team') },
    { id: 'locations', label: 'Adresses', icon: <MapPin size={18} />, completed: getTabStatus('locations') },
    { id: 'subscription', label: 'Abonnement', icon: <CreditCard size={18} />, completed: true },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] fluid-bg">
      <TransitaireSidebar />
      <main className={cn(
        "p-4 lg:p-8 max-w-7xl mx-auto transition-all duration-300",
        sidebarCollapsed ? "lg:ml-24" : "lg:ml-72"
      )}>
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 bg-slate-100 rounded-[12px] overflow-hidden border-2 border-white shadow-sm">
                <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              {(user?.profileProgress || 20) === 100 && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-apple-blue text-white rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                  <CheckCircle2 size={8} />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-slate-900 mb-0.5 tracking-tight flex items-center gap-2">
                {user?.name}
                {(user?.profileProgress || 20) === 100 && <CheckCircle2 size={18} className="text-apple-blue" />}
              </h1>
              <p className="text-slate-500 text-[13px] font-normal">Configurez votre profil public, vos tarifs et votre équipe.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              to="/transitaire/shop"
              className="px-4 py-2.5 bg-white border border-slate-100 rounded-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 text-[10px] uppercase tracking-widest"
            >
              <Store size={16} className="text-apple-blue" /> Boutique
            </Link>
            
            <AnimatePresence>
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-green-500 text-white px-4 py-2.5 rounded-[12px] flex items-center gap-2 shadow-lg shadow-green-50 text-[10px] uppercase tracking-widest font-bold"
              >
                <CheckCircle2 size={16} />
                <span>Mis à jour !</span>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </header>

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
                  layoutId="activeTabTransitaire"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-apple-blue"
                />
              )}
            </button>
          ))}
        </div>

        <div className="grid xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === 'verification' && (
              <div className="space-y-8">
                <div className="apple-card !p-8 !rounded-[28px] bg-slate-900 border-none text-white relative overflow-hidden">
                  <div className="relative z-10 max-w-xl">
                    <h3 className="text-[20px] font-bold mb-2">Vérification de l'identité</h3>
                    <p className="text-white/60 text-[14px] mb-6 font-medium">Pour assurer la sécurité de nos utilisateurs, nous vérifions l'identité de tous les transitaires. La vérification est obligatoire pour apparaître en haut des résultats de recherche.</p>
                    <div className="flex items-center gap-3 py-2 px-4 bg-white/10 rounded-full w-fit">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                      <span className="text-[12px] font-bold uppercase tracking-widest">En cours de vérification</span>
                    </div>
                  </div>
                  <Shield size={180} className="absolute -right-10 -bottom-10 text-white/5 rotate-12" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="apple-card !p-8 !rounded-[28px]">
                    <h3 className="text-[16px] font-bold text-slate-900 mb-6">Documents Requis</h3>
                    <div className="space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-[12px] flex items-center justify-center text-slate-400 shrink-0">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-slate-900">Pièce d'Identité (Gérant)</p>
                            <p className="text-[12px] text-slate-500 font-medium">CNI, Passeport ou Permis de conduire</p>
                            <span className="text-[11px] font-black text-green-500 uppercase tracking-widest mt-2 block">Vérifié le 15/03/2024</span>
                          </div>
                        </div>
                        <CheckCircle2 size={20} className="text-green-500" />
                      </div>

                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-[12px] flex items-center justify-center text-slate-400 shrink-0">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-slate-900">Registre du Commerce (RCCM)</p>
                            <p className="text-[12px] text-slate-500 font-medium">Document officiel de votre entreprise</p>
                            <span className="text-[11px] font-black text-orange-400 uppercase tracking-widest mt-2 block">En cours de validation</span>
                          </div>
                        </div>
                        <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                      </div>

                      <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-[20px] text-center">
                        <Plus size={24} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-[13px] font-bold text-slate-900">Ajouter un document</p>
                        <p className="text-[11px] text-slate-500 font-medium mt-1">PDF, JPG ou PNG (Max 5MB)</p>
                        <input type="file" className="hidden" id="doc-upload" />
                        <label htmlFor="doc-upload" className="mt-4 inline-block px-4 py-2 bg-white border border-slate-100 rounded-[10px] text-[11px] font-bold text-apple-blue uppercase tracking-widest cursor-pointer hover:bg-slate-50 shadow-sm transition-all">Parcourir</label>
                      </div>
                    </div>
                  </div>

                  <div className="apple-card !p-8 !rounded-[28px] border-apple-blue/10 bg-blue-50/20">
                    <h3 className="text-[16px] font-bold text-slate-900 mb-6 font-display">Pourquoi la vérification ?</h3>
                    <ul className="space-y-4">
                      {[
                        { title: "Badge de confiance", text: "Un badge bleu apparaîtra sur votre profil public." },
                        { title: "Priorité de recherche", text: "Vos services sont affichés en haut de liste." },
                        { title: "Paiements Simplifiés", text: "Accédez à de nouveaux modes de paiement." },
                        { title: "Support Dédié", text: "Une ligne directe vers notre équipe juridique." }
                      ].map((item, i) => (
                        <li key={i} className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-apple-blue text-white flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={12} />
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-slate-900 mb-0.5">{item.title}</p>
                            <p className="text-[12px] text-slate-500 font-medium">{item.text}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
              {activeTab === 'general' && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* General Info */}
                  <div className="apple-card">
                    <h3 className="text-[16px] font-medium text-slate-900 tracking-tight mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Building2 className="text-apple-blue" size={18} /> Informations Générales
                      </div>
                      {(!generalData.name || !generalData.email || !generalData.phone) && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[8px] font-bold uppercase tracking-widest rounded-full animate-pulse">
                          Incomplet
                        </span>
                      )}
                    </h3>
                    
                    <div className="flex items-center gap-5 mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 bg-slate-100 rounded-[16px] overflow-hidden border-2 border-white shadow-md">
                          <img src="https://picsum.photos/seed/fret1/200/200" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <button className="absolute -bottom-1 -right-1 p-1.5 bg-apple-blue text-white rounded-[8px] shadow-lg">
                          <Camera size={12} />
                        </button>
                      </div>
                      <div className="flex-1">
                        <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-1.5">Nom de l'entreprise</label>
                        <input 
                          type="text" 
                          value={generalData.name} 
                          onChange={(e) => setGeneralData({...generalData, name: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-normal text-slate-900 text-[14px]" 
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-1.5">Type entreprise</label>
                        <select 
                          value={generalData.type}
                          onChange={(e) => setGeneralData({...generalData, type: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-normal appearance-none text-[14px]"
                        >
                          <option>Transitaire</option>
                          <option>Transporteur</option>
                          <option>Agent de douane</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-1.5">Pays d'origine</label>
                        <select 
                          value={generalData.country}
                          onChange={(e) => setGeneralData({...generalData, country: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-normal appearance-none text-[14px]"
                        >
                          {WEST_AFRICAN_COUNTRIES.map(c => (
                            <option key={c.code} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-1.5">Description</label>
                        <textarea 
                          rows={3} 
                          value={generalData.description}
                          onChange={(e) => setGeneralData({...generalData, description: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-normal text-slate-600 text-[14px]" 
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-1.5">Email de contact</label>
                          <input 
                            type="email" 
                            value={generalData.email}
                            onChange={(e) => setGeneralData({...generalData, email: e.target.value})}
                            className="w-full px-4 py-2 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-normal text-slate-900 text-[14px]" 
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-1.5">Téléphone</label>
                          <input 
                            type="text" 
                            value={generalData.phone}
                            onChange={(e) => setGeneralData({...generalData, phone: e.target.value})}
                            className="w-full px-4 py-2 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-normal text-slate-900 text-[14px]" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="apple-card">
                    <h3 className="text-[16px] font-medium text-slate-900 tracking-tight mb-6 flex items-center gap-2.5">
                      <FileText className="text-apple-blue" size={18} /> Documents Légaux
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { name: 'Registre du Commerce', status: 'verified', date: '12/01/2026' },
                        { name: 'Licence de Transport', status: 'verified', date: '15/01/2026' },
                        { name: 'Assurance Logistique', status: 'pending', date: 'En attente' },
                        { name: 'RIB Entreprise', status: 'verified', date: '10/01/2026' }
                      ].map((doc, i) => (
                        <div key={i} className="p-4 rounded-[16px] border border-slate-50 bg-slate-50/30 flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-[10px] flex items-center justify-center text-slate-400 group-hover:text-apple-blue transition-all shadow-sm">
                              <FileText size={16} />
                            </div>
                            <div>
                              <p className="text-[12px] font-semibold text-slate-900">{doc.name}</p>
                              <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">{doc.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.5 rounded-[6px] text-[8px] font-bold uppercase tracking-widest ${
                              doc.status === 'verified' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                              {doc.status === 'verified' ? 'Vérifié' : 'En attente'}
                            </span>
                            <button className="p-1.5 text-slate-400 hover:text-apple-blue transition-all">
                              <Download size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="w-full mt-5 py-3 border border-dashed border-slate-200 rounded-[16px] text-slate-400 font-medium uppercase tracking-widest hover:border-apple-blue hover:text-apple-blue transition-all flex items-center justify-center gap-2 text-[11px]">
                      <Plus size={16} /> Ajouter un document
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'rates' && (
                <motion.div
                  key="rates"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* Transport Options & Rates */}
                  <div className="apple-card">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-[16px] font-medium text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Ship className="text-apple-blue" size={18} /> Tarifs de Transport
                      </h3>
                      <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                        <AlertCircle size={10} /> Temps réel
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {transportOptions.map((opt) => (
                        <div key={opt.id} className={`p-4 rounded-[20px] border transition-all ${opt.active ? 'border-blue-100 bg-blue-50/20' : 'border-slate-50 opacity-60'}`}>
                          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                            <div className="flex items-center gap-3 min-w-[140px]">
                              <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${opt.active ? 'bg-apple-blue text-white shadow-lg shadow-blue-50' : 'bg-slate-200 text-slate-400'}`}>
                                {React.cloneElement(opt.icon as React.ReactElement, { size: 18 })}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 text-[14px]">{opt.type}</p>
                                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">{opt.active ? 'Actif' : 'Inactif'}</p>
                              </div>
                            </div>

                            <div className="flex-1 grid grid-cols-2 gap-3 w-full">
                              <div>
                                <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-1">Prix (FCFA / {opt.unit})</label>
                                <input 
                                  type="number" 
                                  value={opt.price} 
                                  onChange={(e) => handleRateChange(opt.id, 'price', e.target.value)}
                                  className="w-full px-3 py-1.5 bg-white border border-slate-100 rounded-[8px] focus:ring-2 focus:ring-apple-blue transition-all font-normal text-slate-900 text-[13px]"
                                  placeholder="0"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-1">Délai estimé</label>
                                <input 
                                  type="text" 
                                  value={opt.delay} 
                                  onChange={(e) => handleRateChange(opt.id, 'delay', e.target.value)}
                                  className="w-full px-3 py-1.5 bg-white border border-slate-100 rounded-[8px] focus:ring-2 focus:ring-apple-blue transition-all font-normal text-slate-900 text-[13px]"
                                  placeholder="ex: 30-45 jours"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div 
                                onClick={() => handleRateChange(opt.id, 'active', !opt.active)}
                                className={`w-10 h-5 rounded-full relative transition-all cursor-pointer ${opt.active ? 'bg-apple-blue' : 'bg-slate-200'}`}
                              >
                                <motion.div 
                                  animate={{ x: opt.active ? 20 : 4 }}
                                  className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'team' && (
                <motion.div
                  key="team"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Team Search & Add */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text"
                        placeholder="Rechercher un membre..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white rounded-[16px] border border-slate-100 focus:ring-2 focus:ring-apple-blue transition-all text-[13px] font-medium"
                      />
                    </div>
                    <button 
                      onClick={() => setShowAddModal(true)}
                      className="apple-button-primary flex items-center justify-center gap-2.5 !py-3 !px-6 !text-[12px] !font-bold uppercase tracking-wider"
                    >
                      <Plus size={18} /> Ajouter un membre
                    </button>
                  </div>

                  {/* Team Management Section */}
                  <div className="apple-card">
                    <h3 className="text-[16px] font-medium text-slate-900 tracking-tight mb-6 flex items-center gap-2.5">
                      <Users className="text-apple-blue" size={18} /> Gestion de l'Équipe
                    </h3>

                    <div className="space-y-2.5">
                      {filteredTeam.map((member) => (
                        <div key={member.id} className="p-3.5 rounded-[16px] border border-slate-50 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={`https://ui-avatars.com/api/?name=${member.name}&background=random`} className="w-9 h-9 rounded-[10px]" alt="Avatar" />
                            <div>
                              <h4 className="font-semibold text-[13px] text-slate-900">{member.name}</h4>
                              <p className="text-[11px] text-slate-500 font-normal">{member.email}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${getRoleColor(member.role)}`}>
                              {member.role}
                            </span>
                            <button 
                              onClick={() => toggleStatus(member.id)}
                              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`} />
                              <span className="text-[11px] font-semibold text-slate-500 capitalize">{member.status}</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={() => handleEditClick(member)}
                              className="p-2 bg-white text-slate-400 rounded-[8px] hover:bg-blue-50 hover:text-apple-blue transition-all shadow-sm"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(member)}
                              className="p-2 bg-white text-slate-400 rounded-[8px] hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'locations' && (
                <motion.div
                  key="locations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Locations Detail */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Chine Warehouse */}
                    <div className="apple-card !p-8 !rounded-[32px]">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-[16px] flex items-center justify-center font-black">CN</div>
                        <div>
                          <h3 className="text-[18px] font-bold text-slate-900 tracking-tight">Entrepôt Chine</h3>
                          <p className="text-[12px] text-slate-400 font-medium uppercase tracking-widest">Guangzhou / Yiwu</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Adresse Complète</label>
                          <textarea 
                            rows={3}
                            value={generalData.addressChina}
                            onChange={(e) => setGeneralData({...generalData, addressChina: e.target.value})}
                            className="w-full text-[14px] font-medium text-slate-900 bg-slate-50 p-4 rounded-[16px] border border-slate-50 focus:ring-2 focus:ring-apple-blue resize-none transition-all"
                            placeholder="Copiez l'adresse précise ici..."
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Horaires</label>
                            <input type="text" defaultValue="09:00 - 18:00" className="w-full text-[13px] font-bold text-slate-900 bg-slate-50 p-3 rounded-[12px] border-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact</label>
                            <input type="text" defaultValue="+86 185..." className="w-full text-[13px] font-bold text-slate-900 bg-slate-50 p-3 rounded-[12px] border-none" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Afrique Office */}
                    <div className="apple-card !p-8 !rounded-[32px]">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-green-50 text-green-500 rounded-[16px] flex items-center justify-center font-black">SN</div>
                        <div>
                          <h3 className="text-[18px] font-bold text-slate-900 tracking-tight">Bureau Dakar</h3>
                          <p className="text-[12px] text-slate-400 font-medium uppercase tracking-widest">Sénégal</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Adresse de Réception</label>
                          <textarea 
                            rows={3}
                            value={generalData.addressAfrica}
                            onChange={(e) => setGeneralData({...generalData, addressAfrica: e.target.value})}
                            className="w-full text-[14px] font-medium text-slate-900 bg-slate-50 p-4 rounded-[16px] border border-slate-50 focus:ring-2 focus:ring-apple-blue resize-none transition-all"
                            placeholder="Dakar, Plateau, Rue..."
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Horaires</label>
                            <input type="text" defaultValue="08:30 - 19:00" className="w-full text-[13px] font-bold text-slate-900 bg-slate-50 p-3 rounded-[12px] border-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact</label>
                            <input type="text" defaultValue="+221 77..." className="w-full text-[13px] font-bold text-slate-900 bg-slate-50 p-3 rounded-[12px] border-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-4 border-2 border-dashed border-slate-100 rounded-[28px] text-slate-400 font-bold uppercase tracking-widest hover:border-apple-blue hover:text-apple-blue transition-all flex items-center justify-center gap-3 text-[12px] bg-slate-50/30">
                    <Plus size={20} /> Ajouter une autre agence
                  </button>
                </motion.div>
              )}

              {activeTab === 'subscription' && (
                <motion.div
                  key="subscription"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Current Plan Info */}
                  <div className="apple-card bg-slate-900 text-white border-none !p-8 !rounded-[28px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-apple-blue/20 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-white/10 rounded-[14px] flex items-center justify-center text-apple-blue">
                          <Rocket size={24} />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Forfait Actuel</p>
                          <h3 className="text-[20px] font-bold text-white tracking-tight">Plan Pro</h3>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-8">
                        <div>
                          <p className="text-[12px] font-semibold text-white/50 uppercase tracking-widest mb-1">Prochain paiement</p>
                          <p className="text-[16px] font-semibold text-white">12 Mai 2026</p>
                        </div>
                        <div>
                          <p className="text-[12px] font-semibold text-white/50 uppercase tracking-widest mb-1">Montant</p>
                          <p className="text-[16px] font-semibold text-white">14 500 FCFA</p>
                        </div>
                        <div>
                          <p className="text-[12px] font-semibold text-white/50 uppercase tracking-widest mb-1">Statut</p>
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-[11px] font-bold uppercase tracking-widest">Actif</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Plans Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {plans.map((plan) => (
                      <div 
                        key={plan.id}
                        className={cn(
                          "apple-card !p-6 !rounded-[24px] flex flex-col transition-all border-2",
                          user?.subscription === plan.id ? "border-apple-blue" : "border-transparent"
                        )}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className={cn("w-10 h-10 rounded-[12px] flex items-center justify-center", plan.id === 'pro' ? 'bg-blue-50 text-apple-blue' : 'bg-slate-50 text-slate-400')}>
                            {plan.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 text-[16px]">{plan.name}</h4>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{plan.price}</p>
                          </div>
                        </div>
                        <p className="text-[13px] text-slate-500 font-normal mb-6 flex-1">{plan.description}</p>
                        <div className="space-y-2.5 mb-6">
                          {plan.features.slice(0, 4).map((f, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Check size={12} className="text-green-500" />
                              <span className="text-[12px] font-medium text-slate-700">{f}</span>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => handleSubscribe(plan.id)}
                          className={cn(
                            "w-full py-2.5 rounded-[12px] font-bold text-[11px] uppercase tracking-widest transition-all",
                            user?.subscription === plan.id ? "bg-slate-100 text-slate-400 cursor-default" : "bg-slate-900 text-white hover:bg-apple-blue"
                          )}
                        >
                          {user?.subscription === plan.id ? 'Forfait actuel' : 'Changer'}
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-8">
            {/* Profile Progress Card */}
            <div className="apple-card !p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight">Progression Profil</h3>
                <span className="text-apple-blue font-bold text-[12px]">{user?.profileProgress || 20}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${user?.profileProgress || 20}%` }}
                  className="h-full bg-apple-blue"
                />
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Infos entreprise', done: !!user?.name, tab: 'general' },
                  { label: 'Tarifs transport', done: transportOptions.some(o => o.active && o.price !== '0'), tab: 'rates' },
                  { label: 'Documents légaux', done: true, tab: 'general' }, // Mocked as true for now
                  { label: 'Adresses entrepôts', done: true, tab: 'locations' } // Mocked as true for now
                ].map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveTab(item.tab as any)}
                    className="flex items-center gap-2 w-full hover:bg-slate-50 p-1 rounded-lg transition-all"
                  >
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${item.done ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-300'}`}>
                      <CheckCircle2 size={8} />
                    </div>
                    <span className={`text-[12px] font-medium ${item.done ? 'text-slate-900' : 'text-slate-400'}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="apple-card !p-5">
              <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight mb-5 flex items-center gap-2.5">
                <BarChart3 className="text-apple-blue" size={16} /> Statistiques
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-medium text-slate-500">Membres équipe</span>
                  <span className="text-[14px] font-semibold text-slate-900">{team.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-medium text-slate-500">Services actifs</span>
                  <span className="text-[14px] font-semibold text-slate-900">{transportOptions.filter(o => o.active).length}</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full py-3.5 rounded-[16px] font-semibold text-[14px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2.5 ${
                isSaving ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white shadow-slate-200 hover:bg-apple-blue'
              }`}
            >
              {isSaving ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Save size={16} />
                  </motion.div>
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Enregistrer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
      {/* Modals Section */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-8 md:p-10 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-[22px] font-bold text-slate-900 mb-1 tracking-tight">Ajouter un membre</h3>
                  <p className="text-slate-500 font-medium text-[15px]">Invitez un nouveau collaborateur.</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddMember} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Nom complet</label>
                    <input 
                      type="text" required value={newMember.name}
                      onChange={e => setNewMember({...newMember, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-[16px] focus:ring-2 focus:ring-apple-blue transition-all text-[15px] font-medium"
                      placeholder="Ex: Moussa Diop"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Email</label>
                    <input 
                      type="email" required value={newMember.email}
                      onChange={e => setNewMember({...newMember, email: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-[16px] focus:ring-2 focus:ring-apple-blue transition-all text-[15px] font-medium"
                      placeholder="moussa@entreprise.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Pays</label>
                    <select 
                      required value={newMember.country}
                      onChange={e => {
                        const countryName = e.target.value;
                        const country = WEST_AFRICAN_COUNTRIES.find(c => c.name === countryName);
                        setNewMember({
                          ...newMember, 
                          country: countryName,
                          phoneIndicator: country?.indicator || newMember.phoneIndicator
                        });
                      }}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-[16px] focus:ring-2 focus:ring-apple-blue transition-all text-[15px] font-medium appearance-none"
                    >
                      {WEST_AFRICAN_COUNTRIES.map(c => (
                        <option key={c.code} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Téléphone</label>
                    <div className="flex gap-2">
                      <select
                        value={newMember.phoneIndicator}
                        onChange={(e) => setNewMember({...newMember, phoneIndicator: e.target.value})}
                        className="w-20 px-2 py-3 bg-slate-50 border-none rounded-[16px] focus:ring-2 focus:ring-apple-blue transition-all text-[13px] font-bold appearance-none text-center"
                      >
                        {WEST_AFRICAN_COUNTRIES.map(c => (
                          <option key={c.code} value={c.indicator}>{c.indicator}</option>
                        ))}
                      </select>
                      <input 
                        type="tel" required value={newMember.phone}
                        onChange={e => setNewMember({...newMember, phone: e.target.value})}
                        className="flex-1 px-4 py-3 bg-slate-50 border-none rounded-[16px] focus:ring-2 focus:ring-apple-blue transition-all text-[15px] font-medium"
                        placeholder="77 000 00 00"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Rôle</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {roles.map(role => (
                      <button
                        key={role} type="button"
                        onClick={() => setNewMember({...newMember, role})}
                        className={cn(
                          "px-3 py-2.5 rounded-[12px] text-[12px] font-semibold uppercase tracking-wider transition-all border-2",
                          newMember.role === role ? "bg-apple-blue border-apple-blue text-white" : "bg-white border-slate-100 text-slate-400"
                        )}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition-all shadow-xl">
                  Ajouter à l'équipe
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showEditModal && memberToEdit && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-8 md:p-10 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-[22px] font-bold text-slate-900 mb-1 tracking-tight">Modifier le membre</h3>
                </div>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateMember} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Nom complet</label>
                    <input 
                      type="text" required value={memberToEdit.name}
                      onChange={e => setMemberToEdit({...memberToEdit, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-[16px] focus:ring-2 focus:ring-apple-blue transition-all text-[15px] font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Email</label>
                    <input 
                      type="email" required value={memberToEdit.email}
                      onChange={e => setMemberToEdit({...memberToEdit, email: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-[16px] focus:ring-2 focus:ring-apple-blue transition-all text-[15px] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Rôle</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {roles.map(role => (
                      <button
                        key={role} type="button"
                        onClick={() => setMemberToEdit({...memberToEdit, role})}
                        className={cn(
                          "px-3 py-2.5 rounded-[12px] text-[12px] font-semibold uppercase tracking-wider transition-all border-2",
                          memberToEdit.role === role ? "bg-apple-blue border-apple-blue text-white" : "bg-white border-slate-100 text-slate-400"
                        )}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition-all">
                  Enregistrer
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 overflow-hidden text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Supprimer ?</h3>
              <p className="text-slate-500 font-medium mb-8">
                Voulez-vous vraiment supprimer <span className="text-slate-900 font-bold">{memberToDelete?.name}</span> ?
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={confirmDelete} className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all">
                  Oui, supprimer
                </button>
                <button onClick={() => setShowDeleteModal(false)} className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all">
                  Annuler
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
