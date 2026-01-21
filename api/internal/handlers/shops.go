package handlers

import (
	"context"
	"regexp"
	"strings"

	"eshop-builder/internal/database"
	"eshop-builder/internal/middleware"
	"eshop-builder/internal/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// verifyShopOwnership checks if current user owns the shop
func verifyShopOwnership(c *fiber.Ctx, shopID uuid.UUID) (*models.Shop, error) {
	userID := middleware.GetUserID(c)

	var shop models.Shop
	err := database.Pool.QueryRow(context.Background(),
		`SELECT id, user_id, name, slug, description, logo, currency, language, 
		        primary_color, email, phone, address, facebook, instagram,
		        meta_title, meta_description, is_active, is_published, custom_domain,
		        domain_verified, created_at, updated_at
		 FROM shops WHERE id = $1 AND user_id = $2`,
		shopID, userID,
	).Scan(&shop.ID, &shop.UserID, &shop.Name, &shop.Slug, &shop.Description, &shop.Logo,
		&shop.Currency, &shop.Language, &shop.PrimaryColor, &shop.Email, &shop.Phone,
		&shop.Address, &shop.Facebook, &shop.Instagram, &shop.MetaTitle, &shop.MetaDescription,
		&shop.IsActive, &shop.IsPublished, &shop.CustomDomain, &shop.DomainVerified,
		&shop.CreatedAt, &shop.UpdatedAt)

	if err != nil {
		return nil, err
	}

	return &shop, nil
}

// GetShops returns all shops for the current user
func GetShops(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	rows, err := database.Pool.Query(context.Background(),
		`SELECT id, user_id, name, slug, description, logo, currency, language, 
		        primary_color, email, phone, address, facebook, instagram,
		        meta_title, meta_description, is_active, is_published, custom_domain,
		        domain_verified, created_at, updated_at
		 FROM shops WHERE user_id = $1 ORDER BY created_at DESC`,
		userID,
	)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}
	defer rows.Close()

	shops := []models.Shop{}
	for rows.Next() {
		var shop models.Shop
		err := rows.Scan(&shop.ID, &shop.UserID, &shop.Name, &shop.Slug, &shop.Description, &shop.Logo,
			&shop.Currency, &shop.Language, &shop.PrimaryColor, &shop.Email, &shop.Phone,
			&shop.Address, &shop.Facebook, &shop.Instagram, &shop.MetaTitle, &shop.MetaDescription,
			&shop.IsActive, &shop.IsPublished, &shop.CustomDomain, &shop.DomainVerified,
			&shop.CreatedAt, &shop.UpdatedAt)
		if err != nil {
			continue
		}
		shops = append(shops, shop)
	}

	return c.JSON(fiber.Map{"shops": shops})
}

// CreateShop creates a new shop
func CreateShop(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var req models.CreateShopRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Name is required"})
	}

	// Generate slug
	slug := req.Slug
	if slug == "" {
		slug = generateSlug(req.Name)
	}

	// Check slug uniqueness
	ctx := context.Background()
	var exists bool
	database.Pool.QueryRow(ctx,
		"SELECT EXISTS(SELECT 1 FROM shops WHERE slug = $1)",
		slug,
	).Scan(&exists)

	if exists {
		slug = slug + "-" + uuid.New().String()[:6]
	}

	currency := req.Currency
	if currency == "" {
		currency = "EUR"
	}

	language := req.Language
	if language == "" {
		language = "sk"
	}

	var shop models.Shop
	err := database.Pool.QueryRow(ctx,
		`INSERT INTO shops (user_id, template_id, name, slug, description, currency, language, 
		                    primary_color, secondary_color, accent_color, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, '#3B82F6', '#1E40AF', '#F59E0B', NOW(), NOW())
		 RETURNING id, user_id, name, slug, description, logo, currency, language, 
		           primary_color, email, phone, address, facebook, instagram,
		           meta_title, meta_description, is_active, is_published, custom_domain,
		           domain_verified, created_at, updated_at`,
		userID, req.TemplateID, req.Name, slug, req.Description, currency, language,
	).Scan(&shop.ID, &shop.UserID, &shop.Name, &shop.Slug, &shop.Description, &shop.Logo,
		&shop.Currency, &shop.Language, &shop.PrimaryColor, &shop.Email, &shop.Phone,
		&shop.Address, &shop.Facebook, &shop.Instagram, &shop.MetaTitle, &shop.MetaDescription,
		&shop.IsActive, &shop.IsPublished, &shop.CustomDomain, &shop.DomainVerified,
		&shop.CreatedAt, &shop.UpdatedAt)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create shop"})
	}

	// Create default settings
	database.Pool.Exec(ctx,
		`INSERT INTO shop_settings (shop_id, invoice_prefix, invoice_next_number, tax_rate, prices_include_tax, low_stock_threshold)
		 VALUES ($1, 'FA', 1, 20, true, 5)`,
		shop.ID,
	)

	// Create default shipping method
	database.Pool.Exec(ctx,
		`INSERT INTO shipping_methods (shop_id, name, description, price, is_active, position)
		 VALUES ($1, 'Doručenie kuriérom', 'Doručenie do 2-3 pracovných dní', 4.99, true, 0)`,
		shop.ID,
	)

	// Create default payment method
	database.Pool.Exec(ctx,
		`INSERT INTO payment_methods (shop_id, type, name, description, is_active, position)
		 VALUES ($1, 'cod', 'Dobierka', 'Platba pri prevzatí', true, 0)`,
		shop.ID,
	)

	// Increment template usage
	if req.TemplateID != nil {
		database.Pool.Exec(ctx,
			"UPDATE shop_templates SET usage_count = usage_count + 1 WHERE id = $1",
			req.TemplateID,
		)
	}

	return c.Status(fiber.StatusCreated).JSON(shop)
}

