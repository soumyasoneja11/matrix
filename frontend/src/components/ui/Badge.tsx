import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'critical' | 'urgent' | 'standard' | 'info' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '' 
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all';

  const variantStyles = {
    default: 'bg-forest-100 text-forest-700 border border-forest-200/50',
    critical: 'bg-red-100 text-red-700 border border-red-200 shadow-sm',
    urgent: 'bg-amber-100 text-amber-700 border border-amber-200 shadow-sm',
    standard: 'bg-primary-100 text-primary-700 border border-primary-200 shadow-sm',
    info: 'bg-blue-100 text-blue-700 border border-blue-200',
    success: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    warning: 'bg-orange-100 text-orange-700 border border-orange-200',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;