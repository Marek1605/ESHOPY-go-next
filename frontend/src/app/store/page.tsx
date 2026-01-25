'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, User, Heart, Menu, X, Star, Filter, ChevronDown } from 'lucide-react';

export default function StorePage() {
  const [cartCount] = useState(2);
  const [mobileMenu, setMobileMenu] = useState(false);
  
  const products = [
    { id: 1, name: 'Bezdrôtové slúchadlá Pro', price: 89.99, originalPrice: 119.99, rating: 4.8, reviews: 124, image: null },
    { id: 2, name: 'Smart hodinky Ultra', price: 199.99, originalPrice: null, rating: 4.9, reviews: 89, image: null },
    { id: 3, name: 'Prémiový obal na telefón', price: 29.99, originalPrice: 39.99, rating: 4.5, reviews: 256, image: null },
    { id: 4, name: 'USB-C kábel 2m', price: 14.99, originalPrice: null, rating: 4.7, reviews: 512, image: null },
    { id: 5, name: 'Bluetooth reproduktor', price: 59.99, originalPrice: 79.99, rating: 4.6, reviews: 178, image: null },
    { id: 6, name: 'Powerbanka 20000mAh', price: 49.99, originalPrice: null, rating: 4.8, reviews: 334, image: null },
  ];

  const categories = ['Všetky', 'Elektronika', 'Príslušenstvo', 'Audio', 'Nabíjanie'];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/store" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900">TechShop</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                {categories.slice(1).map((cat) => (
                  <a key={cat} href="#" className="text-gray-600 hover:text-gray-900 transition">{cat}</a>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Hľadať produkty..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg"><Heart className="w-6 h-6 text-gray-600" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <ShoppingCart className="w-6 h-6 text-gray-600" />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">{cartCount}</span>}
              </button>
              <button className="hidden md:block p-2 hover:bg-gray-100 rounded-lg"><User className="w-6 h-6 text-gray-600" /></button>
              <button onClick={() => setMobileMenu(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg"><Menu className="w-6 h-6 text-gray-600" /></button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenu(false)} />
          <div className="absolute top-0 right-0 h-full w-72 bg-white">
            <div className="h-16 flex items-center justify-between px-4 border-b">
              <span className="font-bold">Menu</span>
              <button onClick={() => setMobileMenu(false)} className="p-2"><X className="w-6 h-6" /></button>
            </div>
            <nav className="p-4 space-y-2">
              {categories.map((cat) => (
                <a key={cat} href="#" className="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700">{cat}</a>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Najlepšia elektronika</h1>
          <p className="text-xl text-blue-100 mb-8">Zľavy až do 40% na vybrané produkty</p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition">Nakupovať</button>
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Populárne produkty</h2>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5" />Filtrovať
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map((cat, i) => (
              <button key={cat} className={`px-4 py-2 rounded-lg whitespace-nowrap ${i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
                <div className="aspect-square bg-gray-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingCart className="w-12 h-12 text-gray-300" />
                  </div>
                  {product.originalPrice && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                  <button className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">€{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">€{product.originalPrice}</span>
                    )}
                  </div>
                  <button className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                    Do košíka
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <span className="font-bold text-xl">TechShop</span>
              </div>
              <p className="text-gray-400 text-sm">Váš obľúbený obchod s elektronikou</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Nákup</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Ako nakúpiť</a></li>
                <li><a href="#" className="hover:text-white">Doprava</a></li>
                <li><a href="#" className="hover:text-white">Platba</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Podpora</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Kontakt</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Reklamácie</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>info@techshop.sk</li>
                <li>+421 900 123 456</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2026 TechShop. Powered by EshopBuilder</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
