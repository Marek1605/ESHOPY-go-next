'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Search, User, Heart, Menu, X, Star, Filter, ChevronDown, Sparkles, Package, Truck, Shield, Phone, Mail, MapPin } from 'lucide-react';

// Mock data pre obchody
const SHOPS: Record<string, { name: string; template: string; color: string; products: any[] }> = {
  'demo': {
    name: 'Demo Shop',
    template: 'modern',
    color: '#3b82f6',
    products: [
      { id: 1, name: 'Bezdrôtové slúchadlá Pro', price: 89.99, oldPrice: 119.99, rating: 4.8, reviews: 124, category: 'Audio' },
      { id: 2, name: 'Smart Watch Ultra', price: 199.99, rating: 4.9, reviews: 89, category: 'Hodinky' },
      { id: 3, name: 'Prémiový obal na telefón', price: 29.99, oldPrice: 39.99, rating: 4.5, reviews: 256, category: 'Príslušenstvo' },
      { id: 4, name: 'USB-C kábel 2m', price: 14.99, rating: 4.7, reviews: 512, category: 'Káble' },
      { id: 5, name: 'Bluetooth reproduktor', price: 59.99, oldPrice: 79.99, rating: 4.6, reviews: 178, category: 'Audio' },
      { id: 6, name: 'Powerbanka 20000mAh', price: 49.99, rating: 4.8, reviews: 334, category: 'Nabíjanie' },
    ]
  },
  'techshop': {
    name: 'TechShop.sk',
    template: 'modern',
    color: '#0ea5e9',
    products: [
      { id: 1, name: 'Gaming Monitor 27"', price: 349.99, oldPrice: 449.99, rating: 4.9, reviews: 89, category: 'Monitory' },
      { id: 2, name: 'Mechanická klávesnica RGB', price: 129.99, rating: 4.7, reviews: 234, category: 'Klávesnice' },
      { id: 3, name: 'Gaming Mouse Pro', price: 79.99, rating: 4.8, reviews: 456, category: 'Myši' },
      { id: 4, name: 'Herné slúchadlá 7.1', price: 99.99, oldPrice: 129.99, rating: 4.6, reviews: 178, category: 'Audio' },
    ]
  },
  'modadnes': {
    name: 'ModaDnes.sk',
    template: 'fashion',
    color: '#ec4899',
    products: [
      { id: 1, name: 'Elegantné šaty Bella', price: 89.99, oldPrice: 129.99, rating: 4.9, reviews: 67, category: 'Šaty' },
      { id: 2, name: 'Kožená kabelka Premium', price: 159.99, rating: 4.8, reviews: 123, category: 'Kabelky' },
      { id: 3, name: 'Pánsky oblek Classic', price: 299.99, oldPrice: 399.99, rating: 4.7, reviews: 45, category: 'Obleky' },
      { id: 4, name: 'Kožené topánky Oxford', price: 179.99, rating: 4.8, reviews: 89, category: 'Topánky' },
    ]
  },
  'biofood': {
    name: 'BioFood.sk',
    template: 'organic',
    color: '#22c55e',
    products: [
      { id: 1, name: 'Bio Avokádo 3ks', price: 4.99, rating: 4.9, reviews: 234, category: 'Ovocie' },
      { id: 2, name: 'Organický med 500g', price: 12.99, oldPrice: 15.99, rating: 4.8, reviews: 456, category: 'Med' },
      { id: 3, name: 'Bio Quinoa 1kg', price: 8.99, rating: 4.7, reviews: 123, category: 'Obilniny' },
      { id: 4, name: 'Čerstvé Bio vajcia 10ks', price: 5.49, rating: 4.9, reviews: 567, category: 'Mliečne' },
    ]
  },
};

