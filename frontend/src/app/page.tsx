'use client';

import Link from 'next/link';
import { 
  Store, Sparkles, Globe, CreditCard, BarChart3, Shield,
  ArrowRight, Check, Star, Zap, Users, Package
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold">EshopBuilder</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors">Funkcie</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Cenník</a>
            <a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
              Prihlásiť sa
            </Link>
            <Link 
              href="/register"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Vyskúšať zadarmo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 rounded-full text-blue-400 text-sm mb-8">
            <Sparkles className="w-4 h-4" />
            Powered by AI
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Vytvorte si profesionálny<br />
            <span className="gradient-text">e-shop za minúty</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            S pomocou AI vytvoríte krásny e-shop bez znalosti programovania. 
            Všetko čo potrebujete pre úspešný online predaj.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              href="/register"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2 btn-glow"
            >
              Začať zadarmo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#demo"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold text-lg transition-colors"
            >
              Pozrieť demo
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-blue-500">500+</div>
              <div className="text-gray-400">Aktívnych obchodov</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500">€2M+</div>
              <div className="text-gray-400">Spracovaných objednávok</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-500">99.9%</div>
              <div className="text-gray-400">Dostupnosť</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Všetko čo potrebujete</h2>
            <p className="text-xl text-gray-400">Kompletná platforma pre váš e-shop</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Sparkles}
              title="AI Asistent"
              description="Vytvorte popisy produktov, SEO texty a dizajn s pomocou umelej inteligencie"
              color="purple"
            />
            <FeatureCard 
              icon={Globe}
              title="Vlastná doména"
              description="Pripojte vlastnú doménu alebo použite našu subdoménu zadarmo"
              color="blue"
            />
            <FeatureCard 
              icon={CreditCard}
              title="Platobné brány"
              description="GoPay, Stripe, ComGate - prijímajte platby kartou aj prevodom"
              color="green"
            />
            <FeatureCard 
              icon={BarChart3}
              title="Analytika"
              description="Sledujte návštevnosť, tržby a správanie zákazníkov v reálnom čase"
              color="orange"
            />
            <FeatureCard 
              icon={Package}
              title="Správa produktov"
              description="Jednoduché pridávanie produktov, varianty, sklady, kategórie"
              color="pink"
            />
            <FeatureCard 
              icon={Shield}
              title="Bezpečnosť"
              description="SSL certifikát, GDPR, bezpečné platby, pravidelné zálohy"
              color="cyan"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Transparentný cenník</h2>
            <p className="text-xl text-gray-400">Žiadne skryté poplatky, zrušte kedykoľvek</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard 
              name="Starter"
              price="19"
              description="Pre začínajúce e-shopy"
              features={[
                "Do 100 produktov",
                "1 000 objednávok/mesiac",
                "Základné šablóny",
                "Email podpora",
                "SSL certifikát",
              ]}
            />
            <PricingCard 
              name="Business"
              price="49"
              description="Pre rastúce biznisy"
              features={[
                "Do 1 000 produktov",
                "Neobmedzené objednávky",
                "Prémiové šablóny",
                "AI asistent",
                "Prioritná podpora",
                "Vlastná doména",
                "Pokročilá analytika",
              ]}
              popular
            />
            <PricingCard 
              name="Enterprise"
              price="149"
              description="Pre veľké e-shopy"
              features={[
                "Neobmedzené produkty",
                "Neobmedzené objednávky",
                "Všetky šablóny",
                "Neobmedzený AI",
                "24/7 podpora",
                "Vlastný vývoj",
                "SLA 99.9%",
                "Dedikovaný server",
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Pripravení začať?</h2>
          <p className="text-xl text-gray-400 mb-10">
            Vytvorte si svoj e-shop ešte dnes. Prvých 14 dní zadarmo, bez nutnosti zadania karty.
          </p>
          <Link 
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg transition-all hover:scale-105"
          >
            Vyskúšať zadarmo
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Store className="w-6 h-6 text-blue-500" />
                <span className="font-bold">EshopBuilder</span>
              </div>
              <p className="text-gray-400 text-sm">
                Slovenská platforma pre tvorbu profesionálnych e-shopov.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produkt</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white">Funkcie</a></li>
                <li><a href="#pricing" className="hover:text-white">Cenník</a></li>
                <li><a href="#" className="hover:text-white">Šablóny</a></li>
                <li><a href="#" className="hover:text-white">Integrácie</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Podpora</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Dokumentácia</a></li>
                <li><a href="#" className="hover:text-white">Tutoriály</a></li>
                <li><a href="#" className="hover:text-white">Kontakt</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Právne</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Obchodné podmienky</a></li>
                <li><a href="#" className="hover:text-white">Ochrana súkromia</a></li>
                <li><a href="#" className="hover:text-white">GDPR</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            © 2024 EshopBuilder. Všetky práva vyhradené.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: {
  icon: any;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-600/20 text-purple-400',
    blue: 'bg-blue-600/20 text-blue-400',
    green: 'bg-green-600/20 text-green-400',
    orange: 'bg-orange-600/20 text-orange-400',
    pink: 'bg-pink-600/20 text-pink-400',
    cyan: 'bg-cyan-600/20 text-cyan-400',
  };

  return (
    <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700 card-hover">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function PricingCard({ name, price, description, features, popular }: {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}) {
  return (
    <div className={`p-8 rounded-2xl border ${
      popular 
        ? 'bg-blue-600/10 border-blue-500 scale-105' 
        : 'bg-gray-800/50 border-gray-700'
    } relative`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 rounded-full text-sm font-medium">
          Najobľúbenejší
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <div className="mb-6">
        <span className="text-4xl font-bold">€{price}</span>
        <span className="text-gray-400">/mesiac</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link 
        href="/register"
        className={`block w-full py-3 rounded-xl font-semibold text-center transition-colors ${
          popular 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-gray-700 hover:bg-gray-600'
        }`}
      >
        Začať teraz
      </Link>
    </div>
  );
}
