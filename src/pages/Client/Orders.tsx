import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { useApp } from '../../context/AppContext';
import { 
  Package, Search, Filter, ChevronRight, 
  MapPin, Clock, Ship, Plane, Zap, 
  ArrowLeft, CheckCircle2, AlertCircle,
  Phone, MessageSquare, Share2, QrCode,
  Truck, X, Download, Scale, Box, Star, Home, User, Calendar
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';

import ClientSidebar from '../../components/Client/Sidebar';

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 lg:hidden">
    <Link to="/client/dashboard" className="flex flex-col items-center gap-1 text-slate-400">
      <Home size={22} strokeWidth={2} />
      <span className="text-[11px] font-medium">Accueil</span>
    </Link>
    <Link to="/client/explorer" className="flex flex-col items-center gap-1 text-slate-400">
      <Search size={22} strokeWidth={2} />
      <span className="text-[11px] font-medium">Explorer</span>
    </Link>
    <Link to="/client/orders" className="flex flex-col items-center gap-1 text-blue-600">
      <Package size={22} strokeWidth={2.5} />
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
import { formatDate, cn } from '../../lib/utils';

const ProgressBar = ({ status }: { status: string }) => {
  const steps = ['pending', 'received', 'in_transit', 'arrived', 'delivered'];
  const currentIndex = steps.indexOf(status);
  const progress = ((currentIndex) / (steps.length - 1)) * 100;

  return (
    <div className="relative w-full py-10">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-50 -translate-y-1/2 rounded-full" />
      
      {/* Progress Line */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-1/2 left-0 h-1.5 bg-apple-blue -translate-y-1/2 rounded-full shadow-[0_0_15px_rgba(0,113,227,0.3)]"
      />

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const icons = {
            pending: <Zap size={10} />,
            received: <Box size={10} />,
            in_transit: <Plane size={10} />,
            arrived: <MapPin size={10} />,
            delivered: <CheckCircle2 size={10} />
          };

          return (
            <div key={step} className="flex flex-col items-center gap-2">
              <motion.div 
                initial={false}
                animate={{ 
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isCurrent || isCompleted ? '#0071e3' : '#f8fafc',
                  color: isCurrent || isCompleted ? '#ffffff' : '#94a3b8'
                }}
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center z-10 transition-all shadow-sm",
                  isCurrent && "ring-4 ring-blue-50"
                )}
              >
                {isCompleted ? <CheckCircle2 size={12} /> : icons[step as keyof typeof icons]}
              </motion.div>
              <span className={cn(
                "text-[11px] font-medium absolute -bottom-5 whitespace-nowrap",
                isCurrent ? "text-apple-blue" : isCompleted ? "text-slate-900" : "text-slate-400"
              )}>
                {step === 'pending' ? 'Commande' : 
                 step === 'received' ? 'Dépôt' : 
                 step === 'in_transit' ? 'Transit' : 
                 step === 'arrived' ? 'Arrivé' : 'Livré'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function ClientOrders() {
  const { orders, formatPrice } = useApp();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState('Tous');

  // Handle URL parameter for selecting an order
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('id');
    if (orderId) {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setSelectedOrder(order);
      }
    }
  }, [orders]);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [destinationFilter, setDestinationFilter] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sharingOrder, setSharingOrder] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const hiddenQrRef = useRef<HTMLDivElement>(null);

  const filters = ['Tous', 'En attente', 'En transit', 'Livrés', 'Problèmes'];

  const exportToCSV = () => {
    const headers = ['ID', 'Tracking', 'Client', 'Destination', 'Service', 'Statut', 'Prix', 'Date'];
    const data = filteredOrders.map(o => [
      o.id,
      o.trackingNumber,
      o.clientName,
      o.destination,
      o.serviceType,
      o.status,
      o.price,
      o.createdAt
    ]);

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `commandes-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'arrived': return 'bg-indigo-100 text-indigo-600';
      case 'in_transit': return 'bg-blue-100 text-blue-600';
      case 'received': return 'bg-yellow-100 text-yellow-600';
      case 'problem': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livré';
      case 'arrived': return 'Arrivé';
      case 'in_transit': return 'En transit';
      case 'received': return 'Reçu au dépôt';
      case 'problem': return 'Problème';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    let matchesStatus = true;
    if (activeFilter === 'En attente') matchesStatus = order.status === 'pending' || order.status === 'received';
    else if (activeFilter === 'En transit') matchesStatus = order.status === 'in_transit';
    else if (activeFilter === 'Livrés') matchesStatus = order.status === 'delivered' || order.status === 'arrived';
    else if (activeFilter === 'Problèmes') matchesStatus = order.status === 'problem';

    // Destination filter
    const matchesDestination = !destinationFilter || order.destination.toLowerCase().includes(destinationFilter.toLowerCase());

    // Date range filter
    let matchesDate = true;
    if (dateRange.start || dateRange.end) {
      const orderDate = new Date(order.createdAt);
      if (dateRange.start && orderDate < new Date(dateRange.start)) matchesDate = false;
      if (dateRange.end && orderDate > new Date(dateRange.end)) matchesDate = false;
    }

    return matchesSearch && matchesStatus && matchesDestination && matchesDate;
  });

  const downloadLabel = async () => {
    if (qrRef.current) {
      setIsGenerating(true);
      try {
        const canvas = await html2canvas(qrRef.current, {
          backgroundColor: '#ffffff',
          scale: 4, // Even higher scale for professional print
          useCORS: true,
          logging: false,
          allowTaint: true
        });
        const url = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = `etiquette-${selectedOrder?.id}.png`;
        link.href = url;
        link.click();
      } catch (err) {
        console.error('Erreur de téléchargement:', err);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleShareOrder = async (order: any) => {
    setSharingOrder(order);
    setIsGenerating(true);
    // Wait for the hidden element to render
    setTimeout(async () => {
      if (hiddenQrRef.current) {
        try {
          const canvas = await html2canvas(hiddenQrRef.current, {
            backgroundColor: '#ffffff',
            scale: 4,
            useCORS: true,
            logging: false,
            allowTaint: true
          });
          
          const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
          
          if (blob && navigator.share) {
            const file = new File([blob], `etiquette-${order.id}.png`, { type: 'image/png' });
            await navigator.share({
              files: [file],
              title: 'Étiquette de colis Transify',
              text: `Voici l'étiquette pour mon colis ${order.id}`,
            });
          } else {
            const url = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.download = `etiquette-${order.id}.png`;
            link.href = url;
            link.click();
          }
        } catch (err) {
          console.error('Erreur de partage:', err);
        } finally {
          setSharingOrder(null);
          setIsGenerating(false);
        }
      }
    }, 200);
  };

  const qrData = selectedOrder ? JSON.stringify({
    id_commande: selectedOrder.id,
    nom: selectedOrder.clientName,
    telephone: selectedOrder.clientPhone,
    telephone2: selectedOrder.clientPhone2 || "N/A",
    adresse: selectedOrder.destination,
    type_transport: selectedOrder.serviceType,
    poids: selectedOrder.weight || "N/A",
    dimensions: selectedOrder.dimensions || "N/A",
    date: selectedOrder.createdAt
  }) : '';

  const timelineSteps = [
    { status: 'delivered', label: 'Colis livré', icon: <CheckCircle2 size={12} /> },
    { status: 'arrived', label: 'Arrivé à destination', icon: <MapPin size={12} /> },
    { status: 'in_transit', label: 'En transit international', icon: <Truck size={12} /> },
    { status: 'received', label: 'Reçu chez le transitaire', icon: <Package size={12} /> },
    { status: 'pending', label: 'Commande validée', icon: <Zap size={12} /> },
  ];

  const getStepStatus = (stepStatus: string, currentStatus: string) => {
    const statusOrder = ['pending', 'received', 'in_transit', 'arrived', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (currentIndex === stepIndex) return 'current';
    if (currentIndex > stepIndex) return 'completed';
    return 'upcoming';
  };

  const calculateEstimatedArrival = (order: any) => {
    if (order.estimatedArrival) return order.estimatedArrival;
    const date = new Date(order.createdAt);
    const daysToAdd = order.serviceType === 'aérien' ? 7 : 35;
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString();
  };

  const calculateDepartureDate = (order: any) => {
    if (order.departureDate) return order.departureDate;
    const date = new Date(order.createdAt);
    date.setDate(date.getDate() + 2);
    return date.toISOString();
  };

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0 fluid-bg">
      <ClientSidebar />
      
      <div className="lg:ml-72">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
            <Link to="/client/dashboard" className="p-2 hover:bg-slate-50 rounded-[12px] transition-all lg:hidden">
              <ArrowLeft size={18} />
            </Link>
          <h1 className="text-[20px] font-bold tracking-tight text-slate-900">Mes expéditions</h1>
          <div className="flex-1 max-w-md ml-6 relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher par ID ou Tracking..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-[12px] focus:ring-2 focus:ring-apple-blue transition-all text-[15px] font-medium tracking-tight"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={cn(
                "p-2.5 rounded-[12px] transition-all",
                showAdvancedFilters ? "bg-apple-blue text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              )}
            >
              <Filter size={18} />
            </button>
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-[12px] font-medium text-[14px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>
        
        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white border-t border-slate-100 overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[12px] font-medium text-slate-400 mb-1.5 block">Destination</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Dakar, Abidjan..."
                    value={destinationFilter}
                    onChange={(e) => setDestinationFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-[12px] focus:ring-2 focus:ring-apple-blue transition-all text-[15px] font-medium tracking-tight"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-slate-400 mb-1.5 block">Date de début</label>
                  <input 
                    type="date" 
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-[12px] focus:ring-2 focus:ring-apple-blue transition-all text-[15px] font-medium tracking-tight"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-slate-400 mb-1.5 block">Date de fin</label>
                  <input 
                    type="date" 
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-[12px] focus:ring-2 focus:ring-apple-blue transition-all text-[15px] font-medium tracking-tight"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-white border-t border-slate-100 no-scrollbar">
          {filters.map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all ${activeFilter === filter ? 'bg-apple-blue text-white shadow-xl shadow-blue-500/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

        <main className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-1 space-y-3">
            {filteredOrders.length > 0 ? filteredOrders.map(order => (
              <motion.div 
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                whileHover={{ scale: 1.01 }}
                className={`p-5 rounded-[18px] border cursor-pointer transition-all ${selectedOrder?.id === order.id ? 'bg-white border-apple-blue shadow-xl shadow-blue-500/10' : 'bg-white border-slate-100 shadow-sm'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${order.serviceType === 'aérien' ? 'bg-blue-50 text-apple-blue' : 'bg-slate-50 text-slate-600'}`}>
                    {order.serviceType === 'aérien' ? <Plane size={18} /> : <Ship size={18} />}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <h4 className="text-[20px] font-bold text-slate-900 mb-0.5 tracking-tight">{order.trackingNumber || order.id}</h4>
                <p className="text-[14px] text-slate-500 font-normal mb-3">{order.destination}</p>
                <div className="flex justify-between items-center">
                  <p className="text-[16px] font-bold text-slate-900 tracking-tight">{formatPrice(order.price || 0)}</p>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareOrder(order);
                      }}
                      className="p-2 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-apple-blue rounded-[10px] transition-all"
                      title="Partager l'étiquette"
                    >
                      <Share2 size={14} />
                    </button>
                    <p className="text-[12px] font-medium text-slate-400">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="py-16 text-center bg-white rounded-[24px] border border-dashed border-slate-100">
                <Package size={40} className="mx-auto text-slate-200 mb-3" />
                <p className="text-[15px] font-medium text-slate-500">Aucune expédition trouvée</p>
              </div>
            )}
          </div>

          {/* Order Details / Tracking */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <motion.div 
                key={selectedOrder.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="apple-card overflow-hidden !rounded-[28px] !p-0"
              >
                <div className="p-8 border-b border-slate-50">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2.5 py-1 bg-apple-blue text-white text-[13px] font-medium rounded-[6px]">
                          {selectedOrder.trackingNumber || selectedOrder.id}
                        </span>
                        <h2 className="text-[28px] md:text-[32px] font-bold tracking-tight text-slate-900">
                          {getStatusLabel(selectedOrder.status)}
                        </h2>
                      </div>
                      <p className="text-[15px] text-slate-500 font-medium flex items-center gap-2">
                        <Truck size={16} className="text-apple-blue" />
                        {selectedOrder.serviceType === 'aérien' ? 'Aérien Express' : 'Fret Maritime'}
                      </p>
                    </div>
                    
                    <div className="flex flex-col md:items-end gap-3">
                      <div className="flex gap-2">
                        <button onClick={() => setShowQR(true)} className="p-2.5 bg-slate-50 text-slate-600 rounded-[12px] hover:bg-blue-50 hover:text-blue-600 transition-all">
                          <QrCode size={20} />
                        </button>
                        <button 
                          onClick={() => setShowQR(true)}
                          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-[12px] font-medium text-[14px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                        >
                          <Download size={16} /> Étiquette
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="px-4 mb-10">
                    <ProgressBar status={selectedOrder.status} />
                  </div>

                  {/* Dates Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="p-5 bg-slate-50 rounded-[20px] border border-slate-100 flex items-center gap-4">
                      <div className="w-11 h-11 bg-white rounded-[12px] flex items-center justify-center text-apple-blue shadow-sm">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-[12px] font-medium text-slate-500 mb-0.5">Départ</p>
                        <p className="text-[16px] font-bold text-slate-900 tracking-tight">
                          {formatDate(calculateDepartureDate(selectedOrder))}
                        </p>
                      </div>
                    </div>
                    <div className="p-5 bg-apple-blue rounded-[20px] text-white shadow-xl shadow-blue-500/20 flex items-center gap-4">
                      <div className="w-11 h-11 bg-white/10 rounded-[12px] flex items-center justify-center text-white backdrop-blur-sm">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-[12px] text-white/60 font-medium mb-0.5">Arrivée estimée</p>
                        <p className="text-[16px] font-bold tracking-tight">
                          {formatDate(calculateEstimatedArrival(selectedOrder))}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-[16px]">
                      <p className="text-[12px] font-medium text-slate-500 mb-1">Mesure</p>
                      <p className="text-[16px] font-bold text-slate-900 tracking-tight">
                        {selectedOrder.serviceType === 'maritime' ? `${selectedOrder.cbm?.toFixed(3) || '0.000'} CBM` : `${selectedOrder.weight || '0.0'} kg`}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-[16px]">
                      <p className="text-[12px] font-medium text-slate-500 mb-1">Destination</p>
                      <p className="text-[16px] font-bold text-slate-900 tracking-tight">{selectedOrder.destination}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-[16px]">
                      <p className="text-[12px] font-medium text-slate-500 mb-1">Coût Final</p>
                      <p className="text-[18px] font-bold text-slate-900 tracking-tight">{formatPrice(selectedOrder.price || 0)}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-[20px] font-bold text-slate-900 tracking-tight">Timeline de l'expédition</h3>
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[12px] font-medium rounded-full">
                      ⏱️ {Math.max(0, Math.ceil((new Date(calculateEstimatedArrival(selectedOrder)).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} jours restants
                    </span>
                  </div>
                  <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    {timelineSteps.map((step, i) => {
                      const stepStatus = getStepStatus(step.status, selectedOrder.status);
                      return (
                        <div key={i} className="flex gap-5 relative">
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all duration-500",
                            stepStatus === 'current' ? "bg-apple-blue text-white shadow-xl shadow-blue-500/20 scale-110" : 
                            stepStatus === 'completed' ? "bg-green-500 text-white" : "bg-slate-100 text-slate-300"
                          )}>
                            {stepStatus === 'completed' ? <CheckCircle2 size={12} /> : step.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className={cn(
                                "text-[16px] font-bold tracking-tight",
                                stepStatus === 'current' ? "text-apple-blue" : 
                                stepStatus === 'completed' ? "text-slate-900" : "text-slate-400"
                              )}>{step.label}</p>
                              {stepStatus === 'completed' && (
                                <span className="text-[11px] font-medium text-slate-400">Validé</span>
                              )}
                            </div>
                            <p className={cn(
                              "text-[13px] font-medium mt-0.5",
                              stepStatus === 'current' ? "text-slate-500" : "text-slate-400"
                            )}>
                              {stepStatus === 'current' ? 'Étape actuelle' : stepStatus === 'completed' ? 'Terminé' : 'À venir'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 bg-slate-50 flex flex-col md:flex-row gap-3">
                  {selectedOrder.status === 'delivered' && !selectedOrder.reviewed && (
                    <button 
                      onClick={() => navigate(`/client/review/${selectedOrder.id}`)}
                      className="flex-1 py-4 bg-yellow-400 text-slate-900 rounded-[16px] font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-500/20"
                    >
                      <Star size={18} fill="currentColor" /> Évaluer
                    </button>
                  )}
                  <button 
                    onClick={() => navigate(`/client/transitaire/${selectedOrder.companyId}`)}
                    className="flex-1 py-4 bg-white border border-slate-200 rounded-[16px] font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
                  >
                    <Phone size={18} /> Appeler
                  </button>
                  <button 
                    onClick={() => navigate(`/client/transitaire/${selectedOrder.companyId}?chat=true`)}
                    className="flex-1 py-4 bg-apple-blue text-white rounded-[16px] font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                  >
                    <MessageSquare size={18} /> Message
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[28px] border border-dashed border-slate-100">
                <Package size={56} className="text-slate-100 mb-6" />
                <h3 className="text-[22px] font-bold text-slate-900 mb-2 tracking-tight">Sélectionnez une expédition</h3>
                <p className="text-[15px] text-slate-500 font-normal max-w-xs leading-relaxed">
                  Cliquez sur une commande à gauche pour voir les détails du suivi.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Hidden Label Generator for Sharing from List */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none">
        {sharingOrder && (
          <div 
            ref={hiddenQrRef} 
            className="bg-white p-12 flex flex-col items-center text-[#0f172a] w-[400px]"
          >
            <div className="mb-10">
              <Logo size={48} />
            </div>
            <div className="text-center mb-10">
              <p className="text-[14px] font-semibold uppercase tracking-[0.1em] text-[#0f172a] mb-2">CLIENT / RECEIVER</p>
              <p className="text-[32px] font-bold uppercase tracking-tight leading-tight">
                {sharingOrder.clientName}
              </p>
            </div>
            <div className="mb-10">
              <QRCodeCanvas 
                value={JSON.stringify({
                  id_commande: sharingOrder.id,
                  nom: sharingOrder.clientName,
                  telephone: sharingOrder.clientPhone,
                  adresse: sharingOrder.destination,
                  type_transport: sharingOrder.serviceType,
                  poids: sharingOrder.weight || "N/A",
                  date: sharingOrder.createdAt
                })}
                size={240}
                level="H"
                includeMargin={false}
              />
            </div>
            <div className="text-center">
              <p className="text-[14px] font-semibold uppercase tracking-[0.1em] text-[#0f172a] mb-2">ID COMMANDE / ORDER ID</p>
              <p className="text-[48px] font-bold tracking-tighter leading-none">{sharingOrder.id}</p>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showQR && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[32px] p-6 md:p-8 shadow-2xl text-center my-auto"
            >
              <button onClick={() => setShowQR(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-all">
                <X size={20} />
              </button>
              
              <div className="mb-8">
                <h3 className="text-[22px] font-bold mb-1 tracking-tight">Étiquette Colis</h3>
                <p className="text-slate-500 font-normal text-[14px]">Envoyez cette étiquette à votre fournisseur</p>
              </div>
              
            <div className="bg-[#f8fafc] rounded-[24px] p-4 mb-6 flex justify-center border border-[#f1f5f9]">
              {/* PIXEL PERFECT LABEL DESIGN */}
              <div 
                ref={qrRef} 
                className="bg-white px-4 py-8 flex flex-col items-center text-[#0f172a] w-full max-w-[260px] shadow-xl rounded-sm"
              >
                {/* Logo Section */}
                <div className="mb-6">
                  <Logo size={28} />
                </div>

                {/* Client Section */}
                <div className="text-center mb-6 w-full">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#0f172a] mb-1">CLIENT / RECEIVER</p>
                  <p className="text-[18px] font-bold uppercase tracking-tight leading-tight break-words">
                    {selectedOrder.clientName}
                  </p>
                </div>
                
                {/* QR Code Section */}
                <div className="mb-6">
                  <QRCodeCanvas 
                    value={qrData}
                    size={160}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                
                {/* Order ID Section */}
                <div className="text-center w-full">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#0f172a] mb-1">ID COMMANDE / ORDER ID</p>
                  <p className="text-[22px] font-black tracking-normal leading-none whitespace-nowrap">{selectedOrder.id}</p>
                </div>
              </div>
            </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={downloadLabel}
                  disabled={isGenerating}
                  className="py-4 bg-slate-900 text-white rounded-[16px] font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download size={18} />
                  )}
                  {isGenerating ? 'Génération...' : 'Télécharger'}
                </button>
                <button 
                  onClick={() => handleShareOrder(selectedOrder)}
                  disabled={isGenerating}
                  className="py-4 bg-apple-blue text-white rounded-[16px] font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Share2 size={18} />
                  )}
                  {isGenerating ? 'Génération...' : 'Partager'}
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
