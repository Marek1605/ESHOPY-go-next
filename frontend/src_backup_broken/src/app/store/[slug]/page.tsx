'use client';
import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Search, Heart, Menu, X, Star, Sparkles, Package, Truck, Shield, Phone, Mail, MapPin, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/store';

const SHOPS: Record<string, { name: string; template: string; color: string; products: any[] }> = {
  'demo': {
    name: 'Demo Shop',
    template: 'modern',
    color: '#3b82f6',
    products: [
      { id: '1', name: 'Bezdrôtové slúchadlá Pro', price: 89.99, oldPrice: 119.99, rating: 4.8, reviews: 124, category: 'Audio' },
      { id: '2', name: 'Smart Watch Ultra', price: 199.99, rating: 4.9, reviews: 89, category: 'Hodinky' },
      { id: '3', name: 'Prémiový obal na telefón', price: 29.99, oldPrice: 39.99, rating: 4.5, reviews: 256, category: 'Príslušenstvo' },
      { id: '4', name: 'USB-C kábel 2m', price: 14.99, rating: 4.7, reviews: 512, category: 'Káble' },
      { id: '5', name: 'Bluetooth reproduktor', price: 59.99, oldPrice: 79.99, rating: 4.6, reviews: 178, category: 'Audio' },
      { id: '6', name: 'Powerbanka 20000mAh', price: 49.99, rating: 4.8, reviews: 334, category: 'Nabíjanie' },
    ]
  },
  'techshop': {
    name: 'TechShop.sk',
    template: 'tech',
    color: '#0ea5e9',
    products: [
      { id: '1', name: 'Gaming Monitor 27"', price: 349.99, oldPrice: 449.99, rating: 4.9, reviews: 89, category: 'Monitory' },
      { id: '2', name: 'Mechanická klávesnica RGB', price: 129.99, rating: 4.7, reviews: 234, category: 'Klávesnice' },
      { id: '3', name: 'Gaming Mouse Pro', price: 79.99, rating: 4.8, reviews: 456, category: 'Myši' },
      { id: '4', name: 'Herné slúchadlá 7.1', price: 99.99, oldPrice: 129.99, rating: 4.6, reviews: 178, category: 'Audio' },
    ]
  },
};

const TEMPLATES = {
  modern: { headerBg: 'bg-white', headerText: 'text-gray-900', cardStyle: 'rounded-xl shadow-lg hover:shadow-xl', buttonStyle: 'rounded-lg' },
  tech: { headerBg: 'bg-slate-900', headerText: 'text-white', cardStyle: 'rounded-lg bg-slate-800 border border-slate-700', buttonStyle: 'rounded-lg' },
  fashion: { headerBg: 'bg-black', headerText: 'text-white', cardStyle: 'rounded-2xl shadow-xl', buttonStyle: 'rounded-full' },
  organic: { headerBg: 'bg-green-50', headerText: 'text-green-900', cardStyle: 'rounded-xl border-2 border-green-100', buttonStyle: 'rounded-xl' },
};

