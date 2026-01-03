import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

// Shop store
interface Shop {
  id: string
  name: string
  slug: string
  currency: string
}

interface ShopState {
  currentShop: Shop | null
  shops: Shop[]
  setCurrentShop: (shop: Shop | null) => void
  setShops: (shops: Shop[]) => void
}

export const useShopStore = create<ShopState>()((set) => ({
  currentShop: null,
  shops: [],
  setCurrentShop: (shop) => set({ currentShop: shop }),
  setShops: (shops) => set({ shops }),
}))
