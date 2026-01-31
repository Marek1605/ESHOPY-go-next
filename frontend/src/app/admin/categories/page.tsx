'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
// Types defined locally below

// Types
interface CategoryAttribute {
  id: string;
  name: string;
  type: "text" | "number" | "select" | "boolean";
  required: boolean;
  options?: string[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  image?: string;
  icon?: string;
  isActive: boolean;
  order?: number;
  sortOrder?: number;
  productCount?: number;
  level?: number;
  path?: string[];
  metaTitle?: string;
  metaDescription?: string;
  attributes?: CategoryAttribute[];
  children?: Category[];
  createdAt?: string;
  updatedAt?: string;
}
  updatedAt?: string;
}

interface CategoryTreeNode extends Category {
  level: number;
  children: CategoryTreeNode[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════════

const Icons = {
  folder: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  folderOpen: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  chevronDown: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  plus: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  edit: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  trash: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  search: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  x: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  upload: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  download: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  eye: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  eyeOff: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ),
  image: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  drag: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
    </svg>
  ),
  save: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  ),
  settings: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  link: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  copy: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  move: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    </svg>
  ),
  refresh: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Elektronika',
    slug: 'elektronika',
    description: 'Všetka elektronika a spotrebiče',
    parentId: null,
    image: '/images/categories/elektronika.jpg',
    icon: '📱',
    isActive: true,
    order: 1,
    productCount: 15420,
    level: 0,
    path: ['1'],
    metaTitle: 'Elektronika | ESHOPY',
    metaDescription: 'Nakúpte elektroniku za najlepšie ceny',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Mobilné telefóny',
    slug: 'mobilne-telefony',
    description: 'Smartfóny a mobilné telefóny',
    parentId: '1',
    image: '/images/categories/mobily.jpg',
    icon: '📱',
    isActive: true,
    order: 1,
    productCount: 3250,
    level: 1,
    path: ['1', '2'],
    metaTitle: 'Mobilné telefóny | ESHOPY',
    metaDescription: 'Najlepšie mobilné telefóny',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-15T10:30:00Z',
  },
  {
    id: '3',
    name: 'Samsung',
    slug: 'samsung',
    description: 'Mobilné telefóny Samsung',
    parentId: '2',
    image: '/images/categories/samsung.jpg',
    icon: '',
    isActive: true,
    order: 1,
    productCount: 450,
    level: 2,
    path: ['1', '2', '3'],
    metaTitle: 'Samsung telefóny | ESHOPY',
    metaDescription: 'Samsung Galaxy telefóny',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-15T10:30:00Z',
  },
  {
    id: '4',
    name: 'Apple iPhone',
    slug: 'apple-iphone',
    description: 'Apple iPhone smartfóny',
    parentId: '2',
    image: '/images/categories/iphone.jpg',
    icon: '',
    isActive: true,
    order: 2,
    productCount: 380,
    level: 2,
    path: ['1', '2', '4'],
    metaTitle: 'Apple iPhone | ESHOPY',
    metaDescription: 'Apple iPhone telefóny',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-15T10:30:00Z',
  },
  {
    id: '5',
    name: 'Xiaomi',
    slug: 'xiaomi',
    description: 'Mobilné telefóny Xiaomi',
    parentId: '2',
    image: '/images/categories/xiaomi.jpg',
    icon: '',
    isActive: false,
    order: 3,
    productCount: 220,
    level: 2,
    path: ['1', '2', '5'],
    metaTitle: 'Xiaomi telefóny | ESHOPY',
    metaDescription: 'Xiaomi telefóny',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-15T10:30:00Z',
  },
  {
    id: '6',
    name: 'Notebooky',
    slug: 'notebooky',
    description: 'Laptopy a notebooky',
    parentId: '1',
    image: '/images/categories/notebooky.jpg',
    icon: '💻',
    isActive: true,
    order: 2,
    productCount: 2840,
    level: 1,
    path: ['1', '6'],
    metaTitle: 'Notebooky | ESHOPY',
    metaDescription: 'Notebooky za najlepšie ceny',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-15T10:30:00Z',
  },
  {
    id: '7',
    name: 'Gaming notebooky',
    slug: 'gaming-notebooky',
    description: 'Herné notebooky',
    parentId: '6',
    image: '/images/categories/gaming.jpg',
    icon: '🎮',
    isActive: true,
    order: 1,
    productCount: 580,
    level: 2,
    path: ['1', '6', '7'],
    metaTitle: 'Gaming notebooky | ESHOPY',
    metaDescription: 'Herné notebooky',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-15T10:30:00Z',
  },
  {
    id: '8',
    name: 'Televízory',
    slug: 'televizory',
    description: 'Smart TV a televízory',
    parentId: '1',
    image: '/images/categories/tv.jpg',
    icon: '📺',
    isActive: true,
    order: 3,
    productCount: 1250,
    level: 1,
    path: ['1', '8'],
    metaTitle: 'Televízory | ESHOPY',
    metaDescription: 'Smart TV televízory',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-15T10:30:00Z',
  },
  {
    id: '9',
    name: 'Domácnosť',
    slug: 'domacnost',
    description: 'Domáce spotrebiče a potreby',
    parentId: null,
    image: '/images/categories/domacnost.jpg',
    icon: '🏠',
    isActive: true,
    order: 2,
    productCount: 8750,
    level: 0,
    path: ['9'],
    metaTitle: 'Domácnosť | ESHOPY',
    metaDescription: 'Všetko pre domácnosť',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-15T10:30:00Z',
  },
  {
    id: '10',
    name: 'Kuchynské spotrebiče',
    slug: 'kuchynske-spotrebice',
    description: 'Spotrebiče do kuchyne',
    parentId: '9',
    image: '/images/categories/kuchyna.jpg',
    icon: '🍳',
    isActive: true,
    order: 1,
    productCount: 3420,
    level: 1,
    path: ['9', '10'],
    metaTitle: 'Kuchynské spotrebiče | ESHOPY',
    metaDescription: 'Spotrebiče do kuchyne',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-15T10:30:00Z',
  },
  {
    id: '11',
    name: 'Šport a outdoor',
    slug: 'sport-outdoor',
    description: 'Športové potreby a outdoor',
    parentId: null,
    image: '/images/categories/sport.jpg',
    icon: '⚽',
    isActive: true,
    order: 3,
    productCount: 5230,
    level: 0,
    path: ['11'],
    metaTitle: 'Šport a outdoor | ESHOPY',
    metaDescription: 'Športové potreby',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-15T10:30:00Z',
  },
  {
    id: '12',
    name: 'Fitness',
    slug: 'fitness',
    description: 'Fitness vybavenie',
    parentId: '11',
    image: '/images/categories/fitness.jpg',
    icon: '💪',
    isActive: true,
    order: 1,
    productCount: 1850,
    level: 1,
    path: ['11', '12'],
    metaTitle: 'Fitness | ESHOPY',
    metaDescription: 'Fitness vybavenie',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-15T10:30:00Z',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
  const categoryMap = new Map<string, CategoryTreeNode>();
  const roots: CategoryTreeNode[] = [];

  // Create nodes
  categories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  // Build tree
  categories.forEach(cat => {
    const node = categoryMap.get(cat.id)!;
    if (cat.parentId && categoryMap.has(cat.parentId)) {
      categoryMap.get(cat.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  // Sort children by order
  const sortChildren = (nodes: CategoryTreeNode[]) => {
    nodes.sort((a, b) => a.order - b.order);
    nodes.forEach(node => sortChildren(node.children));
  };
  sortChildren(roots);

  return roots;
}

function getCategoryPath(categories: Category[], categoryId: string): Category[] {
  const path: Category[] = [];
  let current = categories.find(c => c.id === categoryId);
  while (current) {
    path.unshift(current);
    current = categories.find(c => c.id === current?.parentId);
  }
  return path;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY TREE ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface CategoryTreeItemProps {
  node: CategoryTreeNode;
  level: number;
  expanded: Set<string>;
  selected: string | null;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onAddChild: (parentId: string) => void;
  onToggleActive: (category: Category) => void;
  draggedId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDragOver: (id: string) => void;
  onDrop: (targetId: string) => void;
}

function CategoryTreeItem({
  node,
  level,
  expanded,
  selected,
  onToggle,
  onSelect,
  onEdit,
  onDelete,
  onAddChild,
  onToggleActive,
  draggedId,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: CategoryTreeItemProps) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expanded.has(node.id);
  const isSelected = selected === node.id;
  const isDragging = draggedId === node.id;
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div className={`${isDragging ? 'opacity-50' : ''}`}>
      <div
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all
          ${isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}
          ${isDragOver ? 'bg-blue-100 border-blue-300' : ''}
          ${!node.isActive ? 'opacity-60' : ''}
        `}
        style={{ paddingLeft: `${level * 24 + 12}px` }}
        onClick={() => onSelect(node.id)}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', node.id);
          onDragStart(node.id);
        }}
        onDragEnd={onDragEnd}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
          onDragOver(node.id);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          onDrop(node.id);
        }}
      >
        {/* Drag handle */}
        <span className="text-gray-400 cursor-grab hover:text-gray-600">
          {Icons.drag}
        </span>

        {/* Expand/collapse */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) onToggle(node.id);
          }}
          className={`p-1 rounded hover:bg-gray-200 transition-transform ${isExpanded ? 'rotate-90' : ''} ${!hasChildren ? 'invisible' : ''}`}
        >
          {Icons.chevronRight}
        </button>

        {/* Icon */}
        <span className="text-gray-500">
          {hasChildren ? (isExpanded ? Icons.folderOpen : Icons.folder) : Icons.folder}
        </span>

        {/* Category icon/emoji */}
        {node.icon && <span className="text-lg">{node.icon}</span>}

        {/* Name */}
        <span className={`flex-1 font-medium ${!node.isActive ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {node.name}
        </span>

        {/* Product count */}
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {node.productCount.toLocaleString()}
        </span>

        {/* Status badge */}
        {!node.isActive && (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
            Neaktívna
          </span>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleActive(node);
            }}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-500"
            title={node.isActive ? 'Deaktivovať' : 'Aktivovať'}
          >
            {node.isActive ? Icons.eye : Icons.eyeOff}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddChild(node.id);
            }}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-500"
            title="Pridať podkategóriu"
          >
            {Icons.plus}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(node);
            }}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-500"
            title="Upraviť"
          >
            {Icons.edit}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node);
            }}
            className="p-1.5 rounded hover:bg-red-100 text-gray-500 hover:text-red-600"
            title="Vymazať"
          >
            {Icons.trash}
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children.map(child => (
            <CategoryTreeItem
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              selected={selected}
              onToggle={onToggle}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              onToggleActive={onToggleActive}
              draggedId={draggedId}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY FORM MODAL
// ═══════════════════════════════════════════════════════════════════════════════

interface CategoryFormProps {
  category: Partial<Category> | null;
  parentId: string | null;
  categories: Category[];
  onSave: (category: Partial<Category>) => void;
  onClose: () => void;
}

function CategoryForm({ category, parentId, categories, onSave, onClose }: CategoryFormProps) {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    parentId: parentId,
    icon: '',
    image: '',
    isActive: true,
    metaTitle: '',
    metaDescription: '',
    ...category,
  });

  const [autoSlug, setAutoSlug] = useState(!category?.id);

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: autoSlug ? slugify(name) : prev.slug,
      metaTitle: !prev.metaTitle ? `${name} | ESHOPY` : prev.metaTitle,
    }));
  };

  const parentPath = formData.parentId
    ? getCategoryPath(categories, formData.parentId).map(c => c.name).join(' > ')
    : 'Koreňová kategória';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {category?.id ? 'Upraviť kategóriu' : 'Nová kategória'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            {Icons.x}
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Parent info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <span className="font-medium">Nadradená kategória:</span>
                <span>{parentPath}</span>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Názov kategórie *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="napr. Mobilné telefóny"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL slug *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setFormData(prev => ({ ...prev, slug: e.target.value }));
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="mobilne-telefony"
                />
                <button
                  onClick={() => {
                    setAutoSlug(true);
                    setFormData(prev => ({ ...prev, slug: slugify(prev.name || '') }));
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Generovať
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                URL: /kategoria/{formData.slug || 'slug'}
              </p>
            </div>

            {/* Icon & Image row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emoji ikona
                </label>
                <input
                  type="text"
                  value={formData.icon || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="📱"
                  maxLength={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL obrázka
                </label>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="/images/category.jpg"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Popis kategórie
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Krátky popis kategórie..."
              />
            </div>

            {/* SEO section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">SEO nastavenia</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Názov pre vyhľadávače"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(formData.metaTitle || '').length}/60 znakov
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta description
                  </label>
                  <textarea
                    value={formData.metaDescription || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Popis pre vyhľadávače"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(formData.metaDescription || '').length}/160 znakov
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <div>
                <span className="font-medium text-gray-800">Aktívna kategória</span>
                <p className="text-xs text-gray-500">Neaktívne kategórie nie sú viditeľné na webe</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Zrušiť
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {Icons.save}
            {category?.id ? 'Uložiť zmeny' : 'Vytvoriť kategóriu'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DELETE CONFIRMATION MODAL
// ═══════════════════════════════════════════════════════════════════════════════

interface DeleteConfirmProps {
  category: Category;
  childCount: number;
  onConfirm: () => void;
  onClose: () => void;
}

function DeleteConfirm({ category, childCount, onConfirm, onClose }: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600">{Icons.trash}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
            Vymazať kategóriu?
          </h3>
          <p className="text-gray-600 text-center mb-4">
            Naozaj chcete vymazať kategóriu <strong>"{category.name}"</strong>?
          </p>
          {childCount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 text-sm">
                ⚠️ Táto kategória obsahuje <strong>{childCount}</strong> podkategórií, 
                ktoré budú tiež vymazané!
              </p>
            </div>
          )}
          {category.productCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-700 text-sm">
                ⚠️ V tejto kategórii je <strong>{category.productCount.toLocaleString()}</strong> produktov.
                Produkty nebudú vymazané, ale stratia priradenie ku kategórii.
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Zrušiť
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Vymazať
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY DETAIL PANEL
// ═══════════════════════════════════════════════════════════════════════════════

interface CategoryDetailProps {
  category: Category;
  categories: Category[];
  onEdit: () => void;
  onClose: () => void;
}

function CategoryDetail({ category, categories, onEdit, onClose }: CategoryDetailProps) {
  const path = getCategoryPath(categories, category.id);
  
  return (
    <div className="bg-white border-l h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Detail kategórie</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          {Icons.x}
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Image */}
        {category.image ? (
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
            {Icons.image}
            <span className="ml-2">Bez obrázka</span>
          </div>
        )}

        {/* Name & Icon */}
        <div className="flex items-center gap-3">
          {category.icon && <span className="text-4xl">{category.icon}</span>}
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{category.name}</h3>
            <p className="text-gray-500">/{category.slug}</p>
          </div>
        </div>

        {/* Status */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
          category.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {category.isActive ? Icons.eye : Icons.eyeOff}
          {category.isActive ? 'Aktívna' : 'Neaktívna'}
        </div>

        {/* Path */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Cesta</h4>
          <div className="flex flex-wrap items-center gap-1 text-sm">
            {path.map((cat, index) => (
              <React.Fragment key={cat.id}>
                {index > 0 && <span className="text-gray-400">/</span>}
                <span className={cat.id === category.id ? 'font-medium text-blue-600' : 'text-gray-600'}>
                  {cat.name}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Description */}
        {category.description && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Popis</h4>
            <p className="text-gray-600">{category.description}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-700">{category.productCount.toLocaleString()}</div>
            <div className="text-sm text-blue-600">Produktov</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-gray-700">{category.level}</div>
            <div className="text-sm text-gray-600">Úroveň</div>
          </div>
        </div>

        {/* SEO */}
        <div className="border-t pt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">SEO</h4>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-gray-500">Meta title</span>
              <p className="text-gray-800">{category.metaTitle || '-'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Meta description</span>
              <p className="text-gray-800">{category.metaDescription || '-'}</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="border-t pt-6 text-sm text-gray-500">
          <div className="flex justify-between mb-2">
            <span>Vytvorené:</span>
            <span>{new Date(category.createdAt).toLocaleString('sk-SK')}</span>
          </div>
          <div className="flex justify-between">
            <span>Upravené:</span>
            <span>{new Date(category.updatedAt).toLocaleString('sk-SK')}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t pt-6 flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            {Icons.edit}
            Upraviť
          </button>
          <button className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            {Icons.link}
          </button>
          <button className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            {Icons.copy}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function AdminCategoriesPage() {
  // State
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['1', '2', '6', '9', '11']));
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [addingToParent, setAddingToParent] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Build tree
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);

  // Filter categories
  const filteredTree = useMemo(() => {
    if (!search) return tree;
    
    const searchLower = search.toLowerCase();
    const matchingIds = new Set<string>();
    
    // Find matching categories and their ancestors
    categories.forEach(cat => {
      if (cat.name.toLowerCase().includes(searchLower) || cat.slug.includes(searchLower)) {
        matchingIds.add(cat.id);
        // Add all ancestors
        cat.path.forEach(id => matchingIds.add(id));
      }
    });

    // Filter tree
    const filterNodes = (nodes: CategoryTreeNode[]): CategoryTreeNode[] => {
      return nodes
        .filter(node => matchingIds.has(node.id))
        .map(node => ({
          ...node,
          children: filterNodes(node.children),
        }));
    };

    return filterNodes(tree);
  }, [tree, search, categories]);

  // Selected category
  const selectedCategory = useMemo(
    () => categories.find(c => c.id === selected) || null,
    [categories, selected]
  );

  // Count children for delete warning
  const countDescendants = useCallback((categoryId: string): number => {
    let count = 0;
    const countChildren = (id: string) => {
      categories.forEach(cat => {
        if (cat.parentId === id) {
          count++;
          countChildren(cat.id);
        }
      });
    };
    countChildren(categoryId);
    return count;
  }, [categories]);

  // Handlers
  const handleToggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpanded(new Set(categories.map(c => c.id)));
  };

  const handleCollapseAll = () => {
    setExpanded(new Set());
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setAddingToParent(null);
    setShowForm(true);
  };

  const handleAddChild = (parentId: string) => {
    setEditingCategory(null);
    setAddingToParent(parentId);
    setShowForm(true);
  };

  const handleAddRoot = () => {
    setEditingCategory(null);
    setAddingToParent(null);
    setShowForm(true);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
  };

  const handleConfirmDelete = () => {
    if (!deletingCategory) return;
    
    // Delete category and all descendants
    const idsToDelete = new Set<string>();
    const collectIds = (id: string) => {
      idsToDelete.add(id);
      categories.forEach(cat => {
        if (cat.parentId === id) {
          collectIds(cat.id);
        }
      });
    };
    collectIds(deletingCategory.id);

    setCategories(prev => prev.filter(c => !idsToDelete.has(c.id)));
    setDeletingCategory(null);
    if (selected && idsToDelete.has(selected)) {
      setSelected(null);
    }
  };

  const handleToggleActive = (category: Category) => {
    setCategories(prev => prev.map(c => 
      c.id === category.id ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const handleSave = (formData: Partial<Category>) => {
    if (editingCategory) {
      // Update existing
      setCategories(prev => prev.map(c =>
        c.id === editingCategory.id
          ? { ...c, ...formData, updatedAt: new Date().toISOString() }
          : c
      ));
    } else {
      // Create new
      const newId = `${Date.now()}`;
      const parent = addingToParent ? categories.find(c => c.id === addingToParent) : null;
      const level = parent ? parent.level + 1 : 0;
      const path = parent ? [...parent.path, newId] : [newId];
      
      const newCategory: Category = {
        id: newId,
        name: formData.name || 'Nová kategória',
        slug: formData.slug || slugify(formData.name || 'nova-kategoria'),
        description: formData.description || '',
        parentId: addingToParent,
        image: formData.image || '',
        icon: formData.icon || '',
        isActive: formData.isActive ?? true,
        order: categories.filter(c => c.parentId === addingToParent).length + 1,
        productCount: 0,
        level,
        path,
        metaTitle: formData.metaTitle || '',
        metaDescription: formData.metaDescription || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setCategories(prev => [...prev, newCategory]);
      
      // Expand parent if adding child
      if (addingToParent) {
        setExpanded(prev => new Set([...prev, addingToParent]));
      }
    }
    
    setShowForm(false);
    setEditingCategory(null);
    setAddingToParent(null);
  };

  // Drag & drop handlers
  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;

    // Don't allow dropping on descendant
    const target = categories.find(c => c.id === targetId);
    if (target?.path.includes(draggedId)) return;

    // Move category
    setCategories(prev => {
      const dragged = prev.find(c => c.id === draggedId);
      if (!dragged) return prev;

      // Update parent and recalculate path/level
      const newParent = prev.find(c => c.id === targetId);
      const newLevel = newParent ? newParent.level + 1 : 0;
      const newPath = newParent ? [...newParent.path, draggedId] : [draggedId];

      return prev.map(c => {
        if (c.id === draggedId) {
          return {
            ...c,
            parentId: targetId,
            level: newLevel,
            path: newPath,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      });
    });

    setDraggedId(null);
    setDragOverId(null);
  };

  // Stats
  const stats = useMemo(() => ({
    total: categories.length,
    active: categories.filter(c => c.isActive).length,
    root: categories.filter(c => !c.parentId).length,
    products: categories.reduce((sum, c) => sum + c.productCount, 0),
  }), [categories]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Správa kategórií</h1>
              <p className="text-gray-500 text-sm">Organizujte produktové kategórie pomocou drag & drop</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-medium">
                {Icons.upload}
                Import
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-medium">
                {Icons.download}
                Export
              </button>
              <button
                onClick={handleAddRoot}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
              >
                {Icons.plus}
                Nová kategória
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Celkom:</span>
              <span className="font-semibold text-gray-800">{stats.total}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Aktívne:</span>
              <span className="font-semibold text-green-600">{stats.active}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Hlavné:</span>
              <span className="font-semibold text-gray-800">{stats.root}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Produkty:</span>
              <span className="font-semibold text-blue-600">{stats.products.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Tree panel */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="px-6 py-3 border-b bg-white flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {Icons.search}
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Hľadať kategórie..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {Icons.x}
                </button>
              )}
            </div>

            {/* Tree controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExpandAll}
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Rozbaliť všetko
              </button>
              <button
                onClick={handleCollapseAll}
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Zbaliť všetko
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                {Icons.refresh}
              </button>
            </div>
          </div>

          {/* Tree */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredTree.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {search ? (
                  <>
                    <p className="mb-2">Žiadne kategórie nevyhovujú vyhľadávaniu</p>
                    <button
                      onClick={() => setSearch('')}
                      className="text-blue-600 hover:underline"
                    >
                      Vymazať vyhľadávanie
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mb-4">Zatiaľ nemáte žiadne kategórie</p>
                    <button
                      onClick={handleAddRoot}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Vytvoriť prvú kategóriu
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredTree.map(node => (
                  <CategoryTreeItem
                    key={node.id}
                    node={node}
                    level={0}
                    expanded={expanded}
                    selected={selected}
                    onToggle={handleToggle}
                    onSelect={setSelected}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddChild={handleAddChild}
                    onToggleActive={handleToggleActive}
                    draggedId={draggedId}
                    onDragStart={setDraggedId}
                    onDragEnd={() => setDraggedId(null)}
                    onDragOver={setDragOverId}
                    onDrop={handleDrop}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selectedCategory && (
          <div className="w-96 border-l">
            <CategoryDetail
              category={selectedCategory}
              categories={categories}
              onEdit={() => handleEdit(selectedCategory)}
              onClose={() => setSelected(null)}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          parentId={addingToParent}
          categories={categories}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingCategory(null);
            setAddingToParent(null);
          }}
        />
      )}

      {deletingCategory && (
        <DeleteConfirm
          category={deletingCategory}
          childCount={countDescendants(deletingCategory.id)}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingCategory(null)}
        />
      )}
    </div>
  );
}