export default function StorePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string || 'demo';
  const templateOverride = searchParams.get('template');
  
  const { items, addItem, removeItem, updateQuantity, isOpen, setCartOpen, total } = useCart();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Všetky');

  const shop = SHOPS[slug] || SHOPS['demo'];
  const templateId = templateOverride || shop.template;
  const template = TEMPLATES[templateId as keyof typeof TEMPLATES] || TEMPLATES.modern;
  const primaryColor = shop.color;

  const categories = ['Všetky', ...Array.from(new Set(shop.products.map(p => p.category)))];
  const filteredProducts = selectedCategory === 'Všetky' ? shop.products : shop.products.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product: any) => {
    addItem({ id: product.id, name: product.name, price: product.price });
    setCartOpen(true);
  };

  const isDark = templateId === 'tech' || templateId === 'fashion';
  const cartTotal = total();
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Cart Sidebar */}
      <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setCartOpen(false)} />
      <div className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold text-gray-900">Košík ({items.length})</h2>
            <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-600" /></button>
          </div>
          
          {remainingForFreeShipping > 0 ? (
            <div className="px-4 py-3 bg-blue-50 text-blue-700 text-sm">Do dopravy zadarmo vám chýba <strong>€{remainingForFreeShipping.toFixed(2)}</strong></div>
          ) : items.length > 0 ? (
            <div className="px-4 py-3 bg-green-50 text-green-700 text-sm font-medium">✓ Máte dopravu zadarmo!</div>
          ) : null}

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Váš košík je prázdny</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center"><Package className="w-8 h-8 text-gray-400" /></div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                      <p className="font-bold text-gray-900">€{item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-gray-200 rounded"><Minus className="w-4 h-4 text-gray-600" /></button>
                        <span className="w-8 text-center text-sm text-gray-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-200 rounded"><Plus className="w-4 h-4 text-gray-600" /></button>
                        <button onClick={() => removeItem(item.id)} className="p-1 hover:bg-red-100 rounded ml-auto"><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between text-lg font-bold text-gray-900"><span>Celkom:</span><span>€{cartTotal.toFixed(2)}</span></div>
              <Link href={`/store/${slug}/checkout`} className="block w-full py-3 text-center text-white font-semibold rounded-lg" style={{ background: primaryColor }} onClick={() => setCartOpen(false)}>Pokračovať k pokladni</Link>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <header className={`${template.headerBg} ${template.headerText} border-b sticky top-0 z-40 ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href={`/store/${slug}`} className="flex items-center gap-2">
                <div className={`w-10 h-10 ${template.buttonStyle} flex items-center justify-center`} style={{ background: primaryColor }}><Sparkles className="w-6 h-6 text-white" /></div>
                <span className="font-bold text-xl">{shop.name}</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                {categories.slice(1, 5).map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`hover:opacity-80 transition ${selectedCategory === cat ? 'font-semibold' : ''}`}>{cat}</button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
                <input type="text" placeholder="Hľadať..." className={`w-full pl-10 pr-4 py-2 ${template.buttonStyle} text-sm focus:outline-none focus:ring-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-100 border-gray-200'}`} />
              </div>
              <button className="p-2 hover:opacity-80 transition relative"><Heart className="w-6 h-6" /></button>
              <button onClick={() => setCartOpen(true)} className="p-2 hover:opacity-80 transition relative">
                <ShoppingCart className="w-6 h-6" />
                {items.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 text-xs text-white rounded-full flex items-center justify-center" style={{ background: primaryColor }}>{items.length}</span>}
              </button>
              <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2">{mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16`} style={{ background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}dd)` }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Vitajte v {shop.name}</h1>
          <p className="text-xl opacity-90 mb-8">Objavte najlepšie produkty za skvelé ceny</p>
          <div className="flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-2"><Truck className="w-5 h-5" /><span>Doprava zadarmo od €50</span></div>
            <div className="flex items-center gap-2"><Shield className="w-5 h-5" /><span>Záruka vrátenia</span></div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full whitespace-nowrap transition ${selectedCategory === cat ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`} style={selectedCategory === cat ? { background: primaryColor } : {}}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className={`${template.cardStyle} overflow-hidden transition-all ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"><Package className="w-16 h-16 text-gray-400" /></div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{product.rating}</span>
                    <span className="text-sm text-gray-400">({product.reviews})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold" style={{ color: primaryColor }}>€{product.price}</span>
                    {product.oldPrice && <span className="text-sm text-gray-400 line-through">€{product.oldPrice}</span>}
                  </div>
                  <button onClick={() => handleAddToCart(product)} className={`w-full mt-3 py-2 text-white font-medium transition hover:opacity-90 ${template.buttonStyle}`} style={{ background: primaryColor }}>Do košíka</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 ${isDark ? 'bg-slate-800' : 'bg-gray-900'} text-white`}>
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: primaryColor }}><Sparkles className="w-6 h-6" /></div>
              <span className="font-bold text-xl">{shop.name}</span>
            </div>
            <p className="text-gray-400">Váš obľúbený e-shop s najlepšími produktami.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>+421 900 123 456</span></div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /><span>info@{slug}.sk</span></div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>Bratislava, SK</span></div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Informácie</h4>
            <div className="space-y-2 text-gray-400">
              <p>O nás</p><p>Obchodné podmienky</p><p>Ochrana súkromia</p><p>Reklamácie</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Prihláste sa a získajte 10% zľavu</p>
            <div className="flex">
              <input type="email" placeholder="Váš email" className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border-gray-700 text-white" />
              <button className="px-4 py-2 rounded-r-lg text-white" style={{ background: primaryColor }}>OK</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© 2024 {shop.name}. Powered by EshopBuilder</p>
        </div>
      </footer>
    </div>
  );
}
