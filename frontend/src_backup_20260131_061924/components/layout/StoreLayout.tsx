'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ============================================================================
// STORE LAYOUT COMPONENT - Public e-commerce layout
// ============================================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: ReactNode;
  children?: Category[];
}

export interface StoreLayoutProps {
  children: ReactNode;
  storeName?: string;
  storeLogo?: string;
  categories?: Category[];
  cartCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
}

export const StoreLayout: React.FC<StoreLayoutProps> = ({
  children,
  storeName = 'ESHOPY',
  storeLogo,
  categories = [],
  cartCount = 0,
  isLoggedIn = false,
  userName,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top bar */}
      <div className="bg-gray-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +421 900 123 456
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@eshopy.sk
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Doprava zadarmo od 50€</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              {storeLogo ? (
                <img src={storeLogo} alt={storeName} className="h-8" />
              ) : (
                <>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">E</span>
                  </div>
                  <span className="hidden sm:block text-xl font-bold text-gray-900">{storeName}</span>
                </>
              )}
            </Link>

            {/* Search - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="search"
                  placeholder="Hľadať produkty..."
                  className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="absolute right-0 top-0 h-full px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Search - Mobile */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* User account */}
              {isLoggedIn ? (
                <Link
                  href="/ucet"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{userName || 'Môj účet'}</span>
                </Link>
              ) : (
                <Link
                  href="/prihlasenie"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Prihlásiť</span>
                </Link>
              )}

              {/* Wishlist */}
              <Link
                href="/oblubene"
                className="hidden sm:flex p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>

              {/* Cart */}
              <Link
                href="/kosik"
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-medium">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:block font-medium">Košík</span>
              </Link>
            </div>
          </div>

          {/* Mobile search */}
          {searchOpen && (
            <div className="lg:hidden py-3 border-t border-gray-200">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Hľadať produkty..."
                  className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
                <button className="absolute right-0 top-0 h-full px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Category navigation - Desktop */}
        {categories.length > 0 && (
          <nav className="hidden lg:block border-t border-gray-200 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <ul className="flex items-center gap-1">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="relative"
                    onMouseEnter={() => setCategoryDropdown(category.id)}
                    onMouseLeave={() => setCategoryDropdown(null)}
                  >
                    <Link
                      href={`/kategoria/${category.slug}`}
                      className={`
                        flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
                        ${pathname?.includes(category.slug)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                        }
                      `}
                    >
                      {category.icon}
                      {category.name}
                      {category.children && category.children.length > 0 && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>

                    {/* Dropdown */}
                    {category.children && category.children.length > 0 && categoryDropdown === category.id && (
                      <div className="absolute top-full left-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                        {category.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/kategoria/${child.slug}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                          >
                            {child.icon}
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[90vw] bg-white shadow-xl lg:hidden overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="font-bold text-gray-900">{storeName}</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="p-4">
              <div className="space-y-1">
                {categories.map((category) => (
                  <div key={category.id}>
                    <Link
                      href={`/kategoria/${category.slug}`}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.icon}
                      {category.name}
                    </Link>
                    {category.children && category.children.length > 0 && (
                      <div className="ml-6 space-y-1">
                        {category.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/kategoria/${child.slug}`}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-1">
                <Link
                  href={isLoggedIn ? '/ucet' : '/prihlasenie'}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {isLoggedIn ? (userName || 'Môj účet') : 'Prihlásiť sa'}
                </Link>
                <Link
                  href="/oblubene"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Obľúbené
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <span className="text-xl font-bold">{storeName}</span>
              </div>
              <p className="text-gray-400 text-sm">
                Váš spoľahlivý partner pre online nákupy. Kvalitné produkty za najlepšie ceny.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Nakupovanie</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/kategorie" className="hover:text-white transition-colors">Všetky kategórie</Link></li>
                <li><Link href="/akcie" className="hover:text-white transition-colors">Akcie a zľavy</Link></li>
                <li><Link href="/novinky" className="hover:text-white transition-colors">Novinky</Link></li>
                <li><Link href="/bestsellery" className="hover:text-white transition-colors">Bestsellery</Link></li>
              </ul>
            </div>

            {/* Customer service */}
            <div>
              <h4 className="font-semibold mb-4">Zákaznícky servis</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link></li>
                <li><Link href="/doprava" className="hover:text-white transition-colors">Doprava a platba</Link></li>
                <li><Link href="/reklamacie" className="hover:text-white transition-colors">Reklamácie</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">Časté otázky</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +421 900 123 456
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@eshopy.sk
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Hlavná 123<br />811 01 Bratislava</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} {storeName}. Všetky práva vyhradené.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/vop" className="text-sm text-gray-400 hover:text-white transition-colors">
                Obchodné podmienky
              </Link>
              <Link href="/gdpr" className="text-sm text-gray-400 hover:text-white transition-colors">
                Ochrana osobných údajov
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StoreLayout;
