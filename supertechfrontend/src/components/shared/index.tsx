import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className = '', onClick }: CardProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-6 ${className} ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
}: ButtonProps) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 min-h-[44px] flex items-center justify-center';

  const variantStyles = {
    primary: 'bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800',
    secondary: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex justify-center items-center p-8">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin`}
      />
    </div>
  );
};

export const SkeletonLoader = ({ className = '' }: { className?: string }) => {
  return (
    <div
      className={`bg-gray-200 rounded-lg animate-pulse ${className}`}
    />
  );
};
