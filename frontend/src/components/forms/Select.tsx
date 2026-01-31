'use client';

import React, { forwardRef, SelectHTMLAttributes, InputHTMLAttributes, ReactNode, useState, useRef, useEffect } from 'react';

// ============================================================================
// SELECT COMPONENT - Dropdown select input
// ============================================================================

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  inputSize?: 'sm' | 'md' | 'lg';
  isRequired?: boolean;
}

const selectSizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  hint,
  options,
  placeholder,
  inputSize = 'md',
  isRequired = false,
  className = '',
  id,
  disabled,
  ...props
}, ref) => {
  const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

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

      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`
            w-full appearance-none border rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
            pr-10
            ${selectSizeStyles[inputSize]}
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
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

Select.displayName = 'Select';

// ============================================================================
// CHECKBOX COMPONENT
// ============================================================================

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  description?: string;
  error?: string;
  checkboxSize?: 'sm' | 'md' | 'lg';
}

const checkboxSizeStyles: Record<string, { box: string; label: string }> = {
  sm: { box: 'w-4 h-4', label: 'text-sm' },
  md: { box: 'w-5 h-5', label: 'text-sm' },
  lg: { box: 'w-6 h-6', label: 'text-base' },
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  description,
  error,
  checkboxSize = 'md',
  className = '',
  id,
  disabled,
  ...props
}, ref) => {
  const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  const sizes = checkboxSizeStyles[checkboxSize];

  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          disabled={disabled}
          className={`
            ${sizes.box}
            rounded border-gray-300 text-blue-600
            focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={description ? `${inputId}-description` : undefined}
          {...props}
        />
      </div>

      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label
              htmlFor={inputId}
              className={`font-medium text-gray-700 cursor-pointer ${sizes.label} ${disabled ? 'opacity-50' : ''}`}
            >
              {label}
            </label>
          )}
          {description && (
            <p id={`${inputId}-description`} className="text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="ml-3 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

// ============================================================================
// RADIO COMPONENT
// ============================================================================

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  description?: string;
  radioSize?: 'sm' | 'md' | 'lg';
}

const radioSizeStyles: Record<string, { box: string; label: string }> = {
  sm: { box: 'w-4 h-4', label: 'text-sm' },
  md: { box: 'w-5 h-5', label: 'text-sm' },
  lg: { box: 'w-6 h-6', label: 'text-base' },
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  label,
  description,
  radioSize = 'md',
  className = '',
  id,
  disabled,
  ...props
}, ref) => {
  const inputId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;
  const sizes = radioSizeStyles[radioSize];

  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          type="radio"
          id={inputId}
          disabled={disabled}
          className={`
            ${sizes.box}
            border-gray-300 text-blue-600
            focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
          `}
          {...props}
        />
      </div>

      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label
              htmlFor={inputId}
              className={`font-medium text-gray-700 cursor-pointer ${sizes.label} ${disabled ? 'opacity-50' : ''}`}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

// ============================================================================
// RADIO GROUP COMPONENT
// ============================================================================

export interface RadioGroupOption {
  value: string;
  label: ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: RadioGroupOption[];
  label?: string;
  error?: string;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options,
  label,
  error,
  orientation = 'vertical',
  className = '',
}) => {
  return (
    <fieldset className={className}>
      {label && (
        <legend className="text-sm font-medium text-gray-700 mb-3">{label}</legend>
      )}
      
      <div className={`${orientation === 'horizontal' ? 'flex gap-6' : 'space-y-3'}`}>
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange?.(option.value)}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
          />
        ))}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </fieldset>
  );
};

// ============================================================================
// TOGGLE/SWITCH COMPONENT
// ============================================================================

export interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const toggleSizeStyles: Record<string, { track: string; thumb: string; translate: string }> = {
  sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
  md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
  lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
};

export const Toggle: React.FC<ToggleProps> = ({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const sizes = toggleSizeStyles[size];

  return (
    <div className={`flex items-start ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={`
          relative inline-flex flex-shrink-0 cursor-pointer rounded-full
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${sizes.track}
          ${checked ? 'bg-blue-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block rounded-full bg-white shadow transform
            transition duration-200 ease-in-out
            ${sizes.thumb}
            ${checked ? sizes.translate : 'translate-x-0.5'}
            mt-0.5 ml-0.5
          `}
        />
      </button>

      {(label || description) && (
        <div className="ml-3">
          {label && (
            <span className={`text-sm font-medium text-gray-700 ${disabled ? 'opacity-50' : ''}`}>
              {label}
            </span>
          )}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMBOBOX/AUTOCOMPLETE COMPONENT
// ============================================================================

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  onInputChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  onInputChange,
  label,
  placeholder = 'Vyberte...',
  error,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    if (selectedOption) {
      setInputValue(selectedOption.label);
    }
  }, [selectedOption]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onInputChange?.(newValue);
    setIsOpen(true);
  };

  const handleSelect = (option: ComboboxOption) => {
    setInputValue(option.label);
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-2 pr-10 border rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              className={`
                w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors
                ${option.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;
