'use client';
import { useState } from 'react';
import { Check, Zap, Bot, Mail, MessageSquare, BarChart3, ExternalLink, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function IntegrationsSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [googleAnalytics, setGoogleAnalytics] = useState({ enabled: false, trackingId: '' });
  const [facebookPixel, setFacebookPixel] = useState({ enabled: false, pixelId: '' });
  const [mailchimp, setMailchimp] = useState({ enabled: false, apiKey: '', listId: '' });
  const [smartsupp, setSmartsupp] = useState({ enabled: false, key: '' });

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
          <h1 className="text-2xl font-bold">Integrácie</h1>
          <p className="text-gray-500">Prepojte váš e-shop s externými službami</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <span className="spinner" /> : <Check className="w-4 h-4" />}
          Uložiť zmeny
        </button>
      </div>

      <div className="space-y-6">
        {/* AI Assistant */}
        <div className="card">
          <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI Asistent</h3>
                  <p className="text-sm text-gray-600">Automatické doladenie e-shopu pomocou AI</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-info">Beta</span>
                <button
                  onClick={() => setAiEnabled(!aiEnabled)}
                  className={`toggle-switch ${aiEnabled ? 'active' : ''}`}
                >
                  <span className="toggle-switch-dot" />
                </button>
              </div>
            </div>
          </div>
          
          {aiEnabled && (
            <div className="p-6 space-y-4">
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-2">Čo AI asistent dokáže:</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Automaticky optimalizovať rozloženie e-shopu</li>
                  <li>• Navrhnúť farby a dizajn podľa vášho odvetvia</li>
                  <li>• Vytvoriť produktové popisy</li>
                  <li>• Optimalizovať SEO texty</li>
                </ul>
              </div>
              
              <div>
                <label className="input-label">Popíšte váš e-shop</label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Napr.: Predávam ekologickú kozmetiku pre ženy vo veku 25-45 rokov..."
                />
              </div>
              
              <button className="btn-primary">
                <Bot className="w-4 h-4" />
                Vygenerovať odporúčania
              </button>
            </div>
          )}
        </div>

        {/* Google Analytics */}
        <div className="card">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Google Analytics 4</h3>
                  <p className="text-sm text-gray-500">Sledujte návštevnosť a konverzie</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <a href="https://analytics.google.com" target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  Otvoriť GA <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setGoogleAnalytics(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`toggle-switch ${googleAnalytics.enabled ? 'active' : ''}`}
                >
                  <span className="toggle-switch-dot" />
                </button>
              </div>
            </div>
          </div>
          
          {googleAnalytics.enabled && (
            <div className="p-6">
              <div className="max-w-md">
                <label className="input-label">Measurement ID (G-XXXXXXXXXX)</label>
                <input
                  type="text"
                  value={googleAnalytics.trackingId}
                  onChange={(e) => setGoogleAnalytics(prev => ({ ...prev, trackingId: e.target.value }))}
                  className="input-field"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </div>
          )}
        </div>

        {/* Facebook Pixel */}
        <div className="card">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Facebook Pixel</h3>
                  <p className="text-sm text-gray-500">Sledujte konverzie z Facebook reklám</p>
                </div>
              </div>
              <button
                onClick={() => setFacebookPixel(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`toggle-switch ${facebookPixel.enabled ? 'active' : ''}`}
              >
                <span className="toggle-switch-dot" />
              </button>
            </div>
          </div>
          
          {facebookPixel.enabled && (
            <div className="p-6">
              <div className="max-w-md">
                <label className="input-label">Pixel ID</label>
                <input
                  type="text"
                  value={facebookPixel.pixelId}
                  onChange={(e) => setFacebookPixel(prev => ({ ...prev, pixelId: e.target.value }))}
                  className="input-field"
                  placeholder="123456789012345"
                />
              </div>
            </div>
          )}
        </div>

        {/* Mailchimp */}
        <div className="card">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Mailchimp</h3>
                  <p className="text-sm text-gray-500">Email marketing a automatizácie</p>
                </div>
              </div>
              <button
                onClick={() => setMailchimp(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`toggle-switch ${mailchimp.enabled ? 'active' : ''}`}
              >
                <span className="toggle-switch-dot" />
              </button>
            </div>
          </div>
          
          {mailchimp.enabled && (
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">API Kľúč</label>
                  <input
                    type="password"
                    value={mailchimp.apiKey}
                    onChange={(e) => setMailchimp(prev => ({ ...prev, apiKey: e.target.value }))}
                    className="input-field"
                    placeholder="xxxxxxxx-us1"
                  />
                </div>
                <div>
                  <label className="input-label">List ID</label>
                  <input
                    type="text"
                    value={mailchimp.listId}
                    onChange={(e) => setMailchimp(prev => ({ ...prev, listId: e.target.value }))}
                    className="input-field"
                    placeholder="abc123def4"
                  />
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Odberatelia newslettera budú automaticky pridaní do vášho Mailchimp listu.</p>
              </div>
            </div>
          )}
        </div>

        {/* Smartsupp */}
        <div className="card">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Smartsupp</h3>
                  <p className="text-sm text-gray-500">Live chat so zákazníkmi</p>
                </div>
              </div>
              <button
                onClick={() => setSmartsupp(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`toggle-switch ${smartsupp.enabled ? 'active' : ''}`}
              >
                <span className="toggle-switch-dot" />
              </button>
            </div>
          </div>
          
          {smartsupp.enabled && (
            <div className="p-6">
              <div className="max-w-md">
                <label className="input-label">Smartsupp Key</label>
                <input
                  type="text"
                  value={smartsupp.key}
                  onChange={(e) => setSmartsupp(prev => ({ ...prev, key: e.target.value }))}
                  className="input-field"
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
