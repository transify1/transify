import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plane, Ship, Plus, Search, 
  Calendar, MapPin, Package, 
  ChevronRight, MoreVertical, 
  ArrowRight, Filter, Clock,
  CheckCircle2, AlertCircle, Truck,
  LayoutGrid, List as ListIcon,
  BarChart3, TrendingUp, X,
  MessageSquare, Map as MapIcon,
  QrCode, Camera, Check, FileText, Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import TransitaireSidebar from '../../components/Transitaire/Sidebar';
import { cn, formatDate } from '../../lib/utils';
import { Shipment } from '../../types';

export default function TransitaireShipments() {
  const { user, shipments, orders, addShipment, updateShipment, updateOrder, sidebarCollapsed } = useApp();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'air' | 'sea'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);
  const [scannedOrder, setScannedOrder] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [showShipmentSelector, setShowShipmentSelector] = useState(false);
  const [selectedOrderForAdd, setSelectedOrderForAdd] = useState<any>(null);

  // New Shipment Form State
  const [newShipment, setNewShipment] = useState({
    type: 'air' as 'air' | 'sea',
    reference: '',
    departureDate: '',
    from: 'Guangzhou',
    to: 'Dakar',
    totalCapacity: ''
  });

  const filteredShipments = shipments.filter(s => 
    filter === 'all' ? true : (filter === 'air' ? s.type === 'air' : s.type === 'sea')
  );

  const stats = {
    active: shipments.filter(s => s.status !== 'completed').length,
    flights: shipments.filter(s => s.type === 'air' && s.status !== 'completed').length,
    containers: shipments.filter(s => s.type === 'sea' && s.status !== 'completed').length,
    arrivals: shipments.filter(s => s.status === 'arrived').length
  };

  const handleOpenScan = (shipment: Shipment) => {
    setActiveShipment(shipment);
    setShowScanModal(true);
    setScannedOrder(null);
  };

  const simulateScan = () => {
    setIsScanning(true);
    // Simulate camera delay
    setTimeout(() => {
      const availableOrders = orders.filter(o => o.status === 'received');
      if (availableOrders.length > 0) {
        // Pick a random order to simulate a scan
        const randomOrder = availableOrders[Math.floor(Math.random() * availableOrders.length)];
        setScannedOrder(randomOrder);
      }
      setIsScanning(false);
    }, 1500);
  };

  const confirmAddPackage = () => {
    if (!activeShipment || !scannedOrder) return;

    const isOverCapacity = activeShipment.capacity.used + (scannedOrder.weight || scannedOrder.cbm || 0) > activeShipment.capacity.total;

    // 1. Update Shipment
    const isAlreadyIn = (activeShipment.orders || []).includes(scannedOrder.id);
    if (isAlreadyIn) {
      setScannedOrder(null);
      if (batchMode) simulateScan();
      return;
    }

    const updatedOrders = [...(activeShipment.orders || []), scannedOrder.id];
    const updatedShipment = {
      ...activeShipment,
      orders: updatedOrders,
      packageCount: updatedOrders.length,
      capacity: {
        ...activeShipment.capacity,
        used: activeShipment.capacity.used + (scannedOrder.weight || scannedOrder.cbm || 0)
      }
    };
    updateShipment(updatedShipment.id, updatedShipment);

    // 2. Update Order Status to 'loaded'
    updateOrder(scannedOrder.id, { 
      status: 'loaded',
      updatedAt: new Date().toISOString()
    });

    if (batchMode) {
      setScannedOrder(null);
      simulateScan();
    } else {
      setShowScanModal(false);
      setScannedOrder(null);
      setActiveShipment(null);
    }
  };

  const startShipment = (shipment: Shipment) => {
    updateShipment(shipment.id, { ...shipment, status: 'in_transit' });
    // Update all orders in this shipment to 'in_transit'
    shipment.orders.forEach(orderId => {
      updateOrder(orderId, { status: 'in_transit' });
    });
  };

  const markArrived = (shipment: Shipment) => {
    updateShipment(shipment.id, { ...shipment, status: 'arrived' });
    // Update all orders in this shipment to 'arrived'
    shipment.orders.forEach(orderId => {
      updateOrder(orderId, { status: 'arrived' });
    });
  };

  const handleQuickAdd = (order: any) => {
    setSelectedOrderForAdd(order);
    setShowShipmentSelector(true);
  };

  const confirmQuickAdd = (shipment: Shipment) => {
    if (!selectedOrderForAdd) return;

    // 1. Update Shipment
    const isAlreadyIn = (shipment.orders || []).includes(selectedOrderForAdd.id);
    if (isAlreadyIn) {
      setShowShipmentSelector(false);
      setSelectedOrderForAdd(null);
      return;
    }

    const updatedOrders = [...(shipment.orders || []), selectedOrderForAdd.id];
    const updatedShipment = {
      ...shipment,
      orders: updatedOrders,
      packageCount: updatedOrders.length,
      capacity: {
        ...shipment.capacity,
        used: shipment.capacity.used + (selectedOrderForAdd.weight || selectedOrderForAdd.cbm || 0)
      }
    };
    updateShipment(updatedShipment.id, updatedShipment);

    // 2. Update Order Status to 'loaded'
    updateOrder(selectedOrderForAdd.id, { 
      status: 'loaded',
      updatedAt: new Date().toISOString()
    });

    setShowShipmentSelector(false);
    setSelectedOrderForAdd(null);
  };

  const handleCreateShipment = () => {
    if (!newShipment.reference || !newShipment.departureDate || !newShipment.totalCapacity) return;

    const shipment: Shipment = {
      id: `sh-${Date.now()}`,
      companyId: user?.companyId || '',
      type: newShipment.type,
      reference: newShipment.reference,
      departureDate: new Date(newShipment.departureDate).toISOString(),
      route: { from: newShipment.from, to: newShipment.to },
      capacity: {
        total: Number(newShipment.totalCapacity),
        used: 0,
        unit: newShipment.type === 'air' ? 'kg' : 'cbm'
      },
      status: 'preparation',
      packageCount: 0,
      orders: []
    };

    addShipment(shipment);
    setShowAddModal(false);
    setNewShipment({
      type: 'air',
      reference: '',
      departureDate: '',
      from: 'Guangzhou',
      to: 'Dakar',
      totalCapacity: ''
    });
  };

  const removeOrderFromShipment = (shipment: Shipment, orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const updatedOrders = shipment.orders.filter(id => id !== orderId);
    const updatedShipment = {
      ...shipment,
      orders: updatedOrders,
      packageCount: updatedOrders.length,
      capacity: {
        ...shipment.capacity,
        used: shipment.capacity.used - (order.weight || order.cbm || 0)
      }
    };

    updateShipment(shipment.id, updatedShipment);
    updateOrder(orderId, { status: 'received' });
    
    if (activeShipment?.id === shipment.id) {
      setActiveShipment(updatedShipment);
    }
  };

  const handleOpenDetail = (shipment: Shipment) => {
    setActiveShipment(shipment);
    setShowDetailModal(true);
  };

  const getStatusColor = (status: Shipment['status']) => {
    switch (status) {
      case 'preparation': return 'bg-orange-100 text-orange-600';
      case 'loaded': return 'bg-blue-100 text-blue-600';
      case 'in_transit': return 'bg-indigo-100 text-indigo-600';
      case 'arrived': return 'bg-green-100 text-green-600';
      case 'completed': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusLabel = (status: Shipment['status']) => {
    switch (status) {
      case 'preparation': return 'En préparation';
      case 'loaded': return 'Chargé';
      case 'in_transit': return 'En route';
      case 'arrived': return 'Arrivé';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <TransitaireSidebar />
      <main className={cn(
        "p-4 lg:p-8 max-w-7xl mx-auto transition-all duration-300",
        sidebarCollapsed ? "lg:ml-24" : "lg:ml-72"
      )}>
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
          <div>
            <h1 className="text-[20px] font-bold text-slate-900 mb-1 tracking-tight">Gestion des Expéditions</h1>
            <p className="text-[13px] text-slate-500 font-medium">Organisez vos vols et conteneurs en temps réel.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-white p-1 rounded-[12px] border border-slate-100 shadow-sm">
              <button 
                onClick={() => setView('grid')}
                className={cn(
                  "p-2 rounded-[8px] transition-all",
                  view === 'grid' ? "bg-apple-blue text-white shadow-md shadow-blue-100" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setView('list')}
                className={cn(
                  "p-2 rounded-[8px] transition-all",
                  view === 'list' ? "bg-apple-blue text-white shadow-md shadow-blue-100" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <ListIcon size={18} />
              </button>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="apple-button-primary !py-2.5 !px-5 flex items-center gap-2.5 shadow-md shadow-blue-50"
            >
              <Plus size={20} /> <span className="text-[11px] font-bold uppercase tracking-wider">Nouvelle Expédition</span>
            </button>
          </div>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Expéditions actives', value: stats.active, icon: <Truck size={18} />, color: 'bg-blue-50 text-apple-blue' },
            { label: 'Vols programmés', value: stats.flights, icon: <Plane size={18} />, color: 'bg-indigo-50 text-indigo-600' },
            { label: 'Conteneurs en route', value: stats.containers, icon: <Ship size={18} />, color: 'bg-cyan-50 text-cyan-600' },
            { label: 'Arrivées aujourd\'hui', value: stats.arrivals, icon: <CheckCircle2 size={18} />, color: 'bg-green-50 text-green-600' }
          ].map((stat, i) => (
            <div key={i} className="apple-card flex flex-col gap-2">
              <div className={cn("w-9 h-9 rounded-[10px] flex items-center justify-center", stat.color)}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                <h3 className="text-[18px] font-bold text-slate-900">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex bg-white p-1 rounded-[12px] border border-slate-100 shadow-sm">
            {[
              { id: 'all', label: 'Tout' },
              { id: 'air', label: 'Aérien', icon: <Plane size={14} /> },
              { id: 'sea', label: 'Maritime', icon: <Ship size={14} /> }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={cn(
                  "px-4 py-2 rounded-[8px] text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                  filter === f.id ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
          
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher une référence, destination..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-[12px] focus:ring-2 focus:ring-apple-blue transition-all font-medium text-[13px] shadow-sm"
            />
          </div>
        </div>

        {/* Shipment Grid/List */}
        {view === 'grid' ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredShipments.map((shipment) => (
              <motion.div 
                layout
                key={shipment.id}
                onClick={() => handleOpenDetail(shipment)}
                className="apple-card !p-0 overflow-hidden group cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-[12px] flex items-center justify-center shadow-md",
                      shipment.type === 'air' ? "bg-indigo-600 text-white shadow-indigo-100" : "bg-cyan-600 text-white shadow-cyan-100"
                    )}>
                      {shipment.type === 'air' ? <Plane size={24} /> : <Ship size={24} />}
                    </div>
                    <div className={cn("px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest", getStatusColor(shipment.status))}>
                      {getStatusLabel(shipment.status)}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-[16px] font-bold text-slate-900 mb-1">{shipment.type === 'air' ? 'Vol' : 'Conteneur'} {shipment.reference}</h3>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <Calendar size={12} /> {formatDate(shipment.departureDate)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-[12px] mb-4">
                    <div className="text-center flex-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">{shipment.route.from}</p>
                      <MapPin size={12} className="mx-auto text-slate-300" />
                    </div>
                    <div className="px-2 text-slate-300">
                      <ArrowRight size={14} />
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">{shipment.route.to}</p>
                      <MapPin size={12} className="mx-auto text-apple-blue" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Package size={14} />
                        <span className="text-[12px] font-bold">{shipment.packageCount} colis</span>
                      </div>
                      <div className="text-[12px] font-bold text-slate-900">
                        {shipment.capacity.used} / {shipment.capacity.total} {shipment.capacity.unit}
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(shipment.capacity.used / shipment.capacity.total) * 100}%` }}
                        className={cn(
                          "h-full",
                          (shipment.capacity.used / shipment.capacity.total) > 0.9 ? "bg-red-500" : "bg-apple-blue"
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
                    <div className="flex gap-1.5">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(shipment);
                        }}
                        className="p-1.5 text-slate-400 hover:text-apple-blue transition-all bg-white rounded-[6px] shadow-sm"
                      >
                        <ListIcon size={14} />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-slate-400 hover:text-apple-blue transition-all bg-white rounded-[6px] shadow-sm"
                      >
                        <MapIcon size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      {shipment.status === 'preparation' && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenScan(shipment);
                          }}
                          className="flex items-center gap-1.5 text-[10px] font-bold text-apple-blue uppercase tracking-widest hover:bg-blue-50 px-2.5 py-1.5 rounded-[8px] transition-all"
                        >
                          <Plus size={12} /> Ajouter colis
                        </button>
                      )}
                      {shipment.status === 'loaded' && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            startShipment(shipment);
                          }}
                          className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 px-2.5 py-1.5 rounded-[8px] transition-all"
                        >
                          <Truck size={12} /> Démarrer
                        </button>
                      )}
                      {shipment.status === 'in_transit' && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            markArrived(shipment);
                          }}
                          className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 uppercase tracking-widest hover:bg-green-50 px-2.5 py-1.5 rounded-[8px] transition-all"
                        >
                          <CheckCircle2 size={12} /> Marquer Arrivé
                        </button>
                      )}
                    </div>
                  </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="apple-card !p-0 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Référence</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Route</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Départ</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capacité</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Statut</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredShipments.map((shipment) => (
                  <tr 
                    key={shipment.id} 
                    onClick={() => handleOpenDetail(shipment)}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-9 h-9 rounded-[10px] flex items-center justify-center",
                          shipment.type === 'air' ? "bg-indigo-50 text-indigo-600" : "bg-cyan-50 text-cyan-600"
                        )}>
                          {shipment.type === 'air' ? <Plane size={18} /> : <Ship size={18} />}
                        </div>
                        <div>
                          <p className="font-bold text-[13px] text-slate-900">{shipment.reference}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{shipment.type === 'air' ? 'Aérien' : 'Maritime'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold text-slate-600">{shipment.route.from}</span>
                        <ArrowRight size={12} className="text-slate-300" />
                        <span className="text-[12px] font-bold text-slate-900">{shipment.route.to}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[12px] font-bold text-slate-600">{formatDate(shipment.departureDate)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24">
                        <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                          <span>{Math.round((shipment.capacity.used / shipment.capacity.total) * 100)}%</span>
                          <span>{shipment.capacity.used} {shipment.capacity.unit}</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full",
                              (shipment.capacity.used / shipment.capacity.total) > 0.9 ? "bg-red-500" : "bg-apple-blue"
                            )}
                            style={{ width: `${(shipment.capacity.used / shipment.capacity.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest", getStatusColor(shipment.status))}>
                        {getStatusLabel(shipment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(shipment);
                          }}
                          className="p-1.5 text-slate-400 hover:text-apple-blue transition-all bg-slate-50 rounded-[6px]"
                        >
                          <ListIcon size={14} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(shipment);
                          }}
                          className="p-1.5 text-slate-400 hover:text-apple-blue transition-all bg-slate-50 rounded-[6px]"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pending Packages Section */}
        <div className="mt-10 apple-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Colis en attente d'expédition</h2>
              <p className="text-[13px] text-slate-500 font-medium">Colis reçus en entrepôt prêts à être chargés.</p>
            </div>
            <span className="px-3 py-1.5 bg-blue-50 text-apple-blue rounded-[10px] text-[10px] font-bold uppercase tracking-widest">
              {orders.filter(o => o.status === 'received').length} Colis disponibles
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.filter(o => o.status === 'received').map(order => (
              <div key={order.id} className="p-4 bg-slate-50/50 rounded-[20px] border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-blue-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-[12px] flex items-center justify-center text-slate-400 shadow-sm">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-900">{order.trackingNumber}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{order.weight || order.cbm} {order.serviceType === 'maritime' ? 'CBM' : 'kg'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleQuickAdd(order)}
                  className="w-8 h-8 bg-white text-apple-blue rounded-[8px] shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-apple-blue hover:text-white"
                >
                  <Plus size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Add Shipment Modal */}
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Nouvelle Expédition</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setNewShipment(prev => ({ ...prev, type: 'air' }))}
                    className={cn(
                      "p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all",
                      newShipment.type === 'air' ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-100 bg-slate-50 text-slate-400 hover:border-blue-200"
                    )}
                  >
                    <Plane size={32} />
                    <span className="font-bold text-[11px] uppercase tracking-widest">Aérien</span>
                  </button>
                  <button 
                    onClick={() => setNewShipment(prev => ({ ...prev, type: 'sea' }))}
                    className={cn(
                      "p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all",
                      newShipment.type === 'sea' ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-100 bg-slate-50 text-slate-400 hover:border-blue-200"
                    )}
                  >
                    <Ship size={32} />
                    <span className="font-bold text-[11px] uppercase tracking-widest">Maritime</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Référence / Nom</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Vol TK-204" 
                      value={newShipment.reference}
                      onChange={(e) => setNewShipment(prev => ({ ...prev, reference: e.target.value }))}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Date de départ</label>
                      <input 
                        type="date" 
                        value={newShipment.departureDate}
                        onChange={(e) => setNewShipment(prev => ({ ...prev, departureDate: e.target.value }))}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Capacité ({newShipment.type === 'air' ? 'kg' : 'cbm'})</label>
                      <input 
                        type="number" 
                        placeholder="500" 
                        value={newShipment.totalCapacity}
                        onChange={(e) => setNewShipment(prev => ({ ...prev, totalCapacity: e.target.value }))}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Origine</label>
                      <input 
                        type="text" 
                        value={newShipment.from}
                        onChange={(e) => setNewShipment(prev => ({ ...prev, from: e.target.value }))}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Destination</label>
                      <input 
                        type="text" 
                        value={newShipment.to}
                        onChange={(e) => setNewShipment(prev => ({ ...prev, to: e.target.value }))}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold" 
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleCreateShipment}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-[15px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mt-4"
                >
                  Créer l'expédition
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Shipment Selector Modal */}
      <AnimatePresence>
          {showShipmentSelector && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowShipmentSelector(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden"
              >
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Choisir une expédition</h2>
                    <p className="text-xs text-slate-500 font-medium">Pour le colis : {selectedOrderForAdd?.trackingNumber}</p>
                  </div>
                  <button onClick={() => setShowShipmentSelector(false)} className="p-2 text-slate-400 hover:text-slate-600">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 max-h-[400px] overflow-y-auto space-y-3">
                  {shipments.filter(s => s.status === 'preparation').map(shipment => (
                    <button 
                      key={shipment.id}
                      onClick={() => confirmQuickAdd(shipment)}
                      className="w-full p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between hover:bg-blue-50 hover:border-blue-100 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                          shipment.type === 'air' ? "bg-indigo-600 shadow-indigo-100" : "bg-cyan-600 shadow-cyan-100"
                        )}>
                          {shipment.type === 'air' ? <Plane size={24} /> : <Ship size={24} />}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-slate-900">{shipment.reference}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{shipment.route.to}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900">{Math.round((shipment.capacity.used / shipment.capacity.total) * 100)}%</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Capacité</p>
                      </div>
                    </button>
                  ))}
                  {shipments.filter(s => s.status === 'preparation').length === 0 && (
                    <div className="py-12 text-center">
                      <AlertCircle size={48} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-slate-400 font-bold">Aucune expédition en préparation</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showScanModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isScanning && setShowScanModal(false)}
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                className="relative w-full max-w-md bg-white rounded-[48px] shadow-2xl overflow-hidden"
              >
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Scanner un colis</h2>
                    <p className="text-xs text-slate-500 font-medium">Ajout à : {activeShipment?.reference}</p>
                  </div>
                  <button onClick={() => setShowScanModal(false)} className="p-2 text-slate-400 hover:text-slate-600">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        batchMode ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                      )}>
                        <BarChart3 size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mode Batch</p>
                        <p className="text-xs font-bold text-slate-900">{batchMode ? 'Activé' : 'Désactivé'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setBatchMode(!batchMode)}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-all",
                        batchMode ? "bg-blue-600" : "bg-slate-200"
                      )}
                    >
                      <motion.div 
                        animate={{ x: batchMode ? 24 : 4 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>

                  {!scannedOrder ? (
                    <div className="space-y-8">
                      <div className="aspect-square bg-slate-900 rounded-[32px] relative overflow-hidden flex items-center justify-center">
                        {isScanning ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4">
                            <motion.div 
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="w-20 h-20 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"
                            />
                            <p className="font-bold text-sm uppercase tracking-widest">Analyse en cours...</p>
                          </div>
                        ) : (
                          <div className="text-center space-y-4">
                            <div className="w-24 h-24 border-2 border-dashed border-slate-700 rounded-3xl mx-auto flex items-center justify-center text-slate-500">
                              <QrCode size={48} />
                            </div>
                            <p className="text-slate-400 text-xs font-medium px-12">Placez le QR code du colis dans le cadre pour le scanner</p>
                          </div>
                        )}
                        
                        {/* Scan line animation */}
                        {!isScanning && (
                          <motion.div 
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10"
                          />
                        )}
                      </div>

                      <button 
                        onClick={simulateScan}
                        disabled={isScanning}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50"
                      >
                        <Camera size={20} /> {isScanning ? 'Initialisation...' : 'Démarrer le scan'}
                      </button>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100 text-center">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                          <Check size={32} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-1">Colis Identifié !</h3>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">{scannedOrder.trackingNumber}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between p-4 bg-slate-50 rounded-2xl">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Client</span>
                          <span className="text-sm font-bold text-slate-900">{scannedOrder.clientName}</span>
                        </div>
                        <div className="flex justify-between p-4 bg-slate-50 rounded-2xl">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Destination</span>
                          <span className="text-sm font-bold text-slate-900">{scannedOrder.destination}</span>
                        </div>
                        <div className="flex justify-between p-4 bg-slate-50 rounded-2xl">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Mesure</span>
                          <span className="text-sm font-bold text-slate-900">
                            {scannedOrder.weight || scannedOrder.cbm} {scannedOrder.serviceType === 'maritime' ? 'CBM' : 'kg'}
                          </span>
                        </div>
                        {activeShipment && (activeShipment.capacity.used + (scannedOrder.weight || scannedOrder.cbm || 0) > activeShipment.capacity.total) && (
                          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
                            <AlertCircle size={18} />
                            <p className="text-[11px] font-bold uppercase tracking-tight">Capacité dépassée !</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4">
                        <button 
                          onClick={() => setScannedOrder(null)}
                          className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                          Réessayer
                        </button>
                        <button 
                          onClick={confirmAddPackage}
                          className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                        >
                          Confirmer l'ajout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Shipment Detail Modal */}
        <AnimatePresence>
          {showDetailModal && activeShipment && (
            <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDetailModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                      activeShipment.type === 'air' ? "bg-indigo-600 shadow-indigo-100" : "bg-cyan-600 shadow-cyan-100"
                    )}>
                      {activeShipment.type === 'air' ? <Plane size={24} /> : <Ship size={24} />}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900">{activeShipment.reference}</h2>
                      <p className="text-xs text-slate-500 font-medium">{activeShipment.route.from} → {activeShipment.route.to}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowDetailModal(false)} className="p-2 text-slate-400 hover:text-slate-600">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-8 overflow-y-auto flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Colis dans l'expédition ({activeShipment.packageCount})</h3>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-xs font-black text-slate-900">{activeShipment.capacity.used} / {activeShipment.capacity.total} {activeShipment.capacity.unit}</p>
                        <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full bg-blue-600" 
                            style={{ width: `${(activeShipment.capacity.used / activeShipment.capacity.total) * 100}%` }}
                          />
                        </div>
                      </div>
                      <button 
                        className="p-2.5 bg-white border border-slate-100 text-slate-600 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-sm"
                        title="Télécharger le Manifeste"
                      >
                        <FileText size={16} /> Manifeste
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {activeShipment.orders.length > 0 ? Array.from(new Set(activeShipment.orders)).map((orderId: string) => {
                      const order = orders.find(o => o.id === orderId);
                      if (!order) return null;
                      return (
                        <div key={orderId} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                              <Package size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900">{order.trackingNumber}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{order.clientName} • {order.weight || order.cbm} {order.serviceType === 'maritime' ? 'CBM' : 'kg'}</p>
                            </div>
                          </div>
                          {activeShipment.status === 'preparation' && (
                            <button 
                              onClick={() => removeOrderFromShipment(activeShipment, orderId)}
                              className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      );
                    }) : (
                      <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                        <Package size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold">Aucun colis dans cette expédition</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex gap-4">
                  {activeShipment.status === 'preparation' && (
                    <>
                      <button 
                        onClick={() => {
                          setShowDetailModal(false);
                          handleOpenScan(activeShipment);
                        }}
                        className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200"
                      >
                        Scanner un colis
                      </button>
                      <button 
                        onClick={() => {
                          startShipment(activeShipment);
                          setShowDetailModal(false);
                        }}
                        className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest"
                      >
                        Lancer le Voyage
                      </button>
                    </>
                  )}
                  {activeShipment.status === 'in_transit' && (
                    <button 
                      onClick={() => {
                        markArrived(activeShipment);
                        setShowDetailModal(false);
                      }}
                      className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-100"
                    >
                      Marquer comme Arrivé
                    </button>
                  )}
                  <button 
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest"
                  >
                    Fermer
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </div>
  );
}
