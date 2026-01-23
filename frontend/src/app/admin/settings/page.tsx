'use client';

import { useEffect, useState } from 'react';
import { Settings, Save, Palette, Globe, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface ShopConfig {
  shop_name: string;
  shop_url: string;
  logo: string | null;
  favicon: string | null;
  currency: string;
  locale: string;
  template: string;
  primary_color: string;
  secondary_color: string;
  google_analytics: string | null;
  meta_title: string | null;
  meta_description: string | null;
  custom_css: string | null;
  custom_js: string | null;
}

export default function SettingsPage() {
  const [config, setConfig] = useState<ShopConfig>({
    shop_name: 'My Shop',
    shop_url: '',
    logo: null,
    favicon: null,
    currency: 'EUR',
    locale: 'sk',
    template: 'aurora',
    primary_color: '#3B82F6',
    secondary_color: '#10B981',
    google_analytics: null,
    meta_title: null,
    meta_description: null,
    custom_css: null,
    custom_js: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await api.getShopConfig();
      setConfig(data);
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.updateShopConfig(config);
      toast.success('Settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'seo', label: 'SEO', icon: Globe },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Configure your shop settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center gap-2"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-64 flex lg:flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500/20 text-white border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 card p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">General Settings</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Shop Name</label>
                <input
                  type="text"
                  value={config.shop_name}
                  onChange={(e) => setConfig({ ...config, shop_name: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Shop URL</label>
                <input
                  type="url"
                  value={config.shop_url || ''}
                  onChange={(e) => setConfig({ ...config, shop_url: e.target.value })}
                  className="input"
                  placeholder="https://yourshop.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                  <select
                    value={config.currency}
                    onChange={(e) => setConfig({ ...config, currency: e.target.value })}
                    className="input"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="CZK">CZK (Kč)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Locale</label>
                  <select
                    value={config.locale}
                    onChange={(e) => setConfig({ ...config, locale: e.target.value })}
                    className="input"
                  >
                    <option value="sk">Slovenčina</option>
                    <option value="cs">Čeština</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Google Analytics ID</label>
                <input
                  type="text"
                  value={config.google_analytics || ''}
                  onChange={(e) => setConfig({ ...config, google_analytics: e.target.value })}
                  className="input"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Appearance</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Template</label>
                <div className="grid md:grid-cols-3 gap-4">
                  {['aurora', 'minimal', 'modern'].map((template) => (
                    <button
                      key={template}
                      type="button"
                      onClick={() => setConfig({ ...config, template })}
                      className={`p-4 rounded-xl border transition-all ${
                        config.template === template
                          ? 'bg-blue-500/20 border-blue-500/50 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <div className="text-center">
                        <Palette className="w-8 h-8 mx-auto mb-2" />
                        <span className="font-medium capitalize">{template}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.primary_color}
                      onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.primary_color}
                      onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                      className="input flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.secondary_color}
                      onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.secondary_color}
                      onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                      className="input flex-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label>
                <input
                  type="url"
                  value={config.logo || ''}
                  onChange={(e) => setConfig({ ...config, logo: e.target.value })}
                  className="input"
                  placeholder="https://yourshop.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Custom CSS</label>
                <textarea
                  value={config.custom_css || ''}
                  onChange={(e) => setConfig({ ...config, custom_css: e.target.value })}
                  className="input min-h-[150px] font-mono text-sm"
                  placeholder="/* Your custom CSS */"
                />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">SEO Settings</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Meta Title</label>
                <input
                  type="text"
                  value={config.meta_title || ''}
                  onChange={(e) => setConfig({ ...config, meta_title: e.target.value })}
                  className="input"
                  placeholder="Your Shop - Best Products Online"
                />
                <p className="text-gray-500 text-xs mt-1">Recommended: 50-60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Meta Description</label>
                <textarea
                  value={config.meta_description || ''}
                  onChange={(e) => setConfig({ ...config, meta_description: e.target.value })}
                  className="input min-h-[100px]"
                  placeholder="Discover our amazing collection of products..."
                />
                <p className="text-gray-500 text-xs mt-1">Recommended: 150-160 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Favicon URL</label>
                <input
                  type="url"
                  value={config.favicon || ''}
                  onChange={(e) => setConfig({ ...config, favicon: e.target.value })}
                  className="input"
                  placeholder="https://yourshop.com/favicon.ico"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