// Template konfigurácie
const TEMPLATES = {
  modern: {
    headerBg: 'bg-white',
    headerText: 'text-gray-900',
    heroBg: 'from-blue-600 to-purple-600',
    cardStyle: 'rounded-xl shadow-lg hover:shadow-xl',
    buttonStyle: 'rounded-lg',
  },
  minimal: {
    headerBg: 'bg-gray-50',
    headerText: 'text-gray-800',
    heroBg: 'from-gray-800 to-gray-900',
    cardStyle: 'rounded-none border border-gray-200',
    buttonStyle: 'rounded-none',
  },
  fashion: {
    headerBg: 'bg-black',
    headerText: 'text-white',
    heroBg: 'from-pink-600 to-rose-500',
    cardStyle: 'rounded-2xl shadow-xl hover:scale-105 transition-transform',
    buttonStyle: 'rounded-full',
  },
  organic: {
    headerBg: 'bg-green-50',
    headerText: 'text-green-900',
    heroBg: 'from-green-600 to-emerald-500',
    cardStyle: 'rounded-xl border-2 border-green-100',
    buttonStyle: 'rounded-xl',
  },
  tech: {
    headerBg: 'bg-slate-900',
    headerText: 'text-white',
    heroBg: 'from-cyan-500 to-blue-600',
    cardStyle: 'rounded-lg bg-slate-800 border border-slate-700',
    buttonStyle: 'rounded-lg',
  },
  luxury: {
    headerBg: 'bg-amber-50',
    headerText: 'text-amber-900',
    heroBg: 'from-amber-600 to-yellow-500',
    cardStyle: 'rounded-xl shadow-2xl border border-amber-200',
    buttonStyle: 'rounded-lg',
  },
};

