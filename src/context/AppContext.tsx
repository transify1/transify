import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Company, Order, Message, Review, Shipment } from '../types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  companies: Company[];
  orders: Order[];
  messages: Message[];
  reviews: Review[];
  shipments: Shipment[];
  notifications: any[];
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  addReview: (review: Review) => void;
  addMessage: (message: Message) => void;
  markAsRead: (senderId: string) => void;
  updateSubscription: (plan: string) => void;
  toggleFavorite: (companyId: string) => void;
  addShipment: (shipment: Shipment) => void;
  updateShipment: (shipmentId: string, updates: Partial<Shipment>) => void;
  addNotification: (notif: any) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateCompany: (companyId: string, updates: Partial<Company>) => void;
  language: string;
  setLanguage: (lang: string) => void;
  currency: string;
  setCurrency: (curr: string) => void;
  formatPrice: (price: number) => string;
  t: (key: string) => string;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [notifications, setNotifications] = useState<any[]>([
    { id: '1', title: 'Colis Reçu', message: 'Votre colis TRX-2026-001 a été reçu par le transitaire.', time: 'Il y a 2h', read: false, type: 'package' },
    { id: '2', title: 'Nouveau Message', message: 'Global Logistics vous a envoyé un message.', time: 'Il y a 5h', read: true, type: 'message' },
    { id: '3', title: 'Paiement Validé', message: 'Votre paiement pour la commande #892 a été confirmé.', time: 'Hier', read: true, type: 'payment' },
  ]);
  const [language, setLanguage] = useState('Français (FR)');
  const [currency, setCurrency] = useState('Franc CFA (XOF)');

  // Mock initial data
  useEffect(() => {
    const mockCompanies: Company[] = [
      {
        id: 'c1',
        name: 'Sénégal Fret Express',
        logo: 'https://picsum.photos/seed/fret1/200/200',
        banner: 'https://picsum.photos/seed/logistics/1200/400',
        slogan: 'Votre partenaire logistique fiable',
        description: 'Spécialiste du transport Chine-Sénégal depuis 10 ans. Nous garantissons la sécurité et la rapidité de vos envois.',
        addressChina: 'Guangzhou, District de Yuexiu, Rue de la Paix 123',
        addressAfrica: 'Dakar, Plateau, Avenue Lamine Gueye',
        countries: ['Sénégal', 'Mali'],
        verified: true,
        rating: 4.8,
        reviewCount: 124,
        services: [
          { id: 's1', type: 'maritime', delay: '30-45 jours', priceInfo: 'Basé sur CBM', pricePerUnit: 350000, unit: 'cbm' },
          { id: 's2', type: 'aérien', delay: '5-10 jours', priceInfo: '6500 FCFA / kg', pricePerUnit: 6500, unit: 'kg' },
        ],
        gallery: [
          'https://picsum.photos/seed/wh1/800/600',
          'https://picsum.photos/seed/wh2/800/600',
          'https://picsum.photos/seed/off1/800/600',
          'https://picsum.photos/seed/off2/800/600'
        ],
        totalPackages: 1250,
        showTotalPackages: true,
        status: 'open',
        showPrice: 'full',
        showReviews: true,
        contact: {
          phone: '+221 33 800 00 00',
          whatsapp: '+221 77 000 00 00',
          email: 'contact@fret-express.sn'
        },
        style: 'minimalist',
        locations: {
          africa: true,
          china: true
        }
      },
      {
        id: 'c2',
        name: 'Ivoire Logistique',
        logo: 'https://picsum.photos/seed/fret2/200/200',
        description: 'Votre partenaire de confiance pour la Côte d\'Ivoire.',
        addressChina: 'Yiwu, Marché International, Porte 4',
        addressAfrica: 'Abidjan, Treichville, Zone 3',
        countries: ['Côte d\'Ivoire', 'Burkina Faso'],
        verified: true,
        rating: 4.5,
        reviewCount: 89,
        services: [
          { id: 's3', type: 'maritime', delay: '25-35 jours', priceInfo: 'Basé sur CBM', pricePerUnit: 320000, unit: 'cbm' },
          { id: 's4', type: 'express', delay: '3-5 jours', priceInfo: '12000 FCFA / kg', pricePerUnit: 12000, unit: 'kg' },
        ],
        gallery: [
          'https://picsum.photos/seed/wh3/800/600',
          'https://picsum.photos/seed/wh4/800/600',
          'https://picsum.photos/seed/off3/800/600'
        ],
        totalPackages: 850,
        showTotalPackages: true
      }
    ];

    // Set a default user for the preview
    // Check if we are on a transitaire route to set the correct role
    const isTransitairePath = window.location.pathname.startsWith('/transitaire');
    if (isTransitairePath) {
      const companyId = 'c1';
      const company = mockCompanies.find(c => c.id === companyId);
      
      // Dynamic progress calculation
      const calculateProgress = (c: Company | undefined) => {
        if (!c) return 0;
        let score = 0;
        if (c.name) score += 10;
        if (c.logo && !c.logo.includes('ui-avatars')) score += 10;
        if (c.banner) score += 5;
        if (c.description && c.description.length > 20) score += 15;
        if (c.addressChina) score += 10;
        if (c.addressAfrica) score += 10;
        if (c.services && c.services.length > 0) score += 15;
        if (c.contact?.phone) score += 5;
        if (c.contact?.email) score += 5;
        if (c.contact?.whatsapp) score += 5;
        if (c.gallery && c.gallery.length >= 3) score += 5;
        if (c.locations && (c.locations.africa || c.locations.china)) score += 5;
        return score;
      };

      setUser({ 
        id: 'u2', 
        name: 'Sénégal Fret Admin', 
        email: 'admin@fret-express.sn', 
        role: 'transitaire', 
        companyId: companyId,
        subscription: 'pro',
        profileProgress: calculateProgress(company)
      });
    } else {
      setUser({ id: 'u1', name: 'Jean Client', email: 'jean@exemple.com', role: 'client', favorites: ['c1'] });
    }

    setCompanies(mockCompanies);

    // Mock orders
    setOrders([
      {
        id: 'TRX-2026-8842',
        clientId: 'u1',
        clientName: 'Jean Client',
        clientPhone: '+221 77 000 00 00',
        companyId: 'c1',
        companyName: 'Sénégal Fret Express',
        serviceId: 's2',
        serviceType: 'aérien',
        status: 'in_transit',
        weight: 12.5,
        price: 81250,
        destination: 'Sénégal',
        trackingNumber: 'TRX-2026-8842',
        createdAt: '2026-04-01T10:00:00Z',
        updatedAt: '2026-04-05T14:30:00Z',
        description: 'Vêtements et chaussures',
        qrCode: 'TRX-2026-8842',
        departureDate: '2026-04-05T10:00:00Z',
        estimatedArrival: '2026-04-25T10:00:00Z'
      },
      {
        id: 'TRX-2026-3105',
        clientId: 'u1',
        clientName: 'Jean Client',
        clientPhone: '+221 77 000 00 00',
        companyId: 'c1',
        companyName: 'Sénégal Fret Express',
        serviceId: 's2',
        serviceType: 'aérien',
        status: 'received',
        weight: 5.2,
        price: 33800,
        destination: 'Sénégal',
        trackingNumber: 'TRX-2026-3105',
        createdAt: '2026-04-08T10:00:00Z',
        updatedAt: '2026-04-10T14:30:00Z',
        description: 'Électronique',
        qrCode: 'TRX-2026-3105',
      },
      {
        id: 'TRX-2026-7721',
        clientId: 'u1',
        clientName: 'Jean Client',
        clientPhone: '+221 77 000 00 00',
        companyId: 'c1',
        companyName: 'Sénégal Fret Express',
        serviceId: 's1',
        serviceType: 'maritime',
        status: 'received',
        cbm: 0.45,
        price: 157500,
        destination: 'Sénégal',
        trackingNumber: 'TRX-2026-7721',
        createdAt: '2026-04-07T10:00:00Z',
        updatedAt: '2026-04-09T14:30:00Z',
        description: 'Meubles',
        qrCode: 'TRX-2026-7721',
      }
    ]);

    // Mock messages
    setMessages([
      {
        id: 'm1',
        senderId: 'c1',
        receiverId: 'u1',
        senderName: 'Sénégal Fret Express',
        content: 'Bonjour ! Votre colis est bien arrivé à notre entrepôt de Guangzhou.',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        type: 'text',
        read: true
      },
      {
        id: 'm2',
        senderId: 'u1',
        receiverId: 'c1',
        content: 'Merci ! Quand est-ce qu\'il sera expédié ?',
        timestamp: new Date(Date.now() - 3600000 * 23).toISOString(),
        type: 'text',
        read: true
      },
      {
        id: 'm3',
        senderId: 'c1',
        receiverId: 'u1',
        senderName: 'Sénégal Fret Express',
        content: 'Il sera dans le conteneur de ce vendredi.',
        timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
        type: 'text',
        read: false
      }
    ]);

    // Mock shipments
    setShipments([
      {
        id: 'sh1',
        type: 'air',
        reference: 'TK-204',
        departureDate: '2026-04-25T10:00:00Z',
        route: { from: 'Guangzhou', to: 'Dakar' },
        capacity: { total: 500, used: 320, unit: 'kg' },
        status: 'preparation',
        packageCount: 120,
        orders: ['o1']
      },
      {
        id: 'sh2',
        type: 'sea',
        reference: 'MSC-889',
        departureDate: '2026-04-27T14:00:00Z',
        route: { from: 'Shanghai', to: 'Dakar' },
        capacity: { total: 60, used: 45, unit: 'cbm' },
        status: 'loaded',
        packageCount: 85,
        orders: []
      }
    ]);
  }, []);

  const addOrder = (order: Order) => setOrders(prev => [order, ...prev]);
  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o));
  };

  const addReview = (review: Review) => {
    setReviews(prev => [review, ...prev]);
    updateOrder(review.orderId, { reviewed: true });
    
    // Update company rating
    setCompanies(prev => prev.map(c => {
      if (c.id === review.companyId) {
        const newCount = c.reviewCount + 1;
        const newRating = ((c.rating * c.reviewCount) + review.rating) / newCount;
        return { ...c, rating: Number(newRating.toFixed(1)), reviewCount: newCount };
      }
      return c;
    }));
  };

  const addMessage = (message: Message) => setMessages(prev => [...prev, message]);
  
  const markAsRead = (senderId: string) => {
    setMessages(prev => prev.map(m => 
      (m.senderId === senderId && m.receiverId === user?.id) ? { ...m, read: true } : m
    ));
  };
  
  const updateSubscription = (plan: string) => {
    if (user && user.role === 'transitaire') {
      setUser({ ...user, subscription: plan });
    }
  };

  const toggleFavorite = (companyId: string) => {
    if (!user) return;
    const currentFavorites = user.favorites || [];
    const isFavorite = currentFavorites.includes(companyId);
    const newFavorites = isFavorite 
      ? currentFavorites.filter(id => id !== companyId)
      : [...currentFavorites, companyId];
    
    setUser({ ...user, favorites: newFavorites });
  };

  const addShipment = (shipment: Shipment) => setShipments(prev => [shipment, ...prev]);
  const updateShipment = (shipmentId: string, updates: Partial<Shipment>) => {
    setShipments(prev => prev.map(s => s.id === shipmentId ? { ...s, ...updates } : s));
  };

  const addNotification = (notif: any) => {
    setNotifications(prev => [{ id: Date.now().toString(), ...notif, read: false, time: 'À l\'instant' }, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateCompany = (companyId: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === companyId) {
        const updatedCompany = { ...c, ...updates };
        
        // Update user progress if this is the user's company
        if (user && user.companyId === companyId) {
          const calculateProgress = (comp: Company) => {
            let score = 0;
            if (comp.name) score += 10;
            if (comp.logo && !comp.logo.includes('ui-avatars')) score += 10;
            if (comp.banner) score += 5;
            if (comp.description && comp.description.length > 20) score += 15;
            if (comp.addressChina) score += 10;
            if (comp.addressAfrica) score += 10;
            if (comp.services && comp.services.length > 0) score += 15;
            if (comp.contact?.phone) score += 5;
            if (comp.contact?.email) score += 5;
            if (comp.contact?.whatsapp) score += 5;
            if (comp.gallery && comp.gallery.length >= 3) score += 5;
            if (comp.locations && (comp.locations.africa || comp.locations.china)) score += 5;
            return Math.min(score, 100);
          };
          setUser({ ...user, profileProgress: calculateProgress(updatedCompany) });
        }
        
        return updatedCompany;
      }
      return c;
    }));
  };

  const formatPrice = (price: number) => {
    if (currency === 'Euro (€)') {
      return (price / 655.957).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
    }
    if (currency === 'Dollar ($)') {
      return (price / 600).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
    return price.toLocaleString('fr-FR') + ' FCFA';
  };

  const translations: Record<string, Record<string, string>> = {
    'Français (FR)': {
      'dashboard': 'Tableau de bord',
      'explorer': 'Explorer',
      'orders': 'Mes Colis',
      'messages': 'Messages',
      'profile': 'Paramètres',
      'logout': 'Déconnexion',
      'welcome': 'Bonjour',
      'active_shipment': 'Suivi Actif',
      'history': 'Historique',
      'favorites': 'Favoris',
      'new_order': 'Nouvel Envoi',
    },
    'English (US)': {
      'dashboard': 'Dashboard',
      'explorer': 'Explore',
      'orders': 'My Packages',
      'messages': 'Messages',
      'profile': 'Settings',
      'logout': 'Logout',
      'welcome': 'Hello',
      'active_shipment': 'Active Tracking',
      'history': 'History',
      'favorites': 'Favorites',
      'new_order': 'New Shipment',
    },
    'Español (ES)': {
      'dashboard': 'Panel',
      'explorer': 'Explorar',
      'orders': 'Mis Paquetes',
      'messages': 'Mensajes',
      'profile': 'Ajustes',
      'logout': 'Cerrar sesión',
      'welcome': 'Hola',
      'active_shipment': 'Seguimiento Activo',
      'history': 'Historial',
      'favorites': 'Favoritos',
      'new_order': 'Nuevo Envío',
    }
  };

  const t = (key: string) => {
    return translations[language]?.[key] || translations['Français (FR)'][key] || key;
  };

  const logout = () => setUser(null);

  return (
    <AppContext.Provider value={{ 
      user, setUser, companies, orders, messages, reviews, shipments, notifications,
      addOrder, updateOrder, addReview, addMessage, markAsRead, updateSubscription, toggleFavorite, 
      addShipment, updateShipment, addNotification, markNotificationAsRead, markAllNotificationsAsRead, 
      updateCompany, language, setLanguage, currency, setCurrency, formatPrice, t, logout 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
