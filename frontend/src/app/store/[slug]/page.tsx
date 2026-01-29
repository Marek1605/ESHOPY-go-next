'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingCart, Heart, Search, User, Menu, X, ChevronLeft, ChevronRight, 
  Star, Truck, Shield, RotateCcw, Headphones, Plus, Minus, Check, 
  Facebook, Instagram, Mail, Phone, ChevronDown, ChevronUp, Quote, Sparkles, ArrowRight,
  CreditCard, Smartphone, AlertCircle, ExternalLink, Eye, Package,
  Palette, Save, Layers, GripVertical, EyeOff, Trash2, Copy, Settings,
  LayoutDashboard, ShoppingBag, Users, TrendingUp, Bell, LogOut, Edit3,
  PanelLeftClose, PanelLeftOpen, Undo, Redo, Monitor, Tablet,
  BarChart3, Euro, Zap, Type, Percent, HelpCircle, RefreshCw, Globe,
  Target, TrendingDown, Banknote, Receipt, PieChart, CheckCircle, Info,
  Loader2, Keyboard, Paintbrush, Layout, Grid, FileText, Share2, Megaphone,
  Store, Wand2
} from 'lucide-react';
import { useCart, useEditor, demoProducts, formatPrice, ShopSection, ShopTheme, SECTION_INFO } from '@/lib/store';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

interface Notification {
  id: string;
  type: 'order' | 'review' | 'stock' | 'info' | 'warning' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface ShopStats {
  revenue: { today: number; yesterday: number; week: number; month: number; change: number };
  orders: { today: number; pending: number; processing: number };
  visitors: { online: number; today: number; unique: number };
  conversion: { rate: number; change: number };
  averageOrder: number;
}

const DEMO_STATS: ShopStats = {
  revenue: { today: 2847, yesterday: 2156, week: 18420, month: 67890, change: 32.1 },
  orders: { today: 48, pending: 12, processing: 8 },
  visitors: { online: 23, today: 1284, unique: 892 },
  conversion: { rate: 3.7, change: 0.5 },
  averageOrder: 59.31
};

const DEMO_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'order', title: 'Nová objednávka #1247', message: 'Martin K. objednal 3 produkty za €127.50', time: 'Pred 2 min', read: false },
  { id: '2', type: 'order', title: 'Nová objednávka #1246', message: 'Jana M. objednala iPhone 15 Pro', time: 'Pred 8 min', read: false },
  { id: '3', type: 'review', title: 'Nová recenzia ⭐⭐⭐⭐⭐', message: 'Peter S. ohodnotil "Bezdrôtové slúchadlá"', time: 'Pred 15 min', read: false },
  { id: '4', type: 'stock', title: 'Nízky stav skladu', message: 'iPhone 15 Pro Max - zostávajú 3 ks', time: 'Pred 1 hod', read: true },
  { id: '5', type: 'success', title: 'Platba prijatá', message: 'Objednávka #1245 bola úspešne zaplatená', time: 'Pred 2 hod', read: true },
];

const QUICK_ACTIONS = [
  { id: 'new-product', label: 'Nový produkt', desc: 'Pridať do katalógu', icon: Plus, href: '/dashboard/products/new', color: 'emerald' },
  { id: 'new-order', label: 'Nová objednávka', desc: 'Manuálna objednávka', icon: ShoppingBag, href: '/dashboard/orders/new', color: 'blue' },
  { id: 'new-discount', label: 'Nová zľava', desc: 'Zľavový kód', icon: Percent, href: '/dashboard/discounts/new', color: 'purple' },
  { id: 'new-page', label: 'Nová stránka', desc: 'Landing page', icon: FileText, href: '/dashboard/pages/new', color: 'orange' },
];

const AVAILABLE_SECTIONS = [
  { type: 'announcement-bar', icon: '📢', name: 'Oznamovacia lišta', desc: 'Horný banner', cat: 'header' },
  { type: 'header', icon: '🔝', name: 'Hlavička', desc: 'Logo, menu, košík', cat: 'header' },
  { type: 'hero-slider', icon: '🎠', name: 'Hero Slider', desc: 'Rotujúci banner', cat: 'hero' },
  { type: 'hero-banner', icon: '🖼️', name: 'Hero Banner', desc: 'Statický banner', cat: 'hero' },
  { type: 'trust-badges', icon: '✅', name: 'Dôveryhodnosť', desc: 'Výhody obchodu', cat: 'content' },
  { type: 'categories-grid', icon: '📦', name: 'Kategórie', desc: 'Mriežka kategórií', cat: 'content' },
  { type: 'featured-products', icon: '⭐', name: 'Odporúčané', desc: 'Vybrané produkty', cat: 'products' },
  { type: 'product-grid', icon: '🛍️', name: 'Produkty', desc: 'Mriežka produktov', cat: 'products' },
  { type: 'bestsellers', icon: '🏆', name: 'Bestsellery', desc: 'Najpredávanejšie', cat: 'products' },
  { type: 'promo-banner', icon: '🎯', name: 'Promo Banner', desc: 'Propagačný banner', cat: 'marketing' },
  { type: 'testimonials', icon: '💬', name: 'Recenzie', desc: 'Hodnotenia', cat: 'social' },
  { type: 'newsletter', icon: '📧', name: 'Newsletter', desc: 'Prihlásenie k odberu', cat: 'marketing' },
  { type: 'faq-accordion', icon: '❓', name: 'FAQ', desc: 'Časté otázky', cat: 'content' },
  { type: 'brand-logos', icon: '🏷️', name: 'Značky', desc: 'Logá partnerov', cat: 'content' },
  { type: 'footer', icon: '📋', name: 'Pätička', desc: 'Kontakt, odkazy', cat: 'footer' },
];

const COLOR_PRESETS = [
  { name: 'Modrá', primary: '#3b82f6', secondary: '#8b5cf6' },
  { name: 'Zelená', primary: '#10b981', secondary: '#06b6d4' },
  { name: 'Červená', primary: '#ef4444', secondary: '#f97316' },
  { name: 'Fialová', primary: '#8b5cf6', secondary: '#ec4899' },
  { name: 'Oranžová', primary: '#f97316', secondary: '#eab308' },
  { name: 'Ružová', primary: '#ec4899', secondary: '#f43f5e' },
  { name: 'Tyrkysová', primary: '#06b6d4', secondary: '#14b8a6' },
  { name: 'Tmavá', primary: '#1e293b', secondary: '#475569' },
];

const FONTS = [
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'Poppins, sans-serif', label: 'Poppins' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
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
        <div className={`absolute top-full mt-2 ${align === 'right' ? 'right-0' : 'left-0'} ${width} z-[300] animate-in fade-in slide-in-from-top-2 duration-200`}>
          {children}
        </div>
      )}
    </div>
  );
}

function Tooltip({ children, content, side = 'bottom' }: { children: React.ReactNode; content: string; side?: 'top' | 'bottom' }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className={`absolute ${side === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'} left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap z-[400] shadow-xl`}>
          {content}
        </div>
      )}
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-700 text-gray-300 rounded border border-slate-600">{children}</kbd>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN BAR - Profesionálny WordPress/Shopify štýl
// ═══════════════════════════════════════════════════════════════════════════════

