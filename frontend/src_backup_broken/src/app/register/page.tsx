'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Mail, Lock, User, Store, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', shop: '', terms: false });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const reqs = [
    { t: 'Min 8 znakov', ok: form.password.length >= 8 },
    { t: 'Veľké písmeno', ok: /[A-Z]/.test(form.password) },
    { t: 'Číslo', ok: /[0-9]/.test(form.password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Heslá sa nezhodujú'); return; }
    if (!form.terms) { toast.error('Súhlas s podmienkami'); return; }
    setLoading(true);
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const res = await fetch(api + '/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      if (res.status === 201 || res.status === 200) {
        toast.success('Účet vytvorený!');
        router.push('/login');
        return;
      }
      const data = await res.json();
      throw new Error(data.error || 'Chyba');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Vytvorte si účet</h1>
        </div>
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-slate-800 text-gray-400'}`}>
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 2 && <div className={`w-12 h-1 rounded ${step > 1 ? 'bg-blue-500' : 'bg-slate-700'}`} />}
            </div>
          ))}
        </div>
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                <div>
                  <label className="form-label">Meno</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field pl-12" placeholder="Ján Novák" required />
                  </div>
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field pl-12" placeholder="vas@email.sk" required />
                  </div>
                </div>
                <div>
                  <label className="form-label">Názov e-shopu</label>
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={form.shop} onChange={e => setForm({ ...form, shop: e.target.value })} className="input-field pl-12" placeholder="Môj obchod" required />
                  </div>
                </div>
                <button type="button" onClick={() => setStep(2)} disabled={!form.name || !form.email || !form.shop} className="btn-primary w-full py-3">
                  Pokračovať <ArrowRight className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="form-label">Heslo</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-field pl-12 pr-12" required />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="mt-3 space-y-1">
                    {reqs.map((r, i) => (
                      <div key={i} className={`flex items-center gap-2 text-sm ${r.ok ? 'text-green-400' : 'text-gray-500'}`}>
                        <CheckCircle className="w-4 h-4" />{r.t}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="form-label">Potvrdiť heslo</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type={show ? 'text' : 'password'} value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} className="input-field pl-12" required />
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.terms} onChange={e => setForm({ ...form, terms: e.target.checked })} className="w-5 h-5 rounded" />
                  <span className="text-sm text-gray-400">Súhlasím s <a href="#" className="text-blue-400">podmienkami</a></span>
                </label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">Späť</button>
                  <button type="submit" disabled={loading || !reqs.every(r => r.ok) || form.password !== form.confirm || !form.terms} className="btn-primary flex-1 py-3">
                    {loading ? <div className="spinner" /> : 'Vytvoriť'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
        <p className="text-center mt-8 text-gray-400">
          Máte účet? <Link href="/login" className="text-blue-400">Prihlásiť</Link>
        </p>
      </div>
    </div>
  );
}
