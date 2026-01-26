'use client';

import { useState } from 'react';
import { Store, Mail, Phone, MapPin, Globe, Clock, Euro, Save, Upload, Check, X } from 'lucide-react';

interface ShopSettings {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  currency: string;
  timezone: string;
  language: string;
  logo: string;
  favicon: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

const initialSettings: ShopSettings = {
  name: 'Demo Shop',
  tagline: 'Váš obľúbený e-shop',
  email: 'info@demoshop.sk',
  phone: '+421 900 123 456',
  address: 'Hlavná 1',
  city: 'Bratislava',
  postalCode: '811 01',
  country: 'SK',
  currency: 'EUR',
  timezone: 'Europe/Bratislava',
  language: 'sk',
  logo: '',
  favicon: '',
  socialLinks: {
    facebook: 'https://facebook.com/demoshop',
    instagram: 'https://instagram.com/demoshop',
    twitter: '',
    youtube: '',
  },
  seo: {
    title: 'Demo Shop - Najlepší e-shop na Slovensku',
    description: 'Nakupujte kvalitné produkty za skvelé ceny. Rýchle doručenie a skvelý zákaznícky servis.',
    keywords: 'eshop, nakupovanie, produkty, slovensko',
  },
};

const currencies = [
  { code: 'EUR', name: 'Euro (€)', symbol: '€' },
  { code: 'CZK', name: 'Česká koruna (Kč)', symbol: 'Kč' },
  { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
  { code: 'GBP', name: 'British Pound (£)', symbol: '£' },
];

const countries = [
  { code: 'SK', name: 'Slovensko' },
  { code: 'CZ', name: 'Česká republika' },
  { code: 'HU', name: 'Maďarsko' },
  { code: 'PL', name: 'Poľsko' },
  { code: 'AT', name: 'Rakúsko' },
  { code: 'DE', name: 'Nemecko' },
];

const timezones = [
  { code: 'Europe/Bratislava', name: 'Bratislava (UTC+1)' },
  { code: 'Europe/Prague', name: 'Praha (UTC+1)' },
  { code: 'Europe/Berlin', name: 'Berlín (UTC+1)' },
  { code: 'Europe/London', name: 'Londýn (UTC+0)' },
];

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState<ShopSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSettings = (key: keyof ShopSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const updateSocialLink = (key: keyof typeof settings.socialLinks, value: string) => {
    setSettings({ ...settings, socialLinks: { ...settings.socialLinks, [key]: value } });
  };

  const updateSeo = (key: keyof typeof settings.seo, value: string) => {
    setSettings({ ...settings, seo: { ...settings.seo, [key]: value } });
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Všeobecné nastavenia</h1>
          <p className="text-gray-400 mt-1">Základné informácie o vašom obchode</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
            saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {saved ? <><Check className="w-5 h-5" /> Uložené</> : isSaving ? 'Ukladám...' : <><Save className="w-5 h-5" /> Uložiť zmeny</>}
        </button>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Store className="w-5 h-5 text-blue-400" /> Základné informácie
          </h2>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Názov obchodu *</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => updateSettings('name', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tagline / Slogan</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => updateSettings('tagline', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Logo obchodu</label>
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-gray-600 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Nahrať logo</p>
                  <p className="text-xs text-gray-600 mt-1">PNG, JPG, SVG do 2MB</p>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Favicon</label>
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-gray-600 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Nahrať favicon</p>
                  <p className="text-xs text-gray-600 mt-1">ICO, PNG 32x32</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" /> Kontaktné údaje
          </h2>
          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email *</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateSettings('email', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Telefón</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => updateSettings('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Adresa</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => updateSettings('address', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Mesto</label>
                <input
                  type="text"
                  value={settings.city}
                  onChange={(e) => updateSettings('city', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">PSČ</label>
                <input
                  type="text"
                  value={settings.postalCode}
                  onChange={(e) => updateSettings('postalCode', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Krajina</label>
                <select
                  value={settings.country}
                  onChange={(e) => updateSettings('country', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                >
                  {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Regional Settings */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" /> Regionálne nastavenia
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Mena</label>
              <select
                value={settings.currency}
                onChange={(e) => updateSettings('currency', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              >
                {currencies.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Časové pásmo</label>
              <select
                value={settings.timezone}
                onChange={(e) => updateSettings('timezone', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              >
                {timezones.map(t => <option key={t.code} value={t.code}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Jazyk</label>
              <select
                value={settings.language}
                onChange={(e) => updateSettings('language', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="sk">Slovenčina</option>
                <option value="cs">Čeština</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Sociálne siete</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Facebook</label>
              <input
                type="url"
                value={settings.socialLinks.facebook}
                onChange={(e) => updateSocialLink('facebook', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Instagram</label>
              <input
                type="url"
                value={settings.socialLinks.instagram}
                onChange={(e) => updateSocialLink('instagram', e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Twitter / X</label>
              <input
                type="url"
                value={settings.socialLinks.twitter}
                onChange={(e) => updateSocialLink('twitter', e.target.value)}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">YouTube</label>
              <input
                type="url"
                value={settings.socialLinks.youtube}
                onChange={(e) => updateSocialLink('youtube', e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* SEO */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">SEO nastavenia</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Meta title</label>
              <input
                type="text"
                value={settings.seo.title}
                onChange={(e) => updateSeo('title', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-600 mt-1">{settings.seo.title.length}/60 znakov</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Meta description</label>
              <textarea
                value={settings.seo.description}
                onChange={(e) => updateSeo('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none resize-none"
              />
              <p className="text-xs text-gray-600 mt-1">{settings.seo.description.length}/160 znakov</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Kľúčové slová</label>
              <input
                type="text"
                value={settings.seo.keywords}
                onChange={(e) => updateSeo('keywords', e.target.value)}
                placeholder="eshop, produkty, slovensko"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
