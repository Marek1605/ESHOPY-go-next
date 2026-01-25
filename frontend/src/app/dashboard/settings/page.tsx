'use client';
import { useState } from 'react';
import { Store, Globe, CreditCard, Truck, Bell, Shield, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    shopName: 'Môj obchod',
    email: 'info@mojobchod.sk',
    phone: '+421 900 123 456',
    address: 'Hlavná 1, 811 01 Bratislava',
    currency: 'EUR',
    language: 'sk',
  });

  const tabs = [
    { id: 'general', label: 'Všeobecné', icon: Store },
    { id: 'domain', label: 'Doména', icon: Globe },
    { id: 'payments', label: 'Platby', icon: CreditCard },
    { id: 'shipping', label: 'Doprava', icon: Truck },
    { id: 'notifications', label: 'Notifikácie', icon: Bell },
    { id: 'security', label: 'Bezpečnosť', icon: Shield },
  ];

  const handleSave = () => {
    toast.success('Nastavenia boli uložené!');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Nastavenia</h1>
          <p className="text-gray-400">Spravujte nastavenia vášho e-shopu</p>
        </div>
        <button onClick={handleSave} className="btn-primary"><Save className="w-5 h-5" />Uložiť zmeny</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <div className="stat-card p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${activeTab === tab.id ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-slate-800 text-gray-400'}`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'general' && (
            <div className="stat-card">
              <h3 className="font-semibold mb-6">Základné informácie</h3>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Názov obchodu</label>
                  <input type="text" value={settings.shopName} onChange={(e) => setSettings({ ...settings, shopName: e.target.value })} className="input-field" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Email</label>
                    <input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="form-label">Telefón</label>
                    <input type="tel" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Adresa</label>
                  <input type="text" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="input-field" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Mena</label>
                    <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className="input-field">
                      <option value="EUR">EUR (€)</option>
                      <option value="CZK">CZK (Kč)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Jazyk</label>
                    <select value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })} className="input-field">
                      <option value="sk">Slovenčina</option>
                      <option value="cs">Čeština</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'domain' && (
            <div className="stat-card">
              <h3 className="font-semibold mb-6">Nastavenia domény</h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-800 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Aktuálna doména</div>
                  <div className="font-semibold">moj-obchod.eshopbuilder.sk</div>
                </div>
                <div>
                  <label className="form-label">Vlastná doména</label>
                  <input type="text" placeholder="www.mojadomena.sk" className="input-field" />
                  <p className="text-sm text-gray-500 mt-2">Pre pripojenie vlastnej domény kontaktujte podporu.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="stat-card">
              <h3 className="font-semibold mb-6">Platobné metódy</h3>
              <div className="space-y-4">
                {[
                  { name: 'Stripe', enabled: true },
                  { name: 'PayPal', enabled: false },
                  { name: 'Bankový prevod', enabled: true },
                  { name: 'Dobierka', enabled: true },
                ].map((method, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <span className="font-medium">{method.name}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={method.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-600 peer-checked:bg-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="stat-card">
              <h3 className="font-semibold mb-6">Dopravné metódy</h3>
              <div className="space-y-4">
                {[
                  { name: 'Slovenská pošta', price: '3.50' },
                  { name: 'Kuriér DPD', price: '4.90' },
                  { name: 'Zásielkovňa', price: '2.90' },
                  { name: 'Osobný odber', price: '0.00' },
                ].map((method, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <span className="font-medium">{method.name}</span>
                    <span className="text-gray-400">€{method.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'notifications' || activeTab === 'security') && (
            <div className="stat-card">
              <h3 className="font-semibold mb-6">{tabs.find(t => t.id === activeTab)?.label}</h3>
              <p className="text-gray-400">Nastavenia pre túto sekciu budú čoskoro dostupné.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
