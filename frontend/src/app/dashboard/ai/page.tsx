'use client'

import { useState } from 'react'
import { 
  Sparkles, Send, Copy, Check, Loader2, FileText, 
  Search, Tag, Languages, MessageSquare, Wand2,
  ImageIcon, Package
} from 'lucide-react'

const AI_FEATURES = [
  {
    id: 'product-description',
    icon: FileText,
    title: 'Popis produktu',
    description: 'Vygeneruj predajný popis produktu',
    placeholder: 'Napíš názov produktu a základné info...',
    systemPrompt: 'Vytvor profesionálny, predajný popis produktu pre slovenský e-shop. Popis by mal byť pútavý, informačný a optimalizovaný pre SEO. Maximálne 200 slov.',
  },
  {
    id: 'seo-meta',
    icon: Search,
    title: 'SEO meta tagy',
    description: 'Optimalizuj pre vyhľadávače',
    placeholder: 'Zadaj názov produktu alebo kategórie...',
    systemPrompt: 'Vytvor SEO meta title (max 60 znakov) a meta description (max 160 znakov) pre slovenský e-shop. Zahrň kľúčové slová prirodzene.',
  },
  {
    id: 'tags',
    icon: Tag,
    title: 'Tagy a kategórie',
    description: 'Navrhni relevantné tagy',
    placeholder: 'Popis produktu alebo jeho názov...',
    systemPrompt: 'Navrhni 5-10 relevantných tagov/kľúčových slov pre tento produkt v slovenčine. Vrať ako čiarkami oddelený zoznam.',
  },
  {
    id: 'translate',
    icon: Languages,
    title: 'Preklad',
    description: 'Prelož do iného jazyka',
    placeholder: 'Text na preklad + cieľový jazyk...',
    systemPrompt: 'Prelož nasledujúci text do požadovaného jazyka. Zachovaj profesionálny tón vhodný pre e-shop.',
  },
  {
    id: 'email',
    icon: MessageSquare,
    title: 'Email šablóna',
    description: 'Vytvor email pre zákazníkov',
    placeholder: 'Aký typ emailu potrebuješ? (potvrdenie, sledovanie, remarketing...)',
    systemPrompt: 'Vytvor profesionálnu emailovú šablónu pre slovenský e-shop. Email by mal byť priateľský ale profesionálny.',
  },
  {
    id: 'improve',
    icon: Wand2,
    title: 'Vylepši text',
    description: 'Prepíš a vylepši existujúci text',
    placeholder: 'Vlož text na vylepšenie...',
    systemPrompt: 'Vylepši nasledujúci text - zlepši gramatiku, štýl a predajnú silu. Zachovaj pôvodný význam.',
  },
]

export default function AIPage() {
  const [selectedFeature, setSelectedFeature] = useState(AI_FEATURES[0])
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!input.trim()) return
    
    setLoading(true)
    setOutput('')
    
    try {
      // In production, this would call your AI API
      // For demo, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulated AI response based on feature
      const responses: Record<string, string> = {
        'product-description': `🎯 **${input}**

Predstavujeme vám prémiový produkt, ktorý zmení váš každodenný život. Vyrobený z najkvalitnejších materiálov a navrhnutý s dôrazom na detaily.

**Hlavné výhody:**
• Špičková kvalita spracovania
• Elegantný a nadčasový dizajn  
• Dlhá životnosť a spoľahlivosť
• Jednoduché používanie

Ideálny pre náročných zákazníkov, ktorí oceňujú kvalitu. Objednajte ešte dnes a presvedčte sa sami!

*Doprava zadarmo pri objednávke nad €50*`,
        'seo-meta': `**Meta Title:**
${input} | Najlepšia cena | Rýchle dodanie | EshopBuilder

**Meta Description:**
Kúpte ${input} za skvelú cenu ✓ Expresné dodanie do 24h ✓ Záruka kvality ✓ Overený predajca ✓ Tisíce spokojných zákazníkov`,
        'tags': `${input.toLowerCase()}, eshop, online nákup, slovensko, kvalitný produkt, najlepšia cena, rýchle dodanie, záruka, akcia, výpredaj`,
        'translate': `[Preložený text bude tu - v produkcii prepojené na Claude API]`,
        'email': `Predmet: Vaša objednávka je na ceste! 🚚

Dobrý deň,

Ďakujeme za vašu objednávku!

S radosťou vám oznamujeme, že vaša objednávka bola odoslaná a čoskoro bude u vás.

📦 Číslo zásielky: [TRACKING_NUMBER]
🚚 Očakávaný dátum doručenia: [DATE]

Stav zásielky môžete sledovať na: [TRACKING_LINK]

Ak máte akékoľvek otázky, neváhajte nás kontaktovať.

S pozdravom,
Tím [SHOP_NAME]`,
        'improve': `[Vylepšený text] - Váš text bol prepracovaný s lepšou gramatikou, štýlom a predajnou silou. V produkcii prepojené na Claude API pre skutočné vylepšenia.`,
      }
      
      setOutput(responses[selectedFeature.id] || 'Generovanie zlyhalo')
    } catch (error) {
      setOutput('Chyba pri generovaní. Skúste to znova.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-brand-400" />
          </div>
          <h1 className="font-display font-bold text-3xl text-white">
            AI Asistent
          </h1>
        </div>
        <p className="text-midnight-400">
          Využi silu AI na generovanie obsahu pre tvoj e-shop
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Feature Selection */}
        <div className="space-y-3">
          <h2 className="font-semibold text-white mb-4">Vyber funkciu</h2>
          {AI_FEATURES.map((feature) => (
            <button
              key={feature.id}
              onClick={() => {
                setSelectedFeature(feature)
                setOutput('')
              }}
              className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all ${
                selectedFeature.id === feature.id
                  ? 'bg-brand-500/20 border border-brand-500/30'
                  : 'bg-midnight-800/50 hover:bg-midnight-800 border border-transparent'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                selectedFeature.id === feature.id ? 'bg-brand-500/30' : 'bg-midnight-700'
              }`}>
                <feature.icon className={`w-5 h-5 ${
                  selectedFeature.id === feature.id ? 'text-brand-400' : 'text-midnight-400'
                }`} />
              </div>
              <div className="text-left">
                <div className={`font-medium ${
                  selectedFeature.id === feature.id ? 'text-white' : 'text-midnight-200'
                }`}>
                  {feature.title}
                </div>
                <div className="text-sm text-midnight-500">
                  {feature.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Input/Output */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input */}
          <div className="card">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <selectedFeature.icon className="w-5 h-5 text-brand-400" />
              {selectedFeature.title}
            </h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={selectedFeature.placeholder}
              rows={4}
              className="input resize-none mb-4"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="btn-primary"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generovať
                </>
              )}
            </button>
          </div>

          {/* Output */}
          {(output || loading) && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Výsledok</h3>
                {output && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Skopírované
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Kopírovať
                      </>
                    )}
                  </button>
                )}
              </div>
              
              {loading ? (
                <div className="flex items-center gap-3 text-midnight-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>AI generuje obsah...</span>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-midnight-200 leading-relaxed">
                    {output}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tips */}
          <div className="glass-brand rounded-xl p-6">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              Tipy pre lepšie výsledky
            </h3>
            <ul className="space-y-2 text-sm text-midnight-300">
              <li>• Buď konkrétny - čím viac detailov, tým lepší výsledok</li>
              <li>• Uveď cieľovú skupinu produktu</li>
              <li>• Spomeň kľúčové vlastnosti a výhody</li>
              <li>• Môžeš požiadať o úpravu vygenerovaného textu</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
