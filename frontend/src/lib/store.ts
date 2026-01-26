'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ═══════════════════════════════════════════════════════════════════════════════
// CART STORE
// ═══════════════════════════════════════════════════════════════════════════════

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
  variantId?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  total: () => number;
  count: () => number;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (item) => set((state) => {
    const key = item.variantId || item.id;
    const existing = state.items.find(i => (i.variantId || i.id) === key);
    if (existing) {
      return { 
        items: state.items.map(i => (i.variantId || i.id) === key 
          ? { ...i, quantity: i.quantity + 1 } 
          : i
        ),
        isOpen: true 
      };
    }
    return { items: [...state.items, { ...item, quantity: 1 }], isOpen: true };
  }),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(i => i.id !== id && i.variantId !== id) 
  })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: quantity > 0 
      ? state.items.map(i => (i.id === id || i.variantId === id) ? { ...i, quantity } : i) 
      : state.items.filter(i => i.id !== id && i.variantId !== id)
  })),
  clearCart: () => set({ items: [] }),
  setCartOpen: (open) => set({ isOpen: open }),
  total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  count: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export type SectionType = 
  | 'announcement-bar'
  | 'header'
  | 'hero-slider'
  | 'hero-banner'
  | 'hero-video'
  | 'hero-split'
  | 'categories-grid'
  | 'categories-carousel'
  | 'featured-products'
  | 'product-grid'
  | 'product-carousel'
  | 'product-tabs'
  | 'collection-list'
  | 'promo-banner'
  | 'promo-cards'
  | 'countdown-timer'
  | 'image-with-text'
  | 'image-gallery'
  | 'video-section'
  | 'testimonials'
  | 'reviews-carousel'
  | 'trust-badges'
  | 'features-grid'
  | 'features-icons'
  | 'faq-accordion'
  | 'contact-form'
  | 'contact-info'
  | 'map-section'
  | 'newsletter'
  | 'instagram-feed'
  | 'brand-logos'
  | 'blog-posts'
  | 'rich-text'
  | 'custom-html'
  | 'spacer'
  | 'divider'
  | 'columns'
  | 'tabs'
  | 'footer';

export const SECTION_CATEGORIES = {
  'hero': ['hero-slider', 'hero-banner', 'hero-video', 'hero-split'],
  'products': ['featured-products', 'product-grid', 'product-carousel', 'product-tabs', 'collection-list'],
  'categories': ['categories-grid', 'categories-carousel'],
  'marketing': ['promo-banner', 'promo-cards', 'countdown-timer', 'newsletter'],
  'content': ['image-with-text', 'image-gallery', 'video-section', 'rich-text', 'columns', 'tabs'],
  'social-proof': ['testimonials', 'reviews-carousel', 'trust-badges', 'brand-logos', 'instagram-feed'],
  'features': ['features-grid', 'features-icons', 'faq-accordion'],
  'contact': ['contact-form', 'contact-info', 'map-section'],
  'layout': ['spacer', 'divider', 'custom-html'],
  'structure': ['announcement-bar', 'header', 'footer'],
} as const;

export const SECTION_INFO: Record<SectionType, { name: string; description: string; icon: string; category: string }> = {
  'announcement-bar': { name: 'Oznamovacia lišta', description: 'Rotujúce správy v hornej časti', icon: '📢', category: 'structure' },
  'header': { name: 'Hlavička', description: 'Logo, navigácia, košík', icon: '🔝', category: 'structure' },
  'hero-slider': { name: 'Hero Slider', description: 'Slideshow s obrázkami', icon: '🎠', category: 'hero' },
  'hero-banner': { name: 'Hero Banner', description: 'Veľký banner s CTA', icon: '🖼️', category: 'hero' },
  'hero-video': { name: 'Hero Video', description: 'Video na pozadí', icon: '🎬', category: 'hero' },
  'hero-split': { name: 'Hero Split', description: 'Rozdelený hero s textom a obrázkom', icon: '⬜', category: 'hero' },
  'categories-grid': { name: 'Kategórie - Mriežka', description: 'Kategórie v mriežke', icon: '📦', category: 'categories' },
  'categories-carousel': { name: 'Kategórie - Carousel', description: 'Posuvné kategórie', icon: '🎪', category: 'categories' },
  'featured-products': { name: 'Odporúčané produkty', description: 'Ručne vybrané produkty', icon: '⭐', category: 'products' },
  'product-grid': { name: 'Produkty - Mriežka', description: 'Produkty z kolekcie', icon: '🛍️', category: 'products' },
  'product-carousel': { name: 'Produkty - Carousel', description: 'Posuvné produkty', icon: '🎡', category: 'products' },
  'product-tabs': { name: 'Produkty - Taby', description: 'Produkty v taboch', icon: '📑', category: 'products' },
  'collection-list': { name: 'Zoznam kolekcií', description: 'Zobrazenie kolekcií', icon: '📚', category: 'products' },
  'promo-banner': { name: 'Promo Banner', description: 'Propagačný banner', icon: '🎯', category: 'marketing' },
  'promo-cards': { name: 'Promo Karty', description: 'Viacero promo kariet', icon: '🃏', category: 'marketing' },
  'countdown-timer': { name: 'Odpočítavanie', description: 'Časovač do akcie', icon: '⏰', category: 'marketing' },
  'image-with-text': { name: 'Obrázok s textom', description: 'Obrázok vedľa textu', icon: '📝', category: 'content' },
  'image-gallery': { name: 'Galéria obrázkov', description: 'Mriežka obrázkov', icon: '🖼️', category: 'content' },
  'video-section': { name: 'Video sekcia', description: 'Vložené video', icon: '▶️', category: 'content' },
  'testimonials': { name: 'Recenzie zákazníkov', description: 'Citáty zákazníkov', icon: '💬', category: 'social-proof' },
  'reviews-carousel': { name: 'Carousel recenzií', description: 'Posuvné recenzie', icon: '🌟', category: 'social-proof' },
  'trust-badges': { name: 'Dôveryhodné odznaky', description: 'Ikony s výhodami', icon: '🛡️', category: 'social-proof' },
  'features-grid': { name: 'Vlastnosti - Mriežka', description: 'Vlastnosti v mriežke', icon: '✨', category: 'features' },
  'features-icons': { name: 'Vlastnosti - Ikony', description: 'Ikony s popisom', icon: '🎖️', category: 'features' },
  'faq-accordion': { name: 'FAQ Accordion', description: 'Často kladené otázky', icon: '❓', category: 'features' },
  'contact-form': { name: 'Kontaktný formulár', description: 'Formulár pre správy', icon: '✉️', category: 'contact' },
  'contact-info': { name: 'Kontaktné údaje', description: 'Adresa, telefón, email', icon: '📍', category: 'contact' },
  'map-section': { name: 'Mapa', description: 'Google mapa', icon: '🗺️', category: 'contact' },
  'newsletter': { name: 'Newsletter', description: 'Prihlásenie na odber', icon: '📧', category: 'marketing' },
  'instagram-feed': { name: 'Instagram Feed', description: 'Instagram príspevky', icon: '📸', category: 'social-proof' },
  'brand-logos': { name: 'Logá značiek', description: 'Partneri a značky', icon: '🏷️', category: 'social-proof' },
  'blog-posts': { name: 'Blog príspevky', description: 'Najnovšie články', icon: '📰', category: 'content' },
  'rich-text': { name: 'Textový blok', description: 'Formátovaný text', icon: '📄', category: 'content' },
  'custom-html': { name: 'Vlastné HTML', description: 'Vlastný kód', icon: '💻', category: 'layout' },
  'spacer': { name: 'Medzera', description: 'Prázdny priestor', icon: '↕️', category: 'layout' },
  'divider': { name: 'Oddeľovač', description: 'Horizontálna čiara', icon: '➖', category: 'layout' },
  'columns': { name: 'Stĺpce', description: 'Viacstĺpcový layout', icon: '▥', category: 'content' },
  'tabs': { name: 'Taby', description: 'Obsah v taboch', icon: '📑', category: 'content' },
  'footer': { name: 'Pätička', description: 'Spodná časť stránky', icon: '🔻', category: 'structure' },
};

export interface SectionBlock {
  id: string;
  type: string;
  settings: Record<string, any>;
}

