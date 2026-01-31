'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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
  category: string;
  categorySlug: string;
}

interface SearchSuggestion {
  type: 'product' | 'category' | 'brand';
  id: string;
  name: string;
  slug: string;
  image?: string;
  price?: number;
}

// Mock search results
const mockProducts: Product[] = [
  {
    id: 'sr1',
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
    category: 'Mobilné telefóny',
    categorySlug: 'mobilne-telefony',
  },
  {
    id: 'sr2',
    name: 'iPhone 15 128GB Blue',
    slug: 'iphone-15-128gb-blue',
    image: '/products/iphone15-blue.jpg',
    price: 899.00,
    vendor: 'Apple Store SK',
    vendorSlug: 'apple-store-sk',
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
    category: 'Mobilné telefóny',
    categorySlug: 'mobilne-telefony',
  },
  {
    id: 'sr3',
    name: 'iPhone 14 Pro 256GB Space Black',
    slug: 'iphone-14-pro-256gb',
    image: '/products/iphone14-pro.jpg',
    price: 999.00,
    originalPrice: 1199.00,
    vendor: 'Apple Store SK',
    vendorSlug: 'apple-store-sk',
    rating: 4.9,
    reviewCount: 567,
    inStock: false,
    category: 'Mobilné telefóny',
    categorySlug: 'mobilne-telefony',
  },
  {
    id: 'sr4',
    name: 'Apple iPhone SE 2022 64GB Midnight',
    slug: 'iphone-se-2022-64gb',
    image: '/products/iphone-se.jpg',
    price: 449.00,
    vendor: 'iStyle',
    vendorSlug: 'istyle',
    rating: 4.5,
    reviewCount: 189,
    inStock: true,
    category: 'Mobilné telefóny',
    categorySlug: 'mobilne-telefony',
  },
  {
    id: 'sr5',
    name: 'Apple iPhone 13 128GB Starlight',
    slug: 'iphone-13-128gb',
    image: '/products/iphone13.jpg',
    price: 699.00,
    originalPrice: 799.00,
    vendor: 'Alza',
    vendorSlug: 'alza',
    rating: 4.7,
    reviewCount: 890,
    inStock: true,
    category: 'Mobilné telefóny',
    categorySlug: 'mobilne-telefony',
  },
  {
    id: 'sr6',
    name: 'Apple AirPods Pro 2nd Generation',
    slug: 'airpods-pro-2',
    image: '/products/airpods-pro.jpg',
    price: 279.00,
    vendor: 'Apple Store SK',
    vendorSlug: 'apple-store-sk',
    rating: 4.8,
    reviewCount: 1234,
    inStock: true,
    category: 'Slúchadlá',
    categorySlug: 'sluchadla',
  },
  {
    id: 'sr7',
    name: 'Apple Watch Ultra 2 GPS + Cellular',
    slug: 'apple-watch-ultra-2',
    image: '/products/watch-ultra.jpg',
    price: 899.00,
    vendor: 'Apple Store SK',
    vendorSlug: 'apple-store-sk',
    rating: 4.8,
    reviewCount: 234,
    inStock: true,
    category: 'Smartwatch',
    categorySlug: 'smartwatch',
  },
  {
    id: 'sr8',
    name: 'Apple MacBook Air 13" M2 256GB',
    slug: 'macbook-air-m2',
    image: '/products/macbook-air.jpg',
    price: 1149.00,
    originalPrice: 1299.00,
    vendor: 'Apple Store SK',
    vendorSlug: 'apple-store-sk',
    rating: 4.9,
    reviewCount: 456,
    inStock: true,
    category: 'Notebooky',
    categorySlug: 'notebooky',
  },
];

// Mock suggestions
const mockSuggestions: SearchSuggestion[] = [
  { type: 'product', id: 'sug1', name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max-256gb', price: 1299 },
  { type: 'product', id: 'sug2', name: 'iPhone 15', slug: 'iphone-15-128gb-blue', price: 899 },
  { type: 'category', id: 'sug3', name: 'Mobilné telefóny', slug: 'mobilne-telefony' },
  { type: 'brand', id: 'sug4', name: 'Apple', slug: 'apple' },
];

// Sort options
type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'reviews';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevantnosť' },
  { value: 'price_asc', label: 'Cena: najnižšia' },
  { value: 'price_desc', label: 'Cena: najvyššia' },
  { value: 'rating', label: 'Hodnotenie' },
  { value: 'reviews', label: 'Počet recenzií' },
];

