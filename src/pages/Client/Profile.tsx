import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { 
  User, Mail, Phone, MapPin, Shield, 
  Bell, CreditCard, Globe, LogOut, 
  ChevronRight, Camera, ArrowLeft,
  Settings as SettingsIcon, Heart, HelpCircle, X, Home, Search, Package, MessageSquare,
  Save, Lock, Smartphone, Eye, EyeOff, Layout, CreditCard as BillingIcon,
  Languages, Coins, BellRing, MapPinned, Plus
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ClientSidebar from '../../components/Client/Sidebar';
import { WEST_AFRICAN_COUNTRIES } from '../../constants';
import { cn } from '../../lib/utils';

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 lg:hidden">
      <Link to="/client/dashboard" className={cn("flex flex-col items-center gap-1 transition-all", isActive('/client/dashboard') ? "text-blue-600" : "text-slate-400")}>
        <Home size={22} strokeWidth={isActive('/client/dashboard') ? 2.5 : 2} />
        <span className="text-[11px] font-medium">Accueil</span>
      </Link>
      <Link to="/client/explorer" className={cn("flex flex-col items-center gap-1 transition-all", isActive('/client/explorer') ? "text-blue-600" : "text-slate-400")}>
        <Search size={22} strokeWidth={isActive('/client/explorer') ? 2.5 : 2} />
        <span className="text-[11px] font-medium">Explorer</span>
      </Link>
      <Link to="/client/orders" className={cn("flex flex-col items-center gap-1 transition-all", isActive('/client/orders') ? "text-blue-600" : "text-slate-400")}>
        <Package size={22} strokeWidth={isActive('/client/orders') ? 2.5 : 2} />
        <span className="text-[11px] font-medium">Colis</span>
      </Link>
      <Link to="/client/messages" className={cn("flex flex-col items-center gap-1 transition-all", isActive('/client/messages') ? "text-blue-600" : "text-slate-400")}>
        <MessageSquare size={22} strokeWidth={isActive('/client/messages') ? 2.5 : 2} />
        <span className="text-[11px] font-medium">Messages</span>
      </Link>
      <Link to="/client/profile" className={cn("flex flex-col items-center gap-1 transition-all", isActive('/client/profile') ? "text-blue-600" : "text-slate-400")}>
        <User size={22} strokeWidth={isActive('/client/profile') ? 2.5 : 2} />
        <span className="text-[11px] font-medium">Profil</span>
      </Link>
    </nav>
  );
};

