import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'solid' | 'ghost';
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export function Card({ children, className, variant = 'glass', hover = false, padding = 'md' }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-3xl transition-all duration-300',
        {
          'glass': variant === 'glass',
          'bg-white shadow-sm border border-gray-100': variant === 'solid',
          'bg-transparent': variant === 'ghost',
        },
        {
          'hover:shadow-xl hover:-translate-y-1': hover,
        },
        {
          'p-3': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
          '': padding === 'none',
        },
        className
      )}
    >
      {children}
    </div>
  );
}
