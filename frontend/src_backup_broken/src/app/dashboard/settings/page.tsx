'use client';
import Link from 'next/link';
import { Store, CreditCard, Truck, Puzzle, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const settingsGroups = [
    {
      title: 'Základné nastavenia',
      items: [
        { href: '/dashboard/settings/general', icon: Store, label: 'Všeobecné', desc: 'Názov obchodu, kontakt, mena, jazyk' },
        { href: '/dashboard/settings/payments', icon: CreditCard, label: 'Platby', desc: 'Comgate, GoPay, bankový prevod, dobierka' },
        { href: '/dashboard/settings/shipping', icon: Truck, label: 'Doprava', desc: 'DPD, Zásielkovňa, Pošta, GLS, osobný odber' },
      ]
    },
    {
      title: 'Pokročilé',
      items: [
        { href: '/dashboard/settings/integrations', icon: Puzzle, label: 'Integrácie', desc: 'AI asistent, Google Analytics, Facebook Pixel' },
      ]
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Nastavenia</h1>
        <p className="text-gray-400">Spravujte nastavenia vášho e-shopu</p>
      </div>

      <div className="space-y-8">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-lg font-semibold mb-4 text-gray-300">{group.title}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className="stat-card p-6 hover:border-blue-500/50 transition-colors group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{item.label}</h3>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 stat-card p-6">
        <h3 className="font-semibold mb-4">Stav nastavení</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-400">Platby nakonfigurované</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-400">Doprava aktívna</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm text-gray-400">Integrácie čiastočne</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-400">Obchod pripravený</span>
          </div>
        </div>
      </div>
    </div>
  );
}
