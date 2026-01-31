'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';

// ============================================================================
// BREADCRUMBS COMPONENT
// ============================================================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  homeIcon?: boolean;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator,
  homeIcon = true,
  className = '',
}) => {
  const defaultSeparator = (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const homeIconSvg = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  return (
    <nav className={`flex items-center ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <span className="flex-shrink-0" aria-hidden="true">
                  {separator || defaultSeparator}
                </span>
              )}
              
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {isFirst && homeIcon ? homeIconSvg : item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={`flex items-center gap-1.5 text-sm ${
                    isLast ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {isFirst && homeIcon && !item.href ? homeIconSvg : item.icon}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// ============================================================================
// TABS COMPONENT
// ============================================================================

export interface Tab {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'line' | 'pills' | 'enclosed';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

const tabSizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  className = '',
}) => {
  const getVariantStyles = (isActive: boolean, isDisabled: boolean) => {
    if (isDisabled) {
      return 'text-gray-400 cursor-not-allowed';
    }

    switch (variant) {
      case 'line':
        return isActive
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300';
      case 'pills':
        return isActive
          ? 'bg-blue-600 text-white rounded-lg'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg';
      case 'enclosed':
        return isActive
          ? 'bg-white text-gray-900 border border-gray-200 border-b-white rounded-t-lg -mb-px'
          : 'text-gray-500 hover:text-gray-700 bg-gray-50 border border-transparent rounded-t-lg';
      default:
        return '';
    }
  };

  return (
    <div className={className}>
      <div
        className={`
          flex ${fullWidth ? '' : 'inline-flex'} gap-1
          ${variant === 'line' ? 'border-b border-gray-200' : ''}
          ${variant === 'enclosed' ? 'border-b border-gray-200' : ''}
        `}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            className={`
              ${fullWidth ? 'flex-1' : ''}
              ${tabSizeStyles[size]}
              font-medium transition-all duration-200 flex items-center justify-center gap-2
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
              ${getVariantStyles(activeTab === tab.id, tab.disabled || false)}
            `}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`
                px-2 py-0.5 text-xs rounded-full
                ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
              `}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// TAB PANEL - Content container for tabs
// ============================================================================

export interface TabPanelProps {
  id: string;
  activeTab: string;
  children: ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  id,
  activeTab,
  children,
  className = '',
}) => {
  if (id !== activeTab) return null;

  return (
    <div
      id={`tabpanel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      className={className}
    >
      {children}
    </div>
  );
};

// ============================================================================
// TAB GROUP - Combined Tabs and Panels
// ============================================================================

export interface TabGroupItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  badge?: number | string;
  disabled?: boolean;
  content: ReactNode;
}

export interface TabGroupProps {
  items: TabGroupItem[];
  defaultTab?: string;
  variant?: 'line' | 'pills' | 'enclosed';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  panelClassName?: string;
}

export const TabGroup: React.FC<TabGroupProps> = ({
  items,
  defaultTab,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  className = '',
  panelClassName = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id || '');

  const tabs: Tab[] = items.map(item => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
    badge: item.badge,
    disabled: item.disabled,
  }));

  return (
    <div className={className}>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
      />
      <div className={`mt-4 ${panelClassName}`}>
        {items.map(item => (
          <TabPanel key={item.id} id={item.id} activeTab={activeTab}>
            {item.content}
          </TabPanel>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// STEPS/STEPPER COMPONENT
// ============================================================================

export interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
}

export type StepStatus = 'complete' | 'current' | 'upcoming';

export interface StepperProps {
  steps: Step[];
  currentStep: string;
  onStepClick?: (stepId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  className = '',
}) => {
  const getStepStatus = (stepId: string, index: number): StepStatus => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (index < currentIndex) return 'complete';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const statusStyles: Record<StepStatus, { circle: string; text: string; line: string }> = {
    complete: {
      circle: 'bg-blue-600 text-white',
      text: 'text-gray-900',
      line: 'bg-blue-600',
    },
    current: {
      circle: 'border-2 border-blue-600 text-blue-600 bg-white',
      text: 'text-blue-600',
      line: 'bg-gray-200',
    },
    upcoming: {
      circle: 'border-2 border-gray-300 text-gray-400 bg-white',
      text: 'text-gray-500',
      line: 'bg-gray-200',
    },
  };

  if (orientation === 'vertical') {
    return (
      <nav className={className}>
        <ol className="relative">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id, index);
            const styles = statusStyles[status];
            const isLast = index === steps.length - 1;

            return (
              <li key={step.id} className={`flex gap-4 ${!isLast ? 'pb-8' : ''}`}>
                {/* Line */}
                {!isLast && (
                  <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" style={{ height: 'calc(100% - 2rem)' }} />
                )}

                {/* Circle */}
                <button
                  onClick={() => onStepClick?.(step.id)}
                  disabled={!onStepClick}
                  className={`
                    relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    ${styles.circle}
                    ${onStepClick ? 'cursor-pointer' : ''}
                  `}
                >
                  {status === 'complete' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : step.icon || (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </button>

                {/* Content */}
                <div className="pt-1">
                  <p className={`text-sm font-medium ${styles.text}`}>{step.label}</p>
                  {step.description && (
                    <p className="text-sm text-gray-500 mt-0.5">{step.description}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  return (
    <nav className={className}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id, index);
          const styles = statusStyles[status];
          const isLast = index === steps.length - 1;

          return (
            <li key={step.id} className={`flex items-center ${!isLast ? 'flex-1' : ''}`}>
              <button
                onClick={() => onStepClick?.(step.id)}
                disabled={!onStepClick}
                className={`
                  flex flex-col items-center
                  ${onStepClick ? 'cursor-pointer' : ''}
                `}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${styles.circle}`}>
                  {status === 'complete' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : step.icon || (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <span className={`mt-2 text-sm font-medium ${styles.text}`}>{step.label}</span>
              </button>

              {!isLast && (
                <div className={`flex-1 h-0.5 mx-4 ${styles.line}`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
