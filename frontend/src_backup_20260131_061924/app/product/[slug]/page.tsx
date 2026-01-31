'use client';

// ═══════════════════════════════════════════════════════════════════════════
// ESHOPY - PROFESSIONAL PRODUCT PAGE
// Complete product detail with gallery, offers, reviews, specs, AI assistant
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Product, 
  ProductOffer, 
  ProductReview, 
  ProductAttribute,
  ProductFAQ,
  StockStatus 
} from '@/types';
import { 
  formatPrice, 
  getStockLabel, 
  getStockIcon,
  getDiscountPercentage,
  getRatingStars,
  truncate 
} from '@/lib/store';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const mockProduct: Product = {
  id: 'prod-001',
  name: 'Samsung Galaxy S24 Ultra 256GB Titanium Black',
  slug: 'samsung-galaxy-s24-ultra-256gb-titanium-black',
  description: `
    <h3>Špičkový smartfón s revolučnou AI</h3>
    <p>Samsung Galaxy S24 Ultra prináša novú éru mobilnej AI s funkciami Galaxy AI. 
    S najnovším procesorom Snapdragon 8 Gen 3 a 12GB RAM zvládne všetko, 
    čo naň hodíte.</p>
    
    <h4>Hlavné vlastnosti:</h4>
    <ul>
      <li>6.8" Dynamic AMOLED 2X displej s rozlíšením QHD+</li>
      <li>200MP hlavná kamera s pokročilým nočným režimom</li>
      <li>Integrované S Pen pre presné ovládanie</li>
      <li>5000mAh batéria s 45W rýchlym nabíjaním</li>
      <li>Titánový rám pre maximálnu odolnosť</li>
    </ul>
    
    <h4>Galaxy AI funkcie:</h4>
    <p>Live Translate, Circle to Search, Chat Assist, Note Assist a mnohé ďalšie 
    AI funkcie vám pomôžu byť produktívnejší každý deň.</p>
  `,
  shortDescription: 'Špičkový smartfón s Galaxy AI, 200MP kamerou a S Pen',
  ean: '8806095073477',
  sku: 'SM-S928BZKHEUE',
  brand: 'Samsung',
  manufacturer: 'Samsung Electronics',
  images: [
    { id: '1', url: 'https://images.samsung.com/sk/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-color-titanium-black-front.jpg', alt: 'Samsung Galaxy S24 Ultra predná strana', order: 1, isMain: true },
    { id: '2', url: 'https://images.samsung.com/sk/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-color-titanium-black-back.jpg', alt: 'Samsung Galaxy S24 Ultra zadná strana', order: 2 },
    { id: '3', url: 'https://images.samsung.com/sk/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-spen.jpg', alt: 'S Pen', order: 3 },
    { id: '4', url: 'https://images.samsung.com/sk/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-camera.jpg', alt: 'Kamera detail', order: 4 },
    { id: '5', url: 'https://images.samsung.com/sk/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-display.jpg', alt: 'Displej', order: 5 },
    { id: '6', url: 'https://images.samsung.com/sk/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-gaming.jpg', alt: 'Gaming', order: 6 },
  ],
  price: 1299.00,
  originalPrice: 1449.00,
  currency: 'EUR',
  categoryId: 'cat-smartphones',
  categoryPath: ['Elektronika', 'Mobilné telefóny', 'Smartfóny'],
  attributes: [
    { id: 'a1', name: 'Displej', value: '6.8"', group: 'Displej', order: 1 },
    { id: 'a2', name: 'Rozlíšenie', value: '3088 x 1440 (QHD+)', group: 'Displej', order: 2 },
    { id: 'a3', name: 'Technológia', value: 'Dynamic AMOLED 2X', group: 'Displej', order: 3 },
    { id: 'a4', name: 'Obnovovacia frekvencia', value: '1-120Hz', group: 'Displej', order: 4 },
    { id: 'a5', name: 'Procesor', value: 'Snapdragon 8 Gen 3', group: 'Výkon', order: 5 },
    { id: 'a6', name: 'RAM', value: '12 GB', group: 'Výkon', order: 6 },
    { id: 'a7', name: 'Interná pamäť', value: '256 GB', group: 'Výkon', order: 7 },
    { id: 'a8', name: 'Hlavná kamera', value: '200 MP', group: 'Fotoaparát', order: 8 },
    { id: 'a9', name: 'Ultraširokouhlá', value: '12 MP', group: 'Fotoaparát', order: 9 },
    { id: 'a10', name: 'Teleobjektív 3x', value: '10 MP', group: 'Fotoaparát', order: 10 },
    { id: 'a11', name: 'Teleobjektív 5x', value: '50 MP', group: 'Fotoaparát', order: 11 },
    { id: 'a12', name: 'Predná kamera', value: '12 MP', group: 'Fotoaparát', order: 12 },
    { id: 'a13', name: 'Batéria', value: '5000 mAh', group: 'Batéria', order: 13 },
    { id: 'a14', name: 'Rýchle nabíjanie', value: '45W', group: 'Batéria', order: 14 },
    { id: 'a15', name: 'Bezdrôtové nabíjanie', value: '15W', group: 'Batéria', order: 15 },
    { id: 'a16', name: 'Operačný systém', value: 'Android 14, One UI 6.1', group: 'Softvér', order: 16 },
    { id: 'a17', name: 'Odolnosť', value: 'IP68', group: 'Konštrukcia', order: 17 },
    { id: 'a18', name: 'Rozmery', value: '162.3 x 79.0 x 8.6 mm', group: 'Konštrukcia', order: 18 },
    { id: 'a19', name: 'Hmotnosť', value: '232 g', group: 'Konštrukcia', order: 19 },
    { id: 'a20', name: 'S Pen', value: 'Áno, integrovaný', group: 'Príslušenstvo', order: 20 },
  ],
  offers: [
    {
      id: 'o1',
      vendorId: 'v1',
      vendorName: 'Alza.sk',
      vendorLogo: 'https://logo.clearbit.com/alza.sk',
      vendorRating: 4.8,
      vendorReviewCount: 15420,
      price: 1299.00,
      originalPrice: 1449.00,
      currency: 'EUR',
      stock: 'in_stock',
      deliveryTime: 'Zajtra u vás',
      deliveryPrice: 0,
      url: 'https://alza.sk/samsung-galaxy-s24-ultra',
      isBestOffer: true,
      lastUpdated: '2025-01-30T10:00:00Z',
    },
    {
      id: 'o2',
      vendorId: 'v2',
      vendorName: 'Datart.sk',
      vendorLogo: 'https://logo.clearbit.com/datart.sk',
      vendorRating: 4.5,
      vendorReviewCount: 8750,
      price: 1319.00,
      currency: 'EUR',
      stock: 'in_stock',
      deliveryTime: '2-3 dni',
      deliveryPrice: 3.99,
      url: 'https://datart.sk/samsung-galaxy-s24-ultra',
      lastUpdated: '2025-01-30T09:30:00Z',
    },
    {
      id: 'o3',
      vendorId: 'v3',
      vendorName: 'Mall.sk',
      vendorLogo: 'https://logo.clearbit.com/mall.sk',
      vendorRating: 4.3,
      vendorReviewCount: 12300,
      price: 1329.00,
      currency: 'EUR',
      stock: 'low_stock',
      deliveryTime: '3-5 dní',
      deliveryPrice: 0,
      url: 'https://mall.sk/samsung-galaxy-s24-ultra',
      lastUpdated: '2025-01-30T08:00:00Z',
    },
    {
      id: 'o4',
      vendorId: 'v4',
      vendorName: 'NAY.sk',
      vendorLogo: 'https://logo.clearbit.com/nay.sk',
      vendorRating: 4.6,
      vendorReviewCount: 9800,
      price: 1349.00,
      originalPrice: 1449.00,
      currency: 'EUR',
      stock: 'in_stock',
      deliveryTime: '1-2 dni',
      deliveryPrice: 4.99,
      url: 'https://nay.sk/samsung-galaxy-s24-ultra',
      lastUpdated: '2025-01-30T11:00:00Z',
    },
    {
      id: 'o5',
      vendorId: 'v5',
      vendorName: 'Hej.sk',
      vendorLogo: 'https://logo.clearbit.com/hej.sk',
      vendorRating: 4.4,
      vendorReviewCount: 6500,
      price: 1359.00,
      currency: 'EUR',
      stock: 'out_of_stock',
      deliveryTime: 'Nedostupné',
      url: 'https://hej.sk/samsung-galaxy-s24-ultra',
      lastUpdated: '2025-01-30T07:00:00Z',
    },
  ],
  reviews: [
    {
      id: 'r1',
      userName: 'Martin K.',
      rating: 5,
      title: 'Najlepší telefón aký som mal',
      content: 'Po mesiaci používania môžem povedať, že je to najlepší telefón aký som kedy vlastnil. Galaxy AI funkcie sú revolučné, preklad v reálnom čase je úžasný. Kamera robí neskutočné fotky aj v noci.',
      pros: ['Výborná kamera', 'Rýchly procesor', 'Galaxy AI', 'Dlhá výdrž batérie'],
      cons: ['Vyššia cena', 'Trochu ťažší'],
      isVerified: true,
      helpfulCount: 45,
      createdAt: '2025-01-15T14:30:00Z',
    },
    {
      id: 'r2',
      userName: 'Petra S.',
      rating: 4,
      title: 'Skvelý, ale drahý',
      content: 'Telefón je fantastický po všetkých stránkach. Displej je nádherný, výkon brutálny. Jediný mínus je cena, ale za túto kvalitu to stojí.',
      pros: ['Krásny displej', 'S Pen', 'Prémiový dizajn'],
      cons: ['Vysoká cena'],
      isVerified: true,
      helpfulCount: 32,
      createdAt: '2025-01-10T09:15:00Z',
    },
    {
      id: 'r3',
      userName: 'Jozef M.',
      rating: 5,
      title: 'Perfektný upgrade z S21',
      content: 'Prešiel som z S21 Ultra a rozdiel je obrovský. Hlavne kamera a tie nové AI funkcie sú game changer. Circle to Search používam denne.',
      pros: ['AI funkcie', '200MP kamera', 'Výdrž batérie', 'Kvalitný displej'],
      cons: [],
      isVerified: true,
      helpfulCount: 28,
      createdAt: '2025-01-05T16:45:00Z',
    },
  ],
  rating: 4.7,
  reviewCount: 156,
  stock: 'in_stock',
  deliveryTime: 'Zajtra u vás',
  faq: [
    { id: 'f1', question: 'Podporuje S24 Ultra eSIM?', answer: 'Áno, Samsung Galaxy S24 Ultra podporuje eSIM aj fyzickú nano SIM kartu súčasne.', isAIGenerated: true },
    { id: 'f2', question: 'Koľko vydrží batéria?', answer: 'Pri bežnom používaní vydrží batéria celý deň. Pri intenzívnom používaní približne 8-10 hodín.', isAIGenerated: true },
    { id: 'f3', question: 'Je telefón vodeodolný?', answer: 'Áno, S24 Ultra má certifikáciu IP68, čo znamená odolnosť voči vode do hĺbky 1.5m po dobu 30 minút.', isAIGenerated: true },
    { id: 'f4', question: 'Má slúchadlový jack?', answer: 'Nie, Samsung Galaxy S24 Ultra nemá 3.5mm jack. Môžete použiť USB-C slúchadlá alebo bezdrôtové.', isAIGenerated: true },
  ],
  seoTitle: 'Samsung Galaxy S24 Ultra 256GB | Najlepšia cena | ESHOPY',
  seoDescription: 'Kúpte Samsung Galaxy S24 Ultra 256GB Titanium Black za najlepšiu cenu. Galaxy AI, 200MP kamera, S Pen. Porovnanie cien z overených obchodov.',
  createdAt: '2024-01-17T00:00:00Z',
  updatedAt: '2025-01-30T12:00:00Z',
  isActive: true,
  isFeatured: true,
  tags: ['smartphone', 'samsung', 'galaxy', 's24', 'ultra', 'ai', '5g'],
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// Rating Stars Component
const RatingStars = ({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
  const { full, half, empty } = getRatingStars(rating);
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';
  
  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`}>
      {[...Array(full)].map((_, i) => (
        <span key={`full-${i}`} className="text-yellow-400">★</span>
      ))}
      {half && <span className="text-yellow-400">☆</span>}
      {[...Array(empty)].map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-300">★</span>
      ))}
    </div>
  );
};

// Stock Badge Component
const StockBadge = ({ stock }: { stock: StockStatus }) => {
  const { label, color } = getStockLabel(stock);
  const icon = getStockIcon(stock);
  
  const colorClasses: Record<string, string> = {
    green: 'bg-green-100 text-green-700 border-green-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium rounded-full border ${colorClasses[color]}`}>
      <span>{icon}</span>
      {label}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PRODUCT PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  
  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'offers' | 'description' | 'specs' | 'reviews' | 'faq'>('offers');
  const [offerFilter, setOfferFilter] = useState<'all' | 'instock'>('all');
  const [offerSort, setOfferSort] = useState<'price' | 'rating' | 'name'>('price');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Load product
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setProduct(mockProduct);
      setLoading(false);
    };
    loadProduct();
  }, [params.slug]);

  // Check wishlist/compare status
  useEffect(() => {
    if (typeof window !== 'undefined' && product) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const compare = JSON.parse(localStorage.getItem('compare') || '[]');
      setIsWishlisted(wishlist.includes(product.id));
      setIsComparing(compare.includes(product.id));
    }
  }, [product]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen || !product) return;
      
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') setSelectedImage(prev => Math.max(0, prev - 1));
      if (e.key === 'ArrowRight') setSelectedImage(prev => Math.min(product.images.length - 1, prev + 1));
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, product]);

  // Filtered and sorted offers
  const filteredOffers = useMemo(() => {
    if (!product) return [];
    
    let offers = [...product.offers];
    
    if (offerFilter === 'instock') {
      offers = offers.filter(o => o.stock === 'in_stock' || o.stock === 'low_stock');
    }
    
    offers.sort((a, b) => {
      if (offerSort === 'price') return a.price - b.price;
      if (offerSort === 'rating') return (b.vendorRating || 0) - (a.vendorRating || 0);
      return a.vendorName.localeCompare(b.vendorName);
    });
    
    return offers;
  }, [product, offerFilter, offerSort]);

  // Best offer
  const bestOffer = useMemo(() => {
    if (!product) return null;
    return product.offers.find(o => o.isBestOffer) || product.offers[0];
  }, [product]);

  // Grouped attributes
  const groupedAttributes = useMemo(() => {
    if (!product) return {};
    
    return product.attributes.reduce((acc, attr) => {
      const group = attr.group || 'Ostatné';
      if (!acc[group]) acc[group] = [];
      acc[group].push(attr);
      return acc;
    }, {} as Record<string, ProductAttribute[]>);
  }, [product]);

  // Rating distribution
  const ratingDistribution = useMemo(() => {
    if (!product) return [];
    
    const counts = [0, 0, 0, 0, 0];
    product.reviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++;
    });
    
    const total = product.reviews.length;
    return [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: counts[stars - 1],
      percentage: total > 0 ? (counts[stars - 1] / total) * 100 : 0,
    }));
  }, [product]);

  // Handlers
  const toggleWishlist = useCallback(() => {
    if (!product) return;
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const newWishlist = isWishlisted 
      ? wishlist.filter((id: string) => id !== product.id)
      : [...wishlist, product.id];
    
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    setIsWishlisted(!isWishlisted);
  }, [product, isWishlisted]);

  const toggleCompare = useCallback(() => {
    if (!product) return;
    
    const compare = JSON.parse(localStorage.getItem('compare') || '[]');
    if (!isComparing && compare.length >= 4) {
      alert('Môžete porovnávať maximálne 4 produkty');
      return;
    }
    
    const newCompare = isComparing
      ? compare.filter((id: string) => id !== product.id)
      : [...compare, product.id];
    
    localStorage.setItem('compare', JSON.stringify(newCompare));
    setIsComparing(!isComparing);
  }, [product, isComparing]);

  const handleOfferClick = useCallback((offer: ProductOffer) => {
    // Track click for CPC
    console.log('Tracking click:', offer.id, offer.vendorId);
    // Open vendor URL
    window.open(offer.url, '_blank');
  }, []);

  const handleAiAsk = useCallback(async () => {
    if (!aiQuestion.trim() || !product) return;
    
    setAiLoading(true);
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAiResponse(`Na základe informácií o produkte ${product.name}: ${aiQuestion.includes('batéria') ? 'Batéria s kapacitou 5000 mAh vydrží pri bežnom používaní celý deň. Podporuje 45W rýchle nabíjanie.' : 'Tento produkt patrí medzi špičku vo svojej kategórii a ponúka vynikajúci pomer cena/výkon.'}`);
    setAiLoading(false);
  }, [aiQuestion, product]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Not found
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Produkt nenájdený</h1>
        <button onClick={() => router.back()} className="text-primary hover:underline">
          ← Späť
        </button>
      </div>
    );
  }

  const discount = getDiscountPercentage(product.price, product.originalPrice || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm">
            <li><a href="/" className="text-gray-500 hover:text-primary">Domov</a></li>
            {product.categoryPath?.map((cat, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-gray-300">/</span>
                <a href="#" className="text-gray-500 hover:text-primary">{cat}</a>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Gallery */}
          <div className="lg:col-span-5">
            {/* Main Image */}
            <div 
              className="relative bg-white rounded-2xl border overflow-hidden cursor-zoom-in aspect-square"
              onClick={() => setLightboxOpen(true)}
            >
              {discount > 0 && (
                <span className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  -{discount}%
                </span>
              )}
              <img
                src={product.images[selectedImage]?.url || '/placeholder.png'}
                alt={product.images[selectedImage]?.alt || product.name}
                className="w-full h-full object-contain p-8 transition-transform hover:scale-105"
              />
              <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                Kliknite pre zväčšenie
              </div>
            </div>

            {/* Thumbnails */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {product.images.slice(0, 6).map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                    selectedImage === i 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={img.url} 
                    alt={img.alt || `Obrázok ${i + 1}`}
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
              {product.images.length > 6 && (
                <button 
                  onClick={() => setLightboxOpen(true)}
                  className="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-gray-200 flex items-center justify-center text-sm text-gray-500 hover:bg-gray-50"
                >
                  +{product.images.length - 6}
                </button>
              )}
            </div>
          </div>

          {/* Middle Column - Info */}
          <div className="lg:col-span-4">
            {/* Brand & Title */}
            <div className="mb-4">
              {product.brand && (
                <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
              )}
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <RatingStars rating={product.rating} />
              <span className="font-semibold text-gray-900">{product.rating.toFixed(1)}</span>
              <a href="#reviews" className="text-sm text-gray-500 hover:text-primary">
                ({product.reviewCount} recenzií)
              </a>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-600 mb-6">{product.shortDescription}</p>
            )}

            {/* Key Specs */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Hlavné parametre</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {product.attributes.slice(0, 6).map(attr => (
                  <div key={attr.id} className="flex justify-between">
                    <dt className="text-gray-500">{attr.name}</dt>
                    <dd className="font-medium text-gray-900">{attr.value}</dd>
                  </div>
                ))}
              </dl>
              <button 
                onClick={() => setActiveTab('specs')}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Všetky parametre →
              </button>
            </div>

            {/* Codes */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-6">
              {product.ean && <span>EAN: {product.ean}</span>}
              {product.sku && <span>SKU: {product.sku}</span>}
            </div>

            {/* AI Assistant */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🤖</span>
                <h3 className="font-semibold text-gray-900">AI Asistent</h3>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Beta</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {['Opýtaj sa', 'Porovnaj', 'Alternatívy', 'Recenzie'].map(action => (
                  <button
                    key={action}
                    onClick={() => setAiQuestion(action === 'Opýtaj sa' ? '' : `${action} tohto produktu`)}
                    className="text-xs px-3 py-1.5 bg-white rounded-full border hover:border-purple-300 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={e => setAiQuestion(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAiAsk()}
                  placeholder="Napíš otázku o produkte..."
                  className="flex-1 text-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
                <button
                  onClick={handleAiAsk}
                  disabled={aiLoading || !aiQuestion.trim()}
                  className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {aiLoading ? '...' : '→'}
                </button>
              </div>
              
              {aiResponse && (
                <div className="mt-3 p-3 bg-white rounded-lg text-sm text-gray-700">
                  {aiResponse}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Buy Box */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border shadow-lg p-6 sticky top-4">
              {/* Best Offer Badge */}
              {bestOffer?.isBestOffer && (
                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    ✓ Najlepšia ponuka
                  </span>
                </div>
              )}

              {/* Vendor Info */}
              {bestOffer && (
                <div className="flex items-center gap-3 mb-4">
                  {bestOffer.vendorLogo && (
                    <img 
                      src={bestOffer.vendorLogo} 
                      alt={bestOffer.vendorName}
                      className="w-10 h-10 rounded-lg object-contain bg-gray-50 p-1"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{bestOffer.vendorName}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <RatingStars rating={bestOffer.vendorRating || 0} size="sm" />
                      <span className="text-gray-500">({bestOffer.vendorReviewCount})</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-4">
                <StockBadge stock={bestOffer?.stock || product.stock} />
                {bestOffer?.deliveryTime && (
                  <span className="text-sm text-gray-600">{bestOffer.deliveryTime}</span>
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-red-500 text-sm font-semibold">
                      -{discount}%
                    </span>
                  </div>
                )}
                <div className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </div>
                {bestOffer && (
                  <p className="text-sm text-gray-500 mt-1">
                    {bestOffer.deliveryPrice === 0 
                      ? '✓ Doprava zadarmo' 
                      : `+ ${formatPrice(bestOffer.deliveryPrice)} doprava`}
                  </p>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => bestOffer && handleOfferClick(bestOffer)}
                disabled={!bestOffer || bestOffer.stock === 'out_of_stock'}
                className="w-full py-4 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primary-hover transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
              >
                {bestOffer?.stock === 'out_of_stock' ? 'Nedostupné' : 'Kúpiť za najlepšiu cenu'}
              </button>

              {/* Secondary Actions */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={toggleWishlist}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-colors ${
                    isWishlisted 
                      ? 'bg-red-50 border-red-200 text-red-600' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span>{isWishlisted ? '❤️' : '🤍'}</span>
                  <span className="text-sm">Obľúbené</span>
                </button>
                <button
                  onClick={toggleCompare}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-colors ${
                    isComparing 
                      ? 'bg-blue-50 border-blue-200 text-blue-600' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span>📊</span>
                  <span className="text-sm">Porovnať</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">🔒</span>
                  <span>Bezpečný nákup</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">🚚</span>
                  <span>Rýchle doručenie</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-500">↩️</span>
                  <span>30 dní na vrátenie</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          {/* Tab Headers */}
          <div className="flex border-b overflow-x-auto">
            {[
              { id: 'offers', label: `Ponuky (${product.offers.length})` },
              { id: 'description', label: 'Popis' },
              { id: 'specs', label: 'Parametre' },
              { id: 'reviews', label: `Recenzie (${product.reviewCount})` },
              { id: 'faq', label: 'Otázky' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-b-2xl border border-t-0 p-6">
            
            {/* Offers Tab */}
            {activeTab === 'offers' && (
              <div>
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOfferFilter('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        offerFilter === 'all' 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      Všetky
                    </button>
                    <button
                      onClick={() => setOfferFilter('instock')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        offerFilter === 'instock' 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      Skladom
                    </button>
                  </div>
                  <select
                    value={offerSort}
                    onChange={e => setOfferSort(e.target.value as typeof offerSort)}
                    className="px-4 py-2 rounded-lg border text-sm"
                  >
                    <option value="price">Podľa ceny</option>
                    <option value="rating">Podľa hodnotenia</option>
                    <option value="name">Podľa názvu</option>
                  </select>
                </div>

                {/* Offers List */}
                <div className="space-y-3">
                  {filteredOffers.map((offer, i) => (
                    <div
                      key={offer.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-shadow hover:shadow-md ${
                        offer.isBestOffer ? 'bg-green-50 border-green-200' : 'bg-white'
                      }`}
                    >
                      {/* Vendor */}
                      <div className="flex items-center gap-3 min-w-[200px]">
                        {offer.vendorLogo && (
                          <img 
                            src={offer.vendorLogo} 
                            alt={offer.vendorName}
                            className="w-12 h-12 rounded-lg object-contain bg-white p-1 border"
                          />
                        )}
                        <div>
                          <p className="font-semibold">{offer.vendorName}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <RatingStars rating={offer.vendorRating || 0} size="sm" />
                            <span>({offer.vendorReviewCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* Stock & Delivery */}
                      <div className="flex-1">
                        <StockBadge stock={offer.stock} />
                        <p className="text-sm text-gray-600 mt-1">
                          {offer.deliveryTime}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right min-w-[120px]">
                        <p className="text-xl font-bold">{formatPrice(offer.price)}</p>
                        <p className="text-sm text-gray-500">
                          {offer.deliveryPrice === 0 ? 'Doprava zadarmo' : `+ ${formatPrice(offer.deliveryPrice || 0)}`}
                        </p>
                      </div>

                      {/* CTA */}
                      <button
                        onClick={() => handleOfferClick(offer)}
                        disabled={offer.stock === 'out_of_stock'}
                        className={`px-6 py-3 rounded-xl text-sm font-semibold transition-colors ${
                          offer.stock === 'out_of_stock'
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : offer.isBestOffer
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-primary text-white hover:bg-primary-hover'
                        }`}
                      >
                        {offer.stock === 'out_of_stock' ? 'Nedostupné' : 'Do obchodu →'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description Tab */}
            {activeTab === 'description' && (
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {/* Specs Tab */}
            {activeTab === 'specs' && (
              <div className="space-y-8">
                {Object.entries(groupedAttributes).map(([group, attrs]) => (
                  <div key={group}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                      {group}
                    </h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {attrs.map(attr => (
                        <div 
                          key={attr.id}
                          className="flex justify-between py-2 px-4 bg-gray-50 rounded-lg"
                        >
                          <dt className="text-gray-600">{attr.name}</dt>
                          <dd className="font-medium text-gray-900">
                            {attr.value}{attr.unit ? ` ${attr.unit}` : ''}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div id="reviews">
                {/* Rating Summary */}
                <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b">
                  <div className="text-center md:text-left">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                      {product.rating.toFixed(1)}
                    </div>
                    <RatingStars rating={product.rating} size="lg" />
                    <p className="text-gray-500 mt-2">{product.reviewCount} recenzií</p>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    {ratingDistribution.map(({ stars, count, percentage }) => (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="w-8 text-sm text-gray-600">{stars}★</span>
                        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-12 text-sm text-gray-500 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {product.reviews.map(review => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{review.userName}</span>
                            {review.isVerified && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                ✓ Overený nákup
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <RatingStars rating={review.rating} size="sm" />
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('sk-SK')}
                            </span>
                          </div>
                        </div>
                        <button className="text-sm text-gray-500 hover:text-primary">
                          👍 {review.helpfulCount} užitočné
                        </button>
                      </div>
                      
                      {review.title && (
                        <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                      )}
                      <p className="text-gray-700 mb-3">{review.content}</p>
                      
                      {(review.pros?.length || review.cons?.length) && (
                        <div className="flex flex-wrap gap-4 text-sm">
                          {review.pros && review.pros.length > 0 && (
                            <div className="flex-1 min-w-[200px]">
                              <span className="text-green-600 font-medium">+ Klady:</span>
                              <ul className="mt-1 text-gray-600">
                                {review.pros.map((pro, i) => (
                                  <li key={i}>• {pro}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {review.cons && review.cons.length > 0 && (
                            <div className="flex-1 min-w-[200px]">
                              <span className="text-red-600 font-medium">- Zápory:</span>
                              <ul className="mt-1 text-gray-600">
                                {review.cons.map((con, i) => (
                                  <li key={i}>• {con}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="space-y-4">
                {product.faq?.map(item => (
                  <details
                    key={item.id}
                    className="group bg-gray-50 rounded-xl overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                      <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <div className="px-4 pb-4 text-gray-600">
                      {item.answer}
                      {item.isAIGenerated && (
                        <span className="inline-block mt-2 text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                          🤖 AI generovaná odpoveď
                        </span>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
          >
            ×
          </button>
          
          <button
            onClick={e => { e.stopPropagation(); setSelectedImage(Math.max(0, selectedImage - 1)); }}
            disabled={selectedImage === 0}
            className="absolute left-4 text-white text-4xl hover:text-gray-300 disabled:opacity-30"
          >
            ‹
          </button>
          
          <img
            src={product.images[selectedImage]?.url}
            alt={product.images[selectedImage]?.alt}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={e => e.stopPropagation()}
          />
          
          <button
            onClick={e => { e.stopPropagation(); setSelectedImage(Math.min(product.images.length - 1, selectedImage + 1)); }}
            disabled={selectedImage === product.images.length - 1}
            className="absolute right-4 text-white text-4xl hover:text-gray-300 disabled:opacity-30"
          >
            ›
          </button>
          
          <div className="absolute bottom-4 flex gap-2">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setSelectedImage(i); }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === selectedImage ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center gap-4 z-40">
        <div>
          <div className="text-xl font-bold">{formatPrice(product.price)}</div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </div>
          )}
        </div>
        <button
          onClick={() => bestOffer && handleOfferClick(bestOffer)}
          className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl"
        >
          Kúpiť
        </button>
      </div>
    </div>
  );
}
