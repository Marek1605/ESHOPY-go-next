'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useEditor, SECTION_INFO, SectionType, SECTION_CATEGORIES, shopTemplates, ShopSection } from '@/lib/store';
import { 
  Eye, EyeOff, ChevronUp, ChevronDown, Settings, Palette, Layout, Save, Undo, Redo, 
  Monitor, Tablet, Smartphone, GripVertical, Plus, Trash2, Copy, X, Check, 
  ExternalLink, ChevronRight, ChevronLeft, Sparkles, Search, MoreHorizontal,
  Layers, Image, Type, Globe, Code, Keyboard, Download, Upload, RefreshCw,
  ZoomIn, ZoomOut, Maximize2, Play, Pause, HelpCircle, Moon, Sun, Bell, 
  FileText, ShoppingBag, Home, PanelLeft, PanelRight, Move, Grip, AlertCircle
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface SectionItemProps {
  section: ShopSection;
  index: number;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onExpand: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isDragging: boolean;
}

function SectionItem({
  section, index, isSelected, isExpanded, onSelect, onToggle, onExpand,
  onMoveUp, onMoveDown, onDuplicate, onRemove, canMoveUp, canMoveDown,
  onDragStart, onDragOver, onDrop, isDragging
}: SectionItemProps) {
  const info = SECTION_INFO[section.type];
  
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`
        group rounded-xl border transition-all duration-200
        ${isSelected ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20' : 'border-gray-700 hover:border-gray-600'}
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${!section.enabled ? 'opacity-60' : ''}
      `}
    >
      {/* Main Row */}
      <div
        className="flex items-center gap-2 p-3 cursor-pointer"
        onClick={onSelect}
      >
        <div className="cursor-grab hover:bg-gray-600/50 p-1 rounded" onClick={(e) => e.stopPropagation()}>
          <GripVertical className="w-4 h-4 text-gray-500" />
        </div>
        
        <span className="text-xl">{info?.icon || '📦'}</span>
        
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm truncate ${!section.enabled ? 'text-gray-500' : ''}`}>
            {info?.name || section.type}
          </p>
          {section.blocks && section.blocks.length > 0 && (
            <p className="text-xs text-gray-500">{section.blocks.length} položiek</p>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            disabled={!canMoveUp}
            className="p-1 hover:bg-gray-600 rounded disabled:opacity-30 disabled:cursor-not-allowed"
            title="Posunúť hore"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            disabled={!canMoveDown}
            className="p-1 hover:bg-gray-600 rounded disabled:opacity-30 disabled:cursor-not-allowed"
            title="Posunúť dole"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={`p-1.5 rounded transition-colors ${section.enabled ? 'text-green-400 hover:bg-green-500/20' : 'text-gray-500 hover:bg-gray-600'}`}
          title={section.enabled ? 'Skryť sekciu' : 'Zobraziť sekciu'}
        >
          {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onExpand(); }}
          className="p-1.5 hover:bg-gray-600 rounded"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Expanded Settings */}
      {isExpanded && (
        <div className="border-t border-gray-700 p-4 bg-gray-800/50">
          <SectionSettingsPanel section={section} />
          
          {/* Actions */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={onDuplicate}
              className="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" /> Duplikovať
            </button>
            <button
              onClick={onRemove}
              className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Odstrániť
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION SETTINGS PANEL
// ═══════════════════════════════════════════════════════════════════════════════

function SectionSettingsPanel({ section }: { section: ShopSection }) {
  const editor = useEditor();
  
  const updateSetting = (key: string, value: any) => {
    editor.updateSectionSettings(section.id, { [key]: value });
  };

  // Common fields based on section type
  const renderFields = () => {
    switch (section.type) {
      case 'hero-slider':
      case 'hero-banner':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Výška (px)</label>
              <input
                type="number"
                value={section.settings.height || 600}
                onChange={(e) => updateSetting('height', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`${section.id}-autoplay`}
                checked={section.settings.autoplay !== false}
                onChange={(e) => updateSetting('autoplay', e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500/50"
              />
              <label htmlFor={`${section.id}-autoplay`} className="text-sm">Automatické prehrávanie</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`${section.id}-overlay`}
                checked={section.settings.overlay !== false}
                onChange={(e) => updateSetting('overlay', e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500/50"
              />
              <label htmlFor={`${section.id}-overlay`} className="text-sm">Zobraziť overlay</label>
            </div>
            {section.settings.overlay && (
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Priehľadnosť overlay (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={section.settings.overlayOpacity || 30}
                  onChange={(e) => updateSetting('overlayOpacity', parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{section.settings.overlayOpacity || 30}%</span>
              </div>
            )}
          </div>
        );

      case 'featured-products':
      case 'product-grid':
      case 'product-carousel':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Názov sekcie</label>
              <input
                type="text"
                value={section.settings.title || ''}
                onChange={(e) => updateSetting('title', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Napr. Najpredávanejšie"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Podtitul</label>
              <input
                type="text"
                value={section.settings.subtitle || ''}
                onChange={(e) => updateSetting('subtitle', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Počet stĺpcov</label>
                <select
                  value={section.settings.columns || 4}
                  onChange={(e) => updateSetting('columns', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value={2}>2 stĺpce</option>
                  <option value={3}>3 stĺpce</option>
                  <option value={4}>4 stĺpce</option>
                  <option value={5}>5 stĺpcov</option>
                  <option value={6}>6 stĺpcov</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Max produktov</label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={section.settings.limit || 8}
                  onChange={(e) => updateSetting('limit', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={section.settings.showRating !== false}
                  onChange={(e) => updateSetting('showRating', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                />
                <span className="text-sm">Zobraziť hodnotenie</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={section.settings.showQuickAdd !== false}
                  onChange={(e) => updateSetting('showQuickAdd', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                />
                <span className="text-sm">Tlačidlo "Do košíka"</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={section.settings.showBadges !== false}
                  onChange={(e) => updateSetting('showBadges', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                />
                <span className="text-sm">Zobraziť odznaky (SALE, NEW...)</span>
              </label>
            </div>
          </div>
        );

      case 'promo-banner':
      case 'countdown-timer':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Nadpis</label>
              <input
                type="text"
                value={section.settings.title || ''}
                onChange={(e) => updateSetting('title', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Podnadpis</label>
              <input
                type="text"
                value={section.settings.subtitle || ''}
                onChange={(e) => updateSetting('subtitle', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Text tlačidla</label>
              <input
                type="text"
                value={section.settings.buttonText || ''}
                onChange={(e) => updateSetting('buttonText', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Farba pozadia</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={section.settings.backgroundColor || '#7c3aed'}
                  onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={section.settings.backgroundColor || '#7c3aed'}
                  onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
          </div>
        );

      case 'newsletter':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Nadpis</label>
              <input
                type="text"
                value={section.settings.title || ''}
                onChange={(e) => updateSetting('title', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Podnadpis</label>
              <input
                type="text"
                value={section.settings.subtitle || ''}
                onChange={(e) => updateSetting('subtitle', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Text tlačidla</label>
              <input
                type="text"
                value={section.settings.buttonText || 'Prihlásiť sa'}
                onChange={(e) => updateSetting('buttonText', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`${section.id}-privacy`}
                checked={section.settings.showPrivacyNote !== false}
                onChange={(e) => updateSetting('showPrivacyNote', e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500"
              />
              <label htmlFor={`${section.id}-privacy`} className="text-sm">Zobraziť poznámku o GDPR</label>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-6 text-gray-500">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Rozšírené nastavenia pre túto sekciu</p>
            <p className="text-xs mt-1">Prídu v ďalšej verzii</p>
          </div>
        );
    }
  };

  return <div>{renderFields()}</div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// THEME EDITOR PANEL
// ═══════════════════════════════════════════════════════════════════════════════

function ThemeEditorPanel() {
  const editor = useEditor();
  const { theme } = editor.shopSettings;

  const updateTheme = (key: string, value: any) => {
    editor.updateTheme({ [key]: value });
  };

  const colorFields = [
    { key: 'primaryColor', label: 'Primárna farba', hint: 'Hlavná farba tlačidiel a odkazov' },
    { key: 'secondaryColor', label: 'Sekundárna farba', hint: 'Doplnková farba' },
    { key: 'accentColor', label: 'Akcentová farba', hint: 'Zvýraznenia a upozornenia' },
    { key: 'backgroundColor', label: 'Pozadie', hint: 'Farba pozadia stránky' },
    { key: 'textColor', label: 'Text', hint: 'Hlavná farba textu' },
  ];

  const presetThemes = [
    { name: 'Modrá', primary: '#2563eb', secondary: '#10b981' },
    { name: 'Zelená', primary: '#059669', secondary: '#0891b2' },
    { name: 'Fialová', primary: '#7c3aed', secondary: '#ec4899' },
    { name: 'Oranžová', primary: '#ea580c', secondary: '#eab308' },
    { name: 'Červená', primary: '#dc2626', secondary: '#f97316' },
    { name: 'Ružová', primary: '#ec4899', secondary: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Presets */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-400" /> Rýchle témy
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {presetThemes.map((preset) => (
            <button
              key={preset.name}
              onClick={() => editor.updateTheme({ primaryColor: preset.primary, secondaryColor: preset.secondary })}
              className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-left"
            >
              <div className="flex gap-1 mb-1.5">
                <div className="w-5 h-5 rounded" style={{ backgroundColor: preset.primary }} />
                <div className="w-5 h-5 rounded" style={{ backgroundColor: preset.secondary }} />
              </div>
              <span className="text-xs text-gray-400">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Settings */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Farby</h3>
        <div className="space-y-3">
          {colorFields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs text-gray-400 mb-1.5">{field.label}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={(theme as any)[field.key] || '#000000'}
                  onChange={(e) => updateTheme(field.key, e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={(theme as any)[field.key] || ''}
                  onChange={(e) => updateTheme(field.key, e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Type className="w-4 h-4 text-blue-400" /> Typografia
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Font</label>
            <select
              value={theme.fontFamily}
              onChange={(e) => updateTheme('fontFamily', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="Inter, system-ui, sans-serif">Inter</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Open Sans, sans-serif">Open Sans</option>
              <option value="Poppins, sans-serif">Poppins</option>
              <option value="Montserrat, sans-serif">Montserrat</option>
              <option value="Playfair Display, serif">Playfair Display</option>
              <option value="Lora, serif">Lora</option>
            </select>
          </div>
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Zaoblenie rohov</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: 0, label: 'Žiadne', icon: '▢' },
            { value: 4, label: 'Malé', icon: '▢' },
            { value: 8, label: 'Stredné', icon: '▢' },
            { value: 16, label: 'Veľké', icon: '▢' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => updateTheme('borderRadiusMedium', option.value)}
              className={`p-2 rounded-lg text-center transition-colors ${
                theme.borderRadiusMedium === option.value 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-700/50 hover:bg-gray-700 text-gray-400'
              }`}
            >
              <div className="text-lg mb-1" style={{ borderRadius: option.value }}>▢</div>
              <span className="text-xs">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Button Style */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Štýl tlačidiel</h3>
        <div className="grid grid-cols-2 gap-2">
          {(['solid', 'outline', 'ghost', 'soft'] as const).map((style) => (
            <button
              key={style}
              onClick={() => updateTheme('buttonStyle', style)}
              className={`p-3 rounded-lg text-sm transition-colors ${
                theme.buttonStyle === style 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-700/50 hover:bg-gray-700'
              }`}
            >
              {style === 'solid' && 'Plné'}
              {style === 'outline' && 'Obrys'}
              {style === 'ghost' && 'Priehľadné'}
              {style === 'soft' && 'Jemné'}
            </button>
          ))}
        </div>
      </div>

      {/* Animations */}
      <div>
        <label className="flex items-center justify-between">
          <span className="text-sm font-medium">Animácie</span>
          <button
            onClick={() => updateTheme('animationsEnabled', !theme.animationsEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              theme.animationsEnabled ? 'bg-blue-500' : 'bg-gray-600'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
              theme.animationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </label>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADD SECTION MODAL
// ═══════════════════════════════════════════════════════════════════════════════

function AddSectionModal({ onClose }: { onClose: () => void }) {
  const editor = useEditor();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Object.entries(SECTION_CATEGORIES).map(([key, types]) => ({
    key,
    label: {
      hero: '🖼️ Hero sekcie',
      products: '🛍️ Produkty',
      categories: '📦 Kategórie',
      marketing: '📣 Marketing',
      content: '📝 Obsah',
      'social-proof': '⭐ Social proof',
      features: '✨ Vlastnosti',
      contact: '📧 Kontakt',
      layout: '📐 Layout',
      structure: '🏗️ Štruktúra',
    }[key] || key,
    types,
  }));

  const filteredSections = Object.entries(SECTION_INFO)
    .filter(([type, info]) => {
      if (search) {
        return info.name.toLowerCase().includes(search.toLowerCase()) ||
               info.description.toLowerCase().includes(search.toLowerCase());
      }
      if (selectedCategory) {
        return (SECTION_CATEGORIES as any)[selectedCategory]?.includes(type);
      }
      return true;
    });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pridať sekciu</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSelectedCategory(null); }}
              placeholder="Hľadať sekcie..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* Categories */}
        {!search && (
          <div className="p-4 border-b border-gray-700 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                !selectedCategory ? 'bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Všetky
            </button>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat.key ? 'bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Sections Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredSections.map(([type, info]) => (
              <button
                key={type}
                onClick={() => {
                  editor.addSection(type as SectionType);
                  onClose();
                }}
                className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-xl text-left transition-all hover:scale-[1.02] border border-transparent hover:border-gray-600"
              >
                <span className="text-2xl mb-2 block">{info.icon}</span>
                <h3 className="font-medium text-sm mb-1">{info.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{info.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATES MODAL
// ═══════════════════════════════════════════════════════════════════════════════

function TemplatesModal({ onClose }: { onClose: () => void }) {
  const editor = useEditor();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['modern', 'minimal', 'bold', 'elegant', 'playful', 'professional', 'dark'];
  const filteredTemplates = selectedCategory 
    ? shopTemplates.filter(t => t.category === selectedCategory)
    : shopTemplates;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Vyberte šablónu</h2>
            <p className="text-sm text-gray-400">Začnite s profesionálnym dizajnom</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-700 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${!selectedCategory ? 'bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Všetky
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap capitalize ${selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-gray-700/50 rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex gap-1 justify-center mb-2">
                      <div className="w-8 h-8 rounded" style={{ backgroundColor: template.theme.primaryColor }} />
                      <div className="w-8 h-8 rounded" style={{ backgroundColor: template.theme.secondaryColor }} />
                    </div>
                    <Sparkles className="w-8 h-8 text-gray-500 mx-auto" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{template.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.features.slice(0, 3).map((f, i) => (
                      <span key={i} className="text-xs bg-gray-600 px-2 py-0.5 rounded">{f}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      editor.applyTemplate(template.id);
                      onClose();
                    }}
                    className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    Použiť šablónu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SHOP BUILDER PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function ShopBuilderPage() {
  const editor = useEditor();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Enable editing on mount
  useEffect(() => {
    editor.setEditing(true);
    return () => editor.setEditing(false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        editor.saveChanges();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          editor.redo();
        } else {
          editor.undo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const sortedSections = editor.getSortedSections();

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    e.dataTransfer.setData('sectionId', sectionId);
    editor.setDraggedSection(sectionId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sectionId = e.dataTransfer.getData('sectionId');
    const sourceIndex = sortedSections.findIndex(s => s.id === sectionId);
    if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
      editor.reorderSections(sourceIndex, targetIndex);
    }
    editor.setDraggedSection(null);
  };

  const previewWidth = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  }[editor.previewDevice];

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 ${editor.sidebarOpen ? '' : '-ml-80'}`}
        style={{ width: editor.sidebarWidth }}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-bold">Shop Builder</span>
            </Link>
            <button onClick={() => editor.setSidebarOpen(false)} className="p-1.5 hover:bg-gray-700 rounded-lg lg:hidden">
              <PanelLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-700/50 p-1 rounded-lg">
            {[
              { id: 'sections', icon: Layers, label: 'Sekcie' },
              { id: 'theme', icon: Palette, label: 'Vzhľad' },
              { id: 'settings', icon: Settings, label: 'Nastavenia' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => editor.setSidebarTab(tab.id as any)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  editor.sidebarTab === tab.id ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {editor.sidebarTab === 'sections' && (
            <div className="space-y-2">
              {sortedSections.map((section, index) => (
                <SectionItem
                  key={section.id}
                  section={section}
                  index={index}
                  isSelected={editor.selectedSection === section.id}
                  isExpanded={expandedSection === section.id}
                  onSelect={() => editor.selectSection(section.id)}
                  onToggle={() => editor.toggleSection(section.id)}
                  onExpand={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                  onMoveUp={() => editor.moveSection(section.id, 'up')}
                  onMoveDown={() => editor.moveSection(section.id, 'down')}
                  onDuplicate={() => editor.duplicateSection(section.id)}
                  onRemove={() => editor.removeSection(section.id)}
                  canMoveUp={index > 0}
                  canMoveDown={index < sortedSections.length - 1}
                  onDragStart={(e) => handleDragStart(e, section.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  isDragging={editor.draggedSection === section.id}
                />
              ))}

              {/* Add Section Button */}
              <button
                onClick={() => editor.setShowAddSectionModal(true)}
                className="w-full py-4 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> Pridať sekciu
              </button>
            </div>
          )}

          {editor.sidebarTab === 'theme' && <ThemeEditorPanel />}

          {editor.sidebarTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Názov obchodu</label>
                <input
                  type="text"
                  value={editor.shopSettings.name}
                  onChange={(e) => editor.updateShopSettings({ name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Tagline</label>
                <input
                  type="text"
                  value={editor.shopSettings.tagline}
                  onChange={(e) => editor.updateShopSettings({ tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={editor.shopSettings.email}
                  onChange={(e) => editor.updateShopSettings({ email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Telefón</label>
                <input
                  type="tel"
                  value={editor.shopSettings.phone}
                  onChange={(e) => editor.updateShopSettings({ phone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Doprava zadarmo od (€)</label>
                <input
                  type="number"
                  value={editor.shopSettings.freeShippingThreshold}
                  onChange={(e) => editor.updateShopSettings({ freeShippingThreshold: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="pt-4 border-t border-gray-700">
                <button
                  onClick={() => editor.setShowTemplatesModal(true)}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" /> Zmeniť šablónu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          {editor.hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-yellow-400 text-xs mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>Neuložené zmeny</span>
            </div>
          )}
          <button
            onClick={() => editor.saveChanges()}
            disabled={!editor.hasUnsavedChanges}
            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              editor.hasUnsavedChanges
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-5 h-5" />
            {editor.hasUnsavedChanges ? 'Uložiť zmeny' : 'Všetko uložené'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {!editor.sidebarOpen && (
              <button onClick={() => editor.setSidebarOpen(true)} className="p-2 hover:bg-gray-700 rounded-lg">
                <PanelRight className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => editor.undo()}
              disabled={!editor.canUndo()}
              className="p-2 hover:bg-gray-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
              title="Späť (Ctrl+Z)"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              onClick={() => editor.redo()}
              disabled={!editor.canRedo()}
              className="p-2 hover:bg-gray-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
              title="Znova (Ctrl+Shift+Z)"
            >
              <Redo className="w-5 h-5" />
            </button>
          </div>

          {/* Device Preview */}
          <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
            {[
              { id: 'desktop', icon: Monitor, label: 'Desktop' },
              { id: 'tablet', icon: Tablet, label: 'Tablet' },
              { id: 'mobile', icon: Smartphone, label: 'Mobile' },
            ].map((device) => (
              <button
                key={device.id}
                onClick={() => editor.setPreviewDevice(device.id as any)}
                className={`p-2 rounded-md transition-colors ${
                  editor.previewDevice === device.id ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
                title={device.label}
              >
                <device.icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/store/${editor.shopSettings.slug || 'demo'}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Zobraziť obchod
            </a>
          </div>
        </div>

        {/* Preview Frame */}
        <div className="flex-1 bg-gray-950 p-4 md:p-8 overflow-auto flex justify-center">
          <div
            className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
            style={{ 
              width: previewWidth, 
              maxWidth: '100%',
              minHeight: '600px',
            }}
          >
            <iframe
              ref={iframeRef}
              src={`/store/${editor.shopSettings.slug || 'demo'}?edit=preview`}
              className="w-full h-full"
              style={{ minHeight: '800px', border: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {editor.showAddSectionModal && <AddSectionModal onClose={() => editor.setShowAddSectionModal(false)} />}
      {editor.showTemplatesModal && <TemplatesModal onClose={() => editor.setShowTemplatesModal(false)} />}
    </div>
  );
}
