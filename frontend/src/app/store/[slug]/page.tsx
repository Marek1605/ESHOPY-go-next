'use client';

import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingCart, Search, Heart, Menu, X, Star, Sparkles, Package, Truck, Shield, 
  Phone, Mail, MapPin, Minus, Plus, Trash2, ChevronLeft, ChevronRight,
  Eye, EyeOff, GripVertical, Settings, Palette, Layout, Save, RotateCcw,
  Image, Type, Copy, PanelLeftOpen, PanelLeftClose, Headphones, RefreshCw
} from 'lucide-react';

// ============================================
// TYPES & INTERFACES
// ============================================
interface Section {
  id: string;
  type: 'announcement' | 'header' | 'hero' | 'features' | 'products' | 'newsletter' | 'footer';
  visible: boolean;
  order: number;
  data: Record<string, any>;
}

interface ShopConfig {
  name: string;
  slug: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

interface EditorContextType {
  isEditorMode: boolean;
  setEditorMode: (v: boolean) => void;
  isPanelOpen: boolean;
  setPanelOpen: (v: boolean) => void;
  activeSection: string | null;
  setActiveSection: (id: string | null) => void;
  sections: Section[];
  updateSection: (id: string, data: Partial<Section>) => void;
  updateSectionData: (id: string, data: Record<string, any>) => void;
  toggleVisibility: (id: string) => void;
  moveSection: (id: string, direction: 'up' | 'down') => void;
  shopConfig: ShopConfig;
  updateShopConfig: (config: Partial<ShopConfig>) => void;
  hasChanges: boolean;
  saveChanges: () => void;
  discardChanges: () => void;
  hoveredSection: string | null;
  setHoveredSection: (id: string | null) => void;
}

// ============================================
// DEFAULT DATA
// ============================================
const defaultSections: Section[] = [
  {
    id: 'announcement',
    type: 'announcement',
    visible: true,
    order: 0,
    data: {
      text: '🎁 30 dní na vrátenie bez udania dôvodu',
      backgroundColor: '#3b82f6'
    }
  },
  {
    id: 'header',
    type: 'header',
    visible: true,
    order: 1,
    data: {
      menuItems: ['Domov', 'Produkty', 'Akcie', 'Novinky', 'Kontakt']
    }
  },
  {
    id: 'hero',
    type: 'hero',
    visible: true,
    order: 2,
    data: {
      slides: [
        {
          id: '1',
          title: 'Nová kolekcia 2024',
          subtitle: 'Objavte najnovšie produkty pre tento rok',
          buttonText: 'Nakupovať',
          secondaryButtonText: 'Viac info',
          backgroundColor: '#3b82f6'
        },
        {
          id: '2',
          title: 'Doprava zadarmo',
          subtitle: 'Pri každej objednávke nad €50',
          buttonText: 'Začať nakupovať',
          backgroundColor: '#059669'
        }
      ],
      activeSlide: 0
    }
  },
  {
    id: 'features',
    type: 'features',
    visible: true,
    order: 3,
    data: {
      items: [
        { icon: 'truck', title: 'Doprava zadarmo', subtitle: 'Objednávky nad €50' },
        { icon: 'shield', title: 'Bezpečný nákup', subtitle: '100% zabezpečené' },
        { icon: 'refresh', title: 'Vrátenie tovaru', subtitle: '30 dní bez otázok' },
        { icon: 'headphones', title: 'Podpora 24/7', subtitle: 'Vždy tu pre vás' }
      ]
    }
  },
  {
    id: 'products',
    type: 'products',
    visible: true,
    order: 4,
    data: {
      title: 'Najpredávanejšie produkty',
      products: [
        { id: '1', name: 'Bezdrôtové slúchadlá Pro', price: 89.99, oldPrice: 119.99, rating: 4.8, reviews: 124 },
        { id: '2', name: 'Smart Watch Ultra', price: 199.99, rating: 4.9, reviews: 89 },
        { id: '3', name: 'Prémiový obal na telefón', price: 29.99, oldPrice: 39.99, rating: 4.5, reviews: 256 },
        { id: '4', name: 'USB-C kábel 2m', price: 14.99, rating: 4.7, reviews: 512 },
      ]
    }
  },
  {
    id: 'newsletter',
    type: 'newsletter',
    visible: true,
    order: 5,
    data: {
      title: 'Prihláste sa na odber noviniek',
      subtitle: 'Získajte 10% zľavu na prvý nákup',
      buttonText: 'Prihlásiť sa'
    }
  },
  {
    id: 'footer',
    type: 'footer',
    visible: true,
    order: 6,
    data: {
      copyright: '© 2024 Demo Shop. Powered by EshopBuilder'
    }
  }
];

const defaultShopConfig: ShopConfig = {
  name: 'Demo Shop',
  slug: 'demo',
  primaryColor: '#3b82f6',
  secondaryColor: '#1e40af',
  fontFamily: 'Inter'
};

// ============================================
// EDITOR CONTEXT
// ============================================
const EditorContext = createContext<EditorContextType | null>(null);

function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be within EditorProvider');
  return ctx;
}

