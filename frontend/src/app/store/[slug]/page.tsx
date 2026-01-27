'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingCart, Heart, Search, User, Menu, X, ChevronLeft, ChevronRight, 
  Star, Truck, Shield, RotateCcw, Headphones, Plus, Minus, Check, 
  Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Clock,
  Play, Pause, ChevronDown, ChevronUp, Send, Quote, Sparkles, ArrowRight,
  CreditCard, Smartphone, AlertCircle, ExternalLink, Eye, Package,
  // Admin Bar & Editor icons
  Palette, Save, Layers, GripVertical, EyeOff, Trash2, Copy, Settings,
  LayoutDashboard, ShoppingBag, Users, TrendingUp, Bell, LogOut, Edit3,
  PanelLeftClose, PanelLeftOpen, Undo, Redo, Monitor, Tablet, Home,
  BarChart3, Euro, Activity
} from 'lucide-react';
import { useCart, useEditor, demoProducts, formatPrice, calculateDiscount, ShopSection, ShopTheme, SECTION_INFO } from '@/lib/store';

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
      {count !== undefined && <span className="text-sm text-gray-500 ml-1">({count})</span>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: ANNOUNCEMENT BAR
// ═══════════════════════════════════════════════════════════════════════════════

function AnnouncementBarSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const messages = section.settings.messages || [];

  useEffect(() => {
    if (!section.settings.autoRotate || messages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % messages.length);
    }, (section.settings.rotateInterval || 4) * 1000);
    return () => clearInterval(interval);
  }, [messages.length, section.settings.autoRotate, section.settings.rotateInterval]);

  if (!isVisible || messages.length === 0) return null;

  return (
    <div
      className="relative text-center py-2 px-4"
      style={{
        backgroundColor: section.settings.backgroundColor || '#0f172a',
        color: section.settings.textColor || '#ffffff',
        height: section.settings.height || 40,
      }}
    >
      <div className="flex items-center justify-center h-full">
        <p className="text-sm font-medium animate-fade-in">
          {messages[currentIndex]?.link ? (
            <a href={messages[currentIndex].link} className="hover:underline">
              {messages[currentIndex].text}
            </a>
          ) : (
            messages[currentIndex]?.text
          )}
        </p>
      </div>
      {section.settings.showCloseButton && (
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: HEADER
// ═══════════════════════════════════════════════════════════════════════════════

function HeaderSection({ section, theme, cartCount, onCartClick }: { 
  section: ShopSection; theme: ShopTheme; cartCount: number; onCartClick: () => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header
      className={`${section.settings.sticky ? 'sticky top-0 z-50' : ''} ${section.settings.borderBottom ? 'border-b' : ''}`}
      style={{
        backgroundColor: section.settings.backgroundColor || '#ffffff',
        color: section.settings.textColor || '#0f172a',
        borderColor: theme.borderColor,
        height: section.settings.height || 72,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: theme.primaryColor }}>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl hidden sm:block">{section.settings.logoText || 'Shop'}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {(section.settings.menuItems || []).map((item: any) => (
            <div key={item.id} className="relative group">
              <Link href={item.link} className={`px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center gap-1 ${item.highlight ? 'text-red-500' : ''}`}>
                {item.label}
                {item.badge && <span className="px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded">{item.badge}</span>}
                {item.submenu?.length > 0 && <ChevronDown className="w-4 h-4" />}
              </Link>
              {item.submenu?.length > 0 && (
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white rounded-xl shadow-xl border p-2 min-w-[200px]">
                    {item.submenu.map((sub: any) => (
                      <Link key={sub.id} href={sub.link} className="block px-4 py-2 rounded-lg text-sm hover:bg-gray-100">{sub.label}</Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {section.settings.showSearch && (
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-gray-100 rounded-lg"><Search className="w-5 h-5" /></button>
          )}
          {section.settings.showWishlist && (
            <button className="p-2 hover:bg-gray-100 rounded-lg hidden sm:block"><Heart className="w-5 h-5" /></button>
          )}
          {section.settings.showAccount && (
            <button className="p-2 hover:bg-gray-100 rounded-lg hidden sm:block"><User className="w-5 h-5" /></button>
          )}
          {section.settings.showCart && (
            <button onClick={onCartClick} className="p-2 hover:bg-gray-100 rounded-lg relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white" style={{ backgroundColor: theme.primaryColor }}>{cartCount}</span>
              )}
            </button>
          )}
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"><Menu className="w-5 h-5" /></button>
        </div>
      </div>

      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg p-4">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder={section.settings.searchPlaceholder || 'Hľadať produkty...'} className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2" autoFocus />
            <button onClick={() => setSearchOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2"><X className="w-5 h-5 text-gray-400" /></button>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-80 bg-white shadow-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-bold">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <nav className="p-4 space-y-1">
              {(section.settings.menuItems || []).map((item: any) => (
                <Link key={item.id} href={item.link} className="block px-4 py-3 rounded-lg hover:bg-gray-100 font-medium" onClick={() => setMobileMenuOpen(false)}>{item.label}</Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: HERO SLIDER
// ═══════════════════════════════════════════════════════════════════════════════

function HeroSliderSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slides = section.blocks || [];

  useEffect(() => {
    if (!section.settings.autoplay || isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((i) => (i + 1) % slides.length);
    }, section.settings.autoplaySpeed || 5000);
    return () => clearInterval(interval);
  }, [slides.length, section.settings.autoplay, section.settings.autoplaySpeed, isPaused]);

  if (slides.length === 0) return null;

  return (
    <div className="relative overflow-hidden" style={{ height: section.settings.height || 600 }} onMouseEnter={() => section.settings.pauseOnHover && setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      {slides.map((s, index) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: s.settings.backgroundColor || theme.primaryColor }}>
          {section.settings.overlay && <div className="absolute inset-0" style={{ backgroundColor: section.settings.overlayColor || '#000', opacity: (section.settings.overlayOpacity || 30) / 100 }} />}
          <div className={`relative h-full flex items-center justify-center px-4`}>
            <div className="text-center max-w-4xl" style={{ color: s.settings.textColor || '#fff' }}>
              <h1 className="font-bold mb-4 leading-tight" style={{ fontSize: s.settings.titleSize || 56 }}>{s.settings.title}</h1>
              {s.settings.subtitle && <p className="mb-8 opacity-90" style={{ fontSize: s.settings.subtitleSize || 20 }}>{s.settings.subtitle}</p>}
              <div className="flex gap-4 justify-center flex-wrap">
                {s.settings.buttonText && (
                  <Link href={s.settings.buttonLink || '/'} className="px-8 py-4 rounded-xl font-semibold transition-transform hover:scale-105" style={{ backgroundColor: s.settings.buttonStyle === 'white' ? '#fff' : theme.primaryColor, color: s.settings.buttonStyle === 'white' ? theme.primaryColor : '#fff' }}>
                    {s.settings.buttonText}
                  </Link>
                )}
                {s.settings.secondaryButtonText && (
                  <Link href={s.settings.secondaryButtonLink || '/'} className="px-8 py-4 rounded-xl font-semibold border-2 border-white/50 hover:bg-white/10">{s.settings.secondaryButtonText}</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {section.settings.showArrows && slides.length > 1 && (
        <>
          <button onClick={() => setCurrentSlide((i) => (i - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button onClick={() => setCurrentSlide((i) => (i + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center">
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {section.settings.showDots && slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'}`} />
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: TRUST BADGES
// ═══════════════════════════════════════════════════════════════════════════════

function TrustBadgesSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const badges = section.blocks || [];
  return (
    <div className={`${section.settings.showBorder ? 'border-y' : ''}`} style={{ backgroundColor: section.settings.backgroundColor || theme.surfaceColor, borderColor: theme.borderColor, padding: section.settings.padding || 24 }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
          {badges.map((badge) => (
            <div key={badge.id} className="flex items-center gap-3 text-center md:text-left">
              <span style={{ fontSize: section.settings.iconSize || 32 }}>{badge.settings.icon}</span>
              <div>
                <p className="font-semibold" style={{ color: theme.textColor }}>{badge.settings.title}</p>
                <p className="text-sm" style={{ color: theme.textMutedColor }}>{badge.settings.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: CATEGORIES GRID
// ═══════════════════════════════════════════════════════════════════════════════

function CategoriesGridSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const categories = section.blocks || [];
  return (
    <div style={{ backgroundColor: section.settings.backgroundColor || '#fff', paddingTop: section.settings.padding?.top || 80, paddingBottom: section.settings.padding?.bottom || 80 }}>
      <div className="max-w-7xl mx-auto px-4">
        {(section.settings.title || section.settings.subtitle) && (
          <div className={`mb-10 text-${section.settings.titleAlign || 'center'}`}>
            {section.settings.title && <h2 className="text-3xl font-bold mb-2" style={{ color: theme.headingColor }}>{section.settings.title}</h2>}
            {section.settings.subtitle && <p className="text-lg" style={{ color: theme.textMutedColor }}>{section.settings.subtitle}</p>}
          </div>
        )}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${section.settings.columns || 6}, minmax(0, 1fr))`, gap: section.settings.gap || 16 }}>
          {categories.map((cat) => (
            <Link key={cat.id} href={cat.settings.link || '/'} className="group relative overflow-hidden transition-transform hover:scale-105" style={{ borderRadius: section.settings.borderRadius || 12 }}>
              <div className="aspect-square flex items-center justify-center" style={{ backgroundColor: cat.settings.color || theme.primaryColor, height: section.settings.imageHeight || 180 }}>
                {section.settings.showOverlay && <div className="absolute inset-0 bg-black transition-opacity group-hover:opacity-60" style={{ opacity: (section.settings.overlayOpacity || 40) / 100 }} />}
                <span className="text-5xl relative z-10">{cat.settings.icon}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="font-semibold text-white">{cat.settings.name}</p>
                {section.settings.showCount && cat.settings.count && <p className="text-sm text-white/70">{cat.settings.count} produktov</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: PRODUCTS
// ═══════════════════════════════════════════════════════════════════════════════

function ProductsSection({ section, theme, onAddToCart }: { section: ShopSection; theme: ShopTheme; onAddToCart: (product: any) => void }) {
  const products = demoProducts.slice(0, section.settings.limit || 8);
  const showQuickAdd = section.settings.showQuickAdd !== false; // default true
  
  return (
    <div style={{ backgroundColor: section.settings.backgroundColor || '#fff', paddingTop: section.settings.padding?.top || 80, paddingBottom: section.settings.padding?.bottom || 80 }}>
      <div className="max-w-7xl mx-auto px-4">
        {(section.settings.title || section.settings.subtitle) && (
          <div className={`mb-10 text-${section.settings.titleAlign || 'center'}`}>
            {section.settings.title && <h2 className="text-3xl font-bold mb-2" style={{ color: theme.headingColor }}>{section.settings.title}</h2>}
            {section.settings.subtitle && <p className="text-lg" style={{ color: theme.textMutedColor }}>{section.settings.subtitle}</p>}
          </div>
        )}
        <div className="grid" style={{ gridTemplateColumns: `repeat(${section.settings.columns || 4}, minmax(0, 1fr))`, gap: section.settings.gap || 24 }}>
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl overflow-hidden transition-all hover:shadow-xl" style={{ borderRadius: theme.borderRadiusLarge, boxShadow: theme.cardShadow ? theme.shadowMedium : undefined, border: theme.cardBorder ? `1px solid ${theme.borderColor}` : undefined }}>
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                {product.badge && section.settings.showBadges !== false && (
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold text-white z-10" style={{ backgroundColor: product.badge === 'sale' ? '#ef4444' : product.badge === 'new' ? '#22c55e' : product.badge === 'bestseller' ? '#f59e0b' : theme.primaryColor }}>
                    {product.badge === 'sale' ? 'ZĽAVA' : product.badge === 'new' ? 'NOVINKA' : product.badge === 'bestseller' ? 'TOP' : product.badge.toUpperCase()}
                  </span>
                )}
                {product.comparePrice && section.settings.showDiscount !== false && (
                  <span className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold bg-red-500 text-white z-10">-{calculateDiscount(product.price, product.comparePrice)}%</span>
                )}
                <div className="w-full h-full flex items-center justify-center text-gray-300"><Package className="w-16 h-16" /></div>
                {showQuickAdd && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onAddToCart(product)} className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" /> Do košíka
                    </button>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                <h3 className="font-semibold mb-2 line-clamp-2" style={{ color: theme.textColor }}>{product.name}</h3>
                {section.settings.showRating !== false && <div className="mb-2"><StarRating rating={product.rating} count={section.settings.showReviewCount ? product.reviewCount : undefined} /></div>}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold" style={{ color: theme.primaryColor }}>{formatPrice(product.price)}</span>
                  {product.comparePrice && <span className="text-sm text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>}
                </div>
                {/* VŽDY VIDITEĽNÉ TLAČIDLO DO KOŠÍKA */}
                <button 
                  onClick={() => onAddToCart(product)} 
                  className="w-full py-2.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <ShoppingCart className="w-4 h-4" /> Do košíka
                </button>
              </div>
            </div>
          ))}
        </div>
        {section.settings.viewAllLink && (
          <div className="text-center mt-10">
            <Link href={section.settings.viewAllLink} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: theme.primaryColor, color: '#fff' }}>
              {section.settings.viewAllText || 'Zobraziť všetko'} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: PROMO BANNER
// ═══════════════════════════════════════════════════════════════════════════════

function PromoBannerSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  return (
    <div className={`relative overflow-hidden text-${section.settings.textAlign || 'center'}`} style={{ background: section.settings.backgroundGradient || section.settings.backgroundColor || theme.primaryColor, color: section.settings.textColor || '#fff', paddingTop: section.settings.padding?.top || 60, paddingBottom: section.settings.padding?.bottom || 60 }}>
      {section.settings.showPattern && <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />}
      <div className="relative max-w-4xl mx-auto px-4">
        {section.settings.title && <h2 className={`font-bold mb-4 ${section.settings.size === 'large' ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>{section.settings.title}</h2>}
        {section.settings.subtitle && <p className={`mb-8 opacity-90 ${section.settings.size === 'large' ? 'text-xl' : 'text-lg'}`}>{section.settings.subtitle}</p>}
        {section.settings.buttonText && (
          <Link href={section.settings.buttonLink || '/'} className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-transform hover:scale-105 ${section.settings.buttonStyle === 'white' ? 'bg-white' : 'bg-black/20 hover:bg-black/30'}`} style={{ color: section.settings.buttonStyle === 'white' ? (section.settings.backgroundColor || theme.primaryColor) : '#fff' }}>
            {section.settings.buttonText} <ArrowRight className="w-5 h-5" />
          </Link>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════════════

function TestimonialsSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const testimonials = section.blocks || [];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (section.settings.layout !== 'carousel' || !section.settings.autoplay) return;
    const interval = setInterval(() => setCurrent((i) => (i + 1) % testimonials.length), section.settings.autoplaySpeed || 5000);
    return () => clearInterval(interval);
  }, [testimonials.length, section.settings.layout, section.settings.autoplay]);

  return (
    <div style={{ backgroundColor: section.settings.backgroundColor || theme.surfaceColor, paddingTop: section.settings.padding?.top || 80, paddingBottom: section.settings.padding?.bottom || 80 }}>
      <div className="max-w-7xl mx-auto px-4">
        {section.settings.title && (
          <div className={`mb-10 text-${section.settings.titleAlign || 'center'}`}>
            <h2 className="text-3xl font-bold mb-2" style={{ color: theme.headingColor }}>{section.settings.title}</h2>
            {section.settings.subtitle && <p className="text-lg" style={{ color: theme.textMutedColor }}>{section.settings.subtitle}</p>}
          </div>
        )}
        <div className={`grid gap-6 ${section.settings.layout === 'carousel' ? '' : 'md:grid-cols-3'}`}>
          {(section.settings.layout === 'carousel' ? [testimonials[current]] : testimonials).map((t) => (
            <div key={t.id} className="p-6 rounded-2xl" style={{ backgroundColor: section.settings.cardBackgroundColor || '#fff', borderRadius: theme.borderRadiusLarge }}>
              <Quote className="w-8 h-8 mb-4" style={{ color: theme.primaryColor }} />
              <p className="text-lg mb-4" style={{ color: theme.textColor }}>"{t.settings.text}"</p>
              {section.settings.showRating && <div className="mb-4"><StarRating rating={t.settings.rating} /></div>}
              <div className="flex items-center gap-3">
                {section.settings.showAvatar && <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: theme.primaryColor }}>{t.settings.name?.charAt(0)}</div>}
                <div>
                  <p className="font-semibold" style={{ color: theme.textColor }}>{t.settings.name}</p>
                  <p className="text-sm" style={{ color: theme.textMutedColor }}>{t.settings.location}</p>
                </div>
                {t.settings.verified && <span className="ml-auto text-green-500 flex items-center gap-1 text-sm"><Check className="w-4 h-4" /> Overený</span>}
              </div>
            </div>
          ))}
        </div>
        {section.settings.layout === 'carousel' && testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => <button key={i} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full transition-all ${i === current ? 'w-8' : ''}`} style={{ backgroundColor: i === current ? theme.primaryColor : theme.borderColor }} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: FEATURES
// ═══════════════════════════════════════════════════════════════════════════════

function FeaturesSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const features = section.blocks || [];
  return (
    <div style={{ backgroundColor: section.settings.backgroundColor || '#fff', paddingTop: section.settings.padding?.top || 80, paddingBottom: section.settings.padding?.bottom || 80 }}>
      <div className="max-w-7xl mx-auto px-4">
        {section.settings.title && <h2 className={`text-3xl font-bold mb-10 text-${section.settings.titleAlign || 'center'}`} style={{ color: theme.headingColor }}>{section.settings.title}</h2>}
        <div className="grid" style={{ gridTemplateColumns: `repeat(${section.settings.columns || 4}, minmax(0, 1fr))`, gap: section.settings.gap || 24 }}>
          {features.map((feat) => (
            <div key={feat.id} className={`text-center p-6 rounded-2xl`} style={{ backgroundColor: section.settings.style === 'card' ? (section.settings.cardBackgroundColor || theme.surfaceColor) : 'transparent', borderRadius: theme.borderRadiusLarge }}>
              <span className="text-5xl mb-4 block" style={{ color: section.settings.iconColor === 'primary' ? theme.primaryColor : undefined }}>{feat.settings.icon}</span>
              <h3 className="font-semibold text-lg mb-2" style={{ color: theme.textColor }}>{feat.settings.title}</h3>
              <p className="text-sm" style={{ color: theme.textMutedColor }}>{feat.settings.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: FAQ
// ═══════════════════════════════════════════════════════════════════════════════

function FAQSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const faqs = section.blocks || [];
  const toggleItem = (id: string) => {
    if (section.settings.allowMultiple) {
      setOpenItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      setOpenItems(prev => prev.includes(id) ? [] : [id]);
    }
  };
  return (
    <div style={{ backgroundColor: section.settings.backgroundColor || '#fff', paddingTop: section.settings.padding?.top || 80, paddingBottom: section.settings.padding?.bottom || 80 }}>
      <div className="max-w-3xl mx-auto px-4" style={{ maxWidth: section.settings.maxWidth || 800 }}>
        {section.settings.title && (
          <div className={`mb-10 text-${section.settings.titleAlign || 'center'}`}>
            <h2 className="text-3xl font-bold mb-2" style={{ color: theme.headingColor }}>{section.settings.title}</h2>
            {section.settings.subtitle && <p className="text-lg" style={{ color: theme.textMutedColor }}>{section.settings.subtitle}</p>}
          </div>
        )}
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="border rounded-xl overflow-hidden" style={{ borderColor: theme.borderColor }}>
              <button onClick={() => toggleItem(faq.id)} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
                <span className="font-medium" style={{ color: theme.textColor }}>{faq.settings.question}</span>
                {openItems.includes(faq.id) ? <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: theme.textMutedColor }} /> : <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: theme.textMutedColor }} />}
              </button>
              {openItems.includes(faq.id) && <div className="px-6 pb-4" style={{ color: theme.textMutedColor }}>{faq.settings.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: NEWSLETTER
// ═══════════════════════════════════════════════════════════════════════════════

function NewsletterSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };
  return (
    <div style={{ background: section.settings.backgroundGradient || section.settings.backgroundColor || '#0f172a', color: section.settings.textColor || '#fff', paddingTop: section.settings.padding?.top || 80, paddingBottom: section.settings.padding?.bottom || 80 }}>
      <div className="max-w-2xl mx-auto px-4 text-center" style={{ maxWidth: section.settings.maxWidth || 600 }}>
        {section.settings.showIcon && <Mail className="w-12 h-12 mx-auto mb-4 opacity-80" />}
        {section.settings.title && <h2 className={`font-bold mb-4 ${section.settings.size === 'large' ? 'text-3xl' : 'text-2xl'}`}>{section.settings.title}</h2>}
        {section.settings.subtitle && <p className="mb-8 opacity-80">{section.settings.subtitle}</p>}
        {submitted ? (
          <div className="flex items-center justify-center gap-2 text-green-400"><Check className="w-6 h-6" /><span className="text-lg">Ďakujeme za prihlásenie!</span></div>
        ) : (
          <form onSubmit={handleSubmit} className={`flex gap-3 ${section.settings.layout === 'stacked' ? 'flex-col' : ''}`}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={section.settings.placeholder || 'Váš e-mail'} required className={`flex-1 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 ${section.settings.inputStyle === 'white' ? 'bg-white text-gray-900' : 'bg-white/10 text-white placeholder-white/60'}`} />
            <button type="submit" className="px-8 py-4 rounded-xl font-semibold transition-transform hover:scale-105 flex items-center justify-center gap-2" style={{ backgroundColor: theme.primaryColor }}>{section.settings.buttonText || 'Prihlásiť sa'} <Send className="w-5 h-5" /></button>
          </form>
        )}
        {section.settings.showPrivacyNote && section.settings.privacyText && <p className="mt-4 text-sm opacity-60">{section.settings.privacyText}</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: BRAND LOGOS
// ═══════════════════════════════════════════════════════════════════════════════

function BrandLogosSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const brands = section.blocks || [];
  return (
    <div style={{ backgroundColor: section.settings.backgroundColor || theme.surfaceColor, paddingTop: section.settings.padding?.top || 60, paddingBottom: section.settings.padding?.bottom || 60 }}>
      <div className="max-w-7xl mx-auto px-4">
        {section.settings.title && <h2 className={`text-xl font-semibold mb-8 text-${section.settings.titleAlign || 'center'}`} style={{ color: theme.textMutedColor }}>{section.settings.title}</h2>}
        <div className="flex items-center justify-center flex-wrap" style={{ gap: section.settings.gap || 48 }}>
          {brands.map((brand) => (
            <div key={brand.id} className={`${section.settings.grayscale ? 'grayscale hover:grayscale-0' : ''} transition-all opacity-60 hover:opacity-100`} style={{ height: section.settings.logoHeight || 48 }}>
              {brand.settings.logo ? <img src={brand.settings.logo} alt={brand.settings.name} className="h-full w-auto object-contain" /> : <span className="text-2xl font-bold" style={{ color: theme.textMutedColor }}>{brand.settings.name}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: IMAGE WITH TEXT
// ═══════════════════════════════════════════════════════════════════════════════

function ImageWithTextSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const isImageLeft = section.settings.imagePosition !== 'right';
  return (
    <div style={{ backgroundColor: section.settings.backgroundColor || '#fff', paddingTop: section.settings.padding?.top || 80, paddingBottom: section.settings.padding?.bottom || 80 }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className={`flex flex-col ${isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
          <div className="flex-1">
            <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center" style={{ borderRadius: section.settings.borderRadius || 16 }}>
              {section.settings.image ? <img src={section.settings.image} alt="" className="w-full h-full object-cover" /> : <Sparkles className="w-16 h-16 text-gray-300" />}
            </div>
          </div>
          <div className="flex-1" style={{ padding: section.settings.contentPadding || 0 }}>
            {section.settings.title && <h2 className="text-3xl font-bold mb-4" style={{ color: theme.headingColor }}>{section.settings.title}</h2>}
            {section.settings.content && <div className="prose prose-lg mb-6" style={{ color: theme.textMutedColor }} dangerouslySetInnerHTML={{ __html: section.settings.content }} />}
            {section.settings.buttonText && <Link href={section.settings.buttonLink || '/'} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: theme.primaryColor, color: '#fff' }}>{section.settings.buttonText} <ArrowRight className="w-5 h-5" /></Link>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: FOOTER
// ═══════════════════════════════════════════════════════════════════════════════

function FooterSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const columns = section.settings.columns || [];
  const socialIcons: Record<string, any> = { facebook: Facebook, instagram: Instagram, twitter: Twitter, youtube: Youtube };
  return (
    <footer style={{ backgroundColor: section.settings.backgroundColor || '#0f172a', color: section.settings.textColor || '#94a3b8', paddingTop: section.settings.padding?.top || 80, paddingBottom: section.settings.padding?.bottom || 40 }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className={`grid gap-8 md:grid-cols-${section.settings.columnsLayout || 4} mb-12`}>
          {columns.map((col: any, index: number) => (
            <div key={index}>
              {col.title && <h3 className="font-semibold mb-4" style={{ color: section.settings.headingColor || '#fff' }}>{col.title}</h3>}
              {col.content ? <div dangerouslySetInnerHTML={{ __html: col.content }} /> : col.links ? (
                <ul className="space-y-2">
                  {col.links.map((link: any, i: number) => <li key={i}><Link href={link.url} className="hover:underline transition-colors" style={{ color: section.settings.linkColor }}>{link.label}</Link></li>)}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-4">
            {section.settings.showSocialLinks && (section.settings.socialLinks || []).map((social: any) => {
              const Icon = socialIcons[social.platform] || ExternalLink;
              return <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><Icon className="w-5 h-5" /></a>;
            })}
          </div>
          {section.settings.showPaymentMethods && (
            <div className="flex items-center gap-3">
              {(section.settings.paymentMethods || []).map((method: string) => <div key={method} className="px-3 py-1 bg-white/10 rounded text-xs font-medium uppercase">{method}</div>)}
            </div>
          )}
        </div>
        <div className="text-center mt-8 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <p className="text-sm">{section.settings.copyrightText}</p>
          {section.settings.bottomLinks && (
            <div className="flex items-center justify-center gap-4 mt-4">
              {section.settings.bottomLinks.map((link: any) => <Link key={link.label} href={link.link} className="text-sm hover:underline">{link.label}</Link>)}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CART SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════════

function CartSidebar({ theme, freeShippingThreshold }: { theme: ShopTheme; freeShippingThreshold: number }) {
  const cart = useCart();
  const params = useParams();
  const slug = params.slug as string;
  const cartTotal = cart.total();
  const remaining = Math.max(0, freeShippingThreshold - cartTotal);
  const progress = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
  if (!cart.isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => cart.setCartOpen(false)} />
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Košík ({cart.count()})</h2>
          <button onClick={() => cart.setCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        {freeShippingThreshold > 0 && (
          <div className="p-4 bg-gray-50 border-b">
            {remaining > 0 ? (
              <>
                <p className="text-sm mb-2">Ešte <strong>{formatPrice(remaining)}</strong> do dopravy zadarmo</p>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: theme.primaryColor }} /></div>
              </>
            ) : (
              <p className="text-sm text-green-600 font-medium flex items-center gap-2"><Check className="w-5 h-5" /> Máte nárok na dopravu zadarmo!</p>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.items.length === 0 ? (
            <div className="text-center py-12"><ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" /><p className="text-gray-500">Váš košík je prázdny</p></div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0"><Package className="w-8 h-8 text-gray-300" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => cart.updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-100"><Minus className="w-4 h-4" /></button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button onClick={() => cart.updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-100"><Plus className="w-4 h-4" /></button>
                      <button onClick={() => cart.removeItem(item.id)} className="ml-auto text-red-500 hover:text-red-600"><X className="w-5 h-5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.items.length > 0 && (
          <div className="p-4 border-t bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Celkom</span>
              <span className="text-2xl font-bold" style={{ color: theme.primaryColor }}>{formatPrice(cartTotal)}</span>
            </div>
            <Link href={`/store/${slug}/checkout`} className="block w-full py-4 text-center text-white rounded-xl font-semibold" style={{ backgroundColor: theme.primaryColor }} onClick={() => cart.setCartOpen(false)}>Pokračovať k pokladni</Link>
          </div>
        )}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN BAR - WordPress štýl (pre prihlásených vlastníkov)
// ═══════════════════════════════════════════════════════════════════════════════

function AdminBar({ 
  user, 
  isEditing, 
  onToggleEdit, 
  onLogout,
  stats 
}: { 
  user: any; 
  isEditing: boolean; 
  onToggleEdit: () => void;
  onLogout: () => void;
  stats: { revenue: number; orders: number; visitors: number };
}) {
  return (
    <div className="fixed top-0 left-0 right-0 h-10 bg-slate-900 text-white z-[200] flex items-center justify-between px-4 text-sm shadow-lg">
      {/* Left - Logo & Stats */}
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-2 hover:bg-slate-800 px-2 py-1 rounded transition-colors">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="font-semibold hidden sm:inline">EshopBuilder</span>
        </Link>

        {/* Quick Stats */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
            <Euro className="w-3.5 h-3.5" />
            <span className="font-semibold">€{stats.revenue.toLocaleString()}</span>
            <span className="text-emerald-300/60 hidden lg:inline">dnes</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded-full">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="font-semibold">{stats.orders}</span>
            <span className="text-blue-300/60 hidden lg:inline">objednávok</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/20 text-purple-400 rounded-full">
            <Users className="w-3.5 h-3.5" />
            <span className="font-semibold">{stats.visitors}</span>
            <span className="text-purple-300/60 hidden lg:inline">návštevníkov</span>
          </div>
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        {/* Edit Toggle */}
        <button
          onClick={onToggleEdit}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isEditing 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
              : 'bg-slate-800 hover:bg-slate-700 text-gray-300'
          }`}
        >
          {isEditing ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ukončiť úpravy</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upraviť stránku</span>
            </>
          )}
        </button>

        {/* Dashboard Link */}
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-gray-300 transition-colors"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        {/* Notifications */}
        <button className="p-1.5 hover:bg-slate-800 rounded-lg relative transition-colors">
          <Bell className="w-4 h-4 text-gray-400" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-700">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <button 
            onClick={onLogout}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
            title="Odhlásiť sa"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INLINE EDITOR PANEL - WordPress Customizer štýl
// ═══════════════════════════════════════════════════════════════════════════════

function InlineEditorPanel({
  isOpen,
  onToggle,
  selectedSection,
  onSelectSection,
  sections,
}: {
  isOpen: boolean;
  onToggle: () => void;
  selectedSection: ShopSection | null;
  onSelectSection: (section: ShopSection | null) => void;
  sections: ShopSection[];
}) {
  const editor = useEditor();
  const { toggleSection, moveSection, removeSection, duplicateSection, updateSectionSettings, hasUnsavedChanges, saveChanges, undo, redo, canUndo, canRedo } = editor;
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');

  return (
    <>
      {/* Panel */}
      <div className={`
        fixed top-10 left-0 h-[calc(100vh-40px)] w-[340px] bg-slate-900 shadow-2xl z-[150]
        transform transition-transform duration-300 ease-out flex flex-col border-r border-slate-700
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-sm">Shop Builder</h2>
              <p className="text-xs text-gray-500">Upravte svoj obchod</p>
            </div>
          </div>
          <button 
            onClick={onToggle}
            className="p-2 hover:bg-slate-700 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="h-11 flex items-center justify-between px-3 border-b border-slate-700/50 bg-slate-800/30">
          <div className="flex items-center gap-1">
            <button
              onClick={() => undo()}
              disabled={!canUndo()}
              className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Späť (Ctrl+Z)"
            >
              <Undo className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => redo()}
              disabled={!canRedo()}
              className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Znova (Ctrl+Y)"
            >
              <Redo className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Device Preview */}
          <div className="flex items-center gap-0.5 bg-slate-800 rounded-lg p-0.5">
            {[
              { id: 'desktop', icon: Monitor },
              { id: 'tablet', icon: Tablet },
              { id: 'mobile', icon: Smartphone },
            ].map((d) => (
              <button
                key={d.id}
                className="p-1.5 rounded-md text-gray-500 hover:text-white transition-colors"
                title={d.id}
              >
                <d.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedSection ? (
            // Section Editor
            <div className="p-4">
              <button 
                onClick={() => onSelectSection(null)}
                className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 mb-4 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Späť na sekcie
              </button>

              <div className="flex items-center gap-3 mb-5 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <span className="text-2xl">{SECTION_INFO[selectedSection.type]?.icon || '📦'}</span>
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    {SECTION_INFO[selectedSection.type]?.name || selectedSection.type}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {SECTION_INFO[selectedSection.type]?.description || 'Upravte nastavenia sekcie'}
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-4 bg-slate-800/50 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`flex-1 py-2.5 text-xs font-medium rounded-lg transition-all ${
                    activeTab === 'content' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Obsah
                </button>
                <button
                  onClick={() => setActiveTab('style')}
                  className={`flex-1 py-2.5 text-xs font-medium rounded-lg transition-all ${
                    activeTab === 'style' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Štýl
                </button>
              </div>

              {/* Editor Content */}
              <div className="space-y-4">
                {activeTab === 'content' ? (
                  <SectionContentEditorInline section={selectedSection} update={(k, v) => updateSectionSettings(selectedSection.id, { [k]: v })} />
                ) : (
                  <SectionStyleEditorInline section={selectedSection} update={(k, v) => updateSectionSettings(selectedSection.id, { [k]: v })} />
                )}
              </div>

              {/* Section Actions */}
              <div className="mt-6 pt-4 border-t border-slate-700 space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSection(selectedSection.id)}
                    className={`flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${
                      selectedSection.enabled 
                        ? 'bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {selectedSection.enabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {selectedSection.enabled ? 'Skryť' : 'Zobraziť'}
                  </button>
                  <button
                    onClick={() => duplicateSection(selectedSection.id)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm flex items-center justify-center gap-2 text-gray-300 border border-slate-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" /> Duplikovať
                  </button>
                </div>
                <button
                  onClick={() => {
                    removeSection(selectedSection.id);
                    onSelectSection(null);
                  }}
                  className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm flex items-center justify-center gap-2 border border-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Odstrániť sekciu
                </button>
              </div>
            </div>
          ) : (
            // Section List
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white text-sm">Sekcie</h3>
                <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Pridať sekciu
                </button>
              </div>

              <div className="space-y-2">
                {sections.map((section, index) => {
                  const info = SECTION_INFO[section.type];
                  return (
                    <div
                      key={section.id}
                      onClick={() => onSelectSection(section)}
                      className={`
                        group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                        ${!section.enabled ? 'opacity-50' : ''}
                        bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 hover:border-blue-500/50
                      `}
                    >
                      <div className="cursor-grab p-1 hover:bg-slate-700 rounded transition-colors">
                        <GripVertical className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-lg">{info?.icon || '📦'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {info?.name || section.type}
                        </p>
                        {section.blocks && section.blocks.length > 0 && (
                          <p className="text-xs text-gray-500">{section.blocks.length} položiek</p>
                        )}
                      </div>

                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'up'); }}
                          disabled={index === 0}
                          className="p-1 hover:bg-slate-600 rounded disabled:opacity-30 transition-colors"
                        >
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'down'); }}
                          disabled={index === sections.length - 1}
                          className="p-1 hover:bg-slate-600 rounded disabled:opacity-30 transition-colors"
                        >
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSection(section.id); }}
                          className={`p-1 rounded transition-colors ${
                            section.enabled ? 'text-emerald-400 hover:bg-emerald-500/20' : 'text-gray-500 hover:bg-slate-600'
                          }`}
                        >
                          {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>

                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/30">
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-yellow-400 text-xs mb-3">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              Máte neuložené zmeny
            </div>
          )}
          <button
            onClick={() => saveChanges()}
            disabled={!hasUnsavedChanges}
            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              hasUnsavedChanges
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-800 text-gray-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Save className="w-5 h-5" />
            {hasUnsavedChanges ? 'Uložiť zmeny' : 'Všetko uložené'}
          </button>
        </div>
      </div>

      {/* Toggle Button when closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-14 left-4 z-[150] w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all hover:scale-105"
          title="Otvoriť editor"
        >
          <PanelLeftOpen className="w-6 h-6" />
        </button>
      )}
    </>
  );
}

// Inline Section Content Editor
function SectionContentEditorInline({ section, update }: { section: ShopSection; update: (key: string, value: any) => void }) {
  const s = section.settings || {};
  
  switch (section.type) {
    case 'hero-slider': case 'hero-banner':
      return (
        <>
          <EditorField label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} />
          <EditorField label="Podnadpis" value={s.subtitle || ''} onChange={(v) => update('subtitle', v)} multiline />
          <EditorField label="Text tlačidla" value={s.buttonText || ''} onChange={(v) => update('buttonText', v)} />
          <EditorField label="Link" value={s.buttonLink || ''} onChange={(v) => update('buttonLink', v)} />
        </>
      );
    case 'header':
      return (
        <>
          <EditorField label="Logo text" value={s.logoText || ''} onChange={(v) => update('logoText', v)} />
          <EditorToggle label="Vyhľadávanie" checked={s.showSearch !== false} onChange={(v) => update('showSearch', v)} />
          <EditorToggle label="Košík" checked={s.showCart !== false} onChange={(v) => update('showCart', v)} />
          <EditorToggle label="Sticky header" checked={s.sticky !== false} onChange={(v) => update('sticky', v)} />
        </>
      );
    case 'featured-products': case 'product-grid':
      return (
        <>
          <EditorField label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} />
          <EditorField label="Podnadpis" value={s.subtitle || ''} onChange={(v) => update('subtitle', v)} />
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Počet produktov</label>
            <input type="number" min={1} max={20} value={s.count || 8} onChange={(e) => update('count', parseInt(e.target.value))} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
        </>
      );
    case 'newsletter':
      return (
        <>
          <EditorField label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} />
          <EditorField label="Popis" value={s.description || ''} onChange={(v) => update('description', v)} multiline />
          <EditorField label="Text tlačidla" value={s.buttonText || ''} onChange={(v) => update('buttonText', v)} />
        </>
      );
    default:
      return <div className="text-center text-gray-500 py-6 text-sm">Editor pre túto sekciu bude čoskoro</div>;
  }
}

// Inline Section Style Editor
function SectionStyleEditorInline({ section, update }: { section: ShopSection; update: (key: string, value: any) => void }) {
  const s = section.settings || {};
  return (
    <>
      <EditorColor label="Farba pozadia" value={s.backgroundColor || '#ffffff'} onChange={(v) => update('backgroundColor', v)} />
      <EditorColor label="Farba textu" value={s.textColor || '#000000'} onChange={(v) => update('textColor', v)} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Padding Y</label>
          <input type="number" value={s.paddingY || 48} onChange={(e) => update('paddingY', parseInt(e.target.value))} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Padding X</label>
          <input type="number" value={s.paddingX || 16} onChange={(e) => update('paddingX', parseInt(e.target.value))} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white" />
        </div>
      </div>
    </>
  );
}

// Helper components
function EditorField({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-2">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white resize-none focus:outline-none focus:border-blue-500" />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500" />
      )}
    </div>
  );
}

function EditorColor({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-2">{label}</label>
      <div className="flex gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border border-slate-700 bg-transparent" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-blue-500" />
      </div>
    </div>
  );
}

function EditorToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-gray-300">{label}</span>
      <button onClick={() => onChange(!checked)} className={`w-10 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-700'}`}>
        <div className={`w-4 h-4 bg-white rounded-full transform transition-transform mx-1 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN STORE PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const editor = useEditor();
  const cart = useCart();
  const { shopSettings } = editor;
  const { theme, sections } = shopSettings;
  const sortedSections = [...sections].sort((a, b) => a.order - b.order).filter(s => s.enabled);
  const allSections = [...sections].sort((a, b) => a.order - b.order);

  // User & Auth state
  const [user, setUser] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  
  // Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<ShopSection | null>(null);

  // Demo stats
  const [stats] = useState({ revenue: 2847, orders: 48, visitors: 1284 });

  // Check if user is logged in and is owner
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      // Check if user owns this shop (demo check)
      setIsOwner(true); // In real app: check if parsed.shopSlug === params.slug
    }
  }, [params.slug]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsOwner(false);
    setIsEditing(false);
    router.refresh();
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditorOpen(false);
      setSelectedSection(null);
    } else {
      setIsEditing(true);
      setEditorOpen(true);
    }
  };

  const handleAddToCart = (product: any) => {
    cart.addItem({ id: product.id, name: product.name, price: product.price, image: product.images?.[0] });
  };

  const renderSection = (section: ShopSection) => {
    const commonProps = { section, theme };
    switch (section.type) {
      case 'announcement-bar': return <AnnouncementBarSection {...commonProps} />;
      case 'header': return <HeaderSection {...commonProps} cartCount={cart.count()} onCartClick={() => cart.setCartOpen(true)} />;
      case 'hero-slider': case 'hero-banner': return <HeroSliderSection {...commonProps} />;
      case 'trust-badges': return <TrustBadgesSection {...commonProps} />;
      case 'categories-grid': case 'categories-carousel': return <CategoriesGridSection {...commonProps} />;
      case 'featured-products': case 'product-grid': case 'product-carousel': return <ProductsSection {...commonProps} onAddToCart={handleAddToCart} />;
      case 'promo-banner': return <PromoBannerSection {...commonProps} />;
      case 'testimonials': return <TestimonialsSection {...commonProps} />;
      case 'features-icons': case 'features-grid': return <FeaturesSection {...commonProps} />;
      case 'faq-accordion': return <FAQSection {...commonProps} />;
      case 'newsletter': return <NewsletterSection {...commonProps} />;
      case 'brand-logos': return <BrandLogosSection {...commonProps} />;
      case 'image-with-text': return <ImageWithTextSection {...commonProps} />;
      case 'footer': return <FooterSection {...commonProps} />;
      default: return <div className="py-12 text-center bg-gray-100"><p className="text-gray-500">Sekcia: {section.type}</p></div>;
    }
  };

  // Top offset for admin bar
  const topOffset = isOwner ? 40 : 0;

  return (
    <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      {/* Admin Bar - only for logged in owners */}
      {isOwner && user && (
        <AdminBar 
          user={user}
          isEditing={isEditing}
          onToggleEdit={handleToggleEdit}
          onLogout={handleLogout}
          stats={stats}
        />
      )}

      {/* Inline Editor Panel */}
      {isOwner && isEditing && (
        <InlineEditorPanel
          isOpen={editorOpen}
          onToggle={() => setEditorOpen(!editorOpen)}
          selectedSection={selectedSection}
          onSelectSection={setSelectedSection}
          sections={allSections}
        />
      )}

      {/* Main Content */}
      <div style={{ marginTop: topOffset, marginLeft: isEditing && editorOpen ? 340 : 0, transition: 'margin-left 0.3s ease' }}>
        {sortedSections.map((section) => (
          <div 
            key={section.id} 
            className={`relative ${isEditing ? 'group cursor-pointer' : ''}`}
            onClick={isEditing ? () => { setSelectedSection(section); setEditorOpen(true); } : undefined}
          >
            {/* Section Highlight on Edit Mode */}
            {isEditing && (
              <div className={`
                absolute inset-0 z-10 pointer-events-none transition-all border-2
                ${selectedSection?.id === section.id 
                  ? 'border-blue-500 bg-blue-500/5' 
                  : 'border-transparent group-hover:border-dashed group-hover:border-blue-400 group-hover:bg-blue-500/5'
                }
              `}>
                <div className={`
                  absolute top-2 left-2 px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg shadow-lg
                  transition-opacity flex items-center gap-1.5
                  ${selectedSection?.id === section.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}>
                  <span>{SECTION_INFO[section.type]?.icon}</span>
                  {SECTION_INFO[section.type]?.name || section.type}
                </div>
              </div>
            )}
            {renderSection(section)}
          </div>
        ))}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar theme={theme} freeShippingThreshold={shopSettings.freeShippingThreshold} />

      {/* Floating Edit Button (when owner but not editing) */}
      {isOwner && !isEditing && (
        <button
          onClick={handleToggleEdit}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-500/30 flex items-center justify-center transition-all hover:scale-110"
          title="Upraviť stránku"
        >
          <Palette className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

