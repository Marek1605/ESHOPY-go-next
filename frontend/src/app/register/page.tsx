'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Mail, Lock, Eye, EyeOff, User, AlertCircle, Loader2, CheckCircle, Check } from 'lucide-react';
import { AuthAPI } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const passwordStrength = () => {
    if (password.length === 0) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: 'Slabé', color: 'bg-red-500' };
    if (score <= 3) return { score, label: 'Stredné', color: 'bg-yellow-500' };
    return { score, label: 'Silné', color: 'bg-green-500' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Zadajte svoje meno');
      return;
    }

    if (!email.trim()) {
      setError('Zadajte emailovú adresu');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Zadajte platnú emailovú adresu');
      return;
    }

    if (password.length < 6) {
      setError('Heslo musí mať minimálne 6 znakov');
      return;
    }

    if (password !== confirmPassword) {
      setError('Heslá sa nezhodujú');
      return;
    }

    if (!acceptTerms) {
      setError('Musíte súhlasiť s podmienkami');
      return;
    }

    setLoading(true);

    try {
      const response = await AuthAPI.register(email.trim().toLowerCase(), password, name.trim());

      if (!response.ok) {
        if (response.error?.includes('already') || response.error?.includes('exists')) {
          setError('Účet s týmto emailom už existuje');
        } else {
          setError(response.error || 'Registrácia zlyhala');
        }
        return;
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError('Nastala neočakávaná chyba');
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Vytvorte si účet</h1>
          <p className="text-slate-400">Začnite budovať svoj e-shop zadarmo</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Meno</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="Ján Novák"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="vas@email.sk"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Heslo</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="Minimálne 6 znakov"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.score ? strength.color : 'bg-slate-700'}`} />
                    ))}
                  </div>
                  <p className={`text-xs ${strength.score <= 2 ? 'text-red-400' : strength.score <= 3 ? 'text-yellow-400' : 'text-green-400'}`}>
                    Sila hesla: {strength.label}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Potvrdiť heslo</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="Zopakujte heslo"
                  disabled={loading}
                />
                {confirmPassword && password === confirmPassword && (
                  <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                )}
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 mt-0.5"
              />
              <span className="text-sm text-slate-400">
                Súhlasím s{' '}
                <a href="#" className="text-blue-400 hover:underline">obchodnými podmienkami</a>{' '}
                a{' '}
                <a href="#" className="text-blue-400 hover:underline">ochranou osobných údajov</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Vytváram účet...
                </>
              ) : (
                'Vytvoriť účet zadarmo'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-500">
              <div className="flex flex-col items-center gap-1">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Zadarmo navždy</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Bez kreditky</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>24/7 podpora</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-400">
          Už máte účet?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Prihláste sa
          </Link>
        </p>
      </div>
    </div>
  );
}
