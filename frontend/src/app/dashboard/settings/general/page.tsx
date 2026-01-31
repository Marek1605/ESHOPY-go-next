'use client';

import { useState } from 'react';
import { Globe, Bell, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GeneralSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [general, setGeneral] = useState({
    currency: 'EUR',
    language: 'sk',
    timezone: 'Europe/Bratislava',
    orderPrefix: 'ORD',
  });
  const [notifications, setNotifications] = useState({
    emailNewOrder: true,
    emailStatusChange: true,
    smsNewOrder: false,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Nastavenia ulozene');
    } catch (error) {
      toast.error('Chyba pri ukladani');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Vseobecne nastavenia</h1>
          <p className="text-gray-400">Zakladne nastavenia vasho e-shopu</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Ulozit
        </button>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-brand-400" />
          Regionalne nastavenia
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mena</label>
            <select value={general.currency} onChange={(e) => setGeneral({...general, currency: e.target.value})} className="input">
              <option value="EUR">EUR - Euro</option>
              <option value="CZK">CZK - Ceska koruna</option>
              <option value="USD">USD - Americky dolar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Jazyk</label>
            <select value={general.language} onChange={(e) => setGeneral({...general, language: e.target.value})} className="input">
              <option value="sk">Slovencina</option>
              <option value="cs">Cestina</option>
              <option value="en">Anglictina</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Casove pasmo</label>
            <select value={general.timezone} onChange={(e) => setGeneral({...general, timezone: e.target.value})} className="input">
              <option value="Europe/Bratislava">Europe/Bratislava</option>
              <option value="Europe/Prague">Europe/Prague</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Prefix objednavok</label>
            <input type="text" value={general.orderPrefix} onChange={(e) => setGeneral({...general, orderPrefix: e.target.value})} className="input" />
            <p className="text-xs text-gray-500 mt-1">Priklad: {general.orderPrefix}-0001</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand-400" />
          Notifikacie
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-midnight-800/50 rounded-lg">
            <div>
              <p className="font-medium text-white">Email pri novej objednavke</p>
              <p className="text-sm text-gray-400">Dostanem email pri kazdej novej objednavke</p>
            </div>
            <button onClick={() => setNotifications({...notifications, emailNewOrder: !notifications.emailNewOrder})} className={`w-12 h-6 rounded-full transition-colors ${notifications.emailNewOrder ? 'bg-brand-500' : 'bg-gray-600'}`}>
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications.emailNewOrder ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-midnight-800/50 rounded-lg">
            <div>
              <p className="font-medium text-white">Email pri zmene stavu</p>
              <p className="text-sm text-gray-400">Notifikacia pri zmene stavu objednavky</p>
            </div>
            <button onClick={() => setNotifications({...notifications, emailStatusChange: !notifications.emailStatusChange})} className={`w-12 h-6 rounded-full transition-colors ${notifications.emailStatusChange ? 'bg-brand-500' : 'bg-gray-600'}`}>
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications.emailStatusChange ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-midnight-800/50 rounded-lg">
            <div>
              <p className="font-medium text-white">SMS pri novej objednavke</p>
              <p className="text-sm text-gray-400">Dostanem SMS pri kazdej novej objednavke</p>
            </div>
            <button onClick={() => setNotifications({...notifications, smsNewOrder: !notifications.smsNewOrder})} className={`w-12 h-6 rounded-full transition-colors ${notifications.smsNewOrder ? 'bg-brand-500' : 'bg-gray-600'}`}>
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications.smsNewOrder ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
