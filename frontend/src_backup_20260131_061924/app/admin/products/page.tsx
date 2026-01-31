'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Product, Category, Vendor, StockStatus } from '@/types';

// ═══════════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════════

const Icons = {
  search: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  filter: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
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
  x: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  chevronDown: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  chevronLeft: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  eye: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  copy: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
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
  refresh: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  star: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  externalLink: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  tag: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  grid: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  list: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
  moreVertical: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  ),
  image: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  arrowUp: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ),
  arrowDown: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Samsung Galaxy S24 Ultra 256GB Titanium Black',
    slug: 'samsung-galaxy-s24-ultra-256gb-titanium-black',
    description: 'Najnovší vlajkový smartfón od Samsung s AI funkciami',
    shortDescription: 'S Pen, 200MP kamera, Snapdragon 8 Gen 3',
    sku: 'SM-S928BZKAEUE',
    ean: '8806095360751',
    brand: 'Samsung',
    categoryId: '3',
    categoryPath: ['Elektronika', 'Mobilné telefóny', 'Samsung'],
    images: [
      { id: '1', url: '/images/products/s24-ultra-1.jpg', alt: 'Samsung Galaxy S24 Ultra', isPrimary: true, order: 1 },
    ],
    price: 1399.00,
    originalPrice: 1499.00,
    currency: 'EUR',
    stockStatus: 'in_stock',
    stockQuantity: 45,
    rating: 4.8,
    reviewCount: 234,
    offerCount: 8,
    minOfferPrice: 1299.00,
    maxOfferPrice: 1499.00,
    isActive: true,
    isFeatured: true,
    isNew: true,
    attributes: [],
    metaTitle: 'Samsung Galaxy S24 Ultra | ESHOPY',
    metaDescription: 'Kúpte Samsung Galaxy S24 Ultra za najlepšiu cenu',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },
  {
    id: '2',
    name: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
    slug: 'apple-iphone-15-pro-max-256gb-natural-titanium',
    description: 'iPhone 15 Pro Max s titánovým rámom a A17 Pro čipom',
    shortDescription: 'A17 Pro, 5x zoom, USB-C, titánový rám',
    sku: 'MU773SX/A',
    ean: '194253939481',
    brand: 'Apple',
    categoryId: '4',
    categoryPath: ['Elektronika', 'Mobilné telefóny', 'Apple iPhone'],
    images: [
      { id: '2', url: '/images/products/iphone-15-pro-max.jpg', alt: 'iPhone 15 Pro Max', isPrimary: true, order: 1 },
    ],
    price: 1449.00,
    originalPrice: 1549.00,
    currency: 'EUR',
    stockStatus: 'in_stock',
    stockQuantity: 32,
    rating: 4.9,
    reviewCount: 456,
    offerCount: 12,
    minOfferPrice: 1399.00,
    maxOfferPrice: 1649.00,
    isActive: true,
    isFeatured: true,
    isNew: false,
    attributes: [],
    metaTitle: 'iPhone 15 Pro Max | ESHOPY',
    metaDescription: 'Apple iPhone 15 Pro Max za najlepšiu cenu',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-06-19T12:00:00Z',
  },
  {
    id: '3',
    name: 'ASUS ROG Strix G16 G614JV-N4035W',
    slug: 'asus-rog-strix-g16-g614jv',
    description: 'Herný notebook s Intel Core i7 a RTX 4060',
    shortDescription: 'Intel i7-13650HX, RTX 4060, 16GB RAM, 512GB SSD',
    sku: 'G614JV-N4035W',
    ean: '4711387445123',
    brand: 'ASUS',
    categoryId: '7',
    categoryPath: ['Elektronika', 'Notebooky', 'Gaming notebooky'],
    images: [
      { id: '3', url: '/images/products/asus-rog-strix.jpg', alt: 'ASUS ROG Strix', isPrimary: true, order: 1 },
    ],
    price: 1299.00,
    originalPrice: 1499.00,
    currency: 'EUR',
    stockStatus: 'in_stock',
    stockQuantity: 18,
    rating: 4.7,
    reviewCount: 89,
    offerCount: 5,
    minOfferPrice: 1249.00,
    maxOfferPrice: 1399.00,
    isActive: true,
    isFeatured: false,
    isNew: true,
    attributes: [],
    metaTitle: 'ASUS ROG Strix G16 | ESHOPY',
    metaDescription: 'Herný notebook ASUS ROG Strix G16',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-06-18T16:00:00Z',
  },
  {
    id: '4',
    name: 'LG OLED55C3 55" 4K OLED TV',
    slug: 'lg-oled55c3-55-4k-oled-tv',
    description: 'Prémiový OLED televízor s webOS a Dolby Vision',
    shortDescription: '55", 4K, OLED, webOS 23, Dolby Vision/Atmos',
    sku: 'OLED55C36LA',
    ean: '8806091832456',
    brand: 'LG',
    categoryId: '8',
    categoryPath: ['Elektronika', 'Televízory'],
    images: [
      { id: '4', url: '/images/products/lg-oled-c3.jpg', alt: 'LG OLED C3', isPrimary: true, order: 1 },
    ],
    price: 1199.00,
    originalPrice: 1599.00,
    currency: 'EUR',
    stockStatus: 'low_stock',
    stockQuantity: 5,
    rating: 4.9,
    reviewCount: 312,
    offerCount: 7,
    minOfferPrice: 1149.00,
    maxOfferPrice: 1399.00,
    isActive: true,
    isFeatured: true,
    isNew: false,
    attributes: [],
    metaTitle: 'LG OLED C3 55" | ESHOPY',
    metaDescription: 'LG OLED55C3 4K televízor',
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-06-20T09:00:00Z',
  },
  {
    id: '5',
    name: 'Xiaomi 14 Ultra 512GB Black',
    slug: 'xiaomi-14-ultra-512gb-black',
    description: 'Xiaomi vlajková loď s Leica optikou',
    shortDescription: 'Leica kamera, Snapdragon 8 Gen 3, 512GB',
    sku: '43089EU',
    ean: '6941812734521',
    brand: 'Xiaomi',
    categoryId: '5',
    categoryPath: ['Elektronika', 'Mobilné telefóny', 'Xiaomi'],
    images: [
      { id: '5', url: '/images/products/xiaomi-14-ultra.jpg', alt: 'Xiaomi 14 Ultra', isPrimary: true, order: 1 },
    ],
    price: 1199.00,
    originalPrice: 1299.00,
    currency: 'EUR',
    stockStatus: 'out_of_stock',
    stockQuantity: 0,
    rating: 4.6,
    reviewCount: 67,
    offerCount: 3,
    minOfferPrice: 1149.00,
    maxOfferPrice: 1249.00,
    isActive: false,
    isFeatured: false,
    isNew: true,
    attributes: [],
    metaTitle: 'Xiaomi 14 Ultra | ESHOPY',
    metaDescription: 'Xiaomi 14 Ultra s Leica optikou',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-06-15T11:00:00Z',
  },
  {
    id: '6',
    name: 'DeLonghi Magnifica Evo ECAM290.61.B',
    slug: 'delonghi-magnifica-evo-ecam290',
    description: 'Automatický kávovar s mlynčekom',
    shortDescription: 'Plne automatický, 1450W, 15 bar',
    sku: 'ECAM290.61.B',
    ean: '8004399026889',
    brand: 'DeLonghi',
    categoryId: '10',
    categoryPath: ['Domácnosť', 'Kuchynské spotrebiče'],
    images: [
      { id: '6', url: '/images/products/delonghi-magnifica.jpg', alt: 'DeLonghi Magnifica', isPrimary: true, order: 1 },
    ],
    price: 449.00,
    originalPrice: 549.00,
    currency: 'EUR',
    stockStatus: 'in_stock',
    stockQuantity: 24,
    rating: 4.5,
    reviewCount: 178,
    offerCount: 6,
    minOfferPrice: 429.00,
    maxOfferPrice: 529.00,
    isActive: true,
    isFeatured: false,
    isNew: false,
    attributes: [],
    metaTitle: 'DeLonghi Magnifica Evo | ESHOPY',
    metaDescription: 'Automatický kávovar DeLonghi',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-06-18T14:00:00Z',
  },
  {
    id: '7',
    name: 'Garmin Fenix 7X Solar',
    slug: 'garmin-fenix-7x-solar',
    description: 'Prémiové multišportové GPS hodinky so solárnym nabíjaním',
    shortDescription: 'GPS, solárne nabíjanie, 51mm, mapy',
    sku: '010-02541-01',
    ean: '753759283421',
    brand: 'Garmin',
    categoryId: '12',
    categoryPath: ['Šport a outdoor', 'Fitness'],
    images: [
      { id: '7', url: '/images/products/garmin-fenix-7x.jpg', alt: 'Garmin Fenix 7X', isPrimary: true, order: 1 },
    ],
    price: 799.00,
    originalPrice: 899.00,
    currency: 'EUR',
    stockStatus: 'in_stock',
    stockQuantity: 15,
    rating: 4.8,
    reviewCount: 234,
    offerCount: 4,
    minOfferPrice: 749.00,
    maxOfferPrice: 849.00,
    isActive: true,
    isFeatured: true,
    isNew: false,
    attributes: [],
    metaTitle: 'Garmin Fenix 7X Solar | ESHOPY',
    metaDescription: 'Garmin Fenix 7X Solar GPS hodinky',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-06-17T10:00:00Z',
  },
  {
    id: '8',
    name: 'Sony WH-1000XM5 Silver',
    slug: 'sony-wh-1000xm5-silver',
    description: 'Bezdrôtové slúchadlá s najlepším ANC',
    shortDescription: 'ANC, 30h výdrž, LDAC, multipoint',
    sku: 'WH1000XM5S.CE7',
    ean: '4548736132672',
    brand: 'Sony',
    categoryId: '1',
    categoryPath: ['Elektronika'],
    images: [
      { id: '8', url: '/images/products/sony-wh1000xm5.jpg', alt: 'Sony WH-1000XM5', isPrimary: true, order: 1 },
    ],
    price: 329.00,
    originalPrice: 399.00,
    currency: 'EUR',
    stockStatus: 'in_stock',
    stockQuantity: 42,
    rating: 4.7,
    reviewCount: 521,
    offerCount: 9,
    minOfferPrice: 299.00,
    maxOfferPrice: 379.00,
    isActive: true,
    isFeatured: false,
    isNew: false,
    attributes: [],
    metaTitle: 'Sony WH-1000XM5 | ESHOPY',
    metaDescription: 'Sony WH-1000XM5 bezdrôtové slúchadlá',
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-06-16T08:00:00Z',
  },
];

