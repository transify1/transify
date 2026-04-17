import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';
import { 
  QrCode, ArrowLeft, Zap, Package, 
  CheckCircle2, AlertCircle, Loader2,
  Camera, RefreshCw, X, Scale, Truck,
  Phone, MapPin, Info, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TransitaireSidebar from '../../components/Transitaire/Sidebar';
import { cn } from '../../lib/utils';

export default function TransitaireScanner() {
  const navigate = useNavigate();
  const { user, orders, updateOrder, companies, sidebarCollapsed } = useApp();
  const [isScanning, setIsScanning] = useState(true);
  const [scannedOrder, setScannedOrder] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [finalWeight, setFinalWeight] = useState('');
  const [finalLength, setFinalLength] = useState('');
  const [finalWidth, setFinalWidth] = useState('');
  const [finalHeight, setFinalHeight] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (isScanning && !scannedOrder) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => console.error("Failed to clear scanner", error));
      }
    };
  }, [isScanning, scannedOrder]);

  async function onScanSuccess(decodedText: string) {
    try {
      // The QR code now contains ONLY the order ID for security
      const orderId = decodedText.trim();
      
      setStatus('scanning');
      
      // 1. Check if the order belongs to this transitaire
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error || !order) {
        setErrorMessage("Colis introuvable ou vous n'avez pas l'autorisation d'accéder à ces informations.");
        setStatus('error');
        return;
      }

      // 2. Extra security check: verify company ID match
      if (order.company_id !== user?.companyId) {
        setErrorMessage("Accès Refusé : Ce colis appartient à une autre compagnie de transport.");
        setStatus('error');
        return;
      }

      // 3. Mapping data for UI
      const mappedOrder = {
        ...order,
        clientId: order.client_id,
        clientName: order.client_name,
        clientPhone: order.client_phone,
        companyId: order.company_id,
        serviceType: order.service_type,
        weight: order.weight,
        dimensions: order.dimensions,
      };

      setScannedOrder(mappedOrder);
      setFinalWeight(order.weight?.toString() || '');
      if (order.dimensions) {
        setFinalLength(order.dimensions.length?.toString() || '');
        setFinalWidth(order.dimensions.width?.toString() || '');
        setFinalHeight(order.dimensions.height?.toString() || '');
      }
      
      setStatus('success');
      setIsScanning(false);
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    } catch (e) {
      console.error("Scanning process error", e);
      setErrorMessage("Désolé, une erreur est survenue lors de la lecture du code.");
      setStatus('error');
    }
  }

  function onScanFailure(error: any) {
    // Standard scanning attempts, ignorable
  }

  const resetScanner = () => {
    setScannedOrder(null);
    setStatus('idle');
    setErrorMessage('');
    setIsScanning(true);
    setFinalWeight('');
    setFinalLength('');
    setFinalWidth('');
    setFinalHeight('');
  };

  // Recalculate price based on real measurements
  const calculateFinalPrice = () => {
    if (!scannedOrder) return 0;
    
    // Get actual rates from company data
    const company = companies.find(c => c.id === scannedOrder.companyId);
    if (!company) return 0;

    const matchingService = company.services?.find((s: any) => s.type === scannedOrder.serviceType);
    const rate = matchingService?.pricePerUnit || 0;

    if (scannedOrder.serviceType === 'maritime') {
      const l = parseFloat(finalLength) || 0;
      const w = parseFloat(finalWidth) || 0;
      const h = parseFloat(finalHeight) || 0;
      const cbm = l * w * h;
      return cbm * rate;
    } else {
      const weight = parseFloat(finalWeight) || 0;
      return weight * rate;
    }
  };

  const finalPrice = calculateFinalPrice();

  const handleConfirmReceipt = async () => {
    if (!scannedOrder) return;
    
    setIsUpdating(true);
    
    const updates: any = {
      status: 'received',
      updatedAt: new Date().toISOString(),
      price: finalPrice
    };

    if (scannedOrder.serviceType === 'maritime') {
      const l = parseFloat(finalLength) || 0;
      const w = parseFloat(finalWidth) || 0;
      const h = parseFloat(finalHeight) || 0;
      updates.dimensions = { length: l, width: w, height: h };
      updates.cbm = l * w * h;
    } else {
      updates.weight = parseFloat(finalWeight) || 0;
    }

    try {
      await updateOrder(scannedOrder.id, updates);
      
      setStatus('idle');
      setScannedOrder(null);
      setIsScanning(true);
      setFinalWeight('');
      setFinalHeight('');
      setFinalLength('');
      setFinalWidth('');
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <TransitaireSidebar />
      <main className={cn(
        "p-4 lg:p-8 transition-all duration-300",
        sidebarCollapsed ? "lg:ml-24" : "lg:ml-72"
      )}>
        <header className="flex items-center gap-6 mb-12">
          <button onClick={() => navigate(-1)} className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-all">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Réception Colis</h1>
            <p className="text-slate-500 font-medium">Scannez le QR code du client pour identifier le colis et valider sa réception.</p>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Scanner View */}
          <div className="bg-white p-4 rounded-[48px] shadow-2xl border-8 border-white overflow-hidden">
            {isScanning ? (
              <div id="reader" className="w-full overflow-hidden rounded-[32px]"></div>
            ) : (
              <div className="aspect-square bg-green-50 flex flex-col items-center justify-center text-green-600 rounded-[32px]">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-white p-8 rounded-full shadow-xl mb-6"
                >
                  <CheckCircle2 size={64} />
                </motion.div>
                <p className="font-black text-xl uppercase tracking-widest">Colis Identifié</p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="p-10 bg-red-50 flex flex-col items-center justify-center text-red-600 rounded-[32px] text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-white p-6 rounded-full shadow-lg mb-6"
                >
                  <AlertCircle size={48} />
                </motion.div>
                <p className="font-black text-xl uppercase tracking-widest mb-4">Erreur de Scan</p>
                <p className="text-sm font-medium leading-relaxed max-w-[280px] mb-8">
                  {errorMessage}
                </p>
                <button 
                  onClick={resetScanner}
                  className="px-8 py-3 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-100 flex items-center gap-2"
                >
                  <RefreshCw size={18} /> Réessayer
                </button>
              </div>
            )}
            
            {isScanning && (
              <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-3 text-slate-400">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="font-bold tracking-widest uppercase text-[10px]">En attente de scan...</span>
                </div>
              </div>
            )}
          </div>

          {/* Result & Weighing View */}
          <AnimatePresence mode="wait">
            {scannedOrder ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-blue-100">
                      <Package size={32} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">ID Commande</p>
                      <h3 className="text-2xl font-black text-slate-900">{scannedOrder.id}</h3>
                    </div>
                  </div>
                  <button onClick={resetScanner} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400">
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Client</p>
                    <p className="font-bold text-slate-900">{scannedOrder.clientName}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Téléphone</p>
                    <p className="font-bold text-slate-900">{scannedOrder.clientPhone}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service</p>
                    <p className="font-bold text-blue-600 uppercase">{scannedOrder.serviceType}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination</p>
                    <p className="font-bold text-slate-900">{scannedOrder.destination}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {scannedOrder.serviceType === 'maritime' ? (
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Dimensions Réelles (mètres)</label>
                      <div className="grid grid-cols-3 gap-4">
                        <input 
                          type="number"
                          value={finalLength}
                          onChange={(e) => setFinalLength(e.target.value)}
                          placeholder="Long."
                          className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold text-center"
                        />
                        <input 
                          type="number"
                          value={finalWidth}
                          onChange={(e) => setFinalWidth(e.target.value)}
                          placeholder="Larg."
                          className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold text-center"
                        />
                        <input 
                          type="number"
                          value={finalHeight}
                          onChange={(e) => setFinalHeight(e.target.value)}
                          placeholder="Haut."
                          className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold text-center"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Poids Réel (kg)</label>
                      <div className="relative">
                        <Scale className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600" size={24} />
                        <input 
                          type="number"
                          value={finalWeight}
                          onChange={(e) => setFinalWeight(e.target.value)}
                          placeholder="0.0"
                          className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-[24px] transition-all font-black text-2xl text-slate-900"
                        />
                      </div>
                    </div>
                  )}

                  <div className="p-6 bg-slate-900 rounded-[32px] flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                        <DollarSign size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix Final</p>
                        <p className="text-2xl font-black">{finalPrice.toLocaleString()} FCFA</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-[24px] flex gap-4">
                    <Info className="text-blue-600 shrink-0" size={24} />
                    <p className="text-sm text-blue-700 font-medium leading-relaxed">
                      En validant, le client recevra une notification automatique avec le prix final et le statut passera à "Reçu".
                    </p>
                  </div>

                  <button 
                    onClick={handleConfirmReceipt}
                    disabled={isUpdating || (scannedOrder.serviceType === 'maritime' ? (!finalLength || !finalWidth || !finalHeight) : !finalWeight)}
                    className={cn(
                      "w-full py-6 bg-blue-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-blue-100 flex items-center justify-center gap-3 transition-all",
                      (isUpdating || (scannedOrder.serviceType === 'maritime' ? (!finalLength || !finalWidth || !finalHeight) : !finalWeight)) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isUpdating ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>Confirmer la Réception <CheckCircle2 size={24} /></>
                    )}
                  </button>
                  
                  <button 
                    onClick={resetScanner}
                    className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-all"
                  >
                    Annuler et scanner un autre
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[500px]"
              >
                <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-8">
                  <QrCode size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Prêt pour la réception</h3>
                <p className="text-slate-500 font-medium max-w-xs leading-relaxed">
                  Scannez l'étiquette QR collée sur le colis par le fournisseur pour accéder aux informations du client.
                </p>
                
                <div className="mt-12 grid grid-cols-3 gap-6 w-full">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <QrCode size={20} />
                    </div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">1. Scan</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <Scale size={20} />
                    </div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">2. Pesée</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <CheckCircle2 size={20} />
                    </div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">3. Valide</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
