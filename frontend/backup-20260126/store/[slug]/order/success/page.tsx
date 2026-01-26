'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Mail } from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const slug = params.slug as string;
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Ďakujeme za objednávku!</h1>
        <p className="text-gray-500 mb-6">Vaša objednávka bola úspešne prijatá</p>
        
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500">Číslo objednávky</p>
          <p className="text-xl font-bold text-blue-500">{orderNumber}</p>
        </div>

        <div className="space-y-4 text-left mb-8">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Mail className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium text-sm">Potvrdenie odoslané</p>
              <p className="text-xs text-gray-500">Skontrolujte svoj email</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
            <Package className="w-5 h-5 text-orange-500" />
            <div>
              <p className="font-medium text-sm">Pripravujeme balík</p>
              <p className="text-xs text-gray-500">Očakávané odoslanie: dnes</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
            <Truck className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium text-sm text-gray-400">Doručenie</p>
              <p className="text-xs text-gray-400">1-2 pracovné dni</p>
            </div>
          </div>
        </div>

        <Link href={`/store/${slug}`} className="block w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
          Pokračovať v nákupe
        </Link>
      </div>
    </div>
  );
}
