'use client';
import Link from 'next/link';
import { Sparkles, ShoppingCart, Zap, Shield, BarChart3, Palette, Globe, ArrowRight, Check, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen aurora-bg">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl">EshopBuilder</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition">Funkcie</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition">Cenník</a>
            <a href="#templates" className="text-gray-400 hover:text-white transition">Šablóny</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-400 hover:text-white transition">Prihlásiť</Link>
            <Link href="/register" className="btn-primary text-sm py-2">Vyskúšať zadarmo</Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-8">
            <Zap className="w-4 h-4" /> Nová verzia 3.0 je tu!
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Vytvorte si <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">profesionálny e-shop</span> za pár minút
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Bez programovania, bez starostí. Importujte produkty z XML/CSV feedov a začnite predávať ešte dnes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-4">
              Začať zadarmo <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#demo" className="btn-secondary text-lg px-8 py-4">Pozrieť demo</a>
          </div>
          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-500">
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 14 dní zadarmo</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Bez kreditnej karty</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Zrušiť kedykoľvek</span>
          </div>
        </div>
      </section>

      <section className="py-16 border-y border-slate-800 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '10,000+', label: 'Aktívnych obchodov' },
            { value: '€50M+', label: 'Mesačný obrat' },
            { value: '99.9%', label: 'Dostupnosť' },
            { value: '24/7', label: 'Podpora' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{stat.value}</div>
              <div className="text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Všetko čo potrebujete</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">Kompletné riešenie pre váš online biznis</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ShoppingCart, title: 'Správa produktov', desc: 'Import z XML/CSV, kategórie, varianty, sklady' },
              { icon: Zap, title: 'Feed import', desc: 'Automatický import z Heureka, Google Shopping' },
              { icon: Palette, title: 'Krásne šablóny', desc: 'Profesionálne dizajny prispôsobiteľné na mieru' },
              { icon: BarChart3, title: 'Analytika', desc: 'Prehľadné štatistiky predajov a návštevnosti' },
              { icon: Shield, title: 'Bezpečnosť', desc: 'SSL, GDPR, bezpečné platby' },
              { icon: Globe, title: 'SEO optimalizácia', desc: 'Lepšie pozície vo vyhľadávačoch' },
            ].map((feature, i) => (
              <div key={i} className="stat-card">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Jednoduchý cenník</h2>
          <p className="text-gray-400 text-center mb-12">Vyberte si plán podľa vašich potrieb</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Starter', price: '19', features: ['500 produktov', '1 používateľ', 'Základné šablóny', 'Email podpora'] },
              { name: 'Business', price: '49', popular: true, features: ['5,000 produktov', '5 používateľov', 'Všetky šablóny', 'Prioritná podpora', 'Feed import', 'Vlastná doména'] },
              { name: 'Enterprise', price: '149', features: ['Neobmedzené produkty', 'Neobmedzení používatelia', 'Vlastný dizajn', 'Dedikovaná podpora', 'API prístup', 'SLA garancia'] },
            ].map((plan, i) => (
              <div key={i} className={`stat-card relative ${plan.popular ? 'border-blue-500 scale-105' : ''}`}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 rounded-full text-xs font-semibold">Najobľúbenejší</div>}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-6"><span className="text-4xl font-bold">€{plan.price}</span><span className="text-gray-500">/mes</span></div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => <li key={j} className="flex items-center gap-2 text-sm text-gray-400"><Check className="w-4 h-4 text-green-500" />{f}</li>)}
                </ul>
                <Link href="/register" className={`w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>Vybrať {plan.name}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pripravení začať?</h2>
          <p className="text-gray-400 mb-8">Pridajte sa k tisíckam spokojných podnikateľov</p>
          <Link href="/register" className="btn-primary text-lg px-8 py-4">Vytvoriť e-shop zadarmo <ArrowRight className="w-5 h-5" /></Link>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">EshopBuilder</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 EshopBuilder. Všetky práva vyhradené.</p>
        </div>
      </footer>
    </div>
  );
}
