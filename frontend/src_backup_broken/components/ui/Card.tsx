'use client';

import React, { ReactNode } from 'react';

// ============================================================================
// CARD COMPONENT - Content container with optional header and footer
// ============================================================================

export interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
}

const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const shadowStyles: Record<string, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow',
  lg: 'shadow-lg',
};

const roundedStyles: Record<string, string> = {
  none: '',
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  border = true,
  rounded = 'lg',
  hover = false,
  onClick,
}) => {
  return (
    <div
      className={`
        bg-white
        ${paddingStyles[padding]}
        ${shadowStyles[shadow]}
        ${roundedStyles[rounded]}
        ${border ? 'border border-gray-200' : ''}
        ${hover ? 'hover:shadow-md hover:border-gray-300 transition-all duration-200' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// ============================================================================
// CARD HEADER - Top section of card
// ============================================================================

export interface CardHeaderProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  title,
  subtitle,
  action,
  className = '',
}) => {
  if (title || subtitle) {
    return (
      <div className={`flex items-center justify-between pb-4 mb-4 border-b border-gray-200 ${className}`}>
        <div>
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    );
  }

  return <div className={`pb-4 mb-4 border-b border-gray-200 ${className}`}>{children}</div>;
};

// ============================================================================
// CARD BODY - Main content area
// ============================================================================

export interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
}) => {
  return <div className={className}>{children}</div>;
};

// ============================================================================
// CARD FOOTER - Bottom section of card
// ============================================================================

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

const alignStyles: Record<string, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
  between: 'justify-between',
};

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  align = 'right',
}) => {
  return (
    <div className={`flex items-center pt-4 mt-4 border-t border-gray-200 ${alignStyles[align]} ${className}`}>
      {children}
    </div>
  );
};

// ============================================================================
// STAT CARD - Card displaying a statistic
// ============================================================================

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: ReactNode;
  iconColor?: string;
  footer?: ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  iconColor = 'bg-blue-100 text-blue-600',
  footer,
  className = '',
}) => {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          
          {change && (
            <div className={`mt-2 flex items-center gap-1 text-sm ${
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change.type === 'increase' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span>{Math.abs(change.value)}%</span>
              <span className="text-gray-500">vs. minulý mesiac</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`p-3 rounded-lg ${iconColor}`}>
            {icon}
          </div>
        )}
      </div>
      
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </Card>
  );
};

// ============================================================================
// IMAGE CARD - Card with image at top
// ============================================================================

export interface ImageCardProps {
  image: string;
  imageAlt: string;
  title: string;
  description?: string;
  footer?: ReactNode;
  onClick?: () => void;
  className?: string;
  imageHeight?: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  imageAlt,
  title,
  description,
  footer,
  onClick,
  className = '',
  imageHeight = 'h-48',
}) => {
  return (
    <Card 
      padding="none" 
      hover={!!onClick} 
      onClick={onClick}
      className={className}
    >
      <div className={`${imageHeight} overflow-hidden rounded-t-lg`}>
        <img 
          src={image} 
          alt={imageAlt} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
        )}
      </div>
      {footer && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          {footer}
        </div>
      )}
    </Card>
  );
};

// ============================================================================
// PROFILE CARD - Card for user/profile display
// ============================================================================

export interface ProfileCardProps {
  avatar?: string;
  name: string;
  title?: string;
  email?: string;
  actions?: ReactNode;
  stats?: { label: string; value: string | number }[];
  className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  avatar,
  name,
  title,
  email,
  actions,
  stats,
  className = '',
}) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className={className}>
      <div className="text-center">
        {avatar ? (
          <img 
            src={avatar} 
            alt={name}
            className="w-20 h-20 rounded-full mx-auto object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {initials}
          </div>
        )}
        
        <h3 className="mt-4 text-lg font-semibold text-gray-900">{name}</h3>
        {title && <p className="text-sm text-gray-500">{title}</p>}
        {email && (
          <a href={`mailto:${email}`} className="text-sm text-blue-600 hover:underline">
            {email}
          </a>
        )}
        
        {actions && (
          <div className="mt-4 flex justify-center gap-2">
            {actions}
          </div>
        )}
        
        {stats && stats.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;