// ============================================
// SECTION ICONS & LABELS
// ============================================
const SECTION_META: Record<string, { icon: string; label: string }> = {
  announcement: { icon: '📢', label: 'Oznamovacia lišta' },
  header: { icon: '🏠', label: 'Hlavička' },
  hero: { icon: '🎯', label: 'Hero Slider' },
  features: { icon: '✨', label: 'Dôveryhodné prvky' },
  products: { icon: '📦', label: 'Produkty' },
  newsletter: { icon: '✉️', label: 'Newsletter' },
  footer: { icon: '📋', label: 'Päta' }
};

// ============================================
// EDITOR PANEL COMPONENT
// ============================================
function EditorPanel() {
  const {
    isPanelOpen, setPanelOpen, sections, activeSection, setActiveSection,
    toggleVisibility, moveSection, shopConfig, updateShopConfig,
    hasChanges, saveChanges, discardChanges, updateSectionData
  } = useEditor();

  const [activeTab, setActiveTab] = useState<'sections' | 'appearance' | 'settings'>('sections');
  const [isSaving, setIsSaving] = useState(false);

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const selectedSection = activeSection ? sections.find(s => s.id === activeSection) : null;

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 500));
    saveChanges();
    setIsSaving(false);
  };

  // Section Detail Editor
  if (selectedSection) {
    return (
      <div className={`fixed top-0 left-0 bottom-0 w-[380px] bg-gray-900 z-50 shadow-2xl transform transition-transform duration-300 ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Section Header */}
          <div className="p-4 border-b border-gray-800 flex items-center gap-3">
            <button onClick={() => setActiveSection(null)} className="p-2 hover:bg-gray-800 rounded-lg">
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <span className="text-xl">{SECTION_META[selectedSection.type]?.icon}</span>
            <span className="font-semibold text-white">{SECTION_META[selectedSection.type]?.label}</span>
          </div>

          {/* Section Editor Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {selectedSection.type === 'announcement' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Text oznámenia</label>
                  <input
                    type="text"
                    value={selectedSection.data.text}
                    onChange={(e) => updateSectionData(selectedSection.id, { text: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Farba pozadia</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedSection.data.backgroundColor}
                      onChange={(e) => updateSectionData(selectedSection.id, { backgroundColor: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={selectedSection.data.backgroundColor}
                      onChange={(e) => updateSectionData(selectedSection.id, { backgroundColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedSection.type === 'hero' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Slidy ({selectedSection.data.slides?.length || 0})</span>
                  <button className="text-xs text-blue-400 hover:text-blue-300">+ Pridať</button>
                </div>
                {selectedSection.data.slides?.map((slide: any, idx: number) => (
                  <div key={slide.id || idx} className="p-3 bg-gray-800/60 rounded-lg space-y-3 border border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Slide {idx + 1}</span>
                      <button className="text-gray-500 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                    </div>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => {
                        const newSlides = [...selectedSection.data.slides];
                        newSlides[idx] = { ...slide, title: e.target.value };
                        updateSectionData(selectedSection.id, { slides: newSlides });
                      }}
                      placeholder="Nadpis"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                    <input
                      type="text"
                      value={slide.subtitle}
                      onChange={(e) => {
                        const newSlides = [...selectedSection.data.slides];
                        newSlides[idx] = { ...slide, subtitle: e.target.value };
                        updateSectionData(selectedSection.id, { slides: newSlides });
                      }}
                      placeholder="Podnadpis"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={slide.buttonText}
                        onChange={(e) => {
                          const newSlides = [...selectedSection.data.slides];
                          newSlides[idx] = { ...slide, buttonText: e.target.value };
                          updateSectionData(selectedSection.id, { slides: newSlides });
                        }}
                        placeholder="Text tlačidla"
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      />
                      <input
                        type="color"
                        value={slide.backgroundColor}
                        onChange={(e) => {
                          const newSlides = [...selectedSection.data.slides];
                          newSlides[idx] = { ...slide, backgroundColor: e.target.value };
                          updateSectionData(selectedSection.id, { slides: newSlides });
                        }}
                        className="w-10 h-9 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedSection.type === 'features' && (
              <div className="space-y-4">
                {selectedSection.data.items?.map((item: any, idx: number) => (
                  <div key={idx} className="p-3 bg-gray-800/60 rounded-lg space-y-2 border border-gray-700">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...selectedSection.data.items];
                        newItems[idx] = { ...item, title: e.target.value };
                        updateSectionData(selectedSection.id, { items: newItems });
                      }}
                      placeholder="Nadpis"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(e) => {
                        const newItems = [...selectedSection.data.items];
                        newItems[idx] = { ...item, subtitle: e.target.value };
                        updateSectionData(selectedSection.id, { items: newItems });
                      }}
                      placeholder="Popis"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                  </div>
                ))}
              </div>
            )}

            {selectedSection.type === 'newsletter' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nadpis</label>
                  <input
                    type="text"
                    value={selectedSection.data.title}
                    onChange={(e) => updateSectionData(selectedSection.id, { title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Podnadpis</label>
                  <input
                    type="text"
                    value={selectedSection.data.subtitle}
                    onChange={(e) => updateSectionData(selectedSection.id, { subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Text tlačidla</label>
                  <input
                    type="text"
                    value={selectedSection.data.buttonText}
                    onChange={(e) => updateSectionData(selectedSection.id, { buttonText: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
              </div>
            )}

            {selectedSection.type === 'products' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nadpis sekcie</label>
                  <input
                    type="text"
                    value={selectedSection.data.title}
                    onChange={(e) => updateSectionData(selectedSection.id, { title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="text-center py-6 text-gray-500">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Produkty sa načítajú automaticky</p>
                  <p className="text-xs mt-1">z databázy vášho obchodu</p>
                </div>
              </div>
            )}

            {(selectedSection.type === 'header' || selectedSection.type === 'footer') && (
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Rozšírené nastavenia pre túto sekciu</p>
                <p className="text-xs mt-1">Prídu v ďalšej verzii</p>
              </div>
            )}
          </div>

          {/* Section Footer */}
          <div className="p-4 border-t border-gray-800 flex gap-2">
            <button className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 flex items-center justify-center gap-2">
              <Copy className="w-4 h-4" />
              Duplikovať
            </button>
            <button className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" />
              Odstrániť
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Panel
  return (
    <div className={`fixed top-0 left-0 bottom-0 w-[380px] bg-gray-900 z-50 shadow-2xl transform transition-transform duration-300 ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg">Shop Builder</span>
          </div>
          <button onClick={() => setPanelOpen(false)} className="p-2 hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {[
            { id: 'sections', icon: Layout, label: 'Sekcie' },
            { id: 'appearance', icon: Palette, label: 'Vzhľad' },
            { id: 'settings', icon: Settings, label: 'Nastavenia' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'sections' && (
            <div className="p-4 space-y-2">
              {sortedSections.map((section, index) => (
                <div
                  key={section.id}
                  className="rounded-xl border border-gray-800 bg-gray-800/30 hover:border-gray-700 transition-all"
                >
                  <div className="flex items-center gap-3 p-3">
                    <div className="cursor-grab text-gray-600 hover:text-gray-400">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <span className="text-lg">{SECTION_META[section.type]?.icon}</span>
                    <div className="flex-1">
                      <span className="text-white text-sm font-medium">{SECTION_META[section.type]?.label}</span>
                      {section.type === 'hero' && (
                        <span className="text-gray-500 text-xs ml-2">{section.data.slides?.length} položiek</span>
                      )}
                      {section.type === 'features' && (
                        <span className="text-gray-500 text-xs ml-2">{section.data.items?.length} položiek</span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleVisibility(section.id)}
                      className={`p-1.5 rounded-lg transition-colors ${section.visible ? 'text-blue-400 hover:bg-blue-400/10' : 'text-gray-600 hover:bg-gray-700'}`}
                    >
                      {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="p-4 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Primárna farba</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={shopConfig.primaryColor}
                    onChange={(e) => updateShopConfig({ primaryColor: e.target.value })}
                    className="w-12 h-10 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={shopConfig.primaryColor}
                    onChange={(e) => updateShopConfig({ primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Farebné schémy</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { color: '#3B82F6', name: 'Modrá' },
                    { color: '#10B981', name: 'Zelená' },
                    { color: '#8B5CF6', name: 'Fialová' },
                    { color: '#EF4444', name: 'Červená' },
                    { color: '#F59E0B', name: 'Oranžová' },
                    { color: '#EC4899', name: 'Ružová' },
                  ].map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => updateShopConfig({ primaryColor: preset.color })}
                      className={`p-3 rounded-lg border-2 transition-all ${shopConfig.primaryColor === preset.color ? 'border-white' : 'border-transparent'}`}
                      style={{ backgroundColor: preset.color }}
                    >
                      <span className="text-white text-xs font-medium drop-shadow">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Písmo</label>
                <select
                  value={shopConfig.fontFamily}
                  onChange={(e) => updateShopConfig({ fontFamily: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                >
                  <option value="Inter">Inter (Moderný)</option>
                  <option value="Poppins">Poppins (Čistý)</option>
                  <option value="Playfair Display">Playfair (Elegantný)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-4 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Názov obchodu</label>
                <input
                  type="text"
                  value={shopConfig.name}
                  onChange={(e) => updateShopConfig({ name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer - Save Bar */}
        {hasChanges && (
          <div className="p-4 border-t border-gray-800 bg-gray-900/95">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-sm text-yellow-400">Neuložené zmeny</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={discardChanges}
                className="flex-1 px-4 py-2.5 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Zrušiť
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Ukladám...' : 'Uložiť'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// EDITABLE SECTION WRAPPER
// ============================================
function EditableSection({ id, children }: { id: string; children: ReactNode }) {
  const { isEditorMode, setActiveSection, setPanelOpen, hoveredSection, setHoveredSection } = useEditor();
  
  if (!isEditorMode) return <>{children}</>;

  const isHovered = hoveredSection === id;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setHoveredSection(id)}
      onMouseLeave={() => setHoveredSection(null)}
    >
      {children}
      
      {/* Hover Overlay */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-200 ${isHovered ? 'ring-2 ring-blue-500 ring-inset bg-blue-500/5' : ''}`} />
      
      {/* Edit Button */}
      {isHovered && (
        <button
          onClick={() => { setActiveSection(id); setPanelOpen(true); }}
          className="absolute top-2 right-2 px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg shadow-lg hover:bg-blue-600 transition-colors pointer-events-auto flex items-center gap-2 z-10"
        >
          <Settings className="w-4 h-4" />
          Upraviť
        </button>
      )}
    </div>
  );
}

// ============================================
// SECTION COMPONENTS
// ============================================
function AnnouncementSection({ data }: { data: any }) {
  return (
    <div className="text-white text-center py-2 px-4 text-sm" style={{ backgroundColor: data.backgroundColor }}>
      {data.text}
    </div>
  );
}

function HeaderSection({ data, shopConfig }: { data: any; shopConfig: ShopConfig }) {
  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: shopConfig.primaryColor }}>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">{shopConfig.name}</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {data.menuItems?.map((item: string) => (
            <button key={item} className="text-gray-600 hover:text-gray-900 transition-colors">{item}</button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg"><Search className="w-5 h-5 text-gray-600" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-lg"><Heart className="w-5 h-5 text-gray-600" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <ShoppingCart className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-5 h-5 text-xs text-white rounded-full flex items-center justify-center" style={{ backgroundColor: shopConfig.primaryColor }}>0</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function HeroSection({ data, shopConfig }: { data: any; shopConfig: ShopConfig }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = data.slides || [];

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const slide = slides[activeSlide];

  return (
    <section className="relative text-white py-20 px-4 transition-colors duration-500" style={{ backgroundColor: slide.backgroundColor || shopConfig.primaryColor }}>
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h1>
        <p className="text-xl opacity-90 mb-8">{slide.subtitle}</p>
        <div className="flex justify-center gap-4">
          <button className="px-8 py-3 bg-white rounded-lg font-semibold hover:bg-gray-100 transition-colors" style={{ color: slide.backgroundColor || shopConfig.primaryColor }}>
            {slide.buttonText}
          </button>
          {slide.secondaryButtonText && (
            <button className="px-8 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
              {slide.secondaryButtonText}
            </button>
          )}
        </div>
      </div>

      {/* Slide Navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === activeSlide ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function FeaturesSection({ data, shopConfig }: { data: any; shopConfig: ShopConfig }) {
  const iconMap: Record<string, any> = {
    truck: Truck,
    shield: Shield,
    refresh: RefreshCw,
    headphones: Headphones
  };

  return (
    <section className="py-8 bg-gray-50 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {data.items?.map((item: any, idx: number) => {
            const Icon = iconMap[item.icon] || Package;
            return (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${shopConfig.primaryColor}15` }}>
                  <Icon className="w-5 h-5" style={{ color: shopConfig.primaryColor }} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductsSection({ data, shopConfig }: { data: any; shopConfig: ShopConfig }) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{data.title}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.products?.map((product: any) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                  <span className="text-sm text-gray-400">({product.reviews})</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold" style={{ color: shopConfig.primaryColor }}>€{product.price}</span>
                  {product.oldPrice && <span className="text-sm text-gray-400 line-through">€{product.oldPrice}</span>}
                </div>
                <button className="w-full py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity" style={{ backgroundColor: shopConfig.primaryColor }}>
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

function NewsletterSection({ data, shopConfig }: { data: any; shopConfig: ShopConfig }) {
  return (
    <section className="py-12 bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">{data.title}</h2>
        <p className="text-gray-400 mb-6">{data.subtitle}</p>
        <div className="flex gap-2 max-w-md mx-auto">
          <input type="email" placeholder="Váš email" className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white" />
          <button className="px-6 py-3 rounded-lg font-semibold text-white" style={{ backgroundColor: shopConfig.primaryColor }}>
            {data.buttonText}
          </button>
        </div>
      </div>
    </section>
  );
}

function FooterSection({ data, shopConfig }: { data: any; shopConfig: ShopConfig }) {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: shopConfig.primaryColor }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl">{shopConfig.name}</span>
          </div>
          <p className="text-gray-400 text-sm">{data.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// MAIN STORE PAGE COMPONENT
// ============================================
export default function StorePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params.slug as string) || 'demo';
  const editMode = searchParams.get('edit') === 'true';

  // State
  const [isEditorMode, setEditorMode] = useState(editMode);
  const [isPanelOpen, setPanelOpen] = useState(editMode);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>(defaultSections);
  const [originalSections, setOriginalSections] = useState<Section[]>(defaultSections);
  const [shopConfig, setShopConfig] = useState<ShopConfig>({ ...defaultShopConfig, slug });
  const [originalConfig, setOriginalConfig] = useState<ShopConfig>({ ...defaultShopConfig, slug });
  const [hasChanges, setHasChanges] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Handlers
  const updateSection = useCallback((id: string, data: Partial<Section>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    setHasChanges(true);
  }, []);

  const updateSectionData = useCallback((id: string, data: Record<string, any>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, data: { ...s.data, ...data } } : s));
    setHasChanges(true);
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
    setHasChanges(true);
  }, []);

  const moveSection = useCallback((id: string, direction: 'up' | 'down') => {
    setSections(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex(s => s.id === id);
      if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === sorted.length - 1)) return prev;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      [sorted[idx], sorted[newIdx]] = [sorted[newIdx], sorted[idx]];
      return sorted.map((s, i) => ({ ...s, order: i }));
    });
    setHasChanges(true);
  }, []);

  const updateShopConfig = useCallback((config: Partial<ShopConfig>) => {
    setShopConfig(prev => ({ ...prev, ...config }));
    setHasChanges(true);
  }, []);

  const saveChanges = useCallback(() => {
    setOriginalSections([...sections]);
    setOriginalConfig({ ...shopConfig });
    setHasChanges(false);
    console.log('Saved:', { sections, shopConfig });
  }, [sections, shopConfig]);

  const discardChanges = useCallback(() => {
    setSections([...originalSections]);
    setShopConfig({ ...originalConfig });
    setHasChanges(false);
  }, [originalSections, originalConfig]);

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  const editorContext: EditorContextType = {
    isEditorMode,
    setEditorMode,
    isPanelOpen,
    setPanelOpen,
    activeSection,
    setActiveSection,
    sections,
    updateSection,
    updateSectionData,
    toggleVisibility,
    moveSection,
    shopConfig,
    updateShopConfig,
    hasChanges,
    saveChanges,
    discardChanges,
    hoveredSection,
    setHoveredSection
  };

  return (
    <EditorContext.Provider value={editorContext}>
      <div className="min-h-screen bg-white" style={{ fontFamily: shopConfig.fontFamily }}>
        {/* Editor Toggle Button */}
        <button
          onClick={() => { setEditorMode(!isEditorMode); setPanelOpen(!isEditorMode); }}
          className={`fixed top-4 z-[60] px-4 py-2 rounded-lg font-medium shadow-lg flex items-center gap-2 transition-all ${
            isEditorMode 
              ? 'left-[396px] bg-gray-800 text-white hover:bg-gray-700' 
              : 'left-4 bg-white text-gray-800 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {isEditorMode ? (
            <>
              <Eye className="w-4 h-4" />
              Režim náhľadu
            </>
          ) : (
            <>
              <PanelLeftOpen className="w-4 h-4" />
              Otvoriť editor
            </>
          )}
        </button>

        {/* View Store Link */}
        {isEditorMode && (
          <a
            href={`/store/${slug}`}
            target="_blank"
            className="fixed top-4 right-4 z-[60] px-4 py-2 bg-white text-gray-800 border border-gray-200 rounded-lg font-medium shadow-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <Eye className="w-4 h-4" />
            Zobraziť obchod
          </a>
        )}

        {/* Editor Panel */}
        {isEditorMode && <EditorPanel />}

        {/* Page Content */}
        <div className={`transition-all duration-300 ${isEditorMode && isPanelOpen ? 'ml-[380px]' : ''}`}>
          {sortedSections.filter(s => s.visible).map((section) => {
            const content = (() => {
              switch (section.type) {
                case 'announcement': return <AnnouncementSection data={section.data} />;
                case 'header': return <HeaderSection data={section.data} shopConfig={shopConfig} />;
                case 'hero': return <HeroSection data={section.data} shopConfig={shopConfig} />;
                case 'features': return <FeaturesSection data={section.data} shopConfig={shopConfig} />;
                case 'products': return <ProductsSection data={section.data} shopConfig={shopConfig} />;
                case 'newsletter': return <NewsletterSection data={section.data} shopConfig={shopConfig} />;
                case 'footer': return <FooterSection data={section.data} shopConfig={shopConfig} />;
                default: return null;
              }
            })();

            return (
              <EditableSection key={section.id} id={section.id}>
                {content}
              </EditableSection>
            );
          })}
        </div>
      </div>
    </EditorContext.Provider>
  );
}