const mockCategories: Category[] = [
  { id: '1', name: 'Elektronika', slug: 'elektronika', parentId: null, isActive: true, order: 1, productCount: 15420, level: 0, path: ['1'], createdAt: '', updatedAt: '' },
  { id: '2', name: 'Mobilné telefóny', slug: 'mobilne-telefony', parentId: '1', isActive: true, order: 1, productCount: 3250, level: 1, path: ['1', '2'], createdAt: '', updatedAt: '' },
  { id: '3', name: 'Samsung', slug: 'samsung', parentId: '2', isActive: true, order: 1, productCount: 450, level: 2, path: ['1', '2', '3'], createdAt: '', updatedAt: '' },
  { id: '4', name: 'Apple iPhone', slug: 'apple-iphone', parentId: '2', isActive: true, order: 2, productCount: 380, level: 2, path: ['1', '2', '4'], createdAt: '', updatedAt: '' },
  { id: '5', name: 'Xiaomi', slug: 'xiaomi', parentId: '2', isActive: false, order: 3, productCount: 220, level: 2, path: ['1', '2', '5'], createdAt: '', updatedAt: '' },
  { id: '6', name: 'Notebooky', slug: 'notebooky', parentId: '1', isActive: true, order: 2, productCount: 2840, level: 1, path: ['1', '6'], createdAt: '', updatedAt: '' },
  { id: '7', name: 'Gaming notebooky', slug: 'gaming-notebooky', parentId: '6', isActive: true, order: 1, productCount: 580, level: 2, path: ['1', '6', '7'], createdAt: '', updatedAt: '' },
  { id: '8', name: 'Televízory', slug: 'televizory', parentId: '1', isActive: true, order: 3, productCount: 1250, level: 1, path: ['1', '8'], createdAt: '', updatedAt: '' },
  { id: '9', name: 'Domácnosť', slug: 'domacnost', parentId: null, isActive: true, order: 2, productCount: 8750, level: 0, path: ['9'], createdAt: '', updatedAt: '' },
  { id: '10', name: 'Kuchynské spotrebiče', slug: 'kuchynske-spotrebice', parentId: '9', isActive: true, order: 1, productCount: 3420, level: 1, path: ['9', '10'], createdAt: '', updatedAt: '' },
  { id: '11', name: 'Šport a outdoor', slug: 'sport-outdoor', parentId: null, isActive: true, order: 3, productCount: 5230, level: 0, path: ['11'], createdAt: '', updatedAt: '' },
  { id: '12', name: 'Fitness', slug: 'fitness', parentId: '11', isActive: true, order: 1, productCount: 1850, level: 1, path: ['11', '12'], createdAt: '', updatedAt: '' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

function getStockBadge(status: StockStatus, quantity?: number) {
  const configs = {
    in_stock: { bg: 'bg-green-100', text: 'text-green-700', label: 'Skladom' },
    low_stock: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Málo kusov' },
    out_of_stock: { bg: 'bg-red-100', text: 'text-red-700', label: 'Vypredané' },
    preorder: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Predobjednávka' },
  };
  const config = configs[status] || configs.out_of_stock;
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label} {quantity !== undefined && quantity > 0 && `(${quantity})`}
    </span>
  );
}

