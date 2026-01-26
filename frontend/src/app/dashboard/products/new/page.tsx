'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Loader2, Save } from 'lucide-react';

export default function NewProductPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Produkt vytvorený!');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Späť na produkty
      </Link>
      <div className="bg-gray-800 rounded-xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Nový produkt</h1>
            <p className="text-gray-400">Pridajte nový produkt do obchodu</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Názov produktu</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-gray-700 rounded-lg" placeholder="Názov produktu" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Cena (€)</label>
            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 bg-gray-700 rounded-lg" placeholder="0.00" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Popis</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 bg-gray-700 rounded-lg h-32" placeholder="Popis produktu..." />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {loading ? 'Ukladám...' : 'Uložiť produkt'}
          </button>
        </form>
      </div>
    </div>
  );
}
