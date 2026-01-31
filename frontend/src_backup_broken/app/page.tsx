'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Types
interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  vendor: string;
  vendorSlug: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  freeShipping?: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  icon: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  bgColor: string;
  textColor: string;
}

// Mock data
const mockCategories: Category[] = [
  { id: 'c1', name: 'Mobilné telefóny', slug: 'mobilne-telefony', image: '/cat/phones.jpg', productCount: 1250, icon: '📱' },
  { id: 'c2', name: 'Notebooky', slug: 'notebooky', image: '/cat/laptops.jpg', productCount: 890, icon: '💻' },
  { id: 'c3', name: 'Tablety', slug: 'tablety', image: '/cat/tablets.jpg', productCount: 456, icon: '📲' },
  { id: 'c4', name: 'TV & Audio', slug: 'tv-audio', image: '/cat/tv.jpg', productCount: 678, icon: '📺' },
  { id: 'c5', name: 'Fotoaparáty', slug: 'fotoaparaty', image: '/cat/cameras.jpg', productCount: 234, icon: '📷' },
  { id: 'c6', name: 'Gaming', slug: 'gaming', image: '/cat/gaming.jpg', productCount: 567, icon: '🎮' },
  { id: 'c7', name: 'Smart Home', slug: 'smart-home', image: '/cat/smarthome.jpg', productCount: 345, icon: '🏠' },
  { id: 'c8', name: 'Wearables', slug: 'wearables', image: '/cat/wearables.jpg', productCount: 289, icon: '⌚' },
];

const mockFeaturedProducts: Product[] = [
  {
    id: 'fp1',
    name: 'iPhone 15 Pro Max 256GB Natural Titanium',
    slug: 'iphone-15-pro-max-256gb',
    image: '/products/iphone15.jpg',
    price: 1299.00,
    originalPrice: 1449.00,
    vendor: 'Apple Store SK',
    vendorSlug: 'apple-store-sk',
    rating: 4.9,
    reviewCount: 234,
    inStock: true,
    isNew: true,
    freeShipping: true,
  },
  {
    id: 'fp2',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    slug: 'samsung-galaxy-s24-ultra',
    image: '/products/samsung-s24.jpg',
    price: 1449.00,
    vendor: 'Samsung Shop',
    vendorSlug: 'samsung-shop',
    rating: 4.8,
    reviewCount: 189,
    inStock: true,
    isBestseller: true,
    freeShipping: true,
  },
  {
    id: 'fp3',
    name: 'MacBook Pro 14" M3 Pro',
    slug: 'macbook-pro-14-m3',
    image: '/products/macbook.jpg',
    price: 2199.00,
    vendor: 'Apple Store SK',
    vendorSlug: 'apple-store-sk',
    rating: 4.9,
    reviewCount: 145,
    inStock: true,
    isNew: true,
    freeShipping: true,
  },
  {
    id: 'fp4',
    name: 'Sony WH-1000XM5 Wireless',
    slug: 'sony-wh-1000xm5',
    image: '/products/sony-headphones.jpg',
    price: 349.00,
    originalPrice: 399.00,
    vendor: 'Audio Expert',
    vendorSlug: 'audio-expert',
    rating: 4.7,
    reviewCount: 567,
    inStock: true,
    freeShipping: true,
  },
  {
    id: 'fp5',
    name: 'PlayStation 5 Slim Digital Edition',
    slug: 'ps5-slim-digital',
    image: '/products/ps5.jpg',
    price: 449.00,
    vendor: 'Game Zone',
    vendorSlug: 'game-zone',
    rating: 4.8,
    reviewCount: 890,
    inStock: true,
    isBestseller: true,
  },
  {
    id: 'fp6',
    name: 'iPad Pro 12.9" M2 256GB',
    slug: 'ipad-pro-m2',
    image: '/products/ipad-pro.jpg',
    price: 1199.00,
    originalPrice: 1299.00,
    vendor: 'Apple Store SK',
    vendorSlug: 'apple-store-sk',
    rating: 4.9,
    reviewCount: 312,
    inStock: true,
    freeShipping: true,
  },
  {
    id: 'fp7',
    name: 'DJI Mini 4 Pro Fly More Combo',
    slug: 'dji-mini-4-pro',
    image: '/products/dji-mini4.jpg',
    price: 1099.00,
    vendor: 'Drone World',
    vendorSlug: 'drone-world',
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    isNew: true,
  },
  {
    id: 'fp8',
    name: 'Apple Watch Ultra 2',
    slug: 'apple-watch-ultra-2',
    image: '/products/watch-ultra.jpg',
    price: 899.00,
    vendor: 'Apple Store SK',
    vendorSlug: 'apple-store-sk',
    rating: 4.8,
    reviewCount: 234,
    inStock: true,
    freeShipping: true,
  },
];

