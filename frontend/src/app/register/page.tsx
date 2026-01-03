'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Mail, Lock, User, ArrowRight, Loader2, Check } from 'lucide-react'
import { auth } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

export default function RegisterPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await auth.register({ name, email, password })
      setAuth(data.token, data.user)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Registrácia zlyhala')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    'Neobmedzený počet produktov',
    'Vlastná doména',
    'AI asistent na generovanie popisov',
    'Všetky platobné brány',
    '14 dní zadarmo',
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left side - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-brand-600/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-lg px-12">
          <div className="mb-8 flex">
            <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center shadow-glow-lg">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h2 className="font-display font-bold text-4xl text-white mb-4">
            Začni predávať online ešte dnes
          </h2>
          <p className="text-xl text-midnight-300 mb-8">
            Vytvor si profesionálny e-shop za pár minút bez technických znalostí.
          </p>

          <div className="space-y-4">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-brand-400" />
                </div>
                <span className="text-midnight-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center shadow-glow">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">
              Eshop<span className="text-brand-400">Builder</span>
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-white mb-2">
              Vytvor si účet
            </h1>
            <p className="text-midnight-400">
              Začni zadarmo a otestuj všetky funkcie
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-danger-500/20 border border-danger-500/30 text-danger-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-midnight-300 mb-2">
                Meno
              </label>
              <div className="input-group">
                <User className="input-icon w-5 h-5" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tvoje meno"
                  className="input input-with-icon"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-midnight-300 mb-2">
                Email
              </label>
              <div className="input-group">
                <Mail className="input-icon w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="meno@email.sk"
                  className="input input-with-icon"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-midnight-300 mb-2">
                Heslo
              </label>
              <div className="input-group">
                <Lock className="input-icon w-5 h-5" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 znakov"
                  className="input input-with-icon"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                id="terms"
                className="w-4 h-4 mt-1 rounded bg-midnight-800 border-midnight-600 text-brand-500 focus:ring-brand-500" 
                required
              />
              <label htmlFor="terms" className="text-sm text-midnight-400">
                Súhlasím s{' '}
                <Link href="/terms" className="text-brand-400 hover:text-brand-300">
                  obchodnými podmienkami
                </Link>{' '}
                a{' '}
                <Link href="/privacy" className="text-brand-400 hover:text-brand-300">
                  ochranou súkromia
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Vytvoriť účet
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-midnight-400">
            Máš už účet?{' '}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium">
              Prihlásiť sa
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
