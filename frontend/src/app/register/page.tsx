'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Mail, Lock, User, Store, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const passwordRequirements = [
    { text: 'Minimálne 8 znakov', met: formData.password.length >= 8 }),
    { text: 'Aspoň jedno veľké písmeno', met: /[A-Z]/.test(formData.password) }),
    { text: 'Aspoň jedno číslo', met: /[0-9]/.test(formData.password) }),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Heslá sa nezhodujú');
      return;
    }

    if (!formData.acceptTerms) {
      toast.error('Musíte súhlasiť s obchodnými podmienkami');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          shop_name: formData.shopName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registrácia zlyhala');
      }

      toast.success('Účet bol úspešne vytvorený!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Registrácia zlyhala');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Vytvorte si účet</h1>
          <p className="text-gray-400">Začnite predávať online ešte dnes</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition ${
                step >= s 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'bg-slate-800 text-gray-400'
              }`}>
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 2 && <div className={`w-12 h-1 rounded ${step > 1 ? 'bg-blue-500' : 'bg-slate-700'}`} />}
            </div>
          ))}
        </div>

        {/* Register Form */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                {/* Name */}
                <div className="form-group">
                  <label className="form-label">Meno a priezvisko</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field pl-12"
                      placeholder="Ján Novák"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field pl-12"
                      placeholder="vas@email.sk"
                      required
                    />
                  </div>
                </div>

                {/* Shop Name */}
                <div className="form-group">
                  <label className="form-label">Názov vášho e-shopu</label>
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.shopName}
                      onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                      className="input-field pl-12"
                      placeholder="Môj super obchod"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    URL: {formData.shopName.toLowerCase().replace(/\s+/g, '-') || 'nazov-obchodu'}.eshopbuilder.sk
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.email || !formData.shopName}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  Pokračovať
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
              </>
            ) : (
              <>
                {/* Password */}
                <div className="form-group">
                  <label className="form-label">Heslo</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="input-field pl-12 pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Password requirements */}
                  <div className="mt-3 space-y-2">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className={`flex items-center gap-2 text-sm ${req.met ? 'text-green-400' : 'text-gray-500'}`}>
                        <CheckCircle className={`w-4 h-4 ${req.met ? 'text-green-400' : 'text-gray-600'}`} />
                        {req.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label className="form-label">Potvrdiť heslo</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="input-field pl-12"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">Heslá sa nezhodujú</p>
                  )}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                    className="w-5 h-5 mt-0.5 rounded border-gray-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-400">
                    Súhlasím s{' '}
                    <Link href="/terms" className="text-blue-400 hover:underline">obchodnými podmienkami</Link>
                    {' '}a{' '}
                    <Link href="/privacy" className="text-blue-400 hover:underline">ochranou osobných údajov</Link>
                  </span>
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 px-4 bg-slate-800 border border-slate-700 rounded-xl font-semibold text-white hover:bg-slate-700 transition"
                  >
                    Späť
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !passwordRequirements.every(r => r.met) || formData.password !== formData.confirmPassword}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="spinner" />
                    ) : (
                      <>
                        Vytvoriť účet
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center mt-8 text-gray-400">
          Už máte účet?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
            Prihláste sa
          </Link>
        </p>
      </div>
    </div>
  );
}
