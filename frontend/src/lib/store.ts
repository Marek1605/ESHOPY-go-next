'use client';
import { create } from 'zustand';

// ============ CART STORE ============
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  total: () => number;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (item) => set((state) => {
    const existing = state.items.find(i => i.id === item.id);
    if (existing) {
      return { items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: quantity > 0
      ? state.items.map(i => i.id === id ? { ...i, quantity } : i)
      : state.items.filter(i => i.id !== id)
  })),
  clearCart: () => set({ items: [] }),
  setCartOpen: (open) => set({ isOpen: open }),
  total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));

// ============ SETTINGS STORE ============
interface SettingsState {
  payments: {
    comgate: { enabled: boolean; testMode: boolean; merchantId: string; secret: string };
    gopay: { enabled: boolean; testMode: boolean; goId: string; clientId: string; clientSecret: string };
    bankTransfer: { enabled: boolean; iban: string; swift: string; bankName: string };
    cod: { enabled: boolean; fee: number };
  };
  shipping: {
    dpd: { enabled: boolean; apiKey: string; price: number; freeFrom: number; showWidget: boolean };
    zasielkovna: { enabled: boolean; apiKey: string; price: number; freeFrom: number; showWidget: boolean };
    posta: { enabled: boolean; price: number; freeFrom: number };
    gls: { enabled: boolean; apiKey: string; price: number; freeFrom: number };
    personalPickup: { enabled: boolean; address: string; openingHours: string };
  };
  general: { shopName: string; email: string; phone: string; currency: string; language: string; timezone: string };
  updatePayments: (key: string, value: any) => void;
  updateShipping: (key: string, value: any) => void;
  updateGeneral: (value: any) => void;
}

export const useSettings = create<SettingsState>((set) => ({
  payments: {
    comgate: { enabled: false, testMode: true, merchantId: '', secret: '' },
    gopay: { enabled: false, testMode: true, goId: '', clientId: '', clientSecret: '' },
    bankTransfer: { enabled: true, iban: '', swift: '', bankName: '' },
    cod: { enabled: true, fee: 1.50 },
  },
  shipping: {
    dpd: { enabled: true, apiKey: '', price: 4.90, freeFrom: 50, showWidget: true },
    zasielkovna: { enabled: true, apiKey: '', price: 2.90, freeFrom: 50, showWidget: true },
    posta: { enabled: true, price: 3.50, freeFrom: 50 },
    gls: { enabled: false, apiKey: '', price: 4.50, freeFrom: 50 },
    personalPickup: { enabled: true, address: '', openingHours: 'Po-Pi: 9:00-17:00' },
  },
  general: { shopName: 'Môj Obchod', email: 'info@mojobchod.sk', phone: '+421 900 123 456', currency: 'EUR', language: 'sk', timezone: 'Europe/Bratislava' },
  updatePayments: (key, value) => set((state) => ({
    payments: { ...state.payments, [key]: { ...(state.payments as any)[key], ...value } }
  })),
  updateShipping: (key, value) => set((state) => ({
    shipping: { ...state.shipping, [key]: { ...(state.shipping as any)[key], ...value } }
  })),
  updateGeneral: (value) => set((state) => ({ general: { ...state.general, ...value } })),
}));

// ============ CHECKOUT STORE ============
export interface CheckoutAddress {
  firstName: string; lastName: string; email: string; phone: string;
  street: string; city: string; zip: string; country: string;
}

const emptyAddress: CheckoutAddress = { firstName: '', lastName: '', email: '', phone: '', street: '', city: '', zip: '', country: 'SK' };

interface CheckoutState {
  step: number;
  address: CheckoutAddress;
  shippingMethod: string | null;
  paymentMethod: string | null;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setAddress: (address: Partial<CheckoutAddress>) => void;
  setShippingMethod: (method: string) => void;
  setPaymentMethod: (method: string) => void;
  reset: () => void;
}

export const useCheckout = create<CheckoutState>((set) => ({
  step: 1, address: emptyAddress, shippingMethod: null, paymentMethod: null,
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 4) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  setAddress: (address) => set((state) => ({ address: { ...state.address, ...address } })),
  setShippingMethod: (method) => set({ shippingMethod: method }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  reset: () => set({ step: 1, address: emptyAddress, shippingMethod: null, paymentMethod: null }),
}));
