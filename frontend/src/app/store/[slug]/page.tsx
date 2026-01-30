'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingCart, Heart, Search, User, Menu, X, ChevronLeft, ChevronRight, 
  Star, Truck, Shield, RotateCcw, Headphones, Plus, Minus, Check, 
  Facebook, Instagram, Mail, Phone, ChevronDown, ChevronUp, Quote, Sparkles, ArrowRight,
  CreditCard, Smartphone, AlertCircle, Eye, Package,
  Palette, Save, Layers, GripVertical, EyeOff, Trash2, Copy, Settings,
  LayoutDashboard, ShoppingBag, Users, TrendingUp, Bell, LogOut,
  PanelLeftClose, PanelLeftOpen, Undo, Redo, Monitor, Tablet,
  BarChart3, Euro, Zap, Type, Percent, HelpCircle, Globe,
  Target, TrendingDown, Banknote, PieChart, CheckCircle, Info,
  Loader2, Paintbrush, Store, Wand2, Layout, Grid, Box, Share2,
  Youtube, Twitter, MapPin, Home, Image as ImageIcon, Columns
} from 'lucide-react';
import { useCart, useEditor, demoProducts, formatPrice, ShopSection, ShopTheme, SECTION_INFO, SectionType } from '@/lib/store';
import { TEMPLATES, TEMPLATE_CATEGORIES, COLOR_PALETTES, AI_INDUSTRIES, AI_STYLES, AI_MOODS, SECTION_TYPES, SECTION_CATEGORIES, DEMO_STATS, DEMO_NOTIFICATIONS, STYLE_COLORS, STYLE_FONTS, Template } from '@/data/templates';

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Práve teraz';
  if (seconds < 3600) return `Pred ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `Pred ${Math.floor(seconds / 3600)} hod`;
  return `Pred ${Math.floor(seconds / 86400)} dňami`;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// ═══════════════════════════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function Dropdown({ trigger, children, align = 'right', width = 'w-72', isOpen, onToggle }: { 
  trigger: React.ReactNode; children: React.ReactNode; align?: 'left' | 'right'; width?: string; isOpen: boolean; onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) && isOpen) onToggle();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);
  return (
    <div className="relative" ref={ref}>
      <div onClick={onToggle}>{trigger}</div>
      {isOpen && <div className={`absolute top-full mt-2 ${align === 'right' ? 'right-0' : 'left-0'} ${width} z-[300]`}>{children}</div>}
    </div>
  );
}

function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap z-[400] shadow-xl">{content}</div>}
    </div>
  );
}

function Modal({ isOpen, onClose, title, children, size = 'md' }: {
  isOpen: boolean; onClose: () => void; title?: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}) {
  const sizeClasses = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-[90vw] max-h-[90vh]' };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizeClasses[size]} bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden`}>
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-slate-700">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' | 'pro' | 'new' }) {
  const variants = {
    default: 'bg-slate-700 text-gray-300',
    success: 'bg-emerald-500/20 text-emerald-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
    pro: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
    new: 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${variants[variant]}`}>{children}</span>;
}

function Progress({ value, max = 100, color = 'blue' }: { value: number; max?: number; color?: 'blue' | 'green' }) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
      <div className={`h-full ${color === 'green' ? 'bg-emerald-500' : 'bg-blue-500'} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
    </div>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-blue-600' : 'bg-slate-700'}`}>
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder, multiline = false, rows = 3, hint, icon: Icon }: {
  label?: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; multiline?: boolean; rows?: number; hint?: string; icon?: React.ElementType;
}) {
  const baseClasses = `w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 ${Icon ? 'pl-10' : ''}`;
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-semibold text-gray-400">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />}
        {multiline ? (
          <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={`${baseClasses} resize-none`} />
        ) : (
          <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={baseClasses} />
        )}
      </div>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function Select({ label, value, onChange, options }: { label?: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-semibold text-gray-400">{label}</label>}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500">
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}

function ColorPicker({ label, value, onChange }: { label?: string; value: string; onChange: (v: string) => void }) {
  const presets = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-semibold text-gray-400">{label}</label>}
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-10 h-9 rounded-lg cursor-pointer border-2 border-slate-700" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-blue-500" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((c) => <button key={c} onClick={() => onChange(c)} className={`w-6 h-6 rounded-lg border-2 hover:scale-110 transition-transform ${value === c ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: c }} />)}
      </div>
    </div>
  );
}

function Slider({ label, value, onChange, min = 0, max = 100, unit = '' }: { label?: string; value: number; onChange: (v: number) => void; min?: number; max?: number; unit?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label && <label className="text-xs font-semibold text-gray-400">{label}</label>}
        <span className="text-xs font-mono text-gray-500">{value}{unit}</span>
      </div>
      <input type="range" value={value} onChange={(e) => onChange(Number(e.target.value))} min={min} max={max} className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full" />
    </div>
  );
}

function Button({ children, onClick, variant = 'primary', size = 'md', icon: Icon, loading = false, disabled = false, fullWidth = false }: {
  children?: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gradient'; size?: 'sm' | 'md' | 'lg'; icon?: React.ElementType; loading?: boolean; disabled?: boolean; fullWidth?: boolean;
}) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600',
    ghost: 'bg-transparent hover:bg-slate-800 text-gray-400 hover:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    gradient: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:opacity-90 text-white shadow-lg',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm gap-1.5', md: 'px-4 py-2.5 text-sm gap-2', lg: 'px-6 py-3 text-base gap-2' };
  return (
    <button onClick={onClick} disabled={disabled || loading} className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{Icon && <Icon className="w-4 h-4" />}{children}</>}
    </button>
  );
}

function Card({ children, className = '', hover = false, onClick }: { children: React.ReactNode; className?: string; hover?: boolean; onClick?: () => void }) {
  return <div onClick={onClick} className={`bg-slate-800/50 border border-slate-700/50 rounded-2xl ${hover ? 'hover:border-blue-500/50 hover:bg-slate-800 cursor-pointer transition-all' : ''} ${className}`}>{children}</div>;
}

function EmptyState({ icon: Icon, title, description, action }: { icon: React.ElementType; title: string; description: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4"><Icon className="w-8 h-8 text-gray-500" /></div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {action && <Button onClick={action.onClick} variant="gradient" icon={Plus}>{action.label}</Button>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI THEME GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

function AIThemeGenerator({ onGenerate, onClose }: { onGenerate: (theme: Partial<ShopTheme>) => void; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState({ industry: '', style: '', colors: [] as string[], mood: '' });
  const [generatedTheme, setGeneratedTheme] = useState<Partial<ShopTheme> | null>(null);

  const generateTheme = async () => {
    setGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const colors = STYLE_COLORS[prompt.style] || STYLE_COLORS['Moderný'];
    const fonts = STYLE_FONTS[prompt.style] || STYLE_FONTS['Moderný'];
    if (prompt.colors.length > 0) { colors.primary = prompt.colors[0]; colors.secondary = prompt.colors[1] || colors.secondary; }
    const theme: Partial<ShopTheme> = {
      primaryColor: colors.primary, secondaryColor: colors.secondary, accentColor: colors.accent, backgroundColor: colors.background,
      textColor: colors.background === '#ffffff' || colors.background === '#fafafa' ? '#1f2937' : '#ffffff',
      fontFamily: fonts.body, headingFontFamily: fonts.heading,
    };
    setGeneratedTheme(theme);
    setGenerating(false);
    setStep(4);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-slate-700 text-gray-500'}`}>
              {step > s ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 4 && <div className={`w-16 lg:w-24 h-1 ${step > s ? 'bg-blue-600' : 'bg-slate-700'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center mb-8"><h3 className="text-2xl font-bold text-white mb-2">Aké je vaše odvetvie?</h3><p className="text-gray-500">Vyberte odvetvie vášho obchodu</p></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto">
            {AI_INDUSTRIES.map((industry) => (
              <button key={industry} onClick={() => setPrompt({ ...prompt, industry })} className={`p-3 rounded-xl text-left text-sm ${prompt.industry === industry ? 'bg-blue-600 text-white border-2 border-blue-400' : 'bg-slate-800 text-gray-300 border-2 border-slate-700 hover:border-blue-500/50'}`}>{industry}</button>
            ))}
          </div>
          <div className="flex justify-end pt-4"><Button onClick={() => setStep(2)} disabled={!prompt.industry} variant="gradient" icon={ArrowRight}>Pokračovať</Button></div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center mb-8"><h3 className="text-2xl font-bold text-white mb-2">Aký štýl preferujete?</h3></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {AI_STYLES.map((style) => (
              <button key={style} onClick={() => setPrompt({ ...prompt, style })} className={`p-4 rounded-xl text-left ${prompt.style === style ? 'bg-blue-600 text-white border-2 border-blue-400' : 'bg-slate-800 text-gray-300 border-2 border-slate-700 hover:border-blue-500/50'}`}>{style}</button>
            ))}
          </div>
          <div className="flex justify-between pt-4">
            <Button onClick={() => setStep(1)} variant="ghost" icon={ChevronLeft}>Späť</Button>
            <Button onClick={() => setStep(3)} disabled={!prompt.style} variant="gradient" icon={ArrowRight}>Pokračovať</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center mb-8"><h3 className="text-2xl font-bold text-white mb-2">Farebná paleta</h3></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {COLOR_PALETTES.map((palette) => (
              <button key={palette.name} onClick={() => setPrompt({ ...prompt, colors: palette.colors })} className={`p-3 rounded-xl ${JSON.stringify(prompt.colors) === JSON.stringify(palette.colors) ? 'ring-2 ring-blue-500 bg-slate-700' : 'bg-slate-800 hover:bg-slate-700'}`}>
                <div className="flex gap-1 mb-2">{palette.colors.map((c, i) => <div key={i} className="w-6 h-6 rounded-md" style={{ backgroundColor: c }} />)}</div>
                <p className="text-xs text-gray-400">{palette.name}</p>
              </button>
            ))}
          </div>
          <div className="space-y-4 mt-6">
            <h4 className="font-semibold text-white">Nálada</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AI_MOODS.map((mood) => (
                <button key={mood} onClick={() => setPrompt({ ...prompt, mood })} className={`p-3 rounded-xl text-sm ${prompt.mood === mood ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}>{mood}</button>
              ))}
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <Button onClick={() => setStep(2)} variant="ghost" icon={ChevronLeft}>Späť</Button>
            <Button onClick={generateTheme} loading={generating} variant="gradient" icon={Sparkles}>{generating ? 'Generujem...' : 'Vygenerovať'}</Button>
          </div>
        </div>
      )}

      {step === 4 && generatedTheme && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-4"><Sparkles className="w-8 h-8 text-white" /></div>
            <h3 className="text-2xl font-bold text-white mb-2">Téma vygenerovaná!</h3>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-700">
            <div className="p-6" style={{ backgroundColor: generatedTheme.backgroundColor }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: generatedTheme.primaryColor }}><Store className="w-6 h-6 text-white" /></div>
                <span className="font-bold" style={{ color: generatedTheme.textColor, fontFamily: generatedTheme.headingFontFamily }}>Váš Obchod</span>
              </div>
              <div className="p-8 rounded-xl text-center mb-6" style={{ backgroundColor: generatedTheme.primaryColor }}>
                <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: generatedTheme.headingFontFamily }}>Vitajte</h2>
                <button className="px-6 py-2 rounded-lg font-semibold" style={{ backgroundColor: generatedTheme.accentColor, color: '#ffffff' }}>Nakupovať</button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            {[{ k: 'primary', c: generatedTheme.primaryColor }, { k: 'secondary', c: generatedTheme.secondaryColor }, { k: 'accent', c: generatedTheme.accentColor }, { k: 'background', c: generatedTheme.backgroundColor }].map((x) => (
              <div key={x.k} className="text-center"><div className="w-12 h-12 rounded-xl mb-1 border border-slate-600" style={{ backgroundColor: x.c }} /><p className="text-[10px] text-gray-500">{x.k}</p></div>
            ))}
          </div>
          <div className="flex justify-between pt-4">
            <Button onClick={() => setStep(3)} variant="ghost" icon={ChevronLeft}>Upraviť</Button>
            <div className="flex gap-3">
              <Button onClick={onClose} variant="secondary">Zrušiť</Button>
              <Button onClick={() => { onGenerate(generatedTheme); onClose(); }} variant="gradient" icon={Check}>Použiť</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE GALLERY