export default function ClientProfile() {
  const { user, setUser, updateProfile, logout, addNotification, language, setLanguage, currency, setCurrency, sidebarCollapsed } = useApp();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'delivery'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || WEST_AFRICAN_COUNTRIES[0].name,
    notifications: {
      status: true,
      promo: false,
      sms: true
    },
    addresses: user?.addresses || []
  });

  // Sync state with user data from context
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || WEST_AFRICAN_COUNTRIES[0].name,
        addresses: user.addresses || []
      }));
    }
  }, [user?.id, user?.addresses]);

  const [newAddress, setNewAddress] = useState({
    name: '',
    recipient: '',
    phone: '',
    address: '',
    city: ''
  });

  const handleAddAddress = async () => {
    if (!newAddress.name || !newAddress.address) return;
    
    const id = Date.now().toString();
    const updatedAddresses = [...formData.addresses, { ...newAddress, id, isDefault: formData.addresses.length === 0 }];
    
    setFormData({
      ...formData,
      addresses: updatedAddresses
    });
    
    await updateProfile({
      addresses: updatedAddresses
    });
    
    setNewAddress({ name: '', recipient: '', phone: '', address: '', city: '' });
    setShowAddAddressModal(false);
    
    addNotification({
      title: 'Adresse ajoutée',
      content: `L'adresse "${newAddress.name}" a été ajoutée à votre carnet.`,
      type: 'system'
    });
  };

  const removeAddress = async (id: string) => {
    const updatedAddresses = formData.addresses.filter(a => a.id !== id);
    setFormData({ ...formData, addresses: updatedAddresses });
    await updateProfile({ addresses: updatedAddresses });
  };

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country
      });
      
      setSaveSuccess(true);
      addNotification({
        title: 'Profil mis à jour',
        content: 'Vos modifications ont été enregistrées avec succès.',
        type: 'success'
      });
      
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      addNotification({
        title: 'Erreur',
        content: 'Impossible de mettre à jour le profil.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const tabs = [
    { id: 'profile', label: 'Mon profil', icon: <User size={18} /> },
    { id: 'security', label: 'Sécurité', icon: <Lock size={18} /> },
    { id: 'preferences', label: 'Préférences', icon: <SettingsIcon size={18} /> },
    { id: 'delivery', label: 'Livraison', icon: <MapPinned size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24 lg:pb-0">
      <ClientSidebar />
      
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "lg:ml-24" : "lg:ml-72"
      )}>
        {/* Breadcrumbs & Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[15px] font-medium text-slate-500">
              <Layout size={16} className="text-slate-400" />
              <span>Transify</span>
              <ChevronRight size={14} className="text-slate-300" />
              <span className="text-slate-900">Paramètres</span>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-6 lg:p-10">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-slate-900 mb-2 tracking-tight">Paramètres du compte</h1>
            <p className="text-[15px] text-slate-500 font-normal">Gérez vos informations personnelles et la sécurité de votre compte</p>
          </div>

          {/* Tabs Navigation */}
          <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 py-4 text-[15px] font-medium transition-all relative",
                  activeTab === tab.id ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-8"
                >
                  <h2 className="text-[22px] font-bold text-slate-900 mb-8 tracking-tight">Paramètres de l'utilisateur</h2>
                  
                  {/* Profile Photo */}
                  <div className="flex items-center gap-6 mb-10">
                    <div className="relative group cursor-pointer">
                      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 group-hover:border-blue-400 transition-all">
                        <User size={40} />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/5 rounded-full transition-all" />
                    </div>
                    <div>
                      <p className="text-[16px] font-bold text-slate-900 mb-1">Photo de profil</p>
                      <p className="text-[14px] text-slate-500 font-normal">Cliquez pour changer votre photo de profil</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6 max-w-2xl">
                    <div>
                      <label className="block text-[14px] font-medium text-slate-700 mb-2">Nom complet</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-[#f3f4f6] border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all font-medium text-[15px] text-slate-900" 
                      />
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-slate-700 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 bg-[#f3f4f6] border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all font-medium text-[15px] text-slate-900" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-slate-700 mb-2">Numéro de téléphone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+221 77 000 00 00" 
                          className="w-full pl-12 pr-4 py-3 bg-[#f3f4f6] border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all font-medium text-[15px] text-slate-900" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t border-slate-100 flex items-center gap-4">
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className={cn(
                        "px-8 py-3 rounded-lg font-medium text-[14px] transition-all shadow-md flex items-center gap-2",
                        saveSuccess ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
                      )}
                    >
                      {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : saveSuccess ? (
                        <>Enregistré !</>
                      ) : (
                        <>Enregistrer les modifications</>
                      )}
                    </button>
                    {saveSuccess && (
                      <motion.p 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-green-600 text-[14px] font-medium"
                      >
                        Modifications appliquées
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-8"
                >
                  <h2 className="text-[22px] font-bold text-slate-900 mb-8 tracking-tight">Sécurité du compte</h2>
                  
                  <div className="space-y-8 max-w-2xl">
                    <div>
                      <label className="block text-[14px] font-medium text-slate-700 mb-2">Mot de passe actuel</label>
                      <input 
                        type="password" 
                        value={passwords.current}
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                        className="w-full px-4 py-3 bg-[#f3f4f6] border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all font-medium text-[15px]" 
                      />
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-slate-700 mb-2">Nouveau mot de passe</label>
                      <input 
                        type="password" 
                        value={passwords.new}
                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                        className="w-full px-4 py-3 bg-[#f3f4f6] border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all font-medium text-[15px]" 
                      />
                    </div>
                    
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                          <Smartphone size={24} />
                        </div>
                        <div>
                          <p className="text-[16px] font-bold text-slate-900">Double authentification (2FA)</p>
                          <p className="text-[14px] text-slate-500 font-normal">Ajoutez une couche de sécurité supplémentaire</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-medium hover:bg-slate-50 transition-all">
                        Activer
                      </button>
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t border-slate-100">
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium text-[14px] hover:bg-blue-700 transition-all shadow-md"
                    >
                      {isSaving ? "Mise à jour..." : "Mettre à jour la sécurité"}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-8"
                >
                  <h2 className="text-[22px] font-bold text-slate-900 mb-8 tracking-tight">Préférences & Localisation</h2>
                  
                  <div className="space-y-8 max-w-2xl">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[14px] font-medium text-slate-700 mb-2 flex items-center gap-2">
                          <Languages size={16} /> Langue
                        </label>
                        <select 
                          value={language}
                          onChange={(e) => {
                            setLanguage(e.target.value);
                            addNotification({
                              title: 'Langue modifiée',
                              message: `La langue a été changée en ${e.target.value}`,
                              type: 'success'
                            });
                          }}
                          className="w-full px-4 py-3 bg-[#f3f4f6] border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all font-medium text-[15px]"
                        >
                          <option>Français (FR)</option>
                          <option>English (US)</option>
                          <option>Español (ES)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[14px] font-medium text-slate-700 mb-2 flex items-center gap-2">
                          <Coins size={16} /> Devise par défaut
                        </label>
                        <select 
                          value={currency}
                          onChange={(e) => {
                            setCurrency(e.target.value);
                            addNotification({
                              title: 'Devise modifiée',
                              message: `La devise a été changée en ${e.target.value}`,
                              type: 'success'
                            });
                          }}
                          className="w-full px-4 py-3 bg-[#f3f4f6] border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all font-medium text-[15px]"
                        >
                          <option>FCFA</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[16px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <BellRing size={16} /> Notifications
                      </h3>
                      <div className="space-y-3">
                        {[
                          { id: 'status', label: 'Mises à jour du statut des colis', desc: 'Recevoir une alerte à chaque étape du transit' },
                          { id: 'promo', label: 'Offres promotionnelles', desc: 'Être informé des réductions et nouveaux tarifs' },
                          { id: 'sms', label: 'Alertes SMS', desc: 'Recevoir un SMS lors de l\'arrivée au pays' }
                        ].map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => setFormData({
                              ...formData, 
                              notifications: {
                                ...formData.notifications, 
                                [notif.id]: !formData.notifications[notif.id as keyof typeof formData.notifications]
                              }
                            })}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-all"
                          >
                            <div>
                              <p className="text-[15px] font-bold text-slate-900">{notif.label}</p>
                              <p className="text-[13px] text-slate-500 font-normal">{notif.desc}</p>
                            </div>
                            <div className={cn(
                              "w-10 h-5 rounded-full relative transition-all",
                              formData.notifications[notif.id as keyof typeof formData.notifications] ? "bg-blue-600" : "bg-slate-300"
                            )}>
                              <motion.div 
                                animate={{ x: formData.notifications[notif.id as keyof typeof formData.notifications] ? 20 : 0 }}
                                className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t border-slate-100">
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium text-[14px] hover:bg-blue-700 transition-all shadow-md"
                    >
                      {isSaving ? "Enregistrement..." : "Enregistrer les préférences"}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'delivery' && (
                <motion.div
                  key="delivery"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-8"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Carnet d'adresses & Livraison</h2>
                    <button 
                      onClick={() => setShowAddAddressModal(true)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[13px] font-medium hover:bg-slate-800 transition-all flex items-center gap-2"
                    >
                      <Plus size={16} /> Ajouter une adresse
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.addresses.map((addr) => (
                      <div key={addr.id} className={cn(
                        "p-6 rounded-2xl relative transition-all",
                        addr.isDefault ? "bg-white border-2 border-blue-100" : "bg-slate-50 border border-slate-100 hover:border-slate-200"
                      )}>
                        {addr.isDefault && (
                          <div className="absolute top-4 right-4 px-2 py-1 bg-blue-50 text-blue-600 text-[11px] font-medium rounded">Défaut</div>
                        )}
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            addr.isDefault ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400"
                          )}>
                            <MapPin size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-[16px] font-bold text-slate-900">{addr.name}</p>
                              <div className="flex items-center gap-3">
                                {!addr.isDefault && (
                                  <button 
                                    onClick={() => {
                                      const updated = formData.addresses.map(a => ({...a, isDefault: a.id === addr.id}));
                                      setFormData({...formData, addresses: updated});
                                      updateProfile({ addresses: updated });
                                    }}
                                    className="text-[12px] font-medium text-blue-600 hover:underline"
                                  >
                                    Par défaut
                                  </button>
                                )}
                                <button 
                                  onClick={() => removeAddress(addr.id)}
                                  className="text-[12px] font-medium text-red-500 hover:underline"
                                >
                                  Supprimer
                                </button>
                              </div>
                            </div>
                            <p className="text-[14px] text-slate-500 font-normal mb-1">{addr.address}, {addr.city}</p>
                            <p className="text-[13px] font-bold text-slate-900 mb-1">{addr.recipient}</p>
                            <p className="text-[13px] font-medium text-slate-500">{addr.phone}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Danger Zone */}
          <div className="mt-12 p-8 bg-red-50/50 rounded-2xl border border-red-100">
            <h3 className="text-[18px] font-bold text-red-900 mb-2 tracking-tight">Zone de danger</h3>
            <p className="text-[14px] text-red-700 font-normal mb-6">Une fois votre compte supprimé, toutes vos données de transit et historiques seront définitivement effacés.</p>
            <button className="px-6 py-3 bg-white border border-red-200 text-red-600 rounded-lg font-medium text-[13px] hover:bg-red-50 transition-all">
              Supprimer mon compte
            </button>
          </div>
          
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-medium text-[14px] transition-all"
            >
              <LogOut size={16} /> Se déconnecter de la session
            </button>
          </div>
        </main>

      {/* Add Address Modal */}
      <AnimatePresence>
        {showAddAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddAddressModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[22px] font-bold tracking-tight">Nouvelle adresse</h3>
                <button onClick={() => setShowAddAddressModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Nom de l'adresse</label>
                    <input 
                      type="text" 
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                      placeholder="Ex: Maison"
                      className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600 transition-all font-medium text-[15px]" 
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Ville</label>
                    <input 
                      type="text" 
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      placeholder="Dakar"
                      className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600 transition-all font-medium text-[15px]" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Nom du destinataire</label>
                  <input 
                    type="text" 
                    value={newAddress.recipient}
                    onChange={(e) => setNewAddress({...newAddress, recipient: e.target.value})}
                    placeholder="Moussa Diop"
                    className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600 transition-all font-medium text-[15px]" 
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Adresse complète</label>
                  <textarea 
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                    placeholder="Quartier, Rue, Numéro de villa..."
                    rows={2}
                    className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600 transition-all font-medium text-[15px] resize-none" 
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Téléphone de contact</label>
                  <input 
                    type="tel" 
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                    placeholder="+221 77 000 00 00"
                    className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600 transition-all font-medium text-[15px]" 
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAddAddressModal(false)}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-all text-[14px]"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleAddAddress}
                  className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all text-[14px]"
                >
                  Ajouter l'adresse
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[40px] p-8 shadow-2xl"
            >
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <LogOut size={28} />
              </div>
              <h3 className="text-[18px] font-bold text-center mb-1.5 tracking-tight">Se déconnecter ?</h3>
              <p className="text-[14px] text-slate-500 text-center mb-8 font-normal">Êtes-vous sûr de vouloir quitter votre session Transify ?</p>
              
              <div className="space-y-3">
                <button 
                  onClick={handleLogout}
                  className="w-full py-3.5 bg-red-600 text-white rounded-xl font-medium shadow-lg shadow-red-200 hover:bg-red-700 transition-all text-[14px]"
                >
                  Oui, me déconnecter
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-3.5 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-all text-[14px]"
                >
                  Annuler
                </button>
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
