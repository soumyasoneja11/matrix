import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/contexts/ThemeContext';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
}: ButtonProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer';

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-primary-600 to-primary-700 
      text-white 
      hover:from-primary-700 hover:to-primary-800 
      focus:ring-primary-500 
      shadow-md hover:shadow-lg
      disabled:from-forest-300 disabled:to-forest-400 disabled:cursor-not-allowed
    `,
    secondary: isLight
      ? `bg-white text-forest-800 border border-forest-200 hover:bg-forest-50 hover:border-forest-300 focus:ring-forest-400 shadow-sm hover:shadow-md disabled:bg-forest-50 disabled:text-forest-400 disabled:cursor-not-allowed`
      : `bg-white/5 text-gray-200 border border-gray-600 hover:bg-white/10 hover:border-gray-500 focus:ring-gray-500 shadow-sm disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed`,
    outline: isLight
      ? `bg-transparent text-forest-700 border-2 border-forest-300 hover:bg-forest-50 hover:border-forest-400 focus:ring-forest-400 disabled:text-forest-400 disabled:border-forest-200 disabled:cursor-not-allowed`
      : `bg-transparent text-gray-300 border-2 border-gray-600 hover:bg-white/5 hover:border-gray-500 focus:ring-gray-500 disabled:text-gray-600 disabled:border-gray-700 disabled:cursor-not-allowed`,
    ghost: isLight
      ? `bg-transparent text-forest-700 hover:bg-forest-50 focus:ring-forest-300 disabled:text-forest-400 disabled:cursor-not-allowed`
      : `bg-transparent text-gray-300 hover:bg-white/10 focus:ring-gray-600 disabled:text-gray-600 disabled:cursor-not-allowed`,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700 
      text-white 
      hover:from-red-700 hover:to-red-800
      focus:ring-red-500
      shadow-md hover:shadow-lg
      disabled:from-red-300 disabled:to-red-400 disabled:cursor-not-allowed
    `,
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyle}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}

export default Button;