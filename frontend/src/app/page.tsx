'use client';
import Link from 'next/link';
import { Sparkles, ShoppingCart, Zap, Shield, BarChart3, Palette, Globe, ArrowRight, Check } from 'lucide-react';

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
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-400 hover:text-white">Prihlásiť</Link>
            <Link href="/register" className="btn-primary text-sm py-2">Vyskúšať zadarmo</Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-8">
            <Zap className="w-4 h-4" /> Nová verzia 4.0!
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Vytvorte si <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">profesionálny e-shop</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10">Bez programovania, s krásnymi šablónami. Import z XML/CSV a predávajte za minúty.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-4">Začať zadarmo <ArrowRight className="w-5 h-5" /></Link>
            <Link href="/store/demo" className="btn-secondary text-lg px-8 py-4">Pozrieť demo</Link>
          </div>
        </div>
      </section>

      <section className="py-16 border-y border-slate-800 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[{ v: '10,000+', l: 'Obchodov' }, { v: '€50M+', l: 'Mesačný obrat' }, { v: '99.9%', l: 'Uptime' }, { v: '24/7', l: 'Podpora' }].map((s, i) => (
            <div key={i}><div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{s.v}</div><div className="text-gray-500">{s.l}</div></div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Všetko čo potrebujete</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ShoppingCart, title: 'Správa produktov', desc: 'Jednoduchý import a správa' },
              { icon: Palette, title: 'Krásne šablóny', desc: '6+ profesionálnych dizajnov' },
              { icon: BarChart3, title: 'Analytika', desc: 'Prehľadné štatistiky' },
              { icon: Zap, title: 'Feed import', desc: 'Heureka, Google Shopping' },
              { icon: Shield, title: 'Bezpečnosť', desc: 'SSL, GDPR ready' },
              { icon: Globe, title: 'SEO', desc: 'Optimalizované pre Google' },
            ].map((f, i) => (
              <div key={i} className="stat-card">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 px-4 text-center text-gray-500">
        © 2026 EshopBuilder. Všetky práva vyhradené.
      </footer>
    </div>
  );
}
