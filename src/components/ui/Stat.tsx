import React from 'react';

interface StatProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  tooltip?: string;
}

export const Stat: React.FC<StatProps> = ({
  icon,
  label,
  value,
  sublabel,
  variant = 'primary',
  tooltip,
}) => {
  const variantColors = {
    primary: 'bg-brand-50 text-brand-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-amber-50 text-amber-600',
    error: 'bg-red-50 text-red-600',
  };

  return (
    <div
      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
      title={tooltip}
    >
      {icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${variantColors[variant]}`}>
          {icon}
        </div>
      )}
      <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mb-2">{value}</p>
      {sublabel && <p className="text-xs text-slate-500 font-semibold">{sublabel}</p>}
      {tooltip && (
        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs p-2 rounded-lg -bottom-10 left-0 w-full z-10 pointer-events-none shadow-lg">
          {tooltip}
        </div>
      )}
    </div>
  );
};