// GetShop returns a single shop
func GetShop(c *fiber.Ctx) error {
	shopID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid shop ID"})
	}

	shop, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	return c.JSON(shop)
}

// UpdateShop updates a shop
func UpdateShop(c *fiber.Ctx) error {
	shopID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid shop ID"})
	}

	_, err = verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	var updates map[string]interface{}
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	allowedFields := map[string]bool{
		"name": true, "slug": true, "description": true, "logo": true, "favicon": true,
		"currency": true, "language": true, "timezone": true,
		"primary_color": true, "secondary_color": true, "accent_color": true,
		"font_heading": true, "font_body": true, "custom_css": true, "layout_config": true,
		"email": true, "phone": true, "address": true, "city": true, "zip": true, "country": true,
		"facebook": true, "instagram": true, "twitter": true, "youtube": true, "tiktok": true,
		"meta_title": true, "meta_description": true, "meta_keywords": true,
		"google_analytics": true, "facebook_pixel": true,
		"is_active": true, "is_published": true, "setup_completed": true, "setup_step": true,
		"custom_domain": true,
	}

	setClauses := []string{}
	args := []interface{}{}
	argIndex := 1

	for field, value := range updates {
		if allowedFields[field] {
			setClauses = append(setClauses, field+" = $"+string(rune('0'+argIndex)))
			args = append(args, value)
			argIndex++
		}
	}

	if len(setClauses) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "No valid fields to update"})
	}

	setClauses = append(setClauses, "updated_at = NOW()")
	args = append(args, shopID)

	query := "UPDATE shops SET " + strings.Join(setClauses, ", ") + " WHERE id = $" + string(rune('0'+argIndex))

	_, err = database.Pool.Exec(context.Background(), query, args...)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update shop"})
	}

	shop, _ := verifyShopOwnership(c, shopID)
	return c.JSON(shop)
}

// DeleteShop deletes a shop
func DeleteShop(c *fiber.Ctx) error {
	shopID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid shop ID"})
	}

	_, err = verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	_, err = database.Pool.Exec(context.Background(), "DELETE FROM shops WHERE id = $1", shopID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete shop"})
	}

	return c.JSON(fiber.Map{"success": true})
}

