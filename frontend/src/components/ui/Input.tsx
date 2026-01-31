'use client';

import React, { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

// ============================================================================
// INPUT COMPONENT - Text input with label and error states
// ============================================================================

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  inputSize?: InputSize;
  isRequired?: boolean;
}

const inputSizeStyles: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

const iconContainerSizes: Record<InputSize, string> = {
  sm: 'pl-8',
  md: 'pl-10',
  lg: 'pl-12',
};

const iconSizes: Record<InputSize, string> = {
  sm: 'w-4 h-4 left-2.5',
  md: 'w-4 h-4 left-3',
  lg: 'w-5 h-5 left-4',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  leftAddon,
  rightAddon,
  inputSize = 'md',
  isRequired = false,
  className = '',
  id,
  disabled,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative flex">
        {leftAddon && (
          <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            {leftAddon}
          </span>
        )}

        <div className="relative flex-1">
          {leftIcon && (
            <span className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${iconSizes[inputSize]}`}>
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`
              w-full border rounded-lg transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
              ${inputSizeStyles[inputSize]}
              ${leftIcon ? iconContainerSizes[inputSize] : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${leftAddon ? 'rounded-l-none' : ''}
              ${rightAddon ? 'rounded-r-none' : ''}
              ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
              ${className}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </span>
          )}
        </div>

        {rightAddon && (
          <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            {rightAddon}
          </span>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}

      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1 text-sm text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// ============================================================================
// TEXTAREA COMPONENT - Multi-line text input
// ============================================================================

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  hint,
  isRequired = false,
  resize = 'vertical',
  className = '',
  id,
  disabled,
  rows = 4,
  ...props
}, ref) => {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const resizeStyles: Record<string, string> = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        disabled={disabled}
        rows={rows}
        className={`
          w-full px-4 py-2 border rounded-lg transition-all duration-200 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
          ${resizeStyles[resize]}
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
          ${className}
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />

      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}

      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1 text-sm text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// ============================================================================
// SEARCH INPUT - Input with search icon and clear button
// ============================================================================

export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({
  onClear,
  value,
  ...props
}, ref) => {
  return (
    <Input
      ref={ref}
      value={value}
      leftIcon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      rightIcon={
        value && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Vymazať"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : undefined
      }
      {...props}
    />
  );
});

SearchInput.displayName = 'SearchInput';

export default Input;
