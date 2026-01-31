// ═══════════════════════════════════════════════════════════════════════════════
// ESHOPBUILDER PRO - TEMPLATES & CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  colors: { primary: string; secondary: string; accent: string; background: string };
  fonts: { heading: string; body: string };
  rating: number;
  downloads: number;
  isPro: boolean;
  isNew: boolean;
  price: number;
}

export const TEMPLATES: Template[] = [
  // FASHION
  {
    id: 'fashion-minimal',
    name: 'Fashion Minimal',
    category: 'fashion',
    description: 'Elegantný minimalistický dizajn pre módne značky.',
    features: ['Fullscreen hero', 'Lookbook galéria', 'Quick view', 'Size guide'],
    colors: { primary: '#000000', secondary: '#ffffff', accent: '#c9a86c', background: '#fafafa' },
    fonts: { heading: 'Playfair Display', body: 'Inter' },
    rating: 4.9, downloads: 12450, isPro: false, isNew: false, price: 0
  },
  {
    id: 'fashion-luxury',
    name: 'Fashion Luxury',
    category: 'fashion',
    description: 'Luxusný dizajn pre prémiové módne značky.',
    features: ['Video hero', '3D galérie', 'VIP sekcia', 'Appointment booking'],
    colors: { primary: '#1a1a2e', secondary: '#eaeaea', accent: '#d4af37', background: '#0f0f0f' },
    fonts: { heading: 'Cormorant Garamond', body: 'Lato' },
    rating: 4.8, downloads: 8320, isPro: true, isNew: false, price: 49
  },
  {
    id: 'fashion-streetwear',
    name: 'Streetwear Culture',
    category: 'fashion',
    description: 'Odvážny dizajn pre streetwear značky.',
    features: ['Bold typography', 'Drop countdown', 'Sneaker releases', 'Community'],
    colors: { primary: '#ff3366', secondary: '#00ff88', accent: '#ffff00', background: '#111111' },
    fonts: { heading: 'Bebas Neue', body: 'Roboto' },
    rating: 4.7, downloads: 6780, isPro: true, isNew: true, price: 39
  },
  // ELECTRONICS
  {
    id: 'tech-store',
    name: 'Tech Store Pro',
    category: 'electronics',
    description: 'Moderný dizajn pre elektroniku a gadgety.',
    features: ['Product comparison', 'Spec sheets', 'Tech support', '360° views'],
    colors: { primary: '#0066ff', secondary: '#00d4ff', accent: '#ff6b35', background: '#f5f7fa' },
    fonts: { heading: 'Poppins', body: 'Inter' },
    rating: 4.9, downloads: 18920, isPro: false, isNew: false, price: 0
  },
  {
    id: 'gaming-zone',
    name: 'Gaming Zone',
    category: 'electronics',
    description: 'Dynamický dizajn pre gaming produkty.',
    features: ['RGB effects', 'PC builder', 'Stream integration', 'Tournaments'],
    colors: { primary: '#9945ff', secondary: '#14f195', accent: '#ff0080', background: '#0a0a0a' },
    fonts: { heading: 'Orbitron', body: 'Rajdhani' },
    rating: 4.8, downloads: 9450, isPro: true, isNew: true, price: 59
  },
  // FOOD
  {
    id: 'organic-market',
    name: 'Organic Market',
    category: 'food',
    description: 'Čistý dizajn pre bio potraviny.',
    features: ['Recipe section', 'Subscription boxes', 'Local pickup', 'Farm stories'],
    colors: { primary: '#2d5a27', secondary: '#8bc34a', accent: '#ff9800', background: '#fefefe' },
    fonts: { heading: 'Merriweather', body: 'Open Sans' },
    rating: 4.7, downloads: 7890, isPro: false, isNew: false, price: 0
  },
  {
    id: 'restaurant-delivery',
    name: 'Restaurant & Delivery',
    category: 'food',
    description: 'Kompletné riešenie pre reštaurácie.',
    features: ['Menu builder', 'Table reservation', 'Delivery tracking', 'Loyalty program'],
    colors: { primary: '#c62828', secondary: '#ffb300', accent: '#4caf50', background: '#fff8f0' },
    fonts: { heading: 'Playfair Display', body: 'Nunito' },
    rating: 4.9, downloads: 11230, isPro: true, isNew: false, price: 69
  },
  // BEAUTY
  {
    id: 'beauty-glamour',
    name: 'Beauty Glamour',
    category: 'beauty',
    description: 'Elegantný dizajn pre kozmetiku.',
    features: ['Shade finder', 'Virtual try-on', 'Beauty quiz', 'Tutorials'],
    colors: { primary: '#e91e63', secondary: '#f8bbd9', accent: '#9c27b0', background: '#fff5f8' },
    fonts: { heading: 'Cormorant Garamond', body: 'Quicksand' },
    rating: 4.8, downloads: 9870, isPro: false, isNew: false, price: 0
  },
  {
    id: 'skincare-lab',
    name: 'Skincare Lab',
    category: 'beauty',
    description: 'Čistý vedecký dizajn pre skincare.',
    features: ['Ingredient glossary', 'Skin analysis', 'Routine builder', 'Expert advice'],
    colors: { primary: '#00695c', secondary: '#b2dfdb', accent: '#ff7043', background: '#ffffff' },
    fonts: { heading: 'Montserrat', body: 'Source Sans Pro' },
    rating: 4.9, downloads: 6540, isPro: true, isNew: true, price: 49
  },
  // SPORTS
  {
    id: 'active-life',
    name: 'Active Life',
    category: 'sports',
    description: 'Dynamický dizajn pre športové vybavenie.',
    features: ['Size calculator', 'Sport filters', 'Team orders', 'Training plans'],
    colors: { primary: '#ff5722', secondary: '#2196f3', accent: '#4caf50', background: '#fafafa' },
    fonts: { heading: 'Oswald', body: 'Roboto' },
    rating: 4.7, downloads: 8120, isPro: false, isNew: false, price: 0
  },
  {
    id: 'gym-equipment',
    name: 'Gym Equipment',
    category: 'sports',
    description: 'Profesionálny dizajn pre fitness.',
    features: ['3D views', 'Space calculator', 'Workout videos', 'Financing'],
    colors: { primary: '#212121', secondary: '#f44336', accent: '#ffc107', background: '#ffffff' },
    fonts: { heading: 'Anton', body: 'Rubik' },
    rating: 4.8, downloads: 5670, isPro: true, isNew: false, price: 59
  },
  // HOME
  {
    id: 'modern-living',
    name: 'Modern Living',
    category: 'home',
    description: 'Elegantný dizajn pre moderný nábytok.',
    features: ['Room planner', 'AR preview', 'Material samples', 'Consultation'],
    colors: { primary: '#5d4037', secondary: '#bcaaa4', accent: '#ff8a65', background: '#fafafa' },
    fonts: { heading: 'Josefin Sans', body: 'Lato' },
    rating: 4.9, downloads: 10340, isPro: false, isNew: false, price: 0
  },
  {
    id: 'nordic-home',
    name: 'Nordic Home',
    category: 'home',
    description: 'Minimalistický škandinávsky dizajn.',
    features: ['Moodboard creator', '3D room', 'Color palette', 'Design stories'],
    colors: { primary: '#37474f', secondary: '#90a4ae', accent: '#ffab91', background: '#ffffff' },
    fonts: { heading: 'Raleway', body: 'Nunito Sans' },
    rating: 4.8, downloads: 7890, isPro: true, isNew: true, price: 49
  },
  // KIDS
  {
    id: 'kids-paradise',
    name: 'Kids Paradise',
    category: 'kids',
    description: 'Hravý dizajn pre detské produkty.',
    features: ['Age filter', 'Safety badges', 'Wishlist', 'Gift finder'],
    colors: { primary: '#7c4dff', secondary: '#00e5ff', accent: '#ff4081', background: '#fff9c4' },
    fonts: { heading: 'Fredoka One', body: 'Nunito' },
    rating: 4.7, downloads: 6780, isPro: false, isNew: false, price: 0
  },
  // JEWELRY
  {
    id: 'jewelry-luxe',
    name: 'Jewelry Luxe',
    category: 'jewelry',
    description: 'Luxusný dizajn pre šperky.',
    features: ['Ring sizer', '360° views', 'Engraving preview', 'VIP appointments'],
    colors: { primary: '#1a1a1a', secondary: '#d4af37', accent: '#ffffff', background: '#0d0d0d' },
    fonts: { heading: 'Cinzel', body: 'Cormorant' },
    rating: 4.9, downloads: 5430, isPro: true, isNew: false, price: 79
  },
  // HEALTH
  {
    id: 'wellness-center',
    name: 'Wellness Center',
    category: 'health',
    description: 'Upokojujúci dizajn pre zdravie.',
    features: ['Symptom checker', 'Expert articles', 'Subscription', 'Health tracker'],
    colors: { primary: '#00897b', secondary: '#b2dfdb', accent: '#ff7043', background: '#f1f8e9' },
    fonts: { heading: 'Libre Baskerville', body: 'Open Sans' },
    rating: 4.8, downloads: 7120, isPro: false, isNew: true, price: 0
  },
  // PETS
  {
    id: 'pet-paradise',
    name: 'Pet Paradise',
    category: 'pets',
    description: 'Priateľský dizajn pre potreby miláčikov.',
    features: ['Pet profile', 'Auto-delivery', 'Vet consultation', 'Pet community'],
    colors: { primary: '#ff7043', secondary: '#ffcc80', accent: '#4caf50', background: '#fff3e0' },
    fonts: { heading: 'Baloo 2', body: 'Quicksand' },
    rating: 4.7, downloads: 5890, isPro: false, isNew: false, price: 0
  },
  // AUTO
  {
    id: 'auto-parts',
    name: 'Auto Parts Pro',
    category: 'auto',
    description: 'Profesionálny dizajn pre autodielne.',
    features: ['Vehicle finder', 'Part compatibility', 'Installation guides', 'Garage locator'],
    colors: { primary: '#1565c0', secondary: '#ffb300', accent: '#d32f2f', background: '#eceff1' },
    fonts: { heading: 'Roboto Condensed', body: 'Roboto' },
    rating: 4.8, downloads: 8340, isPro: true, isNew: false, price: 59
  },
  // BOOKS
  {
    id: 'book-haven',
    name: 'Book Haven',
    category: 'books',
    description: 'Literárny dizajn pre kníhkupectvá.',
    features: ['Reading lists', 'Book clubs', 'Author pages', 'Preview chapters'],
    colors: { primary: '#4e342e', secondary: '#8d6e63', accent: '#ff8f00', background: '#efebe9' },
    fonts: { heading: 'Playfair Display', body: 'Source Serif Pro' },
    rating: 4.6, downloads: 4560, isPro: false, isNew: false, price: 0
  },
  // GARDEN
  {
    id: 'garden-center',
    name: 'Garden Center',
    category: 'garden',
    description: 'Prírodný dizajn pre záhradníctva.',
    features: ['Plant finder', 'Care guides', 'Seasonal calendar', 'Expert tips'],
    colors: { primary: '#33691e', secondary: '#7cb342', accent: '#ff6f00', background: '#f1f8e9' },
    fonts: { heading: 'Amatic SC', body: 'Cabin' },
    rating: 4.7, downloads: 5120, isPro: false, isNew: true, price: 0
  },
];

