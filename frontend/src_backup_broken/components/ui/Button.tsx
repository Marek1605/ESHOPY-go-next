'use client';

import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

// ============================================================================
// BUTTON COMPONENT - Versatile button with multiple variants and sizes
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'ghost' | 'outline' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-sm',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300',
  success: 'bg-green-600 hover:bg-green-700 text-white border-transparent shadow-sm',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent shadow-sm',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white border-transparent shadow-sm',
  info: 'bg-cyan-500 hover:bg-cyan-600 text-white border-transparent shadow-sm',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent',
  outline: 'bg-transparent hover:bg-gray-50 text-gray-700 border-gray-300',
  link: 'bg-transparent hover:underline text-blue-600 border-transparent p-0',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
  xl: 'px-6 py-3 text-lg',
};

const iconSizeStyles: Record<ButtonSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}, ref) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg border
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${isFullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <svg
          className={`animate-spin ${iconSizeStyles[size]}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : leftIcon ? (
        <span className={iconSizeStyles[size]}>{leftIcon}</span>
      ) : null}
      
      {children}
      
      {rightIcon && !isLoading && (
        <span className={iconSizeStyles[size]}>{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

// ============================================================================
// ICON BUTTON - Square button for icons only
// ============================================================================

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leftIcon' | 'rightIcon'> {
  icon: ReactNode;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon,
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const iconSizes: Record<ButtonSize, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  return (
    <Button
      ref={ref}
      size={size}
      className={`!p-0 ${iconSizes[size]} ${className}`}
      {...props}
    >
      {icon}
    </Button>
  );
});

IconButton.displayName = 'IconButton';

// ============================================================================
// BUTTON GROUP - Group multiple buttons together
// ============================================================================

export interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
  attached?: boolean;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className = '',
  attached = false,
}) => {
  return (
    <div
      className={`
        inline-flex
        ${attached ? '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:border-l-0' : 'gap-2'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Button;
