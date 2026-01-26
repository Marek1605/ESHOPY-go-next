'use client';
import { useState } from 'react';
import { Store, Globe, Clock, Save } from 'lucide-react';

export default function GeneralSettingsPage() {
  const [shopName, setShopName] = useState('Môj Obchod');
  const [email, setEmail] = useState('info@mojobchod.sk');
  const [phone, setPhone] = useState('+421 900 123 456');
  const [currency, setCurrency] = useState('EUR');
  const [language, setLanguage] = useState('sk');
  const [timezone, setTimezone] = useState('Europe/Bratislava');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Všeobecné nastavenia</h1>
        <p className="text-gray-400">Základné informácie o vašom obchode</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Store className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Informácie o obchode</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Názov obchodu</label>
              <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} className="w-full px-4 py-3 bg-gray-700 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-700 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Telefón</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-gray-700 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold">Lokalizácia</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mena</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-4 py-3 bg-gray-700 rounded-lg">
                <option value="EUR">EUR (€)</option>
                <option value="CZK">CZK (Kč)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Jazyk</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-4 py-3 bg-gray-700 rounded-lg">
                <option value="sk">Slovenčina</option>
                <option value="cs">Čeština</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Časová zóna</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full px-4 py-3 bg-gray-700 rounded-lg">
                <option value="Europe/Bratislava">Europe/Bratislava</option>
                <option value="Europe/Prague">Europe/Prague</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold flex items-center justify-center gap-2">
          <Save className="w-5 h-5" />
          {saved ? 'Uložené!' : 'Uložiť nastavenia'}
        </button>
      </div>
    </div>
  );
}