// ═══════════════════════════════════════════════════════════════════════════════

function TemplateGallery({ onSelect, onClose }: { onSelect: (template: Template) => void; onClose: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');
  const [showOnlyFree, setShowOnlyFree] = useState(false);

  const filteredTemplates = useMemo(() => {
    let result = TEMPLATES;
    if (selectedCategory !== 'all') result = result.filter(t => t.category === selectedCategory);
    if (searchQuery) { const q = searchQuery.toLowerCase(); result = result.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)); }
    if (showOnlyFree) result = result.filter(t => !t.isPro);
    switch (sortBy) {
      case 'popular': result = [...result].sort((a, b) => b.downloads - a.downloads); break;
      case 'newest': result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case 'rating': result = [...result].sort((a, b) => b.rating - a.rating); break;
    }
    return result;
  }, [selectedCategory, searchQuery, sortBy, showOnlyFree]);

  return (
    <div className="flex h-[80vh]">
      <div className="w-56 border-r border-slate-700 p-4 overflow-y-auto">
        <div className="mb-6"><Input value={searchQuery} onChange={setSearchQuery} placeholder="Hľadať..." icon={Search} /></div>
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Kategórie</h4>
          <div className="space-y-1">
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}>
                <span>{cat.name}</span><span className="text-xs opacity-60">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="checkbox" checked={showOnlyFree} onChange={(e) => setShowOnlyFree(e.target.checked)} className="rounded border-slate-600 bg-slate-800 text-blue-600" />Len zadarmo
          </label>
        </div>
        <Select value={sortBy} onChange={(v) => setSortBy(v as typeof sortBy)} options={[{ value: 'popular', label: 'Najpopulárnejšie' }, { value: 'newest', label: 'Najnovšie' }, { value: 'rating', label: 'Najlepšie hodnotené' }]} />
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div><h3 className="text-xl font-bold text-white">Šablóny</h3><p className="text-sm text-gray-500">{filteredTemplates.length} šablón</p></div>
          <Button onClick={onClose} variant="ghost" icon={X}>Zavrieť</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} hover className="overflow-hidden">
              <div className="aspect-video bg-slate-700 relative group flex items-center justify-center">
                <span className="text-6xl">{template.category === 'fashion' ? '👗' : template.category === 'electronics' ? '📱' : template.category === 'food' ? '🍔' : template.category === 'beauty' ? '💄' : '🛒'}</span>
                <div className="absolute top-3 left-3 flex gap-2">
                  {template.isPro && <Badge variant="pro">PRO</Badge>}
                  {template.isNew && <Badge variant="new">NOVÉ</Badge>}
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button onClick={() => onSelect(template)} size="sm" variant="gradient" icon={Check}>Použiť</Button>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-white mb-1">{template.name}</h4>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{template.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-400">{template.rating}</span>
                    <span className="text-xs text-gray-600 ml-2">{formatNumber(template.downloads)}</span>
                  </div>
                  <span className={`text-sm font-semibold ${template.price === 0 ? 'text-emerald-400' : 'text-white'}`}>{template.price === 0 ? 'Zadarmo' : `€${template.price}`}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {filteredTemplates.length === 0 && <EmptyState icon={Search} title="Žiadne šablóny" description="Skúste zmeniť filtre" />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN BAR
// ═══════════════════════════════════════════════════════════════════════════════

function AdminBar({ shopName, user, isEditing, onToggleEdit, onLogout, stats, notifications, onMarkAllRead, onOpenTemplates, onOpenAI }: { 
  shopName: string; user: { name: string; email: string }; isEditing: boolean; onToggleEdit: () => void; onLogout: () => void;
  stats: typeof DEMO_STATS; notifications: typeof DEMO_NOTIFICATIONS; onMarkAllRead: () => void; onOpenTemplates: () => void; onOpenAI: () => void;
}) {
  const [statsOpen, setStatsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const getNotifIcon = (type: string) => ({ order: ShoppingBag, review: Star, stock: Package, success: CheckCircle, warning: AlertCircle, info: Info }[type] || Info);
  const getNotifColor = (type: string) => ({ order: 'bg-blue-500/20 text-blue-400', review: 'bg-yellow-500/20 text-yellow-400', stock: 'bg-orange-500/20 text-orange-400', success: 'bg-emerald-500/20 text-emerald-400', warning: 'bg-red-500/20 text-red-400', info: 'bg-purple-500/20 text-purple-400' }[type] || 'bg-gray-500/20 text-gray-400');

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white z-[200] flex items-center justify-between px-4 shadow-2xl border-b border-slate-700/50">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg"><Store className="w-5 h-5 text-white" /></div>
          <div className="hidden md:block"><p className="font-bold text-sm leading-tight">{shopName}</p><p className="text-[10px] text-gray-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />Online</p></div>
        </Link>
        <div className="hidden lg:block w-px h-8 bg-slate-700" />
        <Dropdown isOpen={statsOpen} onToggle={() => setStatsOpen(!statsOpen)} align="left" width="w-80"
          trigger={
            <button className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700/50">
              <Euro className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-emerald-400">€{stats.revenue.today.toLocaleString('sk-SK')}</span>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${stats.revenue.change >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {stats.revenue.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{stats.revenue.change >= 0 ? '+' : ''}{stats.revenue.change}%
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          }>
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700"><h3 className="font-bold text-white flex items-center gap-2"><BarChart3 className="w-5 h-5 text-emerald-400" />Štatistiky</h3></div>
            <div className="p-4 space-y-4">
              <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20"><p className="text-gray-400 text-sm mb-1">Tržby dnes</p><p className="text-2xl font-bold text-emerald-400">€{stats.revenue.today.toLocaleString('sk-SK')}</p><p className="text-xs text-gray-500">Včera: €{stats.revenue.yesterday.toLocaleString('sk-SK')}</p></div>
              <div className="grid grid-cols-4 gap-2">
                {[{ icon: ShoppingBag, value: stats.orders.today, label: 'Objednávky', color: 'text-blue-400' },{ icon: Clock, value: stats.orders.pending, label: 'Čakajúce', color: 'text-yellow-400' },{ icon: Users, value: stats.visitors.today, label: 'Návštevníci', color: 'text-purple-400' },{ icon: Target, value: `${stats.conversion.rate}%`, label: 'Konverzia', color: 'text-orange-400' }].map((s, i) => (
                  <div key={i} className="bg-slate-700/30 rounded-xl p-2 text-center"><s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} /><p className="text-sm font-bold text-white">{s.value}</p><p className="text-[9px] text-gray-500">{s.label}</p></div>
                ))}
              </div>
            </div>
            <div className="p-3 border-t border-slate-700"><Link href="/dashboard/analytics" className="flex items-center justify-center gap-2 py-2 text-sm text-blue-400 hover:text-blue-300 rounded-lg hover:bg-slate-700/50"><PieChart className="w-4 h-4" />Analytika<ArrowRight className="w-4 h-4" /></Link></div>
          </div>
        </Dropdown>
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative rounded-full h-2 w-2 bg-emerald-500"></span></span>
          <span className="text-emerald-400 text-xs font-semibold">{stats.visitors.online} online</span>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center gap-2">
        <Tooltip content="Šablóny"><button onClick={onOpenTemplates} className="p-2.5 hover:bg-slate-700/50 rounded-xl text-gray-400 hover:text-white"><Layout className="w-5 h-5" /></button></Tooltip>
        <Tooltip content="AI Generátor"><button onClick={onOpenAI} className="p-2.5 hover:bg-slate-700/50 rounded-xl text-purple-400 hover:text-purple-300"><Sparkles className="w-5 h-5" /></button></Tooltip>
        <Tooltip content={isEditing ? "Náhľad" : "Upraviť"}>
          <button onClick={onToggleEdit} className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${isEditing ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-700/80 hover:bg-slate-600/80 text-white border border-slate-600'}`}>
            {isEditing ? <><Eye className="w-4 h-4" /><span className="hidden sm:inline">Náhľad</span></> : <><Paintbrush className="w-4 h-4" /><span className="hidden sm:inline">Upraviť</span></>}
          </button>
        </Tooltip>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Dropdown isOpen={actionsOpen} onToggle={() => setActionsOpen(!actionsOpen)} width="w-64"
          trigger={<button className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700/50"><Zap className="w-4 h-4 text-yellow-400" /><span className="text-xs font-medium text-gray-300">Akcie</span><ChevronDown className="w-3.5 h-3.5 text-gray-500" /></button>}>
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-2">
            {[{ icon: Plus, label: 'Nový produkt', href: '/dashboard/products/new', color: 'bg-emerald-500/20 text-emerald-400' },{ icon: ShoppingBag, label: 'Nová objednávka', href: '/dashboard/orders/new', color: 'bg-blue-500/20 text-blue-400' },{ icon: Percent, label: 'Nová zľava', href: '/dashboard/discounts/new', color: 'bg-purple-500/20 text-purple-400' }].map((a, i) => (
              <Link key={i} href={a.href} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-700/50"><div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center`}><a.icon className="w-5 h-5" /></div><span className="text-sm text-white">{a.label}</span></Link>
            ))}
            <button onClick={() => { setActionsOpen(false); onOpenAI(); }} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-700/50"><div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 flex items-center justify-center"><Sparkles className="w-5 h-5 text-pink-400" /></div><span className="text-sm text-white">AI Generátor</span></button>
          </div>
        </Dropdown>
        <Tooltip content="Dashboard"><Link href="/dashboard" className="p-2.5 hover:bg-slate-700/50 rounded-xl text-gray-400 hover:text-white"><LayoutDashboard className="w-5 h-5" /></Link></Tooltip>
        <Dropdown isOpen={notifOpen} onToggle={() => setNotifOpen(!notifOpen)} width="w-80"
          trigger={<button className="p-2.5 hover:bg-slate-700/50 rounded-xl text-gray-400 hover:text-white relative"><Bell className="w-5 h-5" />{unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white animate-pulse">{unreadCount}</span>}</button>}>
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between"><h3 className="font-bold text-white flex items-center gap-2"><Bell className="w-4 h-4 text-blue-400" />Notifikácie</h3>{unreadCount > 0 && <button onClick={onMarkAllRead} className="text-xs text-blue-400 hover:text-blue-300">Označiť</button>}</div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.map((n) => {
                const Icon = getNotifIcon(n.type);
                return (
                  <div key={n.id} className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer ${!n.read ? 'bg-blue-500/5' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getNotifColor(n.type)}`}><Icon className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white">{n.title}</p><p className="text-xs text-gray-400 mt-0.5">{n.message}</p><p className="text-[10px] text-gray-500 mt-1">{n.time}</p></div>
                      {!n.read && <span className="w-2 h-2 bg-blue-400 rounded-full" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Dropdown>
        <div className="w-px h-8 bg-slate-700 mx-1" />
        <Dropdown isOpen={userOpen} onToggle={() => setUserOpen(!userOpen)} width="w-56"
          trigger={<button className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-slate-700/50 rounded-xl"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">{user.name.charAt(0)}</div><div className="hidden md:block text-left"><p className="text-sm font-medium text-white leading-tight">{user.name}</p><p className="text-[10px] text-gray-500">Admin</p></div><ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden md:block" /></button>}>
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
              <div className="flex items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold">{user.name.charAt(0)}</div><div><p className="font-bold text-white">{user.name}</p><p className="text-xs text-gray-400">{user.email}</p></div></div>
            </div>
            <div className="p-2">
              <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50"><Settings className="w-4 h-4 text-gray-400" /><span className="text-sm text-white">Nastavenia</span></Link>
              <Link href="/dashboard/help" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50"><HelpCircle className="w-4 h-4 text-gray-400" /><span className="text-sm text-white">Pomoc</span></Link>
            </div>
            <div className="p-2 border-t border-slate-700"><button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400"><LogOut className="w-4 h-4" /><span className="text-sm font-medium">Odhlásiť</span></button></div>
          </div>
        </Dropdown>
      </div>
    </div>
  );
}

const Clock = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

// ═══════════════════════════════════════════════════════════════════════════════
// INLINE EDITOR PANEL
// ═══════════════════════════════════════════════════════════════════════════════

function InlineEditorPanel({ isOpen, onToggle, selectedSection, onSelectSection, sections, devicePreview, onDeviceChange, onSave, hasUnsavedChanges, onOpenTemplates, onOpenAI }: {
  isOpen: boolean; onToggle: () => void; selectedSection: ShopSection | null; onSelectSection: (s: ShopSection | null) => void;
  sections: ShopSection[]; devicePreview: 'desktop' | 'tablet' | 'mobile'; onDeviceChange: (d: 'desktop' | 'tablet' | 'mobile') => void;
  onSave: () => Promise<void>; hasUnsavedChanges: boolean; onOpenTemplates: () => void; onOpenAI: () => void;
}) {
  const editor = useEditor();
  const { toggleSection, moveSection, removeSection, duplicateSection, updateSectionSettings, undo, redo, canUndo, canRedo, addSection, shopSettings, updateTheme, updateShopSettings } = editor;
  const [activeTab, setActiveTab] = useState<'sections' | 'theme' | 'settings' | 'seo'>('sections');
  const [sectionTab, setSectionTab] = useState<'content' | 'style'>('content');
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [addSectionCategory, setAddSectionCategory] = useState('all');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [searchSections, setSearchSections] = useState('');

  const handleSave = async () => { setSaving(true); await onSave(); setLastSaved(new Date()); setSaving(false); };
  const handleAddSection = (type: SectionType) => { addSection(type); setAddSectionOpen(false); };
  const filteredAvailableSections = useMemo(() => {
    let result = SECTION_TYPES;
    if (addSectionCategory !== 'all') result = result.filter(s => s.category === addSectionCategory);
    if (searchSections) { const q = searchSections.toLowerCase(); result = result.filter(s => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)); }
    return result;
  }, [addSectionCategory, searchSections]);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[140] lg:hidden" onClick={onToggle} />}
      <div className={`fixed top-14 left-0 h-[calc(100vh-56px)] w-[380px] bg-slate-900 shadow-2xl z-[150] transform transition-all duration-300 flex flex-col border-r border-slate-700/50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center"><Wand2 className="w-5 h-5 text-white" /></div>
            <div><h2 className="font-bold text-white text-sm">Shop Builder</h2><p className="text-[10px] text-gray-500">Vizuálny editor</p></div>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip content="Šablóny"><button onClick={onOpenTemplates} className="p-2 hover:bg-slate-700/50 rounded-lg text-gray-400 hover:text-white"><Layout className="w-4 h-4" /></button></Tooltip>
            <Tooltip content="AI"><button onClick={onOpenAI} className="p-2 hover:bg-slate-700/50 rounded-lg text-purple-400"><Sparkles className="w-4 h-4" /></button></Tooltip>
            <button onClick={onToggle} className="p-2 hover:bg-slate-700/50 rounded-lg text-gray-500 hover:text-white"><PanelLeftClose className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="h-11 flex items-center justify-between px-4 border-b border-slate-700/30 bg-slate-800/30">
          <div className="flex items-center gap-1">
            <Tooltip content="Späť"><button onClick={() => undo()} disabled={!canUndo()} className="p-1.5 hover:bg-slate-700 rounded-lg disabled:opacity-30"><Undo className="w-4 h-4 text-gray-400" /></button></Tooltip>
            <Tooltip content="Znova"><button onClick={() => redo()} disabled={!canRedo()} className="p-1.5 hover:bg-slate-700 rounded-lg disabled:opacity-30"><Redo className="w-4 h-4 text-gray-400" /></button></Tooltip>
          </div>
          <div className="flex items-center gap-0.5 bg-slate-800 rounded-xl p-1">
            {[{ id: 'desktop' as const, icon: Monitor }, { id: 'tablet' as const, icon: Tablet }, { id: 'mobile' as const, icon: Smartphone }].map((d) => (
              <Tooltip key={d.id} content={d.id}><button onClick={() => onDeviceChange(d.id)} className={`p-1.5 rounded-lg transition-all ${devicePreview === d.id ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:text-white'}`}><d.icon className="w-4 h-4" /></button></Tooltip>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700/30">
          {[{ id: 'sections', label: 'Sekcie', icon: Layers }, { id: 'theme', label: 'Vzhľad', icon: Palette }, { id: 'settings', label: 'Nastavenia', icon: Settings }, { id: 'seo', label: 'SEO', icon: Globe }].map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id as typeof activeTab); onSelectSection(null); }} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors ${activeTab === tab.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-white'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* SECTIONS TAB */}
          {activeTab === 'sections' && (
            selectedSection ? (
              <div className="p-4">
                <button onClick={() => onSelectSection(null)} className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 mb-4"><ChevronLeft className="w-4 h-4" />Späť</button>
                <div className="flex items-center gap-4 mb-5 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                  <span className="text-3xl">{SECTION_INFO[selectedSection.type]?.icon || '📦'}</span>
                  <div className="flex-1"><h3 className="font-bold text-white">{SECTION_INFO[selectedSection.type]?.name || selectedSection.type}</h3><p className="text-xs text-gray-500">{SECTION_INFO[selectedSection.type]?.description}</p></div>
                  <Switch checked={selectedSection.enabled} onChange={() => toggleSection(selectedSection.id)} />
                </div>
                <div className="flex gap-2 mb-4">
                  {[{ id: 'content', label: 'Obsah', icon: Type }, { id: 'style', label: 'Štýl', icon: Paintbrush }].map((t) => (
                    <button key={t.id} onClick={() => setSectionTab(t.id as typeof sectionTab)} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg ${sectionTab === t.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}><t.icon className="w-4 h-4" />{t.label}</button>
                  ))}
                </div>
                <div className="space-y-4">
                  {sectionTab === 'content' && <SectionContentEditor section={selectedSection} update={(k, v) => updateSectionSettings(selectedSection.id, { [k]: v })} />}
                  {sectionTab === 'style' && <SectionStyleEditor section={selectedSection} update={(k, v) => updateSectionSettings(selectedSection.id, { [k]: v })} />}
                </div>
                <div className="mt-6 pt-5 border-t border-slate-700/50 grid grid-cols-2 gap-2">
                  <Button onClick={() => duplicateSection(selectedSection.id)} variant="secondary" icon={Copy} fullWidth>Duplikovať</Button>
                  <Button onClick={() => { if (confirm('Odstrániť sekciu?')) { removeSection(selectedSection.id); onSelectSection(null); } }} variant="danger" icon={Trash2} fullWidth>Odstrániť</Button>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div><h3 className="font-bold text-white">Sekcie</h3><p className="text-xs text-gray-500">{sections.length} sekcií</p></div>
                  <Button onClick={() => setAddSectionOpen(true)} variant="gradient" size="sm" icon={Plus}>Pridať</Button>
                </div>
                <div className="space-y-2">
                  {sections.length === 0 ? (
                    <EmptyState icon={Layers} title="Žiadne sekcie" description="Pridajte prvú sekciu" action={{ label: 'Pridať', onClick: () => setAddSectionOpen(true) }} />
                  ) : (
                    sections.map((section, index) => {
                      const info = SECTION_INFO[section.type] || { icon: '📦', name: section.type, description: '' };
                      return (
                        <Card key={section.id} hover className={`group flex items-center gap-3 p-3 ${!section.enabled ? 'opacity-50' : ''}`} onClick={() => onSelectSection(section)}>
                          <div className="cursor-grab p-1.5 hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100"><GripVertical className="w-4 h-4 text-gray-500" /></div>
                          <div className="flex-1 flex items-center gap-3 min-w-0">
                            <span className="text-xl">{info.icon}</span>
                            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">{info.name}</p><p className="text-[10px] text-gray-500 truncate">{info.description}</p></div>
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                            <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'up'); }} disabled={index === 0} className="p-1.5 hover:bg-slate-600 rounded-lg disabled:opacity-30"><ChevronUp className="w-4 h-4 text-gray-400" /></button>
                            <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'down'); }} disabled={index === sections.length - 1} className="p-1.5 hover:bg-slate-600 rounded-lg disabled:opacity-30"><ChevronDown className="w-4 h-4 text-gray-400" /></button>
                            <button onClick={(e) => { e.stopPropagation(); toggleSection(section.id); }} className={`p-1.5 rounded-lg ${section.enabled ? 'text-emerald-400 hover:bg-emerald-500/20' : 'text-gray-500 hover:bg-slate-600'}`}>{section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400" />
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            )
          )}

          {/* THEME TAB */}
          {activeTab === 'theme' && (
            <div className="p-4 space-y-6">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3"><h4 className="font-semibold text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400" />Rýchle nastavenie</h4></div>
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={onOpenTemplates} variant="secondary" size="sm" icon={Layout} fullWidth>Šablóny</Button>
                  <Button onClick={onOpenAI} variant="gradient" size="sm" icon={Sparkles} fullWidth>AI</Button>
                </div>
              </Card>
              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2"><Palette className="w-4 h-4 text-purple-400" />Farebné schémy</h4>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_PALETTES.slice(0, 8).map((palette) => (
                    <button key={palette.name} onClick={() => updateTheme({ primaryColor: palette.colors[0], secondaryColor: palette.colors[1], accentColor: palette.colors[2] })} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-slate-700 hover:border-blue-500" title={palette.name}>
                      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">{palette.colors.map((c, i) => <div key={i} style={{ backgroundColor: c }} />)}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Farby</h4>
                <ColorPicker label="Primárna" value={shopSettings.theme.primaryColor} onChange={(v) => updateTheme({ primaryColor: v })} />
                <ColorPicker label="Sekundárna" value={shopSettings.theme.secondaryColor} onChange={(v) => updateTheme({ secondaryColor: v })} />
                <ColorPicker label="Akcentová" value={shopSettings.theme.accentColor} onChange={(v) => updateTheme({ accentColor: v })} />
                <ColorPicker label="Pozadie" value={shopSettings.theme.backgroundColor} onChange={(v) => updateTheme({ backgroundColor: v })} />
                <ColorPicker label="Text" value={shopSettings.theme.textColor} onChange={(v) => updateTheme({ textColor: v })} />
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-white flex items-center gap-2"><Type className="w-4 h-4 text-blue-400" />Typografia</h4>
                <Select label="Font nadpisov" value={shopSettings.theme.headingFontFamily} onChange={(v) => updateTheme({ headingFontFamily: v })} options={[{ value: 'Inter', label: 'Inter' }, { value: 'Poppins', label: 'Poppins' }, { value: 'Roboto', label: 'Roboto' }, { value: 'Playfair Display', label: 'Playfair Display' }, { value: 'Montserrat', label: 'Montserrat' }]} />
                <Select label="Font tela" value={shopSettings.theme.fontFamily} onChange={(v) => updateTheme({ fontFamily: v })} options={[{ value: 'Inter', label: 'Inter' }, { value: 'Roboto', label: 'Roboto' }, { value: 'Open Sans', label: 'Open Sans' }, { value: 'Lato', label: 'Lato' }]} />
                <Slider label="Veľkosť písma" value={shopSettings.theme.fontSizeBase} onChange={(v) => updateTheme({ fontSizeBase: v })} min={12} max={20} unit="px" />
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-white flex items-center gap-2"><Box className="w-4 h-4 text-green-400" />Rozmery</h4>
                <Slider label="Zaoblenie" value={shopSettings.theme.borderRadiusMedium} onChange={(v) => updateTheme({ borderRadiusMedium: v, borderRadiusSmall: Math.round(v/2), borderRadiusLarge: v*2 })} min={0} max={24} unit="px" />
                <Slider label="Medzery" value={shopSettings.theme.sectionSpacing} onChange={(v) => updateTheme({ sectionSpacing: v })} min={0} max={120} unit="px" />
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Tlačidlá</h4>
                <Select label="Štýl" value={shopSettings.theme.buttonStyle} onChange={(v) => updateTheme({ buttonStyle: v as ShopTheme['buttonStyle'] })} options={[{ value: 'solid', label: 'Plné' }, { value: 'outline', label: 'Obrys' }, { value: 'ghost', label: 'Priehľadné' }]} />
                <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Zaoblené</span><Switch checked={shopSettings.theme.buttonRounded} onChange={(v) => updateTheme({ buttonRounded: v })} /></div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="p-4 space-y-6">
              <Card className="p-4">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2"><Store className="w-4 h-4 text-emerald-400" />Základné</h4>
                <div className="space-y-4">
                  <Input label="Názov obchodu" value={shopSettings.name} onChange={(v) => updateShopSettings({ name: v })} placeholder="Môj Obchod" icon={Store} />
                  <Input label="Slogan" value={shopSettings.tagline} onChange={(v) => updateShopSettings({ tagline: v })} placeholder="Váš obľúbený e-shop" />
                  <Input label="Popis" value={shopSettings.description} onChange={(v) => updateShopSettings({ description: v })} placeholder="Krátky popis..." multiline rows={3} />
                </div>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2"><Mail className="w-4 h-4 text-blue-400" />Kontakt</h4>
                <div className="space-y-4">
                  <Input label="Email" value={shopSettings.email} onChange={(v) => updateShopSettings({ email: v })} placeholder="info@shop.sk" icon={Mail} type="email" />
                  <Input label="Telefón" value={shopSettings.phone} onChange={(v) => updateShopSettings({ phone: v })} placeholder="+421 900 123 456" icon={Phone} />
                </div>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2"><Share2 className="w-4 h-4 text-pink-400" />Sociálne siete</h4>
                <div className="space-y-4">
                  <Input label="Facebook" value={shopSettings.facebook} onChange={(v) => updateShopSettings({ facebook: v })} placeholder="https://facebook.com/..." icon={Facebook} />
                  <Input label="Instagram" value={shopSettings.instagram} onChange={(v) => updateShopSettings({ instagram: v })} placeholder="https://instagram.com/..." icon={Instagram} />
                </div>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2"><Truck className="w-4 h-4 text-orange-400" />E-commerce</h4>
                <div className="space-y-4">
                  <Input label="Doprava zadarmo od (€)" value={String(shopSettings.freeShippingThreshold)} onChange={(v) => updateShopSettings({ freeShippingThreshold: Number(v) || 0 })} type="number" />
                  <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Ceny s DPH</span><Switch checked={shopSettings.taxIncluded} onChange={(v) => updateShopSettings({ taxIncluded: v })} /></div>
                </div>
              </Card>
            </div>
          )}

          {/* SEO TAB */}
          {activeTab === 'seo' && (
            <div className="p-4 space-y-6">
              <Card className="p-4">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" />Meta tagy</h4>
                <div className="space-y-4">
                  <Input label="Meta titulok" value={shopSettings.metaTitle} onChange={(v) => updateShopSettings({ metaTitle: v })} placeholder="Názov | Váš Obchod" hint={`${shopSettings.metaTitle.length}/60`} />
                  <Input label="Meta popis" value={shopSettings.metaDescription} onChange={(v) => updateShopSettings({ metaDescription: v })} placeholder="Popis pre vyhľadávače..." multiline rows={3} hint={`${shopSettings.metaDescription.length}/160`} />
                  <Input label="Kľúčové slová" value={shopSettings.metaKeywords} onChange={(v) => updateShopSettings({ metaKeywords: v })} placeholder="eshop, produkty" hint="Oddeľte čiarkou" />
                </div>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold text-white mb-4">Náhľad</h4>
                <div className="bg-white rounded-xl p-4">
                  <p className="text-blue-600 text-lg hover:underline">{shopSettings.metaTitle || 'Názov stránky'}</p>
                  <p className="text-green-700 text-sm">https://vaseshop.sk</p>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{shopSettings.metaDescription || 'Popis stránky...'}</p>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 space-y-3">
          {hasUnsavedChanges && !saving && <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400"><AlertCircle className="w-4 h-4" /><span className="text-xs font-medium">Neuložené zmeny</span></div>}
          {lastSaved && !hasUnsavedChanges && <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400"><CheckCircle className="w-4 h-4" /><span className="text-xs font-medium">Uložené {formatTimeAgo(lastSaved)}</span></div>}
          <Button onClick={handleSave} disabled={!hasUnsavedChanges || saving} loading={saving} variant={hasUnsavedChanges ? 'gradient' : 'secondary'} icon={Save} fullWidth>{saving ? 'Ukladám...' : hasUnsavedChanges ? 'Uložiť zmeny' : 'Všetko uložené'}</Button>
        </div>
      </div>

      {!isOpen && <button onClick={onToggle} className="fixed top-20 left-4 z-[150] w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl shadow-2xl flex items-center justify-center hover:scale-110 transition-all"><PanelLeftOpen className="w-6 h-6" /></button>}

      <Modal isOpen={addSectionOpen} onClose={() => setAddSectionOpen(false)} title="Pridať sekciu" size="lg">
        <div className="flex h-[60vh]">
          <div className="w-44 border-r border-slate-700 p-3 overflow-y-auto">
            {SECTION_CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setAddSectionCategory(cat.id)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-1 ${addSectionCategory === cat.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-slate-800'}`}>{cat.name}</button>
            ))}
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="mb-4"><Input value={searchSections} onChange={setSearchSections} placeholder="Hľadať..." icon={Search} /></div>
            <div className="grid grid-cols-2 gap-3">
              {filteredAvailableSections.map((section) => (
                <button key={section.type} onClick={() => handleAddSection(section.type as SectionType)} className="flex items-start gap-3 p-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700/50 hover:border-blue-500/50 text-left">
                  <span className="text-2xl">{section.icon}</span>
                  <div><p className="font-semibold text-white text-sm">{section.name}</p><p className="text-xs text-gray-500">{section.desc}</p></div>
                </button>
              ))}
            </div>
            {filteredAvailableSections.length === 0 && <EmptyState icon={Search} title="Žiadne sekcie" description="Skúste zmeniť filter" />}
          </div>
        </div>
      </Modal>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION EDITORS
// ═══════════════════════════════════════════════════════════════════════════════

function SectionContentEditor({ section, update }: { section: ShopSection; update: (k: string, v: unknown) => void }) {
  const s = section.settings || {};
  switch (section.type) {
    case 'hero-slider': case 'hero-banner':
      return (<div className="space-y-4">
        <Input label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} placeholder="Vitajte v našom obchode" />
        <Input label="Podnadpis" value={s.subtitle || ''} onChange={(v) => update('subtitle', v)} placeholder="Objavte najnovšie produkty" multiline />
        <Input label="Text tlačidla" value={s.buttonText || ''} onChange={(v) => update('buttonText', v)} placeholder="Nakupovať" />
        <Input label="Link tlačidla" value={s.buttonLink || ''} onChange={(v) => update('buttonLink', v)} placeholder="/produkty" />
        <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Autoplay</span><Switch checked={s.autoplay !== false} onChange={(v) => update('autoplay', v)} /></div>
      </div>);
    case 'announcement-bar':
      return (<div className="space-y-4">
        <Input label="Text" value={s.text || ''} onChange={(v) => update('text', v)} placeholder="🚚 Doprava zadarmo nad €50!" />
        <Input label="Link" value={s.link || ''} onChange={(v) => update('link', v)} placeholder="/akcie" />
        <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Možnosť zatvoriť</span><Switch checked={s.closable === true} onChange={(v) => update('closable', v)} /></div>
      </div>);
    case 'header':
      return (<div className="space-y-4">
        <Input label="Logo text" value={s.logoText || ''} onChange={(v) => update('logoText', v)} placeholder="Váš Obchod" />
        <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Sticky</span><Switch checked={s.sticky !== false} onChange={(v) => update('sticky', v)} /></div>
        <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Vyhľadávanie</span><Switch checked={s.showSearch !== false} onChange={(v) => update('showSearch', v)} /></div>
        <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Košík</span><Switch checked={s.showCart !== false} onChange={(v) => update('showCart', v)} /></div>
        <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Účet</span><Switch checked={s.showAccount !== false} onChange={(v) => update('showAccount', v)} /></div>
      </div>);
    case 'featured-products': case 'product-grid': case 'product-carousel':
      return (<div className="space-y-4">
        <Input label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} placeholder="Odporúčané produkty" />
        <Input label="Podnadpis" value={s.subtitle || ''} onChange={(v) => update('subtitle', v)} placeholder="Najlepšie produkty" />
        <Slider label="Počet" value={s.count || 8} onChange={(v) => update('count', v)} min={2} max={24} />
        <Slider label="Stĺpce" value={s.columns || 4} onChange={(v) => update('columns', v)} min={2} max={6} />
        <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Hodnotenia</span><Switch checked={s.showRating !== false} onChange={(v) => update('showRating', v)} /></div>
        <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Do košíka</span><Switch checked={s.showAddToCart !== false} onChange={(v) => update('showAddToCart', v)} /></div>
      </div>);
    case 'categories-grid': case 'categories-carousel':
      return (<div className="space-y-4">
        <Input label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} placeholder="Kategórie" />
        <Slider label="Počet" value={s.count || 4} onChange={(v) => update('count', v)} min={2} max={12} />
        <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Počet produktov</span><Switch checked={s.showCount === true} onChange={(v) => update('showCount', v)} /></div>
      </div>);
    case 'newsletter':
      return (<div className="space-y-4">
        <Input label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} placeholder="Prihláste sa" />
        <Input label="Popis" value={s.description || ''} onChange={(v) => update('description', v)} placeholder="Získajte novinky" multiline />
        <Input label="Text tlačidla" value={s.buttonText || ''} onChange={(v) => update('buttonText', v)} placeholder="Odoberať" />
      </div>);
    case 'testimonials': case 'reviews-carousel':
      return (<div className="space-y-4">
        <Input label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} placeholder="Čo hovoria zákazníci" />
        <Slider label="Počet" value={s.count || 3} onChange={(v) => update('count', v)} min={1} max={6} />
        <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Hviezdy</span><Switch checked={s.showStars !== false} onChange={(v) => update('showStars', v)} /></div>
      </div>);
    case 'trust-badges':
      return (<div className="space-y-4">
        <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Doprava</span><Switch checked={s.showShipping !== false} onChange={(v) => update('showShipping', v)} /></div>
        <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Bezpečnosť</span><Switch checked={s.showSecure !== false} onChange={(v) => update('showSecure', v)} /></div>
        <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Vrátenie</span><Switch checked={s.showReturn !== false} onChange={(v) => update('showReturn', v)} /></div>
        <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Podpora</span><Switch checked={s.showSupport !== false} onChange={(v) => update('showSupport', v)} /></div>
      </div>);
    case 'faq-accordion':
      return (<div className="space-y-4">
        <Input label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} placeholder="Často kladené otázky" />
        <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Prvá otvorená</span><Switch checked={s.firstOpen !== false} onChange={(v) => update('firstOpen', v)} /></div>
      </div>);
    case 'promo-banner':
      return (<div className="space-y-4">
        <Input label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} placeholder="Špeciálna ponuka" />
        <Input label="Podnadpis" value={s.subtitle || ''} onChange={(v) => update('subtitle', v)} placeholder="-30% na všetko" />
        <Input label="Text tlačidla" value={s.buttonText || ''} onChange={(v) => update('buttonText', v)} placeholder="Nakupovať" />
        <Input label="Link" value={s.buttonLink || ''} onChange={(v) => update('buttonLink', v)} placeholder="/akcie" />
      </div>);
    case 'footer':
      return (<div className="space-y-4">
        <Input label="Copyright" value={s.copyright || ''} onChange={(v) => update('copyright', v)} placeholder={`© ${new Date().getFullYear()} Obchod`} />
        <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Sociálne siete</span><Switch checked={s.showSocial !== false} onChange={(v) => update('showSocial', v)} /></div>
        <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Platobné metódy</span><Switch checked={s.showPayments !== false} onChange={(v) => update('showPayments', v)} /></div>
      </div>);
    default:
      return <div className="text-center py-8"><Box className="w-12 h-12 text-gray-600 mx-auto mb-3" /><p className="text-gray-500 text-sm">Editor bude dostupný čoskoro</p></div>;
  }
}

function SectionStyleEditor({ section, update }: { section: ShopSection; update: (k: string, v: unknown) => void }) {
  const s = section.settings || {};
  return (
    <div className="space-y-4">
      <ColorPicker label="Farba pozadia" value={s.backgroundColor || '#ffffff'} onChange={(v) => update('backgroundColor', v)} />
      <ColorPicker label="Farba textu" value={s.textColor || '#1f2937'} onChange={(v) => update('textColor', v)} />
      <Slider label="Horný padding" value={s.paddingTop || 48} onChange={(v) => update('paddingTop', v)} min={0} max={200} unit="px" />
      <Slider label="Dolný padding" value={s.paddingBottom || 48} onChange={(v) => update('paddingBottom', v)} min={0} max={200} unit="px" />
      <Select label="Šírka" value={s.containerWidth || 'default'} onChange={(v) => update('containerWidth', v)} options={[{ value: 'full', label: 'Celá' }, { value: 'wide', label: 'Široká' }, { value: 'default', label: 'Štandardná' }, { value: 'narrow', label: 'Úzka' }]} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE SECTION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function StarRating({ rating }: { rating: number }) {
  return <div className="flex items-center gap-0.5">{[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-4 h-4 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}</div>;
}

function AnnouncementBarSection({ section }: { section: ShopSection }) {
  const [visible, setVisible] = useState(true);
  const s = section.settings || {};
  if (!visible) return null;
  return (
    <div className="relative text-center py-2.5 px-4" style={{ backgroundColor: s.backgroundColor || '#0f172a', color: s.textColor || '#ffffff' }}>
      <p className="text-sm font-medium">{s.text || '🚚 Doprava zadarmo nad €50!'}</p>
      {s.closable && <button onClick={() => setVisible(false)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"><X className="w-4 h-4" /></button>}
    </div>
  );
}

function HeaderSection({ section, theme, cartCount, onCartClick }: { section: ShopSection; theme: ShopTheme; cartCount: number; onCartClick: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const s = section.settings || {};
  return (
    <header className={`${s.sticky !== false ? 'sticky top-14 z-40' : ''} border-b`} style={{ backgroundColor: s.backgroundColor || '#ffffff', borderColor: theme.borderColor }}>
      <div className="max-w-7xl mx-auto px-4 h-[72px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: theme.primaryColor }}><Sparkles className="w-6 h-6 text-white" /></div>
          <span className="font-bold text-xl hidden sm:block" style={{ fontFamily: theme.headingFontFamily }}>{s.logoText || 'Demo Shop'}</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-8">{['Domov', 'Produkty', 'Kategórie', 'Akcie', 'Kontakt'].map((item) => <Link key={item} href="#" className="text-sm font-medium hover:opacity-70">{item}</Link>)}</nav>
        <div className="flex items-center gap-2">
          {s.showSearch !== false && <button className="p-2.5 hover:bg-gray-100 rounded-xl"><Search className="w-5 h-5" /></button>}
          {s.showAccount !== false && <button className="p-2.5 hover:bg-gray-100 rounded-xl"><User className="w-5 h-5" /></button>}
          {s.showCart !== false && <button onClick={onCartClick} className="p-2.5 hover:bg-gray-100 rounded-xl relative"><ShoppingCart className="w-5 h-5" />{cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white" style={{ backgroundColor: theme.primaryColor }}>{cartCount}</span>}</button>}
          <button onClick={() => setMobileMenuOpen(true)} className="p-2.5 hover:bg-gray-100 rounded-xl lg:hidden"><Menu className="w-5 h-5" /></button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-80 bg-white shadow-2xl">
            <div className="p-4 border-b flex items-center justify-between"><span className="font-bold text-lg">Menu</span><button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button></div>
            <nav className="p-4 space-y-1">{['Domov', 'Produkty', 'Kategórie', 'Akcie', 'Kontakt'].map((item) => <Link key={item} href="#" className="block px-4 py-3 rounded-xl hover:bg-gray-100 font-medium" onClick={() => setMobileMenuOpen(false)}>{item}</Link>)}</nav>
          </div>
        </div>
      )}
    </header>
  );
}

function HeroSliderSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const s = section.settings || {};
  return (
    <div className="relative min-h-[500px] md:min-h-[600px] overflow-hidden flex items-center justify-center" style={{ backgroundColor: s.backgroundColor || '#1e293b' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent" />
      <div className="relative text-center text-white px-4 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: theme.headingFontFamily }}>{s.title || 'Nová kolekcia 2024'}</h1>
        <p className="text-xl md:text-2xl opacity-80 mb-8 max-w-2xl mx-auto">{s.subtitle || 'Objavte najnovšie produkty za skvelé ceny'}</p>
        {s.buttonText && <Link href={s.buttonLink || '/produkty'} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform" style={{ backgroundColor: theme.primaryColor }}>{s.buttonText}<ArrowRight className="w-5 h-5" /></Link>}
      </div>
    </div>
  );
}

function TrustBadgesSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const s = section.settings || {};
  const badges = [
    { icon: Truck, title: 'Doprava zadarmo', subtitle: 'Nad €50', show: s.showShipping !== false },
    { icon: Shield, title: 'Bezpečná platba', subtitle: '100% secure', show: s.showSecure !== false },
    { icon: RotateCcw, title: '30 dní vrátenie', subtitle: 'Bez problémov', show: s.showReturn !== false },
    { icon: Headphones, title: 'Podpora 24/7', subtitle: 'Vždy pre vás', show: s.showSupport !== false },
  ].filter(b => b.show);
  return (
    <div className="py-8 border-y" style={{ borderColor: theme.borderColor, backgroundColor: s.backgroundColor || '#f8fafc' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className={`grid grid-cols-2 md:grid-cols-${badges.length} gap-6`}>
          {badges.map((b, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${theme.primaryColor}15` }}><b.icon className="w-7 h-7" style={{ color: theme.primaryColor }} /></div>
              <div><p className="font-semibold" style={{ color: theme.headingColor }}>{b.title}</p><p className="text-sm" style={{ color: theme.textMutedColor }}>{b.subtitle}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsSection({ section, theme, onAddToCart }: { section: ShopSection; theme: ShopTheme; onAddToCart: (p: { id: string; name: string; price: number }) => void }) {
  const s = section.settings || {};
  const products = demoProducts.slice(0, s.count || 8);
  return (
    <div className="py-16" style={{ backgroundColor: s.backgroundColor || '#ffffff', paddingTop: s.paddingTop || 64, paddingBottom: s.paddingBottom || 64 }}>
      <div className="max-w-7xl mx-auto px-4">
        {(s.title || s.subtitle) && (
          <div className="text-center mb-12">
            {s.title && <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: theme.headingFontFamily, color: theme.headingColor }}>{s.title}</h2>}
            {s.subtitle && <p className="text-lg max-w-2xl mx-auto" style={{ color: theme.textMutedColor }}>{s.subtitle}</p>}
          </div>
        )}
        <div className={`grid grid-cols-2 md:grid-cols-${Math.min(s.columns || 4, 4)} gap-6`}>
          {products.map((p) => (
            <div key={p.id} className="group">
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative" style={{ backgroundColor: theme.surfaceColor }}>
                {p.badge && <span className="absolute top-3 left-3 px-3 py-1.5 text-xs font-bold rounded-lg text-white z-10" style={{ backgroundColor: theme.primaryColor }}>{p.badge}</span>}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                  {s.showAddToCart !== false && <button onClick={() => onAddToCart({ id: p.id, name: p.name, price: p.price })} className="opacity-0 group-hover:opacity-100 px-6 py-3 bg-white rounded-xl shadow-lg font-semibold text-sm transition-all translate-y-4 group-hover:translate-y-0" style={{ color: theme.primaryColor }}>Do košíka</button>}
                </div>
              </div>
              <h3 className="font-medium mb-1 line-clamp-2" style={{ color: theme.textColor }}>{p.name}</h3>
              {s.showRating !== false && <div className="mb-2"><StarRating rating={p.rating || 4} /></div>}
              <div className="flex items-center gap-2"><span className="text-lg font-bold" style={{ color: theme.primaryColor }}>{formatPrice(p.price)}</span>{p.comparePrice && <span className="text-sm line-through" style={{ color: theme.textMutedColor }}>{formatPrice(p.comparePrice)}</span>}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoriesGridSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const s = section.settings || {};
  const categories = ['Elektronika', 'Oblečenie', 'Dom & Záhrada', 'Šport', 'Krása', 'Hračky'].slice(0, s.count || 4);
  const emojis = ['📱', '👕', '🏠', '⚽', '💄', '🧸'];
  return (
    <div className="py-16" style={{ backgroundColor: s.backgroundColor || '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4">
        {s.title && <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: theme.headingFontFamily, color: theme.headingColor }}>{s.title}</h2>}
        <div className={`grid grid-cols-2 md:grid-cols-${Math.min(categories.length, 4)} gap-4`}>
          {categories.map((cat, i) => (
            <Link key={cat} href="#" className="group relative aspect-[4/3] rounded-2xl overflow-hidden" style={{ backgroundColor: theme.surfaceColor }}>
              <div className="absolute inset-0 flex items-center justify-center text-6xl">{emojis[i]}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4"><p className="text-white font-semibold text-lg">{cat}</p>{s.showCount && <p className="text-white/70 text-sm">{Math.floor(Math.random() * 100) + 20} produktov</p>}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestimonialsSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const s = section.settings || {};
  const testimonials = [{ name: 'Mária K.', text: 'Skvelý obchod! Rýchle doručenie a kvalitné produkty.', rating: 5, avatar: '👩' },{ name: 'Peter N.', text: 'Výborná zákaznícka podpora. Vždy ochotní pomôcť.', rating: 5, avatar: '👨' },{ name: 'Jana S.', text: 'Nakupujem tu pravidelne už rok. Spokojnosť!', rating: 4, avatar: '👩‍🦰' }].slice(0, s.count || 3);
  return (
    <div className="py-16" style={{ backgroundColor: s.backgroundColor || '#f8fafc' }}>
      <div className="max-w-7xl mx-auto px-4">
        {s.title && <h2 className="text-3xl font-bold mb-12 text-center" style={{ fontFamily: theme.headingFontFamily, color: theme.headingColor }}>{s.title}</h2>}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="p-8 rounded-2xl" style={{ backgroundColor: theme.cardColor, boxShadow: theme.shadowMedium }}>
              <Quote className="w-10 h-10 mb-4" style={{ color: theme.primaryColor }} />
              <p className="mb-6" style={{ color: theme.textColor }}>"{t.text}"</p>
              <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="text-3xl">{t.avatar}</span><span className="font-semibold" style={{ color: theme.headingColor }}>{t.name}</span></div>{s.showStars !== false && <StarRating rating={t.rating} />}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsletterSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const s = section.settings || {};
  return (
    <div className="py-20" style={{ backgroundColor: s.backgroundColor || theme.primaryColor }}>
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white" style={{ fontFamily: theme.headingFontFamily }}>{s.title || 'Prihláste sa k odberu'}</h2>
        <p className="text-lg mb-8 text-white/80">{s.description || 'Získajte novinky, zľavy a špeciálne ponuky'}</p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" placeholder={s.placeholder || 'Váš email...'} className="flex-1 px-5 py-4 rounded-xl focus:outline-none text-gray-900" />
          <button className="px-8 py-4 bg-white rounded-xl font-semibold hover:bg-gray-100" style={{ color: theme.primaryColor }}>{s.buttonText || 'Odoberať'}</button>
        </div>
      </div>
    </div>
  );
}

function FAQSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const s = section.settings || {};
  const [openIndex, setOpenIndex] = useState<number | null>(s.firstOpen !== false ? 0 : null);
  const faqs = [{ q: 'Ako môžem sledovať objednávku?', a: 'Po odoslaní vám príde email s tracking číslom.' },{ q: 'Aké sú možnosti platby?', a: 'Kartou, PayPal, Apple Pay, Google Pay, dobierka.' },{ q: 'Ako môžem vrátiť tovar?', a: 'Do 30 dní od doručenia bez udania dôvodu.' },{ q: 'Ako dlho trvá doručenie?', a: 'Štandardne 2-5 dní, express do 24 hodín.' }];
  return (
    <div className="py-16" style={{ backgroundColor: s.backgroundColor || '#ffffff' }}>
      <div className="max-w-3xl mx-auto px-4">
        {s.title && <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: theme.headingFontFamily, color: theme.headingColor }}>{s.title}</h2>}
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-2xl overflow-hidden" style={{ backgroundColor: theme.surfaceColor, border: `1px solid ${theme.borderColor}` }}>
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full px-6 py-5 flex items-center justify-between text-left font-medium hover:bg-black/5" style={{ color: theme.headingColor }}>{f.q}<ChevronDown className={`w-5 h-5 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} /></button>
              {openIndex === i && <div className="px-6 pb-5" style={{ color: theme.textMutedColor }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PromoBannerSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const s = section.settings || {};
  return (
    <div className="py-20 text-center" style={{ backgroundColor: s.backgroundColor || theme.primaryColor }}>
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: theme.headingFontFamily }}>{s.title || 'Špeciálna ponuka'}</h2>
        <p className="text-xl md:text-2xl text-white/80 mb-8">{s.subtitle || 'Využite limitovanú akciu'}</p>
        {s.buttonText && <Link href={s.buttonLink || '/akcie'} className="inline-flex items-center gap-2 px-8 py-4 bg-white rounded-xl font-semibold text-lg hover:bg-gray-100" style={{ color: theme.primaryColor }}>{s.buttonText}<ArrowRight className="w-5 h-5" /></Link>}
      </div>
    </div>
  );
}

function BrandLogosSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const s = section.settings || {};
  return (
    <div className="py-12" style={{ backgroundColor: s.backgroundColor || '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4">
        {s.title && <h2 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: theme.headingFontFamily, color: theme.headingColor }}>{s.title}</h2>}
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">{[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="w-28 h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.surfaceColor }}><span className="text-2xl">🏷️</span></div>)}</div>
      </div>
    </div>
  );
}

function FooterSection({ section, theme, shopSettings }: { section: ShopSection; theme: ShopTheme; shopSettings: { name: string; email: string; phone: string; facebook: string; instagram: string } }) {
  const s = section.settings || {};
  return (
    <footer className="py-16" style={{ backgroundColor: s.backgroundColor || '#0f172a', color: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: theme.primaryColor }}><Sparkles className="w-7 h-7 text-white" /></div><span className="font-bold text-2xl">{shopSettings.name || 'Shop'}</span></div>
            <p className="text-white/60 text-sm">Váš spoľahlivý partner pre online nakupovanie.</p>
          </div>
          <div><h4 className="font-semibold mb-6 text-lg">Obchod</h4><div className="space-y-3 text-sm text-white/60">{['Produkty', 'Kategórie', 'Akcie', 'Novinky'].map((l) => <Link key={l} href="#" className="block hover:text-white">{l}</Link>)}</div></div>
          <div><h4 className="font-semibold mb-6 text-lg">Podpora</h4><div className="space-y-3 text-sm text-white/60">{['Kontakt', 'FAQ', 'Doprava', 'Reklamácie'].map((l) => <Link key={l} href="#" className="block hover:text-white">{l}</Link>)}</div></div>
          <div><h4 className="font-semibold mb-6 text-lg">Kontakt</h4><div className="space-y-4 text-sm text-white/60"><p className="flex items-center gap-3"><Mail className="w-5 h-5" />{shopSettings.email || 'info@shop.sk'}</p><p className="flex items-center gap-3"><Phone className="w-5 h-5" />{shopSettings.phone || '+421 900 123 456'}</p></div>{s.showSocial !== false && <div className="flex gap-3 mt-6">{shopSettings.facebook && <a href={shopSettings.facebook} className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20"><Facebook className="w-5 h-5" /></a>}{shopSettings.instagram && <a href={shopSettings.instagram} className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20"><Instagram className="w-5 h-5" /></a>}</div>}</div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"><p className="text-sm text-white/60">{s.copyright || `© ${new Date().getFullYear()} ${shopSettings.name || 'Shop'}`}</p>{s.showPayments !== false && <div className="flex items-center gap-4"><CreditCard className="w-10 h-10 text-white/40" /><Banknote className="w-10 h-10 text-white/40" /></div>}</div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CART SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════════

function CartSidebar({ theme, freeShippingThreshold }: { theme: ShopTheme; freeShippingThreshold: number }) {
  const cart = useCart();
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, total, count } = cart;
  const remaining = Math.max(freeShippingThreshold - total(), 0);
  const progress = Math.min((total() / freeShippingThreshold) * 100, 100);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
      <div className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="font-bold text-xl flex items-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            Košík ({count()})
          </h2>
          <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Free shipping progress */}
        {remaining > 0 && items.length > 0 && (
          <div className="p-4 bg-blue-50 border-b">
            <p className="text-sm text-blue-800 mb-2">
              Ešte <strong>{formatPrice(remaining)}</strong> do dopravy zadarmo!
            </p>
            <Progress value={progress} color="blue" />
          </div>
        )}
        
        {remaining === 0 && items.length > 0 && (
          <div className="p-4 bg-emerald-50 border-b flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <p className="text-sm text-emerald-800 font-medium">Máte nárok na dopravu zadarmo!</p>
          </div>
        )}
        
        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-20 h-20 mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 text-lg mb-2">Váš košík je prázdny</p>
              <p className="text-gray-400 text-sm">Pridajte produkty do košíka</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-24 h-24 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-2">{item.name}</p>
                    <p className="font-bold mt-1" style={{ color: theme.primaryColor }}>
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 self-start"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-gray-600">Medzisúčet</span>
              <span className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                {formatPrice(total())}
              </span>
            </div>
            <Link 
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="block w-full py-4 text-center rounded-xl font-semibold text-white text-lg hover:opacity-90"
              style={{ backgroundColor: theme.primaryColor }}
            >
              Pokračovať k pokladni
            </Link>
            <button 
              onClick={() => setCartOpen(false)}
              className="block w-full py-3 text-center text-gray-500 hover:text-gray-700 mt-2"
            >
              Pokračovať v nakupovaní
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const editor = useEditor();
  const cart = useCart();
  const { shopSettings, hasUnsavedChanges, saveChanges, updateTheme } = editor;
  const { theme, sections } = shopSettings;
  
  // Sort and filter sections
  const sortedSections = useMemo(() => 
    [...sections].sort((a, b) => a.order - b.order).filter(s => s.enabled),
    [sections]
  );
  const allSections = useMemo(() => 
    [...sections].sort((a, b) => a.order - b.order),
    [sections]
  );

  // State
  const [user] = useState({ name: 'Demo User', email: 'demo@eshopbuilder.sk' });
  const [isOwner, setIsOwner] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<ShopSection | null>(null);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [stats] = useState(DEMO_STATS);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);

  const shopName = shopSettings.name || 'Demo Shop';

  // Effects
  useEffect(() => {
    console.log('EshopBuilder Pro v11 - Professional Edition Loaded');
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges) saveChanges();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        handleToggleEdit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges]);

  // Handlers
  const handleLogout = () => {
    localStorage.clear();
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

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSave = async () => {
    await saveChanges();
  };

  const handleAddToCart = (product: { id: string; name: string; price: number }) => {
    cart.addItem(product);
  };

  const handleSelectTemplate = (template: Template) => {
    updateTheme({
      primaryColor: template.colors.primary,
      secondaryColor: template.colors.secondary,
      accentColor: template.colors.accent,
      backgroundColor: template.colors.background,
      fontFamily: template.fonts.body,
      headingFontFamily: template.fonts.heading,
    });
    setTemplatesOpen(false);
  };

  const handleAIGenerate = (generatedTheme: Partial<ShopTheme>) => {
    updateTheme(generatedTheme);
  };

  // Render section
  const renderSection = (section: ShopSection) => {
    switch (section.type) {
      case 'announcement-bar':
        return <AnnouncementBarSection section={section} />;
      case 'header':
        return <HeaderSection section={section} theme={theme} cartCount={cart.count()} onCartClick={() => cart.setCartOpen(true)} />;
      case 'hero-slider':
      case 'hero-banner':
      case 'hero-video':
      case 'hero-split':
        return <HeroSliderSection section={section} theme={theme} />;
      case 'trust-badges':
        return <TrustBadgesSection section={section} theme={theme} />;
      case 'categories-grid':
      case 'categories-carousel':
        return <CategoriesGridSection section={section} theme={theme} />;
      case 'featured-products':
      case 'product-grid':
      case 'product-carousel':
      case 'product-tabs':
        return <ProductsSection section={section} theme={theme} onAddToCart={handleAddToCart} />;
      case 'promo-banner':
      case 'promo-cards':
        return <PromoBannerSection section={section} theme={theme} />;
      case 'testimonials':
      case 'reviews-carousel':
        return <TestimonialsSection section={section} theme={theme} />;
      case 'faq-accordion':
        return <FAQSection section={section} theme={theme} />;
      case 'newsletter':
        return <NewsletterSection section={section} theme={theme} />;
      case 'brand-logos':
        return <BrandLogosSection section={section} theme={theme} />;
      case 'footer':
        return <FooterSection section={section} theme={theme} shopSettings={shopSettings} />;
      default:
        return (
          <div className="py-16 text-center" style={{ backgroundColor: theme.surfaceColor }}>
            <Box className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Sekcia: {section.type}</p>
          </div>
        );
    }
  };

  // Preview styles
  const topOffset = isOwner ? 56 : 0;
  const getPreviewStyle = (): React.CSSProperties => {
    if (!isEditing) return {};
    switch (devicePreview) {
      case 'tablet':
        return { maxWidth: '768px', margin: '0 auto', boxShadow: '0 0 0 1px rgba(0,0,0,0.1)', borderRadius: '8px' };
      case 'mobile':
        return { maxWidth: '375px', margin: '0 auto', boxShadow: '0 0 0 1px rgba(0,0,0,0.1)', borderRadius: '24px' };
      default:
        return {};
    }
  };

  return (
    <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      {/* Admin Bar */}
      {isOwner && (
        <AdminBar 
          shopName={shopName}
          user={user}
          isEditing={isEditing}
          onToggleEdit={handleToggleEdit}
          onLogout={handleLogout}
          stats={stats}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onOpenTemplates={() => setTemplatesOpen(true)}
          onOpenAI={() => setAiGeneratorOpen(true)}
        />
      )}

      {/* Editor Panel */}
      {isOwner && isEditing && (
        <InlineEditorPanel
          isOpen={editorOpen}
          onToggle={() => setEditorOpen(!editorOpen)}
          selectedSection={selectedSection}
          onSelectSection={setSelectedSection}
          sections={allSections}
          devicePreview={devicePreview}
          onDeviceChange={setDevicePreview}
          onSave={handleSave}
          hasUnsavedChanges={hasUnsavedChanges}
          onOpenTemplates={() => setTemplatesOpen(true)}
          onOpenAI={() => setAiGeneratorOpen(true)}
        />
      )}

      {/* Main Content */}
      <div style={{ 
        marginTop: topOffset, 
        marginLeft: isEditing && editorOpen ? 380 : 0, 
        transition: 'margin-left 0.3s ease',
        minHeight: `calc(100vh - ${topOffset}px)`,
        ...getPreviewStyle() 
      }}>
        {sortedSections.map((section) => (
          <div 
            key={section.id} 
            className={`relative ${isEditing ? 'group cursor-pointer' : ''}`}
            onClick={isEditing ? () => { setSelectedSection(section); setEditorOpen(true); } : undefined}
          >
            {/* Edit overlay */}
            {isEditing && (
              <div className={`absolute inset-0 z-10 pointer-events-none transition-all border-2 ${
                selectedSection?.id === section.id 
                  ? 'border-blue-500 bg-blue-500/5' 
                  : 'border-transparent group-hover:border-dashed group-hover:border-blue-400/50'
              }`}>
                <div className={`absolute top-3 left-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-lg flex items-center gap-2 ${
                  selectedSection?.id === section.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                } transition-opacity`}>
                  <span className="text-lg">{SECTION_INFO[section.type]?.icon || '📦'}</span>
                  {SECTION_INFO[section.type]?.name || section.type}
                </div>
              </div>
            )}
            {renderSection(section)}
          </div>
        ))}

        {sortedSections.length === 0 && (
          <div className="min-h-screen flex items-center justify-center">
            <EmptyState
              icon={Layers}
              title="Váš obchod je prázdny"
              description="Začnite pridaním sekcií do vášho obchodu"
              action={isEditing ? { 
                label: 'Pridať sekciu', 
                onClick: () => setEditorOpen(true) 
              } : undefined}
            />
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar theme={theme} freeShippingThreshold={shopSettings.freeShippingThreshold} />

      {/* Floating Edit Button */}
      {isOwner && !isEditing && (
        <button 
          onClick={handleToggleEdit}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all group"
        >
          <Paintbrush className="w-7 h-7" />
          <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-900 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Upraviť obchod
          </span>
        </button>
      )}

      {/* Templates Modal */}
      <Modal isOpen={templatesOpen} onClose={() => setTemplatesOpen(false)} size="full" title="Šablóny">
        <TemplateGallery onSelect={handleSelectTemplate} onClose={() => setTemplatesOpen(false)} />
      </Modal>

      {/* AI Generator Modal */}
      <Modal isOpen={aiGeneratorOpen} onClose={() => setAiGeneratorOpen(false)} size="lg" title="🤖 AI Generátor témy">
        <AIThemeGenerator onGenerate={handleAIGenerate} onClose={() => setAiGeneratorOpen(false)} />
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const editor = useEditor();
  const cart = useCart();
  const { shopSettings, hasUnsavedChanges, saveChanges, updateTheme } = editor;
  const { theme, sections } = shopSettings;
  
  const sortedSections = useMemo(() => 
    [...sections].sort((a, b) => a.order - b.order).filter(s => s.enabled),
    [sections]
  );
  const allSections = useMemo(() => 
    [...sections].sort((a, b) => a.order - b.order),
    [sections]
  );

  const [user] = useState({ name: 'Demo User', email: 'demo@eshopbuilder.sk' });
  const [isOwner, setIsOwner] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<ShopSection | null>(null);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [stats] = useState(DEMO_STATS);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);

  const shopName = shopSettings.name || 'Demo Shop';

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges) saveChanges();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        handleToggleEdit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges]);

  // Handlers
  const handleLogout = () => {
    localStorage.clear();
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

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSave = async () => {
    await saveChanges();
  };

  const handleAddToCart = (product: { id: string; name: string; price: number }) => {
    cart.addItem(product);
  };

  const handleSelectTemplate = (template: Template) => {
    updateTheme({
      primaryColor: template.colors.primary,
      secondaryColor: template.colors.secondary,
      accentColor: template.colors.accent,
      backgroundColor: template.colors.background,
      fontFamily: template.fonts.body,
      headingFontFamily: template.fonts.heading,
    });
    setTemplatesOpen(false);
  };

  const handleAIGenerate = (generatedTheme: Partial<ShopTheme>) => {
    updateTheme(generatedTheme);
  };

  // Render section
  const renderSection = (section: ShopSection) => {
    switch (section.type) {
      case 'announcement-bar':
        return <AnnouncementBarSection section={section} />;
      case 'header':
        return <HeaderSection section={section} theme={theme} cartCount={cart.count()} onCartClick={() => cart.setCartOpen(true)} />;
      case 'hero-slider':
      case 'hero-banner':
      case 'hero-video':
      case 'hero-split':
        return <HeroSliderSection section={section} theme={theme} />;
      case 'trust-badges':
        return <TrustBadgesSection section={section} theme={theme} />;
      case 'categories-grid':
      case 'categories-carousel':
        return <CategoriesGridSection section={section} theme={theme} />;
      case 'featured-products':
      case 'product-grid':
      case 'product-carousel':
      case 'product-tabs':
        return <ProductsSection section={section} theme={theme} onAddToCart={handleAddToCart} />;
      case 'promo-banner':
      case 'promo-cards':
        return <PromoBannerSection section={section} theme={theme} />;
      case 'testimonials':
      case 'reviews-carousel':
        return <TestimonialsSection section={section} theme={theme} />;
      case 'faq-accordion':
        return <FAQSection section={section} theme={theme} />;
      case 'newsletter':
        return <NewsletterSection section={section} theme={theme} />;
      case 'brand-logos':
        return <BrandLogosSection section={section} theme={theme} />;
      case 'footer':
        return <FooterSection section={section} theme={theme} shopSettings={shopSettings} />;
      default:
        return (
          <div className="py-16 text-center" style={{ backgroundColor: theme.surfaceColor }}>
            <Box className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Sekcia: {section.type}</p>
          </div>
        );
    }
  };

  // Preview styles
  const topOffset = isOwner ? 56 : 0;
  const getPreviewStyle = (): React.CSSProperties => {
    if (!isEditing) return {};
    switch (devicePreview) {
      case 'tablet':
        return { maxWidth: '768px', margin: '0 auto', boxShadow: '0 0 0 1px rgba(0,0,0,0.1)', borderRadius: '8px' };
      case 'mobile':
        return { maxWidth: '375px', margin: '0 auto', boxShadow: '0 0 0 1px rgba(0,0,0,0.1)', borderRadius: '24px' };
      default:
        return {};
    }
  };

  return (
    <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      {/* Admin Bar */}
      {isOwner && (
        <AdminBar 
          shopName={shopName}
          user={user}
          isEditing={isEditing}
          onToggleEdit={handleToggleEdit}
          onLogout={handleLogout}
          stats={stats}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onOpenTemplates={() => setTemplatesOpen(true)}
          onOpenAI={() => setAiGeneratorOpen(true)}
        />
      )}

      {/* Editor Panel */}
      {isOwner && isEditing && (
        <InlineEditorPanel
          isOpen={editorOpen}
          onToggle={() => setEditorOpen(!editorOpen)}
          selectedSection={selectedSection}
          onSelectSection={setSelectedSection}
          sections={allSections}
          devicePreview={devicePreview}
          onDeviceChange={setDevicePreview}
          onSave={handleSave}
          hasUnsavedChanges={hasUnsavedChanges}
          onOpenTemplates={() => setTemplatesOpen(true)}
          onOpenAI={() => setAiGeneratorOpen(true)}
        />
      )}

      {/* Main Content */}
      <div style={{ 
        marginTop: topOffset, 
        marginLeft: isEditing && editorOpen ? 380 : 0, 
        transition: 'margin-left 0.3s ease',
        minHeight: `calc(100vh - ${topOffset}px)`,
        ...getPreviewStyle() 
      }}>
        {sortedSections.map((section) => (
          <div 
            key={section.id} 
            className={`relative ${isEditing ? 'group cursor-pointer' : ''}`}
            onClick={isEditing ? () => { setSelectedSection(section); setEditorOpen(true); } : undefined}
          >
            {/* Edit overlay */}
            {isEditing && (
              <div className={`absolute inset-0 z-10 pointer-events-none transition-all border-2 ${
                selectedSection?.id === section.id 
                  ? 'border-blue-500 bg-blue-500/5' 
                  : 'border-transparent group-hover:border-dashed group-hover:border-blue-400/50'
              }`}>
                <div className={`absolute top-3 left-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-lg flex items-center gap-2 ${
                  selectedSection?.id === section.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                } transition-opacity`}>
                  <span className="text-lg">{SECTION_INFO[section.type]?.icon || '📦'}</span>
                  {SECTION_INFO[section.type]?.name || section.type}
                </div>
              </div>
            )}
            {renderSection(section)}
          </div>
        ))}

        {sortedSections.length === 0 && (
          <div className="min-h-screen flex items-center justify-center">
            <EmptyState
              icon={Layers}
              title="Váš obchod je prázdny"
              description="Začnite pridaním sekcií do vášho obchodu"
              action={isEditing ? { 
                label: 'Pridať sekciu', 
                onClick: () => setEditorOpen(true) 
              } : undefined}
            />
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar theme={theme} freeShippingThreshold={shopSettings.freeShippingThreshold} />

      {/* Floating Edit Button */}
      {isOwner && !isEditing && (
        <button 
          onClick={handleToggleEdit}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all group"
        >
          <Paintbrush className="w-7 h-7" />
          <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-900 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Upraviť obchod
          </span>
        </button>
      )}

      {/* Templates Modal */}
      <Modal isOpen={templatesOpen} onClose={() => setTemplatesOpen(false)} size="full" title="Šablóny">
        <TemplateGallery onSelect={handleSelectTemplate} onClose={() => setTemplatesOpen(false)} />
      </Modal>

      {/* AI Generator Modal */}
      <Modal isOpen={aiGeneratorOpen} onClose={() => setAiGeneratorOpen(false)} size="lg" title="🤖 AI Generátor témy">
        <AIThemeGenerator onGenerate={handleAIGenerate} onClose={() => setAiGeneratorOpen(false)} />
      </Modal>
    </div>
  );
}
