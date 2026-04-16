import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Ship, Plane, Zap, Shield, Globe, ArrowRight, 
  CheckCircle2, Package, Search, BarChart3, 
  MessageSquare, Star, ArrowUpRight, Play,
  ShieldCheck, Clock, DollarSign, ChevronRight
} from 'lucide-react';
import Logo from '../../components/Logo';
import { cn } from '../../lib/utils';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-apple-blue selection:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size={48} />
          
          <nav className="hidden lg:flex items-center gap-10 text-[15px] font-medium text-slate-500">
            <a href="#features" className="hover:text-apple-blue transition-colors">Fonctionnalités</a>
            <a href="#how-it-works" className="hover:text-apple-blue transition-colors">App Mobile</a>
            <a href="#transitaires" className="hover:text-apple-blue transition-colors">FAQ</a>
            <a href="#pricing" className="hover:text-apple-blue transition-colors">Affiliation</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="px-5 py-2.5 bg-slate-50 text-slate-900 rounded-lg text-[15px] font-medium hover:bg-slate-100 transition-colors">
              Connexion
            </Link>
            <Link to="/signup" className="px-6 py-2.5 bg-apple-blue text-white rounded-lg text-[15px] font-medium hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
              Inscription
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-50" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-50 rounded-full blur-[120px] opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-slate-100 mb-10 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-apple-blue"></span>
              <span className="text-[14px] font-medium text-slate-600">+1200 transitaires nous font confiance</span>
              <ChevronRight size={14} className="text-slate-400" />
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8 max-w-5xl mx-auto text-slate-900">
              Expédiez sans <span className="text-apple-blue">frontières</span>, gérez sans <span className="relative inline-block px-4 py-1 bg-apple-blue text-white rounded-lg mx-1">limites</span>.
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-normal leading-relaxed">
              Transify remplace tout. Conçu pour la logistique moderne, par des experts comme vous.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="px-8 py-4 bg-apple-blue text-white rounded-xl font-bold text-[16px] shadow-xl shadow-blue-500/25 hover:bg-blue-600 transition-all hover:-translate-y-0.5 active:scale-95">
                Essayez gratuitement
              </Link>
              <button className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-[16px] hover:bg-slate-50 transition-all">
                Voir la démo
              </button>
            </motion.div>
          </motion.div>

          {/* Hero Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-32 relative max-w-6xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-apple-blue to-blue-600 rounded-[42px] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-white rounded-[40px] p-2 shadow-2xl border border-slate-100 overflow-hidden">
                <div className="aspect-[16/10] bg-slate-50 rounded-[32px] overflow-hidden relative">
                  <img 
                    src="https://picsum.photos/seed/transify-dashboard/1920/1200" 
                    alt="Transify Dashboard" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {/* Floating Elements */}
                  <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 right-10 bg-white/90 backdrop-blur-xl p-6 rounded-[28px] shadow-2xl border border-white/20 flex items-center gap-4 max-w-[240px]"
                  >
                    <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Livraison</p>
                      <p className="text-[15px] font-bold text-slate-900 tracking-tight">Colis arrivé à Dakar</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-10 left-10 bg-slate-900/90 backdrop-blur-xl p-6 rounded-[28px] shadow-2xl border border-white/10 flex items-center gap-4 text-white max-w-[260px]"
                  >
                    <div className="w-12 h-12 bg-apple-blue text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Ship size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Maritime • MSC OSCAR</p>
                      <p className="text-[15px] font-bold">En mer (Océan Atlantique)</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-20 border-y border-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-12">Ils nous font confiance pour leur logistique</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {['MAERSK', 'CMA CGM', 'DHL', 'FEDEX', 'MSC', 'HAPAG-LLOYD'].map((brand) => (
              <span key={brand} className="text-2xl font-bold tracking-tighter text-slate-900">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-32 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[14px] font-medium mb-6">Vue d'ensemble</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">Toutes vos stats en un <br />coup d'œil</h2>
            <p className="text-lg text-slate-500 max-w-2xl font-normal leading-relaxed">
              Dès que vous vous connectez, vous savez exactement où en est votre business. Plus besoin de chercher.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8">
            {/* Feature 1: Explorer */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-8 apple-card bg-white p-12 flex flex-col justify-between min-h-[540px] group overflow-hidden relative"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-50 text-apple-blue rounded-[18px] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                  <Search size={28} />
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-4">Explorateur de Transitaires</h3>
                <p className="text-lg text-slate-500 max-w-md font-medium">
                  Accédez à un réseau mondial de partenaires vérifiés. Comparez les prix, les délais et les avis en temps réel.
                </p>
              </div>
              <div className="mt-12 relative">
                <div className="absolute -inset-4 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
                <img 
                  src="https://picsum.photos/seed/transify-explorer/1200/600" 
                  alt="Explorer UI" 
                  className="rounded-2xl shadow-2xl border border-slate-100 group-hover:scale-[1.02] transition-transform duration-700" 
                />
              </div>
            </motion.div>

            {/* Feature 2: QR Code */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-4 apple-card bg-slate-900 text-white p-12 flex flex-col justify-between min-h-[540px] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-apple-blue/10 rounded-full blur-[80px] -mr-32 -mt-32" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 text-white rounded-[18px] flex items-center justify-center mb-10">
                  <Zap size={28} />
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-4">Réception Flash</h3>
                <p className="text-lg text-white/50 font-medium">
                  Scannez, identifiez, validez. Notre technologie QR Code réduit les erreurs de saisie de 99%.
                </p>
              </div>
              <div className="flex justify-center relative">
                <div className="w-48 h-48 bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 p-6 flex items-center justify-center group">
                  <div className="w-full h-full bg-white rounded-[32px] flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                    <Logo iconOnly size={64} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 3: Analytics */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-5 apple-card bg-white p-12 flex flex-col justify-between min-h-[480px] group"
            >
              <div>
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-[18px] flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform">
                  <BarChart3 size={28} />
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-4">Insights Stratégiques</h3>
                <p className="text-lg text-slate-500 font-medium">
                  Visualisez vos flux, optimisez vos coûts et prenez des décisions basées sur des données réelles.
                </p>
              </div>
              <div className="space-y-4 pt-10">
                {[85, 60, 95].map((w, i) => (
                  <div key={i} className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${w}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className="h-full bg-purple-500 rounded-full" 
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Feature 4: Security */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-7 apple-card bg-apple-blue text-white p-12 flex flex-col md:flex-row items-center gap-12 min-h-[480px] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <div className="relative z-10 flex-1">
                <div className="w-14 h-14 bg-white/20 text-white rounded-[18px] flex items-center justify-center mb-10">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-4">Confiance Totale</h3>
                <p className="text-lg text-white/80 font-medium">
                  Chaque transitaire est soumis à un audit rigoureux. Vos marchandises sont assurées et vos paiements sécurisés.
                </p>
              </div>
              <div className="relative z-10 flex-1 flex justify-center">
                <div className="relative">
                  <ShieldCheck size={180} className="text-white/20" />
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <CheckCircle2 size={60} className="text-white" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="how-it-works" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-32">
            <span className="text-label mb-4 block">Le Workflow</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">De l'usine à votre porte.</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-16 relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-slate-100 -translate-y-1/2 z-0" />
            
            {[
              { 
                icon: <Search size={32} />, 
                title: "Sélection", 
                desc: "Choisissez le transitaire idéal selon vos critères de prix et de rapidité.",
                color: "bg-blue-50 text-apple-blue"
              },
              { 
                icon: <Package size={32} />, 
                title: "Coordination", 
                desc: "Générez les documents et suivez la prise en charge de vos colis.",
                color: "bg-slate-900 text-white"
              },
              { 
                icon: <Globe size={32} />, 
                title: "Livraison", 
                desc: "Recevez vos marchandises et évaluez la prestation pour la communauté.",
                color: "bg-apple-blue text-white"
              }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 text-center flex flex-col items-center"
              >
                <div className={cn("w-24 h-24 rounded-[32px] flex items-center justify-center mb-10 shadow-2xl", step.color)}>
                  {step.icon}
                </div>
                <h4 className="text-2xl font-bold mb-4 tracking-tight">{step.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed max-w-[280px]">{step.desc}</p>
                <div className="mt-8 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[12px] font-bold text-slate-300 border border-slate-100">
                  0{i + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Colis Expédiés", value: "2.4M+" },
              { label: "Transitaires", value: "850+" },
              { label: "Pays Couverts", value: "120+" },
              { label: "Satisfaction", value: "99.8%" }
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-5xl md:text-6xl font-black mb-2 tracking-tighter">{stat.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none max-w-xl">Ce que disent nos <span className="text-apple-blue">leaders</span>.</h2>
            <div className="flex gap-4">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="w-14 h-14 rounded-full border-4 border-white shadow-lg" alt="User" />
                ))}
              </div>
              <div className="text-left">
                <div className="flex text-yellow-400 mb-1">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">4.9/5 basé sur 12k avis</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Transify a réduit nos coûts logistiques de 30% en seulement 3 mois. L'interface est d'une clarté incroyable.",
                author: "Sarah Chen",
                role: "Directrice Logistique, TechCorp"
              },
              {
                quote: "Le suivi en temps réel et la gestion des documents nous ont sauvé des centaines d'heures de travail manuel.",
                author: "Marc Dubois",
                role: "CEO, AfricaTrade"
              },
              {
                quote: "Enfin une plateforme qui comprend les défis du transit international. Un outil indispensable pour notre croissance.",
                author: "Amadou Diallo",
                role: "Fondateur, Sahel Express"
              }
            ].map((t, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="apple-card p-10 bg-slate-50/50 border border-slate-100 flex flex-col justify-between h-full"
              >
                <MessageSquare className="text-apple-blue mb-8" size={32} />
                <p className="text-xl font-medium text-slate-700 leading-relaxed mb-10 italic">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-slate-900 tracking-tight">{t.author}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6">
        <div className="max-w-6xl mx-auto relative">
          <div className="absolute inset-0 bg-apple-blue rounded-[48px] blur-[100px] opacity-20 -z-10" />
          <div className="apple-card bg-slate-900 p-16 md:p-32 text-center text-white relative overflow-hidden !rounded-[48px]">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-apple-blue/20 rounded-full -mr-64 -mt-64 blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full -ml-64 -mb-64 blur-[120px]" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <h2 className="text-white text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-10">
                  Prêt à changer de <br /><span className="text-apple-blue">dimension</span> ?
                </h2>
                <p className="text-xl text-white/50 mb-14 max-w-xl mx-auto font-medium leading-relaxed">
                  Rejoignez la nouvelle ère de la logistique mondiale. Configuration en moins de 2 minutes.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/signup" className="px-12 py-6 bg-apple-blue text-white rounded-[24px] font-bold text-[14px] uppercase tracking-widest shadow-2xl shadow-blue-500/40 hover:bg-blue-600 transition-all hover:scale-105 active:scale-95">
                    Démarrer maintenant
                  </Link>
                  <Link to="/contact" className="flex items-center gap-2 text-white font-bold text-[12px] uppercase tracking-widest hover:text-apple-blue transition-colors group">
                    Parler à un expert <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-16 mb-24">
            <div className="md:col-span-5">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Reste informé</h3>
              <p className="text-lg text-slate-500 max-w-sm font-normal leading-relaxed mb-8">
                Reçois nos conseils pour booster ton business de logistique en Afrique.
              </p>
              <div className="flex gap-2 max-w-sm">
                <input 
                  type="email" 
                  placeholder="Ton email" 
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all"
                />
                <button className="p-3 bg-apple-blue text-white rounded-xl hover:bg-blue-600 transition-all">
                  <ArrowUpRight size={20} />
                </button>
              </div>
            </div>
            
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-6">Liens rapides</h4>
                <ul className="space-y-3 text-[15px] font-normal text-slate-500">
                  <li><a href="#" className="hover:text-apple-blue transition-colors">Fonctionnalités</a></li>
                  <li><a href="#" className="hover:text-apple-blue transition-colors">Tarifs</a></li>
                  <li><a href="#" className="hover:text-apple-blue transition-colors">FAQ</a></li>
                  <li><a href="#" className="hover:text-apple-blue transition-colors">Connexion</a></li>
                  <li><a href="#" className="hover:text-apple-blue transition-colors">Créer un compte</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-6">Contact</h4>
                <ul className="space-y-3 text-[15px] font-normal text-slate-500">
                  <li>Email : contact@transify.com</li>
                  <li>Support : support@transify.com</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-6">Suivez-nous</h4>
                <div className="flex gap-4">
                  {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map(s => (
                    <a key={s} href="#" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                      <span className="sr-only">{s}</span>
                      <div className="w-5 h-5 bg-slate-200 rounded-sm" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-[14px]">© 2026 Transify. Tous droits réservés.</p>
            <div className="flex gap-6 text-slate-500 text-[14px]">
              <a href="#" className="hover:text-slate-900 transition-colors">Politique de confidentialité</a>
              <a href="#" className="hover:text-slate-900 transition-colors">CGU</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Mentions légales</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