function AdminBar({ 
  shopName, shopSlug, user, isEditing, onToggleEdit, onLogout, stats, notifications, onMarkAllRead
}: { 
  shopName: string; shopSlug: string; user: any; isEditing: boolean; onToggleEdit: () => void; onLogout: () => void;
  stats: ShopStats; notifications: Notification[]; onMarkAllRead: () => void;
}) {
  const [statsOpen, setStatsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') { e.preventDefault(); onToggleEdit(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleEdit]);

  const getNotifIcon = (type: string) => {
    const icons: Record<string, any> = { order: ShoppingBag, review: Star, stock: Package, warning: AlertCircle, success: CheckCircle, info: Info };
    const Icon = icons[type] || Info;
    return <Icon className="w-5 h-5" />;
  };

  const getNotifColor = (type: string) => {
    const colors: Record<string, string> = { order: 'bg-blue-500/20 text-blue-400', review: 'bg-yellow-500/20 text-yellow-400', stock: 'bg-orange-500/20 text-orange-400', warning: 'bg-red-500/20 text-red-400', success: 'bg-emerald-500/20 text-emerald-400' };
    return colors[type] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white z-[200] flex items-center justify-between px-4 shadow-2xl border-b border-slate-700/50">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl transition-all group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="font-bold text-sm leading-tight">{shopName}</p>
            <p className="text-[10px] text-gray-400 leading-tight flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />Online
            </p>
          </div>
        </Link>

        <div className="hidden lg:block w-px h-8 bg-slate-700" />

        {/* Stats Dropdown */}
        <Dropdown isOpen={statsOpen} onToggle={() => setStatsOpen(!statsOpen)} align="left" width="w-96"
          trigger={
            <button className="hidden lg:flex items-center gap-4 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Euro className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-400">Tržby</p>
                  <p className="text-sm font-bold text-emerald-400">€{stats.revenue.today.toLocaleString('sk-SK')}</p>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stats.revenue.change >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {stats.revenue.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stats.revenue.change >= 0 ? '+' : ''}{stats.revenue.change}%
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          }
        >
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700">
              <h3 className="font-bold text-white flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-400" />Prehľad štatistík</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl p-4 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Tržby dnes</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${stats.revenue.change >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {stats.revenue.change >= 0 ? '+' : ''}{stats.revenue.change}%
                  </span>
                </div>
                <p className="text-3xl font-bold text-emerald-400">€{stats.revenue.today.toLocaleString('sk-SK')}</p>
                <p className="text-xs text-gray-500 mt-1">Včera: €{stats.revenue.yesterday.toLocaleString('sk-SK')}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-700/30 rounded-xl p-3 text-center">
                  <ShoppingBag className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-white">{stats.orders.today}</p>
                  <p className="text-[10px] text-gray-500">Objednávok</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-3 text-center">
                  <Users className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-white">{stats.visitors.today.toLocaleString('sk-SK')}</p>
                  <p className="text-[10px] text-gray-500">Návštevníkov</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-3 text-center">
                  <Target className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-white">{stats.conversion.rate}%</p>
                  <p className="text-[10px] text-gray-500">Konverzia</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                <div className="flex items-center gap-2"><Receipt className="w-4 h-4 text-cyan-400" /><span className="text-sm text-gray-300">Ø objednávka</span></div>
                <span className="font-bold text-cyan-400">€{stats.averageOrder.toFixed(2)}</span>
              </div>
            </div>
            <div className="p-3 border-t border-slate-700">
              <Link href="/dashboard/analytics" className="flex items-center justify-center gap-2 py-2 text-sm text-blue-400 hover:text-blue-300 rounded-lg hover:bg-slate-700/50">
                <PieChart className="w-4 h-4" />Podrobná analytika<ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Dropdown>

        {/* Live Visitors */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative rounded-full h-2 w-2 bg-emerald-500"></span></span>
          <span className="text-emerald-400 text-xs font-semibold">{stats.visitors.online} online</span>
        </div>
      </div>

      {/* Center - Edit Toggle */}
      <div className="flex items-center gap-3">
        <Tooltip content={isEditing ? "Ukončiť úpravy (Ctrl+E)" : "Upraviť obchod (Ctrl+E)"}>
          <button onClick={onToggleEdit}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all transform hover:scale-105 ${
              isEditing ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-700/80 hover:bg-slate-600/80 text-white border border-slate-600'
            }`}>
            {isEditing ? <><Eye className="w-4 h-4" /><span className="hidden sm:inline">Náhľad</span></> : <><Paintbrush className="w-4 h-4" /><span className="hidden sm:inline">Upraviť obchod</span></>}
          </button>
        </Tooltip>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Quick Actions */}
        <Dropdown isOpen={actionsOpen} onToggle={() => setActionsOpen(!actionsOpen)} width="w-72"
          trigger={
            <button className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700/50">
              <Zap className="w-4 h-4 text-yellow-400" /><span className="text-xs font-medium text-gray-300">Akcie</span><ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>
          }
        >
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700"><h3 className="font-bold text-white flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" />Rýchle akcie</h3></div>
            <div className="p-2">
              {QUICK_ACTIONS.map((action) => (
                <Link key={action.id} href={action.href} onClick={() => setActionsOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-700/50 transition-colors group">
                  <div className={`w-10 h-10 rounded-xl bg-${action.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className={`w-5 h-5 text-${action.color}-400`} />
                  </div>
                  <div><p className="text-sm font-medium text-white">{action.label}</p><p className="text-[11px] text-gray-500">{action.desc}</p></div>
                </Link>
              ))}
            </div>
          </div>
        </Dropdown>

        <Tooltip content="Dashboard"><Link href="/dashboard" className="p-2.5 hover:bg-slate-700/50 rounded-xl text-gray-400 hover:text-white"><LayoutDashboard className="w-5 h-5" /></Link></Tooltip>
        <Tooltip content="Zobraziť obchod"><Link href={`/store/${shopSlug}`} target="_blank" className="p-2.5 hover:bg-slate-700/50 rounded-xl text-gray-400 hover:text-white"><ExternalLink className="w-5 h-5" /></Link></Tooltip>

        {/* Notifications */}
        <Dropdown isOpen={notifOpen} onToggle={() => setNotifOpen(!notifOpen)} width="w-96"
          trigger={
            <button className="p-2.5 hover:bg-slate-700/50 rounded-xl text-gray-400 hover:text-white relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1.5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white shadow-lg shadow-red-500/50 animate-pulse">{unreadCount}</span>}
            </button>
          }
        >
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2"><Bell className="w-4 h-4 text-blue-400" />Notifikácie {unreadCount > 0 && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs">{unreadCount} nové</span>}</h3>
              {unreadCount > 0 && <button onClick={onMarkAllRead} className="text-xs text-blue-400 hover:text-blue-300">Označiť všetky</button>}
            </div>
            <div className="max-h-[350px] overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer ${!n.read ? 'bg-blue-500/5' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotifColor(n.type)}`}>{getNotifIcon(n.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-white">{n.title}</p>
                        {!n.read && <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-gray-500 mt-1.5">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-700">
              <Link href="/dashboard/notifications" className="flex items-center justify-center gap-2 py-2 text-sm text-blue-400 hover:text-blue-300 rounded-lg hover:bg-slate-700/50">Všetky notifikácie<ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </Dropdown>

        <div className="w-px h-8 bg-slate-700 mx-1" />

        {/* User Menu */}
        <Dropdown isOpen={userOpen} onToggle={() => setUserOpen(!userOpen)} width="w-64"
          trigger={
            <button className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-slate-700/50 rounded-xl">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold shadow-lg">{user?.name?.charAt(0) || 'U'}</div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white leading-tight">{user?.name || 'Demo User'}</p>
                <p className="text-[10px] text-gray-500">Administrátor</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden md:block" />
            </button>
          }
        >
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold">{user?.name?.charAt(0) || 'U'}</div>
                <div>
                  <p className="font-bold text-white">{user?.name || 'Demo User'}</p>
                  <p className="text-xs text-gray-400">{user?.email || 'demo@eshopbuilder.sk'}</p>
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-[10px] font-medium mt-1 inline-block">Pro plán</span>
                </div>
              </div>
            </div>
            <div className="p-2">
              <Link href="/dashboard/settings/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50"><User className="w-4 h-4 text-gray-400" /><span className="text-sm text-white">Môj profil</span></Link>
              <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50"><Settings className="w-4 h-4 text-gray-400" /><span className="text-sm text-white">Nastavenia</span></Link>
              <Link href="/dashboard/billing" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50"><CreditCard className="w-4 h-4 text-gray-400" /><span className="text-sm text-white">Fakturácia</span></Link>
              <Link href="/dashboard/help" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50"><HelpCircle className="w-4 h-4 text-gray-400" /><span className="text-sm text-white">Pomoc</span></Link>
            </div>
            <div className="p-2 border-t border-slate-700">
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400"><LogOut className="w-4 h-4" /><span className="text-sm font-medium">Odhlásiť sa</span></button>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionCat, setSectionCat] = useState('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave(); }
      if (e.key === 'Escape' && selectedSection) onSelectSection(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedSection, undo, redo]);

  const handleSave = async () => {
    setSaving(true);
    await onSave();
    setLastSaved(new Date());
    setSaving(false);
  };

  const handleAddSection = (type: string) => {
    addSection(type as any);
    setAddSectionOpen(false);
  };

  const filteredSections = AVAILABLE_SECTIONS.filter(s => {
    const matchCat = sectionCat === 'all' || s.cat === sectionCat;
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[140] lg:hidden" onClick={onToggle} />}
      
      <div className={`fixed top-14 left-0 h-[calc(100vh-56px)] w-[400px] bg-slate-900 shadow-2xl z-[150] transform transition-all duration-300 flex flex-col border-r border-slate-700/50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20"><Wand2 className="w-5 h-5 text-white" /></div>
            <div><h2 className="font-bold text-white text-sm">Shop Builder</h2><p className="text-[11px] text-gray-500">Vizuálny editor</p></div>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip content="Klávesové skratky"><button className="p-2 hover:bg-slate-700/50 rounded-lg text-gray-500 hover:text-white"><Keyboard className="w-4 h-4" /></button></Tooltip>
            <Tooltip content="Zavrieť (Esc)"><button onClick={onToggle} className="p-2 hover:bg-slate-700/50 rounded-lg text-gray-500 hover:text-white"><PanelLeftClose className="w-5 h-5" /></button></Tooltip>
          </div>
        </div>

        {/* Toolbar */}
        <div className="h-14 flex items-center justify-between px-3 border-b border-slate-700/30 bg-slate-800/30">
          <div className="flex items-center gap-1">
            <Tooltip content="Späť (Ctrl+Z)"><button onClick={() => undo()} disabled={!canUndo()} className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-30"><Undo className="w-4 h-4 text-gray-400" /></button></Tooltip>
            <Tooltip content="Znova (Ctrl+Shift+Z)"><button onClick={() => redo()} disabled={!canRedo()} className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-30"><Redo className="w-4 h-4 text-gray-400" /></button></Tooltip>
            <div className="w-px h-6 bg-slate-700 mx-1" />
            <Tooltip content="Obnoviť"><button className="p-2 hover:bg-slate-700 rounded-lg text-gray-500 hover:text-white"><RefreshCw className="w-4 h-4" /></button></Tooltip>
          </div>
          <div className="flex items-center gap-0.5 bg-slate-800 rounded-xl p-1">
            {[{ id: 'desktop', icon: Monitor }, { id: 'tablet', icon: Tablet }, { id: 'mobile', icon: Smartphone }].map((d) => (
              <Tooltip key={d.id} content={d.id.charAt(0).toUpperCase() + d.id.slice(1)}>
                <button onClick={() => onDeviceChange(d.id as any)} className={`p-2 rounded-lg transition-all ${devicePreview === d.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-gray-500 hover:text-white hover:bg-slate-700'}`}>
                  <d.icon className="w-4 h-4" />
                </button>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700/30">
          {[{ id: 'sections', label: 'Sekcie', icon: Layers }, { id: 'theme', label: 'Vzhľad', icon: Palette }, { id: 'settings', label: 'Nastavenia', icon: Settings }].map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); onSelectSection(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-semibold border-b-2 ${activeTab === tab.id ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-gray-500 hover:text-white hover:bg-slate-800/30'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'sections' && (selectedSection ? (
            <div className="p-4">
              <button onClick={() => onSelectSection(null)} className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 mb-4 group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />Späť na sekcie
              </button>
              <div className="flex items-center gap-4 mb-5 p-4 bg-gradient-to-r from-slate-800/50 to-slate-800/30 rounded-2xl border border-slate-700/50">
                <span className="text-4xl">{SECTION_INFO[selectedSection.type]?.icon || '📦'}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">{SECTION_INFO[selectedSection.type]?.name || selectedSection.type}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{SECTION_INFO[selectedSection.type]?.description || 'Upravte sekciu'}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${selectedSection.enabled ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-gray-500'}`} />
              </div>
              <div className="flex gap-1 mb-5 bg-slate-800/30 rounded-xl p-1">
                {[{ id: 'content', label: 'Obsah', icon: Type }, { id: 'style', label: 'Štýl', icon: Paintbrush }].map((t) => (
                  <button key={t.id} onClick={() => setSectionTab(t.id as any)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg ${sectionTab === t.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`}>
                    <t.icon className="w-3.5 h-3.5" />{t.label}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                {sectionTab === 'content' ? <SectionContentEditor section={selectedSection} update={(k, v) => updateSectionSettings(selectedSection.id, { [k]: v })} /> : <SectionStyleEditor section={selectedSection} update={(k, v) => updateSectionSettings(selectedSection.id, { [k]: v })} />}
              </div>
              <div className="mt-6 pt-5 border-t border-slate-700/50 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => toggleSection(selectedSection.id)} className={`py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 ${selectedSection.enabled ? 'bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}>
                    {selectedSection.enabled ? <><EyeOff className="w-4 h-4" />Skryť</> : <><Eye className="w-4 h-4" />Zobraziť</>}
                  </button>
                  <button onClick={() => duplicateSection(selectedSection.id)} className="py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium flex items-center justify-center gap-2 text-gray-300 border border-slate-700"><Copy className="w-4 h-4" />Duplikovať</button>
                </div>
                <button onClick={() => { if (confirm('Naozaj chcete odstrániť túto sekciu?')) { removeSection(selectedSection.id); onSelectSection(null); } }} className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border border-red-500/20">
                  <Trash2 className="w-4 h-4" />Odstrániť sekciu
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div><h3 className="font-bold text-white">Sekcie stránky</h3><p className="text-xs text-gray-500 mt-0.5">{sections.length} sekcií</p></div>
                <button onClick={() => setAddSectionOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-xs font-semibold text-white shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">
                  <Plus className="w-4 h-4" />Pridať
                </button>
              </div>
              <div className="space-y-2">
                {sections.map((section, index) => {
                  const info = SECTION_INFO[section.type] || { icon: '📦', name: section.type };
                  return (
                    <div key={section.id} className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer bg-slate-800/30 hover:bg-slate-800 border border-slate-700/30 hover:border-blue-500/50 ${!section.enabled ? 'opacity-50' : ''}`}>
                      <div className="cursor-grab p-1.5 hover:bg-slate-700 rounded-lg opacity-50 group-hover:opacity-100"><GripVertical className="w-4 h-4 text-gray-500" /></div>
                      <div className="flex-1 flex items-center gap-3 min-w-0" onClick={() => onSelectSection(section)}>
                        <span className="text-2xl">{info.icon}</span>
                        <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">{info.name}</p>{section.blocks?.length > 0 && <p className="text-[11px] text-gray-500">{section.blocks.length} položiek</p>}</div>
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'up'); }} disabled={index === 0} className="p-1.5 hover:bg-slate-600 rounded-lg disabled:opacity-30"><ChevronUp className="w-4 h-4 text-gray-400" /></button>
                        <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'down'); }} disabled={index === sections.length - 1} className="p-1.5 hover:bg-slate-600 rounded-lg disabled:opacity-30"><ChevronDown className="w-4 h-4 text-gray-400" /></button>
                        <button onClick={(e) => { e.stopPropagation(); toggleSection(section.id); }} className={`p-1.5 rounded-lg ${section.enabled ? 'text-emerald-400 hover:bg-emerald-500/20' : 'text-gray-500 hover:bg-slate-600'}`}>
                          {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-all" onClick={() => onSelectSection(section)} />
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
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button key={preset.name} onClick={() => updateTheme({ primaryColor: preset.primary, secondaryColor: preset.secondary })} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-slate-700 hover:border-blue-500" title={preset.name}>
                      <div className="absolute inset-0 flex"><div className="w-1/2 h-full" style={{ backgroundColor: preset.primary }} /><div className="w-1/2 h-full" style={{ backgroundColor: preset.secondary }} /></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50"><Check className="w-5 h-5 text-white" /></div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white mb-3">Vlastné farby</h3>
                <div className="space-y-3">
                  <EditorColor label="Primárna farba" value={shopSettings.theme.primaryColor || '#3b82f6'} onChange={(v) => updateTheme({ primaryColor: v })} />
                  <EditorColor label="Sekundárna farba" value={shopSettings.theme.secondaryColor || '#8b5cf6'} onChange={(v) => updateTheme({ secondaryColor: v })} />
                  <EditorColor label="Farba pozadia" value={shopSettings.theme.backgroundColor || '#ffffff'} onChange={(v) => updateTheme({ backgroundColor: v })} />
                  <EditorColor label="Farba textu" value={shopSettings.theme.textColor || '#1f2937'} onChange={(v) => updateTheme({ textColor: v })} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Type className="w-4 h-4 text-blue-400" />Typografia</h3>
                <EditorSelect label="Hlavný font" value={shopSettings.theme.fontFamily || 'Inter, sans-serif'} onChange={(v) => updateTheme({ fontFamily: v })} options={FONTS.map(f => ({ value: f.value, label: f.label }))} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-3">Zaoblenie rohov</h3>
                <EditorSelect label="Štýl" value={shopSettings.theme.borderRadius || 'medium'} onChange={(v) => updateTheme({ borderRadius: v })} options={[{ value: 'none', label: 'Žiadne' }, { value: 'small', label: 'Malé' }, { value: 'medium', label: 'Stredné' }, { value: 'large', label: 'Veľké' }, { value: 'full', label: 'Plné' }]} />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-4 space-y-6">
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Store className="w-4 h-4 text-emerald-400" />Všeobecné</h3>
                <div className="space-y-3">
                  <EditorInput label="Názov obchodu" value={shopSettings.shopName || ''} onChange={(v) => updateShopSettings({ shopName: v })} placeholder="Môj Obchod" />
                  <EditorInput label="Popis" value={shopSettings.shopDescription || ''} onChange={(v) => updateShopSettings({ shopDescription: v })} multiline placeholder="Krátky popis..." />
                  <EditorInput label="Email" value={shopSettings.email || ''} onChange={(v) => updateShopSettings({ email: v })} placeholder="info@shop.sk" />
                  <EditorInput label="Telefón" value={shopSettings.phone || ''} onChange={(v) => updateShopSettings({ phone: v })} placeholder="+421 900 123 456" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Truck className="w-4 h-4 text-blue-400" />Doprava</h3>
                <EditorNumber label="Doprava zadarmo od (€)" value={shopSettings.freeShippingThreshold || 50} onChange={(v) => updateShopSettings({ freeShippingThreshold: v })} min={0} max={1000} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Euro className="w-4 h-4 text-yellow-400" />Mena</h3>
                <EditorSelect label="Mena" value={shopSettings.currency || 'EUR'} onChange={(v) => updateShopSettings({ currency: v })} options={[{ value: 'EUR', label: '€ Euro (EUR)' }, { value: 'CZK', label: 'Kč Koruna (CZK)' }]} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Globe className="w-4 h-4 text-purple-400" />SEO</h3>
                <div className="space-y-3">
                  <EditorInput label="Meta titulok" value={shopSettings.metaTitle || ''} onChange={(v) => updateShopSettings({ metaTitle: v })} placeholder="Titulok stránky" />
                  <EditorInput label="Meta popis" value={shopSettings.metaDescription || ''} onChange={(v) => updateShopSettings({ metaDescription: v })} multiline placeholder="Popis pre vyhľadávače..." />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 space-y-3">
          {hasUnsavedChanges && !saving && <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400"><AlertCircle className="w-4 h-4" /><span className="text-xs font-medium">Neuložené zmeny</span><Kbd>⌘S</Kbd></div>}
          {lastSaved && !hasUnsavedChanges && <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400"><CheckCircle className="w-4 h-4" /><span className="text-xs font-medium">Uložené o {lastSaved.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}</span></div>}
          <button onClick={handleSave} disabled={!hasUnsavedChanges || saving} className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${hasUnsavedChanges && !saving ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:scale-[1.02]' : 'bg-slate-800 text-gray-500 cursor-not-allowed border border-slate-700'}`}>
            {saving ? <><Loader2 className="w-5 h-5 animate-spin" />Ukladám...</> : <><Save className="w-5 h-5" />{hasUnsavedChanges ? 'Uložiť zmeny' : 'Všetko uložené'}</>}
          </button>
        </div>
      </div>

      {!isOpen && <Tooltip content="Otvoriť editor" side="bottom"><button onClick={onToggle} className="fixed top-20 left-4 z-[150] w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white rounded-xl shadow-2xl shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-all"><PanelLeftOpen className="w-6 h-6" /></button></Tooltip>}

      {/* Add Section Modal */}
      {addSectionOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setAddSectionOpen(false)} />
          <div className="relative w-full max-w-2xl bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div><h3 className="text-xl font-bold text-white">Pridať novú sekciu</h3><p className="text-sm text-gray-400 mt-1">Vyberte typ sekcie</p></div>
                <button onClick={() => setAddSectionOpen(false)} className="p-2 hover:bg-slate-700 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="text" placeholder="Hľadať sekcie..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="px-6 py-3 border-b border-slate-700/50 flex gap-2 overflow-x-auto">
              {['all', 'header', 'hero', 'products', 'content', 'marketing', 'footer'].map((cat) => (
                <button key={cat} onClick={() => setSectionCat(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${sectionCat === cat ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-700'}`}>
                  {cat === 'all' ? 'Všetky' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {filteredSections.map((section) => (
                  <button key={section.type} onClick={() => handleAddSection(section.type)} className="flex items-start gap-4 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-2xl border border-slate-600/30 hover:border-blue-500/50 text-left group">
                    <span className="text-3xl group-hover:scale-110 transition-transform">{section.icon}</span>
                    <div><p className="font-semibold text-white">{section.name}</p><p className="text-xs text-gray-500 mt-1">{section.desc}</p></div>
                  </button>
                ))}
              </div>
              {filteredSections.length === 0 && <div className="text-center py-12"><Search className="w-12 h-12 mx-auto text-gray-600 mb-3" /><p className="text-gray-400">Žiadne sekcie nenájdené</p></div>}
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

function SectionContentEditor({ section, update }: { section: ShopSection; update: (k: string, v: any) => void }) {
  const s = section.settings || {};
  switch (section.type) {
    case 'hero-slider': case 'hero-banner':
      return (<><EditorInput label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} placeholder="Zadajte nadpis..." /><EditorInput label="Podnadpis" value={s.subtitle || ''} onChange={(v) => update('subtitle', v)} multiline placeholder="Zadajte podnadpis..." /><div className="grid grid-cols-2 gap-3"><EditorInput label="Text tlačidla" value={s.buttonText || ''} onChange={(v) => update('buttonText', v)} placeholder="Nakupovať" /><EditorInput label="Link" value={s.buttonLink || ''} onChange={(v) => update('buttonLink', v)} placeholder="/produkty" /></div><EditorToggle label="Automatické prehrávanie" checked={s.autoplay !== false} onChange={(v) => update('autoplay', v)} /><EditorToggle label="Zobraziť šípky" checked={s.showArrows !== false} onChange={(v) => update('showArrows', v)} /></>);
    case 'announcement-bar':
      return (<><EditorInput label="Text správy" value={s.text || ''} onChange={(v) => update('text', v)} placeholder="🚚 Doprava zadarmo pri objednávke nad €50" /><EditorInput label="Link" value={s.link || ''} onChange={(v) => update('link', v)} placeholder="/akcie" /><EditorToggle label="Zobraziť zatvorenie" checked={s.closable === true} onChange={(v) => update('closable', v)} /></>);
    case 'header':
      return (<><EditorInput label="Logo text" value={s.logoText || ''} onChange={(v) => update('logoText', v)} placeholder="Názov obchodu" /><EditorInput label="Placeholder vyhľadávania" value={s.searchPlaceholder || ''} onChange={(v) => update('searchPlaceholder', v)} placeholder="Hľadať produkty..." /><EditorToggle label="Sticky header" checked={s.sticky !== false} onChange={(v) => update('sticky', v)} /><EditorToggle label="Vyhľadávanie" checked={s.showSearch !== false} onChange={(v) => update('showSearch', v)} /><EditorToggle label="Wishlist" checked={s.showWishlist !== false} onChange={(v) => update('showWishlist', v)} /><EditorToggle label="Košík" checked={s.showCart !== false} onChange={(v) => update('showCart', v)} /></>);
    case 'featured-products': case 'product-grid': case 'bestsellers':
      return (<><EditorInput label="Nadpis sekcie" value={s.title || ''} onChange={(v) => update('title', v)} placeholder="Odporúčané produkty" /><EditorInput label="Podnadpis" value={s.subtitle || ''} onChange={(v) => update('subtitle', v)} placeholder="Vybrané pre vás" /><EditorNumber label="Počet produktov" value={s.count || 8} onChange={(v) => update('count', v)} min={1} max={24} /><EditorInput label="Link 'Zobraziť všetky'" value={s.viewAllLink || ''} onChange={(v) => update('viewAllLink', v)} placeholder="/produkty" /><EditorToggle label="Zobraziť hodnotenia" checked={s.showRating !== false} onChange={(v) => update('showRating', v)} /></>);
    case 'newsletter':
      return (<><EditorInput label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} placeholder="Prihláste sa k odberu" /><EditorInput label="Popis" value={s.description || ''} onChange={(v) => update('description', v)} multiline placeholder="Získajte exkluzívne ponuky..." /><EditorInput label="Text tlačidla" value={s.buttonText || ''} onChange={(v) => update('buttonText', v)} placeholder="Odoberať" /></>);
    case 'testimonials':
      return (<><EditorInput label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} placeholder="Čo hovoria zákazníci" /><EditorToggle label="Zobraziť hviezdy" checked={s.showStars !== false} onChange={(v) => update('showStars', v)} /></>);
    case 'faq-accordion':
      return (<><EditorInput label="Nadpis" value={s.title || ''} onChange={(v) => update('title', v)} placeholder="Často kladené otázky" /><EditorToggle label="Prvá otázka otvorená" checked={s.firstOpen !== false} onChange={(v) => update('firstOpen', v)} /></>);
    case 'footer':
      return (<><EditorInput label="Copyright" value={s.copyright || ''} onChange={(v) => update('copyright', v)} placeholder="© 2024 Váš Obchod" /><EditorToggle label="Sociálne siete" checked={s.showSocial !== false} onChange={(v) => update('showSocial', v)} /><EditorToggle label="Platobné metódy" checked={s.showPayments !== false} onChange={(v) => update('showPayments', v)} /></>);
    default:
      return <div className="text-center py-8"><Settings className="w-8 h-8 mx-auto text-gray-500 mb-2" /><p className="text-sm text-gray-400">Editor obsahu pre túto sekciu</p></div>;
  }
}

function SectionStyleEditor({ section, update }: { section: ShopSection; update: (k: string, v: any) => void }) {
  const s = section.settings || {};
  return (<><EditorColor label="Farba pozadia" value={s.backgroundColor || '#ffffff'} onChange={(v) => update('backgroundColor', v)} /><EditorColor label="Farba textu" value={s.textColor || '#1f2937'} onChange={(v) => update('textColor', v)} /><div className="grid grid-cols-2 gap-3"><EditorNumber label="Padding Y (px)" value={s.paddingY || 48} onChange={(v) => update('paddingY', v)} min={0} max={200} /><EditorNumber label="Padding X (px)" value={s.paddingX || 16} onChange={(v) => update('paddingX', v)} min={0} max={100} /></div><EditorSelect label="Zarovnanie" value={s.textAlign || 'center'} onChange={(v) => update('textAlign', v)} options={[{ value: 'left', label: 'Vľavo' }, { value: 'center', label: 'Na stred' }, { value: 'right', label: 'Vpravo' }]} /></>);
}

function EditorInput({ label, value, onChange, multiline = false, placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string }) {
  return (<div><label className="block text-xs font-semibold text-gray-400 mb-2">{label}</label>{multiline ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white resize-none focus:outline-none focus:border-blue-500 placeholder-gray-500" /> : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 placeholder-gray-500" />}</div>);
}

function EditorNumber({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (<div><label className="block text-xs font-semibold text-gray-400 mb-2">{label}</label><input type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value) || 0)} min={min} max={max} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500" /></div>);
}

function EditorColor({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (<div><label className="block text-xs font-semibold text-gray-400 mb-2">{label}</label><div className="flex gap-2"><input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-12 h-10 rounded-xl cursor-pointer border-2 border-slate-700" /><input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-blue-500" /></div></div>);
}

function EditorSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (<div><label className="block text-xs font-semibold text-gray-400 mb-2">{label}</label><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer">{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>);
}

function EditorToggle({ label, checked, onChange, description }: { label: string; checked: boolean; onChange: (v: boolean) => void; description?: string }) {
  return (<div className="flex items-center justify-between py-2"><div><span className="text-sm font-medium text-gray-300">{label}</span>{description && <p className="text-[10px] text-gray-500 mt-0.5">{description}</p>}</div><button onClick={() => onChange(!checked)} className={`w-12 h-6 rounded-full transition-colors relative ${checked ? 'bg-blue-600' : 'bg-slate-700'}`}><div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'}`} /></button></div>);
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function StarRating({ rating }: { rating: number }) {
  return <div className="flex items-center gap-0.5">{[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-4 h-4 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}</div>;
}

function AnnouncementBarSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (<div className="relative text-center py-2.5 px-4" style={{ backgroundColor: section.settings?.backgroundColor || '#0f172a', color: section.settings?.textColor || '#ffffff' }}><p className="text-sm font-medium">{section.settings?.text || '🚚 Doprava zadarmo pri objednávke nad €50'}</p>{section.settings?.closable && <button onClick={() => setVisible(false)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"><X className="w-4 h-4" /></button>}</div>);
}

function HeaderSection({ section, theme, cartCount, onCartClick }: { section: ShopSection; theme: ShopTheme; cartCount: number; onCartClick: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className={`${section.settings?.sticky ? 'sticky top-14 z-40' : ''} border-b`} style={{ backgroundColor: section.settings?.backgroundColor || '#ffffff', borderColor: theme.borderColor }}>
      <div className="max-w-7xl mx-auto px-4 h-[72px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: theme.primaryColor }}><Sparkles className="w-6 h-6 text-white" /></div><span className="font-bold text-xl hidden sm:block">{section.settings?.logoText || 'Demo Shop'}</span></Link>
        <nav className="hidden lg:flex items-center gap-6">{['Domov', 'Produkty', 'Akcie', 'Kontakt'].map((item) => <Link key={item} href="#" className="text-sm font-medium hover:opacity-70">{item}</Link>)}</nav>
        <div className="flex items-center gap-2">
          {section.settings?.showSearch !== false && <button className="p-2 hover:bg-gray-100 rounded-lg"><Search className="w-5 h-5" /></button>}
          {section.settings?.showWishlist !== false && <button className="p-2 hover:bg-gray-100 rounded-lg hidden sm:block"><Heart className="w-5 h-5" /></button>}
          {section.settings?.showCart !== false && <button onClick={onCartClick} className="p-2 hover:bg-gray-100 rounded-lg relative"><ShoppingCart className="w-5 h-5" />{cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white" style={{ backgroundColor: theme.primaryColor }}>{cartCount}</span>}</button>}
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"><Menu className="w-5 h-5" /></button>
        </div>
      </div>
      {mobileMenuOpen && <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} /><div className="absolute top-0 right-0 bottom-0 w-80 bg-white shadow-xl"><div className="p-4 border-b flex items-center justify-between"><span className="font-bold">Menu</span><button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button></div><nav className="p-4 space-y-1">{['Domov', 'Produkty', 'Akcie', 'Kontakt'].map((item) => <Link key={item} href="#" className="block px-4 py-3 rounded-lg hover:bg-gray-100 font-medium" onClick={() => setMobileMenuOpen(false)}>{item}</Link>)}</nav></div></div>}
    </header>
  );
}

function HeroSliderSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const [slide, setSlide] = useState(0);
  const slides = section.blocks || [];
  useEffect(() => { if (!section.settings?.autoplay || slides.length <= 1) return; const i = setInterval(() => setSlide((s) => (s + 1) % Math.max(slides.length, 1)), section.settings?.autoplaySpeed || 5000); return () => clearInterval(i); }, [slides.length, section.settings]);
  return (
    <div className="relative h-[500px] overflow-hidden" style={{ backgroundColor: section.settings?.backgroundColor || '#1e293b' }}>
      <div className="absolute inset-0 flex items-center justify-center"><div className="text-center text-white px-4 max-w-4xl"><h2 className="text-4xl md:text-5xl font-bold mb-4">{section.settings?.title || 'Nová kolekcia 2024'}</h2><p className="text-xl opacity-80 mb-8">{section.settings?.subtitle || 'Objavte najnovšie produkty'}</p>{section.settings?.buttonText && <Link href={section.settings?.buttonLink || '/produkty'} className="inline-block px-8 py-3 rounded-xl font-semibold text-white hover:scale-105 transition-transform" style={{ backgroundColor: theme.primaryColor }}>{section.settings?.buttonText}</Link>}</div></div>
      {slides.length > 1 && section.settings?.showArrows !== false && <><button onClick={() => setSlide((s) => (s - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white"><ChevronLeft className="w-6 h-6" /></button><button onClick={() => setSlide((s) => (s + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white"><ChevronRight className="w-6 h-6" /></button></>}
    </div>
  );
}

function TrustBadgesSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const badges = [{ icon: Truck, title: 'Doprava zadarmo', sub: 'Pri objednávke nad €50' }, { icon: Shield, title: 'Bezpečná platba', sub: '100% zabezpečené' }, { icon: RotateCcw, title: '30 dní na vrátenie', sub: 'Bez udania dôvodu' }, { icon: Headphones, title: 'Podpora', sub: 'Po-Pi 9:00-17:00' }];
  return (<div className="py-8 border-y" style={{ borderColor: theme.borderColor, backgroundColor: section.settings?.backgroundColor || '#f8fafc' }}><div className="max-w-7xl mx-auto px-4"><div className="grid grid-cols-2 md:grid-cols-4 gap-6">{badges.map((b, i) => <div key={i} className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${theme.primaryColor}15` }}><b.icon className="w-6 h-6" style={{ color: theme.primaryColor }} /></div><div><p className="font-semibold text-sm">{b.title}</p><p className="text-xs text-gray-500">{b.sub}</p></div></div>)}</div></div></div>);
}

function ProductsSection({ section, theme, onAddToCart }: { section: ShopSection; theme: ShopTheme; onAddToCart: (p: any) => void }) {
  const products = demoProducts.slice(0, section.settings?.count || 8);
  return (
    <div className="py-12" style={{ backgroundColor: section.settings?.backgroundColor || '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4">
        {(section.settings?.title || section.settings?.subtitle) && <div className="text-center mb-8">{section.settings?.title && <h2 className="text-2xl font-bold">{section.settings?.title}</h2>}{section.settings?.subtitle && <p className="text-gray-500 mt-2">{section.settings?.subtitle}</p>}</div>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{products.map((p) => <div key={p.id} className="group"><div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4 relative">{p.badge && <span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded-lg text-white" style={{ backgroundColor: theme.primaryColor }}>{p.badge}</span>}<div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors"><button onClick={() => onAddToCart(p)} className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white rounded-xl shadow-lg font-medium text-sm transition-all translate-y-2 group-hover:translate-y-0">Do košíka</button></div></div><h3 className="font-medium mb-1 truncate">{p.name}</h3>{section.settings?.showRating !== false && <div className="mb-1"><StarRating rating={p.rating || 4} /></div>}<div className="flex items-center gap-2"><span className="font-bold" style={{ color: theme.primaryColor }}>{formatPrice(p.price)}</span>{p.comparePrice && <span className="text-sm text-gray-400 line-through">{formatPrice(p.comparePrice)}</span>}</div></div>)}</div>
        {section.settings?.viewAllLink && <div className="text-center mt-8"><Link href={section.settings?.viewAllLink} className="inline-flex items-center gap-2 font-medium" style={{ color: theme.primaryColor }}>Zobraziť všetky<ArrowRight className="w-4 h-4" /></Link></div>}
      </div>
    </div>
  );
}

function CategoriesGridSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const cats = [{ title: 'Elektronika', link: '/kategoria/elektronika' }, { title: 'Oblečenie', link: '/kategoria/oblecenie' }, { title: 'Dom & Záhrada', link: '/kategoria/dom-zahrada' }, { title: 'Šport', link: '/kategoria/sport' }];
  return (<div className="py-12" style={{ backgroundColor: section.settings?.backgroundColor || '#ffffff' }}><div className="max-w-7xl mx-auto px-4">{section.settings?.title && <h2 className="text-2xl font-bold mb-8 text-center">{section.settings?.title}</h2>}<div className="grid grid-cols-2 md:grid-cols-4 gap-4">{cats.map((c) => <Link key={c.title} href={c.link} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100"><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><div className="absolute bottom-4 left-4 right-4"><p className="text-white font-semibold text-lg">{c.title}</p></div></Link>)}</div></div></div>);
}

function TestimonialsSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const testimonials = [{ name: 'Mária K.', text: 'Skvelý obchod, rýchle dodanie!', rating: 5 }, { name: 'Peter N.', text: 'Výborná zákaznícka podpora.', rating: 5 }, { name: 'Jana S.', text: 'Nakupujem tu pravidelne.', rating: 4 }];
  return (<div className="py-12" style={{ backgroundColor: section.settings?.backgroundColor || '#f8fafc' }}><div className="max-w-7xl mx-auto px-4">{section.settings?.title && <h2 className="text-2xl font-bold mb-8 text-center">{section.settings?.title}</h2>}<div className="grid md:grid-cols-3 gap-6">{testimonials.map((t, i) => <div key={i} className="bg-white p-6 rounded-2xl shadow-sm"><Quote className="w-8 h-8 mb-4" style={{ color: theme.primaryColor }} /><p className="text-gray-600 mb-4">{t.text}</p><div className="flex items-center justify-between"><span className="font-medium">{t.name}</span>{section.settings?.showStars !== false && <StarRating rating={t.rating} />}</div></div>)}</div></div></div>);
}

function NewsletterSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  return (<div className="py-16" style={{ backgroundColor: section.settings?.backgroundColor || theme.primaryColor }}><div className="max-w-2xl mx-auto px-4 text-center"><h2 className="text-2xl font-bold mb-4" style={{ color: section.settings?.textColor || '#ffffff' }}>{section.settings?.title || 'Prihláste sa k odberu'}</h2><p className="mb-8 opacity-80" style={{ color: section.settings?.textColor || '#ffffff' }}>{section.settings?.description || 'Získajte exkluzívne ponuky a novinky'}</p><div className="flex gap-3 max-w-md mx-auto"><input type="email" placeholder={section.settings?.placeholder || 'Váš email...'} className="flex-1 px-4 py-3 rounded-xl focus:outline-none" /><button className="px-6 py-3 bg-white rounded-xl font-semibold hover:scale-105 transition-transform" style={{ color: theme.primaryColor }}>{section.settings?.buttonText || 'Odoberať'}</button></div></div></div>);
}

function FAQSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  const [open, setOpen] = useState<number | null>(section.settings?.firstOpen !== false ? 0 : null);
  const faqs = [{ q: 'Ako môžem sledovať svoju objednávku?', a: 'Po odoslaní objednávky vám pošleme email s trackingom.' }, { q: 'Aké sú možnosti platby?', a: 'Akceptujeme karty, PayPal a platbu na dobierku.' }, { q: 'Ako môžem vrátiť tovar?', a: 'Máte 30 dní na vrátenie tovaru bez udania dôvodu.' }];
  return (<div className="py-12" style={{ backgroundColor: section.settings?.backgroundColor || '#ffffff' }}><div className="max-w-3xl mx-auto px-4">{section.settings?.title && <h2 className="text-2xl font-bold mb-8 text-center">{section.settings?.title}</h2>}<div className="space-y-3">{faqs.map((f, i) => <div key={i} className="border rounded-xl overflow-hidden" style={{ borderColor: theme.borderColor }}><button onClick={() => setOpen(open === i ? null : i)} className="w-full px-6 py-4 flex items-center justify-between text-left font-medium hover:bg-gray-50">{f.q}<ChevronDown className={`w-5 h-5 transition-transform ${open === i ? 'rotate-180' : ''}`} /></button>{open === i && <div className="px-6 pb-4 text-gray-600">{f.a}</div>}</div>)}</div></div></div>);
}

function PromoBannerSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  return (<div className="py-16 text-center" style={{ backgroundColor: section.settings?.backgroundColor || theme.primaryColor, color: section.settings?.textColor || '#ffffff' }}><div className="max-w-4xl mx-auto px-4"><h2 className="text-3xl font-bold mb-4">{section.settings?.title || 'Špeciálna ponuka'}</h2><p className="text-xl opacity-80 mb-8">{section.settings?.subtitle || 'Využite limitovanú ponuku'}</p>{section.settings?.buttonText && <Link href={section.settings?.buttonLink || '/'} className="inline-block px-8 py-3 bg-white rounded-xl font-semibold hover:scale-105 transition-transform" style={{ color: theme.primaryColor }}>{section.settings?.buttonText}</Link>}</div></div>);
}

function BrandLogosSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  return (<div className="py-12" style={{ backgroundColor: section.settings?.backgroundColor || '#ffffff' }}><div className="max-w-7xl mx-auto px-4">{section.settings?.title && <h2 className="text-2xl font-bold mb-8 text-center">{section.settings?.title}</h2>}<div className="flex flex-wrap items-center justify-center gap-8 opacity-50">{[1,2,3,4,5,6].map((i) => <div key={i} className="w-24 h-12 bg-gray-200 rounded-lg" />)}</div></div></div>);
}

function FooterSection({ section, theme }: { section: ShopSection; theme: ShopTheme }) {
  return (
    <footer className="py-12" style={{ backgroundColor: section.settings?.backgroundColor || '#0f172a', color: section.settings?.textColor || '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div><div className="flex items-center gap-2 mb-4"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: theme.primaryColor }}><Sparkles className="w-6 h-6 text-white" /></div><span className="font-bold text-xl">Shop</span></div><p className="text-sm opacity-60">Váš spoľahlivý online obchod s najlepšími produktmi.</p></div>
          <div><h4 className="font-semibold mb-4">Obchod</h4><div className="space-y-2 text-sm opacity-60"><Link href="/produkty" className="block hover:opacity-100">Produkty</Link><Link href="/kategorie" className="block hover:opacity-100">Kategórie</Link><Link href="/akcie" className="block hover:opacity-100">Akcie</Link></div></div>
          <div><h4 className="font-semibold mb-4">Podpora</h4><div className="space-y-2 text-sm opacity-60"><Link href="/kontakt" className="block hover:opacity-100">Kontakt</Link><Link href="/faq" className="block hover:opacity-100">FAQ</Link><Link href="/doprava" className="block hover:opacity-100">Doprava</Link></div></div>
          <div><h4 className="font-semibold mb-4">Kontakt</h4><div className="space-y-2 text-sm opacity-60"><p className="flex items-center gap-2"><Mail className="w-4 h-4" />info@shop.sk</p><p className="flex items-center gap-2"><Phone className="w-4 h-4" />+421 900 123 456</p></div>{section.settings?.showSocial !== false && <div className="flex gap-3 mt-4"><a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><Facebook className="w-5 h-5" /></a><a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><Instagram className="w-5 h-5" /></a></div>}</div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"><p className="text-sm opacity-60">{section.settings?.copyright || `© ${new Date().getFullYear()} Váš Obchod. Všetky práva vyhradené.`}</p>{section.settings?.showPayments !== false && <div className="flex items-center gap-3"><CreditCard className="w-8 h-8 opacity-40" /><Banknote className="w-8 h-8 opacity-40" /></div>}</div>
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
        {remaining > 0 && <div className="p-4 bg-blue-50 border-b"><p className="text-sm text-blue-800 mb-2">Ešte <strong>{formatPrice(remaining)}</strong> do dopravy zadarmo!</p><div className="h-2 bg-blue-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: theme.primaryColor }} /></div></div>}
        <div className="flex-1 overflow-y-auto p-4">{items.length === 0 ? <div className="text-center py-12"><ShoppingCart className="w-16 h-16 mx-auto text-gray-200 mb-4" /><p className="text-gray-500">Váš košík je prázdny</p></div> : <div className="space-y-4">{items.map((item) => <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl"><div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" /><div className="flex-1 min-w-0"><p className="font-medium truncate">{item.name}</p><p className="font-bold mt-1" style={{ color: theme.primaryColor }}>{formatPrice(item.price)}</p><div className="flex items-center gap-2 mt-2"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-white border flex items-center justify-center hover:bg-gray-50"><Minus className="w-3 h-3" /></button><span className="w-8 text-center text-sm">{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-white border flex items-center justify-center hover:bg-gray-50"><Plus className="w-3 h-3" /></button></div></div><button onClick={() => removeItem(item.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></div>)}</div>}</div>
        {items.length > 0 && <div className="p-4 border-t bg-gray-50"><div className="flex items-center justify-between mb-4"><span className="font-medium">Celkom</span><span className="text-xl font-bold" style={{ color: theme.primaryColor }}>{formatPrice(total())}</span></div><Link href="/checkout" className="block w-full py-3 text-center rounded-xl font-semibold text-white hover:scale-[1.02] transition-transform" style={{ backgroundColor: theme.primaryColor }} onClick={() => setCartOpen(false)}>Pokračovať k pokladni</Link></div>}
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

  const [user, setUser] = useState<any>({ name: 'Demo User', email: 'demo@eshopbuilder.sk' });
  const [isOwner, setIsOwner] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<ShopSection | null>(null);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [stats] = useState<ShopStats>(DEMO_STATS);
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);

  const shopName = shopSettings.shopName || 'Demo Shop';
  const shopSlug = (params.slug as string) || 'demo';

  useEffect(() => { console.log("ADMIN BAR PRO LOADED"); const ud = localStorage.getItem('user'); if (ud) { try { setUser(JSON.parse(ud)); } catch {} } }, []);

  const handleLogout = () => { localStorage.clear(); setUser(null); setIsOwner(false); setIsEditing(false); router.refresh(); };
  const handleToggleEdit = () => { if (isEditing) { setIsEditing(false); setEditorOpen(false); setSelectedSection(null); } else { setIsEditing(true); setEditorOpen(true); } };
  const handleMarkAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const handleSave = async () => { await saveChanges(); };
  const handleAddToCart = (product: any) => { cart.addItem({ id: product.id, name: product.name, price: product.price, image: product.images?.[0] }); };

  const renderSection = (section: ShopSection) => {
    const props = { section, theme };
    switch (section.type) {
      case 'announcement-bar': return <AnnouncementBarSection {...props} />;
      case 'header': return <HeaderSection {...props} cartCount={cart.count()} onCartClick={() => cart.setCartOpen(true)} />;
      case 'hero-slider': case 'hero-banner': return <HeroSliderSection {...props} />;
      case 'trust-badges': return <TrustBadgesSection {...props} />;
      case 'categories-grid': return <CategoriesGridSection {...props} />;
      case 'featured-products': case 'product-grid': case 'bestsellers': return <ProductsSection {...props} onAddToCart={handleAddToCart} />;
      case 'promo-banner': return <PromoBannerSection {...props} />;
      case 'testimonials': return <TestimonialsSection {...props} />;
      case 'faq-accordion': return <FAQSection {...props} />;
      case 'newsletter': return <NewsletterSection {...props} />;
      case 'brand-logos': return <BrandLogosSection {...props} />;
      case 'footer': return <FooterSection {...props} />;
      default: return <div className="py-12 text-center bg-gray-100"><p className="text-gray-500">Sekcia: {section.type}</p></div>;
    }
  };

  const topOffset = isOwner ? 56 : 0;
  const getPreviewStyle = () => {
    if (!isEditing) return {};
    switch (devicePreview) {
      case 'tablet': return { maxWidth: '768px', margin: '0 auto', boxShadow: '0 0 0 1px rgba(0,0,0,0.1)' };
      case 'mobile': return { maxWidth: '375px', margin: '0 auto', boxShadow: '0 0 0 1px rgba(0,0,0,0.1)' };
      default: return {};
    }
  };

  return (
    <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      {isOwner && user && <AdminBar shopName={shopName} shopSlug={shopSlug} user={user} isEditing={isEditing} onToggleEdit={handleToggleEdit} onLogout={handleLogout} stats={stats} notifications={notifications} onMarkAllRead={handleMarkAllRead} />}
      {isOwner && isEditing && <InlineEditorPanel isOpen={editorOpen} onToggle={() => setEditorOpen(!editorOpen)} selectedSection={selectedSection} onSelectSection={setSelectedSection} sections={allSections} devicePreview={devicePreview} onDeviceChange={setDevicePreview} onSave={handleSave} hasUnsavedChanges={hasUnsavedChanges} />}

      <div style={{ marginTop: topOffset, marginLeft: isEditing && editorOpen ? 400 : 0, transition: 'margin-left 0.3s ease', ...getPreviewStyle() }}>
        {sortedSections.map((section) => (
          <div key={section.id} className={`relative ${isEditing ? 'group cursor-pointer' : ''}`} onClick={isEditing ? () => { setSelectedSection(section); setEditorOpen(true); } : undefined}>
            {isEditing && <div className={`absolute inset-0 z-10 pointer-events-none transition-all border-2 ${selectedSection?.id === section.id ? 'border-blue-500 bg-blue-500/5' : 'border-transparent group-hover:border-dashed group-hover:border-blue-400/50 group-hover:bg-blue-500/5'}`}><div className={`absolute top-2 left-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-lg flex items-center gap-2 ${selectedSection?.id === section.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}><span>{SECTION_INFO[section.type]?.icon || '📦'}</span>{SECTION_INFO[section.type]?.name || section.type}<ChevronRight className="w-3 h-3 opacity-50" /></div></div>}
            {renderSection(section)}
          </div>
        ))}
      </div>

      <CartSidebar theme={theme} freeShippingThreshold={shopSettings.freeShippingThreshold || 50} />

      {isOwner && !isEditing && <Tooltip content="Upraviť obchod" side="top"><button onClick={handleToggleEdit} className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-2xl shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-all group"><Paintbrush className="w-6 h-6 group-hover:rotate-12 transition-transform" /></button></Tooltip>}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }
        .animate-in { animation-duration: 200ms; animation-fill-mode: forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-top-2 { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zoom-in-95 { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-top-2 { animation-name: slide-in-from-top-2; }
        .zoom-in-95 { animation-name: zoom-in-95; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
