import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'critical' | 'urgent' | 'standard' | 'info' | 'default';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        {
          'bg-red-100 text-red-700 border border-red-200': variant === 'critical',
          'bg-amber-100 text-amber-700 border border-amber-200': variant === 'urgent',
          'bg-green-100 text-green-700 border border-green-200': variant === 'standard',
          'bg-blue-100 text-blue-700 border border-blue-200': variant === 'info',
          'bg-gray-100 text-gray-600 border border-gray-200': variant === 'default',
        },
        {
          'px-2 py-0.5 text-[10px]': size === 'sm',
          'px-3 py-1 text-xs': size === 'md',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
