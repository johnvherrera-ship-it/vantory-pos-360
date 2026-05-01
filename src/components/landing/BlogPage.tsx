import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Tag, 
  Search, 
  TrendingUp, 
  MessageCircle 
} from 'lucide-react';

export const BlogPage = () => {
  const posts = [
    {
      id: 1,
      title: "5 Estrategias para reducir el quiebre de stock en tu almacén",
      excerpt: "Descubre cómo la tecnología puede ayudarte a predecir la demanda y evitar perder ventas por falta de inventario.",
      category: "Gestión",
      author: "Equipo Vantory",
      date: "12 Mar 2024",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "El futuro del retail: ¿Por qué la nube es indispensable?",
      excerpt: "Analizamos las ventajas competitivas de tener tu sistema de ventas 100% online y accesible desde cualquier lugar.",
      category: "Tecnología",
      author: "Vantory Digital",
      date: "08 Mar 2024",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Cómo fidelizar clientes a través del sistema de Fiados",
      excerpt: "El crédito de confianza es una herramienta poderosa. Aprende a gestionarlo de forma segura y profesional.",
      category: "Fidelización",
      author: "Consultoría Retail",
      date: "01 Mar 2024",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Digitalización de Pymes: El primer paso hacia la escalabilidad",
      excerpt: "Guía paso a paso para transformar tu negocio tradicional en una operación moderna y eficiente.",
      category: "Emprendimiento",
      author: "Vantory Team",
      date: "24 Feb 2024",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="container mx-auto px-6 md:px-12">
        <header className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full border border-secondary/20 mb-6"
          >
            <span className="text-[10px] font-black tracking-widest uppercase text-secondary">Blog & Noticias</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-[#0F172A] tracking-tighter leading-none mb-8 font-headline"
          >
            Innovación para el <span className="text-secondary">Retail Moderno</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-on-surface-variant font-medium leading-relaxed"
          >
            Consejos, guías y tendencias para que tu negocio nunca deje de crecer.
          </motion.p>
        </header>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Buscar artículos..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-outline-variant/30 rounded-2xl font-medium outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['Todos', 'Gestión', 'Tecnología', 'Fidelización', 'Casos de Éxito'].map((cat) => (
              <button 
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${cat === 'Todos' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-white text-on-surface-variant hover:bg-surface-container-low border border-outline-variant/10'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-[500px] rounded-[3rem] overflow-hidden mb-16 group cursor-pointer"
        >
          <img 
            src={posts[0].image} 
            alt="Featured" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 py-1 bg-secondary text-white text-[10px] font-black uppercase tracking-widest rounded-full">Destacado</span>
              <div className="flex items-center gap-2 text-white/70 text-sm font-bold">
                <Calendar className="w-4 h-4" />
                {posts[0].date}
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-6 font-headline">{posts[0].title}</h2>
            <p className="text-white/80 text-lg font-medium mb-8 line-clamp-2">{posts[0].excerpt}</p>
            <button className="flex items-center gap-2 text-white font-black hover:text-secondary transition-colors group/btn">
              Leer artículo completo <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Grid Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.slice(1).map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative h-64 rounded-[2rem] overflow-hidden mb-6">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-secondary text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-on-surface-variant text-xs font-bold mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </div>
                <div className="w-1 h-1 rounded-full bg-outline-variant"></div>
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {post.author}
                </div>
              </div>
              <h3 className="text-2xl font-black text-[#0F172A] mb-4 font-headline group-hover:text-secondary transition-colors leading-tight">{post.title}</h3>
              <p className="text-on-surface-variant font-medium mb-6 line-clamp-3 leading-relaxed">{post.excerpt}</p>
              <div className="flex items-center gap-2 text-secondary font-black text-sm group-hover:gap-4 transition-all">
                Leer más <ArrowRight className="w-4 h-4" />
              </div>
            </motion.article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <section className="mt-32 bg-secondary text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none font-headline">Suscríbete a <span className="text-amber-400">Vantory Insights</span></h2>
              <p className="text-white/80 text-lg font-medium">Recibe mensualmente las mejores prácticas para optimizar tu negocio directamente en tu bandeja de entrada.</p>
            </div>
            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="tu@email.com" 
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/40 outline-none focus:bg-white/20 transition-all font-bold"
              />
              <button className="px-8 py-4 bg-white text-secondary font-black rounded-2xl hover:bg-amber-400 hover:text-secondary transition-all shadow-xl">
                Suscribirme
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};
