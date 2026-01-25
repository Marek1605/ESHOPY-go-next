'use client';
import { useState } from 'react';
import { Check, Eye, Palette, ShoppingBag, Zap, Star, Layout, Monitor, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const templates = [
    { id: 'modern', name: 'Modern', description: 'Čistý moderný dizajn', category: 'Populárne', features: ['Animácie', 'Dark mode', 'Mega menu'] },
    { id: 'minimal', name: 'Minimal', description: 'Minimalistický štýl', category: 'Jednoduché', features: ['Rýchly', 'SEO', 'Mobile-first'] },
    { id: 'fashion', name: 'Fashion', description: 'Pre módne e-shopy', category: 'Móda', features: ['Lookbook', 'Zoom', 'Varianty'] },
    { id: 'electronics', name: 'Tech Store', description: 'Pre elektroniku', category: 'Elektronika', features: ['Porovnanie', 'Filtere', 'Špecifikácie'] },
    { id: 'food', name: 'Gastro', description: 'Pre potraviny', category: 'Jedlo', features: ['Recepty', 'Nutričné hodnoty', 'Rýchly nákup'] },
    { id: 'luxury', name: 'Luxury', description: 'Prémiový vzhľad', category: 'Premium', features: ['Animácie', 'Video', 'Parallax'] },
  ];

  const handleApplyTemplate = () => {
    toast.success(`Šablóna "${templates.find(t => t.id === selectedTemplate)?.name}" bola aplikovaná!`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Šablóny</h1>
          <p className="text-gray-400">Vyberte si vzhľad vášho e-shopu</p>
        </div>
        <button onClick={handleApplyTemplate} className="btn-primary">
          <Check className="w-5 h-5" />Použiť šablónu
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="stat-card p-0 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="font-semibold">Náhľad</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded-lg ${previewMode === 'desktop' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-slate-800 text-gray-400'}`}>
                  <Monitor className="w-5 h-5" />
                </button>
                <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded-lg ${previewMode === 'mobile' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-slate-800 text-gray-400'}`}>
                  <Smartphone className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className={`bg-slate-800 flex items-center justify-center p-8 ${previewMode === 'mobile' ? 'min-h-[500px]' : 'min-h-[400px]'}`}>
              <div className={`bg-white rounded-lg shadow-2xl overflow-hidden ${previewMode === 'mobile' ? 'w-[320px] h-[568px]' : 'w-full max-w-3xl h-[350px]'}`}>
                <div className="h-full flex flex-col">
                  <div className="h-12 bg-slate-100 flex items-center justify-between px-4 border-b">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-blue-500" />
                      <span className="text-slate-800 font-semibold text-sm">Môj Obchod</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <ShoppingBag className="w-5 h-5 text-slate-600" />
                    </div>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 p-4">
                    <div className="text-center mb-4">
                      <div className="text-slate-800 font-bold text-lg">Vitajte v našom obchode</div>
                      <div className="text-slate-500 text-sm">Šablóna: {templates.find(t => t.id === selectedTemplate)?.name}</div>
                    </div>
                    <div className={`grid ${previewMode === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'} gap-3`}>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-lg p-2 shadow">
                          <div className="aspect-square bg-slate-200 rounded mb-2" />
                          <div className="h-2 bg-slate-200 rounded w-3/4 mb-1" />
                          <div className="h-2 bg-blue-200 rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h3 className="font-semibold mb-4">Detaily šablóny</h3>
          <div className="space-y-4">
            <div>
              <div className="text-2xl font-bold">{templates.find(t => t.id === selectedTemplate)?.name}</div>
              <div className="text-gray-400">{templates.find(t => t.id === selectedTemplate)?.description}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-info">{templates.find(t => t.id === selectedTemplate)?.category}</span>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm">4.8</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-2">Funkcie:</div>
              <div className="flex flex-wrap gap-2">
                {templates.find(t => t.id === selectedTemplate)?.features.map((f, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-800 rounded text-xs">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="font-semibold mb-4">Všetky šablóny</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div 
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
          >
            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
              <Layout className="w-12 h-12 text-gray-600" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{template.name}</span>
                {selectedTemplate === template.id && <Check className="w-5 h-5 text-blue-400" />}
              </div>
              <p className="text-gray-400 text-sm">{template.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