const mockDeals: Product[] = [
  {
    id: 'd1',
    name: 'Samsung 55" OLED 4K Smart TV',
    slug: 'samsung-55-oled-4k',
    image: '/products/samsung-tv.jpg',
    price: 999.00,
    originalPrice: 1499.00,
    vendor: 'Samsung Shop',
    vendorSlug: 'samsung-shop',
    rating: 4.7,
    reviewCount: 234,
    inStock: true,
  },
  {
    id: 'd2',
    name: 'Dyson V15 Detect Absolute',
    slug: 'dyson-v15-detect',
    image: '/products/dyson-v15.jpg',
    price: 599.00,
    originalPrice: 799.00,
    vendor: 'Home Expert',
    vendorSlug: 'home-expert',
    rating: 4.8,
    reviewCount: 456,
    inStock: true,
  },
  {
    id: 'd3',
    name: 'Bose QuietComfort Ultra Earbuds',
    slug: 'bose-qc-ultra',
    image: '/products/bose-earbuds.jpg',
    price: 249.00,
    originalPrice: 329.00,
    vendor: 'Audio Expert',
    vendorSlug: 'audio-expert',
    rating: 4.6,
    reviewCount: 178,
    inStock: true,
  },
  {
    id: 'd4',
    name: 'Garmin Fenix 7X Pro Solar',
    slug: 'garmin-fenix-7x',
    image: '/products/garmin-fenix.jpg',
    price: 699.00,
    originalPrice: 899.00,
    vendor: 'Sport Zone',
    vendorSlug: 'sport-zone',
    rating: 4.9,
    reviewCount: 89,
    inStock: true,
  },
];

const mockBrands: Brand[] = [
  { id: 'b1', name: 'Apple', slug: 'apple', logo: '/brands/apple.png' },
  { id: 'b2', name: 'Samsung', slug: 'samsung', logo: '/brands/samsung.png' },
  { id: 'b3', name: 'Sony', slug: 'sony', logo: '/brands/sony.png' },
  { id: 'b4', name: 'LG', slug: 'lg', logo: '/brands/lg.png' },
  { id: 'b5', name: 'Xiaomi', slug: 'xiaomi', logo: '/brands/xiaomi.png' },
  { id: 'b6', name: 'Dyson', slug: 'dyson', logo: '/brands/dyson.png' },
  { id: 'b7', name: 'Bose', slug: 'bose', logo: '/brands/bose.png' },
  { id: 'b8', name: 'DJI', slug: 'dji', logo: '/brands/dji.png' },
];

const mockBanners: Banner[] = [
  {
    id: 'ban1',
    title: 'iPhone 15 Pro Max',
    subtitle: 'Nová éra výkonu. Titanium dizajn.',
    buttonText: 'Nakúpiť teraz',
    buttonLink: '/product/iphone-15-pro-max-256gb',
    bgColor: 'from-gray-900 to-gray-800',
    textColor: 'text-white',
  },
  {
    id: 'ban2',
    title: 'Jarný výpredaj',
    subtitle: 'Zľavy až do 50% na vybrané produkty',
    buttonText: 'Zobraziť akcie',
    buttonLink: '/akcie',
    bgColor: 'from-blue-600 to-purple-600',
    textColor: 'text-white',
  },
  {
    id: 'ban3',
    title: 'Doprava zadarmo',
    subtitle: 'Pri nákupe nad 50€',
    buttonText: 'Viac info',
    buttonLink: '/doprava',
    bgColor: 'from-green-500 to-emerald-600',
    textColor: 'text-white',
  },
];

// Product Card Component
function ProductCard({ product, size = 'normal' }: { product: Product; size?: 'normal' | 'large' }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all group">
      <Link href={`/product/${product.slug}`} className="block relative aspect-square p-4">
        <div className="absolute inset-4 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          <svg className={`${size === 'large' ? 'w-20 h-20' : 'w-12 h-12'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-1 text-xs font-bold bg-blue-500 text-white rounded">
              Novinka
            </span>
          )}
          {product.isBestseller && (
            <span className="px-2 py-1 text-xs font-bold bg-orange-500 text-white rounded">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 z-10">
          <svg className="w-5 h-5 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </Link>

      <div className="p-4 pt-0">
        <Link href={`/predajca/${product.vendorSlug}`} className="text-xs text-gray-500 hover:text-blue-600">
          {product.vendor}
        </Link>

        <Link
          href={`/product/${product.slug}`}
          className="block font-medium text-gray-900 hover:text-blue-600 mt-1 line-clamp-2 text-sm leading-snug min-h-[2.5rem]"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className={`font-bold text-gray-900 ${size === 'large' ? 'text-xl' : 'text-lg'}`}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-green-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Skladom
          </span>
          {product.freeShipping && (
            <span className="text-blue-600">Doprava zdarma</span>
          )}
        </div>

        <button className="w-full mt-3 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Do košíka
        </button>
      </div>
    </div>
  );
}

