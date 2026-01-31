'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle, Package, Mail, Home } from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'demo';
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="card p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Ďakujeme za objednávku!</h1>
          <p className="text-gray-600 mb-6">Vaša objednávka bola úspešne prijatá.</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="text-sm text-gray-500 mb-1">Číslo objednávky</div>
            <div className="text-xl font-bold text-blue-600">{orderNumber}</div>
          </div>
          <div className="flex items-center justify-center gap-3 text-sm text-gray-600 mb-6">
            <Mail className="w-4 h-4" /><span>Potvrdenie sme vám poslali na email</span>
          </div>
          <div className="space-y-3">
            <Link href={`/store/${slug}`} className="btn-primary w-full"><Home className="w-4 h-4" />Späť do obchodu</Link>
            <button className="btn-secondary w-full"><Package className="w-4 h-4" />Sledovať objednávku</button>
          </div>
        </div>
      </div>
    </div>
  );
}
