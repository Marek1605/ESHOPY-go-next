'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Store, Loader2, Rocket } from 'lucide-react'
import { useAuthStore, useShopStore } from '@/lib/store'
import { shops as shopsApi } from '@/lib/api'

export default function NewShopPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const { setCurrentShop, setShops, shops } = useShopStore()
  
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    currency: 'EUR',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    
    setLoading(true)
    try {
      const newShop = await shopsApi.create(token, form)
      setShops([...shops, newShop])
      setCurrentShop(newShop)
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to create shop:', error)
      alert('Nepodarilo sa vytvoriť e-shop')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard" 
          className="p-2 rounded-lg hover:bg-white/5 text-midnight-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display font-bold text-3xl text-white">
            Nový e-shop
          </h1>
          <p className="text-midnight-400">
            Vytvor si nový e-shop za pár sekúnd
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-2xl bg-brand-500/20 flex items-center justify-center">
            <Store className="w-10 h-10 text-brand-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight-300 mb-2">
            Názov e-shopu *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Napr. Moja Móda"
            className="input"
            required
          />
          <p className="text-xs text-midnight-500 mt-2">
            Tento názov sa zobrazí zákazníkom
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight-300 mb-2">
            Mena
          </label>
          <select
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="input"
          >
            <option value="EUR">EUR - Euro</option>
            <option value="CZK">CZK - Česká koruna</option>
            <option value="USD">USD - Americký dolár</option>
            <option value="PLN">PLN - Poľský zlotý</option>
            <option value="HUF">HUF - Maďarský forint</option>
          </select>
        </div>

        <div className="glass-brand rounded-xl p-4">
          <h3 className="font-medium text-white mb-2">Čo získaš:</h3>
          <ul className="text-sm text-midnight-300 space-y-1">
            <li>✓ Profesionálny e-shop pripravený za minúty</li>
            <li>✓ Neobmedzený počet produktov</li>
            <li>✓ Všetky platobné brány</li>
            <li>✓ AI asistent na generovanie obsahu</li>
            <li>✓ SSL certifikát zadarmo</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading || !form.name}
          className="btn-primary w-full py-4"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Rocket className="w-5 h-5" />
              Vytvoriť e-shop
            </>
          )}
        </button>
      </form>
    </div>
  )
}
