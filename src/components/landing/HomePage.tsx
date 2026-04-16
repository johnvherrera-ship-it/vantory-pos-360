import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Package, QrCode, ShoppingBag, BarChart3, TrendingUp, Users, Cloud, Check } from 'lucide-react';

interface HomePageProps {
  setCurrentPage: (page: any) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  const { scrollY } = useScroll();
  const bgY1 = useTransform(scrollY, [0, 500], [0, 100]);
  const bgY2 = useTransform(scrollY, [0, 500], [0, 150]);
  const bgY3 = useTransform(scrollY, [0, 500], [0, 80]);

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <main className="relative pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-secondary/[0.08] via-surface to-surface-container-low/20">
          {/* Background Elements with Parallax */}
          <div className="absolute inset-0 z-0">
            <motion.div
              style={{ y: bgY1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2 }}
              className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-secondary/[0.15] to-transparent rounded-bl-[150px]"
            ></motion.div>
            <motion.div
              style={{ y: bgY2 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 0.3 }}
              className="absolute top-[15%] left-[5%] w-96 h-96 bg-secondary/8 blur-[130px] rounded-full"
            ></motion.div>
            <motion.div
              style={{ y: bgY3 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 0.6 }}
              className="absolute bottom-[10%] right-[20%] w-72 h-72 bg-secondary/5 blur-[120px] rounded-full"
            ></motion.div>
          </div>
          <div className="container mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100/40 rounded-full border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-green-700">Usado en locales de Chile</span>
              </div>
              <h1 className="text-7xl md:text-8xl lg:text-[7rem] font-black text-[#0F172A] tracking-tighter leading-[0.9] font-headline">
                <motion.div className="flex flex-wrap gap-x-3 gap-y-2">
                  {["VANTORY", "POS", "360"].map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{
                        duration: 1,
                        delay: 0.2 + (i * 0.15),
                        ease: [0.175, 0.885, 0.32, 1.275]
                      }}
                      className={`relative drop-shadow-sm ${
                        word !== "VANTORY"
                          ? "bg-gradient-to-r from-secondary to-secondary/70 bg-clip-text text-transparent animate-gradient-wave"
                          : ""
                      }`}
                    >
                      {word}
                      {word !== "VANTORY" && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 blur-lg"
                          animate={{
                            x: ['-100%', '100%'],
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.2,
                            repeat: Infinity,
                            repeatDelay: 1
                          }}
                        />
                      )}
                    </motion.span>
                  ))}
                </motion.div>
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl text-on-surface-variant font-medium leading-relaxed max-w-lg"
              >
                Vende más rápido, controla tu stock al segundo. El POS que tu equipo aprende en minutos.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <motion.button
                  onClick={() => setCurrentPage('login')}
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 text-lg font-bold text-white bg-gradient-secondary rounded-[1.25rem] shadow-2xl shadow-secondary/30 hover:shadow-secondary/50 transition-all flex items-center justify-center gap-2 relative overflow-hidden group animate-glow"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 0.2, x: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 bg-white/10"
                  />
                  <span className="relative">Iniciar sesión</span>
                  <motion.div className="relative" whileHover={{ x: 4 }}>
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.button>
                <motion.button
                  onClick={() => setCurrentPage('features')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 text-lg font-bold text-secondary bg-white rounded-[1.25rem] border-2 border-secondary/20 hover:border-secondary/60 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative">Ver Funcionalidades</span>
                </motion.button>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="text-sm font-medium text-on-surface-variant/60 italic pt-6"
              >
                Desarrollado por <a className="underline decoration-secondary/30 hover:text-secondary transition-colors" href="https://www.vantorydigital.cl">Vantory Digital</a>
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              {/* Glassmorphism Preview Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative z-20 transform lg:translate-x-12 lg:scale-110 animate-float"
              >
                <div className="bg-white p-3 rounded-[2.5rem] shadow-[0_50px_120px_-25px_rgba(38,124,220,0.35)] border-3 border-secondary/15 overflow-hidden group hover:border-secondary/40 hover:shadow-[0_70px_150px_-35px_rgba(38,124,220,0.45)] transition-all duration-700 animate-glow">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-auto rounded-[1.8rem] shadow-inner cursor-zoom-in"
                    alt="POS interface"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU7w9NDgL-E-K7HcroAnvmr9C8v5Jzwx83fvUXFG5PmcsEct21Nk-BAzyV6cw8KOcxDPR8yVe6U_lcucCHzBcrEoiBljlIMol2cqYsSDgeLFQ3DGVlKzqK1omr5sFebm4Sr9il-xWkOOywq_HxKpmvwqKIOGSq8pIcBzA7_eXIPu3ClXtM4yY5CHMQtDWHIS0vvo5NFCW6SfOCE3XmLr83lAgs7EUJ9RJX8ydJ2_L3qjTYWAtS9lZy4sSE0vxEZ79P_1keLCMBQ4Z8"
                    referrerPolicy="no-referrer"
                  />
                  {/* Floating Data Badge */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-surface-container-low"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#0F172A] uppercase tracking-wider">Ventas Hoy</p>
                      <p className="text-2xl font-black text-[#0F172A]">+24.8%</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Bento Grid Features Section */}
        <section className="py-32 bg-gradient-to-b from-surface via-surface to-surface-container-low/50">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mb-20"
            >
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-on-surface mb-6 font-headline">Todo bajo control, <span className="text-secondary">desde la primera venta</span></h2>
              <p className="text-on-surface-variant text-xl font-medium leading-relaxed">Interfaz clara, sin distracciones. Tus operadores trabajan más rápido y cometen menos errores.</p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6"
            >
              {/* Bento Item 1: Inventario Real & Preciso */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -16, boxShadow: '0 0 40px rgba(51,95,157,0.5), 0 0 80px rgba(51,95,157,0.3)' }}
                className="md:col-span-6 md:row-span-2 bg-gradient-to-br from-white to-surface-container-lowest p-8 rounded-3xl border-2 border-secondary/20 hover:border-secondary/70 shadow-lg hover:shadow-2xl transition-all group overflow-hidden relative card-hover-enhance"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-secondary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ opacity: [0, 0.1, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 8 }}
                    className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-white transition-all"
                  >
                    <Package className="w-7 h-7" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-[#0F172A] mb-4 font-headline">Inventario <span className="bg-gradient-to-r from-secondary to-secondary/70 bg-clip-text text-transparent">Real & Preciso</span></h3>
                  <p className="text-[#0F172A] font-medium mb-8 leading-relaxed">Sincronización instantánea de cada SKU. Olvídate de los descuadres y toma decisiones basadas en datos vivos.</p>
                  <div className="rounded-2xl overflow-hidden bg-surface-container-low border border-secondary/10 group-hover:border-secondary/30 transition-all">
                    <motion.img
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.6 }}
                      src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=800&q=80"
                      alt="Inventario"
                      className="w-full h-48 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Bento Item 2: Escaneo QR/Barras */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -14, boxShadow: '0 0 30px rgba(51,95,157,0.4), 0 0 60px rgba(51,95,157,0.2)' }}
                className="md:col-span-3 bg-gradient-to-br from-white to-surface-container-lowest p-8 rounded-3xl border-2 border-secondary/20 hover:border-secondary/70 shadow-lg hover:shadow-2xl transition-all group relative card-hover-enhance"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-secondary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"
                  animate={{ opacity: [0, 0.1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.2 }}
                />
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: -8 }}
                    className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 text-secondary group-hover:bg-secondary group-hover:text-white transition-all"
                  >
                    <QrCode className="w-6 h-6" />
                  </motion.div>
                  <h3 className="text-lg font-black text-[#0F172A] mb-2 font-headline">Escaneo <span className="text-secondary">QR/Barras</span></h3>
                  <p className="text-[#0F172A] text-sm font-medium leading-relaxed">Compatibilidad universal de lectores. Agilidad en recepción y despacho.</p>
                </div>
              </motion.div>

              {/* Bento Item 3: Gestión Pedidos */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -14, boxShadow: '0 0 30px rgba(51,95,157,0.4), 0 0 60px rgba(51,95,157,0.2)' }}
                className="md:col-span-3 bg-gradient-to-br from-white to-surface-container-lowest p-8 rounded-3xl border-2 border-secondary/20 hover:border-secondary/70 shadow-lg hover:shadow-2xl transition-all group relative card-hover-enhance"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-secondary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"
                  animate={{ opacity: [0, 0.1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.4 }}
                />
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 8 }}
                    className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 text-secondary group-hover:bg-secondary group-hover:text-white transition-all"
                  >
                    <ShoppingBag className="w-6 h-6" />
                  </motion.div>
                  <h3 className="text-lg font-black text-[#0F172A] mb-2 font-headline">Gestión <span className="text-secondary">Pedidos</span></h3>
                  <p className="text-[#0F172A] text-sm font-medium leading-relaxed">Automatización desde orden hasta despacho sin fricción.</p>
                </div>
              </motion.div>

              {/* Bento Item 4: Reportes & KPIs */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -14, boxShadow: '0 0 40px rgba(51,95,157,0.5), 0 0 80px rgba(51,95,157,0.3)' }}
                className="md:col-span-6 bg-gradient-to-br from-white to-surface-container-lowest p-8 rounded-3xl border-2 border-secondary/20 hover:border-secondary/70 shadow-lg hover:shadow-2xl transition-all flex items-center gap-8 group relative overflow-hidden card-hover-enhance"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-secondary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ opacity: [0, 0.1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.6 }}
                />
                <div className="flex-1 relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: -8 }}
                    className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 text-secondary group-hover:bg-secondary group-hover:text-white transition-all"
                  >
                    <BarChart3 className="w-6 h-6" />
                  </motion.div>
                  <h3 className="text-xl font-black text-[#0F172A] mb-2 font-headline">Reportes <span className="text-secondary">& KPIs</span></h3>
                  <p className="text-[#0F172A] text-sm font-medium leading-relaxed">Dashboards personalizables con visibilidad en tiempo real del desempeño.</p>
                </div>
                <motion.div className="w-28 h-28 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-full flex items-center justify-center text-secondary border border-secondary/20 group-hover:border-secondary/40 transition-all relative z-10 flex-shrink-0">
                  <TrendingUp className="w-12 h-12" />
                </motion.div>
              </motion.div>

              {/* Bento Item 5: Multiusuario */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -14, boxShadow: '0 0 30px rgba(51,95,157,0.4), 0 0 60px rgba(51,95,157,0.2)' }}
                className="md:col-span-3 bg-gradient-to-br from-white to-surface-container-lowest p-8 rounded-3xl border-2 border-secondary/20 hover:border-secondary/70 shadow-lg hover:shadow-2xl transition-all group relative card-hover-enhance"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-secondary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"
                  animate={{ opacity: [0, 0.1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.8 }}
                />
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 8 }}
                    className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 text-secondary group-hover:bg-secondary group-hover:text-white transition-all"
                  >
                    <Users className="w-6 h-6" />
                  </motion.div>
                  <h3 className="text-lg font-black text-[#0F172A] mb-2 font-headline">Acceso <span className="text-secondary">Multiusuario</span></h3>
                  <p className="text-[#0F172A] text-sm font-medium leading-relaxed">Permisos granulares para cada rol de tu organización.</p>
                </div>
              </motion.div>

              {/* Bento Item 6: Nube Segura */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -14, boxShadow: '0 0 30px rgba(51,95,157,0.4), 0 0 60px rgba(51,95,157,0.2)' }}
                className="md:col-span-3 bg-gradient-to-br from-white to-surface-container-lowest p-8 rounded-3xl border-2 border-secondary/20 hover:border-secondary/70 shadow-lg hover:shadow-2xl transition-all group relative card-hover-enhance"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-secondary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"
                  animate={{ opacity: [0, 0.1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                />
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: -8 }}
                    className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 text-secondary group-hover:bg-secondary group-hover:text-white transition-all"
                  >
                    <Cloud className="w-6 h-6" />
                  </motion.div>
                  <h3 className="text-lg font-black text-[#0F172A] mb-2 font-headline">Nube <span className="text-secondary">Segura</span></h3>
                  <p className="text-[#0F172A] text-sm font-medium leading-relaxed">Cifrado bancario, acceso 24/7 y backups automáticos.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Product Preview Section */}
        <section className="py-24 bg-surface">
          <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-6"
            >
              <h2 className="text-4xl font-bold text-on-surface leading-tight font-headline">Gestión visual <span className="text-secondary">sin distracciones</span></h2>
              <p className="text-on-surface-variant text-lg">Nuestra interfaz utiliza capas tonales para separar la información. No usamos bordes innecesarios, lo que reduce la fatiga visual de tus operadores.</p>
              <ul className="space-y-4 pt-4">
                {[
                  "Diseño adaptativo para tablets y desktops",
                  "Carga masiva de SKUs con validación automática",
                  "Integración directa con impresoras térmicas"
                ].map((text, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 w-5 h-5 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <p className="font-medium">{text}</p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:w-1/2 bg-surface-container-low p-2 rounded-[2.5rem] shadow-inner"
            >
              <div className="overflow-hidden rounded-[2rem] shadow-sm group">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-auto cursor-zoom-in"
                  alt="Dashboard preview"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuByeH3TDQgG2kDmuNrOYsxPnO0wZIbVR703AosmigU2pginGG_BZ-k0MV0TNPF5km--ReWQbAEvZigZ9ZpHgCjmRRHW4TuKFvZ5bv9-S9eM4-pMcXnFs8P00LP4ankeWQT8mMkZnKmkPoEst49nG2FVyKXWPtwyBbDNLz3Mc1672wX0Z6TVX-EiOoSUzk_W4kHMxK3GFUKHyyGXmBskXIGPsgNDHI59kyMBzXqpi7nF-k_lTuWUG5qxd7DqVQf1cUdavBkp3y3-FeCX"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-secondary via-secondary to-secondary/90 text-white rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden group shadow-2xl shadow-secondary/30 animate-glow"
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.3),transparent_60%)]"
              />
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.25, 0.1]
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.2),transparent_70%)]"
              />
              <motion.div
                animate={{ y: [0, -40, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              />
            </div>
            <div className="relative z-10 space-y-10 max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] font-headline">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  ¿Listo para
                </motion.span>{" "}
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-amber-400 drop-shadow-lg animate-pulse"
                >
                  vender más?
                </motion.span>
              </h2>
              <p className="text-white/90 text-xl md:text-2xl font-medium leading-relaxed">Hablemos de cómo VANTORY puede ayudarte a gestionar tu negocio sin complicaciones. Prueba gratuita por 14 días, sin tarjeta de crédito.</p>
              <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  href="https://wa.me/56920182313?text=Hola,%20me%20gustar%C3%ADa%20saber%20c%C3%B3mo%20funciona%20VANTORY%20POS%20360%20y%20consultar%20sus%20valores."
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.12, y: -8 }}
                  whileTap={{ scale: 0.92 }}
                  className="px-14 py-6 text-xl font-bold text-secondary bg-white rounded-[1.25rem] shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-3 group/btn relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
                  />
                  <span className="relative">Comenzar ahora</span>
                  <motion.div className="relative" whileHover={{ x: 4 }}>
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-6 text-lg font-bold text-secondary bg-white/10 border-2 border-white/30 rounded-[1.25rem] hover:bg-white/20 hover:border-white/50 transition-all backdrop-blur-sm"
                >
                  Ver demo en video
                </motion.button>
              </div>
              <p className="text-white/70 text-sm font-medium pt-4">Sin contratos, sin letra chica. Cancela cuando quieras.</p>
            </div>
          </motion.div>
        </section>
      </main>
    </motion.div>
  );
};
