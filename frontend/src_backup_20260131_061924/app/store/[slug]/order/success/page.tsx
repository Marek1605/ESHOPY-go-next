'use client';

import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Mail, Phone, ArrowRight, Home, ShoppingBag, Download, Printer } from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const orderNumber = searchParams.get('order') || 'ORD-' + Date.now();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ďakujeme za objednávku!</h1>
          <p className="text-gray-600 mb-8">Vaša objednávka bola úspešne prijatá a spracováva sa.</p>

          {/* Order Number */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <p className="text-sm text-gray-500 mb-1">Číslo objednávky</p>
            <p className="text-2xl font-bold text-gray-900">{orderNumber}</p>
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-600 mt-2">Prijatá</p>
            </div>
            <div className="w-12 h-0.5 bg-gray-200" />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                <Package className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-400 mt-2">Balenie</p>
            </div>
            <div className="w-12 h-0.5 bg-gray-200" />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                <Truck className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-400 mt-2">Odoslané</p>
            </div>
          </div>

          {/* Info */}
          <div className="grid md:grid-cols-2 gap-4 mb-8 text-left">
            <div className="bg-blue-50 rounded-xl p-4">
              <Mail className="w-5 h-5 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Potvrdenie emailom</h3>
              <p className="text-sm text-gray-600">Na váš email sme odoslali potvrdenie objednávky s detailmi.</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <Truck className="w-5 h-5 text-purple-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Sledovanie zásielky</h3>
              <p className="text-sm text-gray-600">Po odoslaní vám zašleme číslo na sledovanie.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/store/${slug}`}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Pokračovať v nákupe
            </Link>
            <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5" />
              Stiahnuť potvrdenie
            </button>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-2">Potrebujete pomoc?</p>
          <div className="flex items-center justify-center gap-4">
            <a href="mailto:podpora@demoshop.sk" className="flex items-center gap-2 text-blue-600 hover:underline">
              <Mail className="w-4 h-4" /> podpora@demoshop.sk
            </a>
            <a href="tel:+421900123456" className="flex items-center gap-2 text-blue-600 hover:underline">
              <Phone className="w-4 h-4" /> +421 900 123 456
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
