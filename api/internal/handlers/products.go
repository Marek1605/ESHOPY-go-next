package handlers

import (
	"context"
	"fmt"
	"regexp"
	"strings"

	"eshop-builder/internal/database"
	"eshop-builder/internal/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// GetProducts returns all products for a shop
func GetProducts(c *fiber.Ctx) error {
	shopID, err := uuid.Parse(c.Params("shopId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid shop ID"})
	}

	_, err = verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	ctx := context.Background()
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 20)
	search := c.Query("search", "")
	categoryID := c.Query("category_id", "")
	status := c.Query("status", "") // active, inactive, featured

	offset := (page - 1) * limit

	query := `
		SELECT p.id, p.shop_id, p.category_id, p.name, p.slug, p.description, p.short_description,
		       p.price, p.compare_price, p.cost_price, p.sku, p.barcode, p.quantity,
		       p.track_inventory, p.allow_backorder, p.weight, p.is_active, p.is_featured,
		       p.ai_generated, p.created_at, p.updated_at,
		       COALESCE(c.name, '') as category_name
		FROM products p
		LEFT JOIN categories c ON p.category_id = c.id
		WHERE p.shop_id = $1
	`
	countQuery := "SELECT COUNT(*) FROM products p WHERE p.shop_id = $1"
	args := []interface{}{shopID}
	argIndex := 2

	if search != "" {
		searchCond := fmt.Sprintf(" AND (p.name ILIKE $%d OR p.sku ILIKE $%d)", argIndex, argIndex)
		query += searchCond
		countQuery += searchCond
		args = append(args, "%"+search+"%")
		argIndex++
	}

	if categoryID != "" {
		catUUID, err := uuid.Parse(categoryID)
		if err == nil {
			query += fmt.Sprintf(" AND p.category_id = $%d", argIndex)
			countQuery += fmt.Sprintf(" AND p.category_id = $%d", argIndex)
			args = append(args, catUUID)
			argIndex++
		}
	}

	if status != "" {
		switch status {
		case "active":
			query += " AND p.is_active = true"
			countQuery += " AND p.is_active = true"
		case "inactive":
			query += " AND p.is_active = false"
			countQuery += " AND p.is_active = false"
		case "featured":
			query += " AND p.is_featured = true"
			countQuery += " AND p.is_featured = true"
		}
	}

	var total int64
	database.Pool.QueryRow(ctx, countQuery, args[:argIndex-1]...).Scan(&total)

	query += fmt.Sprintf(" ORDER BY p.created_at DESC LIMIT $%d OFFSET $%d", argIndex, argIndex+1)
	args = append(args, limit, offset)

	rows, err := database.Pool.Query(ctx, query, args...)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}
	defer rows.Close()

	products := []map[string]interface{}{}
	for rows.Next() {
		var p models.Product
		var categoryName string
		err := rows.Scan(&p.ID, &p.ShopID, &p.CategoryID, &p.Name, &p.Slug, &p.Description,
			&p.ShortDescription, &p.Price, &p.ComparePrice, &p.CostPrice, &p.SKU, &p.Barcode,
			&p.Quantity, &p.TrackInventory, &p.AllowBackorder, &p.Weight, &p.IsActive,
			&p.IsFeatured, &p.AIGenerated, &p.CreatedAt, &p.UpdatedAt, &categoryName)
		if err != nil {
			continue
		}

		// Get images
		imgRows, _ := database.Pool.Query(ctx,
			"SELECT id, url, alt, position FROM product_images WHERE product_id = $1 ORDER BY position",
			p.ID)
		images := []models.ProductImage{}
		for imgRows.Next() {
			var img models.ProductImage
			imgRows.Scan(&img.ID, &img.URL, &img.Alt, &img.Position)
			images = append(images, img)
		}
		imgRows.Close()

		products = append(products, map[string]interface{}{
			"id":                p.ID,
			"name":              p.Name,
			"slug":              p.Slug,
			"description":       p.Description,
			"short_description": p.ShortDescription,
			"price":             p.Price,
			"compare_price":     p.ComparePrice,
			"sku":               p.SKU,
			"quantity":          p.Quantity,
			"is_active":         p.IsActive,
			"is_featured":       p.IsFeatured,
			"ai_generated":      p.AIGenerated,
			"category_id":       p.CategoryID,
			"category_name":     categoryName,
			"images":            images,
			"created_at":        p.CreatedAt,
		})
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))

	return c.JSON(models.PaginatedResponse{
		Data:       products,
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	})
}

