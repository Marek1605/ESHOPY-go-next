'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ShoppingBag, Zap, Shield, BarChart3, Globe, 
  ArrowRight, CheckCircle, Star, Users, Package, TrendingUp,
  Play, ChevronRight, Menu, X
} from 'lucide-react';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: ShoppingBag, title: 'Jednoduchý E-shop', desc: 'Vytvorte si profesionálny e-shop za pár minút bez programovania' },
    { icon: Zap, title: 'Bleskovo rýchly', desc: 'Optimalizované pre rýchlosť a SEO, načítanie do 1 sekundy' },
    { icon: Shield, title: 'Bezpečné platby', desc: 'Integrácia s Stripe, PayPal, GoPay a ďalšími platobými bránami' },
    { icon: BarChart3, title: 'Analytika v reálnom čase', desc: 'Sledujte predaje, návštevnosť a konverzie v prehľadnom dashboarde' },
    { icon: Globe, title: 'Viacjazyčnosť', desc: 'Predávajte po celom svete s podporou viacerých jazykov a mien' },
    { icon: Package, title: 'Import produktov', desc: 'Automatický import z XML/CSV feedov, Heureka, Google Shopping' },
  ];

  const templates = [
    { name: 'Aurora', color: 'from-blue-500 to-purple-600', category: 'Móda' },
    { name: 'Minimalist', color: 'from-gray-700 to-gray-900', category: 'Elektronika' },
    { name: 'Fresh', color: 'from-green-400 to-emerald-600', category: 'Potraviny' },
    { name: 'Luxury', color: 'from-amber-500 to-orange-600', category: 'Šperky' },
  ];

  const stats = [
    { value: '10,000+', label: 'Aktívnych obchodov' },
    { value: '€50M+', label: 'Mesačný obrat' },
    { value: '99.9%', label: 'Dostupnosť' },
    { value: '24/7', label: 'Podpora' },
  ];

  const testimonials = [
    { name: 'Martin K.', role: 'CEO, TechShop.sk', text: 'EshopBuilder nám pomohol zvýšiť predaje o 300% za prvý rok.', avatar: 'M' },
    { name: 'Jana N.', role: 'Majiteľka, ModaDnes.sk', text: 'Najlepšia platforma pre e-commerce na slovenskom trhu.', avatar: 'J' },
    { name: 'Peter S.', role: 'Zakladateľ, BioFood.sk', text: 'Import produktov a automatizácia mi ušetrili hodiny práce denne.', avatar: 'P' },
  ];

  const pricing = [
    { 
      name: 'Starter', 
      price: '€19', 
      period: '/mesiac',
      features: ['100 produktov', '1 GB úložisko', 'Základné šablóny', 'Email podpora'],
      popular: false
    },
    { 
      name: 'Business', 
      price: '€49', 
      period: '/mesiac',
      features: ['Neobmedzené produkty', '10 GB úložisko', 'Premium šablóny', 'Priority podpora', 'API prístup', 'Multi-jazyk'],
      popular: true
    },
    { 
      name: 'Enterprise', 
      price: '€149', 
      period: '/mesiac',
      features: ['Všetko z Business', '100 GB úložisko', 'Vlastná doména', 'Dedikovaný manažér', 'SLA 99.99%', 'White-label'],
      popular: false
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-950/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">EshopBuilder</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition">Funkcie</Link>
              <Link href="#templates" className="text-gray-300 hover:text-white transition">Šablóny</Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition">Cenník</Link>
              <Link href="/login" className="text-gray-300 hover:text-white transition">Prihlásiť sa</Link>
              <Link href="/register" className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:opacity-90 transition">
                Vyskúšať zadarmo
              </Link>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800">
            <div className="px-4 py-4 space-y-3">
              <Link href="#features" className="block py-2 text-gray-300">Funkcie</Link>
              <Link href="#templates" className="block py-2 text-gray-300">Šablóny</Link>
              <Link href="#pricing" className="block py-2 text-gray-300">Cenník</Link>
              <Link href="/login" className="block py-2 text-gray-300">Prihlásiť sa</Link>
              <Link href="/register" className="block py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-center font-medium">
                Vyskúšať zadarmo
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl" />
          <div className="absolute top-60 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">Nová verzia 3.0 práve vyšla</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Vytvorte si 
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"> profesionálny e-shop </span>
              za pár minút
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Všetko čo potrebujete pre úspešný online biznis. Bez programovania, bez komplikácií.
              Pridajte sa k tisícom spokojných obchodníkov.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-lg hover:opacity-90 transition flex items-center justify-center gap-2 group">
                Začať zadarmo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-slate-800 border border-slate-700 rounded-xl font-semibold text-lg hover:bg-slate-700 transition flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Pozrieť demo
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>14 dní zadarmo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Bez kreditnej karty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Zrušiť kedykoľvek</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-gray-400">dashboard.eshopbuilder.sk</span>
              </div>
              <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800">
                {/* Mock dashboard */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Dnešné predaje', value: '€2,847', change: '+12%', color: 'text-green-400' },
                    { label: 'Objednávky', value: '156', change: '+8%', color: 'text-green-400' },
                    { label: 'Návštevníci', value: '3,421', change: '+23%', color: 'text-green-400' },
                    { label: 'Konverzia', value: '4.6%', change: '+0.5%', color: 'text-green-400' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                    </div>
                  ))}
                </div>
                <div className="h-48 bg-slate-800/30 rounded-xl border border-slate-700 flex items-center justify-center">
                  <TrendingUp className="w-24 h-24 text-slate-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Všetko pre váš 
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> úspešný e-shop</span>
            </h2>
            <p className="text-xl text-gray-400">
              Komplexné riešenie s funkciami, ktoré potrebujete pre rast vášho biznisu
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="group p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 md:py-32 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Profesionálne 
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> šablóny</span>
            </h2>
            <p className="text-xl text-gray-400">
              Vyberte si z desiatkov krásnych šablón optimalizovaných pre konverzie
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template, i) => (
              <div key={i} className="group cursor-pointer">
                <div className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${template.color} p-6 mb-4 transition-transform group-hover:scale-105`}>
                  <div className="h-full bg-white/10 backdrop-blur rounded-lg" />
                </div>
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <p className="text-gray-400 text-sm">{template.category}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/templates" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition">
              Zobraziť všetky šablóny
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Čo hovoria naši 
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> zákazníci</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Transparentný 
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> cenník</span>
            </h2>
            <p className="text-xl text-gray-400">
              Vyberte si plán, ktorý vyhovuje vašim potrebám. Bez skrytých poplatkov.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, i) => (
              <div key={i} className={`relative p-8 rounded-2xl border ${
                plan.popular 
                  ? 'bg-gradient-to-b from-blue-500/10 to-purple-500/10 border-blue-500/50' 
                  : 'bg-slate-900 border-slate-800'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-sm font-medium">
                    Najpopulárnejší
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`block w-full py-3 rounded-xl font-semibold text-center transition ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90'
                    : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'
                }`}>
                  Začať s {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pripravený začať predávať online?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Pridajte sa k tisícom úspešných obchodníkov, ktorí používajú EshopBuilder
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-lg hover:opacity-90 transition group">
            Vytvoriť e-shop zadarmo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">EshopBuilder</span>
              </Link>
              <p className="text-gray-400 text-sm">
                Najlepšia platforma pre e-commerce na Slovensku a v Česku.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produkt</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#features" className="hover:text-white transition">Funkcie</Link></li>
                <li><Link href="#templates" className="hover:text-white transition">Šablóny</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition">Cenník</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition">Integrácie</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Podpora</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/docs" className="hover:text-white transition">Dokumentácia</Link></li>
                <li><Link href="/help" className="hover:text-white transition">Centrum pomoci</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Kontakt</Link></li>
                <li><Link href="/status" className="hover:text-white transition">Stav systému</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Spoločnosť</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-white transition">O nás</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition">Kariéra</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Ochrana súkromia</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 text-sm">
            <p>© 2026 EshopBuilder. Všetky práva vyhradené.</p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-white transition">Obchodné podmienky</Link>
              <Link href="/privacy" className="hover:text-white transition">Ochrana údajov</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
