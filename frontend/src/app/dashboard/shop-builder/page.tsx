'use client';

import { useState, useEffect } from 'react';
import { 
  Sparkles, ArrowRight, ArrowLeft, Check, Store, Palette, 
  Type, Layout, Package, Rocket, Wand2, Loader2, Eye,
  ShoppingBag, Shirt, Laptop, Pizza, Gift, Heart, Gem
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
  colors: { primary: string; secondary: string; accent: string };
  fonts: { heading: string; body: string };
  is_premium: boolean;
}

interface ShopConfig {
  name: string;
  slug: string;
  description: string;
  category: string;
  template_id: string | null;
  colors: { primary: string; secondary: string; accent: string };
  fonts: { heading: string; body: string };
  ai_generated: boolean;
}

const BUSINESS_CATEGORIES = [
  { id: 'fashion', name: 'Móda & Oblečenie', icon: Shirt, color: 'pink' },
  { id: 'electronics', name: 'Elektronika', icon: Laptop, color: 'blue' },
  { id: 'food', name: 'Jedlo & Nápoje', icon: Pizza, color: 'orange' },
  { id: 'gifts', name: 'Darčeky', icon: Gift, color: 'purple' },
  { id: 'health', name: 'Zdravie & Krása', icon: Heart, color: 'red' },
  { id: 'luxury', name: 'Luxusné produkty', icon: Gem, color: 'yellow' },
  { id: 'general', name: 'Všeobecný obchod', icon: ShoppingBag, color: 'green' },
];

const FONT_OPTIONS = [
  { heading: 'Inter', body: 'Inter', label: 'Moderný' },
  { heading: 'Playfair Display', body: 'Lato', label: 'Elegantný' },
  { heading: 'Poppins', body: 'Open Sans', label: 'Čistý' },
  { heading: 'Space Grotesk', body: 'Inter', label: 'Technický' },
  { heading: 'Cormorant Garamond', body: 'Montserrat', label: 'Luxusný' },
];

const COLOR_PRESETS = [
  { name: 'Modrá klasika', primary: '#3B82F6', secondary: '#1E40AF', accent: '#F59E0B' },
  { name: 'Zelená príroda', primary: '#10B981', secondary: '#065F46', accent: '#FBBF24' },
  { name: 'Fialová elegancia', primary: '#8B5CF6', secondary: '#5B21B6', accent: '#EC4899' },
  { name: 'Červená energia', primary: '#EF4444', secondary: '#991B1B', accent: '#F59E0B' },
  { name: 'Čierna minimal', primary: '#1F2937', secondary: '#111827', accent: '#6366F1' },
  { name: 'Ružová jemnosť', primary: '#EC4899', secondary: '#9D174D', accent: '#8B5CF6' },
];