// GetProduct returns a single product
func GetProduct(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	productID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid product ID"})
	}

	_, err = verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	ctx := context.Background()

	var p models.Product
	err = database.Pool.QueryRow(ctx,
		`SELECT id, shop_id, category_id, name, slug, description, short_description,
		        price, compare_price, cost_price, sku, barcode, quantity,
		        track_inventory, allow_backorder, weight, width, height, length,
		        meta_title, meta_description, is_active, is_featured, ai_generated,
		        created_at, updated_at
		 FROM products WHERE id = $1 AND shop_id = $2`,
		productID, shopID,
	).Scan(&p.ID, &p.ShopID, &p.CategoryID, &p.Name, &p.Slug, &p.Description, &p.ShortDescription,
		&p.Price, &p.ComparePrice, &p.CostPrice, &p.SKU, &p.Barcode, &p.Quantity,
		&p.TrackInventory, &p.AllowBackorder, &p.Weight, &p.Width, &p.Height, &p.Length,
		&p.MetaTitle, &p.MetaDescription, &p.IsActive, &p.IsFeatured, &p.AIGenerated,
		&p.CreatedAt, &p.UpdatedAt)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	// Get images
	imgRows, _ := database.Pool.Query(ctx,
		"SELECT id, url, alt, position FROM product_images WHERE product_id = $1 ORDER BY position",
		p.ID)
	defer imgRows.Close()
	
	images := []models.ProductImage{}
	for imgRows.Next() {
		var img models.ProductImage
		imgRows.Scan(&img.ID, &img.URL, &img.Alt, &img.Position)
		images = append(images, img)
	}
	p.Images = images

	// Get variants
	varRows, _ := database.Pool.Query(ctx,
		"SELECT id, name, sku, price, quantity, options FROM product_variants WHERE product_id = $1",
		p.ID)
	defer varRows.Close()

	variants := []models.ProductVariant{}
	for varRows.Next() {
		var v models.ProductVariant
		varRows.Scan(&v.ID, &v.Name, &v.SKU, &v.Price, &v.Quantity, &v.Options)
		variants = append(variants, v)
	}
	p.Variants = variants

	return c.JSON(p)
}

// CreateProduct creates a new product
func CreateProduct(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))

	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	var req models.CreateProductRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Name is required"})
	}

	// Generate slug
	slug := req.Slug
	if slug == "" {
		slug = generateProductSlug(req.Name)
	}

	// Check uniqueness
	ctx := context.Background()
	var exists bool
	database.Pool.QueryRow(ctx,
		"SELECT EXISTS(SELECT 1 FROM products WHERE shop_id = $1 AND slug = $2)",
		shopID, slug,
	).Scan(&exists)

	if exists {
		slug = slug + "-" + uuid.New().String()[:6]
	}

	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}

	var productID uuid.UUID
	err = database.Pool.QueryRow(ctx,
		`INSERT INTO products (shop_id, category_id, name, slug, description, short_description,
		                       price, compare_price, cost_price, sku, barcode, quantity,
		                       meta_title, meta_description, is_active, is_featured, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
		 RETURNING id`,
		shopID, req.CategoryID, req.Name, slug, req.Description, req.ShortDescription,
		req.Price, req.ComparePrice, req.CostPrice, req.SKU, req.Barcode, req.Quantity,
		req.MetaTitle, req.MetaDescription, isActive, false,
	).Scan(&productID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create product"})
	}

	// Add images
	for i, img := range req.Images {
		database.Pool.Exec(ctx,
			"INSERT INTO product_images (product_id, url, alt, position) VALUES ($1, $2, $3, $4)",
			productID, img.URL, img.Alt, i)
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"id":   productID,
		"slug": slug,
	})
}

// UpdateProduct updates a product
func UpdateProduct(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	productID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid product ID"})
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
		"name": true, "slug": true, "description": true, "short_description": true,
		"price": true, "compare_price": true, "cost_price": true, "sku": true,
		"barcode": true, "quantity": true, "track_inventory": true, "allow_backorder": true,
		"weight": true, "width": true, "height": true, "length": true,
		"meta_title": true, "meta_description": true, "is_active": true, "is_featured": true,
		"category_id": true,
	}

	setClauses := []string{}
	args := []interface{}{}
	argIndex := 1

	for field, value := range updates {
		if allowedFields[field] {
			setClauses = append(setClauses, fmt.Sprintf("%s = $%d", field, argIndex))
			args = append(args, value)
			argIndex++
		}
	}

	if len(setClauses) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "No valid fields to update"})
	}

	setClauses = append(setClauses, "updated_at = NOW()")
	args = append(args, productID, shopID)

	query := fmt.Sprintf("UPDATE products SET %s WHERE id = $%d AND shop_id = $%d",
		strings.Join(setClauses, ", "), argIndex, argIndex+1)

	ctx := context.Background()
	_, err = database.Pool.Exec(ctx, query, args...)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update product"})
	}

	// Handle images update if provided
	if images, ok := updates["images"].([]interface{}); ok {
		// Delete old images
		database.Pool.Exec(ctx, "DELETE FROM product_images WHERE product_id = $1", productID)
		
		// Add new images
		for i, imgData := range images {
			if img, ok := imgData.(map[string]interface{}); ok {
				url, _ := img["url"].(string)
				alt, _ := img["alt"].(string)
				database.Pool.Exec(ctx,
					"INSERT INTO product_images (product_id, url, alt, position) VALUES ($1, $2, $3, $4)",
					productID, url, alt, i)
			}
		}
	}

	return c.JSON(fiber.Map{"success": true})
}

