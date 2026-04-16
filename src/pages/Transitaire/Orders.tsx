import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { 
  Package, Search, Filter, QrCode, 
  Plus, MoreVertical, Ship, Plane, 
  Zap, CheckCircle2, AlertCircle, Clock,
  Edit3, Trash2, Phone, MessageSquare,
  LayoutDashboard, Users, BarChart3, Settings, LogOut, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice, formatDate, cn } from '../../lib/utils';
import TransitaireSidebar from '../../components/Transitaire/Sidebar';

export default function TransitaireOrders() {
  const { orders, updateOrder, addOrder, user, companies, addNotification } = useApp();
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
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
    
    // Calcul du volume (CBM) si les dimensions sont renseignées
    const l = parseFloat(newOrder.length) || 0;
    const w = parseFloat(newOrder.width) || 0;
    const h = parseFloat(newOrder.height) || 0;
    const calculatedCbm = l * w * h;

    const orderData = {
      id: trackingId,
      clientId: 'u_new_' + Date.now(),
      clientName: newOrder.clientName,
      clientPhone: newOrder.clientPhone,
      companyId: user.companyId,
      companyName: company?.name || 'Ma Compagnie',
      serviceId: 's_default',
      serviceType: newOrder.serviceType,
      status: 'received' as const,
      weight: parseFloat(newOrder.weight) || 0,
      cbm: calculatedCbm || 0,
      dimensions: {
        length: l,
        width: w,
        height: h
      },
      price: (parseFloat(newOrder.weight) || 0) * 6500, // En estimant un prix de base
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
      <main className="lg:ml-72 p-4 lg:p-8 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 mb-1 tracking-tight">Gestion des Commandes</h1>
            <p className="text-[15px] text-slate-500 font-normal">Suivez et mettez à jour le statut de chaque colis.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-apple-blue text-white py-3 px-6 rounded-[16px] flex items-center gap-3 shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
            >
              <Plus size={20} /> <span className="text-[14px] font-medium">Ajouter un colis</span>
            </button>
          </div>
        </header>

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
                  <th className="px-8 py-4 text-[12px] font-medium text-slate-400">ID Colis</th>
                  <th className="px-8 py-4 text-[12px] font-medium text-slate-400">Client</th>
                  <th className="px-8 py-4 text-[12px] font-medium text-slate-400">Détails</th>
                  <th className="px-8 py-4 text-[12px] font-medium text-slate-400">Statut</th>
                  <th className="px-8 py-4 text-[12px] font-medium text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
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
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">+221 77 123 45 67</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-400">
                          {order.serviceId.includes('s2') ? <Plane size={14} /> : <Ship size={14} />}
                          <span className="text-[8px] font-bold uppercase tracking-widest">{order.serviceId.includes('s2') ? 'Aérien' : 'Maritime'}</span>
                        </div>
                        <span className="text-[14px] font-bold text-slate-900 tracking-tighter">{order.weight || order.cbm} {order.weight ? 'kg' : 'cbm'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn("px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest", getStatusColor(order.status))}>
                        {order.status === 'in_transit' ? 'En transit' : order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {order.status !== 'delivered' && (
                          <button 
                            onClick={() => updateOrder(order.id, { status: 'delivered' })}
                            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-[12px] font-bold text-[9px] uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all"
                          >
                            <CheckCircle2 size={14} /> Livré
                          </button>
                        )}
                        <button className="p-2.5 bg-blue-50 text-apple-blue rounded-[10px] hover:bg-apple-blue hover:text-white transition-all">
                          <Edit3 size={16} />
                        </button>
                        <button className="p-2.5 bg-slate-50 text-slate-400 rounded-[10px] hover:bg-slate-100 transition-all">
                          <MoreVertical size={16} />
                        </button>
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
