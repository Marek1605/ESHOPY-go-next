'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Sparkles, ShoppingBag, Zap, Shield, Globe, BarChart3, 
  CreditCard, Package, Users, ArrowRight, Check, Star,
  Rocket, Brain, Palette, Clock, ChevronRight, Menu, X,
  Play, MousePointer, Layers, MessageSquare
} from 'lucide-react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-glow">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Eshop<span className="text-brand-400">Builder</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <a href="#features" className="nav-link">Funkcie</a>
              <a href="#pricing" className="nav-link">Cenník</a>
              <a href="#ai" className="nav-link">AI Asistent</a>
              <a href="#testimonials" className="nav-link">Referencie</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="btn-ghost">Prihlásiť sa</Link>
              <Link href="/register" className="btn-primary">
                Vyskúšať zadarmo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-midnight-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-dark border-t border-midnight-800">
            <div className="px-4 py-4 space-y-2">
              <a href="#features" className="block px-4 py-2 text-midnight-300 hover:text-white">Funkcie</a>
              <a href="#pricing" className="block px-4 py-2 text-midnight-300 hover:text-white">Cenník</a>
              <a href="#ai" className="block px-4 py-2 text-midnight-300 hover:text-white">AI Asistent</a>
              <div className="pt-4 space-y-2">
                <Link href="/login" className="block w-full btn-secondary text-center">Prihlásiť sa</Link>
                <Link href="/register" className="block w-full btn-primary text-center">Vyskúšať zadarmo</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-brand-600/15 rounded-full blur-3xl animate-pulse-slow animate-delay-300" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-brand mb-8 animate-fade-up">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-medium text-brand-300">Nová verzia s AI asistentom</span>
            </div>

            {/* Main headline */}
            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-6 animate-fade-up animate-delay-100">
              <span className="text-white">Vytvor si </span>
              <span className="gradient-brand bg-clip-text text-transparent">profesionálny</span>
              <br />
              <span className="text-white">e-shop za minúty</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-midnight-300 mb-10 max-w-2xl mx-auto animate-fade-up animate-delay-200">
              Najmodernejšia platforma na tvorbu e-shopov pre slovenský a český trh. 
              S AI asistentom, ktorý ti pomôže s popismi, SEO a marketingom.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up animate-delay-300">
              <Link href="/register" className="btn-primary text-lg px-8 py-4">
                <Rocket className="w-5 h-5" />
                Začať zadarmo
              </Link>
              <button className="btn-secondary text-lg px-8 py-4">
                <Play className="w-5 h-5" />
                Pozrieť demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-up animate-delay-400">
              {[
                { value: '2,500+', label: 'Aktívnych e-shopov' },
                { value: '€15M+', label: 'Tržby našich klientov' },
                { value: '99.9%', label: 'Uptime' },
                { value: '4.9/5', label: 'Hodnotenie' },
              ].map((stat, i) => (
                <div key={i} className="glass rounded-2xl p-6">
                  <div className="font-display font-bold text-3xl text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-midnight-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 relative animate-fade-up animate-delay-500">
            <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="glass rounded-3xl p-2 shadow-2xl shadow-brand-500/10">
              <div className="bg-midnight-900 rounded-2xl overflow-hidden">
                {/* Browser header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-midnight-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-danger-500/60" />
                    <div className="w-3 h-3 rounded-full bg-warning-500/60" />
                    <div className="w-3 h-3 rounded-full bg-success-500/60" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-lg bg-midnight-800/50 text-xs text-midnight-400">
                      dashboard.eshopbuilder.sk
                    </div>
                  </div>
                </div>
                
                {/* Dashboard content placeholder */}
                <div className="aspect-[16/9] bg-gradient-to-br from-midnight-900 to-midnight-950 p-8">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                      { icon: ShoppingBag, label: 'Objednávky', value: '1,234', color: 'brand' },
                      { icon: Package, label: 'Produkty', value: '5,678', color: 'success' },
                      { icon: Users, label: 'Zákazníci', value: '890', color: 'warning' },
                      { icon: BarChart3, label: 'Tržby', value: '€45,678', color: 'brand' },
                    ].map((card, i) => (
                      <div key={i} className="stat-card">
                        <card.icon className={`w-8 h-8 text-${card.color}-400 mb-3`} />
                        <div className="text-2xl font-bold text-white">{card.value}</div>
                        <div className="text-sm text-midnight-400">{card.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 glass rounded-xl p-4 h-48">
                      <div className="text-sm font-medium text-midnight-300 mb-4">Prehľad tržieb</div>
                      <div className="flex items-end gap-2 h-32">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                          <div key={i} className="flex-1 bg-brand-500/30 rounded-t" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="glass rounded-xl p-4">
                      <div className="text-sm font-medium text-midnight-300 mb-4">Top produkty</div>
                      <div className="space-y-3">
                        {[1, 2, 3].map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-midnight-700/50" />
                            <div className="flex-1">
                              <div className="h-2 bg-midnight-700/50 rounded w-3/4 mb-1" />
                              <div className="h-2 bg-midnight-700/30 rounded w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
              Všetko čo potrebuješ pre úspešný e-shop
            </h2>
            <p className="text-xl text-midnight-400 max-w-2xl mx-auto">
              Kompletná platforma s všetkými nástrojmi pre rast tvojho online podnikania
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: Brain, 
                title: 'AI Asistent', 
                description: 'Generuj popisy produktov, SEO texty a marketingový obsah pomocou AI',
                color: 'brand'
              },
              { 
                icon: Palette, 
                title: 'Krásne šablóny', 
                description: 'Profesionálne dizajnové šablóny optimalizované pre konverzie',
                color: 'success'
              },
              { 
                icon: CreditCard, 
                title: 'Platobné brány', 
                description: 'GoPay, Stripe, ComGate - všetky slovenské aj medzinárodné brány',
                color: 'warning'
              },
              { 
                icon: Globe, 
                title: 'Vlastná doména', 
                description: 'Pripoj svoju doménu alebo použi našu subdoménu zadarmo',
                color: 'brand'
              },
              { 
                icon: BarChart3, 
                title: 'Analytika', 
                description: 'Detailné štatistiky o návštevnosti, predajoch a zákazníkoch',
                color: 'success'
              },
              { 
                icon: Shield, 
                title: 'Bezpečnosť', 
                description: 'SSL certifikát, GDPR compliance a automatické zálohy',
                color: 'warning'
              },
              { 
                icon: Zap, 
                title: 'Bleskovo rýchle', 
                description: 'Optimalizované pre rýchlosť - načítanie pod 1 sekundu',
                color: 'brand'
              },
              { 
                icon: Package, 
                title: 'Správa skladu', 
                description: 'Sleduj zásoby, varianty produktov a automatické upozornenia',
                color: 'success'
              },
              { 
                icon: MessageSquare, 
                title: 'Email marketing', 
                description: 'Automatické emaily, newsletter a remarketing kampane',
                color: 'warning'
              },
            ].map((feature, i) => (
              <div key={i} className="card card-hover card-glow group">
                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{feature.title}</h3>
                <p className="text-midnight-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-brand mb-6">
                <Brain className="w-4 h-4 text-brand-400" />
                <span className="text-sm font-medium text-brand-300">Powered by Claude AI</span>
              </div>
              
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-6">
                AI asistent pre tvoj e-shop
              </h2>
              
              <p className="text-xl text-midnight-300 mb-8">
                Nechaj AI vytvoriť perfektné popisy produktov, SEO texty a marketingový obsah. 
                Ušetríš hodiny práce a získaš profesionálny obsah.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Automatické popisy produktov z obrázka',
                  'SEO optimalizované texty a meta tagy',
                  'Preklad do viacerých jazykov',
                  'Personalizované odporúčania produktov',
                  'Chatbot pre zákaznícku podporu',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-brand-400" />
                    </div>
                    <span className="text-midnight-200">{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/register" className="btn-primary">
                Vyskúšať AI zadarmo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* AI Demo Card */}
            <div className="glass rounded-3xl p-6 relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-500/30 rounded-full blur-2xl" />
              
              <div className="space-y-4">
                {/* Input */}
                <div className="bg-midnight-800/50 rounded-xl p-4">
                  <div className="text-xs text-midnight-500 mb-2">Zadaj názov produktu:</div>
                  <div className="text-white">iPhone 15 Pro Max 256GB</div>
                </div>
                
                {/* AI Response */}
                <div className="glass-brand rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-brand-400" />
                    <span className="text-xs text-brand-300">AI generovaný popis</span>
                  </div>
                  <p className="text-sm text-midnight-200 leading-relaxed">
                    Zažite budúcnosť s iPhone 15 Pro Max - vlajkovou loďou od Apple. 
                    Titan dizajn, revolučný A17 Pro čip a profesionálny kamerový systém 
                    s 5x optickým zoomom. 256GB úložisko pre všetky vaše spomienky...
                  </p>
                </div>

                {/* Generated tags */}
                <div className="flex flex-wrap gap-2">
                  {['Apple', 'iPhone', 'Smartphone', '5G', 'ProMax'].map((tag, i) => (
                    <span key={i} className="badge badge-brand">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
              Jednoduchý a férový cenník
            </h2>
            <p className="text-xl text-midnight-400">
              Žiadne skryté poplatky. Zruš kedykoľvek.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '€19',
                description: 'Pre začínajúce e-shopy',
                features: [
                  'Až 100 produktov',
                  'Vlastná subdoména',
                  '2 platobné brány',
                  'Email podpora',
                  'Základné štatistiky',
                ],
                cta: 'Začať zadarmo',
                popular: false,
              },
              {
                name: 'Business',
                price: '€49',
                description: 'Pre rastúce biznisy',
                features: [
                  'Neobmedzené produkty',
                  'Vlastná doména',
                  'Všetky platobné brány',
                  'AI asistent (1000 req/mesiac)',
                  'Prioritná podpora',
                  'Pokročilá analytika',
                  'Email marketing',
                ],
                cta: 'Vybrať Business',
                popular: true,
              },
              {
                name: 'Enterprise',
                price: '€149',
                description: 'Pre veľké e-shopy',
                features: [
                  'Všetko z Business',
                  'AI asistent neobmedzene',
                  'Vlastný account manager',
                  'API prístup',
                  'Multi-store podpora',
                  'SLA 99.99%',
                ],
                cta: 'Kontaktovať',
                popular: false,
              },
            ].map((plan, i) => (
              <div 
                key={i} 
                className={`relative card ${plan.popular ? 'border-brand-500/50 shadow-glow' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="badge badge-brand px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Najpopulárnejší
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="font-display font-bold text-2xl text-white mb-2">{plan.name}</h3>
                  <p className="text-midnight-400 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-display font-bold text-5xl text-white">{plan.price}</span>
                    <span className="text-midnight-400">/mesiac</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-midnight-300">
                      <Check className="w-5 h-5 text-brand-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={plan.popular ? 'btn-primary w-full' : 'btn-secondary w-full'}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-6">
            Pripravený začať predávať online?
          </h2>
          <p className="text-xl text-midnight-300 mb-10">
            Vytvor si e-shop za pár minút. Prvých 14 dní zadarmo, bez kreditnej karty.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-lg px-8 py-4">
              <Rocket className="w-5 h-5" />
              Vytvoriť e-shop zadarmo
            </Link>
            <Link href="/demo" className="btn-secondary text-lg px-8 py-4">
              Pozrieť live demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-midnight-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-white">
                  Eshop<span className="text-brand-400">Builder</span>
                </span>
              </Link>
              <p className="text-sm text-midnight-400">
                Najmodernejšia platforma na tvorbu e-shopov pre SK/CZ trh.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Produkt</h4>
              <ul className="space-y-2 text-sm text-midnight-400">
                <li><a href="#" className="hover:text-white transition-colors">Funkcie</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cenník</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Asistent</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Šablóny</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Podpora</h4>
              <ul className="space-y-2 text-sm text-midnight-400">
                <li><a href="#" className="hover:text-white transition-colors">Dokumentácia</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontakt</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Právne</h4>
              <ul className="space-y-2 text-sm text-midnight-400">
                <li><a href="#" className="hover:text-white transition-colors">Obchodné podmienky</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ochrana súkromia</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-midnight-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-midnight-500">
              © 2025 EshopBuilder. Všetky práva vyhradené.
            </p>
            <div className="flex items-center gap-4 text-midnight-500">
              <span className="text-sm">🇸🇰 Vyrobené na Slovensku</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