export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'Všetky', count: TEMPLATES.length },
  { id: 'fashion', name: 'Móda', count: 3 },
  { id: 'electronics', name: 'Elektronika', count: 2 },
  { id: 'food', name: 'Jedlo', count: 2 },
  { id: 'beauty', name: 'Krása', count: 2 },
  { id: 'sports', name: 'Šport', count: 2 },
  { id: 'home', name: 'Domov', count: 2 },
  { id: 'kids', name: 'Deti', count: 1 },
  { id: 'jewelry', name: 'Šperky', count: 1 },
  { id: 'health', name: 'Zdravie', count: 1 },
  { id: 'pets', name: 'Zvieratá', count: 1 },
  { id: 'auto', name: 'Auto', count: 1 },
  { id: 'books', name: 'Knihy', count: 1 },
  { id: 'garden', name: 'Záhrada', count: 1 },
];

export const COLOR_PALETTES = [
  { name: 'Ocean Blue', colors: ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8'] },
  { name: 'Forest Green', colors: ['#1b4332', '#2d6a4f', '#40916c', '#95d5b2'] },
  { name: 'Sunset Orange', colors: ['#d00000', '#dc2f02', '#e85d04', '#faa307'] },
  { name: 'Royal Purple', colors: ['#3c096c', '#5a189a', '#7b2cbf', '#9d4edd'] },
  { name: 'Rose Gold', colors: ['#590d22', '#800f2f', '#a4133c', '#ffb3c1'] },
  { name: 'Midnight', colors: ['#000814', '#001d3d', '#003566', '#ffc300'] },
  { name: 'Natural', colors: ['#606c38', '#283618', '#fefae0', '#dda15e'] },
  { name: 'Pastel Dream', colors: ['#ffafcc', '#ffc8dd', '#bde0fe', '#a2d2ff'] },
  { name: 'Neon', colors: ['#ff00ff', '#00ffff', '#ffff00', '#ff0080'] },
  { name: 'Monochrome', colors: ['#000000', '#333333', '#666666', '#999999'] },
  { name: 'Earth Tones', colors: ['#6b4423', '#8b5a2b', '#a0522d', '#d2691e'] },
  { name: 'Tech Blue', colors: ['#0f172a', '#1e40af', '#3b82f6', '#60a5fa'] },
];

export const AI_INDUSTRIES = [
  'Móda a oblečenie', 'Elektronika a gadgety', 'Potraviny a nápoje', 'Kozmetika a krása',
  'Športové potreby', 'Nábytok a interiér', 'Detské produkty', 'Šperky a hodinky',
  'Zdravie a wellness', 'Domáce zvieratá', 'Auto príslušenstvo', 'Knihy a médiá',
  'Záhrada a exteriér', 'Umenie a remeslá', 'Hudba a nástroje', 'Gaming a esports',
  'Kancelárske potreby', 'Cestovanie', 'Luxusné produkty', 'Eco & Sustainable'
];

export const AI_STYLES = [
  'Minimalistický', 'Luxusný', 'Moderný', 'Retro', 'Hravý', 'Profesionálny',
  'Odvážny', 'Elegantný', 'Prírodný', 'Industriálny', 'Škandinávsky', 'Bohémsky',
  'Urban', 'Vintage', 'Futuristický', 'Klasický', 'Artsy', 'Tech'
];

export const AI_MOODS = [
  'Dôveryhodný', 'Energický', 'Upokojujúci', 'Luxusný', 'Hravý', 'Seriózny',
  'Priateľský', 'Profesionálny', 'Inovatívny', 'Tradičný', 'Mladistvý', 'Sofistikovaný'
];

export const SECTION_TYPES = [
  { type: 'announcement-bar', icon: '📢', name: 'Oznamovacia lišta', desc: 'Horný banner', category: 'structure' },
  { type: 'header', icon: '🔝', name: 'Hlavička', desc: 'Logo, menu, košík', category: 'structure' },
  { type: 'footer', icon: '📋', name: 'Pätička', desc: 'Kontakt, odkazy', category: 'structure' },
  { type: 'hero-slider', icon: '🎠', name: 'Hero Slider', desc: 'Rotujúci banner', category: 'hero' },
  { type: 'hero-banner', icon: '🖼️', name: 'Hero Banner', desc: 'Statický banner', category: 'hero' },
  { type: 'hero-video', icon: '🎬', name: 'Hero Video', desc: 'Video pozadie', category: 'hero' },
  { type: 'featured-products', icon: '⭐', name: 'Odporúčané', desc: 'Vybrané produkty', category: 'products' },
  { type: 'product-grid', icon: '🛍️', name: 'Produkty', desc: 'Mriežka produktov', category: 'products' },
  { type: 'product-carousel', icon: '🎡', name: 'Carousel', desc: 'Posuvné produkty', category: 'products' },
  { type: 'categories-grid', icon: '📦', name: 'Kategórie', desc: 'Mriežka kategórií', category: 'categories' },
  { type: 'promo-banner', icon: '🎯', name: 'Promo Banner', desc: 'Propagačný banner', category: 'marketing' },
  { type: 'countdown-timer', icon: '⏰', name: 'Odpočítavanie', desc: 'Časovač akcie', category: 'marketing' },
  { type: 'newsletter', icon: '📧', name: 'Newsletter', desc: 'Prihlásenie', category: 'marketing' },
  { type: 'testimonials', icon: '💬', name: 'Recenzie', desc: 'Hodnotenia', category: 'social' },
  { type: 'trust-badges', icon: '🛡️', name: 'Dôveryhodnosť', desc: 'Výhody obchodu', category: 'social' },
  { type: 'brand-logos', icon: '🏷️', name: 'Značky', desc: 'Logá partnerov', category: 'social' },
  { type: 'instagram-feed', icon: '📸', name: 'Instagram', desc: 'IG príspevky', category: 'social' },
  { type: 'faq-accordion', icon: '❓', name: 'FAQ', desc: 'Časté otázky', category: 'content' },
  { type: 'image-with-text', icon: '📝', name: 'Obrázok + Text', desc: 'Kombinovaný blok', category: 'content' },
  { type: 'rich-text', icon: '📄', name: 'Textový blok', desc: 'Formátovaný text', category: 'content' },
  { type: 'blog-posts', icon: '📰', name: 'Blog', desc: 'Najnovšie články', category: 'content' },
  { type: 'contact-form', icon: '✉️', name: 'Kontakt', desc: 'Kontaktný formulár', category: 'contact' },
  { type: 'map-section', icon: '🗺️', name: 'Mapa', desc: 'Google mapa', category: 'contact' },
  { type: 'spacer', icon: '↕️', name: 'Medzera', desc: 'Prázdny priestor', category: 'layout' },
  { type: 'divider', icon: '➖', name: 'Oddeľovač', desc: 'Horizontálna čiara', category: 'layout' },
  { type: 'custom-html', icon: '💻', name: 'HTML', desc: 'Vlastný kód', category: 'layout' },
];

export const SECTION_CATEGORIES = [
  { id: 'all', name: 'Všetky' },
  { id: 'structure', name: 'Štruktúra' },
  { id: 'hero', name: 'Hero' },
  { id: 'products', name: 'Produkty' },
  { id: 'categories', name: 'Kategórie' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'social', name: 'Social Proof' },
  { id: 'content', name: 'Obsah' },
  { id: 'contact', name: 'Kontakt' },
  { id: 'layout', name: 'Layout' },
];

export const DEMO_STATS = {
  revenue: { today: 2847, yesterday: 2156, week: 18420, month: 72350, change: 32.1 },
  orders: { today: 48, pending: 12, processing: 8, shipped: 15, delivered: 127 },
  visitors: { online: 23, today: 1284, week: 8750, month: 34200 },
  conversion: { rate: 3.7, change: 0.5 },
  averageOrder: 59.3,
  topProducts: [
    { name: 'iPhone 15 Pro Max', sales: 47, revenue: 52870 },
    { name: 'MacBook Air M3', sales: 23, revenue: 29670 },
    { name: 'AirPods Pro 2', sales: 89, revenue: 22250 },
  ],
  recentOrders: [
    { id: '#1247', customer: 'Martin K.', total: 127.50, status: 'pending', time: 'Pred 2 min' },
    { id: '#1246', customer: 'Jana S.', total: 89.99, status: 'processing', time: 'Pred 15 min' },
    { id: '#1245', customer: 'Peter N.', total: 1299.00, status: 'shipped', time: 'Pred 1 hod' },
  ],
};

export const DEMO_NOTIFICATIONS = [
  { id: '1', type: 'order', title: 'Nová objednávka #1247', message: 'Martin K. - €127.50', time: 'Pred 2 min', read: false },
  { id: '2', type: 'review', title: 'Nová recenzia ⭐⭐⭐⭐⭐', message: 'Bezdrôtové slúchadlá', time: 'Pred 15 min', read: false },
  { id: '3', type: 'stock', title: 'Nízky stav skladu', message: 'iPhone 15 Pro Max - 3 ks', time: 'Pred 1 hod', read: true },
  { id: '4', type: 'success', title: 'Platba prijatá', message: 'Objednávka #1245 - €1,299.00', time: 'Pred 2 hod', read: true },
  { id: '5', type: 'info', title: 'Nový zákazník', message: 'Eva M. sa zaregistrovala', time: 'Pred 3 hod', read: true },
];

export const STYLE_COLORS: Record<string, { primary: string; secondary: string; accent: string; background: string }> = {
  'Minimalistický': { primary: '#000000', secondary: '#ffffff', accent: '#3b82f6', background: '#fafafa' },
  'Luxusný': { primary: '#1a1a2e', secondary: '#d4af37', accent: '#ffffff', background: '#0f0f0f' },
  'Moderný': { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#10b981', background: '#f8fafc' },
  'Retro': { primary: '#f97316', secondary: '#fbbf24', accent: '#84cc16', background: '#fffbeb' },
  'Hravý': { primary: '#ec4899', secondary: '#8b5cf6', accent: '#06b6d4', background: '#fdf2f8' },
  'Profesionálny': { primary: '#1e40af', secondary: '#475569', accent: '#0ea5e9', background: '#ffffff' },
  'Odvážny': { primary: '#dc2626', secondary: '#000000', accent: '#fbbf24', background: '#111111' },
  'Elegantný': { primary: '#78350f', secondary: '#a16207', accent: '#d97706', background: '#fffbeb' },
  'Prírodný': { primary: '#166534', secondary: '#84cc16', accent: '#f59e0b', background: '#f0fdf4' },
  'Industriálny': { primary: '#374151', secondary: '#6b7280', accent: '#f59e0b', background: '#f3f4f6' },
  'Škandinávsky': { primary: '#1e293b', secondary: '#94a3b8', accent: '#f97316', background: '#ffffff' },
  'Urban': { primary: '#18181b', secondary: '#a855f7', accent: '#22c55e', background: '#09090b' },
  'Futuristický': { primary: '#7c3aed', secondary: '#06b6d4', accent: '#f43f5e', background: '#0f172a' },
};

export const STYLE_FONTS: Record<string, { heading: string; body: string }> = {
  'Minimalistický': { heading: 'Inter', body: 'Inter' },
  'Luxusný': { heading: 'Playfair Display', body: 'Lato' },
  'Moderný': { heading: 'Poppins', body: 'Inter' },
  'Hravý': { heading: 'Fredoka One', body: 'Quicksand' },
  'Profesionálny': { heading: 'Roboto', body: 'Roboto' },
  'Elegantný': { heading: 'Cormorant Garamond', body: 'Lora' },
  'Urban': { heading: 'Bebas Neue', body: 'Roboto' },
  'Futuristický': { heading: 'Orbitron', body: 'Rajdhani' },
};
