import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    icon,
    fullWidth,
    loading,
    children,
    className,
    disabled,
    ...props
  }, ref) => {
    const baseStyles = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-sans';

    const variants = {
      primary: 'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 disabled:bg-slate-300 font-semibold',
      secondary: 'bg-slate-100 text-brand-900 hover:bg-slate-200 active:bg-slate-300 disabled:bg-slate-100 font-semibold',
      ghost: 'text-brand-700 hover:bg-brand-50 active:bg-brand-100 disabled:text-slate-400 font-semibold',
      danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 disabled:bg-slate-300 font-semibold',
      success: 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700 disabled:bg-slate-300 font-semibold',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const finalClassName = `
      ${baseStyles}
      ${variants[variant]}
      ${sizes[size]}
      ${fullWidth ? 'w-full' : ''}
      ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
      ${className || ''}
    `;

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={finalClassName.trim()}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {icon && !loading && icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