export interface ShopSection {
  id: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  settings: Record<string, any>;
  blocks?: SectionBlock[];
  responsive?: {
    mobile?: { enabled?: boolean; settings?: Record<string, any> };
    tablet?: { enabled?: boolean; settings?: Record<string, any> };
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// THEME TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ShopTheme {
  // Colors - Primary palette
  primaryColor: string;
  primaryHoverColor: string;
  primaryTextColor: string;
  
  // Colors - Secondary palette  
  secondaryColor: string;
  secondaryHoverColor: string;
  secondaryTextColor: string;
  
  // Colors - Accent
  accentColor: string;
  
  // Colors - Background
  backgroundColor: string;
  surfaceColor: string;
  cardColor: string;
  
  // Colors - Text
  textColor: string;
  textMutedColor: string;
  textLightColor: string;
  headingColor: string;
  linkColor: string;
  linkHoverColor: string;
  
  // Colors - UI
  borderColor: string;
  dividerColor: string;
  shadowColor: string;
  overlayColor: string;
  
  // Colors - Status
  successColor: string;
  warningColor: string;
  errorColor: string;
  infoColor: string;
  
  // Typography - Fonts
  fontFamily: string;
  headingFontFamily: string;
  monoFontFamily: string;
  
  // Typography - Sizes
  fontSizeBase: number;
  fontSizeSmall: number;
  fontSizeLarge: number;
  fontSizeH1: number;
  fontSizeH2: number;
  fontSizeH3: number;
  fontSizeH4: number;
  
  // Typography - Weights
  fontWeightNormal: number;
  fontWeightMedium: number;
  fontWeightSemibold: number;
  fontWeightBold: number;
  
  // Typography - Line heights
  lineHeightTight: number;
  lineHeightNormal: number;
  lineHeightRelaxed: number;
  
  // Spacing
  spacingUnit: number;
  containerMaxWidth: number;
  containerPadding: number;
  sectionSpacing: number;
  
  // Border radius
  borderRadiusSmall: number;
  borderRadiusMedium: number;
  borderRadiusLarge: number;
  borderRadiusFull: number;
  
  // Shadows
  shadowSmall: string;
  shadowMedium: string;
  shadowLarge: string;
  shadowXl: string;
  
  // Transitions
  transitionFast: string;
  transitionNormal: string;
  transitionSlow: string;
  
  // Button styles
  buttonStyle: 'solid' | 'outline' | 'ghost' | 'soft';
  buttonSize: 'small' | 'medium' | 'large';
  buttonRounded: boolean;
  
  // Card styles
  cardShadow: boolean;
  cardBorder: boolean;
  cardHoverEffect: 'none' | 'lift' | 'glow' | 'border';
  
  // Header styles
  headerStyle: 'default' | 'centered' | 'minimal' | 'mega';
  headerBackground: 'white' | 'transparent' | 'primary' | 'dark';
  headerSticky: boolean;
  
  // Product card styles
  productCardStyle: 'default' | 'minimal' | 'detailed' | 'overlay';
  productImageRatio: '1:1' | '4:3' | '3:4' | '16:9';
  productHoverEffect: 'none' | 'zoom' | 'swap' | 'overlay';
  
  // Animations
  animationsEnabled: boolean;
  animationStyle: 'subtle' | 'normal' | 'playful';
}

export const defaultTheme: ShopTheme = {
  // Primary
  primaryColor: '#2563eb',
  primaryHoverColor: '#1d4ed8',
  primaryTextColor: '#ffffff',
  
  // Secondary
  secondaryColor: '#10b981',
  secondaryHoverColor: '#059669',
  secondaryTextColor: '#ffffff',
  
  // Accent
  accentColor: '#f59e0b',
  
  // Background
  backgroundColor: '#ffffff',
  surfaceColor: '#f8fafc',
  cardColor: '#ffffff',
  
  // Text
  textColor: '#0f172a',
  textMutedColor: '#64748b',
  textLightColor: '#94a3b8',
  headingColor: '#0f172a',
  linkColor: '#2563eb',
  linkHoverColor: '#1d4ed8',
  
  // UI
  borderColor: '#e2e8f0',
  dividerColor: '#e2e8f0',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  overlayColor: 'rgba(0, 0, 0, 0.5)',
  
  // Status
  successColor: '#22c55e',
  warningColor: '#f59e0b',
  errorColor: '#ef4444',
  infoColor: '#3b82f6',
  
  // Typography - Fonts
  fontFamily: 'Inter, system-ui, sans-serif',
  headingFontFamily: 'Inter, system-ui, sans-serif',
  monoFontFamily: 'JetBrains Mono, monospace',
  
  // Typography - Sizes
  fontSizeBase: 16,
  fontSizeSmall: 14,
  fontSizeLarge: 18,
  fontSizeH1: 48,
  fontSizeH2: 36,
  fontSizeH3: 28,
  fontSizeH4: 22,
  
  // Typography - Weights
  fontWeightNormal: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontWeightBold: 700,
  
  // Line heights
  lineHeightTight: 1.25,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
  
  // Spacing
  spacingUnit: 4,
  containerMaxWidth: 1280,
  containerPadding: 16,
  sectionSpacing: 80,
  
  // Border radius
  borderRadiusSmall: 4,
  borderRadiusMedium: 8,
  borderRadiusLarge: 16,
  borderRadiusFull: 9999,
  
  // Shadows
  shadowSmall: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMedium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  shadowLarge: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  shadowXl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Transitions
  transitionFast: '150ms ease',
  transitionNormal: '300ms ease',
  transitionSlow: '500ms ease',
  
  // Button
  buttonStyle: 'solid',
  buttonSize: 'medium',
  buttonRounded: false,
  
  // Card
  cardShadow: true,
  cardBorder: false,
  cardHoverEffect: 'lift',
  
  // Header
  headerStyle: 'default',
  headerBackground: 'white',
  headerSticky: true,
  
  // Product
  productCardStyle: 'default',
  productImageRatio: '1:1',
  productHoverEffect: 'zoom',
  
  // Animations
  animationsEnabled: true,
  animationStyle: 'normal',
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const defaultSections: ShopSection[] = [
  {
    id: 'announcement-1',
    type: 'announcement-bar',
    enabled: true,
    order: 0,
    settings: {
      messages: [
        { id: '1', text: '🚚 Doprava zadarmo pri objednávke nad €50', link: '', highlight: false },
        { id: '2', text: '🎁 Zľava 10% na prvý nákup s kódom VITAJ10', link: '/akcie', highlight: true },
        { id: '3', text: '🔄 30 dní na vrátenie bez udania dôvodu', link: '/vracanie', highlight: false },
      ],
      backgroundColor: '#0f172a',
      textColor: '#ffffff',
      highlightColor: '#fbbf24',
      autoRotate: true,
      rotateInterval: 4,
      showCloseButton: true,
      height: 40,
      fontSize: 14,
    },
  },
  {
    id: 'header-1',
    type: 'header',
    enabled: true,
    order: 1,
    settings: {
      logoText: 'Demo Shop',
      logoImage: '',
      logoWidth: 140,
      menuItems: [
        { id: '1', label: 'Domov', link: '/', highlight: false, submenu: [] },
        { id: '2', label: 'Produkty', link: '/produkty', highlight: false, submenu: [
          { id: '2-1', label: 'Elektronika', link: '/kategoria/elektronika' },
          { id: '2-2', label: 'Oblečenie', link: '/kategoria/oblecenie' },
          { id: '2-3', label: 'Doplnky', link: '/kategoria/doplnky' },
          { id: '2-4', label: 'Všetky produkty', link: '/produkty' },
        ]},
        { id: '3', label: 'Akcie', link: '/akcie', highlight: true, badge: 'SALE', submenu: [] },
        { id: '4', label: 'Novinky', link: '/novinky', highlight: false, submenu: [] },
        { id: '5', label: 'Kontakt', link: '/kontakt', highlight: false, submenu: [] },
      ],
      showSearch: true,
      searchPlaceholder: 'Hľadať produkty...',
      showCart: true,
      showAccount: true,
      showWishlist: true,
      sticky: true,
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      borderBottom: true,
      height: 72,
      mobileMenuStyle: 'drawer',
    },
  },
  {
    id: 'hero-slider-1',
    type: 'hero-slider',
    enabled: true,
    order: 2,
    settings: {
      height: 600,
      mobileHeight: 400,
      autoplay: true,
      autoplaySpeed: 5000,
      showArrows: true,
      showDots: true,
      pauseOnHover: true,
      transition: 'slide',
      overlay: true,
      overlayOpacity: 30,
      overlayColor: '#000000',
    },
    blocks: [
      {
        id: 'slide-1',
        type: 'slide',
        settings: {
          title: 'Nová kolekcia 2024',
          titleSize: 56,
          subtitle: 'Objavte najnovšie produkty pre tento rok',
          subtitleSize: 20,
          buttonText: 'Nakupovať',
          buttonLink: '/novinky',
          buttonStyle: 'primary',
          secondaryButtonText: 'Viac info',
          secondaryButtonLink: '/o-nas',
          image: '',
          backgroundColor: '#2563eb',
          textColor: '#ffffff',
          textAlign: 'center',
          verticalAlign: 'center',
          contentWidth: 800,
        },
      },
      {
        id: 'slide-2',
        type: 'slide',
        settings: {
          title: 'Zimný výpredaj',
          titleSize: 56,
          subtitle: 'Až 50% zľava na vybrané produkty',
          subtitleSize: 20,
          buttonText: 'Zobraziť akcie',
          buttonLink: '/akcie',
          buttonStyle: 'primary',
          image: '',
          backgroundColor: '#dc2626',
          textColor: '#ffffff',
          textAlign: 'center',
          verticalAlign: 'center',
          contentWidth: 800,
        },
      },
      {
        id: 'slide-3',
        type: 'slide',
        settings: {
          title: 'Doprava zadarmo',
          titleSize: 56,
          subtitle: 'Pri každej objednávke nad €50',
          subtitleSize: 20,
          buttonText: 'Začať nakupovať',
          buttonLink: '/produkty',
          buttonStyle: 'primary',
          image: '',
          backgroundColor: '#059669',
          textColor: '#ffffff',
          textAlign: 'center',
          verticalAlign: 'center',
          contentWidth: 800,
        },
      },
    ],
  },
  {
    id: 'trust-badges-1',
    type: 'trust-badges',
    enabled: true,
    order: 3,
    settings: {
      layout: 'horizontal',
      style: 'minimal',
      backgroundColor: '#f8fafc',
      showBorder: true,
      iconSize: 32,
      padding: 24,
    },
    blocks: [
      { id: 'badge-1', type: 'badge', settings: { icon: '🚚', title: 'Doprava zadarmo', description: 'Pri nákupe nad €50' }},
      { id: 'badge-2', type: 'badge', settings: { icon: '🔄', title: '30 dní na vrátenie', description: 'Bez otázok' }},
      { id: 'badge-3', type: 'badge', settings: { icon: '🔒', title: 'Bezpečná platba', description: 'SSL šifrovanie' }},
      { id: 'badge-4', type: 'badge', settings: { icon: '💬', title: 'Podpora 24/7', description: 'Vždy tu pre vás' }},
    ],
  },
  {
    id: 'categories-1',
    type: 'categories-grid',
    enabled: true,
    order: 4,
    settings: {
      title: 'Nakupujte podľa kategórie',
      subtitle: 'Vyberte si z našej širokej ponuky produktov',
      titleAlign: 'center',
      columns: 6,
      mobileColumns: 3,
      gap: 16,
      style: 'card',
      showCount: true,
      showOverlay: true,
      overlayOpacity: 40,
      imageHeight: 180,
      borderRadius: 12,
      padding: { top: 80, bottom: 80 },
      backgroundColor: '#ffffff',
    },
    blocks: [
      { id: 'cat-1', type: 'category', settings: { name: 'Elektronika', icon: '📱', image: '', link: '/kategoria/elektronika', count: 156, color: '#3b82f6' }},
      { id: 'cat-2', type: 'category', settings: { name: 'Oblečenie', icon: '👕', image: '', link: '/kategoria/oblecenie', count: 243, color: '#ec4899' }},
      { id: 'cat-3', type: 'category', settings: { name: 'Dom & Záhrada', icon: '🏠', image: '', link: '/kategoria/dom', count: 89, color: '#22c55e' }},
      { id: 'cat-4', type: 'category', settings: { name: 'Šport', icon: '⚽', image: '', link: '/kategoria/sport', count: 167, color: '#f59e0b' }},
      { id: 'cat-5', type: 'category', settings: { name: 'Krása', icon: '💄', image: '', link: '/kategoria/krasa', count: 98, color: '#a855f7' }},
      { id: 'cat-6', type: 'category', settings: { name: 'Hračky', icon: '🧸', image: '', link: '/kategoria/hracky', count: 134, color: '#ef4444' }},
    ],
  },
  {
    id: 'products-featured-1',
    type: 'featured-products',
    enabled: true,
    order: 5,
    settings: {
      title: '🔥 Najpredávanejšie',
      subtitle: 'Produkty, ktoré si naši zákazníci najviac obľúbili',
      titleAlign: 'center',
      columns: 4,
      mobileColumns: 2,
      limit: 8,
      showRating: true,
      showReviewCount: true,
      showQuickAdd: true,
      showWishlist: true,
      showBadges: true,
      showDiscount: true,
      cardStyle: 'default',
      imageRatio: '1:1',
      gap: 24,
      padding: { top: 80, bottom: 40 },
      backgroundColor: '#ffffff',
      source: 'bestsellers',
      viewAllLink: '/bestsellers',
      viewAllText: 'Zobraziť všetky',
    },
  },
  {
    id: 'promo-banner-1',
    type: 'promo-banner',
    enabled: true,
    order: 6,
    settings: {
      title: '🎉 Limitovaná ponuka',
      subtitle: 'Využite zľavu 20% na celý sortiment. Akcia platí len tento víkend!',
      buttonText: 'Nakupovať so zľavou',
      buttonLink: '/akcie',
      buttonStyle: 'white',
      backgroundColor: '#7c3aed',
      backgroundGradient: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
      textColor: '#ffffff',
      textAlign: 'center',
      size: 'large',
      padding: { top: 60, bottom: 60 },
      showPattern: true,
      patternStyle: 'dots',
    },
  },
  {
    id: 'products-new-1',
    type: 'product-grid',
    enabled: true,
    order: 7,
    settings: {
      title: '✨ Novinky v ponuke',
      subtitle: 'Práve pridané produkty do nášho sortimentu',
      titleAlign: 'center',
      columns: 4,
      mobileColumns: 2,
      limit: 8,
      showRating: true,
      showQuickAdd: true,
      showBadges: true,
      gap: 24,
      padding: { top: 60, bottom: 80 },
      backgroundColor: '#f8fafc',
      source: 'newest',
      viewAllLink: '/novinky',
      viewAllText: 'Zobraziť všetky novinky',
    },
  },
  {
    id: 'image-text-1',
    type: 'image-with-text',
    enabled: true,
    order: 8,
    settings: {
      title: 'Prečo nakupovať u nás?',
      content: `<p>Sme tu pre vás už viac ako 10 rokov a za ten čas sme pomohli tisíckam spokojných zákazníkov.</p>
<ul>
<li>✓ Overené produkty od renomovaných výrobcov</li>
<li>✓ Plná záruka na všetok tovar</li>
<li>✓ Rýchle doručenie do 2 pracovných dní</li>
<li>✓ Profesionálny zákaznícky servis</li>
</ul>`,
      buttonText: 'Viac o nás',
      buttonLink: '/o-nas',
      image: '',
      imagePosition: 'right',
      imageWidth: 50,
      verticalAlign: 'center',
      backgroundColor: '#ffffff',
      padding: { top: 80, bottom: 80 },
      contentPadding: 60,
      borderRadius: 16,
    },
  },
  {
    id: 'countdown-1',
    type: 'countdown-timer',
    enabled: false,
    order: 9,
    settings: {
      title: '⏰ Flash Sale končí o',
      subtitle: 'Nenechajte si ujsť jedinečnú príležitosť!',
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      buttonText: 'Nakupovať teraz',
      buttonLink: '/akcie',
      backgroundColor: '#dc2626',
      backgroundGradient: '',
      textColor: '#ffffff',
      style: 'boxes',
      showSeconds: true,
      size: 'large',
      padding: { top: 60, bottom: 60 },
    },
  },
  {
    id: 'testimonials-1',
    type: 'testimonials',
    enabled: true,
    order: 10,
    settings: {
      title: '💬 Čo hovoria naši zákazníci',
      subtitle: 'Prečítajte si recenzie od skutočných zákazníkov',
      titleAlign: 'center',
      layout: 'carousel',
      columns: 3,
      autoplay: true,
      autoplaySpeed: 5000,
      showRating: true,
      showAvatar: true,
      showDate: true,
      backgroundColor: '#f8fafc',
      cardBackgroundColor: '#ffffff',
      padding: { top: 80, bottom: 80 },
    },
    blocks: [
      { id: 'test-1', type: 'testimonial', settings: { 
        name: 'Ján Novák', 
        location: 'Bratislava', 
        avatar: '',
        rating: 5, 
        text: 'Absolútne spokojný! Objednávka prišla do 24 hodín, tovar presne podľa popisu. Určite budem nakupovať znova.',
        date: '2024-01-15',
        verified: true,
      }},
      { id: 'test-2', type: 'testimonial', settings: { 
        name: 'Mária Kováčová', 
        location: 'Košice', 
        avatar: '',
        rating: 5, 
        text: 'Výborná skúsenosť. Ceny sú super a kvalita produktov ma príjemne prekvapila. Odporúčam všetkým!',
        date: '2024-01-10',
        verified: true,
      }},
      { id: 'test-3', type: 'testimonial', settings: { 
        name: 'Peter Horváth', 
        location: 'Žilina', 
        avatar: '',
        rating: 5, 
        text: 'Profesionálny prístup a skvelá zákaznícka podpora. Keď som mal problém, vyriešili ho okamžite.',
        date: '2024-01-08',
        verified: true,
      }},
      { id: 'test-4', type: 'testimonial', settings: { 
        name: 'Anna Szabóová', 
        location: 'Nitra', 
        avatar: '',
        rating: 5, 
        text: 'Nakupujem tu pravidelne už 2 roky. Vždy spoľahlivé a rýchle. Najlepší eshop v tejto kategórii.',
        date: '2024-01-05',
        verified: true,
      }},
    ],
  },
  {
    id: 'features-1',
    type: 'features-icons',
    enabled: true,
    order: 11,
    settings: {
      title: 'Naše výhody',
      titleAlign: 'center',
      columns: 4,
      mobileColumns: 2,
      style: 'card',
      iconSize: 48,
      iconColor: 'primary',
      backgroundColor: '#ffffff',
      cardBackgroundColor: '#f8fafc',
      padding: { top: 80, bottom: 80 },
      gap: 24,
    },
    blocks: [
      { id: 'feat-1', type: 'feature', settings: { icon: '✨', title: 'Prémiová kvalita', description: 'Len overené produkty od najlepších svetových značiek' }},
      { id: 'feat-2', type: 'feature', settings: { icon: '💰', title: 'Najlepšie ceny', description: 'Garantujeme konkurencieschopné ceny na celom trhu' }},
      { id: 'feat-3', type: 'feature', settings: { icon: '🚀', title: 'Expresné doručenie', description: 'Objednávky do 14:00 odosielame v ten istý deň' }},
      { id: 'feat-4', type: 'feature', settings: { icon: '🛡️', title: 'Plná záruka', description: '2-ročná záruka na všetky produkty v ponuke' }},
    ],
  },
  {
    id: 'faq-1',
    type: 'faq-accordion',
    enabled: true,
    order: 12,
    settings: {
      title: '❓ Často kladené otázky',
      subtitle: 'Odpovede na najčastejšie otázky',
      titleAlign: 'center',
      style: 'default',
      allowMultiple: false,
      backgroundColor: '#ffffff',
      padding: { top: 80, bottom: 80 },
      maxWidth: 800,
    },
    blocks: [
      { id: 'faq-1', type: 'faq', settings: { question: 'Ako dlho trvá doručenie?', answer: 'Štandardné doručenie trvá 2-3 pracovné dni. Pri objednávkach do 14:00 odosielame tovar v ten istý deň.' }},
      { id: 'faq-2', type: 'faq', settings: { question: 'Môžem vrátiť tovar?', answer: 'Áno, tovar môžete vrátiť do 30 dní od prevzatia bez udania dôvodu. Peniaze vám vrátime do 14 dní.' }},
      { id: 'faq-3', type: 'faq', settings: { question: 'Aké platobné metódy akceptujete?', answer: 'Akceptujeme platby kartou, bankovým prevodom, Apple Pay, Google Pay a platbu na dobierku.' }},
      { id: 'faq-4', type: 'faq', settings: { question: 'Poskytujete záruku na produkty?', answer: 'Áno, na všetky produkty poskytujeme štandardnú 2-ročnú záruku podľa zákona.' }},
      { id: 'faq-5', type: 'faq', settings: { question: 'Ako môžem sledovať svoju objednávku?', answer: 'Po odoslaní objednávky vám príde email s trackovacím číslom, pomocou ktorého môžete sledovať zásielku.' }},
    ],
  },
  {
    id: 'newsletter-1',
    type: 'newsletter',
    enabled: true,
    order: 13,
    settings: {
      title: '📧 Prihláste sa na odber noviniek',
      subtitle: 'Buďte prvý, kto sa dozvie o novinkách a exkluzívnych akciách. Získajte 10% zľavu na prvý nákup!',
      buttonText: 'Prihlásiť sa',
      placeholder: 'Váš e-mail',
      backgroundColor: '#0f172a',
      backgroundGradient: '',
      textColor: '#ffffff',
      inputStyle: 'white',
      layout: 'inline',
      size: 'large',
      showIcon: true,
      showPrivacyNote: true,
      privacyText: 'Prihlásením súhlasíte so spracovaním osobných údajov.',
      padding: { top: 80, bottom: 80 },
      maxWidth: 600,
    },
  },
  {
    id: 'brands-1',
    type: 'brand-logos',
    enabled: true,
    order: 14,
    settings: {
      title: 'Naši partneri',
      titleAlign: 'center',
      layout: 'carousel',
      columns: 6,
      autoplay: true,
      autoplaySpeed: 3000,
      grayscale: true,
      grayscaleHover: false,
      logoHeight: 48,
      gap: 48,
      backgroundColor: '#f8fafc',
      padding: { top: 60, bottom: 60 },
    },
    blocks: [
      { id: 'brand-1', type: 'brand', settings: { name: 'Apple', logo: '', link: '' }},
      { id: 'brand-2', type: 'brand', settings: { name: 'Samsung', logo: '', link: '' }},
      { id: 'brand-3', type: 'brand', settings: { name: 'Sony', logo: '', link: '' }},
      { id: 'brand-4', type: 'brand', settings: { name: 'Nike', logo: '', link: '' }},
      { id: 'brand-5', type: 'brand', settings: { name: 'Adidas', logo: '', link: '' }},
      { id: 'brand-6', type: 'brand', settings: { name: 'Puma', logo: '', link: '' }},
    ],
  },
  {
    id: 'footer-1',
    type: 'footer',
    enabled: true,
    order: 15,
    settings: {
      logoText: 'Demo Shop',
      logoImage: '',
      description: 'Váš obľúbený e-shop s najlepšími produktami za skvelé ceny. Nakupujte pohodlne z domova s dopravou zadarmo.',
      copyrightText: '© 2024 Demo Shop. Všetky práva vyhradené.',
      backgroundColor: '#0f172a',
      textColor: '#94a3b8',
      headingColor: '#ffffff',
      linkColor: '#94a3b8',
      linkHoverColor: '#ffffff',
      showSocialLinks: true,
      showPaymentMethods: true,
      showNewsletter: false,
      columnsLayout: '4',
      bottomLinks: [
        { label: 'Obchodné podmienky', link: '/obchodne-podmienky' },
        { label: 'Ochrana súkromia', link: '/gdpr' },
        { label: 'Cookies', link: '/cookies' },
      ],
      columns: [
        { 
          title: 'Nakupovanie', 
          links: [
            { label: 'Všetky produkty', url: '/produkty' },
            { label: 'Novinky', url: '/novinky' },
            { label: 'Bestsellery', url: '/bestsellers' },
            { label: 'Akcie', url: '/akcie' },
            { label: 'Výpredaj', url: '/vypredaj' },
          ]
        },
        { 
          title: 'Informácie', 
          links: [
            { label: 'O nás', url: '/o-nas' },
            { label: 'Kontakt', url: '/kontakt' },
            { label: 'Doprava a platba', url: '/doprava' },
            { label: 'Vrátenie tovaru', url: '/vracanie' },
            { label: 'FAQ', url: '/faq' },
          ]
        },
        { 
          title: 'Zákaznícky servis', 
          links: [
            { label: 'Sledovanie objednávky', url: '/sledovanie' },
            { label: 'Reklamácie', url: '/reklamacie' },
            { label: 'Záručné podmienky', url: '/zaruka' },
            { label: 'Veľkoobchod', url: '/velkoobchod' },
          ]
        },
        { 
          title: 'Kontakt', 
          content: `<p><strong>Demo Shop s.r.o.</strong></p>
<p>Hlavná 1, 811 01 Bratislava</p>
<p>📞 +421 900 123 456</p>
<p>✉️ info@demoshop.sk</p>
<p>Po-Pi: 9:00 - 17:00</p>`
        },
      ],
      socialLinks: [
        { platform: 'facebook', url: 'https://facebook.com' },
        { platform: 'instagram', url: 'https://instagram.com' },
        { platform: 'twitter', url: 'https://twitter.com' },
        { platform: 'youtube', url: 'https://youtube.com' },
        { platform: 'tiktok', url: 'https://tiktok.com' },
      ],
      paymentMethods: ['visa', 'mastercard', 'maestro', 'applepay', 'googlepay', 'paypal'],
      padding: { top: 80, bottom: 40 },
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ShopTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'modern' | 'minimal' | 'bold' | 'elegant' | 'playful' | 'professional' | 'dark';
  features: string[];
  theme: Partial<ShopTheme>;
  sections: ShopSection[];
}

export const shopTemplates: ShopTemplate[] = [
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    description: 'Čistý moderný dizajn s modrou farbovou schémou. Ideálny pre elektroniku a tech produkty.',
    thumbnail: '/templates/modern-blue.jpg',
    category: 'modern',
    features: ['Hero Slider', 'Produktový carousel', 'Testimonials', 'Newsletter'],
    theme: {
      primaryColor: '#2563eb',
      primaryHoverColor: '#1d4ed8',
      secondaryColor: '#10b981',
      accentColor: '#f59e0b',
      buttonStyle: 'solid',
      buttonRounded: false,
      cardHoverEffect: 'lift',
      headerStyle: 'default',
      productCardStyle: 'default',
      animationStyle: 'normal',
    },
    sections: defaultSections,
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    description: 'Elegantný minimalistický dizajn s čistými líniami. Perfektný pre módu a lifestyle.',
    thumbnail: '/templates/minimal-light.jpg',
    category: 'minimal',
    features: ['Hero Banner', 'Čistý layout', 'Veľa bielej plochy', 'Jemné animácie'],
    theme: {
      primaryColor: '#18181b',
      primaryHoverColor: '#27272a',
      secondaryColor: '#a1a1aa',
      accentColor: '#f4f4f5',
      borderRadiusSmall: 0,
      borderRadiusMedium: 0,
      borderRadiusLarge: 0,
      buttonStyle: 'outline',
      buttonRounded: false,
      cardShadow: false,
      cardBorder: true,
      cardHoverEffect: 'border',
      headerStyle: 'minimal',
      productCardStyle: 'minimal',
      animationStyle: 'subtle',
    },
    sections: defaultSections,
  },
  {
    id: 'bold-orange',
    name: 'Bold Orange',
    description: 'Energický a výrazný dizajn s oranžovou farbou. Skvelý pre športové a outdoor produkty.',
    thumbnail: '/templates/bold-orange.jpg',
    category: 'bold',
    features: ['Výrazné farby', 'Veľké tlačidlá', 'Dynamické animácie'],
    theme: {
      primaryColor: '#ea580c',
      primaryHoverColor: '#c2410c',
      secondaryColor: '#0891b2',
      accentColor: '#fbbf24',
      borderRadiusLarge: 24,
      buttonStyle: 'solid',
      buttonRounded: true,
      cardHoverEffect: 'glow',
      headerStyle: 'default',
      productCardStyle: 'detailed',
      animationStyle: 'playful',
    },
    sections: defaultSections,
  },
  {
    id: 'elegant-gold',
    name: 'Elegant Gold',
    description: 'Luxusný a elegantný dizajn so zlatými akcentmi. Ideálny pre šperky a luxusný tovar.',
    thumbnail: '/templates/elegant-gold.jpg',
    category: 'elegant',
    features: ['Luxusný vzhľad', 'Zlaté akcenty', 'Elegantná typografia'],
    theme: {
      primaryColor: '#b8860b',
      primaryHoverColor: '#996515',
      secondaryColor: '#1f2937',
      accentColor: '#fef3c7',
      fontFamily: 'Playfair Display, serif',
      headingFontFamily: 'Playfair Display, serif',
      borderRadiusSmall: 0,
      borderRadiusMedium: 0,
      borderRadiusLarge: 0,
      buttonStyle: 'outline',
      buttonRounded: false,
      cardShadow: false,
      cardBorder: true,
      cardHoverEffect: 'border',
      headerStyle: 'centered',
      productCardStyle: 'overlay',
      animationStyle: 'subtle',
    },
    sections: defaultSections,
  },
  {
    id: 'playful-pink',
    name: 'Playful Pink',
    description: 'Hravý a farebný dizajn s ružovými tónmi. Perfektný pre kozmetiku a produkty pre deti.',
    thumbnail: '/templates/playful-pink.jpg',
    category: 'playful',
    features: ['Veselé farby', 'Zaoblené rohy', 'Hravé animácie'],
    theme: {
      primaryColor: '#ec4899',
      primaryHoverColor: '#db2777',
      secondaryColor: '#8b5cf6',
      accentColor: '#fbbf24',
      borderRadiusMedium: 16,
      borderRadiusLarge: 24,
      buttonStyle: 'solid',
      buttonRounded: true,
      cardHoverEffect: 'lift',
      headerStyle: 'default',
      productCardStyle: 'default',
      animationStyle: 'playful',
    },
    sections: defaultSections,
  },
  {
    id: 'professional-green',
    name: 'Professional Green',
    description: 'Profesionálny obchodný dizajn so zelenou farbou. Vhodný pre B2B a odborné služby.',
    thumbnail: '/templates/professional-green.jpg',
    category: 'professional',
    features: ['Profesionálny vzhľad', 'Dôveryhodný dizajn', 'Čisté rozloženie'],
    theme: {
      primaryColor: '#059669',
      primaryHoverColor: '#047857',
      secondaryColor: '#0891b2',
      accentColor: '#fbbf24',
      fontFamily: 'Roboto, sans-serif',
      headingFontFamily: 'Roboto, sans-serif',
      buttonStyle: 'solid',
      buttonRounded: false,
      cardShadow: true,
      cardBorder: false,
      cardHoverEffect: 'lift',
      headerStyle: 'default',
      productCardStyle: 'detailed',
      animationStyle: 'normal',
    },
    sections: defaultSections,
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    description: 'Tmavý elegantný dizajn pre nočné nakupovanie. Moderný a štýlový.',
    thumbnail: '/templates/dark-mode.jpg',
    category: 'dark',
    features: ['Tmavé pozadie', 'Neonové akcenty', 'Moderný vzhľad'],
    theme: {
      primaryColor: '#818cf8',
      primaryHoverColor: '#6366f1',
      secondaryColor: '#34d399',
      accentColor: '#fbbf24',
      backgroundColor: '#0f172a',
      surfaceColor: '#1e293b',
      cardColor: '#1e293b',
      textColor: '#f1f5f9',
      textMutedColor: '#94a3b8',
      headingColor: '#ffffff',
      borderColor: '#334155',
      buttonStyle: 'solid',
      buttonRounded: false,
      cardShadow: false,
      cardBorder: true,
      cardHoverEffect: 'glow',
      headerStyle: 'default',
      headerBackground: 'dark',
      productCardStyle: 'default',
      animationStyle: 'normal',
    },
    sections: defaultSections,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SHOP SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════

export interface ShopSettings {
  // Basic info
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo: string;
  favicon: string;
  
  // Contact
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  
  // Social
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  tiktok: string;
  linkedin: string;
  pinterest: string;
  
  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  
  // Theme & Sections
  theme: ShopTheme;
  sections: ShopSection[];
  
  // Localization
  currency: string;
  currencySymbol: string;
  currencyPosition: 'before' | 'after';
  language: string;
  timezone: string;
  dateFormat: string;
  
  // Ecommerce settings
  freeShippingThreshold: number;
  taxRate: number;
  taxIncluded: boolean;
  
  // Features
  enableReviews: boolean;
  enableWishlist: boolean;
  enableCompare: boolean;
  enableQuickView: boolean;
  enableRecentlyViewed: boolean;
  enableStockNotification: boolean;
  
  // Checkout
  guestCheckout: boolean;
  minimumOrder: number;
  termsUrl: string;
  privacyUrl: string;
}

export const defaultShopSettings: ShopSettings = {
  id: 'demo-shop',
  name: 'Demo Shop',
  slug: 'demo',
  tagline: 'Váš obľúbený e-shop',
  description: 'Najlepšie produkty za skvelé ceny s dopravou zadarmo. Nakupujte pohodlne online.',
  logo: '',
  favicon: '',
  email: 'info@demoshop.sk',
  phone: '+421 900 123 456',
  address: 'Hlavná 1',
  city: 'Bratislava',
  zip: '811 01',
  country: 'SK',
  facebook: 'https://facebook.com/demoshop',
  instagram: 'https://instagram.com/demoshop',
  twitter: '',
  youtube: '',
  tiktok: '',
  linkedin: '',
  pinterest: '',
  metaTitle: 'Demo Shop - Váš obľúbený e-shop',
  metaDescription: 'Nakupujte najlepšie produkty online s dopravou zadarmo nad €50. Tisíce produktov, rýchle doručenie, spokojní zákazníci.',
  metaKeywords: 'eshop, nakupovanie, online shop, produkty',
  ogImage: '',
  theme: defaultTheme,
  sections: defaultSections,
  currency: 'EUR',
  currencySymbol: '€',
  currencyPosition: 'after',
  language: 'sk',
  timezone: 'Europe/Bratislava',
  dateFormat: 'DD.MM.YYYY',
  freeShippingThreshold: 50,
  taxRate: 20,
  taxIncluded: true,
  enableReviews: true,
  enableWishlist: true,
  enableCompare: false,
  enableQuickView: true,
  enableRecentlyViewed: true,
  enableStockNotification: true,
  guestCheckout: true,
  minimumOrder: 0,
  termsUrl: '/obchodne-podmienky',
  privacyUrl: '/gdpr',
};

// ═══════════════════════════════════════════════════════════════════════════════
// EDITOR STATE
// ═══════════════════════════════════════════════════════════════════════════════

interface EditorState {
  // UI State
  isEditing: boolean;
  isPreviewing: boolean;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  previewScale: number;
  selectedSection: string | null;
  selectedBlock: string | null;
  hoveredSection: string | null;
  sidebarTab: 'sections' | 'theme' | 'settings' | 'seo';
  sidebarOpen: boolean;
  sidebarWidth: number;
  draggedSection: string | null;
  draggedBlock: string | null;
  showAddSectionModal: boolean;
  showTemplatesModal: boolean;
  showMediaLibrary: boolean;
  showCodeEditor: boolean;
  showShortcuts: boolean;
  
  // History
  hasUnsavedChanges: boolean;
  history: ShopSettings[];
  historyIndex: number;
  lastSaved: Date | null;
  
  // Data
  shopSettings: ShopSettings;
  
  // UI Actions
  setEditing: (editing: boolean) => void;
  setPreviewing: (previewing: boolean) => void;
  setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  setPreviewScale: (scale: number) => void;
  selectSection: (id: string | null) => void;
  selectBlock: (id: string | null) => void;
  setHoveredSection: (id: string | null) => void;
  setSidebarTab: (tab: 'sections' | 'theme' | 'settings' | 'seo') => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setDraggedSection: (id: string | null) => void;
  setDraggedBlock: (id: string | null) => void;
  setShowAddSectionModal: (show: boolean) => void;
  setShowTemplatesModal: (show: boolean) => void;
  setShowMediaLibrary: (show: boolean) => void;
  setShowCodeEditor: (show: boolean) => void;
  setShowShortcuts: (show: boolean) => void;
  
  // Section Actions
  toggleSection: (id: string) => void;
  moveSection: (id: string, direction: 'up' | 'down') => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  updateSectionSettings: (id: string, settings: Record<string, any>) => void;
  addSection: (type: SectionType, afterId?: string) => void;
  removeSection: (id: string) => void;
  duplicateSection: (id: string) => void;
  
  // Block Actions
  addBlock: (sectionId: string, type: string, settings?: Record<string, any>, afterId?: string) => void;
  removeBlock: (sectionId: string, blockId: string) => void;
  updateBlockSettings: (sectionId: string, blockId: string, settings: Record<string, any>) => void;
  reorderBlocks: (sectionId: string, startIndex: number, endIndex: number) => void;
  duplicateBlock: (sectionId: string, blockId: string) => void;
  
  // Theme Actions
  updateTheme: (theme: Partial<ShopTheme>) => void;
  resetTheme: () => void;
  applyTemplate: (templateId: string) => void;
  
  // Shop Settings Actions
  updateShopSettings: (settings: Partial<ShopSettings>) => void;
  
  // History Actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveToHistory: () => void;
  
  // Persistence Actions
  saveChanges: () => Promise<void>;
  resetChanges: () => void;
  exportSettings: () => string;
  importSettings: (json: string) => boolean;
  
  // Helpers
  getSection: (id: string) => ShopSection | undefined;
  getSectionsByType: (type: SectionType) => ShopSection[];
  getSortedSections: () => ShopSection[];
}

export const useEditor = create<EditorState>()(
  persist(
    (set, get) => ({
      // Initial State
      isEditing: false,
      isPreviewing: false,
      previewDevice: 'desktop',
      previewScale: 1,
      selectedSection: null,
      selectedBlock: null,
      hoveredSection: null,
      sidebarTab: 'sections',
      sidebarOpen: true,
      sidebarWidth: 360,
      draggedSection: null,
      draggedBlock: null,
      showAddSectionModal: false,
      showTemplatesModal: false,
      showMediaLibrary: false,
      showCodeEditor: false,
      showShortcuts: false,
      hasUnsavedChanges: false,
      history: [],
      historyIndex: -1,
      lastSaved: null,
      shopSettings: defaultShopSettings,

      // UI Actions
      setEditing: (editing) => set({ 
        isEditing: editing, 
        selectedSection: null, 
        selectedBlock: null,
        isPreviewing: false,
      }),
      setPreviewing: (previewing) => set({ isPreviewing: previewing }),
      setPreviewDevice: (device) => set({ previewDevice: device }),
      setPreviewScale: (scale) => set({ previewScale: scale }),
      selectSection: (id) => set({ selectedSection: id, selectedBlock: null }),
      selectBlock: (id) => set({ selectedBlock: id }),
      setHoveredSection: (id) => set({ hoveredSection: id }),
      setSidebarTab: (tab) => set({ sidebarTab: tab }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSidebarWidth: (width) => set({ sidebarWidth: Math.max(280, Math.min(480, width)) }),
      setDraggedSection: (id) => set({ draggedSection: id }),
      setDraggedBlock: (id) => set({ draggedBlock: id }),
      setShowAddSectionModal: (show) => set({ showAddSectionModal: show }),
      setShowTemplatesModal: (show) => set({ showTemplatesModal: show }),
      setShowMediaLibrary: (show) => set({ showMediaLibrary: show }),
      setShowCodeEditor: (show) => set({ showCodeEditor: show }),
      setShowShortcuts: (show) => set({ showShortcuts: show }),

      // Section Actions
      toggleSection: (id) => {
        const state = get();
        state.saveToHistory();
        const sections = state.shopSettings.sections.map(s => 
          s.id === id ? { ...s, enabled: !s.enabled } : s
        );
        set({ 
          shopSettings: { ...state.shopSettings, sections },
          hasUnsavedChanges: true 
        });
      },

      moveSection: (id, direction) => {
        const state = get();
        const sections = [...state.shopSettings.sections].sort((a, b) => a.order - b.order);
        const index = sections.findIndex(s => s.id === id);
        if (index === -1) return;
        
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= sections.length) return;
        
        state.saveToHistory();
        [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
        const reordered = sections.map((s, i) => ({ ...s, order: i }));
        
        set({ 
          shopSettings: { ...state.shopSettings, sections: reordered },
          hasUnsavedChanges: true 
        });
      },

      reorderSections: (startIndex, endIndex) => {
        const state = get();
        const sections = [...state.shopSettings.sections].sort((a, b) => a.order - b.order);
        const [removed] = sections.splice(startIndex, 1);
        sections.splice(endIndex, 0, removed);
        
        state.saveToHistory();
        const reordered = sections.map((s, i) => ({ ...s, order: i }));
        
        set({ 
          shopSettings: { ...state.shopSettings, sections: reordered },
          hasUnsavedChanges: true 
        });
      },

      updateSectionSettings: (id, settings) => {
        const state = get();
        const sections = state.shopSettings.sections.map(s => 
          s.id === id ? { ...s, settings: { ...s.settings, ...settings } } : s
        );
        set({ 
          shopSettings: { ...state.shopSettings, sections },
          hasUnsavedChanges: true 
        });
      },

      addSection: (type, afterId) => {
        const state = get();
        let order = state.shopSettings.sections.length;
        
        if (afterId) {
          const sortedSections = [...state.shopSettings.sections].sort((a, b) => a.order - b.order);
          const afterIndex = sortedSections.findIndex(s => s.id === afterId);
          if (afterIndex !== -1) {
            order = sortedSections[afterIndex].order + 1;
          }
        }
        
        state.saveToHistory();
        
        const newSection: ShopSection = {
          id: `${type}-${Date.now()}`,
          type,
          enabled: true,
          order,
          settings: {},
          blocks: [],
        };
        
        const sections = state.shopSettings.sections.map(s => 
          s.order >= order ? { ...s, order: s.order + 1 } : s
        );
        sections.push(newSection);
        
        set({ 
          shopSettings: { ...state.shopSettings, sections },
          selectedSection: newSection.id,
          showAddSectionModal: false,
          hasUnsavedChanges: true 
        });
      },

      removeSection: (id) => {
        const state = get();
        state.saveToHistory();
        const sections = state.shopSettings.sections
          .filter(s => s.id !== id)
          .map((s, i) => ({ ...s, order: i }));
        set({ 
          shopSettings: { ...state.shopSettings, sections },
          selectedSection: null,
          selectedBlock: null,
          hasUnsavedChanges: true 
        });
      },

      duplicateSection: (id) => {
        const state = get();
        const section = state.shopSettings.sections.find(s => s.id === id);
        if (!section) return;
        
        state.saveToHistory();
        
        const newSection: ShopSection = {
          ...JSON.parse(JSON.stringify(section)),
          id: `${section.type}-${Date.now()}`,
          order: section.order + 1,
        };
        
        // Update block IDs to be unique
        if (newSection.blocks) {
          newSection.blocks = newSection.blocks.map(b => ({
            ...b,
            id: `${b.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          }));
        }
        
        const sections = state.shopSettings.sections.map(s => 
          s.order > section.order ? { ...s, order: s.order + 1 } : s
        );
        sections.push(newSection);
        
        set({ 
          shopSettings: { ...state.shopSettings, sections },
          selectedSection: newSection.id,
          hasUnsavedChanges: true 
        });
      },

      // Block Actions
      addBlock: (sectionId, type, settings = {}, afterId) => {
        const state = get();
        state.saveToHistory();
        
        const sections = state.shopSettings.sections.map(section => {
          if (section.id !== sectionId) return section;
          
          const blocks = [...(section.blocks || [])];
          let insertIndex = blocks.length;
          
          if (afterId) {
            const afterIndex = blocks.findIndex(b => b.id === afterId);
            if (afterIndex !== -1) insertIndex = afterIndex + 1;
          }
          
          const newBlock: SectionBlock = {
            id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type,
            settings,
          };
          
          blocks.splice(insertIndex, 0, newBlock);
          return { ...section, blocks };
        });
        
        set({ 
          shopSettings: { ...state.shopSettings, sections },
          hasUnsavedChanges: true 
        });
      },

      removeBlock: (sectionId, blockId) => {
        const state = get();
        state.saveToHistory();
        
        const sections = state.shopSettings.sections.map(section => {
          if (section.id !== sectionId) return section;
          return { 
            ...section, 
            blocks: (section.blocks || []).filter(b => b.id !== blockId) 
          };
        });
        
        set({ 
          shopSettings: { ...state.shopSettings, sections },
          selectedBlock: null,
          hasUnsavedChanges: true 
        });
      },

      updateBlockSettings: (sectionId, blockId, settings) => {
        const state = get();
        const sections = state.shopSettings.sections.map(section => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            blocks: (section.blocks || []).map(b => 
              b.id === blockId ? { ...b, settings: { ...b.settings, ...settings } } : b
            ),
          };
        });
        
        set({ 
          shopSettings: { ...state.shopSettings, sections },
          hasUnsavedChanges: true 
        });
      },

      reorderBlocks: (sectionId, startIndex, endIndex) => {
        const state = get();
        state.saveToHistory();
        
        const sections = state.shopSettings.sections.map(section => {
          if (section.id !== sectionId) return section;
          const blocks = [...(section.blocks || [])];
          const [removed] = blocks.splice(startIndex, 1);
          blocks.splice(endIndex, 0, removed);
          return { ...section, blocks };
        });
        
        set({ 
          shopSettings: { ...state.shopSettings, sections },
          hasUnsavedChanges: true 
        });
      },

      duplicateBlock: (sectionId, blockId) => {
        const state = get();
        state.saveToHistory();
        
        const sections = state.shopSettings.sections.map(section => {
          if (section.id !== sectionId) return section;
          
          const blocks = [...(section.blocks || [])];
          const blockIndex = blocks.findIndex(b => b.id === blockId);
          if (blockIndex === -1) return section;
          
          const block = blocks[blockIndex];
          const newBlock: SectionBlock = {
            ...JSON.parse(JSON.stringify(block)),
            id: `${block.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          };
          
          blocks.splice(blockIndex + 1, 0, newBlock);
          return { ...section, blocks };
        });
        
        set({ 
          shopSettings: { ...state.shopSettings, sections },
          hasUnsavedChanges: true 
        });
      },

      // Theme Actions
      updateTheme: (theme) => {
        const state = get();
        set({ 
          shopSettings: { 
            ...state.shopSettings, 
            theme: { ...state.shopSettings.theme, ...theme } 
          },
          hasUnsavedChanges: true 
        });
      },

      resetTheme: () => {
        const state = get();
        state.saveToHistory();
        set({ 
          shopSettings: { ...state.shopSettings, theme: defaultTheme },
          hasUnsavedChanges: true 
        });
      },

      applyTemplate: (templateId) => {
        const state = get();
        const template = shopTemplates.find(t => t.id === templateId);
        if (!template) return;
        
        state.saveToHistory();
        
        set({ 
          shopSettings: { 
            ...state.shopSettings,
            theme: { ...defaultTheme, ...template.theme },
            sections: JSON.parse(JSON.stringify(template.sections)),
          },
          showTemplatesModal: false,
          selectedSection: null,
          selectedBlock: null,
          hasUnsavedChanges: true 
        });
      },

      // Shop Settings Actions
      updateShopSettings: (settings) => {
        const state = get();
        set({ 
          shopSettings: { ...state.shopSettings, ...settings },
          hasUnsavedChanges: true 
        });
      },

      // History Actions
      undo: () => {
        const state = get();
        if (state.historyIndex > 0) {
          set({ 
            historyIndex: state.historyIndex - 1,
            shopSettings: JSON.parse(JSON.stringify(state.history[state.historyIndex - 1])),
            hasUnsavedChanges: true 
          });
        }
      },

      redo: () => {
        const state = get();
        if (state.historyIndex < state.history.length - 1) {
          set({ 
            historyIndex: state.historyIndex + 1,
            shopSettings: JSON.parse(JSON.stringify(state.history[state.historyIndex + 1])),
            hasUnsavedChanges: true 
          });
        }
      },

      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,

      saveToHistory: () => {
        const state = get();
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(state.shopSettings)));
        set({ 
          history: newHistory.slice(-50), // Keep last 50 states
          historyIndex: Math.min(newHistory.length - 1, 49)
        });
      },

      // Persistence Actions
      saveChanges: async () => {
        const state = get();
        state.saveToHistory();
        // Here you would save to API
        console.log('💾 Saving shop settings:', state.shopSettings);
        set({ hasUnsavedChanges: false, lastSaved: new Date() });
        return Promise.resolve();
      },

      resetChanges: () => {
        const state = get();
        if (state.historyIndex >= 0 && state.history.length > 0) {
          set({ 
            shopSettings: JSON.parse(JSON.stringify(state.history[0])),
            historyIndex: 0,
            hasUnsavedChanges: false 
          });
        }
      },

      exportSettings: () => {
        return JSON.stringify(get().shopSettings, null, 2);
      },

      importSettings: (json) => {
        try {
          const settings = JSON.parse(json) as ShopSettings;
          const state = get();
          state.saveToHistory();
          set({ 
            shopSettings: { ...defaultShopSettings, ...settings },
            hasUnsavedChanges: true 
          });
          return true;
        } catch (e) {
          console.error('Failed to import settings:', e);
          return false;
        }
      },

      // Helpers
      getSection: (id) => get().shopSettings.sections.find(s => s.id === id),
      getSectionsByType: (type) => get().shopSettings.sections.filter(s => s.type === type),
      getSortedSections: () => [...get().shopSettings.sections].sort((a, b) => a.order - b.order),
    }),
    {
      name: 'shop-builder-v2-storage',
      partialize: (state) => ({ 
        shopSettings: state.shopSettings, 
        history: state.history.slice(-10), // Store only last 10 history states
        historyIndex: Math.min(state.historyIndex, 9),
        sidebarWidth: state.sidebarWidth,
      }),
    }
  )
);

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS STORE (Payments, Shipping, etc.)
// ═══════════════════════════════════════════════════════════════════════════════

interface PaymentMethod {
  enabled: boolean;
  testMode: boolean;
  [key: string]: any;
}

interface ShippingMethod {
  enabled: boolean;
  price: number;
  freeFrom: number;
  [key: string]: any;
}

interface SettingsState {
  payments: {
    comgate: PaymentMethod & { merchantId: string; secret: string };
    gopay: PaymentMethod & { goId: string; clientId: string; clientSecret: string };
    stripe: PaymentMethod & { publishableKey: string; secretKey: string };
    paypal: PaymentMethod & { clientId: string; clientSecret: string };
    bankTransfer: { enabled: boolean; iban: string; swift: string; bankName: string; variableSymbol: string };
    cod: { enabled: boolean; fee: number; maxAmount: number };
  };
  shipping: {
    dpd: ShippingMethod & { apiKey: string; username: string; password: string; showWidget: boolean };
    zasielkovna: ShippingMethod & { apiKey: string; showWidget: boolean };
    slovakPost: ShippingMethod & { apiKey: string };
    gls: ShippingMethod & { apiKey: string; clientNumber: string };
    personalPickup: { enabled: boolean; locations: { id: string; name: string; address: string; openingHours: string }[] };
  };
  general: {
    shopName: string;
    email: string;
    phone: string;
    currency: string;
    language: string;
    timezone: string;
    orderPrefix: string;
    invoicePrefix: string;
  };
  notifications: {
    orderConfirmation: boolean;
    orderShipped: boolean;
    orderDelivered: boolean;
    abandonedCart: boolean;
    lowStock: boolean;
    lowStockThreshold: number;
  };
  updatePayments: (method: string, value: any) => void;
  updateShipping: (method: string, value: any) => void;
  updateGeneral: (value: any) => void;
  updateNotifications: (value: any) => void;
}

export const useSettings = create<SettingsState>((set) => ({
  payments: {
    comgate: { enabled: false, testMode: true, merchantId: '', secret: '' },
    gopay: { enabled: false, testMode: true, goId: '', clientId: '', clientSecret: '' },
    stripe: { enabled: false, testMode: true, publishableKey: '', secretKey: '' },
    paypal: { enabled: false, testMode: true, clientId: '', clientSecret: '' },
    bankTransfer: { enabled: true, iban: '', swift: '', bankName: '', variableSymbol: 'ORDER_NUMBER' },
    cod: { enabled: true, fee: 1.50, maxAmount: 500 },
  },
  shipping: {
    dpd: { enabled: true, apiKey: '', username: '', password: '', price: 4.90, freeFrom: 50, showWidget: true },
    zasielkovna: { enabled: true, apiKey: '', price: 2.90, freeFrom: 50, showWidget: true },
    slovakPost: { enabled: true, apiKey: '', price: 3.50, freeFrom: 50 },
    gls: { enabled: false, apiKey: '', clientNumber: '', price: 4.50, freeFrom: 50 },
    personalPickup: { enabled: true, locations: [
      { id: '1', name: 'Hlavná prevádzka', address: 'Hlavná 1, Bratislava', openingHours: 'Po-Pi: 9:00-17:00' }
    ]},
  },
  general: {
    shopName: 'Demo Shop',
    email: 'info@demoshop.sk',
    phone: '+421 900 123 456',
    currency: 'EUR',
    language: 'sk',
    timezone: 'Europe/Bratislava',
    orderPrefix: 'ORD-',
    invoicePrefix: 'INV-',
  },
  notifications: {
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    abandonedCart: false,
    lowStock: true,
    lowStockThreshold: 5,
  },
  updatePayments: (method, value) => set((state) => ({ 
    payments: { ...state.payments, [method]: { ...(state.payments as any)[method], ...value } } 
  })),
  updateShipping: (method, value) => set((state) => ({ 
    shipping: { ...state.shipping, [method]: { ...(state.shipping as any)[method], ...value } } 
  })),
  updateGeneral: (value) => set((state) => ({ 
    general: { ...state.general, ...value } 
  })),
  updateNotifications: (value) => set((state) => ({ 
    notifications: { ...state.notifications, ...value } 
  })),
}));

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO PRODUCTS
// ═══════════════════════════════════════════════════════════════════════════════

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  description: string;
  shortDescription?: string;
  images: string[];
  category: string;
  categories: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  barcode?: string;
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  variants?: ProductVariant[];
  badge?: 'new' | 'sale' | 'bestseller' | 'limited' | 'exclusive';
  featured?: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: { name: string; value: string }[];
  price?: number;
  comparePrice?: number;
  stock: number;
  sku?: string;
  image?: string;
}

export const demoProducts: Product[] = [
  {
    id: '1',
    name: 'Bezdrôtové slúchadlá Pro Max',
    slug: 'bezdrotove-sluchadla-pro-max',
    price: 89.99,
    comparePrice: 119.99,
    description: 'Prémiové bezdrôtové slúchadlá s aktívnym potlačením hluku (ANC). Výdrž batérie až 30 hodín, rýchle nabíjanie, pohodlné náušníky z pamäťovej peny. Dokonalý zvuk pre náročných poslucháčov.',
    shortDescription: 'Prémiové ANC slúchadlá s 30h výdržou',
    images: [],
    category: 'Elektronika',
    categories: ['Elektronika', 'Audio', 'Slúchadlá'],
    tags: ['audio', 'sluchadla', 'bezdrôtové', 'anc', 'bluetooth'],
    rating: 4.8,
    reviewCount: 124,
    stock: 50,
    sku: 'SLU-PRO-001',
    weight: 250,
    badge: 'bestseller',
    featured: true,
    published: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Smart Watch Ultra 2',
    slug: 'smart-watch-ultra-2',
    price: 199.99,
    description: 'Najnovšie inteligentné hodinky s pokročilým sledovaním zdravia. GPS, vodotesnosť do 50m, EKG a meranie kyslíka v krvi. Always-on AMOLED displej.',
    shortDescription: 'Pokročilé smart hodinky s GPS a EKG',
    images: [],
    category: 'Elektronika',
    categories: ['Elektronika', 'Hodinky', 'Smart hodinky'],
    tags: ['hodinky', 'smart', 'fitness', 'gps', 'zdravie'],
    rating: 4.9,
    reviewCount: 89,
    stock: 30,
    sku: 'WAT-ULT-002',
    weight: 45,
    badge: 'new',
    featured: true,
    published: true,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    name: 'Prémiový kožený obal iPhone 15',
    slug: 'premiovy-kozeny-obal-iphone-15',
    price: 29.99,
    comparePrice: 39.99,
    description: 'Elegantný obal z pravej talianskej kože pre iPhone 15. Presné výrezy, ochrana kamery, podporuje MagSafe nabíjanie.',
    shortDescription: 'Luxusný kožený obal pre iPhone 15',
    images: [],
    category: 'Príslušenstvo',
    categories: ['Príslušenstvo', 'Obaly', 'iPhone'],
    tags: ['obal', 'iphone', 'koža', 'magsafe'],
    rating: 4.5,
    reviewCount: 256,
    stock: 100,
    sku: 'OBA-IPH-003',
    weight: 35,
    badge: 'sale',
    featured: false,
    published: true,
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    variants: [
      { id: 'v1', name: 'Čierna', options: [{ name: 'Farba', value: 'Čierna' }], stock: 40 },
      { id: 'v2', name: 'Hnedá', options: [{ name: 'Farba', value: 'Hnedá' }], stock: 35 },
      { id: 'v3', name: 'Modrá', options: [{ name: 'Farba', value: 'Modrá' }], stock: 25 },
    ],
  },
  {
    id: '4',
    name: 'USB-C Hub 7v1 Pro',
    slug: 'usb-c-hub-7v1-pro',
    price: 49.99,
    description: 'Multifunkčný USB-C hub so 7 portami: 2x USB 3.0, HDMI 4K@60Hz, SD/microSD čítačka, USB-C PD 100W, Ethernet. Hliníkové telo.',
    shortDescription: 'Kompletné pripojenie pre váš notebook',
    images: [],
    category: 'Príslušenstvo',
    categories: ['Príslušenstvo', 'Huby', 'USB-C'],
    tags: ['usb', 'hub', 'usb-c', 'hdmi', 'ethernet'],
    rating: 4.7,
    reviewCount: 312,
    stock: 75,
    sku: 'HUB-7V1-004',
    weight: 85,
    featured: true,
    published: true,
    createdAt: '2023-11-15T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '5',
    name: 'Bluetooth reproduktor Bass Pro',
    slug: 'bluetooth-reproduktor-bass-pro',
    price: 59.99,
    comparePrice: 79.99,
    description: 'Výkonný prenosný reproduktor s hlbokými basmi. IPX7 vodotesnosť, výdrž 24 hodín, TWS párovanie pre stereo zvuk.',
    shortDescription: 'Vodotesný reproduktor s 24h výdržou',
    images: [],
    category: 'Elektronika',
    categories: ['Elektronika', 'Audio', 'Reproduktory'],
    tags: ['audio', 'reproduktor', 'bluetooth', 'vodotesný'],
    rating: 4.6,
    reviewCount: 178,
    stock: 40,
    sku: 'REP-BAS-005',
    weight: 520,
    badge: 'sale',
    featured: false,
    published: true,
    createdAt: '2023-10-01T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
  {
    id: '6',
    name: 'Powerbanka 20000mAh PD',
    slug: 'powerbanka-20000mah-pd',
    price: 44.99,
    description: 'Vysokonapäťová powerbanka s kapacitou 20000mAh. USB-C PD 65W pre nabíjanie notebookov, 2x USB-A QC 3.0. LED displej.',
    shortDescription: '65W nabíjanie pre notebook aj mobil',
    images: [],
    category: 'Príslušenstvo',
    categories: ['Príslušenstvo', 'Nabíjanie', 'Powerbanky'],
    tags: ['powerbanka', 'nabijanie', 'pd', 'usb-c'],
    rating: 4.8,
    reviewCount: 334,
    stock: 60,
    sku: 'PWB-20K-006',
    weight: 380,
    featured: true,
    published: true,
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
  {
    id: '7',
    name: 'Herná myš RGB Pro',
    slug: 'herna-mys-rgb-pro',
    price: 39.99,
    description: 'Profesionálna herná myš s optickým senzorom 25600 DPI. RGB podsvietenie, 7 programovateľných tlačidiel, váhový systém.',
    shortDescription: '25600 DPI senzor pre profesionálov',
    images: [],
    category: 'Gaming',
    categories: ['Gaming', 'Myši', 'Príslušenstvo'],
    tags: ['gaming', 'mys', 'rgb', 'esports'],
    rating: 4.7,
    reviewCount: 445,
    stock: 80,
    sku: 'MYS-RGB-007',
    weight: 95,
    featured: false,
    published: true,
    createdAt: '2023-08-15T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    id: '8',
    name: 'Mechanická klávesnica TKL',
    slug: 'mechanicka-klavesnica-tkl',
    price: 79.99,
    comparePrice: 99.99,
    description: 'Kompaktná TKL mechanická klávesnica s hot-swap switchmi. PBT klávesy, RGB podsvietenie per-key, USB-C kábel.',
    shortDescription: 'Hot-swap TKL s PBT klávesmi',
    images: [],
    category: 'Gaming',
    categories: ['Gaming', 'Klávesnice', 'Mechanické'],
    tags: ['gaming', 'klavesnica', 'mechanicka', 'tkl', 'rgb'],
    rating: 4.9,
    reviewCount: 267,
    stock: 25,
    sku: 'KLA-TKL-008',
    weight: 780,
    badge: 'sale',
    featured: true,
    published: true,
    createdAt: '2023-07-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    variants: [
      { id: 'v1', name: 'Red switches', options: [{ name: 'Switch', value: 'Red' }], stock: 10 },
      { id: 'v2', name: 'Blue switches', options: [{ name: 'Switch', value: 'Blue' }], stock: 8 },
      { id: 'v3', name: 'Brown switches', options: [{ name: 'Switch', value: 'Brown' }], stock: 7 },
    ],
  },
  {
    id: '9',
    name: 'Webkamera 4K Ultra HD',
    slug: 'webkamera-4k-ultra-hd',
    price: 89.99,
    description: '4K webkamera s automatickým zaostrovaním a sledovaním tváre. Duálne mikrofóny s potlačením šumu, 90° zorné pole.',
    shortDescription: '4K kvalita pre streamy a hovory',
    images: [],
    category: 'Príslušenstvo',
    categories: ['Príslušenstvo', 'Kamery', 'Webkamery'],
    tags: ['webkamera', 'video', '4k', 'streaming'],
    rating: 4.6,
    reviewCount: 156,
    stock: 35,
    sku: 'WEB-4K-009',
    weight: 145,
    badge: 'new',
    featured: false,
    published: true,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '10',
    name: 'Stolový mikrofón Podcast Pro',
    slug: 'stolovy-mikrofon-podcast-pro',
    price: 69.99,
    description: 'Profesionálny kondenzátorový USB mikrofón pre podcasty a streaming. Kardioidný vzor, pop filter, nastaviteľné rameno.',
    shortDescription: 'Štúdiová kvalita pre domáce nahrávanie',
    images: [],
    category: 'Elektronika',
    categories: ['Elektronika', 'Audio', 'Mikrofóny'],
    tags: ['audio', 'mikrofon', 'podcast', 'streaming', 'usb'],
    rating: 4.8,
    reviewCount: 198,
    stock: 45,
    sku: 'MIK-POD-010',
    weight: 320,
    featured: true,
    published: true,
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '11',
    name: 'Monitor Light Bar Pro',
    slug: 'monitor-light-bar-pro',
    price: 34.99,
    description: 'LED svetelná lišta na monitor pre lepšie osvetlenie pracovného priestoru. Asymetrické svetlo, bezdrôtové ovládanie, nastaviteľná teplota.',
    shortDescription: 'Perfektné osvetlenie bez odrazov',
    images: [],
    category: 'Príslušenstvo',
    categories: ['Príslušenstvo', 'Osvetlenie', 'Kancelária'],
    tags: ['osvetlenie', 'monitor', 'led', 'kancelária'],
    rating: 4.5,
    reviewCount: 423,
    stock: 90,
    sku: 'LED-BAR-011',
    weight: 280,
    featured: false,
    published: true,
    createdAt: '2023-05-15T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
  {
    id: '12',
    name: 'Ergonomická stolička Pro',
    slug: 'ergonomicka-stolicka-pro',
    price: 299.99,
    comparePrice: 399.99,
    description: 'Prémiová ergonomická kancelárska stolička s nastaviteľnou podporou drieku. Priedušná sieťovina, 4D opierky, hliníková základňa.',
    shortDescription: 'Maximálny komfort pre dlhú prácu',
    images: [],
    category: 'Nábytok',
    categories: ['Nábytok', 'Stoličky', 'Ergonomické'],
    tags: ['stolicka', 'kancelária', 'ergonomia', 'health'],
    rating: 4.9,
    reviewCount: 87,
    stock: 15,
    sku: 'STO-ERG-012',
    weight: 18500,
    badge: 'sale',
    featured: true,
    published: true,
    createdAt: '2023-04-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    variants: [
      { id: 'v1', name: 'Čierna', options: [{ name: 'Farba', value: 'Čierna' }], stock: 8 },
      { id: 'v2', name: 'Sivá', options: [{ name: 'Farba', value: 'Sivá' }], stock: 7 },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function formatPrice(price: number, currency: string = 'EUR', locale: string = 'sk-SK'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function calculateDiscount(price: number, comparePrice?: number): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round((1 - price / comparePrice) * 100);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function getProductsByCategory(category: string): Product[] {
  return demoProducts.filter(p => 
    p.category === category || p.categories.includes(category)
  );
}

export function getFeaturedProducts(): Product[] {
  return demoProducts.filter(p => p.featured);
}

export function getProductsByBadge(badge: Product['badge']): Product[] {
  return demoProducts.filter(p => p.badge === badge);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return demoProducts.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.tags.some(t => t.toLowerCase().includes(lowerQuery))
  );
}
