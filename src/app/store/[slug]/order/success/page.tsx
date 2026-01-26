'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { 
  CheckCircle, Package, Truck, Mail, ArrowRight, Sparkles, 
  Download, Share2, Calendar, MapPin, Clock, Phone, HelpCircle,
  Facebook, Twitter, Copy, Check
} from 'lucide-react';
import { useCart, useEditor, formatPrice } from '@/lib/store';

export default function OrderSuccessPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { clearCart } = useCart();
  const { shopSettings } = useEditor();
  const theme = shopSettings.theme;
  
  const [copied, setCopied] = useState(false);
  const orderNumber = `ORD-${Date.now().toString().slice(-8).toUpperCase()}`;
  const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  useEffect(() => {
    clearCart();
  }, []);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}/store/${slug}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=Práve som nakúpil v ${shopSettings.name}!&url=${encodeURIComponent(window.location.origin)}/store/${slug}`, '_blank');
  };

  return (
    <div 
      className="min-h-screen py-12 px-4"
      style={{ 
        fontFamily: theme.fontFamily,
        background: `linear-gradient(135deg, ${theme.surfaceColor} 0%, ${theme.backgroundColor} 100%)`,
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header with animation */}
          <div 
            className="p-8 text-center text-white relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)` }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
            
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="w-14 h-14" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Ďakujeme za objednávku!</h1>
              <p className="text-white/80 text-lg">Vaša objednávka bola úspešne prijatá</p>
            </div>
          </div>

          {/* Order Number */}
          <div className="p-6 border-b">
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <p className="text-sm text-gray-500 mb-1">Číslo objednávky</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-3xl font-bold" style={{ color: theme.primaryColor }}>
                  {orderNumber}
                </p>
                <button
                  onClick={copyOrderNumber}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Kopírovať"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="p-6 space-y-4">
            <h2 className="font-semibold text-lg mb-4">Stav objednávky</h2>
            
            {/* Step 1: Confirmed */}
            <div 
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ backgroundColor: `${theme.primaryColor}15` }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Objednávka potvrdená</p>
                <p className="text-sm text-gray-500">Potvrdenie odoslané na váš email</p>
              </div>
              <CheckCircle className="w-6 h-6" style={{ color: theme.primaryColor }} />
            </div>

            {/* Step 2: Processing */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50">
              <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white">
                <Package className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Pripravujeme balík</p>
                <p className="text-sm text-gray-500">Očakávané odoslanie: dnes</p>
              </div>
              <div className="w-6 h-6 border-2 border-orange-500 rounded-full border-t-transparent animate-spin" />
            </div>

            {/* Step 3: Shipping */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-100 opacity-60">
              <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white">
                <Truck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-500">Odoslané prepravcovi</p>
                <p className="text-sm text-gray-400">Čakáme na odoslanie</p>
              </div>
            </div>

            {/* Step 4: Delivered */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-100 opacity-60">
              <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-500">Doručené</p>
                <p className="text-sm text-gray-400">Očakávané doručenie: {estimatedDelivery.toLocaleDateString('sk-SK')}</p>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="p-6 border-t bg-gray-50">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Očakávané doručenie</p>
                  <p className="font-semibold">{estimatedDelivery.toLocaleDateString('sk-SK', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doručovacia adresa</p>
                  <p className="font-semibold">Vaša zadaná adresa</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 space-y-3">
            <Link 
              href={`/store/${slug}`}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-white transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: theme.primaryColor }}
            >
              Pokračovať v nákupe <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link 
              href="/dashboard/orders"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold border-2 transition-colors hover:bg-gray-50"
              style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
            >
              Zobraziť moje objednávky
            </Link>
          </div>

          {/* Share */}
          <div className="p-6 border-t">
            <p className="text-sm text-gray-500 text-center mb-4">Páčil sa vám nákup? Zdieľajte to!</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={shareOnFacebook}
                className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                onClick={shareOnTwitter}
                className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" /> Potrebujete pomoc?
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <a 
              href={`mailto:${shopSettings.email}`}
              className="flex items-center gap-3 p-4 rounded-xl border hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-500">{shopSettings.email}</p>
              </div>
            </a>
            <a 
              href={`tel:${shopSettings.phone}`}
              className="flex items-center gap-3 p-4 rounded-xl border hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">Telefón</p>
                <p className="text-sm text-gray-500">{shopSettings.phone}</p>
              </div>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm">Powered by EshopBuilder</span>
          </div>
        </div>
      </div>
    </div>
  );
}
