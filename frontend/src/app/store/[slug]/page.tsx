'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingCart, Search, Heart, User, Menu, X, Star, ChevronLeft, ChevronRight,
  Eye, EyeOff, GripVertical, Settings, Palette, Layout, Save, RotateCcw,
  Plus, Trash2, Copy, ExternalLink, Check, Package, Truck, Shield, RefreshCw,
  Headphones, ChevronDown, ChevronUp, Monitor, Tablet, Smartphone, Sparkles,
  Facebook, Instagram, Twitter, Mail, Phone, MapPin, Play, Quote
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type SectionType = 
  | 'announcement' | 'header' | 'hero' | 'trust-badges' | 'categories'
  | 'products' | 'promo-banner' | 'testimonials' | 'faq' | 'newsletter' | 'footer';

interface SectionBlock {
  id: string;
  type: string;
  settings: Record<string, any>;
}

interface Section {
  id: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  settings: Record<string, any>;
  blocks?: SectionBlock[];
}

interface Theme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: number;
  productColumns: number;
  productCardStyle: 'default' | 'minimal' | 'detailed';
  buttonStyle: 'solid' | 'outline' | 'rounded';
}

interface ShopConfig {
  name: string;
  tagline: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  freeShippingMin: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION METADATA
// ═══════════════════════════════════════════════════════════════════════════════

const SECTION_META: Record<SectionType, { name: string; icon: string; description: string }> = {
  'announcement': { name: 'Oznamovacia lišta', icon: '📢', description: 'Rotujúce správy' },
  'header': { name: 'Hlavička', icon: '🔝', description: 'Logo a navigácia' },
  'hero': { name: 'Hero Slider', icon: '🎠', description: 'Hlavný banner' },
  'trust-badges': { name: 'Dôveryhodnosť', icon: '🛡️', description: 'Ikony výhod' },
  'categories': { name: 'Kategórie', icon: '📦', description: 'Kategórie produktov' },
  'products': { name: 'Produkty', icon: '🛍️', description: 'Zoznam produktov' },
  'promo-banner': { name: 'Promo Banner', icon: '🎯', description: 'Reklamný banner' },
  'testimonials': { name: 'Recenzie', icon: '💬', description: 'Hodnotenia zákazníkov' },
  'faq': { name: 'FAQ', icon: '❓', description: 'Často kladené otázky' },
  'newsletter': { name: 'Newsletter', icon: '📧', description: 'Prihlásenie odberu' },
  'footer': { name: 'Pätička', icon: '🔻', description: 'Spodná časť' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ═══════════════════════════════════════════════════════════════════════════════

const defaultTheme: Theme = {
  primaryColor: '#2563eb',
  secondaryColor: '#1e40af',
  backgroundColor: '#ffffff',
  textColor: '#0f172a',
  fontFamily: 'Inter',
  borderRadius: 12,
  productColumns: 4,
  productCardStyle: 'default',
  buttonStyle: 'solid',
};

const defaultConfig: ShopConfig = {
  name: 'Demo Shop',
  tagline: 'Váš obľúbený e-shop',
  logo: '',
  email: 'info@demoshop.sk',
  phone: '+421 900 123 456',
  address: 'Bratislava, Slovensko',
  currency: '€',
  freeShippingMin: 50,
};

const defaultSections: Section[] = [
  {
    id: 'announcement-1',
    type: 'announcement',
    enabled: true,
    order: 0,
    settings: {
      messages: [
        { id: '1', text: '🚚 Doprava zadarmo pri objednávke nad €50' },
        { id: '2', text: '🎁 Zľava 10% s kódom VITAJ10' },
        { id: '3', text: '🔄 30 dní na vrátenie bez udania dôvodu' },
      ],
      backgroundColor: '#0f172a',
      textColor: '#ffffff',
      autoRotate: true,
      speed: 4000,
    },
  },
  {
    id: 'header-1',
    type: 'header',
    enabled: true,
    order: 1,
    settings: {
      menuItems: [
        { id: '1', label: 'Domov', link: '/' },
        { id: '2', label: 'Produkty', link: '/produkty' },
        { id: '3', label: 'Akcie', link: '/akcie', badge: 'SALE' },
        { id: '4', label: 'Novinky', link: '/novinky' },
        { id: '5', label: 'Kontakt', link: '/kontakt' },
      ],
      sticky: true,
      showSearch: true,
      showCart: true,
      showAccount: true,
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
    },
  },
  {
    id: 'hero-1',
    type: 'hero',
    enabled: true,
    order: 2,
    settings: {
      autoplay: true,
      speed: 5000,
      showArrows: true,
      showDots: true,
      height: 500,
    },
    blocks: [
      { id: 's1', type: 'slide', settings: { 
        title: 'Nová kolekcia 2024', 
        subtitle: 'Objavte najnovšie produkty pre tento rok',
        buttonText: 'Nakupovať', 
        buttonLink: '/novinky', 
        backgroundColor: '#2563eb',
        textColor: '#ffffff',
      }},
      { id: 's2', type: 'slide', settings: { 
        title: 'Zimný výpredaj', 
        subtitle: 'Až 50% zľava na vybrané produkty',
        buttonText: 'Zobraziť akcie', 
        buttonLink: '/akcie', 
        backgroundColor: '#dc2626',
        textColor: '#ffffff',
      }},
      { id: 's3', type: 'slide', settings: { 
        title: 'Doprava zadarmo', 
        subtitle: 'Pri každej objednávke nad €50',
        buttonText: 'Začať nakupovať', 
        buttonLink: '/produkty', 
        backgroundColor: '#059669',
        textColor: '#ffffff',
      }},
    ],
  },
  {
    id: 'trust-1',
    type: 'trust-badges',
    enabled: true,
    order: 3,
    settings: {
      layout: 'horizontal',
      style: 'minimal',
      backgroundColor: '#f8fafc',
    },
    blocks: [
      { id: 'b1', type: 'badge', settings: { icon: 'truck', title: 'Doprava zadarmo', subtitle: 'Nad €50' }},
      { id: 'b2', type: 'badge', settings: { icon: 'shield', title: 'Bezpečný nákup', subtitle: '100% zabezpečené' }},
      { id: 'b3', type: 'badge', settings: { icon: 'refresh', title: 'Vrátenie tovaru', subtitle: '30 dní' }},
      { id: 'b4', type: 'badge', settings: { icon: 'headphones', title: 'Podpora 24/7', subtitle: 'Vždy tu pre vás' }},
    ],
  },
  {
    id: 'categories-1',
    type: 'categories',
    enabled: true,
    order: 4,
    settings: {
      title: 'Nakupujte podľa kategórie',
      columns: 6,
      style: 'cards',
    },
    blocks: [
      { id: 'c1', type: 'category', settings: { name: 'Elektronika', icon: '📱', count: 156, color: '#3b82f6' }},
      { id: 'c2', type: 'category', settings: { name: 'Oblečenie', icon: '👕', count: 243, color: '#ec4899' }},
      { id: 'c3', type: 'category', settings: { name: 'Dom & Záhrada', icon: '🏠', count: 89, color: '#22c55e' }},
      { id: 'c4', type: 'category', settings: { name: 'Šport', icon: '⚽', count: 167, color: '#f59e0b' }},
      { id: 'c5', type: 'category', settings: { name: 'Krása', icon: '💄', count: 98, color: '#a855f7' }},
      { id: 'c6', type: 'category', settings: { name: 'Hračky', icon: '🧸', count: 134, color: '#ef4444' }},
    ],
  },
  {
    id: 'products-1',
    type: 'products',
    enabled: true,
    order: 5,
    settings: {
      title: 'Najpredávanejšie produkty',
      subtitle: 'Najobľúbenejšie produkty našich zákazníkov',
      columns: 4,
      showRating: true,
      showBadge: true,
      cardStyle: 'default',
    },
  },
  {
    id: 'promo-1',
    type: 'promo-banner',
    enabled: true,
    order: 6,
    settings: {
      title: 'Letný výpredaj',
      subtitle: 'Využite jedinečné zľavy až do 70%',
      buttonText: 'Nakupovať',
      buttonLink: '/akcie',
      backgroundColor: '#7c3aed',
      textColor: '#ffffff',
      layout: 'centered',
    },
  },
  {
    id: 'testimonials-1',
    type: 'testimonials',
    enabled: true,
    order: 7,
    settings: {
      title: 'Čo hovoria naši zákazníci',
      style: 'cards',
      columns: 3,
    },
    blocks: [
      { id: 't1', type: 'testimonial', settings: { name: 'Mária K.', rating: 5, text: 'Výborný obchod! Rýchle dodanie a kvalitné produkty. Určite odporúčam každému.', avatar: '' }},
      { id: 't2', type: 'testimonial', settings: { name: 'Peter S.', rating: 5, text: 'Skvelá zákaznícka podpora, vždy ochotní pomôcť. Nakupujem tu pravidelne.', avatar: '' }},
      { id: 't3', type: 'testimonial', settings: { name: 'Jana M.', rating: 4, text: 'Široký výber produktov za dobré ceny. Doručenie bolo rýchle a bez problémov.', avatar: '' }},
    ],
  },
  {
    id: 'faq-1',
    type: 'faq',
    enabled: true,
    order: 8,
    settings: {
      title: 'Často kladené otázky',
      style: 'bordered',
    },
    blocks: [
      { id: 'f1', type: 'faq', settings: { question: 'Aké sú možnosti doručenia?', answer: 'Ponúkame doručenie kuriérom (2-3 dni), na výdajné miesta (1-2 dni) a osobný odber zadarmo.' }},
      { id: 'f2', type: 'faq', settings: { question: 'Ako môžem vrátiť tovar?', answer: 'Tovar môžete vrátiť do 30 dní od prevzatia bez udania dôvodu. Stačí nás kontaktovať.' }},
      { id: 'f3', type: 'faq', settings: { question: 'Aké platobné metódy akceptujete?', answer: 'Akceptujeme platobné karty, bankový prevod, dobierku a Apple/Google Pay.' }},
      { id: 'f4', type: 'faq', settings: { question: 'Je možné sledovať objednávku?', answer: 'Áno, po odoslaní objednávky dostanete email s číslom zásielky a odkazom na sledovanie.' }},
    ],
  },
  {
    id: 'newsletter-1',
    type: 'newsletter',
    enabled: true,
    order: 9,
    settings: {
      title: 'Prihláste sa na odber noviniek',
      subtitle: 'Získajte 10% zľavu na prvý nákup',
      buttonText: 'Prihlásiť sa',
      backgroundColor: '#0f172a',
      textColor: '#ffffff',
    },
  },
  {
    id: 'footer-1',
    type: 'footer',
    enabled: true,
    order: 10,
    settings: {
      backgroundColor: '#0f172a',
      textColor: '#ffffff',
      showSocial: true,
      columns: [
        { title: 'O nás', links: ['O spoločnosti', 'Kariéra', 'Blog', 'Press'] },
        { title: 'Pomoc', links: ['FAQ', 'Doprava', 'Vrátenie', 'Kontakt'] },
        { title: 'Právne', links: ['Obchodné podmienky', 'Ochrana súkromia', 'Cookies'] },
      ],
      copyright: '© 2024 Demo Shop. Všetky práva vyhradené.',
    },
  },
];

const demoProducts = [
  { id: '1', name: 'Bezdrôtové slúchadlá Pro', price: 89.99, oldPrice: 119.99, rating: 4.8, reviews: 124, badge: 'Bestseller' },
  { id: '2', name: 'Smart Watch Ultra', price: 199.99, rating: 4.9, reviews: 89, badge: 'Novinka' },
  { id: '3', name: 'Prémiový obal na telefón', price: 29.99, oldPrice: 39.99, rating: 4.5, reviews: 256 },
  { id: '4', name: 'USB-C Hub 7v1', price: 49.99, rating: 4.7, reviews: 178 },
  { id: '5', name: 'Bluetooth reproduktor', price: 59.99, oldPrice: 79.99, rating: 4.6, reviews: 312, badge: 'Akcia' },
  { id: '6', name: 'Powerbanka 20000mAh', price: 34.99, rating: 4.8, reviews: 445 },
  { id: '7', name: 'LED stolná lampa', price: 24.99, rating: 4.4, reviews: 89 },
  { id: '8', name: 'Ergonomická myš', price: 44.99, oldPrice: 54.99, rating: 4.7, reviews: 234 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// EDITOR CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

interface EditorContextType {
  isEditing: boolean;
  isPanelOpen: boolean;
  activeSection: string | null;
  sections: Section[];
  theme: Theme;
  config: ShopConfig;
  hasChanges: boolean;
  setIsEditing: (v: boolean) => void;
  setIsPanelOpen: (v: boolean) => void;
  setActiveSection: (id: string | null) => void;
  updateSection: (id: string, updates: Partial<Section>) => void;
  updateSectionSettings: (id: string, settings: Record<string, any>) => void;
  updateSectionBlock: (sectionId: string, blockId: string, settings: Record<string, any>) => void;
  toggleSection: (id: string) => void;
  moveSection: (id: string, direction: 'up' | 'down') => void;
  setTheme: (t: Theme) => void;
  setConfig: (c: ShopConfig) => void;
  save: () => void;
  discard: () => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be within EditorProvider');
  return ctx;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EDITOR PANEL
// ═══════════════════════════════════════════════════════════════════════════════

function EditorPanel() {
  const editor = useEditor();
  const [activeTab, setActiveTab] = useState<'sections' | 'appearance' | 'settings'>('sections');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);

  const sortedSections = [...editor.sections].sort((a, b) => a.order - b.order);
  const selectedSection = editor.activeSection ? editor.sections.find(s => s.id === editor.activeSection) : null;

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    editor.save();
    setIsSaving(false);
  };

  // SECTION DETAIL EDITOR
  if (selectedSection) {
    const meta = SECTION_META[selectedSection.type];

    return (
      <div className={`fixed top-0 left-0 bottom-0 w-[400px] bg-gray-900 z-50 shadow-2xl transform transition-transform duration-300 ${editor.isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex items-center gap-3">
            <button onClick={() => editor.setActiveSection(null)} className="p-2 hover:bg-gray-800 rounded-lg">
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <span className="text-xl">{meta.icon}</span>
            <div className="flex-1">
              <span className="font-semibold text-white">{meta.name}</span>
              <p className="text-xs text-gray-500">{meta.description}</p>
            </div>
            <button
              onClick={() => editor.toggleSection(selectedSection.id)}
              className={`p-2 rounded-lg ${selectedSection.enabled ? 'text-green-400 bg-green-500/10' : 'text-gray-500 bg-gray-800'}`}
            >
              {selectedSection.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* HERO */}
            {selectedSection.type === 'hero' && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white">Slidy ({selectedSection.blocks?.length || 0})</label>
                    <button className="text-xs text-blue-400 hover:text-blue-300">+ Pridať slide</button>
                  </div>
                  {selectedSection.blocks?.map((block, idx) => (
                    <div key={block.id} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">Slide {idx + 1}</span>
                        <button className="p-1 text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <input
                        type="text"
                        value={block.settings.title}
                        onChange={(e) => editor.updateSectionBlock(selectedSection.id, block.id, { title: e.target.value })}
                        placeholder="Nadpis"
                        className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={block.settings.subtitle}
                        onChange={(e) => editor.updateSectionBlock(selectedSection.id, block.id, { subtitle: e.target.value })}
                        placeholder="Podnadpis"
                        className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={block.settings.buttonText}
                          onChange={(e) => editor.updateSectionBlock(selectedSection.id, block.id, { buttonText: e.target.value })}
                          placeholder="Text tlačidla"
                          className="px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={block.settings.backgroundColor}
                            onChange={(e) => editor.updateSectionBlock(selectedSection.id, block.id, { backgroundColor: e.target.value })}
                            className="w-10 h-10 rounded-lg cursor-pointer border-0"
                          />
                          <span className="text-xs text-gray-500">Farba</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Výška slidera (px)</label>
                  <input
                    type="number"
                    value={selectedSection.settings.height || 500}
                    onChange={(e) => editor.updateSectionSettings(selectedSection.id, { height: parseInt(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-400">Automatické prehrávanie</span>
                  <button
                    onClick={() => editor.updateSectionSettings(selectedSection.id, { autoplay: !selectedSection.settings.autoplay })}
                    className={`w-12 h-6 rounded-full transition-colors ${selectedSection.settings.autoplay ? 'bg-blue-600' : 'bg-gray-700'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${selectedSection.settings.autoplay ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-400">Zobraziť šípky</span>
                  <button
                    onClick={() => editor.updateSectionSettings(selectedSection.id, { showArrows: !selectedSection.settings.showArrows })}
                    className={`w-12 h-6 rounded-full transition-colors ${selectedSection.settings.showArrows ? 'bg-blue-600' : 'bg-gray-700'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${selectedSection.settings.showArrows ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </>
            )}

            {/* PRODUCTS */}
            {selectedSection.type === 'products' && (
              <>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Nadpis sekcie</label>
                  <input
                    type="text"
                    value={selectedSection.settings.title}
                    onChange={(e) => editor.updateSectionSettings(selectedSection.id, { title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Podnadpis</label>
                  <input
                    type="text"
                    value={selectedSection.settings.subtitle || ''}
                    onChange={(e) => editor.updateSectionSettings(selectedSection.id, { subtitle: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Počet stĺpcov</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[2, 3, 4, 6].map(cols => (
                      <button
                        key={cols}
                        onClick={() => editor.updateSectionSettings(selectedSection.id, { columns: cols })}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                          selectedSection.settings.columns === cols 
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex gap-0.5">
                          {Array(Math.min(cols, 4)).fill(0).map((_, i) => (
                            <div key={i} className="w-2 h-4 bg-gray-500 rounded-sm" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">{cols}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Štýl kariet</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['default', 'minimal', 'detailed'].map(style => (
                      <button
                        key={style}
                        onClick={() => editor.updateSectionSettings(selectedSection.id, { cardStyle: style })}
                        className={`p-3 rounded-xl border-2 text-sm transition-all ${
                          selectedSection.settings.cardStyle === style 
                            ? 'border-blue-500 bg-blue-500/10 text-white' 
                            : 'border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {style === 'default' ? 'Štandardný' : style === 'minimal' ? 'Minimálny' : 'Detailný'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-400">Zobraziť hodnotenie</span>
                  <button
                    onClick={() => editor.updateSectionSettings(selectedSection.id, { showRating: !selectedSection.settings.showRating })}
                    className={`w-12 h-6 rounded-full transition-colors ${selectedSection.settings.showRating !== false ? 'bg-blue-600' : 'bg-gray-700'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${selectedSection.settings.showRating !== false ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-400">Zobraziť badge</span>
                  <button
                    onClick={() => editor.updateSectionSettings(selectedSection.id, { showBadge: !selectedSection.settings.showBadge })}
                    className={`w-12 h-6 rounded-full transition-colors ${selectedSection.settings.showBadge !== false ? 'bg-blue-600' : 'bg-gray-700'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${selectedSection.settings.showBadge !== false ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </>
            )}

            {/* ANNOUNCEMENT */}
            {selectedSection.type === 'announcement' && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white">Správy ({selectedSection.settings.messages?.length || 0})</label>
                    <button className="text-xs text-blue-400 hover:text-blue-300">+ Pridať</button>
                  </div>
                  {selectedSection.settings.messages?.map((msg: any, idx: number) => (
                    <div key={msg.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={msg.text}
                        onChange={(e) => {
                          const newMsgs = [...selectedSection.settings.messages];
                          newMsgs[idx] = { ...msg, text: e.target.value };
                          editor.updateSectionSettings(selectedSection.id, { messages: newMsgs });
                        }}
                        className="flex-1 px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                      />
                      <button className="p-2 text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Farba pozadia</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedSection.settings.backgroundColor}
                      onChange={(e) => editor.updateSectionSettings(selectedSection.id, { backgroundColor: e.target.value })}
                      className="w-12 h-10 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={selectedSection.settings.backgroundColor}
                      onChange={(e) => editor.updateSectionSettings(selectedSection.id, { backgroundColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {/* NEWSLETTER */}
            {selectedSection.type === 'newsletter' && (
              <>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Nadpis</label>
                  <input
                    type="text"
                    value={selectedSection.settings.title}
                    onChange={(e) => editor.updateSectionSettings(selectedSection.id, { title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Podnadpis</label>
                  <input
                    type="text"
                    value={selectedSection.settings.subtitle}
                    onChange={(e) => editor.updateSectionSettings(selectedSection.id, { subtitle: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Text tlačidla</label>
                  <input
                    type="text"
                    value={selectedSection.settings.buttonText}
                    onChange={(e) => editor.updateSectionSettings(selectedSection.id, { buttonText: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Farba pozadia</label>
                  <div className="flex gap-2">
                    <input type="color" value={selectedSection.settings.backgroundColor}
                      onChange={(e) => editor.updateSectionSettings(selectedSection.id, { backgroundColor: e.target.value })}
                      className="w-12 h-10 rounded-lg cursor-pointer border-0" />
                    <input type="text" value={selectedSection.settings.backgroundColor}
                      onChange={(e) => editor.updateSectionSettings(selectedSection.id, { backgroundColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" />
                  </div>
                </div>
              </>
            )}

            {/* TESTIMONIALS */}
            {selectedSection.type === 'testimonials' && (
              <>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Nadpis sekcie</label>
                  <input
                    type="text"
                    value={selectedSection.settings.title}
                    onChange={(e) => editor.updateSectionSettings(selectedSection.id, { title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white">Recenzie ({selectedSection.blocks?.length || 0})</label>
                    <button className="text-xs text-blue-400 hover:text-blue-300">+ Pridať</button>
                  </div>
                  {selectedSection.blocks?.map((block) => (
                    <div key={block.id} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 space-y-3">
                      <input
                        type="text"
                        value={block.settings.name}
                        onChange={(e) => editor.updateSectionBlock(selectedSection.id, block.id, { name: e.target.value })}
                        placeholder="Meno"
                        className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
                      />
                      <textarea
                        value={block.settings.text}
                        onChange={(e) => editor.updateSectionBlock(selectedSection.id, block.id, { text: e.target.value })}
                        placeholder="Text recenzie"
                        rows={2}
                        className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Hodnotenie:</span>
                        {[1,2,3,4,5].map(star => (
                          <button key={star} onClick={() => editor.updateSectionBlock(selectedSection.id, block.id, { rating: star })}>
                            <Star className={`w-4 h-4 ${star <= block.settings.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* FAQ */}
            {selectedSection.type === 'faq' && (
              <>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Nadpis sekcie</label>
                  <input
                    type="text"
                    value={selectedSection.settings.title}
                    onChange={(e) => editor.updateSectionSettings(selectedSection.id, { title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white">Otázky ({selectedSection.blocks?.length || 0})</label>
                    <button className="text-xs text-blue-400 hover:text-blue-300">+ Pridať</button>
                  </div>
                  {selectedSection.blocks?.map((block) => (
                    <div key={block.id} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 space-y-3">
                      <input
                        type="text"
                        value={block.settings.question}
                        onChange={(e) => editor.updateSectionBlock(selectedSection.id, block.id, { question: e.target.value })}
                        placeholder="Otázka"
                        className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
                      />
                      <textarea
                        value={block.settings.answer}
                        onChange={(e) => editor.updateSectionBlock(selectedSection.id, block.id, { answer: e.target.value })}
                        placeholder="Odpoveď"
                        rows={2}
                        className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm resize-none"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* CATEGORIES */}
            {selectedSection.type === 'categories' && (
              <>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Nadpis sekcie</label>
                  <input
                    type="text"
                    value={selectedSection.settings.title}
                    onChange={(e) => editor.updateSectionSettings(selectedSection.id, { title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Počet stĺpcov</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 4, 5, 6].map(cols => (
                      <button
                        key={cols}
                        onClick={() => editor.updateSectionSettings(selectedSection.id, { columns: cols })}
                        className={`p-3 rounded-xl border-2 text-sm ${
                          selectedSection.settings.columns === cols ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-gray-700 text-gray-400'
                        }`}
                      >
                        {cols}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white">Kategórie ({selectedSection.blocks?.length || 0})</label>
                    <button className="text-xs text-blue-400 hover:text-blue-300">+ Pridať</button>
                  </div>
                  {selectedSection.blocks?.map((block) => (
                    <div key={block.id} className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                      <input
                        type="text"
                        value={block.settings.icon}
                        onChange={(e) => editor.updateSectionBlock(selectedSection.id, block.id, { icon: e.target.value })}
                        className="w-12 px-2 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-center"
                      />
                      <input
                        type="text"
                        value={block.settings.name}
                        onChange={(e) => editor.updateSectionBlock(selectedSection.id, block.id, { name: e.target.value })}
                        className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
                      />
                      <input
                        type="color"
                        value={block.settings.color}
                        onChange={(e) => editor.updateSectionBlock(selectedSection.id, block.id, { color: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer border-0"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* TRUST BADGES */}
            {selectedSection.type === 'trust-badges' && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white">Položky ({selectedSection.blocks?.length || 0})</label>
                    <button className="text-xs text-blue-400 hover:text-blue-300">+ Pridať</button>
                  </div>
                  {selectedSection.blocks?.map((block) => (
                    <div key={block.id} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 space-y-3">
                      <input
                        type="text"
                        value={block.settings.title}
                        onChange={(e) => editor.updateSectionBlock(selectedSection.id, block.id, { title: e.target.value })}
                        placeholder="Nadpis"
                        className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
                      />
                      <input
                        type="text"
                        value={block.settings.subtitle}
                        onChange={(e) => editor.updateSectionBlock(selectedSection.id, block.id, { subtitle: e.target.value })}
                        placeholder="Popis"
                        className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* PROMO BANNER */}
            {selectedSection.type === 'promo-banner' && (
              <>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Nadpis</label>
                  <input type="text" value={selectedSection.settings.title}
                    onChange={(e) => editor.updateSectionSettings(selectedSection.id, { title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Podnadpis</label>
                  <input type="text" value={selectedSection.settings.subtitle}
                    onChange={(e) => editor.updateSectionSettings(selectedSection.id, { subtitle: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Text tlačidla</label>
                  <input type="text" value={selectedSection.settings.buttonText}
                    onChange={(e) => editor.updateSectionSettings(selectedSection.id, { buttonText: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Farba pozadia</label>
                  <div className="flex gap-2">
                    <input type="color" value={selectedSection.settings.backgroundColor}
                      onChange={(e) => editor.updateSectionSettings(selectedSection.id, { backgroundColor: e.target.value })}
                      className="w-12 h-10 rounded-lg cursor-pointer border-0" />
                    <input type="text" value={selectedSection.settings.backgroundColor}
                      onChange={(e) => editor.updateSectionSettings(selectedSection.id, { backgroundColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" />
                  </div>
                </div>
              </>
            )}

            {/* Default for other sections */}
            {['header', 'footer'].includes(selectedSection.type) && (
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Rozšírené nastavenia pre túto sekciu</p>
                <p className="text-xs mt-1 text-gray-600">Prídu v ďalšej verzii</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800 flex gap-2">
            <button className="flex-1 px-4 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-700 flex items-center justify-center gap-2">
              <Copy className="w-4 h-4" /> Duplikovať
            </button>
            <button className="flex-1 px-4 py-2.5 bg-red-500/10 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/20 flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" /> Odstrániť
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN PANEL
  return (
    <div className={`fixed top-0 left-0 bottom-0 w-[400px] bg-gray-900 z-50 shadow-2xl transform transition-transform duration-300 ${editor.isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white">Shop Builder</span>
              <p className="text-xs text-gray-500">Upravte váš obchod</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-800 rounded-lg p-1">
              {[
                { id: 'desktop', icon: Monitor },
                { id: 'tablet', icon: Tablet },
                { id: 'mobile', icon: Smartphone },
              ].map(d => (
                <button key={d.id}
                  onClick={() => setDevicePreview(d.id as any)}
                  className={`p-1.5 rounded ${devicePreview === d.id ? 'bg-gray-700 text-white' : 'text-gray-500'}`}
                >
                  <d.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <button onClick={() => editor.setIsPanelOpen(false)} className="p-2 hover:bg-gray-800 rounded-lg">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {[
            { id: 'sections', icon: Layout, label: 'Sekcie' },
            { id: 'appearance', icon: Palette, label: 'Vzhľad' },
            { id: 'settings', icon: Settings, label: 'Nastavenia' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === tab.id ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* SECTIONS TAB */}
          {activeTab === 'sections' && (
            <div className="p-4 space-y-2">
              {sortedSections.map((section, idx) => {
                const meta = SECTION_META[section.type];
                return (
                  <div
                    key={section.id}
                    className={`rounded-xl border transition-all ${
                      section.enabled ? 'border-gray-700 hover:border-gray-600' : 'border-gray-800 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 p-3">
                      <div className="cursor-grab text-gray-600 hover:text-gray-400">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <span className="text-lg">{meta.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-white text-sm font-medium">{meta.name}</span>
                        {section.blocks && section.blocks.length > 0 && (
                          <span className="text-gray-500 text-xs ml-2">{section.blocks.length} položiek</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => editor.moveSection(section.id, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-gray-500 hover:text-white disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => editor.moveSection(section.id, 'down')}
                          disabled={idx === sortedSections.length - 1}
                          className="p-1 text-gray-500 hover:text-white disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => editor.toggleSection(section.id)}
                        className={`p-1.5 rounded-lg ${section.enabled ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-600 hover:bg-gray-800'}`}
                      >
                        {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => editor.setActiveSection(section.id)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
              <button className="w-full py-3 border-2 border-dashed border-gray-700 rounded-xl text-gray-500 hover:text-white hover:border-gray-600 flex items-center justify-center gap-2 mt-4">
                <Plus className="w-4 h-4" />
                Pridať sekciu
              </button>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className="p-4 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">Primárna farba</label>
                <div className="flex gap-2">
                  <input type="color" value={editor.theme.primaryColor}
                    onChange={(e) => editor.setTheme({ ...editor.theme, primaryColor: e.target.value })}
                    className="w-12 h-10 rounded-lg cursor-pointer border-0" />
                  <input type="text" value={editor.theme.primaryColor}
                    onChange={(e) => editor.setTheme({ ...editor.theme, primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">Farebné schémy</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { color: '#2563eb', name: 'Modrá' },
                    { color: '#059669', name: 'Zelená' },
                    { color: '#7c3aed', name: 'Fialová' },
                    { color: '#dc2626', name: 'Červená' },
                    { color: '#ea580c', name: 'Oranžová' },
                    { color: '#db2777', name: 'Ružová' },
                  ].map(preset => (
                    <button key={preset.color}
                      onClick={() => editor.setTheme({ ...editor.theme, primaryColor: preset.color })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        editor.theme.primaryColor === preset.color ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: preset.color }}
                    >
                      <span className="text-white text-xs font-medium drop-shadow">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">Počet stĺpcov produktov</label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 4, 6].map(cols => (
                    <button key={cols}
                      onClick={() => editor.setTheme({ ...editor.theme, productColumns: cols })}
                      className={`p-3 rounded-xl border-2 text-sm ${
                        editor.theme.productColumns === cols ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-gray-700 text-gray-400'
                      }`}
                    >
                      {cols}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">Zaoblenie rohov</label>
                <input type="range" min="0" max="24" value={editor.theme.borderRadius}
                  onChange={(e) => editor.setTheme({ ...editor.theme, borderRadius: parseInt(e.target.value) })}
                  className="w-full" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Ostré</span>
                  <span>{editor.theme.borderRadius}px</span>
                  <span>Zaoblené</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">Písmo</label>
                <select value={editor.theme.fontFamily}
                  onChange={(e) => editor.setTheme({ ...editor.theme, fontFamily: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                >
                  <option value="Inter">Inter (Moderný)</option>
                  <option value="Poppins">Poppins (Čistý)</option>
                  <option value="Playfair Display">Playfair (Elegantný)</option>
                  <option value="Space Grotesk">Space Grotesk (Tech)</option>
                </select>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="p-4 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">Názov obchodu</label>
                <input type="text" value={editor.config.name}
                  onChange={(e) => editor.setConfig({ ...editor.config, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">Tagline</label>
                <input type="text" value={editor.config.tagline}
                  onChange={(e) => editor.setConfig({ ...editor.config, tagline: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">Email</label>
                <input type="email" value={editor.config.email}
                  onChange={(e) => editor.setConfig({ ...editor.config, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">Telefón</label>
                <input type="text" value={editor.config.phone}
                  onChange={(e) => editor.setConfig({ ...editor.config, phone: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">Doprava zadarmo od (€)</label>
                <input type="number" value={editor.config.freeShippingMin}
                  onChange={(e) => editor.setConfig({ ...editor.config, freeShippingMin: parseInt(e.target.value) })}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {editor.hasChanges && (
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-sm text-yellow-400">Neuložené zmeny</span>
            </div>
            <div className="flex gap-2">
              <button onClick={editor.discard}
                className="flex-1 px-4 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-700 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Zrušiť
              </button>
              <button onClick={handleSave} disabled={isSaving}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {isSaving ? 'Ukladám...' : 'Uložiť'}
              </button>
            </div>
          </div>
        )}
        {!editor.hasChanges && (
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-2 text-green-400">
              <Check className="w-4 h-4" />
              <span className="text-sm">Všetko uložené</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION RENDERERS
// ═══════════════════════════════════════════════════════════════════════════════

function AnnouncementSection({ section, theme }: { section: Section; theme: Theme }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const messages = section.settings.messages || [];

  useEffect(() => {
    if (!section.settings.autoRotate || messages.length <= 1) return;
    const interval = setInterval(() => setIdx(i => (i + 1) % messages.length), section.settings.speed || 4000);
    return () => clearInterval(interval);
  }, [messages.length, section.settings.autoRotate, section.settings.speed]);

  if (!visible || !messages.length) return null;

  return (
    <div className="text-center py-2.5 px-4 text-sm relative" 
      style={{ backgroundColor: section.settings.backgroundColor, color: section.settings.textColor }}>
      {messages[idx]?.text}
      <button onClick={() => setVisible(false)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function HeaderSection({ section, theme, config }: { section: Section; theme: Theme; config: ShopConfig }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={`bg-white border-b ${section.settings.sticky ? 'sticky top-0 z-40' : ''}`} 
      style={{ backgroundColor: section.settings.backgroundColor, color: section.settings.textColor }}>
      <div className="max-w-7xl mx-auto px-4 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: theme.primaryColor }}>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl">{config.name}</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {section.settings.menuItems?.map((item: any) => (
            <button key={item.id} className="flex items-center gap-1 hover:opacity-70 transition-opacity">
              {item.label}
              {item.badge && <span className="ml-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {section.settings.showSearch && <button className="p-2.5 hover:bg-gray-100 rounded-xl"><Search className="w-5 h-5" /></button>}
          <button className="p-2.5 hover:bg-gray-100 rounded-xl"><Heart className="w-5 h-5" /></button>
          {section.settings.showAccount && <button className="p-2.5 hover:bg-gray-100 rounded-xl"><User className="w-5 h-5" /></button>}
          {section.settings.showCart && (
            <button className="p-2.5 hover:bg-gray-100 rounded-xl relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 text-xs text-white rounded-full flex items-center justify-center" 
                style={{ backgroundColor: theme.primaryColor }}>0</span>
            </button>
          )}
          <button className="md:hidden p-2.5 hover:bg-gray-100 rounded-xl" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function HeroSection({ section, theme }: { section: Section; theme: Theme }) {
  const [active, setActive] = useState(0);
  const slides = section.blocks || [];

  useEffect(() => {
    if (!section.settings.autoplay || slides.length <= 1) return;
    const interval = setInterval(() => setActive(i => (i + 1) % slides.length), section.settings.speed || 5000);
    return () => clearInterval(interval);
  }, [slides.length, section.settings.autoplay, section.settings.speed]);

  if (!slides.length) return null;
  const slide = slides[active].settings;

  return (
    <section className="relative text-white flex items-center justify-center" 
      style={{ minHeight: section.settings.height || 500, backgroundColor: slide.backgroundColor }}>
      <div className="text-center max-w-3xl px-4 py-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{slide.title}</h1>
        <p className="text-xl opacity-90 mb-8">{slide.subtitle}</p>
        <button className="px-8 py-3.5 bg-white font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          style={{ color: slide.backgroundColor, borderRadius: theme.borderRadius }}>
          {slide.buttonText}
        </button>
      </div>
      {section.settings.showArrows && slides.length > 1 && (
        <>
          <button onClick={() => setActive((active - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={() => setActive((active + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
      {section.settings.showDots && slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} 
              className={`w-3 h-3 rounded-full transition-colors ${i === active ? 'bg-white' : 'bg-white/40'}`} />
          ))}
        </div>
      )}
    </section>
  );
}

function TrustBadgesSection({ section, theme }: { section: Section; theme: Theme }) {
  const iconMap: Record<string, any> = { truck: Truck, shield: Shield, refresh: RefreshCw, headphones: Headphones };

  return (
    <section className="py-6 border-b" style={{ backgroundColor: section.settings.backgroundColor }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {section.blocks?.map(block => {
            const Icon = iconMap[block.settings.icon] || Package;
            return (
              <div key={block.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${theme.primaryColor}15` }}>
                  <Icon className="w-6 h-6" style={{ color: theme.primaryColor }} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{block.settings.title}</p>
                  <p className="text-gray-500 text-xs">{block.settings.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection({ section, theme }: { section: Section; theme: Theme }) {
  const cols = section.settings.columns || 6;
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{section.settings.title}</h2>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {section.blocks?.map(block => (
            <div key={block.id} className="p-6 rounded-2xl text-center cursor-pointer hover:shadow-lg transition-all"
              style={{ backgroundColor: `${block.settings.color}10`, borderRadius: theme.borderRadius }}>
              <span className="text-4xl mb-3 block">{block.settings.icon}</span>
              <p className="font-semibold">{block.settings.name}</p>
              <p className="text-sm text-gray-500">{block.settings.count} produktov</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSection({ section, theme }: { section: Section; theme: Theme }) {
  const cols = section.settings.columns || 4;
  const cardStyle = section.settings.cardStyle || 'default';

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">{section.settings.title}</h2>
          {section.settings.subtitle && <p className="text-gray-500 mt-2">{section.settings.subtitle}</p>}
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {demoProducts.slice(0, cols * 2).map(product => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
              style={{ borderRadius: theme.borderRadius }}>
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative flex items-center justify-center group">
                <Package className="w-16 h-16 text-gray-400" />
                {section.settings.showBadge !== false && product.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white rounded-lg"
                    style={{ backgroundColor: theme.primaryColor }}>{product.badge}</span>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                {section.settings.showRating !== false && (
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{product.rating}</span>
                    <span className="text-sm text-gray-400">({product.reviews})</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold" style={{ color: theme.primaryColor }}>{theme.primaryColor ? '€' : '€'}{product.price}</span>
                  {product.oldPrice && <span className="text-sm text-gray-400 line-through">€{product.oldPrice}</span>}
                </div>
                <button className="w-full py-2.5 text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}>
                  Do košíka
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoBannerSection({ section, theme }: { section: Section; theme: Theme }) {
  return (
    <section className="py-16" style={{ backgroundColor: section.settings.backgroundColor, color: section.settings.textColor }}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{section.settings.title}</h2>
        <p className="text-xl opacity-90 mb-8">{section.settings.subtitle}</p>
        <button className="px-8 py-3.5 bg-white font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          style={{ color: section.settings.backgroundColor }}>
          {section.settings.buttonText}
        </button>
      </div>
    </section>
  );
}

function TestimonialsSection({ section, theme }: { section: Section; theme: Theme }) {
  const cols = section.settings.columns || 3;
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{section.settings.title}</h2>
        <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {section.blocks?.map(block => (
            <div key={block.id} className="bg-white p-6 rounded-2xl shadow-sm" style={{ borderRadius: theme.borderRadius }}>
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-5 h-5 ${s <= block.settings.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">"{block.settings.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <span className="font-semibold">{block.settings.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ section, theme }: { section: Section; theme: Theme }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{section.settings.title}</h2>
        <div className="space-y-3">
          {section.blocks?.map(block => (
            <div key={block.id} className="border rounded-2xl overflow-hidden" style={{ borderRadius: theme.borderRadius }}>
              <button onClick={() => setOpen(open === block.id ? null : block.id)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
                <span className="font-semibold">{block.settings.question}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${open === block.id ? 'rotate-180' : ''}`} />
              </button>
              {open === block.id && (
                <div className="px-5 pb-5 text-gray-600 leading-relaxed">{block.settings.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection({ section, theme }: { section: Section; theme: Theme }) {
  return (
    <section className="py-16" style={{ backgroundColor: section.settings.backgroundColor, color: section.settings.textColor }}>
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">{section.settings.title}</h2>
        <p className="opacity-80 mb-8">{section.settings.subtitle}</p>
        <div className="flex gap-3 max-w-md mx-auto">
          <input type="email" placeholder="Váš email" 
            className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40" />
          <button className="px-6 py-3.5 bg-white font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            style={{ color: section.settings.backgroundColor }}>
            {section.settings.buttonText}
          </button>
        </div>
      </div>
    </section>
  );
}

function FooterSection({ section, theme, config }: { section: Section; theme: Theme; config: ShopConfig }) {
  return (
    <footer className="py-12" style={{ backgroundColor: section.settings.backgroundColor, color: section.settings.textColor }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: theme.primaryColor }}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">{config.name}</span>
            </div>
            <p className="opacity-60 text-sm leading-relaxed">{config.tagline}</p>
            {section.settings.showSocial && (
              <div className="flex gap-3 mt-4">
                <Facebook className="w-5 h-5 opacity-60 hover:opacity-100 cursor-pointer" />
                <Instagram className="w-5 h-5 opacity-60 hover:opacity-100 cursor-pointer" />
                <Twitter className="w-5 h-5 opacity-60 hover:opacity-100 cursor-pointer" />
              </div>
            )}
          </div>
          {section.settings.columns?.map((col: any, i: number) => (
            <div key={i}>
              <h4 className="font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-2 text-sm opacity-60">
                {col.links?.map((link: string, j: number) => (
                  <li key={j} className="hover:opacity-100 cursor-pointer transition-opacity">{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-white/10 text-center text-sm opacity-60">
          {section.settings.copyright}
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN STORE PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function StorePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params.slug as string) || 'demo';
  const editMode = searchParams.get('edit') === 'true';

  // State
  const [isEditing, setIsEditing] = useState(editMode);
  const [isPanelOpen, setIsPanelOpen] = useState(editMode);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>(defaultSections);
  const [originalSections, setOriginalSections] = useState<Section[]>(defaultSections);
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [originalTheme, setOriginalTheme] = useState<Theme>(defaultTheme);
  const [config, setConfig] = useState<ShopConfig>(defaultConfig);
  const [originalConfig, setOriginalConfig] = useState<ShopConfig>(defaultConfig);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    const changed = JSON.stringify({ sections, theme, config }) !== 
                   JSON.stringify({ sections: originalSections, theme: originalTheme, config: originalConfig });
    setHasChanges(changed);
  }, [sections, theme, config, originalSections, originalTheme, originalConfig]);

  // Editor functions
  const updateSection = (id: string, updates: Partial<Section>) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const updateSectionSettings = (id: string, settings: Record<string, any>) => {
    setSections(sections.map(s => s.id === id ? { ...s, settings: { ...s.settings, ...settings } } : s));
  };

  const updateSectionBlock = (sectionId: string, blockId: string, settings: Record<string, any>) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s;
      return { ...s, blocks: s.blocks?.map(b => b.id === blockId ? { ...b, settings: { ...b.settings, ...settings } } : b) };
    }));
  };

  const toggleSection = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const sorted = [...sections].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(s => s.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === sorted.length - 1)) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newSections = [...sorted];
    [newSections[idx], newSections[newIdx]] = [newSections[newIdx], newSections[idx]];
    setSections(newSections.map((s, i) => ({ ...s, order: i })));
  };

  const save = () => {
    setOriginalSections([...sections]);
    setOriginalTheme({ ...theme });
    setOriginalConfig({ ...config });
    setHasChanges(false);
    console.log('Saved:', { sections, theme, config });
  };

  const discard = () => {
    setSections([...originalSections]);
    setTheme({ ...originalTheme });
    setConfig({ ...originalConfig });
    setHasChanges(false);
  };

  const editorValue: EditorContextType = {
    isEditing, isPanelOpen, activeSection, sections, theme, config, hasChanges,
    setIsEditing, setIsPanelOpen, setActiveSection,
    updateSection, updateSectionSettings, updateSectionBlock, toggleSection, moveSection,
    setTheme, setConfig, save, discard,
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order).filter(s => s.enabled);

  return (
    <EditorContext.Provider value={editorValue}>
      <div className="min-h-screen bg-white" style={{ fontFamily: theme.fontFamily }}>
        {/* Editor Toggle Button */}
        <button
          onClick={() => { setIsEditing(!isEditing); setIsPanelOpen(!isEditing); }}
          className={`fixed top-4 z-[60] px-4 py-2.5 rounded-xl font-medium shadow-lg flex items-center gap-2 transition-all ${
            isEditing 
              ? 'left-[416px] bg-gray-900 text-white hover:bg-gray-800' 
              : 'left-4 bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {isEditing ? (
            <><Eye className="w-4 h-4" /> Režim náhľadu</>
          ) : (
            <><Palette className="w-4 h-4" /> Otvoriť editor</>
          )}
        </button>

        {/* View Store Link */}
        {isEditing && (
          <Link href={`/store/${slug}`} target="_blank"
            className="fixed top-4 right-4 z-[60] px-4 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-xl font-medium shadow-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <ExternalLink className="w-4 h-4" /> Zobraziť obchod
          </Link>
        )}

        {/* Editor Panel */}
        {isEditing && <EditorPanel />}

        {/* Page Content */}
        <div className={`transition-all duration-300 ${isEditing && isPanelOpen ? 'ml-[400px]' : ''}`}>
          {sortedSections.map(section => {
            switch (section.type) {
              case 'announcement': return <AnnouncementSection key={section.id} section={section} theme={theme} />;
              case 'header': return <HeaderSection key={section.id} section={section} theme={theme} config={config} />;
              case 'hero': return <HeroSection key={section.id} section={section} theme={theme} />;
              case 'trust-badges': return <TrustBadgesSection key={section.id} section={section} theme={theme} />;
              case 'categories': return <CategoriesSection key={section.id} section={section} theme={theme} />;
              case 'products': return <ProductsSection key={section.id} section={section} theme={theme} />;
              case 'promo-banner': return <PromoBannerSection key={section.id} section={section} theme={theme} />;
              case 'testimonials': return <TestimonialsSection key={section.id} section={section} theme={theme} />;
              case 'faq': return <FAQSection key={section.id} section={section} theme={theme} />;
              case 'newsletter': return <NewsletterSection key={section.id} section={section} theme={theme} />;
              case 'footer': return <FooterSection key={section.id} section={section} theme={theme} config={config} />;
              default: return null;
            }
          })}
        </div>
      </div>
    </EditorContext.Provider>
  );
}
