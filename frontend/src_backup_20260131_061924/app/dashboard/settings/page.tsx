'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, CreditCard, Truck, Globe, Mail, Bell, Shield, Palette, Store, ChevronRight } from 'lucide-react';

const settingsMenu = [
  { href: '/dashboard/settings/general', icon: Store, label: 'Všeobecné', description: 'Názov obchodu, kontaktné údaje, mena' },
  { href: '/dashboard/settings/payments', icon: CreditCard, label: 'Platobné metódy', description: 'Stripe, PayPal, dobierka, prevod' },
  { href: '/dashboard/settings/shipping', icon: Truck, label: 'Doprava', description: 'Spôsoby doručenia, zóny, ceny' },
  { href: '/dashboard/settings/notifications', icon: Bell, label: 'Notifikácie', description: 'Emailové notifikácie, webhooky' },
  { href: '/dashboard/settings/legal', icon: Shield, label: 'Právne dokumenty', description: 'Obchodné podmienky, GDPR, cookies' },
  { href: '/dashboard/settings/integrations', icon: Globe, label: 'Integrácie', description: 'Google Analytics, Facebook Pixel, API' },
];

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Nastavenia</h1>
        <p className="text-gray-400 mt-1">Spravujte nastavenia vášho obchodu</p>
      </div>

      <div className="grid gap-4">
        {settingsMenu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 p-5 bg-gray-900 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all group"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <item.icon className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{item.label}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}
