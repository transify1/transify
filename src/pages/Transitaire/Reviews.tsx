import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { 
  Star, MessageSquare, Filter, Search,
  TrendingUp, ThumbsUp, User, Clock,
  LayoutDashboard, Store, Package, Settings, LogOut
} from 'lucide-react';
import { formatDate, cn } from '../../lib/utils';
import TransitaireSidebar from '../../components/Transitaire/Sidebar';

export default function TransitaireReviews() {
  const { reviews, user, sidebarCollapsed } = useApp();
  const companyReviews = reviews.filter(r => r.companyId === user?.companyId);

  const averageRating = companyReviews.length > 0 
    ? (companyReviews.reduce((sum, r) => sum + r.rating, 0) / companyReviews.length).toFixed(1)
    : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: companyReviews.filter(r => r.rating === star).length,
    percentage: companyReviews.length > 0 
      ? (companyReviews.filter(r => r.rating === star).length / companyReviews.length) * 100 
      : 0
  }));

  return (
    <div className="min-h-screen bg-[#F8F9FB] fluid-bg">
      <TransitaireSidebar />
      <main className={cn(
        "p-4 lg:p-8 max-w-7xl mx-auto transition-all duration-300",
        sidebarCollapsed ? "lg:ml-24" : "lg:ml-72"
      )}>
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 mb-1 tracking-tight">Avis & Retours Clients</h1>
            <p className="text-[15px] text-slate-500 font-normal">Gérez votre réputation et consultez les commentaires.</p>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          {/* Summary Card */}
          <div className="apple-card !p-8 !rounded-[28px] flex flex-col items-center justify-center text-center">
            <h3 className="text-[14px] font-bold text-slate-400 uppercase tracking-widest mb-4">Note Globale</h3>
            <div className="text-[64px] font-black text-slate-900 leading-none mb-4">{averageRating}</div>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={24} 
                  className={star <= Math.round(parseFloat(averageRating)) ? "text-orange-400 fill-orange-400" : "text-slate-200"} 
                />
              ))}
            </div>
            <p className="text-[15px] font-medium text-slate-500">Basé sur {companyReviews.length} avis</p>
          </div>

          {/* Progress Bars */}
          <div className="lg:col-span-2 apple-card !p-8 !rounded-[28px]">
            <h3 className="text-[14px] font-bold text-slate-400 uppercase tracking-widest mb-6">Répartition des notes</h3>
            <div className="space-y-4">
              {ratingCounts.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-4">
                  <div className="w-12 text-[13px] font-bold text-slate-900 flex items-center gap-1 shrink-0">
                    {star} <Star size={14} className="text-orange-400 fill-orange-400" />
                  </div>
                  <div className="flex-1 h-2.5 bg-slate-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-apple-blue rounded-full"
                    />
                  </div>
                  <div className="w-12 text-right text-[13px] font-bold text-slate-400">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="apple-card !p-0 !rounded-[28px] overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <h3 className="text-[18px] font-bold text-slate-900">Derniers commentaires</h3>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Filtrer les avis..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-[16px] focus:ring-2 focus:ring-apple-blue transition-all text-[15px] font-medium tracking-tight"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {companyReviews.length > 0 ? (
              companyReviews.map((review) => (
                <div key={review.id} className="p-8 hover:bg-slate-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-[14px] flex items-center justify-center font-bold text-slate-400">
                        {review.userName?.slice(0, 1)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{review.userName || 'Utilisateur'}</h4>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={14} 
                              className={star <= review.rating ? "text-orange-400 fill-orange-400" : "text-slate-200"} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[12px] font-medium text-slate-400">{formatDate(review.createdAt)}</span>
                  </div>
                  <p className="text-[15px] text-slate-600 leading-relaxed font-medium mb-4">
                    {review.comment}
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-[12px] font-bold text-apple-blue uppercase tracking-widest hover:underline">
                      <ThumbsUp size={14} /> Utile
                    </button>
                    <button className="flex items-center gap-2 text-[12px] font-bold text-slate-400 uppercase tracking-widest hover:underline">
                      <MessageSquare size={14} /> Répondre
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <Star size={40} />
                </div>
                <h3 className="text-[20px] font-bold text-slate-900 mb-2">Pas encore d'avis</h3>
                <p className="text-slate-500 font-medium">Les avis de vos clients apparaîtront ici.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
