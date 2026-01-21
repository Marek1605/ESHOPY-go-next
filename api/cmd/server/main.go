package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"eshop-builder/internal/database"
	"eshop-builder/internal/handlers"
	"eshop-builder/internal/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env
	godotenv.Load()

	// Connect to database
	if err := database.Connect(); err != nil {
		log.Fatal("Database connection failed:", err)
	}
	defer database.Close()

	// Run migrations
	if err := database.Migrate(); err != nil {
		log.Fatal("Migration failed:", err)
	}

	// Create Fiber app with optimized config
	app := fiber.New(fiber.Config{
		Prefork:        false,
		ServerHeader:   "EshopBuilder",
		StrictRouting:  true,
		CaseSensitive:  true,
		BodyLimit:      50 * 1024 * 1024, // 50MB
		ReadBufferSize: 8192,
		Concurrency:    256 * 1024,
	})

	// Global middleware
	app.Use(recover.New())
	app.Use(logger.New(logger.Config{
		Format: "${time} | ${status} | ${latency} | ${method} ${path}\n",
	}))
	app.Use(compress.New(compress.Config{
		Level: compress.LevelBestSpeed,
	}))
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
		AllowHeaders: "Origin,Content-Type,Accept,Authorization",
	}))

	// Rate limiter
	app.Use(limiter.New(limiter.Config{
		Max:        100,
		Expiration: 60,
	}))

	// Static files
	app.Static("/static", "./static")
	app.Static("/templates", "./templates")

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok", "version": "2.0.0"})
	})

	// API routes
	api := app.Group("/api/v1")

	// ========================================
	// PUBLIC ROUTES
	// ========================================

	// Auth
	api.Post("/auth/register", handlers.Register)
	api.Post("/auth/login", handlers.Login)
	api.Post("/auth/refresh", handlers.RefreshToken)

	// Templates (public)
	api.Get("/templates", handlers.GetTemplates)

	// Public shop routes (for storefront)
	api.Get("/shop/:slug", handlers.GetPublicShop)
	api.Get("/shop/:slug/products", handlers.GetPublicProducts)
	api.Get("/shop/:slug/product/:productSlug", handlers.GetPublicProduct)
	api.Get("/shop/:slug/categories", handlers.GetPublicCategories)
	api.Post("/shop/:slug/orders", handlers.CreatePublicOrder)
	api.Get("/shop/:slug/shipping-methods", handlers.GetPublicShippingMethods)
	api.Get("/shop/:slug/payment-methods", handlers.GetPublicPaymentMethods)

	// Payment webhooks (no auth)
	webhooks := api.Group("/webhooks")
	webhooks.Post("/gopay", handlers.GoPayWebhook)
	webhooks.Post("/stripe", handlers.StripeWebhook)
	webhooks.Post("/comgate", handlers.ComGateWebhook)

	// ========================================
	// PROTECTED ROUTES (USER)
	// ========================================

	protected := api.Group("/", middleware.JWTAuth())

	// User profile
	protected.Get("/me", handlers.GetCurrentUser)
	protected.Put("/me", handlers.UpdateCurrentUser)

	// Shops management
	protected.Get("/shops", handlers.GetShops)
	protected.Post("/shops", handlers.CreateShop)
	protected.Get("/shops/:id", handlers.GetShop)
	protected.Put("/shops/:id", handlers.UpdateShop)
	protected.Delete("/shops/:id", handlers.DeleteShop)
	protected.Get("/shops/:id/stats", handlers.GetShopStats)

	// Domain verification
	protected.Post("/shops/:shopId/domain/verify", handlers.InitiateDomainVerification)
	protected.Get("/shops/:shopId/domain/check", handlers.CheckDomainVerification)

	// Products
	protected.Get("/shops/:shopId/products", handlers.GetProducts)
	protected.Post("/shops/:shopId/products", handlers.CreateProduct)
	protected.Get("/shops/:shopId/products/:id", handlers.GetProduct)
	protected.Put("/shops/:shopId/products/:id", handlers.UpdateProduct)
	protected.Delete("/shops/:shopId/products/:id", handlers.DeleteProduct)
	protected.Post("/shops/:shopId/products/import", handlers.ImportProducts)
	protected.Get("/shops/:shopId/products/export", handlers.ExportProducts)

	// Categories
	protected.Get("/shops/:shopId/categories", handlers.GetCategories)
	protected.Post("/shops/:shopId/categories", handlers.CreateCategory)
	protected.Put("/shops/:shopId/categories/:id", handlers.UpdateCategory)
	protected.Delete("/shops/:shopId/categories/:id", handlers.DeleteCategory)

	// Orders
	protected.Get("/shops/:shopId/orders", handlers.GetOrders)
	protected.Get("/shops/:shopId/orders/:id", handlers.GetOrder)
	protected.Put("/shops/:shopId/orders/:id", handlers.UpdateOrder)
	protected.Delete("/shops/:shopId/orders/:id", handlers.CancelOrder)
	protected.Post("/shops/:shopId/orders/:id/invoice", handlers.GenerateInvoice)

	// Customers
	protected.Get("/shops/:shopId/customers", handlers.GetCustomers)
	protected.Get("/shops/:shopId/customers/:id", handlers.GetCustomer)
	protected.Put("/shops/:shopId/customers/:id", handlers.UpdateCustomer)

	// Shipping methods
	protected.Get("/shops/:shopId/shipping-methods", handlers.GetShippingMethods)
	protected.Post("/shops/:shopId/shipping-methods", handlers.CreateShippingMethod)
	protected.Put("/shops/:shopId/shipping-methods/:id", handlers.UpdateShippingMethod)
	protected.Delete("/shops/:shopId/shipping-methods/:id", handlers.DeleteShippingMethod)

	// Payment methods
	protected.Get("/shops/:shopId/payment-methods", handlers.GetPaymentMethods)
	protected.Post("/shops/:shopId/payment-methods", handlers.CreatePaymentMethod)
	protected.Put("/shops/:shopId/payment-methods/:id", handlers.UpdatePaymentMethod)
	protected.Delete("/shops/:shopId/payment-methods/:id", handlers.DeletePaymentMethod)

	// Coupons
	protected.Get("/shops/:shopId/coupons", handlers.GetCoupons)
	protected.Post("/shops/:shopId/coupons", handlers.CreateCoupon)
	protected.Put("/shops/:shopId/coupons/:id", handlers.UpdateCoupon)
	protected.Delete("/shops/:shopId/coupons/:id", handlers.DeleteCoupon)

	// Analytics
	protected.Get("/shops/:shopId/analytics", handlers.GetAnalytics)
	protected.Get("/shops/:shopId/analytics/revenue", handlers.GetRevenueAnalytics)
	protected.Get("/shops/:shopId/analytics/products", handlers.GetProductAnalytics)

	// Settings
	protected.Get("/shops/:shopId/settings", handlers.GetSettings)
	protected.Put("/shops/:shopId/settings", handlers.UpdateSettings)

	// Invoices
	protected.Get("/shops/:shopId/invoices", handlers.GetInvoices)
	protected.Get("/shops/:shopId/invoices/:id", handlers.GetInvoice)
	protected.Get("/shops/:shopId/invoices/:id/pdf", handlers.GetInvoicePDF)

	// Payments
	protected.Post("/payments/gopay", handlers.CreateGoPayPayment)
	protected.Post("/payments/stripe", handlers.CreateStripePayment)
	protected.Post("/payments/comgate", handlers.CreateComGatePayment)
	protected.Get("/payments/:id/status", handlers.GetPaymentStatus)

	// AI endpoints
	protected.Post("/ai/generate", handlers.AIGenerate)
	protected.Post("/ai/product-description", handlers.AIProductDescription)
	protected.Post("/ai/seo", handlers.AISEOGenerate)
	protected.Post("/ai/shop-builder", handlers.AIShopBuilder)

	// ========================================
	// SUPER ADMIN ROUTES
	// ========================================

	admin := api.Group("/admin", middleware.JWTAuth(), handlers.RequireSuperAdmin())

	// Platform stats
	admin.Get("/stats", handlers.GetPlatformStats)

	// User management
	admin.Get("/users", handlers.GetAllUsers)
	admin.Get("/users/:id", handlers.GetUserDetail)
	admin.Put("/users/:id", handlers.UpdateUser)
	admin.Delete("/users/:id", handlers.DeleteUser)
	admin.Post("/users/reset-password", handlers.ResetUserPassword)

	// Shop management (admin view of all shops)
	admin.Get("/shops", handlers.GetAllShops)
	admin.Put("/shops/:id", handlers.AdminUpdateShop)
	admin.Delete("/shops/:id", handlers.AdminDeleteShop)

	// Template management
	admin.Post("/templates", handlers.CreateTemplate)
	admin.Put("/templates/:id", handlers.UpdateTemplate)
	admin.Delete("/templates/:id", handlers.DeleteTemplate)

	// ========================================
	// STOREFRONT (for actual shops)
	// ========================================

	// These routes serve the actual customer-facing e-shop
	// Domain routing handled by middleware
	storefront := app.Group("/s/:shopSlug")
	storefront.Get("/", handlers.StorefrontHome)
	storefront.Get("/products", handlers.StorefrontProducts)
	storefront.Get("/product/:slug", handlers.StorefrontProduct)
	storefront.Get("/category/:slug", handlers.StorefrontCategory)
	storefront.Get("/cart", handlers.StorefrontCart)
	storefront.Post("/cart/add", handlers.StorefrontAddToCart)
	storefront.Post("/checkout", handlers.StorefrontCheckout)

	// Graceful shutdown
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start server in goroutine
	go func() {
		if err := app.Listen(":" + port); err != nil {
			log.Panic(err)
		}
	}()

	log.Printf("🚀 EshopBuilder API v2.0 running on port %s", port)
	log.Println("📊 Super Admin panel: /api/v1/admin")
	log.Println("🛒 Storefront: /s/{shop-slug}")

	// Wait for interrupt signal
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	<-c

	log.Println("Gracefully shutting down...")
	app.Shutdown()
}
