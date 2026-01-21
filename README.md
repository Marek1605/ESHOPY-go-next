# EshopBuilder v2.0

Kompletná platforma na tvorbu e-shopov s AI asistentom.

## 🚀 Funkcie

### Pre zákazníkov (majiteľov e-shopov)
- **AI Shop Builder** - vytvorte e-shop s pomocou AI
- **Šablóny** - predpripravené dizajnové šablóny
- **Správa produktov** - CRUD operácie, varianty, obrázky
- **Objednávky** - sledovanie, stavy, faktúry
- **Zákazníci** - databáza zákazníkov
- **Platobné brány** - GoPay, Stripe, ComGate, dobierka
- **Doručenie** - konfigurácia dopravných metód
- **Analytics** - štatistiky, grafy
- **Vlastná doména** - DNS verifikácia, SSL

### Pre admina (teba)
- **Super Admin Panel** - /admin
- **Prehľad všetkých shopov** - zoznam, štatistiky
- **Správa používateľov** - edit, reset hesla, deaktivácia
- **Správa šablón** - pridávanie/úprava šablón

## 📁 Štruktúra

```
eshopbuilder-complete/
├── api/                    # Go backend
│   ├── cmd/server/        # Main entry point
│   ├── internal/
│   │   ├── database/      # Database connection & migrations
│   │   ├── handlers/      # HTTP handlers
│   │   ├── middleware/    # JWT auth middleware
│   │   └── models/        # Data models
│   ├── Dockerfile
│   └── go.mod
├── frontend/              # Next.js frontend
│   ├── src/app/
│   │   ├── admin/        # Super admin panel
│   │   ├── dashboard/    # User dashboard
│   │   │   └── shop-builder/  # AI shop builder wizard
│   │   ├── login/
│   │   └── register/
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## 🛠️ Inštalácia

### S Docker

```bash
# Nastaviť environment
cp api/.env.example api/.env
# Upraviť .env (JWT_SECRET, ANTHROPIC_API_KEY)

# Spustiť
docker-compose up -d
```

### Manuálne

#### API (Go)
```bash
cd api
cp .env.example .env
# Upraviť .env

go mod download
go run cmd/server/main.go
```

#### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Default admin login

Po prvom spustení sa vytvorí admin účet:
- Email: `admin@eshopbuilder.sk`  
- Heslo: `admin123` (zmeňte po prvom prihlásení!)

## 📡 API Endpoints

### Auth
- `POST /api/v1/auth/register` - registrácia
- `POST /api/v1/auth/login` - prihlásenie
- `POST /api/v1/auth/refresh` - refresh token

### Shops
- `GET /api/v1/shops` - zoznam shopov používateľa
- `POST /api/v1/shops` - vytvorenie shopu
- `GET /api/v1/shops/:id` - detail shopu
- `PUT /api/v1/shops/:id` - update shopu
- `DELETE /api/v1/shops/:id` - zmazanie shopu

### Products
- `GET /api/v1/shops/:shopId/products` - zoznam produktov
- `POST /api/v1/shops/:shopId/products` - nový produkt
- `PUT /api/v1/shops/:shopId/products/:id` - update
- `DELETE /api/v1/shops/:shopId/products/:id` - zmazanie

### Admin (Super Admin only)
- `GET /api/v1/admin/stats` - platformové štatistiky
- `GET /api/v1/admin/users` - všetci používatelia
- `GET /api/v1/admin/shops` - všetky shopy
- `POST /api/v1/admin/users/reset-password` - reset hesla

### AI
- `POST /api/v1/ai/generate` - všeobecná AI generácia
- `POST /api/v1/ai/product-description` - popis produktu
- `POST /api/v1/ai/seo` - SEO texty
- `POST /api/v1/ai/shop-builder` - návrh dizajnu

## 🎨 Šablóny

Predvolené šablóny v databáze:
- Modern Minimal
- Fashion Boutique
- Tech Store
- Food & Grocery
- Luxury Premium (premium)
- Kids & Toys

## 🔒 Bezpečnosť

- JWT autentifikácia (15min access, 7d refresh)
- Bcrypt hashing hesiel
- Role-based access control (user, admin, super_admin)
- SSL/TLS pre custom domény

## 📊 Database

PostgreSQL s týmito tabuľkami:
- users
- shops
- shop_templates
- products
- product_images
- product_variants
- categories
- orders
- order_items
- customers
- shipping_methods
- payment_methods
- coupons
- shop_settings
- invoices
- ai_generations
- daily_stats
- domain_verifications

---

Made with ❤️ for Slovak e-commerce
