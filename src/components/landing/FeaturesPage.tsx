import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Zap, 
  Wallet, 
  LineChart, 
  Users, 
  Cloud, 
  Shield, 
  Smartphone, 
  Check, 
  ArrowRight 
} from 'lucide-react';

interface FeaturesPageProps {
  setCurrentPage?: (page: string) => void;
}

export const FeaturesPage = ({ setCurrentPage = () => {} }: FeaturesPageProps) => {
  const features = [
    {
      icon: Package,
      title: "Gestión de Inventario Inteligente",
      description: "Control total de stock con alertas de reposición, categorías personalizadas y seguimiento de lotes.",
      benefits: ["Sincronización en tiempo real", "Carga masiva vía Excel", "Historial de movimientos"]
    },
    {
      icon: Zap,
      title: "Ventas de Alta Velocidad",
      description: "Terminal de ventas optimizado para escaneo rápido, múltiples métodos de pago y gestión de boletas.",
      benefits: ["Compatible con lectores de barras", "Búsqueda predictiva", "Tickets personalizables"]
    },
    {
      icon: Wallet,
      title: "Sistema de Fiados (Crédito)",
      description: "Gestiona el crédito de tus clientes de confianza con límites, historial de pagos y recordatorios.",
      benefits: ["Perfiles de clientes", "Límites de crédito", "Abonos parciales"]
    },
    {
      icon: LineChart,
      title: "Analítica de Negocio",
      description: "Dashboards visuales con KPIs clave: Ticket promedio, rotación de stock y productos más vendidos.",
      benefits: ["Reportes exportables", "Comparativas temporales", "Márgenes de utilidad"]
    },
    {
      icon: Users,
      title: "Control de Usuarios y Roles",
      description: "Administra los permisos de tu equipo. Define quién puede ver reportes, editar stock o realizar ventas.",
      benefits: ["Roles predefinidos", "Logs de actividad", "Acceso multi-sucursal"]
    },
    {
      icon: Cloud,
      title: "Infraestructura en la Nube",
      description: "Tus datos siempre seguros y accesibles desde cualquier lugar. Backups automáticos cada hora.",
      benefits: ["Acceso 24/7", "Cifrado SSL", "Sin instalación local"]
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
          className="absolute bottom-40 left-[5%] w-72 h-72 bg-secondary/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <header className="max-w-4xl mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-secondary/10 rounded-full border border-secondary/30 mb-8 hover:border-secondary/50 transition-all"
          >
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-[11px] font-black tracking-widest uppercase text-secondary">Todas las funcionalidades</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-6xl md:text-7xl lg:text-8xl font-black text-[#0F172A] tracking-tighter leading-[1.1] mb-8 font-headline"
          >
            Todo lo que necesitas para <span className="bg-gradient-to-r from-secondary to-secondary/70 bg-clip-text text-transparent">escalar tu negocio</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl text-on-surface-variant font-medium leading-relaxed max-w-2xl"
          >
            VANTORY POS 360 combina la potencia de un ERP empresarial con la simplicidad de una app moderna.
          </motion.p>
        </header>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ y: -12, boxShadow: '0 40px 80px -20px rgba(38,124,220,0.2)' }}
              className="bg-gradient-to-br from-white to-surface-container-lowest/40 p-10 rounded-[2.8rem] border border-secondary/10 hover:border-secondary/30 shadow-lg hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <motion.div
                whileHover={{ scale: 1.15, rotate: 8 }}
                className="relative w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-8 group-hover:bg-secondary group-hover:text-white transition-all shadow-lg"
              >
                <feature.icon className="w-8 h-8" />
              </motion.div>

              <h3 className="text-2xl font-black text-[#0F172A] mb-4 font-headline relative z-10">{feature.title}</h3>
              <p className="text-on-surface-variant font-medium mb-10 leading-relaxed relative z-10">{feature.description}</p>

              <ul className="space-y-4 relative z-10">
                {feature.benefits.map((benefit, j) => (
                  <motion.li
                    key={j}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: (i * 0.12) + (j * 0.05) }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 text-sm font-bold text-[#0F172A]/70 group-hover:text-[#0F172A] transition-colors"
                  >
                    <motion.div className="w-2 h-2 rounded-full bg-gradient-to-r from-secondary to-secondary/50 flex-shrink-0" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Comparison Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 bg-gradient-to-br from-secondary/5 to-surface-container-low rounded-[3.5rem] p-8 md:p-20 relative overflow-hidden border border-secondary/10"
        >
          <motion.div
            animate={{ opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(38,124,220,0.1),transparent_70%)]"
          />

          <div className="relative z-10 text-center mb-20">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-5xl md:text-6xl font-black text-[#0F172A] font-headline mb-6"
            >
              ¿Por qué elegir <span className="text-secondary">VANTORY?</span>
            </motion.h2>
            <p className="text-on-surface-variant font-medium text-lg max-w-2xl mx-auto">Comparamos nuestra solución con los sistemas tradicionales de punto de venta.</p>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-green-50/30 p-12 rounded-[2.5rem] shadow-lg border-2 border-green-500/20 hover:border-secondary/40 transition-all"
            >
              <h3 className="text-2xl font-black text-secondary mb-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                VANTORY POS 360
              </h3>
              <ul className="space-y-6">
                {[
                  "Interfaz intuitiva (tu equipo operando en menos de 1 hora)",
                  "Acceso desde cualquier dispositivo (Cloud)",
                  "Actualizaciones automáticas gratuitas",
                  "Soporte técnico prioritario vía WhatsApp",
                  "Reportes inteligentes en tiempo real"
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 group"
                  >
                    <motion.div className="mt-1 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Check className="w-4 h-4 text-green-600" strokeWidth={3} />
                    </motion.div>
                    <p className="font-bold text-on-surface text-base leading-relaxed">{item}</p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-surface-container-high/20 p-12 rounded-[2.5rem] border border-outline-variant/20 opacity-70 hover:opacity-90 transition-all"
            >
              <h3 className="text-2xl font-black text-on-surface-variant mb-10">Sistemas Tradicionales</h3>
              <ul className="space-y-6">
                {[
                  "Interfaces complejas y anticuadas",
                  "Instalación local (riesgo de pérdida de datos)",
                  "Cobros por actualizaciones y versiones",
                  "Soporte lento vía tickets o emails",
                  "Reportes estáticos y difíciles de leer"
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 w-6 h-6 rounded-full bg-on-surface-variant/20 flex items-center justify-center shrink-0">
                      <div className="w-2.5 h-0.5 bg-on-surface-variant/60 rounded-full"></div>
                    </div>
                    <p className="font-medium text-on-surface-variant text-base">{item}</p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 text-center relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-10 max-w-3xl mx-auto"
          >
            <h2 className="text-5xl md:text-7xl font-black text-[#0F172A] tracking-tighter leading-tight font-headline">
              ¿Listo para ver la <span className="text-secondary">diferencia?</span>
            </h2>
            <p className="text-xl text-on-surface-variant font-medium">Miles de emprendimientos en Chile ya confían en VANTORY POS 360 para gestionar sus ventas e inventario.</p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-6 justify-center pt-6"
            >
              <motion.a
                href="https://wa.me/56920182313?text=Hola,%20me%20gustaría%20solicitar%20una%20demo%20de%20VANTORY%20POS%20360"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.92 }}
                className="px-12 py-6 bg-gradient-secondary text-white font-black text-lg rounded-2xl shadow-2xl shadow-secondary/30 hover:shadow-secondary/50 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 0.15, x: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 bg-white/10"
                />
                <span className="relative">Solicitar Demo Gratuita</span>
                <motion.div className="relative" whileHover={{ x: 4 }}>
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </motion.a>
              <motion.button
                onClick={() => setCurrentPage('pricing')}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="px-12 py-6 bg-white text-secondary border-2 border-secondary/30 hover:border-secondary font-black text-lg rounded-2xl shadow-lg hover:shadow-xl hover:bg-secondary/5 transition-all"
              >
                Ver Planes y Precios
              </motion.button>
            </motion.div>

            <p className="text-sm text-on-surface-variant/60 font-medium pt-4">Sin contrato. Prueba 14 días gratis.</p>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};