export default function StorePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string || 'demo';
  const templateOverride = searchParams.get('template');
  
  const [cart, setCart] = useState<number[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Všetky');

  // Načítaj dáta obchodu
  const shop = SHOPS[slug] || SHOPS['demo'];
  const templateId = templateOverride || shop.template;
  const template = TEMPLATES[templateId as keyof typeof TEMPLATES] || TEMPLATES.modern;
  const primaryColor = shop.color;

  const categories = ['Všetky', ...new Set(shop.products.map(p => p.category))];
  const filteredProducts = selectedCategory === 'Všetky' 
    ? shop.products 
    : shop.products.filter(p => p.category === selectedCategory);

  const addToCart = (id: number) => {
    setCart([...cart, id]);
  };

  // Dark mode pre niektoré šablóny
  const isDark = templateId === 'tech' || templateId === 'fashion';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className={`${template.headerBg} ${template.headerText} border-b sticky top-0 z-50 ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href={`/store/${slug}`} className="flex items-center gap-2">
                <div className={`w-10 h-10 ${template.buttonStyle} flex items-center justify-center`} style={{ background: primaryColor }}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl">{shop.name}</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                {categories.slice(1, 5).map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`hover:opacity-80 transition ${selectedCategory === cat ? 'font-semibold' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className={`hidden md:block relative w-64`}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
                <input 
                  type="text" 
                  placeholder="Hľadať..." 
                  className={`w-full pl-10 pr-4 py-2 ${template.buttonStyle} text-sm focus:outline-none focus:ring-2 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-100 border-gray-200'
                  }`}
                />
              </div>
              <button className="p-2 hover:opacity-80 transition relative">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-2 hover:opacity-80 transition relative">
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center"
                    style={{ background: primaryColor }}
                  >
                    {cart.length}
                  </span>
                )}
              </button>
              <button className="hidden md:block p-2 hover:opacity-80 transition">
                <User className="w-6 h-6" />
              </button>
              <button onClick={() => setMobileMenu(true)} className="md:hidden p-2">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenu(false)} />
          <div className={`absolute top-0 right-0 h-full w-72 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
              <span className="font-bold">Menu</span>
              <button onClick={() => setMobileMenu(false)}><X className="w-6 h-6" /></button>
            </div>
            <nav className="p-4 space-y-2">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => { setSelectedCategory(cat); setMobileMenu(false); }}
                  className={`block w-full text-left px-4 py-3 rounded-lg ${
                    selectedCategory === cat 
                      ? isDark ? 'bg-slate-800' : 'bg-gray-100' 
                      : ''
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className={`bg-gradient-to-r ${template.heroBg} text-white py-16`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Vitajte v {shop.name}</h1>
          <p className="text-xl opacity-90 mb-8">Najlepšie produkty za skvelé ceny</p>
          <button 
            className={`px-8 py-3 bg-white font-semibold hover:bg-gray-100 transition ${template.buttonStyle}`}
            style={{ color: primaryColor }}
          >
            Nakupovať
          </button>
        </div>
      </section>

      {/* Features */}
      <section className={`py-8 border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, text: 'Doprava zadarmo od €50' },
            { icon: Shield, text: '2 roky záruka' },
            { icon: Package, text: 'Vrátenie do 30 dní' },
            { icon: Phone, text: 'Podpora 24/7' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 justify-center py-2">
              <f.icon className="w-5 h-5 opacity-70" />
              <span className="text-sm">{f.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold">
              {selectedCategory === 'Všetky' ? 'Všetky produkty' : selectedCategory}
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 whitespace-nowrap text-sm font-medium transition ${template.buttonStyle} ${
                    selectedCategory === cat 
                      ? 'text-white' 
                      : isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={selectedCategory === cat ? { background: primaryColor } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className={`${template.cardStyle} overflow-hidden group ${isDark ? 'bg-slate-800' : 'bg-white'}`}
              >
                <div className={`aspect-square relative ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="w-16 h-16 opacity-30" />
                  </div>
                  {product.oldPrice && (
                    <span 
                      className={`absolute top-3 left-3 px-2 py-1 text-white text-xs font-semibold ${template.buttonStyle}`}
                      style={{ background: primaryColor }}
                    >
                      -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                    </span>
                  )}
                  <button className={`absolute top-3 right-3 p-2 bg-white/80 ${template.buttonStyle} opacity-0 group-hover:opacity-100 transition`}>
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="text-xs opacity-60 mb-1">{product.category}</div>
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-current" style={{ color: '#fbbf24' }} />
                    <span className="text-sm opacity-70">{product.rating} ({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold" style={{ color: primaryColor }}>€{product.price}</span>
                      {product.oldPrice && (
                        <span className="text-sm opacity-50 line-through ml-2">€{product.oldPrice}</span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => addToCart(product.id)}
                    className={`w-full mt-3 py-2 text-white font-medium transition hover:opacity-90 ${template.buttonStyle}`}
                    style={{ background: primaryColor }}
                  >
                    Do košíka
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={`py-16 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Odoberajte novinky</h2>
          <p className="opacity-70 mb-6">Získajte 10% zľavu na prvý nákup</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Váš email" 
              className={`flex-1 px-4 py-3 ${template.buttonStyle} ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'} border`}
            />
            <button 
              className={`px-6 py-3 text-white font-medium ${template.buttonStyle}`}
              style={{ background: primaryColor }}
            >
              Odoberať
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 ${isDark ? 'bg-slate-950' : 'bg-gray-900'} text-white`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-10 h-10 ${template.buttonStyle} flex items-center justify-center`} style={{ background: primaryColor }}>
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="font-bold text-xl">{shop.name}</span>
              </div>
              <p className="text-gray-400 text-sm">Váš obľúbený online obchod</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Nákup</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Ako nakúpiť</a></li>
                <li><a href="#" className="hover:text-white">Doprava a platba</a></li>
                <li><a href="#" className="hover:text-white">Reklamácie</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Podpora</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Kontakt</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Obchodné podmienky</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@{slug}.sk</li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +421 900 123 456</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Bratislava, SK</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2026 {shop.name}. Všetky práva vyhradené.</p>
            <p className="text-gray-500 text-xs">Powered by <span style={{ color: primaryColor }}>EshopBuilder</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