// GetShopStats returns shop statistics
func GetShopStats(c *fiber.Ctx) error {
	shopID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid shop ID"})
	}

	_, err = verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	ctx := context.Background()

	var stats struct {
		TotalProducts   int     `json:"total_products"`
		TotalOrders     int     `json:"total_orders"`
		TotalCustomers  int     `json:"total_customers"`
		TotalRevenue    float64 `json:"total_revenue"`
		PendingOrders   int     `json:"pending_orders"`
		MonthlyRevenue  float64 `json:"monthly_revenue"`
		MonthlyOrders   int     `json:"monthly_orders"`
	}

	database.Pool.QueryRow(ctx,
		"SELECT COUNT(*) FROM products WHERE shop_id = $1", shopID,
	).Scan(&stats.TotalProducts)

	database.Pool.QueryRow(ctx,
		"SELECT COUNT(*) FROM orders WHERE shop_id = $1", shopID,
	).Scan(&stats.TotalOrders)

	database.Pool.QueryRow(ctx,
		"SELECT COUNT(*) FROM customers WHERE shop_id = $1", shopID,
	).Scan(&stats.TotalCustomers)

	database.Pool.QueryRow(ctx,
		"SELECT COALESCE(SUM(total), 0) FROM orders WHERE shop_id = $1 AND payment_status IN ('paid', 'completed')", shopID,
	).Scan(&stats.TotalRevenue)

	database.Pool.QueryRow(ctx,
		"SELECT COUNT(*) FROM orders WHERE shop_id = $1 AND status = 'pending'", shopID,
	).Scan(&stats.PendingOrders)

	database.Pool.QueryRow(ctx,
		`SELECT COALESCE(SUM(total), 0), COUNT(*) FROM orders 
		 WHERE shop_id = $1 AND payment_status IN ('paid', 'completed')
		 AND created_at >= date_trunc('month', CURRENT_DATE)`, shopID,
	).Scan(&stats.MonthlyRevenue, &stats.MonthlyOrders)

	return c.JSON(stats)
}

// GetPublicShop returns public shop info (no auth required)
func GetPublicShop(c *fiber.Ctx) error {
	slug := c.Params("slug")

	var shop models.Shop
	err := database.Pool.QueryRow(context.Background(),
		`SELECT id, name, slug, description, logo, favicon, currency, language, 
		        primary_color, secondary_color, accent_color, font_heading, font_body,
		        email, phone, address, facebook, instagram, twitter,
		        meta_title, meta_description, custom_domain
		 FROM shops WHERE slug = $1 AND is_published = true AND is_active = true`,
		slug,
	).Scan(&shop.ID, &shop.Name, &shop.Slug, &shop.Description, &shop.Logo, &shop.Favicon,
		&shop.Currency, &shop.Language, &shop.PrimaryColor, &shop.SecondaryColor, &shop.AccentColor,
		&shop.FontHeading, &shop.FontBody, &shop.Email, &shop.Phone, &shop.Address,
		&shop.Facebook, &shop.Instagram, &shop.Twitter, &shop.MetaTitle, &shop.MetaDescription,
		&shop.CustomDomain)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	// Don't expose user_id publicly
	shop.UserID = uuid.Nil

	return c.JSON(shop)
}

// Helper to generate slug from name
func generateSlug(name string) string {
	slug := strings.ToLower(name)
	
	replacer := strings.NewReplacer(
		"á", "a", "ä", "a", "č", "c", "ď", "d", "é", "e", "ě", "e",
		"í", "i", "ľ", "l", "ĺ", "l", "ň", "n", "ó", "o", "ô", "o",
		"ö", "o", "ř", "r", "š", "s", "ť", "t", "ú", "u", "ů", "u",
		"ü", "u", "ý", "y", "ž", "z",
	)
	slug = replacer.Replace(slug)
	
	reg := regexp.MustCompile("[^a-z0-9]+")
	slug = reg.ReplaceAllString(slug, "-")
	
	slug = strings.Trim(slug, "-")
	
	return slug
}

// GetPublicCategories returns categories for public shop
func GetPublicCategories(c *fiber.Ctx) error {
	slug := c.Params("slug")
	ctx := context.Background()

	var shopID uuid.UUID
	err := database.Pool.QueryRow(ctx,
		"SELECT id FROM shops WHERE slug = $1 AND is_published = true AND is_active = true",
		slug,
	).Scan(&shopID)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	rows, _ := database.Pool.Query(ctx,
		`SELECT c.id, c.name, c.slug, c.description, c.image,
		        (SELECT COUNT(*) FROM products WHERE category_id = c.id AND is_active = true) as product_count
		 FROM categories c
		 WHERE c.shop_id = $1 AND c.is_active = true
		 ORDER BY c.position, c.name`,
		shopID)
	defer rows.Close()

	categories := []map[string]interface{}{}
	for rows.Next() {
		var id uuid.UUID
		var name, slug string
		var desc, image *string
		var productCount int
		rows.Scan(&id, &name, &slug, &desc, &image, &productCount)
		categories = append(categories, map[string]interface{}{
			"id":            id,
			"name":          name,
			"slug":          slug,
			"description":   desc,
			"image":         image,
			"product_count": productCount,
		})
	}

	return c.JSON(fiber.Map{"categories": categories})
}
