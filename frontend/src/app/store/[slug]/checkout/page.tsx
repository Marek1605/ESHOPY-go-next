'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Truck, CreditCard, Check, Loader2 } from 'lucide-react';
import { useCart, useCheckout } from '@/lib/store';
import toast from 'react-hot-toast';

const SHIPPING_METHODS = [
  { id: 'dpd', name: 'DPD Kurier', price: 4.90, time: '1-2 dni' },
  { id: 'zasielkovna', name: 'Zasielkovna', price: 2.90, time: '2-3 dni' },
  { id: 'posta', name: 'Slovenska posta', price: 3.50, time: '3-5 dni' },
  { id: 'pickup', name: 'Osobny odber', price: 0, time: 'Ihned' },
];

const PAYMENT_METHODS = [
  { id: 'card', name: 'Platobna karta', fee: 0 },
  { id: 'transfer', name: 'Bankovy prevod', fee: 0 },
  { id: 'cod', name: 'Dobierka', fee: 1.50 },
];

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const cart = useCart();
  const checkout = useCheckout();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState('dpd');
  const [selectedPayment, setSelectedPayment] = useState('card');

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen bg-gray-50" />;

  const cartTotal = cart.total();
  const shipping = SHIPPING_METHODS.find(s => s.id === selectedShipping);
  const payment = PAYMENT_METHODS.find(p => p.id === selectedPayment);
  const shippingPrice = shipping?.price || 0;
  const paymentFee = payment?.fee || 0;
  const freeShipping = cartTotal >= 50;
  const totalPrice = cartTotal + (freeShipping ? 0 : shippingPrice) + paymentFee;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      cart.clearCart();
      checkout.reset();
      router.push(`/store/${params.slug}/order/success`);
    } catch (error) {
      toast.error('Chyba pri spracovani objednavky');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Kosik je prazdny</h2>
          <Link href={`/store/${params.slug}`} className="text-blue-600 hover:underline">
            Pokracovat v nakupovani
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/store/${params.slug}`} className="p-2 hover:bg-gray-200 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Pokladna</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 ml-auto">
            <ShoppingCart className="w-4 h-4" />
            {cart.getCount()} poloziek
          </div>
        </div>

        {!freeShipping && cartTotal > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <span className="text-blue-800">Este <strong>EUR {(50 - cartTotal).toFixed(2)}</strong> do dopravy zadarmo!</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Dodacia adresa
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Meno" className="input" value={checkout.address.firstName} onChange={(e) => checkout.setAddress({ firstName: e.target.value })} />
                <input type="text" placeholder="Priezvisko" className="input" value={checkout.address.lastName} onChange={(e) => checkout.setAddress({ lastName: e.target.value })} />
                <input type="email" placeholder="Email" className="input sm:col-span-2" value={checkout.address.email} onChange={(e) => checkout.setAddress({ email: e.target.value })} />
                <input type="tel" placeholder="Telefon" className="input sm:col-span-2" value={checkout.address.phone} onChange={(e) => checkout.setAddress({ phone: e.target.value })} />
                <input type="text" placeholder="Ulica a cislo" className="input sm:col-span-2" value={checkout.address.street} onChange={(e) => checkout.setAddress({ street: e.target.value })} />
                <input type="text" placeholder="Mesto" className="input" value={checkout.address.city} onChange={(e) => checkout.setAddress({ city: e.target.value })} />
                <input type="text" placeholder="PSC" className="input" value={checkout.address.zip} onChange={(e) => checkout.setAddress({ zip: e.target.value })} />
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-600" />
                Sposob dopravy
              </h2>
              <div className="space-y-3">
                {SHIPPING_METHODS.map((method) => (
                  <label key={method.id} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${selectedShipping === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" checked={selectedShipping === method.id} onChange={() => setSelectedShipping(method.id)} className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.time}</p>
                      </div>
                    </div>
                    <span className="font-semibold">{freeShipping || method.price === 0 ? 'Zadarmo' : `EUR ${method.price.toFixed(2)}`}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Sposob platby
              </h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <label key={method.id} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${selectedPayment === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={selectedPayment === method.id} onChange={() => setSelectedPayment(method.id)} className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{method.name}</span>
                    </div>
                    <span className="font-semibold">{method.fee > 0 ? `+EUR ${method.fee.toFixed(2)}` : 'Zadarmo'}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8">
              <h3 className="font-bold mb-4">Vas kosik ({cart.getCount()})</h3>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.quantity}x {item.name}</span>
                    <span className="font-medium">EUR {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Medzisucet</span>
                  <span>EUR {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Doprava</span>
                  <span>{freeShipping ? 'Zadarmo' : `EUR ${shippingPrice.toFixed(2)}`}</span>
                </div>
                {paymentFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Poplatok za platbu</span>
                    <span>EUR {paymentFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Celkom</span>
                  <span>EUR {totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                {loading ? 'Spracuvam...' : 'Dokoncit objednavku'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
