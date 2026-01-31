'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, Package, Sparkles, ImagePlus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    short_description: '',
    price: '',
    compare_price: '',
    sku: '',
    quantity: '0',
    is_active: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Zadaj nazov produktu')
      return
    }
    
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Produkt vytvoreny!')
      router.push('/dashboard/products')
    } catch (error) {
      console.error('Failed to create product:', error)
      toast.error('Nepodarilo sa vytvorit produkt')
    } finally {
      setLoading(false)
    }
  }

  const generateDescription = async () => {
    if (!form.name) {
      toast.error('Najprv zadaj nazov produktu')
      return
    }
    
    setAiLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setForm(prev => ({
        ...prev,
        description: `Predstavujeme vam ${prev.name} - premiovy produkt navrhnuy s dorazom na kvalitu a funkcnost.\n\nHlavne vlastnosti:\n- Spickova kvalita spracovania\n- Elegantny dizajn\n- Dlha zivotnost\n\nIdealny pre narocnych zakaznikov, ktori ocenuju kvalitu.`,
        short_description: `${prev.name} - kvalitny produkt za skvelu cenu. Rychle dodanie.`
      }))
      toast.success('Popis vygenerovany!')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/products" 
          className="p-2 rounded-lg hover:bg-white/5 text-midnight-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display font-bold text-3xl text-white">
            Novy produkt
          </h1>
          <p className="text-midnight-400">
            Pridaj novy produkt do e-shopu
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="font-semibold text-white mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-400" />
            Zakladne informacie
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-midnight-300 mb-2">
                Nazov produktu *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Napr. iPhone 15 Pro Max 256GB"
                className="input"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-midnight-300">
                  Popis produktu
                </label>
                <button
                  type="button"
                  onClick={generateDescription}
                  disabled={aiLoading}
                  className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300"
                >
                  {aiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Generovat AI
                </button>
              </div>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Detailny popis produktu..."
                rows={6}
                className="input resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight-300 mb-2">
                Kratky popis
              </label>
              <input
                type="text"
                value={form.short_description}
                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                placeholder="Kratky popis pre nahlady"
                className="input"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold text-white mb-6">Cena a sklad</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-midnight-300 mb-2">
                Cena (EUR) *
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
                className="input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-midnight-300 mb-2">
                Povodna cena (EUR)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.compare_price}
                onChange={(e) => setForm({ ...form, compare_price: e.target.value })}
                placeholder="0.00"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight-300 mb-2">
                SKU
              </label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="Kod produktu"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight-300 mb-2">
                Mnozstvo na sklade
              </label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="0"
                className="input"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold text-white mb-6">Obrazky</h2>
          
          <div className="border-2 border-dashed border-midnight-700 rounded-xl p-8 text-center hover:border-brand-500/50 transition-colors cursor-pointer">
            <ImagePlus className="w-12 h-12 text-midnight-500 mx-auto mb-4" />
            <p className="text-midnight-400 mb-2">
              Pretiahni obrazky sem alebo klikni pre nahranie
            </p>
            <p className="text-sm text-midnight-600">
              PNG, JPG, WEBP do 5MB
            </p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-white">Publikovat produkt</h3>
              <p className="text-sm text-midnight-400">
                Produkt bude viditelny v e-shope
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-midnight-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Ulozit produkt
              </>
            )}
          </button>
          <Link href="/dashboard/products" className="btn-secondary">
            Zrusit
          </Link>
        </div>
      </form>
    </div>
  )
}
