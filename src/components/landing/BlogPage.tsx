import React from 'react';
import { motion } from 'motion/react';
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
    <div className="min-h-screen bg-gradient-to-b from-surface via-surface to-surface-container-low/50 pt-24 pb-16 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-20 right-[10%] w-96 h-96 bg-secondary/8 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute bottom-40 left-[5%] w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <header className="text-center max-w-4xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-secondary/10 rounded-full border border-secondary/30 mb-8 hover:border-secondary/50 transition-all"
          >
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-[11px] font-black tracking-widest uppercase text-secondary">Blog & Noticias</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl lg:text-8xl font-black text-[#0F172A] tracking-tighter leading-[1.1] mb-8 font-headline"
          >
            Innovación para el <span className="bg-gradient-to-r from-secondary to-secondary/70 bg-clip-text text-transparent">Retail Moderno</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-on-surface-variant font-medium leading-relaxed"
          >
            Consejos, guías y tendencias para que tu negocio nunca deje de crecer.
          </motion.p>
        </header>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16"
        >
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/50" />
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Buscar artículos..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-secondary/20 hover:border-secondary/40 focus:border-secondary rounded-2xl font-medium outline-none focus:ring-0 transition-all shadow-sm hover:shadow-md"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {['Todos', 'Gestión', 'Tecnología', 'Fidelización', 'Casos de Éxito'].map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  cat === 'Todos'
                    ? 'bg-gradient-secondary text-white shadow-lg shadow-secondary/30 hover:shadow-secondary/50'
                    : 'bg-white text-on-surface-variant hover:text-secondary border-2 border-secondary/20 hover:border-secondary/50 hover:bg-secondary/5'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative h-[600px] rounded-[3.5rem] overflow-hidden mb-20 group cursor-pointer shadow-2xl hover:shadow-3xl transition-all border-3 border-white/20 hover:border-secondary/60 card-hover-enhance"
        >
          <motion.img
            whileHover={{ scale: 1.12 }}
            transition={{ duration: 0.8 }}
            src={posts[0].image}
            alt="Featured"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/50 to-transparent"
            animate={{ opacity: [0.5, 0.6, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/40 to-transparent opacity-40 group-hover:opacity-20"
            whileHover={{ opacity: 0.2 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-0 left-0 p-8 md:p-16 w-full lg:max-w-3xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="px-5 py-2 bg-secondary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-secondary/30"
              >
                Destacado
              </motion.span>
              <div className="flex items-center gap-2 text-white/70 text-sm font-bold">
                <Calendar className="w-4 h-4" />
                {posts[0].date}
              </div>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-8 font-headline">{posts[0].title}</h2>
            <p className="text-white/85 text-lg md:text-xl font-medium mb-10 line-clamp-3 leading-relaxed">{posts[0].excerpt}</p>
            <motion.button
              whileHover={{ gap: '16px' }}
              className="flex items-center gap-2 text-white font-black text-lg hover:text-secondary transition-all group/btn"
            >
              Leer artículo completo
              <motion.div whileHover={{ x: 4 }} className="transition-transform">
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Grid Posts */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {posts.slice(1).map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ y: -16, rotateX: 2, rotateY: -2 }}
              style={{ perspective: 1000 }}
              className="group cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="relative h-72 rounded-[2.5rem] overflow-hidden mb-8 shadow-lg hover:shadow-2xl transition-all border-2 border-secondary/15 hover:border-secondary/60 card-hover-enhance"
              >
                <motion.img
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.7 }}
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ opacity: [0, 0.1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.15 }}
                />
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="absolute top-4 left-4"
                >
                  <span className="px-4 py-2 bg-secondary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-secondary/30 hover:shadow-secondary/50 transition-shadow">
                    {post.category}
                  </span>
                </motion.div>
              </motion.div>

              <div className="flex items-center gap-4 text-on-surface-variant text-xs font-bold mb-4 gap-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </div>
                <div className="w-1 h-1 rounded-full bg-outline-variant/30" />
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author}
                </div>
              </div>

              <h3 className="text-2xl font-black text-[#0F172A] mb-4 font-headline group-hover:text-secondary transition-colors leading-tight">{post.title}</h3>
              <p className="text-on-surface-variant font-medium mb-8 line-clamp-3 leading-relaxed">{post.excerpt}</p>

              <motion.div
                whileHover={{ gap: '12px' }}
                className="flex items-center gap-2 text-secondary font-black text-sm transition-all"
              >
                Leer más
                <motion.div whileHover={{ x: 4 }} className="transition-transform">
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.div>
            </motion.article>
          ))}
        </motion.div>

        {/* Newsletter CTA */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 bg-gradient-to-br from-secondary via-secondary to-secondary/90 text-white rounded-[3.5rem] p-12 md:p-24 relative overflow-hidden shadow-2xl shadow-secondary/30 border border-white/10 animate-glow"
        >
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity }}
              className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.2),transparent_60%)]"
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div className="space-y-8">
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight font-headline">
                Suscríbete a <span className="text-amber-300 drop-shadow-lg">Vantory Insights</span>
              </h2>
              <p className="text-white/90 text-lg md:text-xl font-medium leading-relaxed">Recibe mensualmente las mejores prácticas para optimizar tu negocio directamente en tu bandeja de entrada.</p>
              <div className="flex items-center gap-3 text-white/70 text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                <span>No spam. Cancelar en cualquier momento.</span>
              </div>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-7 py-4 bg-white/15 border-2 border-white/25 hover:border-white/40 focus:border-white rounded-2xl text-white placeholder:text-white/50 outline-none focus:bg-white/20 transition-all font-bold backdrop-blur-sm"
              />
              <motion.button
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-10 py-4 bg-white text-secondary font-black rounded-2xl hover:bg-amber-300 transition-all shadow-lg hover:shadow-xl"
              >
                Suscribirse
              </motion.button>
            </motion.form>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
