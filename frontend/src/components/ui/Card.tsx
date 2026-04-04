import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'glass' | 'premium' | 'subtle';
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ 
  children, 
  className = '', 
  padding = 'md',
  variant = 'default',
  hover = false,
  onClick 
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const variantStyles = {
    default: 'bg-white border border-forest-100/40',
    glass: 'glass',
    premium: 'premium-card',
    subtle: 'glass-subtle',
  };

  const hoverStyles = hover 
    ? 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer' 
    : '';

  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hoverStyles}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;