'use client';

import React, { ReactNode, useState, useMemo } from 'react';

// ============================================================================
// TABLE COMPONENT - Data table with sorting and selection
// ============================================================================

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedKeys?: (string | number)[];
  onSelectionChange?: (keys: (string | number)[]) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  emptyState?: ReactNode;
  loading?: boolean;
  className?: string;
  stickyHeader?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  sortColumn,
  sortDirection,
  onSort,
  emptyState,
  loading = false,
  className = '',
  stickyHeader = false,
  striped = false,
  hoverable = true,
  compact = false,
}: TableProps<T>) {
  const allSelected = data.length > 0 && data.every(row => selectedKeys.includes(keyExtractor(row)));
  const someSelected = selectedKeys.length > 0 && !allSelected;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.(data.map(keyExtractor));
    }
  };

  const handleSelectRow = (row: T, e: React.MouseEvent) => {
    e.stopPropagation();
    const key = keyExtractor(row);
    if (selectedKeys.includes(key)) {
      onSelectionChange?.(selectedKeys.filter(k => k !== key));
    } else {
      onSelectionChange?.([...selectedKeys, key]);
    }
  };

  const alignStyles: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const cellPadding = compact ? 'px-3 py-2' : 'px-4 py-3';

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-100 border-b border-gray-200" />
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 border-b border-gray-100 flex items-center px-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        {emptyState || (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium">Žiadne údaje</p>
            <p className="text-xs mt-1">Tabuľka je prázdna</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`bg-gray-50 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
            <tr>
              {selectable && (
                <th className={`${cellPadding} w-10`}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    ${cellPadding} text-xs font-semibold text-gray-600 uppercase tracking-wider
                    ${alignStyles[column.align || 'left']}
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''}
                    ${column.className || ''}
                  `}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && onSort?.(column.key)}
                >
                  <div className={`flex items-center gap-1 ${column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : ''}`}>
                    {column.header}
                    {column.sortable && sortColumn === column.key && (
                      <svg 
                        className={`w-4 h-4 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => {
              const key = keyExtractor(row);
              const isSelected = selectedKeys.includes(key);
              
              return (
                <tr
                  key={key}
                  className={`
                    ${striped && index % 2 === 1 ? 'bg-gray-50' : ''}
                    ${hoverable ? 'hover:bg-gray-50' : ''}
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${isSelected ? 'bg-blue-50' : ''}
                    transition-colors
                  `}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className={`${cellPadding} w-10`}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        onClick={(e) => handleSelectRow(row, e)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`
                        ${cellPadding} text-sm text-gray-900
                        ${alignStyles[column.align || 'left']}
                        ${column.className || ''}
                      `}
                    >
                      {column.cell(row, index)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// SIMPLE TABLE - Basic table without advanced features
// ============================================================================

export interface SimpleTableProps {
  headers: ReactNode[];
  rows: ReactNode[][];
  className?: string;
  striped?: boolean;
}

export const SimpleTable: React.FC<SimpleTableProps> = ({
  headers,
  rows,
  className = '',
  striped = false,
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-sm text-gray-900">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================================================
// DATA LIST - Alternative to table for mobile-friendly display
// ============================================================================

export interface DataListItem {
  label: string;
  value: ReactNode;
}

export interface DataListProps {
  items: DataListItem[];
  className?: string;
  columns?: 1 | 2 | 3;
}

export const DataList: React.FC<DataListProps> = ({
  items,
  className = '',
  columns = 1,
}) => {
  const colStyles: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <dl className={`grid gap-4 ${colStyles[columns]} ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="bg-gray-50 rounded-lg px-4 py-3">
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {item.label}
          </dt>
          <dd className="mt-1 text-sm text-gray-900">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
};

// ============================================================================
// KEY-VALUE LIST - Simple key-value display
// ============================================================================

export interface KeyValueListProps {
  items: { key: string; value: ReactNode }[];
  className?: string;
  separator?: boolean;
}

export const KeyValueList: React.FC<KeyValueListProps> = ({
  items,
  className = '',
  separator = true,
}) => {
  return (
    <dl className={`${separator ? 'divide-y divide-gray-200' : 'space-y-3'} ${className}`}>
      {items.map((item, index) => (
        <div key={index} className={`flex justify-between ${separator ? 'py-3' : ''} ${index === 0 && separator ? 'pt-0' : ''}`}>
          <dt className="text-sm text-gray-500">{item.key}</dt>
          <dd className="text-sm font-medium text-gray-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
};

export default Table;
