import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { 
  Package, Search, Filter, QrCode, 
  Plus, MoreVertical, Ship, Plane, 
  Zap, CheckCircle2, AlertCircle, Clock,
  Edit3, Trash2, Phone, MessageSquare,
  LayoutDashboard, Users, BarChart3, Settings, LogOut, X,
  Truck, MapPin, FileText, Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice, formatDate, cn } from '../../lib/utils';
import TransitaireSidebar from '../../components/Transitaire/Sidebar';

export default function TransitaireOrders() {
  const { orders, updateOrder, addOrder, user, companies, addNotification, sidebarCollapsed } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const companyOrders = orders.filter(o => {
    const isOwner = o.companyId === user?.companyId;
    const matchesFilter = filter === 'all' ? true : o.status === filter;
    const matchesSearch = search === '' ? true : 
      o.id.toLowerCase().includes(search.toLowerCase()) || 
      o.clientName.toLowerCase().includes(search.toLowerCase()) ||
      o.trackingNumber.toLowerCase().includes(search.toLowerCase());
    
    return isOwner && matchesFilter && matchesSearch;
  });

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const toggleSelectAll = () => {
    if (selectedOrders.length === companyOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(companyOrders.map(o => o.id));
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
    );
  };

  const handleBulkStatusUpdate = async (newStatus: any) => {
    for (const id of selectedOrders) {
      await updateOrder(id, { status: newStatus });
    }
    setSelectedOrders([]);
    addNotification({
      title: 'Mise à jour groupée',
      content: `${selectedOrders.length} colis mis à jour avec succès.`,
      type: 'system'
    });
  };
  const [newOrder, setNewOrder] = useState({
    clientName: '',
    clientPhone: '',
    description: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    destination: 'Sénégal',
    serviceType: 'aérien' as 'aérien' | 'maritime' | 'express'
  });

  const handleAddOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!user?.companyId) return;

    const company = companies.find(c => c.id === user.companyId);
    
    const trackingId = `TRX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Get actual rates from company data
    const matchingService = company?.services?.find(s => s.type === newOrder.serviceType);
    const rate = matchingService?.pricePerUnit || 6500; // Fallback to 6500 if not found
    
    const weightVal = parseFloat(newOrder.weight) || 0;
    
    // Calcul du volume (CBM) si les dimensions sont renseignées
    const l = parseFloat(newOrder.length) || 0;
    const w = parseFloat(newOrder.width) || 0;
    const h = parseFloat(newOrder.height) || 0;
    const calculatedCbm = l * w * h;

    const basePrice = newOrder.serviceType === 'maritime' ? (calculatedCbm || 0) * rate : weightVal * rate;

    const orderData = {
      id: trackingId,
      clientId: 'u_new_' + Date.now(),
      clientName: newOrder.clientName,
      clientPhone: newOrder.clientPhone,
      companyId: user.companyId,
      companyName: company?.name || 'Ma Compagnie',
      serviceId: matchingService?.id || 's_default',
      serviceType: newOrder.serviceType,
      status: 'received' as const,
      paymentStatus: 'unpaid' as const,
      weight: weightVal,
      cbm: calculatedCbm || 0,
      dimensions: {
        length: l,
        width: w,
        height: h
      },
      price: basePrice,
      destination: newOrder.destination,
      trackingNumber: trackingId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: newOrder.description,
      qrCode: trackingId,
    };

    addOrder(orderData);
    
    // Trigger notification
    addNotification({
      title: 'Nouveau colis réceptionné',
      content: `Le colis ${trackingId} pour ${newOrder.clientName} a été enregistré.`,
      type: 'order',
      timestamp: new Date().toISOString()
    });

    setShowAddModal(false);
    setNewOrder({
      clientName: '',
      clientPhone: '',
      description: '',
      weight: '',
      length: '',
      width: '',
      height: '',
      destination: 'Sénégal',
      serviceType: 'aérien'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'in_transit': return 'bg-blue-100 text-blue-600';
      case 'received': return 'bg-yellow-100 text-yellow-600';
      case 'problem': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] fluid-bg">
      <TransitaireSidebar />
      <main className={cn(
        "p-4 lg:p-8 max-w-7xl mx-auto transition-all duration-300",
        sidebarCollapsed ? "lg:ml-24" : "lg:ml-72"
      )}>
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 mb-1 tracking-tight">Gestion des Commandes</h1>
            <p className="text-[15px] text-slate-500 font-normal">Suivez et mettez à jour le statut de chaque colis.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              className="bg-white border border-slate-100 text-slate-600 py-3 px-6 rounded-[16px] flex items-center gap-3 hover:bg-slate-50 transition-all font-bold text-[14px]"
            >
              <Download size={20} className="text-apple-blue" /> <span className="text-[14px] font-medium tracking-tight">Exporter CSV</span>
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-apple-blue text-white py-3 px-6 rounded-[16px] flex items-center gap-3 shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
            >
              <Plus size={20} /> <span className="text-[14px] font-medium">Ajouter un colis</span>
            </button>
          </div>
        </header>

        <AnimatePresence>
          {selectedOrders.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 border border-white/10 text-white px-8 py-4 rounded-[28px] shadow-2xl flex items-center gap-10 backdrop-blur-xl shrink-0"
            >
              <div className="flex items-center gap-4 border-r border-white/10 pr-10">
                <div className="w-10 h-10 bg-apple-blue rounded-[12px] flex items-center justify-center font-black text-[14px]">
                  {selectedOrders.length}
                </div>
                <div className="whitespace-nowrap">
                  <p className="font-bold text-[14px]">Colis sélectionnés</p>
                  <button onClick={() => setSelectedOrders([])} className="text-[11px] text-slate-400 hover:text-white font-bold uppercase tracking-widest transition-colors">Tout désélectionner</button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mr-2">Action groupée :</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleBulkStatusUpdate('loaded')}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-[12px] text-[11px] font-bold uppercase tracking-widest transition-all"
                  >
                    Charger
                  </button>
                  <button 
                    onClick={() => handleBulkStatusUpdate('arrived')}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-[12px] text-[11px] font-bold uppercase tracking-widest transition-all"
                  >
                    Arrivé
                  </button>
                  <button 
                    className="p-2.5 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-[12px] transition-all"
                    title="Imprimer les étiquettes"
                  >
                    <QrCode size={18} />
                  </button>
                  <button 
                    className="p-2.5 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-[12px] transition-all"
                    title="Annuler les colis"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-4 no-scrollbar">
          {['all', 'pending', 'received', 'in_transit', 'arrived', 'delivered', 'problem'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-5 py-2.5 rounded-full text-[13px] font-medium transition-all whitespace-nowrap",
                filter === f 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" 
                  : "bg-white text-slate-400 border border-slate-100 hover:border-slate-900"
              )}
            >
              {f === 'all' ? 'Tous' : f === 'in_transit' ? 'En transit' : f}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="apple-card !p-0 !rounded-[28px] overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher ID, Client..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-[16px] focus:ring-2 focus:ring-apple-blue transition-all text-[15px] font-medium tracking-tight"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-[16px] font-medium text-[14px] hover:bg-slate-100 transition-all">
              <Filter size={16} /> Filtres avancés
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-200 text-apple-blue focus:ring-apple-blue cursor-pointer"
                      checked={selectedOrders.length === companyOrders.length && companyOrders.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-8 py-4 text-[12px] font-medium text-slate-400">ID Colis</th>
                  <th className="px-8 py-4 text-[12px] font-medium text-slate-400">Client</th>
                  <th className="px-8 py-4 text-[12px] font-medium text-slate-400">Détails</th>
                  <th className="px-8 py-4 text-[12px] font-medium text-slate-400">Paiement</th>
                  <th className="px-8 py-4 text-[12px] font-medium text-slate-400">Statut</th>
                  <th className="px-8 py-4 text-[12px] font-medium text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {companyOrders.map(order => (
                  <tr key={order.id} className={cn("hover:bg-slate-50/50 transition-colors group cursor-pointer", selectedOrders.includes(order.id) ? "bg-blue-50/30 shadow-inner" : "")}>
                    <td className="px-8 py-6">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-200 text-apple-blue focus:ring-apple-blue cursor-pointer"
                        checked={selectedOrders.includes(order.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelectOrder(order.id);
                        }}
                      />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-mono text-[12px] font-bold text-slate-900 tracking-tighter">{order.trackingNumber}</span>
                        <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">{formatDate(order.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-[12px] flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                          {order.clientName?.split(' ').map(n => n[0]).join('') || 'JC'}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[14px] text-slate-900 truncate max-w-[150px] tracking-tight">{order.clientName || 'Jean Client'}</span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">{order.clientPhone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-400">
                          {order.serviceType === 'aérien' || order.serviceType === 'express' ? <Plane size={14} /> : <Ship size={14} />}
                          <span className="text-[8px] font-bold uppercase tracking-widest">{order.serviceType}</span>
                        </div>
                        <span className="text-[14px] font-bold text-slate-900 tracking-tighter">{order.weight || order.cbm} {order.weight ? 'kg' : 'cbm'}</span>
                        <span className="text-[11px] font-bold text-apple-blue">{formatPrice(order.price || 0)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOrder(order.id, { paymentStatus: order.paymentStatus === 'paid' ? 'unpaid' : 'paid' });
                        }}
                        className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all",
                          order.paymentStatus === 'paid' ? "bg-green-100 text-green-600" : "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                        )}
                      >
                        {order.paymentStatus === 'paid' ? 'Payé' : 'Non Payé'}
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn("px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest", getStatusColor(order.status))}>
                        {order.status === 'in_transit' ? 'En transit' : order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="relative group/actions">
                          <button className="p-2.5 bg-slate-50 text-slate-400 rounded-[10px] hover:bg-slate-100 transition-all">
                            <MoreVertical size={16} />
                          </button>
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 opacity-0 group-hover/actions:opacity-100 pointer-events-none group-hover/actions:pointer-events-auto z-20 transition-all">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const url = `${window.location.origin}/track/${order.trackingNumber}`;
                                navigator.clipboard.writeText(url);
                                addNotification({
                                  title: 'Lien copié',
                                  content: 'Le lien de suivi a été copié dans le presse-papiers.',
                                  type: 'system'
                                });
                              }}
                              className="w-full text-left px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Zap size={14} className="text-orange-400" /> Partager le suivi
                            </button>
                            <div className="h-px bg-slate-50 my-1" />
                            <button 
                              onClick={() => updateOrder(order.id, { status: 'received' })}
                              className="w-full text-left px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Package size={14} /> Reçu au dépôt
                            </button>
                            <button 
                              onClick={() => updateOrder(order.id, { status: 'loaded' })}
                              className="w-full text-left px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Truck size={14} /> Chargé / Envoi
                            </button>
                            <button 
                              onClick={() => updateOrder(order.id, { status: 'arrived' })}
                              className="w-full text-left px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <MapPin size={14} /> Arrivé au pays
                            </button>
                            <button 
                              onClick={() => updateOrder(order.id, { status: 'delivered' })}
                              className="w-full text-left px-4 py-2 text-[13px] font-medium text-green-600 hover:bg-green-50 flex items-center gap-2"
                            >
                              <CheckCircle2 size={14} /> Marquer Livré
                            </button>
                            <div className="h-px bg-slate-50 my-1" />
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedInvoice(order);
                              }}
                              className="w-full text-left px-4 py-2 text-[13px] font-bold text-apple-blue hover:bg-blue-50 flex items-center gap-2"
                            >
                              <FileText size={14} /> Imprimer Facture
                            </button>
                            <div className="h-px bg-slate-50 my-2" />
                            <button 
                              onClick={() => updateOrder(order.id, { status: 'problem' })}
                              className="w-full text-left px-4 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <AlertCircle size={14} /> Signaler Problème
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-slate-50 flex justify-between items-center">
            <p className="text-[13px] text-slate-400 font-medium">Affichage de 1-10 sur 124 commandes</p>
            <div className="flex gap-3">
              <button className="px-5 py-2 border border-slate-200 rounded-[12px] text-[13px] font-medium hover:bg-slate-50 transition-all disabled:opacity-50" disabled>Précédent</button>
              <button className="px-5 py-2 bg-slate-900 text-white rounded-[12px] text-[13px] font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">Suivant</button>
            </div>
          </div>
        </div>
      </main>

      {/* Invoice Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInvoice(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white print:hidden">
                <h2 className="text-xl font-black text-slate-900">Aperçu de la Facture</h2>
                <div className="flex gap-3">
                  <button 
                    onClick={() => window.print()}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[12px] uppercase tracking-widest flex items-center gap-2"
                  >
                    <Download size={16} /> Imprimer / PDF
                  </button>
                  <button onClick={() => setSelectedInvoice(null)} className="p-2 text-slate-400 hover:text-slate-600">
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-12 overflow-y-auto flex-1 bg-white print:p-0" id="invoice-content">
                <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col gap-4">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-2xl">
                      {(companies.find(c => c.id === user?.companyId)?.name?.[0]) || 'T'}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{(companies.find(c => c.id === user?.companyId)?.name) || 'TRANSITAIRE'}</h3>
                      <p className="text-sm font-medium text-slate-500 whitespace-pre-line">{(companies.find(c => c.id === user?.companyId)?.addressAfrica) || 'Dakar, Sénégal'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h1 className="text-4xl font-black text-slate-200 uppercase mb-4">FACTURE</h1>
                    <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">N° {selectedInvoice.trackingNumber}</p>
                    <p className="text-[12px] text-slate-500 font-medium">Date : {formatDate(new Date().toISOString())}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12 py-8 border-y border-slate-50">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Facturer à</p>
                    <p className="text-lg font-black text-slate-900">{selectedInvoice.clientName}</p>
                    <p className="text-[14px] font-medium text-slate-500">{selectedInvoice.clientPhone}</p>
                    <p className="text-[14px] font-medium text-slate-500">{selectedInvoice.destination}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Expédition</p>
                    <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wider">{selectedInvoice.serviceType}</p>
                    <div className="mt-2 flex justify-end gap-2">
                      <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest", selectedInvoice.paymentStatus === 'paid' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>
                        {selectedInvoice.paymentStatus === 'paid' ? 'Payée' : 'Non Payée'}
                      </span>
                    </div>
                  </div>
                </div>

                <table className="w-full mb-12">
                  <thead>
                    <tr className="border-b-2 border-slate-900">
                      <th className="py-4 text-left text-[11px] font-black text-slate-900 uppercase tracking-widest">Description</th>
                      <th className="py-4 text-right text-[11px] font-black text-slate-900 uppercase tracking-widest">Quantité</th>
                      <th className="py-4 text-right text-[11px] font-black text-slate-900 uppercase tracking-widest">Prix Unit.</th>
                      <th className="py-4 text-right text-[11px] font-black text-slate-900 uppercase tracking-widest">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-6">
                        <p className="font-bold text-slate-900">{selectedInvoice.description || 'Fret International'}</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">Ref: {selectedInvoice.id}</p>
                      </td>
                      <td className="py-6 text-right font-black text-slate-900">
                        {selectedInvoice.weight || selectedInvoice.cbm} {selectedInvoice.weight ? 'kg' : 'CBM'}
                      </td>
                      <td className="py-6 text-right font-medium text-slate-500">
                        {formatPrice((selectedInvoice.price || 0) / (selectedInvoice.weight || selectedInvoice.cbm || 1))}
                      </td>
                      <td className="py-6 text-right font-black text-slate-900">
                        {formatPrice(selectedInvoice.price || 0)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-end">
                  <div className="w-64 space-y-4">
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="text-[13px] font-bold uppercase tracking-widest">Sous-total</span>
                      <span className="font-bold">{formatPrice(selectedInvoice.price || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t-2 border-slate-900">
                      <span className="text-lg font-black text-slate-900 uppercase tracking-tighter">Total Final</span>
                      <span className="text-2xl font-black text-apple-blue">{formatPrice(selectedInvoice.price || 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-20 pt-8 border-t border-slate-100">
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                    Merci de votre confiance. Les colis non récupérés après 30 jours feront l'objet de frais de magasinage. Facture générée via Trainspire.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Order Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-[24px] font-bold text-slate-900 tracking-tight">Ajouter un nouveau colis</h2>
                  <p className="text-[14px] text-slate-500">Enregistrez une nouvelle réception client.</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-900 shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddOrder} className="p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-2 block">Client</span>
                      <input 
                        required
                        type="text" 
                        placeholder="Nom complet"
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-[14px] focus:ring-2 focus:ring-apple-blue transition-all"
                        value={newOrder.clientName}
                        onChange={e => setNewOrder({...newOrder, clientName: e.target.value})}
                      />
                    </label>
                    <label className="block">
                      <span className="text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-2 block">Téléphone</span>
                      <input 
                        required
                        type="tel" 
                        placeholder="+221 ..."
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-[14px] focus:ring-2 focus:ring-apple-blue transition-all"
                        value={newOrder.clientPhone}
                        onChange={e => setNewOrder({...newOrder, clientPhone: e.target.value})}
                      />
                    </label>
                  </div>
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-2 block">Type d'envoi</span>
                      <select 
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-[14px] focus:ring-2 focus:ring-apple-blue transition-all"
                        value={newOrder.serviceType}
                        onChange={e => setNewOrder({...newOrder, serviceType: e.target.value as any})}
                      >
                        <option value="aérien">✈️ Aérien Classique</option>
                        <option value="express">⚡ Aérien Express</option>
                        <option value="maritime">🚢 Maritime</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-2 block">Destination</span>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-[14px] focus:ring-2 focus:ring-apple-blue transition-all"
                        value={newOrder.destination}
                        onChange={e => setNewOrder({...newOrder, destination: e.target.value})}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <label className="block">
                    <span className="text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-2 block">Poids (kg) - Optionnel</span>
                    <input 
                      type="number" 
                      step="0.1"
                      placeholder="0.0"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-[14px] focus:ring-2 focus:ring-apple-blue transition-all"
                      value={newOrder.weight}
                      onChange={e => setNewOrder({...newOrder, weight: e.target.value})}
                    />
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="block">
                      <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2 block">L (m)</span>
                      <input 
                        type="number" step="0.01" placeholder="0.0"
                        className="w-full px-3 py-3 bg-slate-50 border-none rounded-[14px] focus:ring-2 focus:ring-apple-blue transition-all"
                        value={newOrder.length}
                        onChange={e => setNewOrder({...newOrder, length: e.target.value})}
                      />
                    </label>
                    <label className="block">
                      <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2 block">l (m)</span>
                      <input 
                        type="number" step="0.01" placeholder="0.0"
                        className="w-full px-3 py-3 bg-slate-50 border-none rounded-[14px] focus:ring-2 focus:ring-apple-blue transition-all"
                        value={newOrder.width}
                        onChange={e => setNewOrder({...newOrder, width: e.target.value})}
                      />
                    </label>
                    <label className="block">
                      <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2 block">H (m)</span>
                      <input 
                        type="number" step="0.01" placeholder="0.0"
                        className="w-full px-3 py-3 bg-slate-50 border-none rounded-[14px] focus:ring-2 focus:ring-apple-blue transition-all"
                        value={newOrder.height}
                        onChange={e => setNewOrder({...newOrder, height: e.target.value})}
                      />
                    </label>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block">
                    <span className="text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-2 block">Contenu du colis</span>
                    <textarea 
                      placeholder="Ex: Vêtements, iPhone 15, ..."
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-[14px] focus:ring-2 focus:ring-apple-blue transition-all resize-none"
                      value={newOrder.description}
                      onChange={e => setNewOrder({...newOrder, description: e.target.value})}
                    />
                  </label>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 px-6 rounded-[16px] font-bold text-[15px] text-slate-500 hover:bg-slate-50 transition-all border border-slate-100"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 px-6 rounded-[16px] font-bold text-[15px] bg-apple-blue text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
                  >
                    Enregistrer le colis
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
