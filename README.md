# EshopBuilder v3

Modern e-commerce platform with feed import system. Built with Go backend and Next.js frontend.

## Features

- 🚀 **Skip Template** - Go directly to admin dashboard
- 🎨 **Aurora Template** - Modern dark theme with gradient effects
- 📦 **Feed Import System** - Support for Heureka XML, CSV, JSON
- 🔄 **Auto Field Mapping** - Automatically detect and map feed fields
- 📊 **Real-time Progress** - Live import progress tracking
- 🛠️ **Admin Dashboard** - Full product and category management
- 🔐 **JWT Authentication** - Secure admin access

## Quick Start

### Using Docker Compose

```bash
# Clone and navigate
cd eshopbuilder-v3

# Copy environment
cp .env.example .env

# Start all services
docker-compose up -d

# Access
# Frontend: http://localhost:3000
# API: http://localhost:8080
```

### Default Login

- **Email:** admin@example.com
- **Password:** admin123

## Architecture

```
eshopbuilder-v3/
├── backend/                 # Go API
│   ├── cmd/                 # Entry point
│   ├── internal/
│   │   ├── config/          # Configuration
│   │   ├── database/        # PostgreSQL connection
│   │   ├── handlers/        # HTTP handlers
│   │   ├── importer/        # Feed import engine
│   │   │   ├── parser.go    # XML/CSV/JSON parsers
│   │   │   └── engine.go    # Import orchestration
│   │   ├── middleware/      # Auth middleware
│   │   └── models/          # Data structures
│   └── migrations/          # Database schema
│
├── frontend/                # Next.js 14
│   └── src/
│       ├── app/
│       │   ├── admin/       # Admin pages
│       │   │   ├── feeds/   # Feed management
│       │   │   ├── products/# Product management
│       │   │   └── ...
│       │   └── page.tsx     # Redirect to admin
│       ├── components/      # UI components
│       ├── lib/             # API client
│       └── styles/          # Global CSS
│
└── docker-compose.yml       # Container orchestration
```

## Feed Import Flow

1. **Create Feed** - Enter URL and select type (XML/CSV/JSON)
2. **Preview** - System fetches and parses feed sample
3. **Auto-Mapping** - Fields are automatically mapped to product attributes
4. **Configure** - Adjust mappings, set transforms, defaults
5. **Import** - Run import with real-time progress tracking

### Supported Formats

#### Heureka XML
```xml
<SHOP>
  <SHOPITEM>
    <PRODUCTNAME>Product Name</PRODUCTNAME>
    <DESCRIPTION>Description</DESCRIPTION>
    <PRICE_VAT>19.99</PRICE_VAT>
    <IMGURL>https://...</IMGURL>
    <CATEGORYTEXT>Category | Subcategory</CATEGORYTEXT>
  </SHOPITEM>
</SHOP>
```

#### CSV
```csv
name;price;description;image_url;category
Product 1;19.99;Description;https://...;Electronics
```

#### JSON
```json
{
  "products": [
    {
      "name": "Product Name",
      "price": 19.99,
      "description": "Description",
      "image": "https://...",
      "category": "Electronics"
    }
  ]
}
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register

### Products
- `GET /api/v1/products` - List products (public)
- `GET /api/v1/products/:slug` - Get product (public)
- `GET /api/v1/admin/products` - Admin list
- `POST /api/v1/admin/products` - Create product
- `PUT /api/v1/admin/products/:id` - Update product
- `DELETE /api/v1/admin/products/:id` - Delete product

### Feeds
- `GET /api/v1/admin/feeds` - List feeds
- `POST /api/v1/admin/feeds` - Create feed
- `GET /api/v1/admin/feeds/:id` - Get feed
- `PUT /api/v1/admin/feeds/:id` - Update feed
- `DELETE /api/v1/admin/feeds/:id` - Delete feed
- `POST /api/v1/admin/feeds/preview` - Preview feed
- `POST /api/v1/admin/feeds/auto-mapping` - Auto-map fields
- `POST /api/v1/admin/feeds/:id/import` - Start import
- `POST /api/v1/admin/feeds/:id/stop` - Stop import
- `GET /api/v1/admin/feeds/:id/progress` - Get progress
- `GET /api/v1/admin/feeds/:id/history` - Import history

## Development

### Backend
```bash
cd backend
go mod download
go run cmd/main.go
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment on Coolify

1. Create new service from Docker Compose
2. Point to your git repository
3. Set environment variables:
   - `JWT_SECRET` - Secure random string
   - `NEXT_PUBLIC_API_URL` - Your API URL
4. Deploy

## License

MIT
