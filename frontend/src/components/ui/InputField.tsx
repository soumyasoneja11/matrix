import React from 'react';
import { useTheme } from '../../hooks/contexts/ThemeContext';

interface TextAreaFieldProps {
  label?: string;
  name?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

export function TextAreaField({
  label,
  name,
  placeholder,
  value,
  onChange,
  rows = 4,
  className = '',
  disabled = false,
  required = false,
  error,
}: TextAreaFieldProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="w-full">
      {label && (
        <label className={`block text-sm font-semibold mb-2 ${
          isLight ? 'text-forest-800' : 'text-gray-200'
        }`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-3 
          rounded-xl
          border transition-all duration-200 resize-none
          focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
          disabled:cursor-not-allowed
          ${isLight
            ? 'border-forest-200 bg-white/80 text-forest-900 placeholder:text-forest-400 disabled:bg-forest-50 disabled:text-forest-400'
            : 'border-gray-600 bg-[#2A2A40] text-gray-200 placeholder:text-gray-500 disabled:bg-gray-800 disabled:text-gray-500'
          }
          ${error ? 'border-red-400 focus:ring-red-400' : ''}
          ${className}
        `}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}

interface SelectFieldProps {
  label?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  className = '',
  disabled = false,
  required = false,
  error,
}: SelectFieldProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="w-full">
      {label && (
        <label className={`block text-sm font-semibold mb-2 ${
          isLight ? 'text-forest-800' : 'text-gray-200'
        }`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-3
          rounded-xl
          border transition-all duration-200 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
          disabled:cursor-not-allowed
          ${isLight
            ? 'border-forest-200 bg-white/80 text-forest-900 disabled:bg-forest-50 disabled:text-forest-400'
            : 'border-gray-600 bg-[#2A2A40] text-gray-200 disabled:bg-gray-800 disabled:text-gray-500'
          }
          ${error ? 'border-red-400 focus:ring-red-400' : ''}
          ${className}
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}

interface InputFieldProps {
  label?: string;
  name?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
}

export function InputField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  disabled = false,
  required = false,
  error,
  icon,
}: InputFieldProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="w-full">
      {label && (
        <label className={`block text-sm font-semibold mb-2 ${
          isLight ? 'text-forest-800' : 'text-gray-200'
        }`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${
            isLight ? 'text-forest-400' : 'text-gray-400'
          }`}>
            {icon}
          </div>
        )}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-3
            ${icon ? 'pl-10' : ''}
            rounded-xl
            border transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
            disabled:cursor-not-allowed
            ${isLight
              ? 'border-forest-200 bg-white/80 text-forest-900 placeholder:text-forest-400 disabled:bg-forest-50 disabled:text-forest-400'
              : 'border-gray-600 bg-[#2A2A40] text-gray-200 placeholder:text-gray-500 disabled:bg-gray-800 disabled:text-gray-500'
            }
            ${error ? 'border-red-400 focus:ring-red-400' : ''}
            ${className}
          `}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}