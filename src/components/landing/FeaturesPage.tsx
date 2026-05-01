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

export const FeaturesPage = () => {
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
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="container mx-auto px-6 md:px-12">
        <header className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full border border-secondary/20 mb-6"
          >
            <span className="text-[10px] font-black tracking-widest uppercase text-secondary">Funcionalidades</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-[#0F172A] tracking-tighter leading-none mb-8 font-headline"
          >
            Todo lo que necesitas para <span className="text-secondary">escalar tu negocio</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-on-surface-variant font-medium leading-relaxed"
          >
            VANTORY POS 360 combina la potencia de un ERP empresarial con la simplicidad de una app moderna.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/20 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center text-secondary mb-8 group-hover:bg-secondary group-hover:text-white transition-colors">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-[#0F172A] mb-4 font-headline">{feature.title}</h3>
              <p className="text-on-surface-variant font-medium mb-8 leading-relaxed">{feature.description}</p>
              <ul className="space-y-3">
                {feature.benefits.map((benefit, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm font-bold text-[#0F172A]/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Comparison Section */}
        <section className="mt-32 bg-surface-container-low rounded-[3rem] p-8 md:p-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#0F172A] font-headline mb-4">¿Por qué elegir VANTORY?</h2>
            <p className="text-on-surface-variant font-medium max-w-2xl mx-auto">Comparamos nuestra solución con los sistemas tradicionales de punto de venta.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-outline-variant/10">
              <h3 className="text-xl font-black text-secondary mb-8 flex items-center gap-2">
                <Check className="w-6 h-6" /> VANTORY POS 360
              </h3>
              <ul className="space-y-6">
                {[
                  "Interfaz intuitiva (0 horas de capacitación)",
                  "Acceso desde cualquier dispositivo (Cloud)",
                  "Actualizaciones automáticas gratuitas",
                  "Soporte técnico prioritario vía WhatsApp",
                  "Reportes inteligentes en tiempo real"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
                    </div>
                    <p className="font-bold text-on-surface">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface-container-high/30 p-10 rounded-[2rem] border border-outline-variant/10 opacity-60">
              <h3 className="text-xl font-black text-on-surface-variant mb-8">Sistemas Tradicionales</h3>
              <ul className="space-y-6">
                {[
                  "Interfaces complejas y anticuadas",
                  "Instalación local (riesgo de pérdida de datos)",
                  "Cobros por actualizaciones y versiones",
                  "Soporte lento vía tickets o emails",
                  "Reportes estáticos y difíciles de leer"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1 w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                      <div className="w-2 h-0.5 bg-on-surface-variant/40"></div>
                    </div>
                    <p className="font-medium text-on-surface-variant">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-black text-[#0F172A] tracking-tighter font-headline">¿Listo para ver la diferencia?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-12 py-6 bg-gradient-secondary text-white font-black rounded-2xl shadow-xl shadow-secondary/20 hover:scale-105 transition-transform flex items-center justify-center gap-2">
                Solicitar Demo Gratuita <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-12 py-6 bg-white text-secondary border-2 border-secondary/20 font-black rounded-2xl hover:bg-surface-container-low transition-colors">
                Ver Planes y Precios
              </button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};
