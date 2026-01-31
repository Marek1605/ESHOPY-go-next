'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, Sparkles, Check, Eye, Palette, Layout, 
  Monitor, Smartphone, ChevronLeft, X, Zap
} from 'lucide-react';
import { useEditor, shopTemplates, ShopTemplate } from '@/lib/store';

const categories = [
  { id: 'all', label: 'Všetky' },
  { id: 'modern', label: 'Moderné' },
  { id: 'minimal', label: 'Minimalistické' },
  { id: 'bold', label: 'Výrazné' },
  { id: 'elegant', label: 'Elegantné' },
  { id: 'playful', label: 'Hravé' },
  { id: 'professional', label: 'Profesionálne' },
  { id: 'dark', label: 'Tmavé' },
];

export default function TemplatesPage() {
  const editor = useEditor();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<ShopTemplate | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const filteredTemplates = selectedCategory === 'all'
    ? shopTemplates
    : shopTemplates.filter(t => t.category === selectedCategory);

  const applyTemplate = (template: ShopTemplate) => {
    editor.applyTemplate(template.id);
    setPreviewTemplate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Šablóny</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-purple-500" /> Galéria šablón
              </h1>
              <p className="text-gray-500">Vyberte si profesionálny dizajn pre váš obchod</p>
            </div>
            <Link
              href="/dashboard/shop-builder"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium flex items-center gap-2"
            >
              <Layout className="w-4 h-4" /> Otvoriť Shop Builder
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div 
              key={template.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-lg transition-all"
            >
              {/* Preview Image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                {/* Color Preview */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex gap-2 justify-center mb-4">
                      <div 
                        className="w-12 h-12 rounded-xl shadow-lg"
                        style={{ backgroundColor: template.theme.primaryColor }}
                      />
                      <div 
                        className="w-12 h-12 rounded-xl shadow-lg"
                        style={{ backgroundColor: template.theme.secondaryColor }}
                      />
                    </div>
                    <div 
                      className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center"
                      style={{ backgroundColor: template.theme.primaryColor }}
                    >
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100"
                  >
                    <Eye className="w-4 h-4" /> Náhľad
                  </button>
                  <button
                    onClick={() => applyTemplate(template)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-blue-600"
                  >
                    <Check className="w-4 h-4" /> Použiť
                  </button>
                </div>

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-medium capitalize">
                    {template.category}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{template.description}</p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1.5">
                  {template.features.slice(0, 3).map((feature, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      {feature}
                    </span>
                  ))}
                  {template.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      +{template.features.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current Template Info */}
        <div className="mt-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Zap className="w-6 h-6" /> Aktuálna šablóna
              </h3>
              <p className="text-white/80 mb-4">
                Práve používate vlastnú konfiguráciu. Môžete ju kedykoľvek zmeniť.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/dashboard/shop-builder"
                  className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium flex items-center gap-2"
                >
                  <Palette className="w-4 h-4" /> Upraviť vzhľad
                </Link>
              </div>
            </div>
            <div className="flex gap-2">
              <div 
                className="w-16 h-16 rounded-xl"
                style={{ backgroundColor: editor.shopSettings.theme.primaryColor }}
              />
              <div 
                className="w-16 h-16 rounded-xl"
                style={{ backgroundColor: editor.shopSettings.theme.secondaryColor }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg">{previewTemplate.name}</h2>
                <p className="text-sm text-gray-500">{previewTemplate.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-2 rounded ${previewDevice === 'desktop' ? 'bg-white shadow' : ''}`}
                  >
                    <Monitor className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-2 rounded ${previewDevice === 'mobile' ? 'bg-white shadow' : ''}`}
                  >
                    <Smartphone className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => applyTemplate(previewTemplate)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Použiť šablónu
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Preview Frame */}
            <div className="flex-1 bg-gray-100 p-8 overflow-auto flex justify-center">
              <div
                className="bg-white rounded-xl shadow-xl overflow-hidden transition-all"
                style={{
                  width: previewDevice === 'mobile' ? '375px' : '100%',
                  maxWidth: '100%',
                }}
              >
                {/* Simulated Preview */}
                <div style={{ backgroundColor: previewTemplate.theme.backgroundColor || '#ffffff' }}>
                  {/* Header */}
                  <div 
                    className="h-16 flex items-center justify-between px-6 border-b"
                    style={{ borderColor: previewTemplate.theme.borderColor || '#e5e7eb' }}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-lg"
                        style={{ backgroundColor: previewTemplate.theme.primaryColor }}
                      />
                      <span className="font-bold">Demo Shop</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-sm">Menu</span>
                      <span className="text-sm">Products</span>
                      <span className="text-sm">Contact</span>
                    </div>
                  </div>

                  {/* Hero */}
                  <div 
                    className="h-64 flex items-center justify-center"
                    style={{ backgroundColor: previewTemplate.theme.primaryColor }}
                  >
                    <div className="text-center text-white">
                      <h1 className="text-3xl font-bold mb-2">Welcome to Demo Shop</h1>
                      <p className="opacity-80 mb-4">Discover amazing products</p>
                      <button 
                        className="px-6 py-2 bg-white rounded-lg font-medium"
                        style={{ color: previewTemplate.theme.primaryColor }}
                      >
                        Shop Now
                      </button>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="p-8">
                    <h2 className="text-xl font-bold mb-6 text-center">Featured Products</h2>
                    <div className="grid grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="rounded-xl overflow-hidden border" style={{ borderColor: previewTemplate.theme.borderColor }}>
                          <div className="aspect-square bg-gray-100" />
                          <div className="p-3">
                            <p className="font-medium text-sm">Product {i}</p>
                            <p style={{ color: previewTemplate.theme.primaryColor }}>€29.99</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