// Product Card Component
function ProductCard({ product }: { product: Product }) {
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
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {discount > 0 && (
          <span className="absolute top-2 left-2 px-2 py-1 text-xs font-bold bg-red-500 text-white rounded z-10">
            -{discount}%
          </span>
        )}

        {!product.inStock && (
          <div className="absolute inset-4 bg-black/40 rounded-lg flex items-center justify-center">
            <span className="px-3 py-1.5 bg-white text-gray-900 font-medium rounded-lg text-sm">
              Vypredané
            </span>
          </div>
        )}

        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 z-10">
          <svg className="w-5 h-5 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </Link>

      <div className="p-4 pt-0">
        <Link href={`/kategoria/${product.categorySlug}`} className="text-xs text-blue-600 hover:text-blue-700">
          {product.category}
        </Link>

        <Link
          href={`/product/${product.slug}`}
          className="block font-medium text-gray-900 hover:text-blue-600 mt-1 line-clamp-2 text-sm leading-snug min-h-[2.5rem]"
        >
          {product.name}
        </Link>

        <Link href={`/predajca/${product.vendorSlug}`} className="text-xs text-gray-500 hover:text-gray-700 mt-1 block">
          {product.vendor}
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
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="mt-2 text-xs">
          {product.inStock ? (
            <span className="text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Skladom
            </span>
          ) : (
            <span className="text-orange-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
              Na objednávku
            </span>
          )}
        </div>

        <button
          disabled={!product.inStock}
          className={`w-full mt-3 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
            product.inStock
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Do košíka
        </button>
      </div>
    </div>
  );
}

// Search Results Content Component
function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let results = mockProducts.filter(p => {
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (showInStockOnly && !p.inStock) return false;
      return true;
    });

    switch (sortBy) {
      case 'price_asc':
        return results.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return results.sort((a, b) => b.price - a.price);
      case 'rating':
        return results.sort((a, b) => b.rating - a.rating);
      case 'reviews':
        return results.sort((a, b) => b.reviewCount - a.reviewCount);
      default:
        return results;
    }
  }, [sortBy, priceRange, showInStockOnly]);

  // Get unique categories from results
  const categories = useMemo(() => {
    const cats = new Map<string, { name: string; slug: string; count: number }>();
    mockProducts.forEach(p => {
      const existing = cats.get(p.categorySlug);
      if (existing) {
        existing.count++;
      } else {
        cats.set(p.categorySlug, { name: p.category, slug: p.categorySlug, count: 1 });
      }
    });
    return Array.from(cats.values());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-8">
            <Link href="/" className="text-2xl font-bold text-blue-600 flex-shrink-0">
              ESHOPY
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <form action="/hladanie" className="relative">
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Hľadať produkty..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </form>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/kosik" className="relative p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  2
                </span>
              </Link>
              <Link href="/ucet" className="p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Domov
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">
              Výsledky vyhľadávania: "{query}"
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Výsledky vyhľadávania pre "{query}"
          </h1>
          <p className="text-gray-600">
            Nájdených {filteredProducts.length} produktov
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* Categories */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Kategórie</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/kategoria/${cat.slug}?q=${query}`}
                      className="flex items-center justify-between text-sm text-gray-600 hover:text-blue-600"
                    >
                      <span>{cat.name}</span>
                      <span className="text-gray-400">({cat.count})</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Cena</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      placeholder="Od"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      placeholder="Do"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={2000}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Dostupnosť</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInStockOnly}
                    onChange={(e) => setShowInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Len skladom</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="text-sm text-gray-600">
                  {filteredProducts.length} produktov
                </span>

                <div className="flex items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenašli sa žiadne produkty
                </h3>
                <p className="text-gray-500 mb-4">
                  Skúste zmeniť vyhľadávací výraz alebo filtre.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Späť na hlavnú stránku
                </Link>
              </div>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Related Searches */}
            <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Súvisiace vyhľadávania</h3>
              <div className="flex flex-wrap gap-2">
                {['iPhone 15 Pro', 'iPhone príslušenstvo', 'Apple Watch', 'AirPods', 'MacBook', 'iPad'].map((term) => (
                  <Link
                    key={term}
                    href={`/hladanie?q=${encodeURIComponent(term)}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            © 2026 ESHOPY. Všetky práva vyhradené.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Main Page Component with Suspense
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
