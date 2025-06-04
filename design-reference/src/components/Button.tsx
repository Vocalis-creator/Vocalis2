import React from 'react';
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'text';
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}
export const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  onClick,
  className = ''
}: ButtonProps) => {
  const baseClasses = 'flex items-center justify-center rounded-lg font-medium transition-all duration-200';
  const variantClasses = {
    primary: 'bg-gold-500 hover:bg-gold-600 text-navy-900 py-3 px-6',
    secondary: 'bg-navy-700 hover:bg-navy-600 text-gold-300 border border-gold-400/30 py-3 px-6',
    text: 'text-gold-400 hover:text-gold-300 py-2'
  };
  const widthClass = fullWidth ? 'w-full' : '';
  return <button className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`} onClick={onClick}>
      {children}
    </button>;
};