export default function ShopBuilderPage() {
  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [showAiChat, setShowAiChat] = useState(false);
  
  const [config, setConfig] = useState<ShopConfig>({
    name: '',
    slug: '',
    description: '',
    category: '',
    template_id: null,
    colors: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#F59E0B' },
    fonts: { heading: 'Inter', body: 'Inter' },
    ai_generated: false,
  });

  const [aiPrompt, setAiPrompt] = useState({
    businessType: '',
    targetAudience: '',
    style: '',
    additionalInfo: '',
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/v1/templates');
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setConfig(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleAIGenerate = async () => {
    setAiLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/ai/shop-builder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          business_type: aiPrompt.businessType || config.category,
          business_name: config.name,
          description: aiPrompt.additionalInfo,
          target_audience: aiPrompt.targetAudience,
          style: aiPrompt.style,
        }),
      });

      const data = await res.json();
      
      if (data.suggestions) {
        setAiSuggestions(data.suggestions);
        // Apply AI suggestions
        setConfig(prev => ({
          ...prev,
          description: data.suggestions.description || prev.description,
          colors: data.suggestions.colors || prev.colors,
          fonts: data.suggestions.fonts || prev.fonts,
          ai_generated: true,
        }));
      }
    } catch (error) {
      console.error('AI generation failed:', error);
    }
    
    setAiLoading(false);
  };

  const handleTemplateSelect = (template: Template) => {
    setConfig(prev => ({
      ...prev,
      template_id: template.id,
      colors: template.colors,
      fonts: template.fonts,
    }));
  };

  const handleCreateShop = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        const shop = await res.json();
        // Redirect to dashboard
        window.location.href = `/dashboard?shop=${shop.id}`;
      }
    } catch (error) {
      console.error('Failed to create shop:', error);
    }
    
    setLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Aký typ obchodu chcete vytvoriť?</h2>
              <p className="text-gray-400">Vyberte kategóriu, ktorá najlepšie popisuje váš biznis</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {BUSINESS_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setConfig(prev => ({ ...prev, category: cat.id }));
                    setStep(2);
                  }}
                  className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                    config.category === cat.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <cat.icon className={`w-8 h-8 mb-3 mx-auto text-${cat.color}-500`} />
                  <div className="font-medium">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Ako sa bude váš obchod volať?</h2>
              <p className="text-gray-400">Názov bude viditeľný pre vašich zákazníkov</p>
            </div>

            <div className="max-w-xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Názov obchodu</label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Môj skvelý obchod"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL adresa</label>
                <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                  <span className="px-4 py-3 bg-gray-700 text-gray-400">eshopbuilder.sk/</span>
                  <input
                    type="text"
                    value={config.slug}
                    onChange={(e) => setConfig(prev => ({ ...prev, slug: e.target.value }))}
                    className="flex-1 px-4 py-3 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Popis (voliteľné)</label>
                <textarea
                  value={config.description}
                  onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Krátky popis vášho obchodu..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* AI Helper */}
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-6 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <h3 className="font-semibold">AI Asistent</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Nechajte AI vygenerovať popis, farby a dizajn na mieru vášmu biznisu
                </p>
                <button
                  onClick={() => setShowAiChat(!showAiChat)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  {showAiChat ? 'Skryť AI' : 'Použiť AI'}
                </button>

                {showAiChat && (
                  <div className="mt-4 space-y-4">
                    <input
                      type="text"
                      placeholder="Popíšte váš biznis..."
                      value={aiPrompt.additionalInfo}
                      onChange={(e) => setAiPrompt(prev => ({ ...prev, additionalInfo: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Kto sú vaši zákazníci? (napr. mladé ženy 25-35)"
                      value={aiPrompt.targetAudience}
                      onChange={(e) => setAiPrompt(prev => ({ ...prev, targetAudience: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                    <select
                      value={aiPrompt.style}
                      onChange={(e) => setAiPrompt(prev => ({ ...prev, style: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                    >
                      <option value="">Vyberte štýl...</option>
                      <option value="modern">Moderný</option>
                      <option value="minimal">Minimalistický</option>
                      <option value="bold">Výrazný</option>
                      <option value="elegant">Elegantný</option>
                      <option value="playful">Hravý</option>
                    </select>
                    <button
                      onClick={handleAIGenerate}
                      disabled={aiLoading}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {aiLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generujem...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Vygenerovať návrh
                        </>
                      )}
                    </button>

                    {aiSuggestions && (
                      <div className="p-4 bg-gray-800 rounded-lg border border-green-500/30">
                        <div className="flex items-center gap-2 text-green-500 mb-2">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">AI návrh aplikovaný!</span>
                        </div>
                        <p className="text-sm text-gray-400">{aiSuggestions.description}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Vyberte si šablónu</h2>
              <p className="text-gray-400">Vyberte si dizajn alebo nechajte AI vytvoriť vlastný</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* AI Generated Option */}
              <button
                onClick={() => {
                  setConfig(prev => ({ ...prev, template_id: null }));
                  setStep(4);
                }}
                className={`relative p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                  !config.template_id && config.ai_generated
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-700 bg-gradient-to-br from-purple-600/20 to-blue-600/20 hover:border-purple-500'
                }`}
              >
                <div className="aspect-video bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-1">AI Generovaný dizajn</h3>
                <p className="text-sm text-gray-400">Nechajte AI vytvoriť unikátny dizajn</p>
              </button>

              {/* Templates */}
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    handleTemplateSelect(template);
                    setStep(4);
                  }}
                  className={`relative p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                    config.template_id === template.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  {template.is_premium && (
                    <span className="absolute top-4 right-4 px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">
                      PREMIUM
                    </span>
                  )}
                  <div 
                    className="aspect-video rounded-lg mb-4"
                    style={{ 
                      background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})` 
                    }}
                  />
                  <h3 className="font-semibold mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-400">{template.description}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Prispôsobte si farby</h2>
              <p className="text-gray-400">Vyberte farebnú paletu pre váš obchod</p>
            </div>

            <div className="max-w-3xl mx-auto">
              {/* Color Presets */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {COLOR_PRESETS.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => setConfig(prev => ({ ...prev, colors: preset }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      config.colors.primary === preset.primary
                        ? 'border-blue-500'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: preset.primary }} />
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: preset.secondary }} />
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: preset.accent }} />
                    </div>
                    <div className="text-sm font-medium">{preset.name}</div>
                  </button>
                ))}
              </div>

              {/* Custom Colors */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="font-semibold mb-4">Vlastné farby</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Primárna</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.colors.primary}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          colors: { ...prev.colors, primary: e.target.value } 
                        }))}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.colors.primary}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          colors: { ...prev.colors, primary: e.target.value } 
                        }))}
                        className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Sekundárna</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.colors.secondary}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          colors: { ...prev.colors, secondary: e.target.value } 
                        }))}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.colors.secondary}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          colors: { ...prev.colors, secondary: e.target.value } 
                        }))}
                        className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Akcentová</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.colors.accent}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          colors: { ...prev.colors, accent: e.target.value } 
                        }))}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.colors.accent}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          colors: { ...prev.colors, accent: e.target.value } 
                        }))}
                        className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-8 p-6 rounded-xl border border-gray-700" style={{ backgroundColor: config.colors.secondary }}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: config.colors.primary }}>
                    {config.name || 'Váš obchod'}
                  </h3>
                  <button 
                    className="px-6 py-2 rounded-lg font-medium"
                    style={{ backgroundColor: config.colors.accent, color: '#fff' }}
                  >
                    Nakupovať
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Vyberte si písma</h2>
              <p className="text-gray-400">Zvoľte typografiu pre váš obchod</p>
            </div>

            <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {FONT_OPTIONS.map((font, index) => (
                <button
                  key={index}
                  onClick={() => setConfig(prev => ({ ...prev, fonts: font }))}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    config.fonts.heading === font.heading
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <span className="text-sm text-gray-400">{font.label}</span>
                  <h3 className="text-2xl font-bold mt-2" style={{ fontFamily: font.heading }}>
                    Nadpis
                  </h3>
                  <p className="text-gray-300 mt-1" style={{ fontFamily: font.body }}>
                    Toto je ukážka textu s týmto písmom.
                  </p>
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Všetko je pripravené! 🎉</h2>
              <p className="text-gray-400">Skontrolujte nastavenia a vytvorte svoj e-shop</p>
            </div>

            <div className="max-w-2xl mx-auto">
              {/* Summary */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400">Názov obchodu</span>
                  <span className="font-medium">{config.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400">URL adresa</span>
                  <span className="font-medium">{config.slug}.eshopbuilder.sk</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400">Kategória</span>
                  <span className="font-medium">
                    {BUSINESS_CATEGORIES.find(c => c.id === config.category)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400">Farby</span>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: config.colors.primary }} />
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: config.colors.secondary }} />
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: config.colors.accent }} />
                  </div>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-400">Písmo</span>
                  <span className="font-medium" style={{ fontFamily: config.fonts.heading }}>
                    {config.fonts.heading}
                  </span>
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateShop}
                disabled={loading || !config.name}
                className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Vytváram e-shop...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    Vytvoriť e-shop
                  </>
                )}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold">EshopBuilder</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Krok {step} z 6</span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-gray-900 px-6 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition-all ${
                  s <= step ? 'bg-blue-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {renderStep()}
      </main>

      {/* Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Späť
          </button>
          
          {step < 6 && (
            <button
              onClick={() => setStep(Math.min(6, step + 1))}
              disabled={(step === 1 && !config.category) || (step === 2 && !config.name)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              Pokračovať
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