// Hero Banner Carousel
function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {mockBanners.map((banner) => (
          <div
            key={banner.id}
            className={`min-w-full bg-gradient-to-r ${banner.bgColor} p-8 md:p-12 lg:p-16`}
          >
            <div className="max-w-xl">
              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${banner.textColor} mb-4`}>
                {banner.title}
              </h2>
              <p className={`text-lg md:text-xl ${banner.textColor} opacity-90 mb-6`}>
                {banner.subtitle}
              </p>
              <Link
                href={banner.buttonLink}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                {banner.buttonText}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {mockBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === index ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + mockBanners.length) % mockBanners.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % mockBanners.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

// Features Bar
function FeaturesBar() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      title: 'Doprava zdarma',
      description: 'Pri nákupe nad 50€',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Bezpečný nákup',
      description: 'SSL šifrovanie',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: '14 dní na vrátenie',
      description: 'Bez udania dôvodu',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Zákaznícka podpora',
      description: 'Pondelok - Piatok 8-18h',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="text-blue-600">{feature.icon}</div>
            <div>
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Page Component
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Top bar */}
        <div className="bg-gray-900 text-white text-sm py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <p>🎉 Jarný výpredaj - zľavy až do 50%!</p>
            <div className="hidden sm:flex items-center gap-4">
              <Link href="/pomoc" className="hover:text-gray-300">Pomoc</Link>
              <Link href="/kontakt" className="hover:text-gray-300">Kontakt</Link>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-8">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-blue-600 flex-shrink-0">
              ESHOPY
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Hľadať produkty, značky..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/ucet/wishlist" className="p-2 text-gray-600 hover:text-gray-900 relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  5
                </span>
              </Link>
              <Link href="/kosik" className="p-2 text-gray-600 hover:text-gray-900 relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  2
                </span>
              </Link>
              <Link
                href="/ucet"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">Môj účet</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Categories Nav */}
        <div className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1 overflow-x-auto py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              <Link
                href="/kategorie"
                className="flex items-center gap-2 px-4 py-2 text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Všetky kategórie
              </Link>
              {mockCategories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/kategoria/${cat.slug}`}
                  className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/akcie"
                className="px-3 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
              >
                🔥 Akcie
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Features Bar */}
        <FeaturesBar />

        {/* Categories Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Nakupujte podľa kategórií</h2>
            <Link href="/kategorie" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Všetky kategórie
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {mockCategories.map((category) => (
              <Link
                key={category.id}
                href={`/kategoria/${category.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-lg hover:border-blue-500 transition-all group"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 text-sm">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {category.productCount.toLocaleString()} produktov
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Odporúčané produkty</h2>
            <Link href="/produkty" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Zobraziť všetky
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockFeaturedProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Deals Section */}
        <section className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">🔥 Bleskové zľavy</h2>
              <p className="text-white/80">Časovo obmedzené ponuky</p>
            </div>
            <Link href="/akcie" className="px-4 py-2 bg-white text-red-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
              Všetky akcie
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Brands */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Obľúbené značky</h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {mockBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/znacka/${brand.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-center h-20 hover:shadow-md hover:border-gray-300 transition-all"
              >
                <span className="font-semibold text-gray-700">{brand.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Prihláste sa na odber noviniek
          </h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Získajte exkluzívne zľavy a informácie o novinkách priamo do vašej schránky.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Váš email"
              className="flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Prihlásiť sa
            </button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Nakupovanie</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/kategorie" className="hover:text-white">Všetky kategórie</Link></li>
                <li><Link href="/akcie" className="hover:text-white">Akcie a zľavy</Link></li>
                <li><Link href="/novinky" className="hover:text-white">Novinky</Link></li>
                <li><Link href="/bestseller" className="hover:text-white">Bestsellery</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Zákaznícky servis</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/pomoc" className="hover:text-white">Pomoc</Link></li>
                <li><Link href="/doprava" className="hover:text-white">Doprava</Link></li>
                <li><Link href="/vratenie" className="hover:text-white">Vrátenie tovaru</Link></li>
                <li><Link href="/reklamacie" className="hover:text-white">Reklamácie</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">O nás</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/o-nas" className="hover:text-white">O spoločnosti</Link></li>
                <li><Link href="/kariera" className="hover:text-white">Kariéra</Link></li>
                <li><Link href="/kontakt" className="hover:text-white">Kontakt</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Kontakt</h3>
              <ul className="space-y-2 text-gray-400">
                <li>info@eshopy.sk</li>
                <li>+421 900 123 456</li>
                <li>Po-Pi: 8:00 - 18:00</li>
              </ul>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">
                © 2026 ESHOPY. Všetky práva vyhradené.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <Link href="/obchodne-podmienky" className="hover:text-white">Obchodné podmienky</Link>
                <Link href="/ochrana-sukromia" className="hover:text-white">Ochrana súkromia</Link>
                <Link href="/cookies" className="hover:text-white">Cookies</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
