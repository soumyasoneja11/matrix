import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-300 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0':
            variant === 'primary',
          'bg-white/60 backdrop-blur-sm text-primary-800 border border-primary-200 hover:bg-white/80 hover:shadow-md':
            variant === 'secondary',
          'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl':
            variant === 'danger',
          'bg-transparent text-primary-700 hover:bg-primary-50/60': variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-xs': size === 'sm',
          'px-5 py-2.5 text-sm': size === 'md',
          'px-7 py-3.5 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
