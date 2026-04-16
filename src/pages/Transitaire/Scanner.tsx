import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5QrcodeScanner } from 'html5-qrcode';
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
  const { orders, updateOrder } = useApp();
  const [isScanning, setIsScanning] = useState(true);
  const [scannedOrder, setScannedOrder] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
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

  function onScanSuccess(decodedText: string) {
    try {
      const data = JSON.parse(decodedText);
      const orderId = data.id_commande || data.orderId;
      
      if (orderId) {
        // Find the order in our state
        const order = orders.find(o => o.id === orderId);
        if (order) {
          setScannedOrder(order);
          setFinalWeight(order.weight?.toString() || '');
          if (order.dimensions) {
            setFinalLength(order.dimensions.length.toString());
            setFinalWidth(order.dimensions.width.toString());
            setFinalHeight(order.dimensions.height.toString());
          }
          setStatus('success');
          setIsScanning(false);
          if (scannerRef.current) {
            scannerRef.current.clear();
          }
        } else {
          // If not found in state, we use the data from QR
          setScannedOrder({
            id: orderId,
            clientName: data.nom,
            clientPhone: data.telephone,
            serviceType: data.type_transport,
            destination: data.adresse,
            weight: parseFloat(data.poids) || undefined,
            dimensions: data.dimensions !== "N/A" ? data.dimensions : undefined,
          });
          setFinalWeight(data.poids !== "N/A" ? data.poids : '');
          if (data.dimensions && data.dimensions !== "N/A") {
            setFinalLength(data.dimensions.length.toString());
            setFinalWidth(data.dimensions.width.toString());
            setFinalHeight(data.dimensions.height.toString());
          }
          setStatus('success');
          setIsScanning(false);
          if (scannerRef.current) {
            scannerRef.current.clear();
          }
        }
      }
    } catch (e) {
      console.error("Invalid QR Code data", e);
      setStatus('error');
    }
  }

  function onScanFailure(error: any) {
    // console.warn(`Code scan error = ${error}`);
  }

  const resetScanner = () => {
    setScannedOrder(null);
    setStatus('idle');
    setIsScanning(true);
    setFinalWeight('');
    setFinalLength('');
    setFinalWidth('');
    setFinalHeight('');
  };

  // Recalculate price based on real measurements
  const calculateFinalPrice = () => {
    if (!scannedOrder) return 0;
    
    // We need to find the company and service to get the rate
    const company = orders.find(o => o.id === scannedOrder.id)?.companyId;
    // For mock purposes, let's assume some rates if we can't find them
    const rateKg = 6500;
    const rateCbm = 350000;

    if (scannedOrder.serviceType === 'maritime') {
      const l = parseFloat(finalLength) || 0;
      const w = parseFloat(finalWidth) || 0;
      const h = parseFloat(finalHeight) || 0;
      const cbm = l * w * h;
      return cbm * rateCbm;
    } else {
      const weight = parseFloat(finalWeight) || 0;
      return weight * rateKg;
    }
  };

  const finalPrice = calculateFinalPrice();

  const handleConfirmReceipt = () => {
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

    // Simulate API call
    setTimeout(() => {
      updateOrder(scannedOrder.id, updates);
      
      setIsUpdating(false);
      setStatus('idle');
      setScannedOrder(null);
      setIsScanning(true);
      setFinalWeight('');
      setFinalLength('');
      setFinalWidth('');
      setFinalHeight('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <TransitaireSidebar />
      <main className="lg:ml-72 p-8 lg:p-12">
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
