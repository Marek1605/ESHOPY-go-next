'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, Save, Store, Mail, Phone, MapPin, Globe, Clock, 
  DollarSign, ChevronRight, Image, AlertCircle, Check, Upload
} from 'lucide-react';
import { useSettings } from '@/lib/store';

export default function GeneralSettingsPage() {
  const { general, updateGeneral } = useSettings();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(general);

  const handleSave = () => {
    updateGeneral(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const currencies = [
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'CZK', symbol: 'Kč', name: 'Česká koruna' },
    { code: 'PLN', symbol: 'zł', name: 'Poľský zlotý' },
    { code: 'HUF', symbol: 'Ft', name: 'Maďarský forint' },
    { code: 'USD', symbol: '$', name: 'Americký dolár' },
  ];

  const languages = [
    { code: 'sk', name: 'Slovenčina' },
    { code: 'cs', name: 'Čeština' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
  ];

  const timezones = [
    { code: 'Europe/Bratislava', name: 'Bratislava (GMT+1)' },
    { code: 'Europe/Prague', name: 'Praha (GMT+1)' },
    { code: 'Europe/Warsaw', name: 'Varšava (GMT+1)' },
    { code: 'Europe/Budapest', name: 'Budapešť (GMT+1)' },
    { code: 'Europe/Vienna', name: 'Viedeň (GMT+1)' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/dashboard/settings" className="hover:text-gray-700">Nastavenia</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">Všeobecné</span>
            </div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-500" /> Všeobecné nastavenia
            </h1>
          </div>
          <button
            onClick={handleSave}
            className={`px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              saved 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saved ? 'Uložené!' : 'Uložiť zmeny'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Shop Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Store className="w-5 h-5 text-blue-500" /> Informácie o obchode
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Názov obchodu</label>
              <input
                type="text"
                value={form.shopName}
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Môj Obchod"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Mail className="w-4 h-4 inline mr-1" /> Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="info@obchod.sk"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Phone className="w-4 h-4 inline mr-1" /> Telefón
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="+421 900 123 456"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" /> Regionálne nastavenia
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <DollarSign className="w-4 h-4 inline mr-1" /> Mena
              </label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>{c.symbol} {c.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Globe className="w-4 h-4 inline mr-1" /> Jazyk
              </label>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {languages.map(l => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Clock className="w-4 h-4 inline mr-1" /> Časové pásmo
              </label>
              <select
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {timezones.map(t => (
                  <option key={t.code} value={t.code}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Order Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" /> Nastavenia objednávok
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Prefix objednávok</label>
              <input
                type="text"
                value={form.orderPrefix}
                onChange={(e) => setForm({ ...form, orderPrefix: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="ORD-"
              />
              <p className="mt-1 text-xs text-gray-500">Príklad: ORD-00001</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Prefix faktúr</label>
              <input
                type="text"
                value={form.invoicePrefix}
                onChange={(e) => setForm({ ...form, invoicePrefix: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="INV-"
              />
              <p className="mt-1 text-xs text-gray-500">Príklad: INV-2024-00001</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Tieto nastavenia ovplyvňujú celý váš obchod</p>
            <p>Zmeny sa prejavia okamžite po uložení. Pre pokročilé nastavenia navštívte sekciu Integrácie.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
