import React from 'react';
import clsx from 'clsx';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function InputField({ label, error, icon, className, ...props }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={clsx(
            'w-full rounded-2xl border border-gray-200/60 bg-white/50 backdrop-blur-sm px-4 py-3 text-sm',
            'transition-all duration-200 outline-none',
            'focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:bg-white/80',
            'placeholder:text-gray-400',
            icon && 'pl-10',
            error && 'border-red-300 focus:border-red-400 focus:ring-red-100',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
}

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextAreaField({ label, error, className, ...props }: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <textarea
        className={clsx(
          'w-full rounded-2xl border border-gray-200/60 bg-white/50 backdrop-blur-sm px-4 py-3 text-sm',
          'transition-all duration-200 outline-none resize-none',
          'focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:bg-white/80',
          'placeholder:text-gray-400',
          error && 'border-red-300 focus:border-red-400 focus:ring-red-100',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function SelectField({ label, error, options, className, ...props }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <select
        className={clsx(
          'w-full rounded-2xl border border-gray-200/60 bg-white/50 backdrop-blur-sm px-4 py-3 text-sm',
          'transition-all duration-200 outline-none appearance-none',
          'focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:bg-white/80',
          error && 'border-red-300',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
}
