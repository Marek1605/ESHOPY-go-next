'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { auth } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await auth.login({ email, password })
      setAuth(data.token, data.user)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Prihlásenie zlyhalo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
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
              Vitaj späť
            </h1>
            <p className="text-midnight-400">
              Prihláš sa do svojho účtu a spravuj svoje e-shopy
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-danger-500/20 border border-danger-500/30 text-danger-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="••••••••"
                  className="input input-with-icon"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-midnight-800 border-midnight-600 text-brand-500 focus:ring-brand-500" />
                <span className="text-sm text-midnight-400">Zapamätať si ma</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-brand-400 hover:text-brand-300">
                Zabudnuté heslo?
              </Link>
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
                  Prihlásiť sa
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-midnight-400">
            Nemáš ešte účet?{' '}
            <Link href="/register" className="text-brand-400 hover:text-brand-300 font-medium">
              Registrovať sa
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-600/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center max-w-md px-8">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 rounded-3xl gradient-brand flex items-center justify-center shadow-glow-lg animate-float">
              <ShoppingBag className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="font-display font-bold text-3xl text-white mb-4">
            Spravuj svoje e-shopy jednoducho
          </h2>
          <p className="text-midnight-300">
            Všetko na jednom mieste - produkty, objednávky, zákazníci a analytika.
          </p>
        </div>
      </div>
    </div>
  )
}
