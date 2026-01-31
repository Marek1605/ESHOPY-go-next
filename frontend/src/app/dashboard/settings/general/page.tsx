'use client';
import { useState } from 'react';
import { Check, Globe, Clock, DollarSign, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '@/lib/store';

export default function GeneralSettingsPage() {
  const settings = useSettings();
  const [saving, setSaving] = useState(false);
  const [shopName, setShopName] = useState('Môj Obchod');
  const [shopEmail, setShopEmail] = useState('info@mojobchod.sk');
  const [shopPhone, setShopPhone] = useState('+421 900 123 456');
  const [shopAddress, setShopAddress] = useState('Hlavná 1, 811 01 Bratislava');

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Nastavenia uložené!');
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Všeobecné nastavenia</h1>
          <p className="text-gray-500">Základné nastavenia vášho e-shopu</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <span className="spinner" /> : <Check className="w-4 h-4" />}
          Uložiť zmeny
        </button>
      </div>

      <div className="space-y-6">
        {/* Shop Info */}
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-4">Informácie o obchode</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Názov obchodu *</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">Email *</label>
              <input
                type="email"
                value={shopEmail}
                onChange={(e) => setShopEmail(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">Telefón</label>
              <input
                type="tel"
                value={shopPhone}
                onChange={(e) => setShopPhone(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">Adresa</label>
              <input
                type="text"
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="input-label">Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <button className="btn-secondary text-sm">Nahrať logo</button>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG do 2MB, min. 200x200px</p>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-4">Regionálne nastavenia</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="input-label flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Mena
              </label>
              <select
                value={settings.general.currency}
                onChange={(e) => settings.updateGeneral({ currency: e.target.value })}
                className="input-field"
              >
                <option value="EUR">EUR (€)</option>
                <option value="CZK">CZK (Kč)</option>
                <option value="PLN">PLN (zł)</option>
                <option value="HUF">HUF (Ft)</option>
              </select>
            </div>
            <div>
              <label className="input-label flex items-center gap-2">
                <Globe className="w-4 h-4" /> Jazyk
              </label>
              <select
                value={settings.general.language}
                onChange={(e) => settings.updateGeneral({ language: e.target.value })}
                className="input-field"
              >
                <option value="sk">Slovenčina</option>
                <option value="cs">Čeština</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            <div>
              <label className="input-label flex items-center gap-2">
                <Clock className="w-4 h-4" /> Časová zóna
              </label>
              <select
                value={settings.general.timezone}
                onChange={(e) => settings.updateGeneral({ timezone: e.target.value })}
                className="input-field"
              >
                <option value="Europe/Bratislava">Europe/Bratislava</option>
                <option value="Europe/Prague">Europe/Prague</option>
                <option value="Europe/Warsaw">Europe/Warsaw</option>
                <option value="Europe/Budapest">Europe/Budapest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Order Settings */}
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-4">Nastavenia objednávok</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Prefix čísla objednávky</label>
              <input
                type="text"
                value={settings.general.orderPrefix}
                onChange={(e) => settings.updateGeneral({ orderPrefix: e.target.value })}
                className="input-field"
                placeholder="ORD"
              />
              <p className="text-xs text-gray-500 mt-1">Príklad: {settings.general.orderPrefix}-0001</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-4">Notifikácie</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
              <div>
                <div className="font-medium">Email pri novej objednávke</div>
                <div className="text-sm text-gray-500">Dostanete email keď príde nová objednávka</div>
              </div>
              <button
                onClick={() => settings.updateNotifications({ emailNewOrder: !settings.notifications.emailNewOrder })}
                className={`toggle-switch ${settings.notifications.emailNewOrder ? 'active' : ''}`}
              >
                <span className="toggle-switch-dot" />
              </button>
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
              <div>
                <div className="font-medium">Email pri zmene stavu</div>
                <div className="text-sm text-gray-500">Zákazník dostane email pri zmene stavu objednávky</div>
              </div>
              <button
                onClick={() => settings.updateNotifications({ emailStatusChange: !settings.notifications.emailStatusChange })}
                className={`toggle-switch ${settings.notifications.emailStatusChange ? 'active' : ''}`}
              >
                <span className="toggle-switch-dot" />
              </button>
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
              <div>
                <div className="font-medium">SMS pri novej objednávke</div>
                <div className="text-sm text-gray-500">Dostanete SMS notifikáciu (vyžaduje SMS bránu)</div>
              </div>
              <button
                onClick={() => settings.updateNotifications({ smsNewOrder: !settings.notifications.smsNewOrder })}
                className={`toggle-switch ${settings.notifications.smsNewOrder ? 'active' : ''}`}
              >
                <span className="toggle-switch-dot" />
              </button>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
