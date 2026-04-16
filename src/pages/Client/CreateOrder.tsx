import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, Ship, Plane, Zap, CheckCircle2, 
  Package, MapPin, Info, AlertCircle, ChevronRight,
  ChevronLeft, DollarSign, Scale, Box, Truck,
  Download, Share2, Printer, Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import Logo from '../../components/Logo';

type OrderStep = 'service' | 'details' | 'destination' | 'confirm';

export default function CreateOrder() {
  const { companyId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { companies, addOrder, user } = useApp();
  const qrRef = useRef<HTMLDivElement>(null);
  
  const company = companies.find(c => c.id === companyId);
  const initialServiceId = searchParams.get('service');

  const [step, setStep] = useState<OrderStep>('service');
  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId || '');
  
  // Client Info
  const [clientName, setClientName] = useState(user?.name || '');
  const [clientPhone1, setClientPhone1] = useState(user?.phone || '');
  const [clientPhone2, setClientPhone2] = useState('');
  const [destination, setDestination] = useState('');
  
  // Package Details
  const [description, setDescription] = useState('');
  const [estimatedWeight, setEstimatedWeight] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialServiceId) {
      setSelectedServiceId(initialServiceId);
      setStep('details');
    }
  }, [initialServiceId]);

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Transitaire non trouvé</h2>
        <button onClick={() => navigate('/client/explorer')} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold">
          Retour à l'explorateur
        </button>
      </div>
    );
  }

  const selectedService = company.services.find(s => s.id === selectedServiceId);

  // Real-time calculation
  const calculatePrice = () => {
    if (!selectedService) return 0;
    if (selectedService.type === 'maritime') {
      const l = parseFloat(length) || 0;
      const w = parseFloat(width) || 0;
      const h = parseFloat(height) || 0;
      const cbm = l * w * h;
      return cbm * selectedService.pricePerUnit;
    } else {
      const weight = parseFloat(estimatedWeight) || 0;
      return weight * selectedService.pricePerUnit;
    }
  };

  const estimatedPrice = calculatePrice();

  const handleNext = () => {
    if (step === 'service' && selectedServiceId) setStep('details');
    else if (step === 'details' && description && clientName && clientPhone1) setStep('destination');
    else if (step === 'destination' && destination) setStep('confirm');
  };

  const handleBack = () => {
    if (step === 'details') setStep('service');
    else if (step === 'destination') setStep('details');
    else if (step === 'confirm') setStep('destination');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `TRX-${year}-${randomNum}`;
    
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    const cbm = l * w * h;

    const newOrder = {
      id: orderId,
      clientId: user?.id || 'guest',
      clientName,
      clientPhone: clientPhone1,
      clientPhone2: clientPhone2 || undefined,
      companyId: company.id,
      companyName: company.name,
      serviceId: selectedServiceId,
      serviceType: selectedService?.type || 'N/A',
      status: 'pending' as const,
      description,
      weight: parseFloat(estimatedWeight) || undefined,
      cbm: cbm || undefined,
      dimensions: selectedService?.type === 'maritime' ? { length: l, width: w, height: h } : undefined,
      price: estimatedPrice,
      destination,
      trackingNumber: orderId, // Use the same for tracking or a variation
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      qrCode: orderId, // We'll store the ID as the QR reference
    };

    // Simulate API call
    setTimeout(() => {
      addOrder(newOrder);
      setCreatedOrder(newOrder);
      setIsSubmitting(false);
      setOrderSuccess(true);
    }, 2000);
  };

  const downloadQRCode = async () => {
    if (qrRef.current) {
      setIsGenerating(true);
      try {
        const canvas = await html2canvas(qrRef.current, {
          backgroundColor: '#ffffff',
          scale: 4,
          useCORS: true,
          logging: false,
          allowTaint: true
        });
        const url = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = `etiquette-${createdOrder?.id}.png`;
        link.href = url;
        link.click();
      } catch (err) {
        console.error('Erreur de téléchargement:', err);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleShare = async () => {
    if (qrRef.current) {
      setIsGenerating(true);
      try {
        const canvas = await html2canvas(qrRef.current, {
          backgroundColor: '#ffffff',
          scale: 4,
          useCORS: true,
          logging: false,
          allowTaint: true
        });
        
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
        
        if (blob && navigator.share) {
          const file = new File([blob], `etiquette-${createdOrder?.id}.png`, { type: 'image/png' });
          await navigator.share({
            files: [file],
            title: 'Étiquette de colis Transify',
            text: `Voici l'étiquette pour mon colis ${createdOrder?.id}`,
          });
        } else {
          // Fallback to download if share not supported
          const url = canvas.toDataURL('image/png', 1.0);
          const link = document.createElement('a');
          link.download = `etiquette-${createdOrder?.id}.png`;
          link.href = url;
          link.click();
        }
      } catch (err) {
        console.error('Erreur de partage:', err);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const steps = [
    { id: 'service', label: 'Service', icon: <Truck size={18} /> },
    { id: 'details', label: 'Infos & Colis', icon: <Package size={18} /> },
    { id: 'destination', label: 'Destination', icon: <MapPin size={18} /> },
    { id: 'confirm', label: 'Confirmation', icon: <CheckCircle2 size={18} /> },
  ];

  if (orderSuccess && createdOrder) {
    // QR Code contains ALL information
    const qrData = JSON.stringify({
      id_commande: createdOrder.id,
      nom: createdOrder.clientName,
      telephone: createdOrder.clientPhone,
      telephone2: createdOrder.clientPhone2 || "N/A",
      adresse: createdOrder.destination,
      type_transport: createdOrder.serviceType,
      poids: createdOrder.weight || "N/A",
      dimensions: createdOrder.dimensions || "N/A",
      date: createdOrder.createdAt
    });

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-6">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
        >
          <div className="bg-slate-900 p-6 text-white text-center">
            <div className="w-12 h-12 bg-apple-blue rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={24} />
            </div>
            <h1 className="text-[20px] font-black tracking-tight">Commande Validée</h1>
            <p className="text-white/60 font-bold text-[11px] mt-1 uppercase tracking-widest">Votre étiquette est prête</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center">
              <p className="text-slate-500 font-bold mb-6 text-[11px] leading-relaxed">
                Téléchargez cette étiquette et envoyez-la à votre fournisseur. Il doit l'imprimer et la coller sur votre colis.
              </p>
              
            <div className="bg-[#f8fafc] rounded-[24px] p-4 mb-8 flex justify-center border border-[#f1f5f9]">
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
                    {createdOrder.clientName}
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
                  <p className="text-[22px] font-black tracking-normal leading-none whitespace-nowrap">{createdOrder.id}</p>
                </div>
              </div>
            </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={downloadQRCode}
                disabled={isGenerating}
                className="flex items-center justify-center gap-2 py-3 bg-apple-blue text-white rounded-[14px] font-black shadow-lg shadow-blue-50 hover:bg-blue-700 transition-all text-[11px] uppercase tracking-widest disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                {isGenerating ? 'Génération...' : 'Télécharger'}
              </button>
              <button 
                onClick={handleShare}
                disabled={isGenerating}
                className="flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 rounded-[14px] font-black hover:bg-slate-100 transition-all text-[11px] uppercase tracking-widest disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Share2 size={16} />
                )}
                {isGenerating ? 'Génération...' : 'Partager'}
              </button>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col gap-2.5">
              <button 
                onClick={() => navigate('/client/orders')}
                className="w-full py-3.5 bg-slate-900 text-white rounded-[14px] font-black text-[12px] uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                Mes expéditions
              </button>
              <button 
                onClick={() => navigate('/client/dashboard')}
                className="w-full py-3 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-slate-600 transition-all"
              >
                Tableau de bord
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32 fluid-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-[10px] transition-all">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-[14px] font-black text-slate-900 tracking-tight uppercase tracking-widest">Nouvelle Expédition</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-6 mt-4">
        {/* Progress Bar */}
        <div className="flex justify-between mb-10 relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          {steps.map((s, i) => {
            const isActive = step === s.id;
            const isCompleted = steps.findIndex(x => x.id === step) > i;
            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-1.5">
                <div className={cn(
                  "w-7 h-7 rounded-[8px] flex items-center justify-center transition-all duration-500",
                  isActive ? "bg-apple-blue text-white shadow-lg shadow-blue-50 scale-110" : 
                  isCompleted ? "bg-green-500 text-white" : "bg-white text-slate-400 border border-slate-200"
                )}>
                  {isCompleted ? <CheckCircle2 size={14} /> : React.cloneElement(s.icon as React.ReactElement, { size: 14 })}
                </div>
                <span className={cn(
                  "text-[7px] font-black uppercase tracking-widest",
                  isActive ? "text-apple-blue" : "text-slate-400"
                )}>{s.label}</span>
              </div>
            );
          })}
        </div>

        <div className="apple-card !p-6 md:!p-8">
          <AnimatePresence mode="wait">
            {step === 'service' && (
              <motion.div
                key="step-service"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-[18px] font-black text-slate-900 mb-1 tracking-tight">Mode de transport</h2>
                  <p className="text-[12px] text-slate-500 font-bold">Comment souhaitez-vous envoyer votre colis ?</p>
                </div>

                <div className="space-y-3">
                  {company.services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={cn(
                        "w-full p-4 rounded-[18px] border-2 text-left transition-all flex items-center justify-between group",
                        selectedServiceId === service.id ? "border-apple-blue bg-blue-50/20" : "border-slate-50 hover:border-blue-100"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-[12px] flex items-center justify-center transition-all",
                          selectedServiceId === service.id ? "bg-apple-blue text-white shadow-lg shadow-blue-50" : "bg-slate-100 text-slate-400"
                        )}>
                          {service.type === 'maritime' && <Ship size={20} />}
                          {service.type === 'aérien' && <Plane size={20} />}
                          {service.type === 'express' && <Zap size={20} />}
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 text-[14px] capitalize">{service.type}</h3>
                          <p className="text-[10px] font-bold text-slate-500">{service.delay} • {service.priceInfo}</p>
                        </div>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        selectedServiceId === service.id ? "border-apple-blue bg-apple-blue text-white" : "border-slate-200"
                      )}>
                        {selectedServiceId === service.id && <CheckCircle2 size={12} />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'details' && (
              <motion.div
                key="step-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-[18px] font-black text-slate-900 mb-1 tracking-tight">Informations & Colis</h2>
                  <p className="text-[12px] text-slate-500 font-bold">Remplissez vos coordonnées et les détails de votre envoi.</p>
                </div>

                <div className="space-y-5">
                  {/* Client Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Nom Complet</label>
                      <input 
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Votre nom complet"
                        className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-black text-slate-900 text-[13px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Téléphone 1</label>
                      <input 
                        type="tel"
                        value={clientPhone1}
                        onChange={(e) => setClientPhone1(e.target.value)}
                        placeholder="+221 ..."
                        className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-black text-slate-900 text-[13px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Téléphone 2 (Optionnel)</label>
                    <input 
                      type="tel"
                      value={clientPhone2}
                      onChange={(e) => setClientPhone2(e.target.value)}
                      placeholder="+221 ..."
                      className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-black text-slate-900 text-[13px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Description du contenu</label>
                    <textarea 
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Ex: 5 paires de chaussures, 10 t-shirts..."
                      className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-medium text-slate-600 text-[13px]"
                    />
                  </div>

                  {/* Dynamic Fields */}
                  {selectedService?.type === 'maritime' ? (
                    <div className="space-y-3">
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Dimensions (mètres)</label>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <input 
                            type="number"
                            value={length}
                            onChange={(e) => setLength(e.target.value)}
                            placeholder="Long."
                            className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-black text-center text-slate-900 text-[13px]"
                          />
                        </div>
                        <div>
                          <input 
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            placeholder="Larg."
                            className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-black text-center text-slate-900 text-[13px]"
                          />
                        </div>
                        <div>
                          <input 
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="Haut."
                            className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-black text-center text-slate-900 text-[13px]"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Poids estimé (kg)</label>
                      <div className="relative">
                        <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="number"
                          value={estimatedWeight}
                          onChange={(e) => setEstimatedWeight(e.target.value)}
                          placeholder="0.0"
                          className="w-full pl-11 pr-5 py-2.5 bg-slate-50 border-none rounded-[10px] focus:ring-2 focus:ring-apple-blue transition-all font-black text-slate-900 text-[13px]"
                        />
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50/50 rounded-[20px] flex items-center justify-between border border-blue-100/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-apple-blue text-white rounded-[10px] flex items-center justify-center shadow-lg shadow-blue-50">
                        <DollarSign size={18} />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-apple-blue uppercase tracking-widest">Prix Estimé</p>
                        <p className="text-[15px] font-black text-slate-900">{estimatedPrice.toLocaleString()} FCFA</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Délai</p>
                      <p className="text-[11px] font-bold text-slate-600">{selectedService?.delay}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'destination' && (
              <motion.div
                key="step-destination"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-[18px] font-black text-slate-900 mb-1 tracking-tight">Destination</h2>
                  <p className="text-[12px] text-slate-500 font-bold">Où souhaitez-vous récupérer votre colis ?</p>
                </div>

                <div className="space-y-3">
                  {company.countries.map((country) => (
                    <button
                      key={country}
                      onClick={() => setDestination(country)}
                      className={cn(
                        "w-full p-4 rounded-[18px] border-2 text-left transition-all flex items-center justify-between",
                        destination === country ? "border-apple-blue bg-blue-50/20" : "border-slate-50 hover:border-blue-100"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-9 h-9 rounded-[10px] flex items-center justify-center",
                          destination === country ? "bg-apple-blue text-white shadow-lg shadow-blue-50" : "bg-slate-100 text-slate-400"
                        )}>
                          <MapPin size={18} />
                        </div>
                        <span className="font-black text-slate-900 text-[14px]">{country}</span>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        destination === country ? "border-apple-blue bg-apple-blue text-white" : "border-slate-200"
                      )}>
                        {destination === country && <CheckCircle2 size={12} />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'confirm' && (
              <motion.div
                key="step-confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-[18px] font-black text-slate-900 mb-1 tracking-tight">Récapitulatif</h2>
                  <p className="text-[12px] text-slate-500 font-bold">Vérifiez les informations avant de confirmer.</p>
                </div>

                <div className="bg-slate-50 rounded-[24px] p-5 space-y-5 border border-slate-100">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200/50">
                    <div className="flex items-center gap-3">
                      <img src={company.logo} className="w-9 h-9 rounded-[10px]" alt="" />
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Transitaire</p>
                        <p className="text-[13px] font-black text-slate-900">{company.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Service</p>
                      <p className="text-[13px] font-black text-apple-blue capitalize">{selectedService?.type}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Client</p>
                      <p className="text-[12px] font-black text-slate-900">{clientName}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Téléphone</p>
                      <p className="text-[12px] font-black text-slate-900">{clientPhone1}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Contenu</p>
                      <p className="text-[12px] font-bold text-slate-900 line-clamp-2">{description}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Destination</p>
                      <p className="text-[12px] font-black text-slate-900">{destination}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/50">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Prix Estimé</span>
                      <span className="text-[20px] font-black text-slate-900">{estimatedPrice.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-[16px] border border-orange-100">
                  <AlertCircle className="text-orange-500 shrink-0" size={16} />
                  <p className="text-[10px] text-orange-700 font-bold leading-relaxed">
                    Le prix final sera validé par le transitaire après pesée réelle. Vous recevrez une notification de confirmation.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-8 flex gap-3">
            {step !== 'service' && (
              <button 
                onClick={handleBack}
                className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-[14px] font-black flex items-center justify-center gap-2 hover:bg-slate-100 transition-all text-[11px] uppercase tracking-widest"
              >
                <ChevronLeft size={16} /> Retour
              </button>
            )}
            
            {step === 'confirm' ? (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={cn(
                  "flex-[2] py-3 bg-apple-blue text-white rounded-[14px] font-black shadow-lg shadow-blue-50 flex items-center justify-center gap-2 transition-all text-[11px] uppercase tracking-widest",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>Confirmer <CheckCircle2 size={16} /></>
                )}
              </button>
            ) : (
              <button 
                onClick={handleNext}
                disabled={
                  (step === 'service' && !selectedServiceId) ||
                  (step === 'details' && (!description || !clientName || !clientPhone1)) ||
                  (step === 'destination' && !destination)
                }
                className={cn(
                  "flex-[2] py-3 bg-slate-900 text-white rounded-[14px] font-black shadow-lg shadow-slate-50 flex items-center justify-center gap-2 transition-all text-[11px] uppercase tracking-widest",
                  ((step === 'service' && !selectedServiceId) || (step === 'details' && (!description || !clientName || !clientPhone1)) || (step === 'destination' && !destination)) && "opacity-50 cursor-not-allowed"
                )}
              >
                Suivant <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
