import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'elevated' | 'outlined';
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', children, className, ...props }, ref) => {
    const variants = {
      default: 'bg-white border border-brand-100 shadow-sm',
      interactive: 'bg-white border border-brand-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer',
      elevated: 'bg-white border border-brand-50 shadow-lg',
      outlined: 'bg-transparent border-2 border-brand-200',
    };

    return (
      <div
        ref={ref}
        className={`
          rounded-2xl p-6 transition-all duration-200
          ${variants[variant]}
          ${className || ''}
        `.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex justify-between items-start mb-6 ${className || ''}`.trim()}
        {...props}
      >
        <div>
          {title && <h3 className="text-xl font-bold text-slate-900">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
          {children}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`space-y-4 ${className || ''}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';
