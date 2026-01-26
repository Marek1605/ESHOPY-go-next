'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Store, Loader2, Rocket } from 'lucide-react';

export default function NewShopPage() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock - tu by bolo API volanie
    setTimeout(() => {
      setLoading(false);
      alert('Obchod vytvorený!');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Späť na dashboard
      </Link>
      <div className="bg-gray-800 rounded-xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <Store className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Nový obchod</h1>
            <p className="text-gray-400">Vytvorte si nový e-shop</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Názov obchodu</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-gray-700 rounded-lg" placeholder="Môj obchod" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">URL slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-3 bg-gray-700 rounded-lg" placeholder="moj-obchod" required />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
            {loading ? 'Vytváram...' : 'Vytvoriť obchod'}
          </button>
        </form>
      </div>
    </div>
  );
}
