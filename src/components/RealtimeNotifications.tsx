import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageSquare, Package, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function RealtimeNotifications() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
            className="pointer-events-auto w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex items-start gap-4"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              toast.type === 'message' ? 'bg-blue-50 text-blue-500' :
              toast.type === 'order' ? 'bg-amber-50 text-amber-500' :
              'bg-emerald-50 text-emerald-500'
            }`}>
              {toast.type === 'message' ? <MessageSquare size={20} /> :
               toast.type === 'order' ? <Package size={20} /> :
               <Bell size={20} />}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-[14px] font-bold text-slate-900 leading-tight mb-1">{toast.title}</h4>
              <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                {toast.content}
              </p>
            </div>

            <button 
              onClick={() => removeToast(toast.id)}
              className="text-slate-300 hover:text-slate-500 transition-colors p-1"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
