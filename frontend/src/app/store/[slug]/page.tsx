'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingCart, Heart, Search, User, Menu, X, ChevronLeft, ChevronRight, 
  Star, Truck, Shield, RotateCcw, Headphones, Plus, Minus, Check, 
  Facebook, Instagram, Mail, Phone, ChevronDown, ChevronUp, Quote, Sparkles, ArrowRight,
  CreditCard, Smartphone, AlertCircle, ExternalLink, Eye, Package,
  Palette, Save, Layers, GripVertical, EyeOff, Trash2, Copy, Settings,
  LayoutDashboard, ShoppingBag, Users, TrendingUp, Bell, LogOut,
  PanelLeftClose, PanelLeftOpen, Undo, Redo, Monitor, Tablet,
  BarChart3, Euro, Zap, Type, Percent, HelpCircle, Globe,
  Target, TrendingDown, Banknote, PieChart, CheckCircle, Info,
  Loader2, Paintbrush, Store, Wand2
} from 'lucide-react';
import { useCart, useEditor, demoProducts, formatPrice, ShopSection, ShopTheme, SECTION_INFO, SectionType } from '@/lib/store';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & DEMO DATA
// ═══════════════════════════════════════════════════════════════════════════════

interface Notification {
  id: string;
  type: 'order' | 'review' | 'stock' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface ShopStats {
  revenue: { today: number; yesterday: number; change: number };
  orders: { today: number; pending: number };
  visitors: { online: number; today: number };
  conversion: { rate: number; change: number };
}

const DEMO_STATS: ShopStats = {
  revenue: { today: 2847, yesterday: 2156, change: 32.1 },
  orders: { today: 48, pending: 12 },
  visitors: { online: 23, today: 1284 },
  conversion: { rate: 3.7, change: 0.5 }
};

const DEMO_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'order', title: 'Nová objednávka #1247', message: 'Martin K. - €127.50', time: 'Pred 2 min', read: false },
  { id: '2', type: 'review', title: 'Nová recenzia ⭐⭐⭐⭐⭐', message: 'Bezdrôtové slúchadlá', time: 'Pred 15 min', read: false },
  { id: '3', type: 'stock', title: 'Nízky stav skladu', message: 'iPhone 15 Pro Max - 3 ks', time: 'Pred 1 hod', read: true },
];

const AVAILABLE_SECTIONS: { type: SectionType; icon: string; name: string; desc: string }[] = [
  { type: 'announcement-bar', icon: '📢', name: 'Oznamovacia lišta', desc: 'Horný banner' },
  { type: 'header', icon: '🔝', name: 'Hlavička', desc: 'Logo, menu, košík' },
  { type: 'hero-slider', icon: '🎠', name: 'Hero Slider', desc: 'Rotujúci banner' },
  { type: 'hero-banner', icon: '🖼️', name: 'Hero Banner', desc: 'Statický banner' },
  { type: 'trust-badges', icon: '✅', name: 'Dôveryhodnosť', desc: 'Výhody obchodu' },
  { type: 'categories-grid', icon: '📦', name: 'Kategórie', desc: 'Mriežka kategórií' },
  { type: 'featured-products', icon: '⭐', name: 'Odporúčané', desc: 'Vybrané produkty' },
  { type: 'product-grid', icon: '🛍️', name: 'Produkty', desc: 'Mriežka produktov' },
  { type: 'promo-banner', icon: '🎯', name: 'Promo Banner', desc: 'Propagačný banner' },
  { type: 'testimonials', icon: '💬', name: 'Recenzie', desc: 'Hodnotenia' },
  { type: 'newsletter', icon: '📧', name: 'Newsletter', desc: 'Prihlásenie k odberu' },
  { type: 'faq-accordion', icon: '❓', name: 'FAQ', desc: 'Časté otázky' },
  { type: 'brand-logos', icon: '🏷️', name: 'Značky', desc: 'Logá partnerov' },
  { type: 'footer', icon: '📋', name: 'Pätička', desc: 'Kontakt, odkazy' },
];

const COLOR_PRESETS = [
  { name: 'Modrá', primary: '#3b82f6', secondary: '#8b5cf6' },
  { name: 'Zelená', primary: '#10b981', secondary: '#06b6d4' },
  { name: 'Červená', primary: '#ef4444', secondary: '#f97316' },
  { name: 'Fialová', primary: '#8b5cf6', secondary: '#ec4899' },
  { name: 'Oranžová', primary: '#f97316', secondary: '#eab308' },
  { name: 'Ružová', primary: '#ec4899', secondary: '#f43f5e' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY COMPONENTS
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
      {isOpen && (
        <div className={`absolute top-full mt-2 ${align === 'right' ? 'right-0' : 'left-0'} ${width} z-[300]`}>
          {children}
        </div>
      )}
    </div>
  );
}

function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap z-[400] shadow-xl">{content}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN BAR
// ═══════════════════════════════════════════════════════════════════════════════

