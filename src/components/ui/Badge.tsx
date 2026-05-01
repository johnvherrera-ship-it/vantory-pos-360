import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', icon, children, className, ...props }, ref) => {
    const variants = {
      default: 'bg-slate-100 text-slate-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-amber-100 text-amber-700',
      error: 'bg-red-100 text-red-700',
      info: 'bg-sky-100 text-sky-700',
    };

    const sizes = {
      sm: 'px-2 py-1 text-xs font-semibold',
      md: 'px-3 py-1.5 text-sm font-semibold',
    };

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center gap-1.5 rounded-full font-sans
          ${variants[variant]}
          ${sizes[size]}
          ${className || ''}
        `.trim()}
        {...props}
      >
        {icon}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
