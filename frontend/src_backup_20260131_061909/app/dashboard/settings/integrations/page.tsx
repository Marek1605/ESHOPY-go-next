'use client';
import { useState } from 'react';
import { Plug, Mail, BarChart3, MessageSquare, Save, Check, X } from 'lucide-react';

const integrations = [
  { id: 'google-analytics', name: 'Google Analytics', icon: BarChart3, color: 'text-orange-400', description: 'Sledovanie návštevnosti a konverzií' },
  { id: 'mailchimp', name: 'Mailchimp', icon: Mail, color: 'text-yellow-400', description: 'Email marketing a newsletter' },
  { id: 'facebook-pixel', name: 'Facebook Pixel', icon: MessageSquare, color: 'text-blue-400', description: 'Remarketing a cielenie reklám' },
];

export default function IntegrationsSettingsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  const toggle = (id: string) => setEnabled(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Integrácie</h1>
        <p className="text-gray-400">Prepojte váš obchod s externými službami</p>
      </div>
      <div className="grid gap-6">
        {integrations.map(int => (
          <div key={int.id} className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <int.icon className={`w-6 h-6 ${int.color}`} />
                <div>
                  <h2 className="text-lg font-semibold">{int.name}</h2>
                  <p className="text-sm text-gray-400">{int.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={enabled[int.id] || false} onChange={() => toggle(int.id)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-checked:bg-green-500 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
            {enabled[int.id] && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <label className="block text-sm font-medium mb-2">API kľúč / ID</label>
                <input type="text" value={apiKeys[int.id] || ''} onChange={(e) => setApiKeys(prev => ({ ...prev, [int.id]: e.target.value }))} className="w-full px-4 py-3 bg-gray-700 rounded-lg" placeholder={`Zadajte ${int.name} kľúč`} />
              </div>
            )}
          </div>
        ))}

        <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold flex items-center justify-center gap-2">
          <Save className="w-5 h-5" /> Uložiť integrácie
        </button>
      </div>
    </div>
  );
}
