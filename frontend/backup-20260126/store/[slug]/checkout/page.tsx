'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Truck, CreditCard, Package } from 'lucide-react';
import { useCart } from '@/lib/store';

const steps = ['Kontakt', 'Doprava', 'Platba', 'Súhrn'];

const shippingMethods = [
  { id: 'dpd', name: 'DPD', price: 4.90, time: '1-2 dni' },
  { id: 'zasielkovna', name: 'Zásielkovňa', price: 2.90, time: '2-3 dni' },
  { id: 'pickup', name: 'Osobný odber', price: 0, time: 'Ihneď' },
];

const paymentMethods = [
  { id: 'card', name: 'Platobná karta', icon: CreditCard },
  { id: 'bank', name: 'Bankový prevod', icon: CreditCard },
  { id: 'cod', name: 'Dobierka (+€1.50)', icon: Package },
];

export default function CheckoutPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { items, total } = useCart();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', street: '', city: '', zip: '' });
  const [shipping, setShipping] = useState('dpd');
  const [payment, setPayment] = useState('card');

  const cartTotal = total();
  const shippingPrice = shippingMethods.find(s => s.id === shipping)?.price || 0;
  const codFee = payment === 'cod' ? 1.50 : 0;
  const finalTotal = cartTotal + shippingPrice + codFee;

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <Link href={`/store/${slug}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" /> Späť do obchodu
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i + 1 <= step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`ml-2 text-sm ${i + 1 <= step ? 'text-blue-500 font-medium' : 'text-gray-400'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-12 h-0.5 mx-4 ${i + 1 < step ? 'bg-blue-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Kontaktné údaje</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Meno" value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} className="px-4 py-3 border rounded-lg" />
                  <input type="text" placeholder="Priezvisko" value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} className="px-4 py-3 border rounded-lg" />
                </div>
                <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
                <input type="tel" placeholder="Telefón" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
                <input type="text" placeholder="Ulica a číslo" value={form.street} onChange={(e) => setForm({...form, street: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Mesto" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="px-4 py-3 border rounded-lg" />
                  <input type="text" placeholder="PSČ" value={form.zip} onChange={(e) => setForm({...form, zip: e.target.value})} className="px-4 py-3 border rounded-lg" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Spôsob dopravy</h2>
                {shippingMethods.map(method => (
                  <label key={method.id} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${shipping === method.id ? 'border-blue-500 bg-blue-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" checked={shipping === method.id} onChange={() => setShipping(method.id)} className="w-4 h-4" />
                      <Truck className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-gray-400">{method.time}</p>
                      </div>
                    </div>
                    <span className="font-bold">{method.price === 0 ? 'Zadarmo' : `€${method.price.toFixed(2)}`}</span>
                  </label>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Spôsob platby</h2>
                {paymentMethods.map(method => (
                  <label key={method.id} className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${payment === method.id ? 'border-blue-500 bg-blue-50' : ''}`}>
                    <input type="radio" name="payment" checked={payment === method.id} onChange={() => setPayment(method.id)} className="w-4 h-4" />
                    <method.icon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{method.name}</span>
                  </label>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Súhrn objednávky</h2>
                <div className="space-y-2 text-sm">
                  <p><strong>Meno:</strong> {form.firstName} {form.lastName}</p>
                  <p><strong>Email:</strong> {form.email}</p>
                  <p><strong>Adresa:</strong> {form.street}, {form.zip} {form.city}</p>
                  <p><strong>Doprava:</strong> {shippingMethods.find(s => s.id === shipping)?.name}</p>
                  <p><strong>Platba:</strong> {paymentMethods.find(p => p.id === payment)?.name}</p>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 && <button onClick={prevStep} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Späť</button>}
              {step < 4 ? (
                <button onClick={nextStep} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ml-auto">Pokračovať</button>
              ) : (
                <Link href={`/store/${slug}/order/success`} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 ml-auto">Dokončiť objednávku</Link>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
            <h3 className="font-bold mb-4">Váš košík</h3>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm"><span>Medzisúčet</span><span>€{cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span>Doprava</span><span>€{shippingPrice.toFixed(2)}</span></div>
              {codFee > 0 && <div className="flex justify-between text-sm"><span>Dobierka</span><span>€{codFee.toFixed(2)}</span></div>}
              <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Celkom</span><span>€{finalTotal.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
