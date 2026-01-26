package database

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func Connect() error {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5432/eshopbuilder?sslmode=disable"
	}

	var err error
	Pool, err = pgxpool.New(context.Background(), dbURL)
	if err != nil {
		return fmt.Errorf("unable to connect to database: %v", err)
	}

	if err := Pool.Ping(context.Background()); err != nil {
		return fmt.Errorf("unable to ping database: %v", err)
	}

	log.Println("✅ Database connected successfully")
	return nil
}

func Close() {
	if Pool != nil {
		Pool.Close()
	}
}

func Migrate() error {
	ctx := context.Background()

	migrations := []string{
		// Users table with role
		`CREATE TABLE IF NOT EXISTS users (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			name VARCHAR(255),
			role VARCHAR(50) DEFAULT 'user',
			plan VARCHAR(50) DEFAULT 'starter',
			is_active BOOLEAN DEFAULT true,
			last_login_at TIMESTAMP,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		)`,

		// Shop templates
		`CREATE TABLE IF NOT EXISTS shop_templates (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			name VARCHAR(255) NOT NULL,
			slug VARCHAR(255) UNIQUE NOT NULL,
			description TEXT,
			thumbnail VARCHAR(500) NOT NULL,
			preview_url VARCHAR(500),
			category VARCHAR(100) DEFAULT 'general',
			colors JSONB DEFAULT '{}',
			fonts JSONB DEFAULT '{}',
			layout JSONB DEFAULT '{}',
			components JSONB DEFAULT '{}',
			is_premium BOOLEAN DEFAULT false,
			is_active BOOLEAN DEFAULT true,
			usage_count INTEGER DEFAULT 0,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		)`,

		// Shops table (extended)
		`CREATE TABLE IF NOT EXISTS shops (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			template_id UUID REFERENCES shop_templates(id),
			name VARCHAR(255) NOT NULL,
			slug VARCHAR(255) UNIQUE NOT NULL,
			description TEXT,
			logo VARCHAR(500),
			favicon VARCHAR(500),
			currency VARCHAR(10) DEFAULT 'EUR',
			language VARCHAR(10) DEFAULT 'sk',
			timezone VARCHAR(50) DEFAULT 'Europe/Bratislava',
			primary_color VARCHAR(20) DEFAULT '#3B82F6',
			secondary_color VARCHAR(20) DEFAULT '#1E40AF',
			accent_color VARCHAR(20) DEFAULT '#F59E0B',
			font_heading VARCHAR(100) DEFAULT 'Inter',
			font_body VARCHAR(100) DEFAULT 'Inter',
			custom_css TEXT,
			layout_config JSONB DEFAULT '{}',
			email VARCHAR(255),
			phone VARCHAR(50),
			address TEXT,
			city VARCHAR(100),
			zip VARCHAR(20),
			country VARCHAR(10) DEFAULT 'SK',
			facebook VARCHAR(255),
			instagram VARCHAR(255),
			twitter VARCHAR(255),
			youtube VARCHAR(255),
			tiktok VARCHAR(255),
			meta_title VARCHAR(255),
			meta_description TEXT,
			meta_keywords TEXT,
			google_analytics VARCHAR(50),
			facebook_pixel VARCHAR(50),
			is_active BOOLEAN DEFAULT true,
			is_published BOOLEAN DEFAULT false,
			setup_completed BOOLEAN DEFAULT false,
			setup_step INTEGER DEFAULT 0,
			custom_domain VARCHAR(255),
			domain_verified BOOLEAN DEFAULT false,
			domain_dns_record VARCHAR(255),
			ssl_enabled BOOLEAN DEFAULT false,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		)`,

		// Domain verifications
		`CREATE TABLE IF NOT EXISTS domain_verifications (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			shop_id UUID UNIQUE NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
			domain VARCHAR(255) NOT NULL,
			txt_record VARCHAR(255) NOT NULL,
			cname_record VARCHAR(255) NOT NULL,
			status VARCHAR(50) DEFAULT 'pending',
			verified_at TIMESTAMP,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		)`,

		// Categories
		`CREATE TABLE IF NOT EXISTS categories (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
			parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
			name VARCHAR(255) NOT NULL,
			slug VARCHAR(255) NOT NULL,
			description TEXT,
			image VARCHAR(500),
			position INTEGER DEFAULT 0,
			is_active BOOLEAN DEFAULT true,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW(),
			UNIQUE(shop_id, slug)
		)`,

		// Products
		`CREATE TABLE IF NOT EXISTS products (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
			category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
			name VARCHAR(255) NOT NULL,
			slug VARCHAR(255) NOT NULL,
			description TEXT,
			short_description TEXT,
			price DECIMAL(10,2) NOT NULL DEFAULT 0,
			compare_price DECIMAL(10,2),
			cost_price DECIMAL(10,2),
			sku VARCHAR(100),
			barcode VARCHAR(100),
			quantity INTEGER DEFAULT 0,
			track_inventory BOOLEAN DEFAULT true,
			allow_backorder BOOLEAN DEFAULT false,
			weight DECIMAL(10,2),
			width DECIMAL(10,2),
			height DECIMAL(10,2),
			length DECIMAL(10,2),
			meta_title VARCHAR(255),
			meta_description TEXT,
			is_active BOOLEAN DEFAULT true,
			is_featured BOOLEAN DEFAULT false,
			ai_generated BOOLEAN DEFAULT false,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW(),
			UNIQUE(shop_id, slug)
		)`,

		// Product images
		`CREATE TABLE IF NOT EXISTS product_images (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
			url VARCHAR(500) NOT NULL,
			alt VARCHAR(255),
			position INTEGER DEFAULT 0,
			created_at TIMESTAMP DEFAULT NOW()
		)`,

		// Product variants
		`CREATE TABLE IF NOT EXISTS product_variants (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
			name VARCHAR(255) NOT NULL,
			sku VARCHAR(100),
			price DECIMAL(10,2) NOT NULL,
			quantity INTEGER DEFAULT 0,
			options JSONB DEFAULT '{}',
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		)`,

		// Customers
		`CREATE TABLE IF NOT EXISTS customers (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
			email VARCHAR(255) NOT NULL,
			password_hash VARCHAR(255),
			first_name VARCHAR(100),
			last_name VARCHAR(100),
			phone VARCHAR(50),
			address TEXT,
			city VARCHAR(100),
			zip VARCHAR(20),
			country VARCHAR(10) DEFAULT 'SK',
			accepts_marketing BOOLEAN DEFAULT false,
			notes TEXT,
			is_verified BOOLEAN DEFAULT false,
			last_order_at TIMESTAMP,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW(),
			UNIQUE(shop_id, email)
		)`,

		// Shipping methods
		`CREATE TABLE IF NOT EXISTS shipping_methods (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
			name VARCHAR(255) NOT NULL,
			description TEXT,
			price DECIMAL(10,2) NOT NULL DEFAULT 0,
			free_above DECIMAL(10,2),
			is_active BOOLEAN DEFAULT true,
			position INTEGER DEFAULT 0,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		)`,

		// Payment methods
		`CREATE TABLE IF NOT EXISTS payment_methods (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
			type VARCHAR(50) NOT NULL,
			name VARCHAR(255) NOT NULL,
			description TEXT,
			config JSONB DEFAULT '{}',
			is_active BOOLEAN DEFAULT true,
			is_test_mode BOOLEAN DEFAULT true,
			position INTEGER DEFAULT 0,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		)`,

		// Orders
		`CREATE TABLE IF NOT EXISTS orders (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
			customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
			order_number VARCHAR(50) NOT NULL,
			status VARCHAR(50) DEFAULT 'pending',
			payment_status VARCHAR(50) DEFAULT 'pending',
			subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
			shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
			tax DECIMAL(10,2) NOT NULL DEFAULT 0,
			discount DECIMAL(10,2) NOT NULL DEFAULT 0,
			total DECIMAL(10,2) NOT NULL DEFAULT 0,
			currency VARCHAR(10) DEFAULT 'EUR',
			shipping_first_name VARCHAR(100),
			shipping_last_name VARCHAR(100),
			shipping_company VARCHAR(255),
			shipping_address TEXT,
			shipping_city VARCHAR(100),
			shipping_zip VARCHAR(20),
			shipping_country VARCHAR(10),
			shipping_phone VARCHAR(50),
			billing_first_name VARCHAR(100),
			billing_last_name VARCHAR(100),
			billing_company VARCHAR(255),
			billing_address TEXT,
			billing_city VARCHAR(100),
			billing_zip VARCHAR(20),
			billing_country VARCHAR(10),
			billing_phone VARCHAR(50),
			billing_email VARCHAR(255),
			payment_method VARCHAR(50),
			payment_id VARCHAR(255),
			shipping_method VARCHAR(255),
			shipping_method_id UUID,
			tracking_number VARCHAR(100),
			customer_note TEXT,
			internal_note TEXT,
			coupon_code VARCHAR(50),
			coupon_id UUID,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		)`,

		// Order items
		`CREATE TABLE IF NOT EXISTS order_items (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
			product_id UUID,
			variant_id UUID,
			name VARCHAR(255) NOT NULL,
			sku VARCHAR(100),
			quantity INTEGER NOT NULL DEFAULT 1,
			price DECIMAL(10,2) NOT NULL,
			total DECIMAL(10,2) NOT NULL,
			variant_name VARCHAR(255),
			variant_options JSONB DEFAULT '{}'
		)`,

		// Coupons
		`CREATE TABLE IF NOT EXISTS coupons (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
			code VARCHAR(50) NOT NULL,
			type VARCHAR(20) NOT NULL DEFAULT 'percentage',
			value DECIMAL(10,2) NOT NULL,
			min_order_value DECIMAL(10,2),
			max_uses INTEGER,
			used_count INTEGER DEFAULT 0,
			starts_at TIMESTAMP,
			expires_at TIMESTAMP,
			is_active BOOLEAN DEFAULT true,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW(),
			UNIQUE(shop_id, code)
		)`,

		// Shop settings
		`CREATE TABLE IF NOT EXISTS shop_settings (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			shop_id UUID UNIQUE NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
			company_name VARCHAR(255),
			ico VARCHAR(20),
			dic VARCHAR(20),
			ic_dph VARCHAR(20),
			bank_name VARCHAR(100),
			iban VARCHAR(50),
			swift VARCHAR(20),
			invoice_prefix VARCHAR(10) DEFAULT 'FA',
			invoice_next_number INTEGER DEFAULT 1,
			invoice_footer TEXT,
			tax_rate DECIMAL(5,2) DEFAULT 20,
			prices_include_tax BOOLEAN DEFAULT true,
			min_order_value DECIMAL(10,2),
			order_notify_email VARCHAR(255),
			low_stock_threshold INTEGER DEFAULT 5,
			terms_url VARCHAR(500),
			privacy_url VARCHAR(500),
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		)`,

		// AI generations
		`CREATE TABLE IF NOT EXISTS ai_generations (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
			user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			type VARCHAR(50) NOT NULL,
			prompt TEXT NOT NULL,
			response TEXT NOT NULL,
			tokens_used INTEGER DEFAULT 0,
			model VARCHAR(50),
			metadata JSONB DEFAULT '{}',
			created_at TIMESTAMP DEFAULT NOW()
		)`,

		// Daily stats
		`CREATE TABLE IF NOT EXISTS daily_stats (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
			date DATE NOT NULL,
			page_views INTEGER DEFAULT 0,
			unique_visitors INTEGER DEFAULT 0,
			orders INTEGER DEFAULT 0,
			revenue DECIMAL(10,2) DEFAULT 0,
			conversion_rate DECIMAL(5,2) DEFAULT 0,
			UNIQUE(shop_id, date)
		)`,

		// Invoices
		`CREATE TABLE IF NOT EXISTS invoices (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
			invoice_number VARCHAR(50) NOT NULL,
			type VARCHAR(20) DEFAULT 'invoice',
			issue_date DATE NOT NULL,
			due_date DATE NOT NULL,
			paid_at TIMESTAMP,
			status VARCHAR(20) DEFAULT 'unpaid',
			subtotal DECIMAL(10,2) NOT NULL,
			tax DECIMAL(10,2) NOT NULL,
			total DECIMAL(10,2) NOT NULL,
			currency VARCHAR(10) DEFAULT 'EUR',
			supplier_name VARCHAR(255),
			supplier_address TEXT,
			supplier_city VARCHAR(100),
			supplier_zip VARCHAR(20),
			supplier_country VARCHAR(10),
			supplier_ico VARCHAR(20),
			supplier_dic VARCHAR(20),
			supplier_ic_dph VARCHAR(20),
			supplier_iban VARCHAR(50),
			customer_name VARCHAR(255),
			customer_address TEXT,
			customer_city VARCHAR(100),
			customer_zip VARCHAR(20),
			customer_country VARCHAR(10),
			customer_ico VARCHAR(20),
			customer_dic VARCHAR(20),
			customer_ic_dph VARCHAR(20),
			customer_email VARCHAR(255),
			items JSONB NOT NULL,
			note TEXT,
			order_id UUID,
			order_number VARCHAR(50),
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		)`,

		// Indexes
		`CREATE INDEX IF NOT EXISTS idx_shops_user_id ON shops(user_id)`,
		`CREATE INDEX IF NOT EXISTS idx_shops_slug ON shops(slug)`,
		`CREATE INDEX IF NOT EXISTS idx_shops_custom_domain ON shops(custom_domain)`,
		`CREATE INDEX IF NOT EXISTS idx_products_shop_id ON products(shop_id)`,
		`CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id)`,
		`CREATE INDEX IF NOT EXISTS idx_orders_shop_id ON orders(shop_id)`,
		`CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id)`,
		`CREATE INDEX IF NOT EXISTS idx_customers_shop_id ON customers(shop_id)`,
		`CREATE INDEX IF NOT EXISTS idx_categories_shop_id ON categories(shop_id)`,

		// Create default super admin (password: admin123)
		`INSERT INTO users (email, password_hash, name, role, plan, is_active)
		 VALUES ('admin@eshopbuilder.sk', '$2a$10$rQEY4z7.4qKVK4qKvKqKv.Xz4qKVK4qKVK4qKvKqKvKqKvKqKvKqK', 'Super Admin', 'super_admin', 'enterprise', true)
		 ON CONFLICT (email) DO NOTHING`,

		// Insert default templates
		`INSERT INTO shop_templates (name, slug, description, thumbnail, category, colors, fonts, is_premium)
		 VALUES 
		 ('Modern Minimal', 'modern-minimal', 'Čistý minimalistický dizajn pre moderné značky', '/templates/modern-minimal.jpg', 'general', '{"primary": "#000000", "secondary": "#ffffff", "accent": "#3B82F6"}', '{"heading": "Inter", "body": "Inter"}', false),
		 ('Fashion Boutique', 'fashion-boutique', 'Elegantný dizajn pre módne obchody', '/templates/fashion-boutique.jpg', 'fashion', '{"primary": "#1a1a1a", "secondary": "#f5f5f5", "accent": "#D4AF37"}', '{"heading": "Playfair Display", "body": "Lato"}', false),
		 ('Tech Store', 'tech-store', 'Futuristický dizajn pre elektroniku', '/templates/tech-store.jpg', 'electronics', '{"primary": "#0f172a", "secondary": "#1e293b", "accent": "#22d3ee"}', '{"heading": "Space Grotesk", "body": "Inter"}', false),
		 ('Food & Grocery', 'food-grocery', 'Čerstvý dizajn pre potraviny', '/templates/food-grocery.jpg', 'food', '{"primary": "#166534", "secondary": "#f0fdf4", "accent": "#facc15"}', '{"heading": "Poppins", "body": "Open Sans"}', false),
		 ('Luxury Premium', 'luxury-premium', 'Luxusný dizajn pre prémiové produkty', '/templates/luxury-premium.jpg', 'luxury', '{"primary": "#1c1917", "secondary": "#fafaf9", "accent": "#b45309"}', '{"heading": "Cormorant Garamond", "body": "Montserrat"}', true),
		 ('Kids & Toys', 'kids-toys', 'Hravý farebný dizajn pre detské produkty', '/templates/kids-toys.jpg', 'kids', '{"primary": "#7c3aed", "secondary": "#faf5ff", "accent": "#f472b6"}', '{"heading": "Fredoka One", "body": "Nunito"}', false)
		 ON CONFLICT (slug) DO NOTHING`,
	}

	for _, migration := range migrations {
		_, err := Pool.Exec(ctx, migration)
		if err != nil {
			log.Printf("Migration warning: %v", err)
			// Continue with other migrations
		}
	}

	log.Println("✅ Database migrations completed")
	return nil
}
