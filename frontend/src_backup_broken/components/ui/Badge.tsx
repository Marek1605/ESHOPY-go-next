'use client';

import React, { ReactNode } from 'react';

// ============================================================================
// BADGE COMPONENT - Status indicators and labels
// ============================================================================

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
  icon?: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  primary: 'bg-blue-100 text-blue-800 border-blue-200',
  secondary: 'bg-purple-100 text-purple-800 border-purple-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  info: 'bg-cyan-100 text-cyan-800 border-cyan-200',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-gray-500',
  primary: 'bg-blue-500',
  secondary: 'bg-purple-500',
  success: 'bg-green-500',
  danger: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-cyan-500',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  className = '',
  icon,
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      
      {icon && <span className="w-3.5 h-3.5">{icon}</span>}
      
      {children}
      
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 -mr-1 w-4 h-4 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
          aria-label="Odstrániť"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};

// ============================================================================
// STATUS BADGE - Predefined badges for common statuses
// ============================================================================

export type StatusType = 
  | 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' 
  | 'published' | 'draft' | 'archived'
  | 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  | 'online' | 'offline' | 'busy' | 'away'
  | 'success' | 'error' | 'warning' | 'info';

const statusConfig: Record<StatusType, { variant: BadgeVariant; label: string }> = {
  // General statuses
  active: { variant: 'success', label: 'Aktívne' },
  inactive: { variant: 'default', label: 'Neaktívne' },
  pending: { variant: 'warning', label: 'Čaká' },
  approved: { variant: 'success', label: 'Schválené' },
  rejected: { variant: 'danger', label: 'Zamietnuté' },
  
  // Content statuses
  published: { variant: 'success', label: 'Publikované' },
  draft: { variant: 'default', label: 'Koncept' },
  archived: { variant: 'secondary', label: 'Archivované' },
  
  // Order statuses
  new: { variant: 'info', label: 'Nová' },
  processing: { variant: 'warning', label: 'Spracováva sa' },
  shipped: { variant: 'primary', label: 'Odoslané' },
  delivered: { variant: 'success', label: 'Doručené' },
  cancelled: { variant: 'danger', label: 'Zrušené' },
  refunded: { variant: 'secondary', label: 'Vrátené' },
  
  // Online statuses
  online: { variant: 'success', label: 'Online' },
  offline: { variant: 'default', label: 'Offline' },
  busy: { variant: 'danger', label: 'Zaneprázdnený' },
  away: { variant: 'warning', label: 'Preč' },
  
  // Notification statuses
  success: { variant: 'success', label: 'Úspech' },
  error: { variant: 'danger', label: 'Chyba' },
  warning: { variant: 'warning', label: 'Upozornenie' },
  info: { variant: 'info', label: 'Info' },
};

export interface StatusBadgeProps {
  status: StatusType;
  size?: BadgeSize;
  showDot?: boolean;
  customLabel?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
  customLabel,
  className = '',
}) => {
  const config = statusConfig[status] || { variant: 'default', label: status };
  
  return (
    <Badge
      variant={config.variant}
      size={size}
      dot={showDot}
      className={className}
    >
      {customLabel || config.label}
    </Badge>
  );
};

// ============================================================================
// COUNT BADGE - Badge showing a count/number
// ============================================================================

export interface CountBadgeProps {
  count: number;
  max?: number;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  max = 99,
  variant = 'primary',
  size = 'sm',
  className = '',
}) => {
  const displayCount = count > max ? `${max}+` : count.toString();
  
  return (
    <Badge variant={variant} size={size} className={`min-w-[1.5rem] justify-center ${className}`}>
      {displayCount}
    </Badge>
  );
};

// ============================================================================
// BADGE GROUP - Group multiple badges together
// ============================================================================

export interface BadgeGroupProps {
  children: ReactNode;
  max?: number;
  className?: string;
}

export const BadgeGroup: React.FC<BadgeGroupProps> = ({
  children,
  max,
  className = '',
}) => {
  const childArray = React.Children.toArray(children);
  const visibleChildren = max ? childArray.slice(0, max) : childArray;
  const hiddenCount = max ? childArray.length - max : 0;
  
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {visibleChildren}
      {hiddenCount > 0 && (
        <Badge variant="default" size="sm">
          +{hiddenCount}
        </Badge>
      )}
    </div>
  );
};

export default Badge;
