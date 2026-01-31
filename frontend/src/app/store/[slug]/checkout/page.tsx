'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Package, Truck, CreditCard, Building2, MapPin, Clock, Sparkles, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart, useCheckout } from '@/lib/store';

const SHIPPING = [
  { id: 'dpd', name: 'DPD', price: 4.90, time: '1-2 dni', hasWidget: true },
  { id: 'zasielkovna', name: 'Zásielkovňa', price: 2.90, time: '2-3 dni', hasWidget: true },
  { id: 'posta', name: 'Slovenská pošta', price: 3.50, time: '3-5 dní' },
  { id: 'personal', name: 'Osobný odber', price: 0, time: 'Ihneď' },
];

const PAYMENTS = [
  { id: 'card', name: 'Platba kartou', type: 'card' as const, fee: 0 },
  { id: 'bank', name: 'Bankový prevod', type: 'bank' as const, fee: 0 },
  { id: 'cod', name: 'Dobierka', type: 'cod' as const, fee: 1.50 },
];

const PICKUP_POINTS = [
  { id: '1', name: 'DPD ParcelShop Bratislava', address: 'Obchodná 123, 811 06 Bratislava' },
  { id: '2', name: 'DPD ParcelShop Petržalka', address: 'Námestie hraničiarov 5, 851 03 Bratislava' },
];

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || 'demo';
  const cart = useCart();
  const checkout = useCheckout();
  const [mounted, setMounted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [pickupPoint, setPickupPoint] = useState<any>(null);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="min-h-screen bg-gray-50" />;

  const cartTotal = cart.total();
  const shippingPrice = checkout.shippingMethod?.price || 0;
  const paymentFee = checkout.paymentMethod?.fee || 0;
  const freeShipping = cartTotal >= 50;
  const totalPrice = cartTotal + (freeShipping ? 0 : shippingPrice) + paymentFee;

  const handleSubmit = async () => {
    if (!checkout.agreeTerms) { toast.error('Súhlaste s podmienkami'); return; }
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    cart.clearCart();
    checkout.reset();
    router.push(`/store/${slug}/order/success`);
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      const { firstName, lastName, email, phone, street, city, zip } = checkout.address;
      return !!(firstName && lastName && email && phone && street && city && zip);
    }
    if (step === 2) return !!checkout.shippingMethod;
    if (step === 3) return !!checkout.paymentMethod;
    return true;
  };

  const handleNext = () => { if (validateStep(checkout.step)) checkout.nextStep(); else toast.error('Vyplňte všetky polia'); };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/store/${slug}`} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center"><Sparkles className="w-6 h-6 text-white" /></div>
            <span className="font-bold text-xl hidden sm:block">Checkout</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-600"><ShoppingCart className="w-4 h-4" />{cart.getCount()} položiek</div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            {[{ num: 1, label: 'Adresa' }, { num: 2, label: 'Doprava' }, { num: 3, label: 'Platba' }, { num: 4, label: 'Súhrn' }].map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`checkout-step-dot ${checkout.step > s.num ? 'completed' : checkout.step === s.num ? 'active' : 'pending'}`}>
                  {checkout.step > s.num ? <Check className="w-5 h-5" /> : s.num}
                </div>
                <span className={`hidden sm:block text-sm font-medium ${checkout.step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</span>
                {i < 3 && <div className={`w-12 h-0.5 ${checkout.step > s.num ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {!freeShipping && (
        <div className="bg-blue-50 border-b border-blue-100">
          <div className="max-w-6xl mx-auto px-4 py-3 text-center text-sm">
            <Truck className="w-4 h-4 inline mr-2 text-blue-600" />
            <span className="text-blue-800">Ešte <strong>€{(50 - cartTotal).toFixed(2)}</strong> do dopravy zadarmo!</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {checkout.step === 1 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-6">Dodacia adresa</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="input-label">Meno *</label><input type="text" value={checkout.address.firstName} onChange={(e) => checkout.setAddress({ firstName: e.target.value })} className="input-field" /></div>
                  <div><label className="input-label">Priezvisko *</label><input type="text" value={checkout.address.lastName} onChange={(e) => checkout.setAddress({ lastName: e.target.value })} className="input-field" /></div>
                  <div><label className="input-label">Email *</label><input type="email" value={checkout.address.email} onChange={(e) => checkout.setAddress({ email: e.target.value })} className="input-field" /></div>
                  <div><label className="input-label">Telefón *</label><input type="tel" value={checkout.address.phone} onChange={(e) => checkout.setAddress({ phone: e.target.value })} className="input-field" /></div>
                  <div className="md:col-span-2"><label className="input-label">Ulica *</label><input type="text" value={checkout.address.street} onChange={(e) => checkout.setAddress({ street: e.target.value })} className="input-field" /></div>
                  <div><label className="input-label">Mesto *</label><input type="text" value={checkout.address.city} onChange={(e) => checkout.setAddress({ city: e.target.value })} className="input-field" /></div>
                  <div><label className="input-label">PSČ *</label><input type="text" value={checkout.address.zip} onChange={(e) => checkout.setAddress({ zip: e.target.value })} className="input-field" /></div>
                </div>
              </div>
            )}

            {checkout.step === 2 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-6">Spôsob dopravy</h2>
                <div className="space-y-3">
                  {SHIPPING.map(method => (
                    <div key={method.id}>
                      <div onClick={() => { checkout.setShippingMethod({ id: method.id, name: method.name, price: freeShipping ? 0 : method.price, deliveryTime: method.time }); setPickupPoint(null); }} className={`shipping-option ${checkout.shippingMethod?.id === method.id ? 'selected' : ''}`}>
                        <Truck className="w-6 h-6 text-gray-600" />
                        <div className="flex-1"><div className="font-semibold">{method.name}</div><div className="text-sm text-gray-500">{method.time}</div></div>
                        <div className="font-semibold">{freeShipping || method.price === 0 ? 'Zadarmo' : `€${method.price}`}</div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${checkout.shippingMethod?.id === method.id ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                          {checkout.shippingMethod?.id === method.id && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      {checkout.shippingMethod?.id === method.id && method.hasWidget && (
                        <div className="mt-4 ml-4 p-4 bg-gray-50 rounded-xl border">
                          <h4 className="font-semibold mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600" />Vyberte výdajné miesto</h4>
                          <div className="bg-gray-200 rounded-lg h-32 mb-4 flex items-center justify-center text-gray-500 text-sm">Mapa výdajných miest</div>
                          <div className="space-y-2">
                            {PICKUP_POINTS.map(point => (
                              <div key={point.id} onClick={() => setPickupPoint(point)} className={`p-3 rounded-lg border cursor-pointer ${pickupPoint?.id === point.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                                <div className="font-medium text-sm">{point.name}</div><div className="text-xs text-gray-500">{point.address}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {checkout.step === 3 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-6">Spôsob platby</h2>
                <div className="space-y-3">
                  {PAYMENTS.map(method => (
                    <div key={method.id} onClick={() => checkout.setPaymentMethod({ id: method.id, name: method.name, type: method.type, fee: method.fee })} className={`payment-option ${checkout.paymentMethod?.id === method.id ? 'selected' : ''}`}>
                      <CreditCard className="w-6 h-6 text-gray-600" />
                      <div className="flex-1"><div className="font-semibold">{method.name}</div></div>
                      <div className="text-sm">{method.fee > 0 ? `+€${method.fee}` : 'Zadarmo'}</div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${checkout.paymentMethod?.id === method.id ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                        {checkout.paymentMethod?.id === method.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {checkout.step === 4 && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-xl font-bold mb-6">Súhrn objednávky</h2>
                  <div className="mb-6 pb-6 border-b"><h3 className="font-semibold mb-2">Dodacia adresa</h3><p className="text-gray-600">{checkout.address.firstName} {checkout.address.lastName}<br />{checkout.address.street}<br />{checkout.address.zip} {checkout.address.city}</p></div>
                  <div className="mb-6 pb-6 border-b"><h3 className="font-semibold mb-2">Doprava</h3><p>{checkout.shippingMethod?.name}</p></div>
                  <div><h3 className="font-semibold mb-2">Platba</h3><p>{checkout.paymentMethod?.name}</p></div>
                </div>
                <div className="card p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={checkout.agreeTerms} onChange={(e) => checkout.setAgreeTerms(e.target.checked)} className="w-5 h-5 rounded mt-0.5" />
                    <span className="text-sm">Súhlasím s <a href="#" className="text-blue-600 hover:underline">obchodnými podmienkami</a> *</span>
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              {checkout.step > 1 ? <button onClick={() => checkout.prevStep()} className="btn-secondary"><ArrowLeft className="w-4 h-4" />Späť</button> : <Link href={`/store/${slug}`} className="btn-secondary"><ArrowLeft className="w-4 h-4" />Späť</Link>}
              {checkout.step < 4 ? <button onClick={handleNext} className="btn-primary">Pokračovať<ArrowRight className="w-4 h-4" /></button> : <button onClick={handleSubmit} disabled={processing || !checkout.agreeTerms} className="btn-success">{processing ? <span className="spinner" /> : <Check className="w-4 h-4" />}Objednať s povinnosťou platby</button>}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold mb-4">Váš košík ({cart.getCount()})</h3>
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"><Package className="w-6 h-6 text-gray-400" /></div>
                    <div className="flex-1"><h4 className="font-medium text-sm">{item.name}</h4><p className="text-sm text-gray-500">{item.quantity}x €{item.price}</p></div>
                    <div className="font-semibold text-sm">€{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 py-4 border-t">
                <div className="flex justify-between text-sm"><span>Medzisúčet</span><span>€{cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span>Doprava</span><span className={freeShipping ? 'text-green-600' : ''}>{checkout.shippingMethod ? (freeShipping ? 'Zadarmo' : `€${shippingPrice}`) : '-'}</span></div>
                {paymentFee > 0 && <div className="flex justify-between text-sm"><span>Poplatok</span><span>€{paymentFee}</span></div>}
              </div>
              <div className="flex justify-between pt-4 border-t"><span className="font-bold">Celkom</span><span className="text-xl font-bold text-blue-600">€{totalPrice.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
