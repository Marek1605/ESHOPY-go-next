'use client';
import { useState } from 'react';
import { Store, Globe, CreditCard, Truck, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [tab, setTab] = useState('general');
  const [settings, setSettings] = useState({
    name: 'Môj obchod', email: 'info@mojobchod.sk', phone: '+421 900 123 456',
    address: 'Hlavná 1, 811 01 Bratislava', currency: 'EUR', language: 'sk'
  });

  const tabs = [
    { id: 'general', label: 'Všeobecné', icon: Store },
    { id: 'domain', label: 'Doména', icon: Globe },
    { id: 'payments', label: 'Platby', icon: CreditCard },
    { id: 'shipping', label: 'Doprava', icon: Truck },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Nastavenia</h1>
          <p className="text-gray-400">Spravujte nastavenia vášho e-shopu</p>
        </div>
        <button onClick={() => toast.success('Uložené!')} className="btn-primary"><Save className="w-5 h-5" />Uložiť</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64">
          <div className="stat-card p-2">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${tab === t.id ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-slate-800 text-gray-400'}`}>
                <t.icon className="w-5 h-5" />{t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 stat-card">
          {tab === 'general' && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Základné informácie</h3>
              <div>
                <label className="form-label">Názov obchodu</label>
                <input type="text" value={settings.name} onChange={e => setSettings({ ...settings, name: e.target.value })} className="input-field" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="form-label">Email</label><input type="email" value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} className="input-field" /></div>
                <div><label className="form-label">Telefón</label><input type="tel" value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} className="input-field" /></div>
              </div>
              <div><label className="form-label">Adresa</label><input type="text" value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} className="input-field" /></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="form-label">Mena</label><select value={settings.currency} onChange={e => setSettings({ ...settings, currency: e.target.value })} className="input-field"><option value="EUR">EUR (€)</option><option value="CZK">CZK (Kč)</option></select></div>
                <div><label className="form-label">Jazyk</label><select value={settings.language} onChange={e => setSettings({ ...settings, language: e.target.value })} className="input-field"><option value="sk">Slovenčina</option><option value="cs">Čeština</option></select></div>
              </div>
            </div>
          )}
          {tab === 'domain' && (
            <div>
              <h3 className="font-semibold mb-4">Nastavenia domény</h3>
              <div className="p-4 bg-slate-800 rounded-lg mb-4">
                <div className="text-sm text-gray-400">Aktuálna doména</div>
                <div className="font-semibold">moj-obchod.eshopbuilder.sk</div>
              </div>
              <div><label className="form-label">Vlastná doména</label><input type="text" placeholder="www.mojadomena.sk" className="input-field" /></div>
            </div>
          )}
          {tab === 'payments' && (
            <div>
              <h3 className="font-semibold mb-4">Platobné metódy</h3>
              {['Stripe', 'PayPal', 'Bankový prevod', 'Dobierka'].map((m, i) => (
                <div key={m} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg mb-2">
                  <span>{m}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={i !== 1} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-600 peer-checked:bg-blue-500 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </div>
              ))}
            </div>
          )}
          {tab === 'shipping' && (
            <div>
              <h3 className="font-semibold mb-4">Dopravné metódy</h3>
              {[{ n: 'Slovenská pošta', p: '3.50' }, { n: 'DPD', p: '4.90' }, { n: 'Zásielkovňa', p: '2.90' }, { n: 'Osobný odber', p: '0.00' }].map(m => (
                <div key={m.n} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg mb-2">
                  <span>{m.n}</span><span className="text-gray-400">€{m.p}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