function getDiscountPercent(price: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

// ═══════════════════════════════════════════════════════════════════════════════
// FILTER PANEL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface FiltersState {
  search: string;
  category: string;
  brand: string;
  status: string;
  stock: string;
  priceMin: string;
  priceMax: string;
  featured: string;
}

interface FilterPanelProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  categories: Category[];
  brands: string[];
  onClear: () => void;
}

function FilterPanel({ filters, setFilters, categories, brands, onClear }: FilterPanelProps) {
  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="bg-white border rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          {Icons.filter}
          Filtre
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <button onClick={onClear} className="text-sm text-blue-600 hover:underline">
            Vymazať filtre
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Search */}
        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Vyhľadávanie</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {Icons.search}
            </span>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Názov, SKU, EAN..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Kategória</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Všetky</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {'—'.repeat(cat.level)} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Značka</label>
          <select
            value={filters.brand}
            onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Všetky</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Stav</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Všetky</option>
            <option value="active">Aktívne</option>
            <option value="inactive">Neaktívne</option>
          </select>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Dostupnosť</label>
          <select
            value={filters.stock}
            onChange={(e) => setFilters(prev => ({ ...prev, stock: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Všetky</option>
            <option value="in_stock">Skladom</option>
            <option value="low_stock">Málo kusov</option>
            <option value="out_of_stock">Vypredané</option>
          </select>
        </div>

        {/* Price range */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Cena od</label>
          <input
            type="number"
            value={filters.priceMin}
            onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Cena do</label>
          <input
            type="number"
            value={filters.priceMax}
            onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
            placeholder="∞"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Featured */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Odporúčané</label>
          <select
            value={filters.featured}
            onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Všetky</option>
            <option value="yes">Áno</option>
            <option value="no">Nie</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCT ROW COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface ProductRowProps {
  product: Product;
  selected: boolean;
  onSelect: (id: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onToggleActive: (product: Product) => void;
  onToggleFeatured: (product: Product) => void;
}

function ProductRow({
  product,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleActive,
  onToggleFeatured,
}: ProductRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  const discount = getDiscountPercent(product.price, product.originalPrice);

  return (
    <tr className={`border-b hover:bg-gray-50 ${!product.isActive ? 'opacity-60 bg-gray-50' : ''}`}>
      {/* Checkbox */}
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(product.id)}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
      </td>

      {/* Image */}
      <td className="px-4 py-3">
        <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          {product.images[0] ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-300">{Icons.image}</span>
          )}
        </div>
      </td>

      {/* Name & details */}
      <td className="px-4 py-3">
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800 line-clamp-1">{product.name}</span>
            {product.isNew && (
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                NEW
              </span>
            )}
            {product.isFeatured && (
              <span className="text-yellow-500">{Icons.star}</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span>SKU: {product.sku}</span>
            {product.ean && <span>EAN: {product.ean}</span>}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {product.categoryPath?.join(' > ')}
          </div>
        </div>
      </td>

      {/* Brand */}
      <td className="px-4 py-3">
        <span className="text-sm text-gray-700">{product.brand}</span>
      </td>

      {/* Price */}
      <td className="px-4 py-3">
        <div className="text-right">
          <div className="font-semibold text-gray-800">{formatPrice(product.price)}</div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-xs font-medium text-green-600">-{discount}%</span>
            </div>
          )}
        </div>
      </td>

      {/* Stock */}
      <td className="px-4 py-3 text-center">
        {getStockBadge(product.stockStatus, product.stockQuantity)}
      </td>

      {/* Offers */}
      <td className="px-4 py-3 text-center">
        <div className="flex flex-col items-center">
          <span className="font-semibold text-gray-800">{product.offerCount}</span>
          {product.minOfferPrice && (
            <span className="text-xs text-gray-500">
              od {formatPrice(product.minOfferPrice)}
            </span>
          )}
        </div>
      </td>

      {/* Rating */}
      <td className="px-4 py-3 text-center">
        {product.reviewCount > 0 ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">{Icons.star}</span>
              <span className="font-medium text-gray-800">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-500">{product.reviewCount} recenzií</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3 text-center">
        <button
          onClick={() => onToggleActive(product)}
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {product.isActive ? 'Aktívny' : 'Neaktívny'}
        </button>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1 relative">
          <button
            onClick={() => window.open(`/product/${product.slug}`, '_blank')}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
            title="Zobraziť"
          >
            {Icons.eye}
          </button>
          <button
            onClick={() => onEdit(product)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
            title="Upraviť"
          >
            {Icons.edit}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
            >
              {Icons.moreVertical}
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-lg shadow-lg z-10 py-1">
                  <button
                    onClick={() => {
                      onDuplicate(product);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    {Icons.copy} Duplikovať
                  </button>
                  <button
                    onClick={() => {
                      onToggleFeatured(product);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    {Icons.star} {product.isFeatured ? 'Odstrániť z odporúčaných' : 'Pridať do odporúčaných'}
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(product.ean || product.sku);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    {Icons.tag} Kopírovať EAN/SKU
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      onDelete(product);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                  >
                    {Icons.trash} Vymazať
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BULK ACTIONS BAR
// ═══════════════════════════════════════════════════════════════════════════════

interface BulkActionsProps {
  selectedCount: number;
  onActivate: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
  onExport: () => void;
  onClear: () => void;
}

function BulkActions({ selectedCount, onActivate, onDeactivate, onDelete, onExport, onClear }: BulkActionsProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-6 z-50">
      <div className="flex items-center gap-2">
        <span className="bg-blue-600 text-white text-sm font-medium px-2.5 py-1 rounded-full">
          {selectedCount}
        </span>
        <span className="text-gray-300">vybraných produktov</span>
      </div>
      
      <div className="h-6 w-px bg-gray-700" />
      
      <div className="flex items-center gap-2">
        <button
          onClick={onActivate}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
        >
          Aktivovať
        </button>
        <button
          onClick={onDeactivate}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
        >
          Deaktivovať
        </button>
        <button
          onClick={onExport}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          {Icons.download}
          Export
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          {Icons.trash}
          Vymazať
        </button>
      </div>
      
      <button
        onClick={onClear}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
      >
        {Icons.x}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGINATION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (count: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Zobrazené {startItem}-{endItem} z {totalItems}
        </span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value={10}>10 na stránku</option>
          <option value={25}>25 na stránku</option>
          <option value={50}>50 na stránku</option>
          <option value={100}>100 na stránku</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {Icons.chevronLeft}
        </button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let page: number;
          if (totalPages <= 5) {
            page = i + 1;
          } else if (currentPage <= 3) {
            page = i + 1;
          } else if (currentPage >= totalPages - 2) {
            page = totalPages - 4 + i;
          } else {
            page = currentPage - 2 + i;
          }
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg text-sm font-medium ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          );
        })}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {Icons.chevronRight}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function AdminProductsPage() {
  // Data state
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories] = useState<Category[]>(mockCategories);

  // UI state
  const [filters, setFilters] = useState<FiltersState>({
    search: '',
    category: '',
    brand: '',
    status: '',
    stock: '',
    priceMin: '',
    priceMax: '',
    featured: '',
  });
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [showFilters, setShowFilters] = useState(true);

  // Extract unique brands
  const brands = useMemo(
    () => [...new Set(products.map(p => p.brand).filter(Boolean))].sort(),
    [products]
  );

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.sku.toLowerCase().includes(search) ||
        (p.ean && p.ean.includes(search))
      );
    }

    if (filters.category) {
      result = result.filter(p => p.categoryId === filters.category || p.categoryPath?.includes(filters.category));
    }

    if (filters.brand) {
      result = result.filter(p => p.brand === filters.brand);
    }

    if (filters.status === 'active') {
      result = result.filter(p => p.isActive);
    } else if (filters.status === 'inactive') {
      result = result.filter(p => !p.isActive);
    }

    if (filters.stock) {
      result = result.filter(p => p.stockStatus === filters.stock);
    }

    if (filters.priceMin) {
      result = result.filter(p => p.price >= Number(filters.priceMin));
    }

    if (filters.priceMax) {
      result = result.filter(p => p.price <= Number(filters.priceMax));
    }

    if (filters.featured === 'yes') {
      result = result.filter(p => p.isFeatured);
    } else if (filters.featured === 'no') {
      result = result.filter(p => !p.isFeatured);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'stock':
          comparison = (a.stockQuantity || 0) - (b.stockQuantity || 0);
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [products, filters, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(
    () => filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredProducts, currentPage, itemsPerPage]
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIds.size === paginatedProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedProducts.map(p => p.id)));
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Action handlers
  const handleEdit = (product: Product) => {
    console.log('Edit product:', product.id);
    // Would open edit modal/page
  };

  const handleDelete = (product: Product) => {
    if (confirm(`Naozaj chcete vymazať produkt "${product.name}"?`)) {
      setProducts(prev => prev.filter(p => p.id !== product.id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }
  };

  const handleDuplicate = (product: Product) => {
    const newProduct: Product = {
      ...product,
      id: `${Date.now()}`,
      name: `${product.name} (kópia)`,
      slug: `${product.slug}-kopia-${Date.now()}`,
      sku: `${product.sku}-COPY`,
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const handleToggleActive = (product: Product) => {
    setProducts(prev => prev.map(p =>
      p.id === product.id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const handleToggleFeatured = (product: Product) => {
    setProducts(prev => prev.map(p =>
      p.id === product.id ? { ...p, isFeatured: !p.isFeatured } : p
    ));
  };

  // Bulk action handlers
  const handleBulkActivate = () => {
    setProducts(prev => prev.map(p =>
      selectedIds.has(p.id) ? { ...p, isActive: true } : p
    ));
  };

  const handleBulkDeactivate = () => {
    setProducts(prev => prev.map(p =>
      selectedIds.has(p.id) ? { ...p, isActive: false } : p
    ));
  };

  const handleBulkDelete = () => {
    if (confirm(`Naozaj chcete vymazať ${selectedIds.size} produktov?`)) {
      setProducts(prev => prev.filter(p => !selectedIds.has(p.id)));
      setSelectedIds(new Set());
    }
  };

  const handleBulkExport = () => {
    const exportData = products.filter(p => selectedIds.has(p.id));
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Stats
  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter(p => p.isActive).length,
    outOfStock: products.filter(p => p.stockStatus === 'out_of_stock').length,
    featured: products.filter(p => p.isFeatured).length,
  }), [products]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Správa produktov</h1>
              <p className="text-gray-500 text-sm">Spravujte produktový katalóg</p>
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
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium">
                {Icons.plus}
                Nový produkt
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
              <span className="text-gray-500">Vypredané:</span>
              <span className="font-semibold text-red-600">{stats.outOfStock}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Odporúčané:</span>
              <span className="font-semibold text-yellow-600">{stats.featured}</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-gray-500">Nájdené:</span>
              <span className="font-semibold text-blue-600">{filteredProducts.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Filters */}
        <div className="mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            {Icons.filter}
            {showFilters ? 'Skryť filtre' : 'Zobraziť filtre'}
            <span className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>
              {Icons.chevronDown}
            </span>
          </button>
        </div>

        {showFilters && (
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            brands={brands}
            onClear={() => setFilters({
              search: '',
              category: '',
              brand: '',
              status: '',
              stock: '',
              priceMin: '',
              priceMax: '',
              featured: '',
            })}
          />
        )}

        {/* Table toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 ${viewMode === 'table' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                {Icons.list}
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                {Icons.grid}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="updatedAt">Posledná úprava</option>
              <option value="name">Názov</option>
              <option value="price">Cena</option>
              <option value="stock">Sklad</option>
              <option value="rating">Hodnotenie</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? Icons.arrowUp : Icons.arrowDown}
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              {Icons.refresh}
            </button>
          </div>
        </div>

        {/* Products table */}
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === paginatedProducts.length && paginatedProducts.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Obrázok
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <button onClick={() => handleSort('name')} className="flex items-center gap-1">
                      Produkt
                      {sortBy === 'name' && (sortOrder === 'asc' ? Icons.arrowUp : Icons.arrowDown)}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Značka
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    <button onClick={() => handleSort('price')} className="flex items-center gap-1 ml-auto">
                      Cena
                      {sortBy === 'price' && (sortOrder === 'asc' ? Icons.arrowUp : Icons.arrowDown)}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    <button onClick={() => handleSort('stock')} className="flex items-center gap-1 justify-center">
                      Sklad
                      {sortBy === 'stock' && (sortOrder === 'asc' ? Icons.arrowUp : Icons.arrowDown)}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Ponuky
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    <button onClick={() => handleSort('rating')} className="flex items-center gap-1 justify-center">
                      Rating
                      {sortBy === 'rating' && (sortOrder === 'asc' ? Icons.arrowUp : Icons.arrowDown)}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Stav
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Akcie
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map(product => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    selected={selectedIds.has(product.id)}
                    onSelect={handleSelect}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                    onToggleActive={handleToggleActive}
                    onToggleFeatured={handleToggleFeatured}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {paginatedProducts.length === 0 && (
            <div className="text-center py-12">
              <span className="text-gray-300 text-6xl">📦</span>
              <p className="text-gray-600 mt-4">Žiadne produkty nevyhovujú filtrom</p>
              <button
                onClick={() => setFilters({
                  search: '',
                  category: '',
                  brand: '',
                  status: '',
                  stock: '',
                  priceMin: '',
                  priceMax: '',
                  featured: '',
                })}
                className="mt-2 text-blue-600 hover:underline"
              >
                Vymazať filtre
              </button>
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(count) => {
                setItemsPerPage(count);
                setCurrentPage(1);
              }}
            />
          )}
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <BulkActions
          selectedCount={selectedIds.size}
          onActivate={handleBulkActivate}
          onDeactivate={handleBulkDeactivate}
          onDelete={handleBulkDelete}
          onExport={handleBulkExport}
          onClear={() => setSelectedIds(new Set())}
        />
      )}
    </div>
  );
}