function AdminBar({ 
  shopName, user, isEditing, onToggleEdit, onLogout, stats, notifications, onMarkAllRead
}: { 
  shopName: string; user: { name: string; email: string }; isEditing: boolean; onToggleEdit: () => void; onLogout: () => void;
  stats: ShopStats; notifications: Notification[]; onMarkAllRead: () => void;
}) {
  const [statsOpen, setStatsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotifIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = { order: ShoppingBag, review: Star, stock: Package, success: CheckCircle };
    const Icon = icons[type] || Info;
    return <Icon className="w-5 h-5" />;
  };

  const getNotifColor = (type: string) => {
    const colors: Record<string, string> = { order: 'bg-blue-500/20 text-blue-400', review: 'bg-yellow-500/20 text-yellow-400', stock: 'bg-orange-500/20 text-orange-400', success: 'bg-emerald-500/20 text-emerald-400' };
    return colors[type] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white z-[200] flex items-center justify-between px-4 shadow-2xl border-b border-slate-700/50">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="font-bold text-sm leading-tight">{shopName}</p>
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />Online
            </p>
          </div>
        </Link>

        <div className="hidden lg:block w-px h-8 bg-slate-700" />

        {/* Stats */}
        <Dropdown isOpen={statsOpen} onToggle={() => setStatsOpen(!statsOpen)} align="left" width="w-80"
          trigger={
            <button className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700/50">
              <Euro className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-emerald-400">€{stats.revenue.today.toLocaleString('sk-SK')}</span>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${stats.revenue.change >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {stats.revenue.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stats.revenue.change >= 0 ? '+' : ''}{stats.revenue.change}%
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          }
        >
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700"><h3 className="font-bold text-white flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-400" />Štatistiky</h3></div>
            <div className="p-4 space-y-4">
              <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                <p className="text-gray-400 text-sm mb-1">Tržby dnes</p>
                <p className="text-2xl font-bold text-emerald-400">€{stats.revenue.today.toLocaleString('sk-SK')}</p>
                <p className="text-xs text-gray-500">Včera: €{stats.revenue.yesterday.toLocaleString('sk-SK')}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-700/30 rounded-xl p-3 text-center">
                  <ShoppingBag className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{stats.orders.today}</p>
                  <p className="text-[10px] text-gray-500">Objednávky</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-3 text-center">
                  <Users className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{stats.visitors.today}</p>
                  <p className="text-[10px] text-gray-500">Návštevníci</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-3 text-center">
                  <Target className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{stats.conversion.rate}%</p>
                  <p className="text-[10px] text-gray-500">Konverzia</p>
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-slate-700">
              <Link href="/dashboard/analytics" className="flex items-center justify-center gap-2 py-2 text-sm text-blue-400 hover:text-blue-300 rounded-lg hover:bg-slate-700/50">
                <PieChart className="w-4 h-4" />Analytika<ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Dropdown>

        {/* Live visitors */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative rounded-full h-2 w-2 bg-emerald-500"></span></span>
          <span className="text-emerald-400 text-xs font-semibold">{stats.visitors.online} online</span>
        </div>
      </div>

      {/* Center - Edit Toggle */}
      <div className="flex items-center">
        <Tooltip content={isEditing ? "Ukončiť úpravy" : "Upraviť obchod"}>
          <button onClick={onToggleEdit}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isEditing ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-700/80 hover:bg-slate-600/80 text-white border border-slate-600'
            }`}>
            {isEditing ? <><Eye className="w-4 h-4" /><span className="hidden sm:inline">Náhľad</span></> : <><Paintbrush className="w-4 h-4" /><span className="hidden sm:inline">Upraviť</span></>}
          </button>
        </Tooltip>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Tooltip content="Dashboard"><Link href="/dashboard" className="p-2.5 hover:bg-slate-700/50 rounded-xl text-gray-400 hover:text-white"><LayoutDashboard className="w-5 h-5" /></Link></Tooltip>

        {/* Notifications */}
        <Dropdown isOpen={notifOpen} onToggle={() => setNotifOpen(!notifOpen)} width="w-80"
          trigger={
            <button className="p-2.5 hover:bg-slate-700/50 rounded-xl text-gray-400 hover:text-white relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">{unreadCount}</span>}
            </button>
          }
        >
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2"><Bell className="w-4 h-4 text-blue-400" />Notifikácie</h3>
              {unreadCount > 0 && <button onClick={onMarkAllRead} className="text-xs text-blue-400 hover:text-blue-300">Označiť</button>}
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer ${!n.read ? 'bg-blue-500/5' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getNotifColor(n.type)}`}>{getNotifIcon(n.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{n.time}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 bg-blue-400 rounded-full" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Dropdown>

        <div className="w-px h-8 bg-slate-700 mx-1" />

        {/* User Menu */}
        <Dropdown isOpen={userOpen} onToggle={() => setUserOpen(!userOpen)} width="w-56"
          trigger={
            <button className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-slate-700/50 rounded-xl">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">{user.name.charAt(0)}</div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white leading-tight">{user.name}</p>
                <p className="text-[10px] text-gray-500">Admin</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden md:block" />
            </button>
          }
        >
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold">{user.name.charAt(0)}</div>
                <div><p className="font-bold text-white">{user.name}</p><p className="text-xs text-gray-400">{user.email}</p></div>
              </div>
            </div>
            <div className="p-2">
              <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50"><Settings className="w-4 h-4 text-gray-400" /><span className="text-sm text-white">Nastavenia</span></Link>
              <Link href="/dashboard/help" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50"><HelpCircle className="w-4 h-4 text-gray-400" /><span className="text-sm text-white">Pomoc</span></Link>
            </div>
            <div className="p-2 border-t border-slate-700">
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400"><LogOut className="w-4 h-4" /><span className="text-sm font-medium">Odhlásiť</span></button>
            </div>
          </div>
        </Dropdown>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INLINE EDITOR PANEL
// ═══════════════════════════════════════════════════════════════════════════════

function InlineEditorPanel({
  isOpen, onToggle, selectedSection, onSelectSection, sections, devicePreview, onDeviceChange, onSave, hasUnsavedChanges
}: {
  isOpen: boolean; onToggle: () => void; selectedSection: ShopSection | null; onSelectSection: (s: ShopSection | null) => void;
  sections: ShopSection[]; devicePreview: 'desktop' | 'tablet' | 'mobile'; onDeviceChange: (d: 'desktop' | 'tablet' | 'mobile') => void;
  onSave: () => Promise<void>; hasUnsavedChanges: boolean;
}) {
  const editor = useEditor();
  const { toggleSection, moveSection, removeSection, duplicateSection, updateSectionSettings, undo, redo, canUndo, canRedo, addSection, shopSettings, updateTheme, updateShopSettings } = editor;
  const [activeTab, setActiveTab] = useState<'sections' | 'theme' | 'settings'>('sections');
  const [sectionTab, setSectionTab] = useState<'content' | 'style'>('content');
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleSave = async () => {
    setSaving(true);
    await onSave();
    setLastSaved(new Date());
    setSaving(false);
  };

  const handleAddSection = (type: SectionType) => {
    addSection(type);
    setAddSectionOpen(false);
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[140] lg:hidden" onClick={onToggle} />}
      
      <div className={`fixed top-14 left-0 h-[calc(100vh-56px)] w-[380px] bg-slate-900 shadow-2xl z-[150] transform transition-all duration-300 flex flex-col border-r border-slate-700/50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div><h2 className="font-bold text-white text-sm">Shop Builder</h2><p className="text-[11px] text-gray-500">Vizuálny editor</p></div>
          </div>
          <button onClick={onToggle} className="p-2 hover:bg-slate-700/50 rounded-lg text-gray-500 hover:text-white"><PanelLeftClose className="w-5 h-5" /></button>
        </div>

        {/* Toolbar */}
        <div className="h-12 flex items-center justify-between px-3 border-b border-slate-700/30 bg-slate-800/30">
          <div className="flex items-center gap-1">
            <Tooltip content="Späť"><button onClick={() => undo()} disabled={!canUndo()} className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-30"><Undo className="w-4 h-4 text-gray-400" /></button></Tooltip>
            <Tooltip content="Znova"><button onClick={() => redo()} disabled={!canRedo()} className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-30"><Redo className="w-4 h-4 text-gray-400" /></button></Tooltip>
          </div>
          <div className="flex items-center gap-0.5 bg-slate-800 rounded-xl p-1">
            {[{ id: 'desktop', icon: Monitor }, { id: 'tablet', icon: Tablet }, { id: 'mobile', icon: Smartphone }].map((d) => (
              <button key={d.id} onClick={() => onDeviceChange(d.id as 'desktop' | 'tablet' | 'mobile')} className={`p-1.5 rounded-lg transition-all ${devicePreview === d.id ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}>
                <d.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700/30">
          {[{ id: 'sections', label: 'Sekcie', icon: Layers }, { id: 'theme', label: 'Vzhľad', icon: Palette }, { id: 'settings', label: 'Nastavenia', icon: Settings }].map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id as 'sections' | 'theme' | 'settings'); onSelectSection(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold border-b-2 ${activeTab === tab.id ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-gray-500 hover:text-white'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'sections' && (selectedSection ? (
            <div className="p-4">
              <button onClick={() => onSelectSection(null)} className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 mb-4">
                <ChevronLeft className="w-4 h-4" />Späť
              </button>
              <div className="flex items-center gap-4 mb-5 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <span className="text-3xl">{SECTION_INFO[selectedSection.type]?.icon || '📦'}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{SECTION_INFO[selectedSection.type]?.name || selectedSection.type}</h3>
                  <p className="text-xs text-gray-500">{SECTION_INFO[selectedSection.type]?.description}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4 bg-slate-800/30 rounded-xl p-1">
                {[{ id: 'content', label: 'Obsah', icon: Type }, { id: 'style', label: 'Štýl', icon: Paintbrush }].map((t) => (
                  <button key={t.id} onClick={() => setSectionTab(t.id as 'content' | 'style')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg ${sectionTab === t.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                    <t.icon className="w-3.5 h-3.5" />{t.label}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                {sectionTab === 'content' ? <SectionContentEditor section={selectedSection} update={(k, v) => updateSectionSettings(selectedSection.id, { [k]: v })} /> : <SectionStyleEditor section={selectedSection} update={(k, v) => updateSectionSettings(selectedSection.id, { [k]: v })} />}
              </div>
              <div className="mt-6 pt-5 border-t border-slate-700/50 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => toggleSection(selectedSection.id)} className={`py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 ${selectedSection.enabled ? 'bg-slate-800 text-gray-300 border border-slate-700' : 'bg-emerald-600 text-white'}`}>
                    {selectedSection.enabled ? <><EyeOff className="w-4 h-4" />Skryť</> : <><Eye className="w-4 h-4" />Zobraziť</>}
                  </button>
                  <button onClick={() => duplicateSection(selectedSection.id)} className="py-2 bg-slate-800 rounded-xl text-sm font-medium flex items-center justify-center gap-2 text-gray-300 border border-slate-700"><Copy className="w-4 h-4" />Duplikovať</button>
                </div>
                <button onClick={() => { if (confirm('Odstrániť sekciu?')) { removeSection(selectedSection.id); onSelectSection(null); } }} className="w-full py-2 bg-red-500/10 text-red-400 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border border-red-500/20">
                  <Trash2 className="w-4 h-4" />Odstrániť
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Sekcie ({sections.length})</h3>
                <button onClick={() => setAddSectionOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-xs font-semibold text-white">
                  <Plus className="w-4 h-4" />Pridať
                </button>
              </div>
              <div className="space-y-2">
                {sections.map((section, index) => {
                  const info = SECTION_INFO[section.type] || { icon: '📦', name: section.type };
                  return (
                    <div key={section.id} className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer bg-slate-800/30 hover:bg-slate-800 border border-slate-700/30 hover:border-blue-500/50 ${!section.enabled ? 'opacity-50' : ''}`}>
                      <div className="cursor-grab p-1 hover:bg-slate-700 rounded-lg opacity-50 group-hover:opacity-100"><GripVertical className="w-4 h-4 text-gray-500" /></div>
                      <div className="flex-1 flex items-center gap-3 min-w-0" onClick={() => onSelectSection(section)}>
                        <span className="text-xl">{info.icon}</span>
                        <p className="text-sm font-medium text-white truncate">{info.name}</p>
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                        <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'up'); }} disabled={index === 0} className="p-1 hover:bg-slate-600 rounded disabled:opacity-30"><ChevronUp className="w-4 h-4 text-gray-400" /></button>
                        <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'down'); }} disabled={index === sections.length - 1} className="p-1 hover:bg-slate-600 rounded disabled:opacity-30"><ChevronDown className="w-4 h-4 text-gray-400" /></button>
                        <button onClick={(e) => { e.stopPropagation(); toggleSection(section.id); }} className={`p-1 rounded ${section.enabled ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400" onClick={() => onSelectSection(section)} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {activeTab === 'theme' && (
            <div className="p-4 space-y-6">
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Palette className="w-4 h-4 text-purple-400" />Farebné schémy</h3>
                <div className="grid grid-cols-3 gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button key={preset.name} onClick={() => updateTheme({ primaryColor: preset.primary, secondaryColor: preset.secondary })} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-slate-700 hover:border-blue-500" title={preset.name}>
                      <div className="absolute inset-0 flex"><div className="w-1/2 h-full" style={{ backgroundColor: preset.primary }} /><div className="w-1/2 h-full" style={{ backgroundColor: preset.secondary }} /></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50"><Check className="w-5 h-5 text-white" /></div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white mb-3">Farby</h3>
                <div className="space-y-3">
                  <EditorColor label="Primárna" value={shopSettings.theme.primaryColor} onChange={(v) => updateTheme({ primaryColor: v })} />
                  <EditorColor label="Sekundárna" value={shopSettings.theme.secondaryColor} onChange={(v) => updateTheme({ secondaryColor: v })} />
                  <EditorColor label="Pozadie" value={shopSettings.theme.backgroundColor} onChange={(v) => updateTheme({ backgroundColor: v })} />
                  <EditorColor label="Text" value={shopSettings.theme.textColor} onChange={(v) => updateTheme({ textColor: v })} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white mb-3">Typografia</h3>
                <EditorSelect label="Font" value={shopSettings.theme.fontFamily} onChange={(v) => updateTheme({ fontFamily: v })} options={[
                  { value: 'Inter, sans-serif', label: 'Inter' },
                  { value: 'Roboto, sans-serif', label: 'Roboto' },
                  { value: 'Poppins, sans-serif', label: 'Poppins' },
                ]} />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-4 space-y-6">
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Store className="w-4 h-4 text-emerald-400" />Všeobecné</h3>
                <div className="space-y-3">
                  <EditorInput label="Názov obchodu" value={shopSettings.name} onChange={(v) => updateShopSettings({ name: v })} placeholder="Môj Obchod" />
                  <EditorInput label="Popis" value={shopSettings.description} onChange={(v) => updateShopSettings({ description: v })} multiline placeholder="Popis..." />
                  <EditorInput label="Email" value={shopSettings.email} onChange={(v) => updateShopSettings({ email: v })} placeholder="info@shop.sk" />
                  <EditorInput label="Telefón" value={shopSettings.phone} onChange={(v) => updateShopSettings({ phone: v })} placeholder="+421 900 123 456" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Truck className="w-4 h-4 text-blue-400" />Doprava</h3>
                <EditorNumber label="Doprava zadarmo od (€)" value={shopSettings.freeShippingThreshold} onChange={(v) => updateShopSettings({ freeShippingThreshold: v })} min={0} max={1000} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Globe className="w-4 h-4 text-purple-400" />SEO</h3>
                <div className="space-y-3">
                  <EditorInput label="Meta titulok" value={shopSettings.metaTitle} onChange={(v) => updateShopSettings({ metaTitle: v })} placeholder="Titulok" />
                  <EditorInput label="Meta popis" value={shopSettings.metaDescription} onChange={(v) => updateShopSettings({ metaDescription: v })} multiline placeholder="Popis..." />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 space-y-3">
          {hasUnsavedChanges && !saving && <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400"><AlertCircle className="w-4 h-4" /><span className="text-xs font-medium">Neuložené zmeny</span></div>}
          {lastSaved && !hasUnsavedChanges && <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400"><CheckCircle className="w-4 h-4" /><span className="text-xs font-medium">Uložené</span></div>}
          <button onClick={handleSave} disabled={!hasUnsavedChanges || saving} className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${hasUnsavedChanges && !saving ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg' : 'bg-slate-800 text-gray-500 cursor-not-allowed border border-slate-700'}`}>
            {saving ? <><Loader2 className="w-5 h-5 animate-spin" />Ukladám...</> : <><Save className="w-5 h-5" />{hasUnsavedChanges ? 'Uložiť' : 'Uložené'}</>}
          </button>
        </div>
      </div>

      {!isOpen && <button onClick={onToggle} className="fixed top-20 left-4 z-[150] w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl shadow-2xl flex items-center justify-center hover:scale-110 transition-all"><PanelLeftOpen className="w-6 h-6" /></button>}

      {/* Add Section Modal */}
      {addSectionOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setAddSectionOpen(false)} />
          <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Pridať sekciu</h3>
              <button onClick={() => setAddSectionOpen(false)} className="p-2 hover:bg-slate-700 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-5 max-h-80 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_SECTIONS.map((section) => (
                  <button key={section.type} onClick={() => handleAddSection(section.type)} className="flex items-start gap-3 p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 hover:border-blue-500/50 text-left">
                    <span className="text-2xl">{section.icon}</span>
                    <div><p className="font-semibold text-white text-sm">{section.name}</p><p className="text-[11px] text-gray-500">{section.desc}</p></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EDITOR COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function SectionContentEditor({ section, update }: { section: ShopSection; update: (k: string, v: unknown) => void }) {
  const s = section.settings || {};
  switch (section.type) {
    case 'hero-slider': case 'hero-banner':
      return (<><EditorInput label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} /><EditorInput label="Podnadpis" value={s.subtitle || ''} onChange={(v) => update('subtitle', v)} multiline /><EditorInput label="Text tlačidla" value={s.buttonText || ''} onChange={(v) => update('buttonText', v)} /><EditorInput label="Link" value={s.buttonLink || ''} onChange={(v) => update('buttonLink', v)} /><EditorToggle label="Autoplay" checked={s.autoplay !== false} onChange={(v) => update('autoplay', v)} /></>);
    case 'announcement-bar':
      return (<><EditorInput label="Text" value={s.text || ''} onChange={(v) => update('text', v)} /><EditorInput label="Link" value={s.link || ''} onChange={(v) => update('link', v)} /><EditorToggle label="Zatvoriteľné" checked={s.closable === true} onChange={(v) => update('closable', v)} /></>);
    case 'header':
      return (<><EditorInput label="Logo text" value={s.logoText || ''} onChange={(v) => update('logoText', v)} /><EditorToggle label="Sticky" checked={s.sticky !== false} onChange={(v) => update('sticky', v)} /><EditorToggle label="Vyhľadávanie" checked={s.showSearch !== false} onChange={(v) => update('showSearch', v)} /><EditorToggle label="Košík" checked={s.showCart !== false} onChange={(v) => update('showCart', v)} /></>);
    case 'featured-products': case 'product-grid':
      return (<><EditorInput label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} /><EditorInput label="Podnadpis" value={s.subtitle || ''} onChange={(v) => update('subtitle', v)} /><EditorNumber label="Počet produktov" value={s.count || 8} onChange={(v) => update('count', v)} min={1} max={24} /><EditorToggle label="Hodnotenia" checked={s.showRating !== false} onChange={(v) => update('showRating', v)} /></>);
    case 'newsletter':
      return (<><EditorInput label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} /><EditorInput label="Popis" value={s.description || ''} onChange={(v) => update('description', v)} multiline /><EditorInput label="Text tlačidla" value={s.buttonText || ''} onChange={(v) => update('buttonText', v)} /></>);
    case 'testimonials':
      return (<><EditorInput label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} /><EditorToggle label="Hviezdy" checked={s.showStars !== false} onChange={(v) => update('showStars', v)} /></>);
    case 'faq-accordion':
      return (<><EditorInput label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} /><EditorToggle label="Prvá otvorená" checked={s.firstOpen !== false} onChange={(v) => update('firstOpen', v)} /></>);
    case 'footer':
      return (<><EditorInput label="Copyright" value={s.copyright || ''} onChange={(v) => update('copyright', v)} /><EditorToggle label="Sociálne siete" checked={s.showSocial !== false} onChange={(v) => update('showSocial', v)} /><EditorToggle label="Platby" checked={s.showPayments !== false} onChange={(v) => update('showPayments', v)} /></>);
    default:
      return <div className="text-center py-6 text-gray-500 text-sm">Editor pre túto sekciu</div>;
  }
}

function SectionStyleEditor({ section, update }: { section: ShopSection; update: (k: string, v: unknown) => void }) {
  const s = section.settings || {};
  return (<><EditorColor label="Pozadie" value={s.backgroundColor || '#ffffff'} onChange={(v) => update('backgroundColor', v)} /><EditorColor label="Text" value={s.textColor || '#1f2937'} onChange={(v) => update('textColor', v)} /><EditorNumber label="Padding Y" value={s.paddingY || 48} onChange={(v) => update('paddingY', v)} min={0} max={200} /><EditorNumber label="Padding X" value={s.paddingX || 16} onChange={(v) => update('paddingX', v)} min={0} max={100} /></>);
}

function EditorInput({ label, value, onChange, multiline = false, placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string }) {
  return (<div><label className="block text-xs font-semibold text-gray-400 mb-1.5">{label}</label>{multiline ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white resize-none focus:outline-none focus:border-blue-500 placeholder-gray-500" /> : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 placeholder-gray-500" />}</div>);
}

function EditorNumber({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (<div><label className="block text-xs font-semibold text-gray-400 mb-1.5">{label}</label><input type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value) || 0)} min={min} max={max} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500" /></div>);
}

function EditorColor({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (<div><label className="block text-xs font-semibold text-gray-400 mb-1.5">{label}</label><div className="flex gap-2"><input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-10 h-9 rounded-lg cursor-pointer border-2 border-slate-700" /><input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-blue-500" /></div></div>);
}

function EditorSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (<div><label className="block text-xs font-semibold text-gray-400 mb-1.5">{label}</label><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer">{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>);
}

function EditorToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (<div className="flex items-center justify-between py-1.5"><span className="text-sm font-medium text-gray-300">{label}</span><button onClick={() => onChange(!checked)} className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-blue-600' : 'bg-slate-700'}`}><div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} /></button></div>);
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function StarRating({ rating }: { rating: number }) {
  return <div className="flex items-center gap-0.5">{[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-4 h-4 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}</div>;
}

function AnnouncementBarSection({ section }: { section: ShopSection }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (<div className="relative text-center py-2.5 px-4" style={{ backgroundColor: section.settings?.backgroundColor || '#0f172a', color: section.settings?.textColor || '#ffffff' }}><p className="text-sm font-medium">{section.settings?.text || '🚚 Doprava zadarmo nad €50'}</p>{section.settings?.closable && <button onClick={() => setVisible(false)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"><X className="w-4 h-4" /></button>}</div>);
}

function HeaderSection({ section, theme, cartCount, onCartClick }: { section: ShopSection; theme: ShopTheme; cartCount: number; onCartClick: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className={`${section.settings?.sticky ? 'sticky top-14 z-40' : ''} border-b`} style={{ backgroundColor: section.settings?.backgroundColor || '#ffffff', borderColor: theme.borderColor }}>
      <div className="max-w-7xl mx-auto px-4 h-[72px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: theme.primaryColor }}><Sparkles className="w-6 h-6 text-white" /></div><span className="font-bold text-xl hidden sm:block">{section.settings?.logoText || 'Demo Shop'}</span></Link>
        <nav className="hidden lg:flex items-center gap-6">{['Domov', 'Produkty', 'Akcie', 'Kontakt'].map((item) => <Link key={item} href="#" className="text-sm font-medium hover:opacity-70">{item}</Link>)}</nav>
        <div className="flex items-center gap-2">
          {section.settings?.showSearch !== false && <button className="p-2 hover:bg-gray-100 rounded-lg"><Search className="w-5 h-5" /></button>}
          {section.settings?.showCart !== false && <button onClick={onCartClick} className="p-2 hover:bg-gray-100 rounded-lg relative"><ShoppingCart className="w-5 h-5" />{cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white" style={{ backgroundColor: theme.primaryColor }}>{cartCount}</span>}</button>}
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"><Menu className="w-5 h-5" /></button>
        </div>
      </div>
      {mobileMenuOpen && <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} /><div className="absolute top-0 right-0 bottom-0 w-80 bg-white shadow-xl"><div className="p-4 border-b flex items-center justify-between"><span className="font-bold">Menu</span><button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button></div><nav className="p-4 space-y-1">{['Domov', 'Produkty', 'Akcie', 'Kontakt'].map((item) => <Link key={item} href="#" className="block px-4 py-3 rounded-lg hover:bg-gray-100 font-medium" onClick={() => setMobileMenuOpen(false)}>{item}</Link>)}</nav></div></div>}
    </header>
  );
}

function HeroSliderSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  return (
    <div className="relative h-[500px] overflow-hidden flex items-center justify-center" style={{ backgroundColor: section.settings?.backgroundColor || '#1e293b' }}>
      <div className="text-center text-white px-4 max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">{section.settings?.title || 'Nová kolekcia 2024'}</h2>
        <p className="text-xl opacity-80 mb-8">{section.settings?.subtitle || 'Objavte najnovšie produkty'}</p>
        {section.settings?.buttonText && <Link href={section.settings?.buttonLink || '/produkty'} className="inline-block px-8 py-3 rounded-xl font-semibold text-white hover:scale-105 transition-transform" style={{ backgroundColor: theme.primaryColor }}>{section.settings?.buttonText}</Link>}
      </div>
    </div>
  );
}

function TrustBadgesSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const badges = [{ icon: Truck, title: 'Doprava zadarmo', sub: 'Nad €50' }, { icon: Shield, title: 'Bezpečná platba', sub: '100% secure' }, { icon: RotateCcw, title: '30 dní vrátenie', sub: 'Bez problémov' }, { icon: Headphones, title: 'Podpora', sub: 'Po-Pi 9-17' }];
  return (<div className="py-8 border-y" style={{ borderColor: theme.borderColor, backgroundColor: section.settings?.backgroundColor || '#f8fafc' }}><div className="max-w-7xl mx-auto px-4"><div className="grid grid-cols-2 md:grid-cols-4 gap-6">{badges.map((b, i) => <div key={i} className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${theme.primaryColor}15` }}><b.icon className="w-6 h-6" style={{ color: theme.primaryColor }} /></div><div><p className="font-semibold text-sm">{b.title}</p><p className="text-xs text-gray-500">{b.sub}</p></div></div>)}</div></div></div>);
}

function ProductsSection({ section, theme, onAddToCart }: { section: ShopSection; theme: ShopTheme; onAddToCart: (p: { id: string; name: string; price: number }) => void }) {
  const products = demoProducts.slice(0, section.settings?.count || 8);
  return (
    <div className="py-12" style={{ backgroundColor: section.settings?.backgroundColor || '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4">
        {section.settings?.title && <div className="text-center mb-8"><h2 className="text-2xl font-bold">{section.settings?.title}</h2>{section.settings?.subtitle && <p className="text-gray-500 mt-2">{section.settings?.subtitle}</p>}</div>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{products.map((p) => <div key={p.id} className="group"><div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4 relative">{p.badge && <span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded-lg text-white" style={{ backgroundColor: theme.primaryColor }}>{p.badge}</span>}<div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors"><button onClick={() => onAddToCart({ id: p.id, name: p.name, price: p.price })} className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white rounded-xl shadow-lg font-medium text-sm transition-all translate-y-2 group-hover:translate-y-0">Do košíka</button></div></div><h3 className="font-medium mb-1 truncate">{p.name}</h3>{section.settings?.showRating !== false && <div className="mb-1"><StarRating rating={p.rating || 4} /></div>}<div className="flex items-center gap-2"><span className="font-bold" style={{ color: theme.primaryColor }}>{formatPrice(p.price)}</span>{p.comparePrice && <span className="text-sm text-gray-400 line-through">{formatPrice(p.comparePrice)}</span>}</div></div>)}</div>
      </div>
    </div>
  );
}

function CategoriesGridSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const cats = ['Elektronika', 'Oblečenie', 'Dom & Záhrada', 'Šport'];
  return (<div className="py-12" style={{ backgroundColor: section.settings?.backgroundColor || '#ffffff' }}><div className="max-w-7xl mx-auto px-4">{section.settings?.title && <h2 className="text-2xl font-bold mb-8 text-center">{section.settings?.title}</h2>}<div className="grid grid-cols-2 md:grid-cols-4 gap-4">{cats.map((c) => <Link key={c} href="#" className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100"><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><div className="absolute bottom-4 left-4"><p className="text-white font-semibold text-lg">{c}</p></div></Link>)}</div></div></div>);
}

function TestimonialsSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const testimonials = [{ name: 'Mária K.', text: 'Skvelý obchod!', rating: 5 }, { name: 'Peter N.', text: 'Výborná podpora.', rating: 5 }, { name: 'Jana S.', text: 'Spokojná zákazníčka.', rating: 4 }];
  return (<div className="py-12" style={{ backgroundColor: section.settings?.backgroundColor || '#f8fafc' }}><div className="max-w-7xl mx-auto px-4">{section.settings?.title && <h2 className="text-2xl font-bold mb-8 text-center">{section.settings?.title}</h2>}<div className="grid md:grid-cols-3 gap-6">{testimonials.map((t, i) => <div key={i} className="bg-white p-6 rounded-2xl shadow-sm"><Quote className="w-8 h-8 mb-4" style={{ color: theme.primaryColor }} /><p className="text-gray-600 mb-4">{t.text}</p><div className="flex items-center justify-between"><span className="font-medium">{t.name}</span>{section.settings?.showStars !== false && <StarRating rating={t.rating} />}</div></div>)}</div></div></div>);
}

function NewsletterSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  return (<div className="py-16" style={{ backgroundColor: section.settings?.backgroundColor || theme.primaryColor }}><div className="max-w-2xl mx-auto px-4 text-center"><h2 className="text-2xl font-bold mb-4 text-white">{section.settings?.title || 'Prihláste sa'}</h2><p className="mb-8 text-white/80">{section.settings?.description || 'Získajte novinky a zľavy'}</p><div className="flex gap-3 max-w-md mx-auto"><input type="email" placeholder="Váš email..." className="flex-1 px-4 py-3 rounded-xl focus:outline-none" /><button className="px-6 py-3 bg-white rounded-xl font-semibold" style={{ color: theme.primaryColor }}>{section.settings?.buttonText || 'Odoberať'}</button></div></div></div>);
}

function FAQSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const [open, setOpen] = useState<number | null>(section.settings?.firstOpen !== false ? 0 : null);
  const faqs = [{ q: 'Ako sledovať objednávku?', a: 'Email s trackingom.' }, { q: 'Možnosti platby?', a: 'Karty, PayPal, dobierka.' }, { q: 'Vrátenie tovaru?', a: '30 dní bez problémov.' }];
  return (<div className="py-12" style={{ backgroundColor: section.settings?.backgroundColor || '#ffffff' }}><div className="max-w-3xl mx-auto px-4">{section.settings?.title && <h2 className="text-2xl font-bold mb-8 text-center">{section.settings?.title}</h2>}<div className="space-y-3">{faqs.map((f, i) => <div key={i} className="border rounded-xl overflow-hidden" style={{ borderColor: theme.borderColor }}><button onClick={() => setOpen(open === i ? null : i)} className="w-full px-6 py-4 flex items-center justify-between text-left font-medium hover:bg-gray-50">{f.q}<ChevronDown className={`w-5 h-5 transition-transform ${open === i ? 'rotate-180' : ''}`} /></button>{open === i && <div className="px-6 pb-4 text-gray-600">{f.a}</div>}</div>)}</div></div></div>);
}

function PromoBannerSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  return (<div className="py-16 text-center" style={{ backgroundColor: section.settings?.backgroundColor || theme.primaryColor, color: '#ffffff' }}><div className="max-w-4xl mx-auto px-4"><h2 className="text-3xl font-bold mb-4">{section.settings?.title || 'Špeciálna ponuka'}</h2><p className="text-xl opacity-80 mb-8">{section.settings?.subtitle || 'Limitovaná akcia'}</p>{section.settings?.buttonText && <Link href={section.settings?.buttonLink || '/'} className="inline-block px-8 py-3 bg-white rounded-xl font-semibold" style={{ color: theme.primaryColor }}>{section.settings?.buttonText}</Link>}</div></div>);
}

function BrandLogosSection({ section }: { section: ShopSection }) {
  return (<div className="py-12" style={{ backgroundColor: section.settings?.backgroundColor || '#ffffff' }}><div className="max-w-7xl mx-auto px-4">{section.settings?.title && <h2 className="text-2xl font-bold mb-8 text-center">{section.settings?.title}</h2>}<div className="flex flex-wrap items-center justify-center gap-8 opacity-50">{[1,2,3,4,5,6].map((i) => <div key={i} className="w-24 h-12 bg-gray-200 rounded-lg" />)}</div></div></div>);
}

function FooterSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  return (
    <footer className="py-12" style={{ backgroundColor: section.settings?.backgroundColor || '#0f172a', color: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div><div className="flex items-center gap-2 mb-4"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: theme.primaryColor }}><Sparkles className="w-6 h-6 text-white" /></div><span className="font-bold text-xl">Shop</span></div><p className="text-sm opacity-60">Váš spoľahlivý obchod.</p></div>
          <div><h4 className="font-semibold mb-4">Obchod</h4><div className="space-y-2 text-sm opacity-60"><Link href="#" className="block hover:opacity-100">Produkty</Link><Link href="#" className="block hover:opacity-100">Kategórie</Link><Link href="#" className="block hover:opacity-100">Akcie</Link></div></div>
          <div><h4 className="font-semibold mb-4">Podpora</h4><div className="space-y-2 text-sm opacity-60"><Link href="#" className="block hover:opacity-100">Kontakt</Link><Link href="#" className="block hover:opacity-100">FAQ</Link><Link href="#" className="block hover:opacity-100">Doprava</Link></div></div>
          <div><h4 className="font-semibold mb-4">Kontakt</h4><div className="space-y-2 text-sm opacity-60"><p className="flex items-center gap-2"><Mail className="w-4 h-4" />info@shop.sk</p><p className="flex items-center gap-2"><Phone className="w-4 h-4" />+421 900 123 456</p></div>{section.settings?.showSocial !== false && <div className="flex gap-3 mt-4"><a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><Facebook className="w-5 h-5" /></a><a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><Instagram className="w-5 h-5" /></a></div>}</div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"><p className="text-sm opacity-60">{section.settings?.copyright || `© ${new Date().getFullYear()} Shop`}</p>{section.settings?.showPayments !== false && <div className="flex items-center gap-3"><CreditCard className="w-8 h-8 opacity-40" /><Banknote className="w-8 h-8 opacity-40" /></div>}</div>
      </div>
    </footer>
  );
}

// Cart Sidebar
function CartSidebar({ theme, freeShippingThreshold }: { theme: ShopTheme; freeShippingThreshold: number }) {
  const cart = useCart();
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, total, count } = cart;
  const remaining = freeShippingThreshold - total();
  const progress = Math.min((total() / freeShippingThreshold) * 100, 100);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100]"><div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
      <div className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="p-4 border-b flex items-center justify-between"><h2 className="font-bold text-lg flex items-center gap-2"><ShoppingCart className="w-5 h-5" />Košík ({count()})</h2><button onClick={() => setCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button></div>
        {remaining > 0 && <div className="p-4 bg-blue-50 border-b"><p className="text-sm text-blue-800 mb-2">Ešte <strong>{formatPrice(remaining)}</strong> do dopravy zadarmo!</p><div className="h-2 bg-blue-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: theme.primaryColor }} /></div></div>}
        <div className="flex-1 overflow-y-auto p-4">{items.length === 0 ? <div className="text-center py-12"><ShoppingCart className="w-16 h-16 mx-auto text-gray-200 mb-4" /><p className="text-gray-500">Prázdny košík</p></div> : <div className="space-y-4">{items.map((item) => <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl"><div className="w-20 h-20 bg-gray-200 rounded-lg" /><div className="flex-1 min-w-0"><p className="font-medium truncate">{item.name}</p><p className="font-bold mt-1" style={{ color: theme.primaryColor }}>{formatPrice(item.price)}</p><div className="flex items-center gap-2 mt-2"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-white border flex items-center justify-center"><Minus className="w-3 h-3" /></button><span className="w-8 text-center text-sm">{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-white border flex items-center justify-center"><Plus className="w-3 h-3" /></button></div></div><button onClick={() => removeItem(item.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></div>)}</div>}</div>
        {items.length > 0 && <div className="p-4 border-t bg-gray-50"><div className="flex items-center justify-between mb-4"><span className="font-medium">Celkom</span><span className="text-xl font-bold" style={{ color: theme.primaryColor }}>{formatPrice(total())}</span></div><Link href="/checkout" className="block w-full py-3 text-center rounded-xl font-semibold text-white" style={{ backgroundColor: theme.primaryColor }} onClick={() => setCartOpen(false)}>Pokladňa</Link></div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const editor = useEditor();
  const cart = useCart();
  const { shopSettings, hasUnsavedChanges, saveChanges } = editor;
  const { theme, sections } = shopSettings;
  const sortedSections = [...sections].sort((a, b) => a.order - b.order).filter(s => s.enabled);
  const allSections = [...sections].sort((a, b) => a.order - b.order);

  const [user] = useState({ name: 'Demo User', email: 'demo@eshopbuilder.sk' });
  const [isOwner, setIsOwner] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<ShopSection | null>(null);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [stats] = useState<ShopStats>(DEMO_STATS);
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);

  const shopName = shopSettings.name || 'Demo Shop';

  useEffect(() => { console.log('ADMIN BAR PRO v10 LOADED'); }, []);

  const handleLogout = () => { localStorage.clear(); setIsOwner(false); setIsEditing(false); router.refresh(); };
  const handleToggleEdit = () => { if (isEditing) { setIsEditing(false); setEditorOpen(false); setSelectedSection(null); } else { setIsEditing(true); setEditorOpen(true); } };
  const handleMarkAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const handleSave = async () => { await saveChanges(); };
  const handleAddToCart = (product: { id: string; name: string; price: number }) => { cart.addItem(product); };

  const renderSection = (section: ShopSection) => {
    const props = { section, theme };
    switch (section.type) {
      case 'announcement-bar': return <AnnouncementBarSection section={section} />;
      case 'header': return <HeaderSection {...props} cartCount={cart.count()} onCartClick={() => cart.setCartOpen(true)} />;
      case 'hero-slider': case 'hero-banner': return <HeroSliderSection {...props} />;
      case 'trust-badges': return <TrustBadgesSection {...props} />;
      case 'categories-grid': return <CategoriesGridSection {...props} />;
      case 'featured-products': case 'product-grid': return <ProductsSection {...props} onAddToCart={handleAddToCart} />;
      case 'promo-banner': return <PromoBannerSection {...props} />;
      case 'testimonials': return <TestimonialsSection {...props} />;
      case 'faq-accordion': return <FAQSection {...props} />;
      case 'newsletter': return <NewsletterSection {...props} />;
      case 'brand-logos': return <BrandLogosSection section={section} />;
      case 'footer': return <FooterSection {...props} />;
      default: return <div className="py-12 text-center bg-gray-100"><p className="text-gray-500">Sekcia: {section.type}</p></div>;
    }
  };

  const topOffset = isOwner ? 56 : 0;
  const getPreviewStyle = (): React.CSSProperties => {
    if (!isEditing) return {};
    switch (devicePreview) {
      case 'tablet': return { maxWidth: '768px', margin: '0 auto', boxShadow: '0 0 0 1px rgba(0,0,0,0.1)' };
      case 'mobile': return { maxWidth: '375px', margin: '0 auto', boxShadow: '0 0 0 1px rgba(0,0,0,0.1)' };
      default: return {};
    }
  };

  return (
    <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      {isOwner && <AdminBar shopName={shopName} user={user} isEditing={isEditing} onToggleEdit={handleToggleEdit} onLogout={handleLogout} stats={stats} notifications={notifications} onMarkAllRead={handleMarkAllRead} />}
      {isOwner && isEditing && <InlineEditorPanel isOpen={editorOpen} onToggle={() => setEditorOpen(!editorOpen)} selectedSection={selectedSection} onSelectSection={setSelectedSection} sections={allSections} devicePreview={devicePreview} onDeviceChange={setDevicePreview} onSave={handleSave} hasUnsavedChanges={hasUnsavedChanges} />}

      <div style={{ marginTop: topOffset, marginLeft: isEditing && editorOpen ? 380 : 0, transition: 'margin-left 0.3s ease', ...getPreviewStyle() }}>
        {sortedSections.map((section) => (
          <div key={section.id} className={`relative ${isEditing ? 'group cursor-pointer' : ''}`} onClick={isEditing ? () => { setSelectedSection(section); setEditorOpen(true); } : undefined}>
            {isEditing && <div className={`absolute inset-0 z-10 pointer-events-none transition-all border-2 ${selectedSection?.id === section.id ? 'border-blue-500 bg-blue-500/5' : 'border-transparent group-hover:border-dashed group-hover:border-blue-400/50'}`}><div className={`absolute top-2 left-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-lg flex items-center gap-2 ${selectedSection?.id === section.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}><span>{SECTION_INFO[section.type]?.icon || '📦'}</span>{SECTION_INFO[section.type]?.name || section.type}</div></div>}
            {renderSection(section)}
          </div>
        ))}
      </div>

      <CartSidebar theme={theme} freeShippingThreshold={shopSettings.freeShippingThreshold} />

      {isOwner && !isEditing && <button onClick={handleToggleEdit} className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all"><Paintbrush className="w-6 h-6" /></button>}
    </div>
  );
}
