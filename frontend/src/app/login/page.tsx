'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { AuthAPI, TokenManager } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if already logged in
  useEffect(() => {
    if (TokenManager.isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!email.trim()) {
      setError('Zadajte emailovú adresu');
      return;
    }

    if (!password) {
      setError('Zadajte heslo');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Zadajte platnú emailovú adresu');
      return;
    }

    setLoading(true);

    try {
      const response = await AuthAPI.login(email.trim().toLowerCase(), password);

      if (!response.ok) {
        // Handle specific errors
        if (response.error?.includes('credentials') || response.error?.includes('Invalid')) {
          setError('Nesprávny email alebo heslo');
        } else if (response.error?.includes('disabled') || response.error?.includes('inactive')) {
          setError('Váš účet bol deaktivovaný. Kontaktujte podporu.');
        } else if (response.status === 0) {
          setError('Nepodarilo sa pripojiť k serveru. Skúste to znova.');
        } else {
          setError(response.error || 'Prihlásenie zlyhalo');
        }
        return;
      }

      setSuccess('Prihlásenie úspešné! Presmerovávam...');

      // Redirect based on user role
      const user = response.data?.user;
      setTimeout(() => {
        if (user?.role === 'superadmin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }, 500);

    } catch (err: any) {
      console.error('Login error:', err);
      setError('Nastala neočakávaná chyba. Skúste to znova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Vitajte späť</h1>
          <p className="text-slate-400">Prihláste sa do svojho účtu</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="vas@email.sk"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  Heslo
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Zabudli ste heslo?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Prihlasujem...
                </>
              ) : (
                'Prihlásiť sa'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-slate-500 text-sm">alebo</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* Demo Account Info */}
          <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl">
            <p className="text-sm text-slate-400 text-center">
              <span className="text-slate-300 font-medium">Demo účet:</span><br />
              Email: demo@example.com<br />
              Heslo: demo123
            </p>
          </div>
        </div>

        {/* Register Link */}
        <p className="text-center mt-8 text-slate-400">
          Nemáte účet?{' '}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Zaregistrujte sa zadarmo
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center mt-6 text-slate-500 text-sm">
          © 2024 E-Shop Builder. Všetky práva vyhradené.
        </p>
      </div>
    </div>
  );
}
