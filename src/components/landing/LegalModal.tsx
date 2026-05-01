import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms';
  onClose: () => void;
}

export const LegalModal = ({ type, onClose }: LegalModalProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-surface-container-low rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-[#0F172A]" />
        </button>

        <div className="space-y-8">
          <header>
            <h2 className="text-3xl font-black text-[#0F172A] font-headline mb-2">
              {type === 'privacy' ? 'Política de Privacidad' : 'Términos y Condiciones'}
            </h2>
            <p className="text-sm font-black text-secondary uppercase tracking-widest">Última actualización: 12 de Marzo, 2024</p>
          </header>

          <div className="prose prose-slate max-w-none">
            {type === 'privacy' ? (
              <div className="space-y-6 text-on-surface-variant font-medium leading-relaxed">
                <p>En Vantory Digital, valoramos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política describe cómo recopilamos, usamos y protegemos la información en nuestro sistema VANTORY POS 360.</p>
                
                <h3 className="text-xl font-bold text-[#0F172A]">1. Recopilación de Información</h3>
                <p>Recopilamos información necesaria para la operación del punto de venta, incluyendo datos de inventario, transacciones de venta y perfiles de usuario de tu equipo.</p>
                
                <h3 className="text-xl font-bold text-[#0F172A]">2. Uso de los Datos</h3>
                <p>Los datos se utilizan exclusivamente para proporcionar el servicio de gestión comercial, generar reportes analíticos y mejorar la experiencia del usuario. Nunca vendemos tus datos a terceros.</p>
                
                <h3 className="text-xl font-bold text-[#0F172A]">3. Seguridad</h3>
                <p>Implementamos medidas de seguridad de grado industrial, incluyendo cifrado SSL y backups automáticos, para asegurar que tu información comercial esté siempre protegida.</p>
              </div>
            ) : (
              <div className="space-y-6 text-on-surface-variant font-medium leading-relaxed">
                <p>Al utilizar VANTORY POS 360, aceptas los siguientes términos y condiciones de uso de nuestra plataforma de gestión comercial.</p>
                
                <h3 className="text-xl font-bold text-[#0F172A]">1. Licencia de Uso</h3>
                <p>Vantory Digital otorga una licencia limitada, no exclusiva y revocable para utilizar el software según el plan de suscripción contratado.</p>
                
                <h3 className="text-xl font-bold text-[#0F172A]">2. Responsabilidad del Usuario</h3>
                <p>El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de la veracidad de la información ingresada en el sistema.</p>
                
                <h3 className="text-xl font-bold text-[#0F172A]">3. Disponibilidad del Servicio</h3>
                <p>Nos esforzamos por mantener una disponibilidad del 99.9%. Realizamos mantenimientos programados en horarios de bajo tráfico para minimizar interrupciones.</p>
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-outline-variant/20 flex justify-end">
            <button 
              onClick={onClose}
              className="px-8 py-4 bg-secondary text-white font-black rounded-xl hover:scale-105 transition-transform"
            >
              Entendido
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
