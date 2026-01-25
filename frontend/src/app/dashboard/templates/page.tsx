'use client';
import { useState, useEffect } from 'react';
import { Check, Eye, Palette, ShoppingBag, Star, Layout, Monitor, Smartphone, ExternalLink, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  colors: { primary: string; secondary: string; accent: string };
  preview: string;
}

export default function TemplatesPage() {
  const [selected, setSelected] = useState('modern');
  const [preview, setPreview] = useState<'desktop' | 'mobile'>('desktop');
  const [activeColor, setActiveColor] = useState('blue');

  const templates: Template[] = [
    { 
      id: 'modern', 
      name: 'Modern', 
      description: 'Čistý moderný dizajn s elegantnými animáciami', 
      category: 'Populárne',
      features: ['Animácie', 'Dark/Light mode', 'Mega menu', 'Product zoom'],
      colors: { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#22c55e' },
      preview: 'modern'
    },
    { 
      id: 'minimal', 
      name: 'Minimal', 
      description: 'Minimalistický štýl pre čistý zážitok', 
      category: 'Jednoduché',
      features: ['Ultra rýchly', 'SEO optimalizovaný', 'Mobile-first', 'Clean code'],
      colors: { primary: '#18181b', secondary: '#71717a', accent: '#f59e0b' },
      preview: 'minimal'
    },
    { 
      id: 'fashion', 
      name: 'Fashion', 
      description: 'Elegantný dizajn pre módne e-shopy', 
      category: 'Móda',
      features: ['Lookbook', 'Image zoom', 'Size guide', 'Wishlist'],
      colors: { primary: '#be185d', secondary: '#ec4899', accent: '#fbbf24' },
      preview: 'fashion'
    },
    { 
      id: 'tech', 
      name: 'Tech Store', 
      description: 'Profesionálny vzhľad pre elektroniku', 
      category: 'Elektronika',
      features: ['Porovnanie', 'Špecifikácie', 'Recenzie', 'Video'],
      colors: { primary: '#0ea5e9', secondary: '#06b6d4', accent: '#84cc16' },
      preview: 'tech'
    },
    { 
      id: 'organic', 
      name: 'Organic', 
      description: 'Prírodný vzhľad pre bio produkty', 
      category: 'Jedlo',
      features: ['Recepty', 'Nutričné info', 'Certifikáty', 'Farm story'],
      colors: { primary: '#16a34a', secondary: '#65a30d', accent: '#ea580c' },
      preview: 'organic'
    },
    { 
      id: 'luxury', 
      name: 'Luxury', 
      description: 'Prémiový dizajn pre luxusné produkty', 
      category: 'Premium',
      features: ['Parallax', 'Video hero', 'VIP sekcia', 'Concierge'],
      colors: { primary: '#a16207', secondary: '#ca8a04', accent: '#0f172a' },
      preview: 'luxury'
    },
  ];

  const currentTemplate = templates.find(t => t.id === selected)!;

  const handleApply = () => {
    localStorage.setItem('shopTemplate', selected);
    toast.success(`Šablóna "${currentTemplate.name}" aktivovaná!`);
  };

  const colorOptions = [
    { id: 'blue', primary: '#3b82f6', secondary: '#8b5cf6' },
    { id: 'green', primary: '#22c55e', secondary: '#14b8a6' },
    { id: 'purple', primary: '#a855f7', secondary: '#ec4899' },
    { id: 'orange', primary: '#f97316', secondary: '#eab308' },
    { id: 'red', primary: '#ef4444', secondary: '#f43f5e' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Šablóny</h1>
          <p className="text-gray-400">Vyberte si vzhľad vášho e-shopu</p>
        </div>
        <div className="flex gap-3">
          <a href={`/store/demo?template=${selected}`} target="_blank" className="btn-secondary">
            <Eye className="w-5 h-5" />Náhľad
          </a>
          <button onClick={handleApply} className="btn-primary">
            <Check className="w-5 h-5" />Použiť šablónu
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="stat-card p-0 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="font-semibold">Náhľad: {currentTemplate.name}</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPreview('desktop')} 
                  className={`p-2 rounded-lg ${preview === 'desktop' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-slate-800 text-gray-400'}`}
                >
                  <Monitor className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setPreview('mobile')} 
                  className={`p-2 rounded-lg ${preview === 'mobile' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-slate-800 text-gray-400'}`}
                >
                  <Smartphone className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="bg-slate-800 flex items-center justify-center p-8 min-h-[450px]">
              <div 
                className={`bg-white rounded-xl shadow-2xl overflow-hidden transition-all ${
                  preview === 'mobile' ? 'w-[320px]' : 'w-full max-w-3xl'
                }`}
                style={{ height: preview === 'mobile' ? '568px' : '400px' }}
              >
                {/* Mock Store Preview */}
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div 
                    className="h-14 flex items-center justify-between px-4 border-b"
                    style={{ background: `linear-gradient(135deg, ${currentTemplate.colors.primary}15, ${currentTemplate.colors.secondary}15)` }}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: currentTemplate.colors.primary }}
                      >
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold text-slate-800">Môj Obchod</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5 text-slate-600" />
                    </div>
                  </div>
                  
                  {/* Hero */}
                  <div 
                    className="py-8 px-4 text-center text-white"
                    style={{ background: `linear-gradient(135deg, ${currentTemplate.colors.primary}, ${currentTemplate.colors.secondary})` }}
                  >
                    <h2 className="text-xl font-bold mb-2">Šablóna {currentTemplate.name}</h2>
                    <p className="text-sm opacity-90">{currentTemplate.description}</p>
                  </div>
                  
                  {/* Products */}
                  <div className="flex-1 p-4 bg-slate-50">
                    <div className={`grid ${preview === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'} gap-3`}>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-lg p-2 shadow-sm">
                          <div 
                            className="aspect-square rounded mb-2"
                            style={{ background: `${currentTemplate.colors.primary}20` }}
                          />
                          <div className="h-2 bg-slate-200 rounded w-3/4 mb-1" />
                          <div 
                            className="h-2 rounded w-1/2"
                            style={{ background: `${currentTemplate.colors.primary}40` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="stat-card">
            <h3 className="font-semibold mb-4">Detaily šablóny</h3>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold">{currentTemplate.name}</div>
                <div className="text-gray-400">{currentTemplate.description}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-info">{currentTemplate.category}</span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">4.9</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-2">Funkcie:</div>
                <div className="flex flex-wrap gap-2">
                  {currentTemplate.features.map((f, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-800 rounded-lg text-xs">{f}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <h3 className="font-semibold mb-4">Farby</h3>
            <div className="flex gap-3">
              {colorOptions.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveColor(c.id)}
                  className={`w-10 h-10 rounded-full border-2 ${activeColor === c.id ? 'border-white' : 'border-transparent'}`}
                  style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }}
                />
              ))}
            </div>
          </div>

          <a 
            href={`/store/demo?template=${selected}`}
            target="_blank"
            className="stat-card flex items-center justify-between hover:border-blue-500 transition cursor-pointer"
          >
            <div>
              <div className="font-semibold">Živý náhľad</div>
              <div className="text-sm text-gray-400">Otvorte v novom okne</div>
            </div>
            <ExternalLink className="w-5 h-5 text-blue-400" />
          </a>
        </div>
      </div>

      {/* Template Grid */}
      <h3 className="font-semibold mb-4">Všetky šablóny</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(template => (
          <div 
            key={template.id}
            onClick={() => setSelected(template.id)}
            className={`template-card ${selected === template.id ? 'selected' : ''}`}
          >
            <div 
              className="aspect-video flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${template.colors.primary}30, ${template.colors.secondary}30)` }}
            >
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})` }}
              >
                <Layout className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{template.name}</span>
                {selected === template.id && <Check className="w-5 h-5 text-blue-400" />}
              </div>
              <p className="text-gray-400 text-sm">{template.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-gray-500">{template.category}</span>
                <span className="text-xs text-gray-500">•</span>
                <div className="flex -space-x-1">
                  {Object.values(template.colors).map((c, i) => (
                    <div key={i} className="w-4 h-4 rounded-full border-2 border-slate-800" style={{ background: c }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
