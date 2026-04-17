import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Company, Order, Message, Review, Shipment } from '../types';
import { supabase, hasSupabaseConfig } from '../lib/supabase';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  companies: Company[];
  orders: Order[];
  messages: Message[];
  reviews: Review[];
  shipments: Shipment[];
  notifications: any[];
  tickets: any[];
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  addReview: (review: Review) => void;
  addMessage: (message: Message) => void;
  addTicket: (ticket: any) => Promise<void>;
  markAsRead: (senderId: string) => void;
  updateSubscription: (plan: string) => void;
  toggleFavorite: (companyId: string) => void;
  addShipment: (shipment: Shipment) => void;
  updateShipment: (shipmentId: string, updates: Partial<Shipment>) => void;
  addNotification: (notif: any) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateCompany: (companyId: string, updates: Partial<Company>) => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  addCompany: (company: Company) => void;
  language: string;
  setLanguage: (lang: string) => void;
  currency: string;
  setCurrency: (curr: string) => void;
  formatPrice: (price: number) => string;
  t: (key: string) => string;
  logout: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [language, setLanguage] = useState('Français (FR)');
  const [currency, setCurrency] = useState('FCFA');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial data and Auth state
  useEffect(() => {
    const initializeApp = async () => {
      if (!hasSupabaseConfig) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // 1. Get Auth Session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role,
              country: profile.country,
              phone: profile.phone,
              avatar: profile.avatar,
              companyId: profile.company_id,
              subscription: profile.subscription,
              favorites: profile.favorites,
              profileProgress: profile.profile_progress,
              addresses: profile.addresses || []
            });
          }
        }

        // 2. Initial Data Fetching
        const [
          { data: companiesData },
          { data: ordersData },
          { data: messagesData },
          { data: reviewsData },
          { data: shipmentsData },
          { data: notificationsData },
          { data: ticketsData }
        ] = await Promise.all([
          supabase.from('companies').select('*'),
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('messages').select('*').order('timestamp', { ascending: true }),
          supabase.from('reviews').select('*').order('created_at', { ascending: false }),
          supabase.from('shipments').select('*').order('created_at', { ascending: false }),
          supabase.from('notifications').select('*').order('created_at', { ascending: false }),
          supabase.from('tickets').select('*').order('created_at', { ascending: false })
        ]);

        if (companiesData) setCompanies(companiesData.map(c => ({
          ...c,
          addressChina: c.address_china,
          addressAfrica: c.address_africa,
          reviewCount: c.review_count,
          showTotalPackages: c.show_total_packages,
          showPrice: c.show_price,
          showReviews: c.show_reviews
        })));
        if (ordersData) setOrders(ordersData.map(o => ({
          ...o,
          clientId: o.client_id,
          clientName: o.client_name,
          clientPhone: o.client_phone,
          clientPhone2: o.client_phone2,
          companyId: o.company_id,
          companyName: o.company_name,
          serviceId: o.service_id,
          serviceType: o.service_type,
          trackingNumber: o.tracking_number,
          paymentStatus: o.payment_status,
          createdAt: o.created_at,
          updatedAt: o.updated_at,
          qrCode: o.qr_code,
          departureDate: o.departure_date,
          estimatedArrival: o.estimated_arrival
        })));
        if (messagesData) setMessages(messagesData.map(m => ({
          ...m,
          senderId: m.sender_id,
          receiverId: m.receiver_id,
          senderName: m.sender_name,
          orderId: m.order_id
        })));
        if (reviewsData) setReviews(reviewsData.map(r => ({
          ...r,
          orderId: r.order_id,
          companyId: r.company_id,
          clientId: r.client_id,
          clientName: r.client_name,
          createdAt: r.created_at
        })));
        if (shipmentsData) setShipments(shipmentsData.map(s => ({
          ...s,
          companyId: s.company_id,
          departureDate: s.departure_date,
          packageCount: s.package_count,
          orders: s.order_ids
        })));
        if (notificationsData) setNotifications(notificationsData.map(n => ({
          ...n,
          userId: n.user_id,
          createdAt: n.created_at
        })));
        
        if (ticketsData) setTickets(ticketsData.map(t => ({
          ...t,
          userId: t.user_id,
          createdAt: t.created_at,
          updatedAt: t.updated_at
        })));

      } catch (error) {
        console.error('Error initializing Supabase app:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();

    if (!hasSupabaseConfig) return;

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            country: profile.country,
            phone: profile.phone,
            avatar: profile.avatar,
            companyId: profile.company_id,
            subscription: profile.subscription,
            favorites: profile.favorites,
            profileProgress: profile.profile_progress,
            addresses: profile.addresses || []
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    const messageChannel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage = payload.new as any;
        setMessages(prev => [...prev, {
          id: newMessage.id,
          senderId: newMessage.sender_id,
          receiverId: newMessage.receiver_id,
          senderName: newMessage.sender_name,
          orderId: newMessage.order_id,
          content: newMessage.content,
          timestamp: newMessage.timestamp,
          type: newMessage.type,
          read: newMessage.read
        }]);
      })
      .subscribe();

    const notifChannel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        const n = payload.new as any;
        if (n.user_id === user?.id) {
          setNotifications(prev => [{
            id: n.id,
            userId: n.user_id,
            title: n.title,
            content: n.content,
            type: n.type,
            read: n.read,
            metadata: n.metadata,
            createdAt: n.created_at
          }, ...prev]);
        }
      })
      .subscribe();

    const orderChannel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const o = payload.new as any;
          setOrders(prev => [{
            id: o.id,
            clientId: o.client_id,
            clientName: o.client_name,
            clientPhone: o.client_phone,
            companyId: o.company_id,
            companyName: o.company_name,
            serviceId: o.service_id,
            serviceType: o.service_type,
            status: o.status,
            trackingNumber: o.tracking_number,
            paymentStatus: o.payment_status,
            createdAt: o.created_at,
            updatedAt: o.updated_at
          } as any, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          const o = payload.new as any;
          setOrders(prev => prev.map(order => order.id === o.id ? {
            ...order,
            status: o.status,
            paymentStatus: o.payment_status,
            updatedAt: o.updated_at
          } : order));
        }
      })
      .subscribe();

    const ticketChannel = supabase
      .channel('public:tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const t = payload.new as any;
          setTickets(prev => [{
            id: t.id,
            userId: t.user_id,
            subject: t.subject,
            content: t.content,
            status: t.status,
            priority: t.priority,
            category: t.category,
            createdAt: t.created_at,
            updatedAt: t.updated_at
          }, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          const t = payload.new as any;
          setTickets(prev => prev.map(ticket => ticket.id === t.id ? {
            ...ticket,
            status: t.status,
            updatedAt: t.updated_at
          } : ticket));
        }
      })
      .subscribe();

    return () => {
      authSubscription.unsubscribe();
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(notifChannel);
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(ticketChannel);
    };
  }, []);

  const addTicket = async (ticket: any) => {
    if (!user) return;
    const { error } = await supabase.from('tickets').insert([{
      user_id: user.id,
      subject: ticket.subject,
      content: ticket.content,
      category: ticket.category,
      priority: ticket.priority
    }]);
    
    if (!error) {
      // Tickets are handled via realtime subscription for the list
    }
  };
  const addOrder = async (order: Order) => {
    const { error } = await supabase.from('orders').insert([{
      id: order.id,
      client_id: order.clientId,
      client_name: order.clientName,
      client_phone: order.clientPhone,
      client_phone2: order.clientPhone2,
      company_id: order.companyId,
      company_name: order.companyName,
      service_id: order.serviceId,
      service_type: order.serviceType,
      status: order.status,
      weight: order.weight,
      cbm: order.cbm,
      dimensions: order.dimensions,
      price: order.price,
      destination: order.destination,
      tracking_number: order.trackingNumber,
      description: order.description,
      qr_code: order.qrCode,
      departure_date: order.departureDate,
      estimated_arrival: order.estimatedArrival,
      payment_status: order.paymentStatus || 'unpaid'
    }]);

    if (!error) {
      setOrders(prev => [order, ...prev]);
      
      const { data: company } = await supabase.from('companies').select('owner_id').eq('id', order.companyId).single();
      if (company?.owner_id) {
        addNotification({
          userId: company.owner_id,
          title: "Nouvelle commande",
          content: `Vous avez reçu une nouvelle commande de ${order.clientName}.`,
          type: 'order',
          metadata: { orderId: order.id }
        });
      }
    }
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    const dbUpdates: any = { ...updates };
    if (updates.clientId) { dbUpdates.client_id = updates.clientId; delete dbUpdates.clientId; }
    if (updates.companyId) { dbUpdates.company_id = updates.companyId; delete dbUpdates.companyId; }
    if (updates.serviceId) { dbUpdates.service_id = updates.serviceId; delete dbUpdates.serviceId; }
    if (updates.trackingNumber) { dbUpdates.tracking_number = updates.trackingNumber; delete dbUpdates.trackingNumber; }
    if (updates.departureDate) { dbUpdates.departure_date = updates.departureDate; delete dbUpdates.departureDate; }
    if (updates.estimatedArrival) { dbUpdates.estimated_arrival = updates.estimatedArrival; delete dbUpdates.estimatedArrival; }
    
    dbUpdates.updated_at = new Date().toISOString();

    const { error } = await supabase.from('orders').update(dbUpdates).eq('id', orderId);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates, updatedAt: dbUpdates.updated_at } : o));
      
      // Notify the client if status changed
      if (updates.status) {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          addNotification({
            userId: order.clientId,
            title: "Mise à jour de votre colis",
            content: `Votre colis ${orderId} est désormais : ${updates.status}.`,
            type: 'order',
            metadata: { orderId }
          });
        }
      }
    }
  };

  const addReview = async (review: Review) => {
    const { error } = await supabase.from('reviews').insert([{
      id: review.id,
      order_id: review.orderId,
      company_id: review.companyId,
      client_id: review.clientId,
      client_name: review.clientName,
      rating: review.rating,
      comment: review.comment,
      criteria: review.criteria
    }]);

    if (!error) {
      setReviews(prev => [review, ...prev]);
      updateOrder(review.orderId, { reviewed: true });
      
      const company = companies.find(c => c.id === review.companyId);
      if (company) {
        const newCount = company.reviewCount + 1;
        const newRating = ((company.rating * company.reviewCount) + review.rating) / newCount;
        const finalRating = Number(newRating.toFixed(1));
        
        await supabase.from('companies').update({
          rating: finalRating,
          review_count: newCount
        }).eq('id', company.id);

        setCompanies(prev => prev.map(c => 
          c.id === review.companyId ? { ...c, rating: finalRating, reviewCount: newCount } : c
        ));
      }
    }
  };

  const addMessage = async (message: Message) => {
    const { error } = await supabase.from('messages').insert([{
      id: message.id,
      sender_id: message.senderId,
      receiver_id: message.receiverId,
      sender_name: message.senderName,
      order_id: message.orderId,
      content: message.content,
      type: message.type,
      read: message.read,
      timestamp: message.timestamp
    }]);

    if (!error) {
      setMessages(prev => [...prev, message]);
      
      // Notify the receiver
      addNotification({
        userId: message.receiverId,
        title: "Nouveau message",
        content: `Vous avez reçu un message de ${message.senderName}.`,
        type: 'message',
        metadata: { orderId: message.orderId }
      });
    }
  };
  
  const markAsRead = async (senderId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', senderId)
      .eq('receiver_id', user?.id || '');

    if (!error) {
      setMessages(prev => prev.map(m => 
        (m.senderId === senderId && m.receiverId === user?.id) ? { ...m, read: true } : m
      ));
    }
  };
  
  const updateSubscription = async (plan: string) => {
    if (user && user.role === 'transitaire') {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription: plan })
        .eq('id', user.id);
      
      if (!error) setUser({ ...user, subscription: plan });
    }
  };

  const toggleFavorite = async (companyId: string) => {
    if (!user) return;
    const currentFavorites = user.favorites || [];
    const isFavorite = currentFavorites.includes(companyId);
    const newFavorites = isFavorite 
      ? currentFavorites.filter(id => id !== companyId)
      : [...currentFavorites, companyId];
    
    const { error } = await supabase
      .from('profiles')
      .update({ favorites: newFavorites })
      .eq('id', user.id);

    if (!error) setUser({ ...user, favorites: newFavorites });
  };

  const addShipment = async (shipment: Shipment) => {
    const { error } = await supabase.from('shipments').insert([{
      id: shipment.id,
      company_id: shipment.companyId,
      type: shipment.type,
      reference: shipment.reference,
      departure_date: shipment.departureDate,
      route: shipment.route,
      capacity: shipment.capacity,
      status: shipment.status,
      package_count: shipment.packageCount,
      order_ids: shipment.orders
    }]);

    if (!error) setShipments(prev => [shipment, ...prev]);
  };

  const updateShipment = async (shipmentId: string, updates: Partial<Shipment>) => {
    const dbUpdates: any = { ...updates };
    if (updates.companyId) { dbUpdates.company_id = updates.companyId; delete dbUpdates.companyId; }
    if (updates.departureDate) { dbUpdates.departure_date = updates.departureDate; delete dbUpdates.departureDate; }
    if (updates.packageCount) { dbUpdates.package_count = updates.packageCount; delete dbUpdates.packageCount; }
    if (updates.orders) { dbUpdates.order_ids = updates.orders; delete dbUpdates.orders; }

    const { error } = await supabase.from('shipments').update(dbUpdates).eq('id', shipmentId);
    if (!error) setShipments(prev => prev.map(s => s.id === shipmentId ? { ...s, ...updates } : s));
  };

  const addNotification = async (notif: any) => {
    const { data: newNotif, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: notif.userId,
        title: notif.title,
        content: notif.content,
        type: notif.type || 'system',
        metadata: notif.metadata || {},
        read: false
      }])
      .select()
      .single();

    if (!error && newNotif) {
      if (newNotif.user_id === user?.id) {
        setNotifications(prev => [{
          id: newNotif.id,
          userId: newNotif.user_id,
          title: newNotif.title,
          content: newNotif.content,
          type: newNotif.type,
          read: newNotif.read,
          metadata: newNotif.metadata,
          createdAt: newNotif.created_at
        }, ...prev]);
      }
    }
  };

  const markNotificationAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    
    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id);
    
    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const updateCompany = async (companyId: string, updates: Partial<Company>) => {
    // Transform to DB schema
    const dbUpdates: any = { ...updates };
    if (updates.addressChina) { dbUpdates.address_china = updates.addressChina; delete dbUpdates.addressChina; }
    if (updates.addressAfrica) { dbUpdates.address_africa = updates.addressAfrica; delete dbUpdates.addressAfrica; }
    if (updates.showTotalPackages) { dbUpdates.show_total_packages = updates.showTotalPackages; delete dbUpdates.showTotalPackages; }
    if (updates.showPrice) { dbUpdates.show_price = updates.showPrice; delete dbUpdates.showPrice; }
    if (updates.showReviews) { dbUpdates.show_reviews = updates.showReviews; delete dbUpdates.showReviews; }
    
    dbUpdates.updated_at = new Date().toISOString();

    const { error } = await supabase.from('companies').update(dbUpdates).eq('id', companyId);
    
    if (!error) {
      setCompanies(prev => prev.map(c => {
        if (c.id === companyId) {
          const updatedCompany = { ...c, ...updates };
          
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
            const newProgress = calculateProgress(updatedCompany);
            // Update profile progress in Supabase too
            supabase.from('profiles').update({ profile_progress: newProgress }).eq('id', user.id);
            setUser({ ...user, profileProgress: newProgress });
          }
          
          return updatedCompany;
        }
        return c;
      }));
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    // Transform to DB schema
    const dbUpdates: any = { ...updates };
    if (updates.profileProgress !== undefined) { 
      dbUpdates.profile_progress = updates.profileProgress; 
      delete dbUpdates.profileProgress; 
    }
    if (updates.companyId !== undefined) {
      dbUpdates.company_id = updates.companyId;
      delete dbUpdates.companyId;
    }

    const { error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', user.id);

    if (!error) {
      setUser({ ...user, ...updates });
    } else {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const addCompany = async (company: Company) => {
    const { error } = await supabase.from('companies').insert([{
      id: company.id,
      name: company.name,
      logo: company.logo,
      banner: company.banner,
      slogan: company.slogan,
      description: company.description,
      address_china: company.addressChina,
      address_africa: company.addressAfrica,
      countries: company.countries,
      verified: company.verified,
      rating: company.rating,
      review_count: company.reviewCount,
      services: company.services,
      gallery: company.gallery,
      total_packages: company.totalPackages,
      show_total_packages: company.showTotalPackages,
      status: company.status,
      show_price: company.showPrice,
      show_reviews: company.showReviews,
      contact: company.contact,
      style: company.style,
      locations: company.locations,
      owner_id: user?.id
    }]);

    if (!error) setCompanies(prev => [company, ...prev]);
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

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ 
      user, setUser, companies, orders, messages, reviews, shipments, notifications, tickets,
      addOrder, updateOrder, addReview, addMessage, markAsRead, updateSubscription, toggleFavorite, 
      addShipment, updateShipment, addNotification, markNotificationAsRead, markAllNotificationsAsRead, 
      updateCompany, updateProfile, addCompany, language, setLanguage, currency, setCurrency, formatPrice, t, logout, sidebarCollapsed, setSidebarCollapsed, loading
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
