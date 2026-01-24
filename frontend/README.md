# EshopBuilder Pro v3.0

Profesionálna e-commerce platforma ako Shoptet/Shopify.

## Funkcie

### Pre zákazníkov (Merchants)
- 🏪 Vytvorenie vlastného e-shopu
- 📦 Správa produktov a kategórií
- 🛒 Spracovanie objednávok
- 👥 Správa zákazníkov
- 📊 Analytika a štatistiky
- 🎨 Profesionálne šablóny
- 💳 Integrácia platieb
- 🚚 Nastavenie dopravy

### Pre admina (Platform owner)
- 👤 Správa používateľov
- 🏪 Prehľad všetkých obchodov
- 📈 Platform analytika
- ⚙️ Feed import systém
- 💰 Správa predplatných

## Štruktúra

```
frontend/
├── src/app/
│   ├── page.tsx              # Landing page
│   ├── login/                # Login pre merchants
│   ├── register/             # Registrácia
│   ├── dashboard/            # Merchant dashboard
│   │   ├── products/
│   │   ├── orders/
│   │   ├── customers/
│   │   ├── analytics/
│   │   ├── templates/
│   │   └── settings/
│   └── admin/                # Platform admin
│       ├── users/
│       ├── feeds/
│       ├── analytics/
│       └── settings/
```

## Inštalácia

```bash
cd frontend
npm install
npm run dev
```

## Environment premenné

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Deployment

### Docker

```bash
docker build -t eshopbuilder-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://api:8080 eshopbuilder-frontend
```

## Prihlasovacie údaje

Admin:
- Email: admin@example.com
- Heslo: admin123

## Technológie

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons
- React Hot Toast
- Zustand (state management)
