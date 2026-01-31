'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Store, Loader2, Rocket } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewShopPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    currency: 'EUR',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Zadaj nazov e-shopu')
      return
    }
    
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('E-shop vytvoreny!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to create shop:', error)
      toast.error('Nepodarilo sa vytvorit e-shop')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard" 
          className="p-2 rounded-lg hover:bg-white/5 text-midnight-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display font-bold text-3xl text-white">
            Novy e-shop
          </h1>
          <p className="text-midnight-400">
            Vytvor si novy e-shop za par sekund
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-2xl bg-brand-500/20 flex items-center justify-center">
            <Store className="w-10 h-10 text-brand-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight-300 mb-2">
            Nazov e-shopu *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Napr. Moja Moda"
            className="input"
            required
          />
          <p className="text-xs text-midnight-500 mt-2">
            Tento nazov sa zobrazi zakaznikom
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
            <option value="CZK">CZK - Ceska koruna</option>
            <option value="USD">USD - Americky dolar</option>
            <option value="PLN">PLN - Polsky zloty</option>
            <option value="HUF">HUF - Madarsky forint</option>
          </select>
        </div>

        <div className="glass-brand rounded-xl p-4">
          <h3 className="font-medium text-white mb-2">Co ziskas:</h3>
          <ul className="text-sm text-midnight-300 space-y-1">
            <li>* Profesionalny e-shop pripraveny za minuty</li>
            <li>* Neobmedzeny pocet produktov</li>
            <li>* Vsetky platobne brany</li>
            <li>* AI asistent na generovanie obsahu</li>
            <li>* SSL certifikat zadarmo</li>
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
              Vytvorit e-shop
            </>
          )}
        </button>
      </form>
    </div>
  )
}
