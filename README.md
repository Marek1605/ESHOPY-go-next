# 🚀 EshopBuilder - Platforma na tvorbu e-shopov

Profesionálna SaaS platforma pre slovenský a český trh.

## 📁 Štruktúra projektu

```
ESHOPY-go-next/
├── api/          # Go backend (Fiber v2)
└── frontend/     # Next.js frontend
```

## 🔧 Technológie

### Backend (Go)
- **Framework:** Fiber v2
- **Databáza:** PostgreSQL
- **Auth:** JWT
- **Platby:** GoPay, Stripe, ComGate

### Frontend (Next.js)
- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **UI:** Radix UI, Lucide icons
- **State:** Zustand
- **AI:** Anthropic Claude / OpenAI

## 🚀 Deployment

### 1. Go API
```bash
cd api
docker build -t eshop-api .
docker run -p 8080:8080 eshop-api
```

### 2. Next.js Frontend
```bash
cd frontend
npm install
npm run build
npm start
```

## 📊 Funkcie

- ✅ Multi-tenant e-shop platforma
- ✅ AI generovanie popisov produktov
- ✅ Platobné brány (GoPay, Stripe, ComGate)
- ✅ Správa produktov, objednávok, zákazníkov
- ✅ Analytika a štatistiky
- ✅ Responzívny dark theme dizajn

## 🔗 Live URLs

- **API:** http://q0wwgg4ogo0kc4wk8sogw40k.46.224.7.54.sslip.io
- **Frontend:** (po deployi)

## 📝 Licencia

MIT

---

Made with ❤️ in Slovakia 🇸🇰
