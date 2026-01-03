const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  token?: string
}

export async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || 'API request failed')
  }

  return response.json()
}

// Auth
export const auth = {
  register: (data: { email: string; password: string; name: string }) =>
    api<{ token: string; user: any }>('/auth/register', { method: 'POST', body: data }),
  
  login: (data: { email: string; password: string }) =>
    api<{ token: string; user: any }>('/auth/login', { method: 'POST', body: data }),
  
  me: (token: string) =>
    api<any>('/me', { token }),
}

// Shops
export const shops = {
  list: (token: string) =>
    api<{ shops: any[] }>('/shops', { token }),
  
  get: (token: string, id: string) =>
    api<any>(`/shops/${id}`, { token }),
  
  create: (token: string, data: { name: string; currency?: string }) =>
    api<any>('/shops', { method: 'POST', body: data, token }),
  
  update: (token: string, id: string, data: any) =>
    api<any>(`/shops/${id}`, { method: 'PUT', body: data, token }),
  
  delete: (token: string, id: string) =>
    api<void>(`/shops/${id}`, { method: 'DELETE', token }),
  
  stats: (token: string, id: string) =>
    api<any>(`/shops/${id}/stats`, { token }),
}

// Products
export const products = {
  list: (token: string, shopId: string, params?: { page?: number; limit?: number }) =>
    api<{ data: any[]; pagination: any }>(`/shops/${shopId}/products?page=${params?.page || 1}&limit=${params?.limit || 20}`, { token }),
  
  get: (token: string, shopId: string, id: string) =>
    api<any>(`/shops/${shopId}/products/${id}`, { token }),
  
  create: (token: string, shopId: string, data: any) =>
    api<any>(`/shops/${shopId}/products`, { method: 'POST', body: data, token }),
  
  update: (token: string, shopId: string, id: string, data: any) =>
    api<any>(`/shops/${shopId}/products/${id}`, { method: 'PUT', body: data, token }),
  
  delete: (token: string, shopId: string, id: string) =>
    api<void>(`/shops/${shopId}/products/${id}`, { method: 'DELETE', token }),
}

// Orders
export const orders = {
  list: (token: string, shopId: string) =>
    api<{ orders: any[] }>(`/shops/${shopId}/orders`, { token }),
  
  get: (token: string, shopId: string, id: string) =>
    api<any>(`/shops/${shopId}/orders/${id}`, { token }),
  
  updateStatus: (token: string, shopId: string, id: string, status: string) =>
    api<any>(`/shops/${shopId}/orders/${id}`, { method: 'PUT', body: { status }, token }),
}

// Customers
export const customers = {
  list: (token: string, shopId: string) =>
    api<{ customers: any[] }>(`/shops/${shopId}/customers`, { token }),
}

// Analytics
export const analytics = {
  get: (token: string, shopId: string) =>
    api<any>(`/shops/${shopId}/analytics`, { token }),
}