// DeleteProduct deletes a product
func DeleteProduct(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	productID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid product ID"})
	}

	_, err = verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	_, err = database.Pool.Exec(context.Background(),
		"DELETE FROM products WHERE id = $1 AND shop_id = $2",
		productID, shopID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete product"})
	}

	return c.JSON(fiber.Map{"success": true})
}

// ImportProducts - bulk import products
func ImportProducts(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))

	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	var req struct {
		Products []models.CreateProductRequest `json:"products"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	ctx := context.Background()
	imported := 0
	errors := []string{}

	for _, p := range req.Products {
		slug := p.Slug
		if slug == "" {
			slug = generateProductSlug(p.Name)
		}

		var exists bool
		database.Pool.QueryRow(ctx,
			"SELECT EXISTS(SELECT 1 FROM products WHERE shop_id = $1 AND slug = $2)",
			shopID, slug,
		).Scan(&exists)

		if exists {
			slug = slug + "-" + uuid.New().String()[:6]
		}

		var productID uuid.UUID
		err := database.Pool.QueryRow(ctx,
			`INSERT INTO products (shop_id, name, slug, description, price, sku, quantity, is_active, created_at, updated_at)
			 VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())
			 RETURNING id`,
			shopID, p.Name, slug, p.Description, p.Price, p.SKU, p.Quantity,
		).Scan(&productID)

		if err != nil {
			errors = append(errors, fmt.Sprintf("Failed to import %s: %v", p.Name, err))
			continue
		}

		for i, img := range p.Images {
			database.Pool.Exec(ctx,
				"INSERT INTO product_images (product_id, url, alt, position) VALUES ($1, $2, $3, $4)",
				productID, img.URL, img.Alt, i)
		}

		imported++
	}

	return c.JSON(fiber.Map{
		"imported": imported,
		"errors":   errors,
	})
}

// ExportProducts - export products to JSON
func ExportProducts(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))

	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	ctx := context.Background()
	rows, err := database.Pool.Query(ctx,
		`SELECT id, name, slug, description, short_description, price, compare_price,
		        sku, barcode, quantity, is_active, is_featured
		 FROM products WHERE shop_id = $1`, shopID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}
	defer rows.Close()

	products := []map[string]interface{}{}
	for rows.Next() {
		var p models.Product
		rows.Scan(&p.ID, &p.Name, &p.Slug, &p.Description, &p.ShortDescription,
			&p.Price, &p.ComparePrice, &p.SKU, &p.Barcode, &p.Quantity, &p.IsActive, &p.IsFeatured)

		// Get images
		imgRows, _ := database.Pool.Query(ctx,
			"SELECT url, alt FROM product_images WHERE product_id = $1 ORDER BY position", p.ID)
		images := []map[string]string{}
		for imgRows.Next() {
			var url, alt string
			imgRows.Scan(&url, &alt)
			images = append(images, map[string]string{"url": url, "alt": alt})
		}
		imgRows.Close()

		products = append(products, map[string]interface{}{
			"name":              p.Name,
			"slug":              p.Slug,
			"description":       p.Description,
			"short_description": p.ShortDescription,
			"price":             p.Price,
			"compare_price":     p.ComparePrice,
			"sku":               p.SKU,
			"barcode":           p.Barcode,
			"quantity":          p.Quantity,
			"is_active":         p.IsActive,
			"is_featured":       p.IsFeatured,
			"images":            images,
		})
	}

	c.Set("Content-Type", "application/json")
	c.Set("Content-Disposition", "attachment; filename=products.json")
	return c.JSON(fiber.Map{"products": products})
}

// Public product endpoints
func GetPublicProducts(c *fiber.Ctx) error {
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

	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 20)
	categorySlug := c.Query("category", "")
	featured := c.Query("featured", "")
	sort := c.Query("sort", "newest")

	offset := (page - 1) * limit

	query := `
		SELECT p.id, p.name, p.slug, p.short_description, p.price, p.compare_price, p.quantity,
		       (SELECT url FROM product_images WHERE product_id = p.id ORDER BY position LIMIT 1) as image
		FROM products p
		WHERE p.shop_id = $1 AND p.is_active = true
	`
	args := []interface{}{shopID}
	argIndex := 2

	if categorySlug != "" {
		query += fmt.Sprintf(" AND p.category_id = (SELECT id FROM categories WHERE shop_id = $1 AND slug = $%d)", argIndex)
		args = append(args, categorySlug)
		argIndex++
	}

	if featured == "true" {
		query += " AND p.is_featured = true"
	}

	switch sort {
	case "price_asc":
		query += " ORDER BY p.price ASC"
	case "price_desc":
		query += " ORDER BY p.price DESC"
	case "name":
		query += " ORDER BY p.name ASC"
	default:
		query += " ORDER BY p.created_at DESC"
	}

	query += fmt.Sprintf(" LIMIT $%d OFFSET $%d", argIndex, argIndex+1)
	args = append(args, limit, offset)

	rows, err := database.Pool.Query(ctx, query, args...)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}
	defer rows.Close()

	products := []map[string]interface{}{}
	for rows.Next() {
		var id uuid.UUID
		var name, slug string
		var shortDesc, image *string
		var price float64
		var comparePrice *float64
		var quantity int

		rows.Scan(&id, &name, &slug, &shortDesc, &price, &comparePrice, &quantity, &image)

		products = append(products, map[string]interface{}{
			"id":                id,
			"name":              name,
			"slug":              slug,
			"short_description": shortDesc,
			"price":             price,
			"compare_price":     comparePrice,
			"in_stock":          quantity > 0,
			"image":             image,
		})
	}

	return c.JSON(fiber.Map{"products": products})
}

func GetPublicProduct(c *fiber.Ctx) error {
	shopSlug := c.Params("slug")
	productSlug := c.Params("productSlug")
	ctx := context.Background()

	var shopID uuid.UUID
	err := database.Pool.QueryRow(ctx,
		"SELECT id FROM shops WHERE slug = $1 AND is_published = true AND is_active = true",
		shopSlug,
	).Scan(&shopID)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	var p models.Product
	err = database.Pool.QueryRow(ctx,
		`SELECT id, name, slug, description, short_description, price, compare_price,
		        sku, quantity, meta_title, meta_description
		 FROM products WHERE shop_id = $1 AND slug = $2 AND is_active = true`,
		shopID, productSlug,
	).Scan(&p.ID, &p.Name, &p.Slug, &p.Description, &p.ShortDescription,
		&p.Price, &p.ComparePrice, &p.SKU, &p.Quantity, &p.MetaTitle, &p.MetaDescription)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	// Get images
	imgRows, _ := database.Pool.Query(ctx,
		"SELECT url, alt FROM product_images WHERE product_id = $1 ORDER BY position", p.ID)
	defer imgRows.Close()

	images := []map[string]string{}
	for imgRows.Next() {
		var url string
		var alt *string
		imgRows.Scan(&url, &alt)
		altStr := ""
		if alt != nil {
			altStr = *alt
		}
		images = append(images, map[string]string{"url": url, "alt": altStr})
	}

	// Get variants
	varRows, _ := database.Pool.Query(ctx,
		"SELECT id, name, price, quantity, options FROM product_variants WHERE product_id = $1", p.ID)
	defer varRows.Close()

	variants := []map[string]interface{}{}
	for varRows.Next() {
		var id uuid.UUID
		var name string
		var price float64
		var quantity int
		var options []byte
		varRows.Scan(&id, &name, &price, &quantity, &options)
		variants = append(variants, map[string]interface{}{
			"id":       id,
			"name":     name,
			"price":    price,
			"in_stock": quantity > 0,
			"options":  string(options),
		})
	}

	return c.JSON(fiber.Map{
		"id":               p.ID,
		"name":             p.Name,
		"slug":             p.Slug,
		"description":      p.Description,
		"short_description": p.ShortDescription,
		"price":            p.Price,
		"compare_price":    p.ComparePrice,
		"sku":              p.SKU,
		"in_stock":         p.Quantity > 0,
		"meta_title":       p.MetaTitle,
		"meta_description": p.MetaDescription,
		"images":           images,
		"variants":         variants,
	})
}

func generateProductSlug(name string) string {
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
