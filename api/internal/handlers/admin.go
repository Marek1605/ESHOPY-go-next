package handlers

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net"
	"strings"

	"eshop-builder/internal/database"
	"eshop-builder/internal/middleware"
	"eshop-builder/internal/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// ========================================
// SUPER ADMIN MIDDLEWARE
// ========================================

func RequireSuperAdmin() fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := middleware.GetUserID(c)
		if userID == uuid.Nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
		}

		var role string
		err := database.Pool.QueryRow(context.Background(),
			"SELECT role FROM users WHERE id = $1", userID,
		).Scan(&role)

		if err != nil || role != string(models.RoleSuperAdmin) {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access denied. Super admin required."})
		}

		return c.Next()
	}
}

// ========================================
// PLATFORM STATS
// ========================================

func GetPlatformStats(c *fiber.Ctx) error {
	ctx := context.Background()
	var stats models.PlatformStats

	// Total users
	database.Pool.QueryRow(ctx, "SELECT COUNT(*) FROM users").Scan(&stats.TotalUsers)

	// Total shops
	database.Pool.QueryRow(ctx, "SELECT COUNT(*) FROM shops").Scan(&stats.TotalShops)

	// Active shops (published)
	database.Pool.QueryRow(ctx, "SELECT COUNT(*) FROM shops WHERE is_published = true AND is_active = true").Scan(&stats.ActiveShops)

	// Total products
	database.Pool.QueryRow(ctx, "SELECT COUNT(*) FROM products").Scan(&stats.TotalProducts)

	// Total orders
	database.Pool.QueryRow(ctx, "SELECT COUNT(*) FROM orders").Scan(&stats.TotalOrders)

	// Total revenue
	database.Pool.QueryRow(ctx, 
		"SELECT COALESCE(SUM(total), 0) FROM orders WHERE payment_status IN ('paid', 'completed')",
	).Scan(&stats.TotalRevenue)

	// Monthly revenue
	database.Pool.QueryRow(ctx,
		`SELECT COALESCE(SUM(total), 0) FROM orders 
		 WHERE payment_status IN ('paid', 'completed')
		 AND created_at >= date_trunc('month', CURRENT_DATE)`,
	).Scan(&stats.MonthlyRevenue)

	// New users this month
	database.Pool.QueryRow(ctx,
		"SELECT COUNT(*) FROM users WHERE created_at >= date_trunc('month', CURRENT_DATE)",
	).Scan(&stats.NewUsersThisMonth)

	// New shops this month
	database.Pool.QueryRow(ctx,
		"SELECT COUNT(*) FROM shops WHERE created_at >= date_trunc('month', CURRENT_DATE)",
	).Scan(&stats.NewShopsThisMonth)

	return c.JSON(stats)
}

// ========================================
// USER MANAGEMENT
// ========================================

func GetAllUsers(c *fiber.Ctx) error {
	ctx := context.Background()
	
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 20)
	search := c.Query("search", "")
	role := c.Query("role", "")
	plan := c.Query("plan", "")
	
	offset := (page - 1) * limit

	// Build query
	query := `
		SELECT u.id, u.email, u.name, u.role, u.plan, u.is_active, u.last_login_at, u.created_at, u.updated_at,
		       (SELECT COUNT(*) FROM shops WHERE user_id = u.id) as shops_count,
		       (SELECT COALESCE(SUM(o.total), 0) FROM orders o JOIN shops s ON o.shop_id = s.id WHERE s.user_id = u.id AND o.payment_status IN ('paid', 'completed')) as total_revenue
		FROM users u
		WHERE 1=1
	`
	countQuery := "SELECT COUNT(*) FROM users u WHERE 1=1"
	args := []interface{}{}
	argIndex := 1

	if search != "" {
		searchCondition := fmt.Sprintf(" AND (u.email ILIKE $%d OR u.name ILIKE $%d)", argIndex, argIndex)
		query += searchCondition
		countQuery += searchCondition
		args = append(args, "%"+search+"%")
		argIndex++
	}

	if role != "" {
		roleCondition := fmt.Sprintf(" AND u.role = $%d", argIndex)
		query += roleCondition
		countQuery += roleCondition
		args = append(args, role)
		argIndex++
	}

	if plan != "" {
		planCondition := fmt.Sprintf(" AND u.plan = $%d", argIndex)
		query += planCondition
		countQuery += planCondition
		args = append(args, plan)
		argIndex++
	}

	// Get total count
	var total int64
	countArgs := make([]interface{}, len(args))
	copy(countArgs, args)
	database.Pool.QueryRow(ctx, countQuery, countArgs...).Scan(&total)

	// Add pagination
	query += fmt.Sprintf(" ORDER BY u.created_at DESC LIMIT $%d OFFSET $%d", argIndex, argIndex+1)
	args = append(args, limit, offset)

	rows, err := database.Pool.Query(ctx, query, args...)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}
	defer rows.Close()

	users := []models.User{}
	for rows.Next() {
		var user models.User
		err := rows.Scan(&user.ID, &user.Email, &user.Name, &user.Role, &user.Plan, &user.IsActive,
			&user.LastLoginAt, &user.CreatedAt, &user.UpdatedAt, &user.ShopsCount, &user.TotalRevenue)
		if err != nil {
			continue
		}
		users = append(users, user)
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))

	return c.JSON(models.PaginatedResponse{
		Data:       users,
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	})
}

func GetUserDetail(c *fiber.Ctx) error {
	userID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	ctx := context.Background()

	var user models.User
	err = database.Pool.QueryRow(ctx,
		`SELECT id, email, name, role, plan, is_active, last_login_at, created_at, updated_at
		 FROM users WHERE id = $1`, userID,
	).Scan(&user.ID, &user.Email, &user.Name, &user.Role, &user.Plan, &user.IsActive,
		&user.LastLoginAt, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	// Get user's shops
	rows, _ := database.Pool.Query(ctx,
		`SELECT s.id, s.name, s.slug, s.custom_domain, s.domain_verified, s.is_active, s.is_published, s.created_at,
		        (SELECT COUNT(*) FROM products WHERE shop_id = s.id) as products_count,
		        (SELECT COUNT(*) FROM orders WHERE shop_id = s.id) as orders_count,
		        (SELECT COALESCE(SUM(total), 0) FROM orders WHERE shop_id = s.id AND payment_status IN ('paid', 'completed')) as revenue
		 FROM shops s WHERE s.user_id = $1 ORDER BY s.created_at DESC`, userID)
	defer rows.Close()

	shops := []map[string]interface{}{}
	for rows.Next() {
		var shop struct {
			ID             uuid.UUID
			Name           string
			Slug           string
			CustomDomain   *string
			DomainVerified bool
			IsActive       bool
			IsPublished    bool
			CreatedAt      string
			ProductsCount  int
			OrdersCount    int
			Revenue        float64
		}
		rows.Scan(&shop.ID, &shop.Name, &shop.Slug, &shop.CustomDomain, &shop.DomainVerified,
			&shop.IsActive, &shop.IsPublished, &shop.CreatedAt, &shop.ProductsCount,
			&shop.OrdersCount, &shop.Revenue)
		
		shops = append(shops, map[string]interface{}{
			"id":              shop.ID,
			"name":            shop.Name,
			"slug":            shop.Slug,
			"custom_domain":   shop.CustomDomain,
			"domain_verified": shop.DomainVerified,
			"is_active":       shop.IsActive,
			"is_published":    shop.IsPublished,
			"created_at":      shop.CreatedAt,
			"products_count":  shop.ProductsCount,
			"orders_count":    shop.OrdersCount,
			"revenue":         shop.Revenue,
		})
	}

	return c.JSON(fiber.Map{
		"user":  user,
		"shops": shops,
	})
}

func UpdateUser(c *fiber.Ctx) error {
	userID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	var req models.UpdateUserRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	ctx := context.Background()

	// Build update query
	setClauses := []string{}
	args := []interface{}{}
	argIndex := 1

	if req.Name != nil {
		setClauses = append(setClauses, fmt.Sprintf("name = $%d", argIndex))
		args = append(args, *req.Name)
		argIndex++
	}
	if req.Email != nil {
		setClauses = append(setClauses, fmt.Sprintf("email = $%d", argIndex))
		args = append(args, *req.Email)
		argIndex++
	}
	if req.Plan != nil {
		setClauses = append(setClauses, fmt.Sprintf("plan = $%d", argIndex))
		args = append(args, *req.Plan)
		argIndex++
	}
	if req.IsActive != nil {
		setClauses = append(setClauses, fmt.Sprintf("is_active = $%d", argIndex))
		args = append(args, *req.IsActive)
		argIndex++
	}
	if req.Role != nil {
		setClauses = append(setClauses, fmt.Sprintf("role = $%d", argIndex))
		args = append(args, *req.Role)
		argIndex++
	}

	if len(setClauses) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "No fields to update"})
	}

	setClauses = append(setClauses, "updated_at = NOW()")
	args = append(args, userID)

	query := fmt.Sprintf("UPDATE users SET %s WHERE id = $%d",
		strings.Join(setClauses, ", "), argIndex)

	_, err = database.Pool.Exec(ctx, query, args...)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user"})
	}

	return c.JSON(fiber.Map{"success": true})
}

func ResetUserPassword(c *fiber.Ctx) error {
	var req models.ResetPasswordRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if len(req.NewPassword) < 6 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Password must be at least 6 characters"})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
	}

	_, err = database.Pool.Exec(context.Background(),
		"UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
		string(hashedPassword), req.UserID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to reset password"})
	}

	return c.JSON(fiber.Map{"success": true, "message": "Password reset successfully"})
}

func DeleteUser(c *fiber.Ctx) error {
	userID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	ctx := context.Background()

	// Check if user is not super admin (can't delete super admins)
	var role string
	database.Pool.QueryRow(ctx, "SELECT role FROM users WHERE id = $1", userID).Scan(&role)
	if role == string(models.RoleSuperAdmin) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Cannot delete super admin"})
	}

	// Delete user (cascade will handle shops, products, etc.)
	_, err = database.Pool.Exec(ctx, "DELETE FROM users WHERE id = $1", userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete user"})
	}

	return c.JSON(fiber.Map{"success": true})
}

// ========================================
// SHOP MANAGEMENT (Admin)
// ========================================

func GetAllShops(c *fiber.Ctx) error {
	ctx := context.Background()
	
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 20)
	search := c.Query("search", "")
	status := c.Query("status", "") // active, inactive, published, unpublished
	
	offset := (page - 1) * limit

	query := `
		SELECT s.id, s.user_id, s.name, s.slug, s.custom_domain, s.domain_verified, 
		       s.is_active, s.is_published, s.created_at, s.updated_at,
		       u.email as user_email, u.name as user_name,
		       (SELECT COUNT(*) FROM products WHERE shop_id = s.id) as products_count,
		       (SELECT COUNT(*) FROM orders WHERE shop_id = s.id) as orders_count,
		       (SELECT COUNT(*) FROM customers WHERE shop_id = s.id) as customers_count,
		       (SELECT COALESCE(SUM(total), 0) FROM orders WHERE shop_id = s.id AND payment_status IN ('paid', 'completed')) as revenue
		FROM shops s
		JOIN users u ON s.user_id = u.id
		WHERE 1=1
	`
	countQuery := "SELECT COUNT(*) FROM shops s JOIN users u ON s.user_id = u.id WHERE 1=1"
	args := []interface{}{}
	argIndex := 1

	if search != "" {
		searchCondition := fmt.Sprintf(" AND (s.name ILIKE $%d OR s.slug ILIKE $%d OR s.custom_domain ILIKE $%d OR u.email ILIKE $%d)", argIndex, argIndex, argIndex, argIndex)
		query += searchCondition
		countQuery += searchCondition
		args = append(args, "%"+search+"%")
		argIndex++
	}

	if status != "" {
		switch status {
		case "active":
			query += " AND s.is_active = true"
			countQuery += " AND s.is_active = true"
		case "inactive":
			query += " AND s.is_active = false"
			countQuery += " AND s.is_active = false"
		case "published":
			query += " AND s.is_published = true"
			countQuery += " AND s.is_published = true"
		case "unpublished":
			query += " AND s.is_published = false"
			countQuery += " AND s.is_published = false"
		}
	}

	var total int64
	database.Pool.QueryRow(ctx, countQuery, args...).Scan(&total)

	query += fmt.Sprintf(" ORDER BY s.created_at DESC LIMIT $%d OFFSET $%d", argIndex, argIndex+1)
	args = append(args, limit, offset)

	rows, err := database.Pool.Query(ctx, query, args...)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}
	defer rows.Close()

	shops := []map[string]interface{}{}
	for rows.Next() {
		var shop struct {
			ID             uuid.UUID
			UserID         uuid.UUID
			Name           string
			Slug           string
			CustomDomain   *string
			DomainVerified bool
			IsActive       bool
			IsPublished    bool
			CreatedAt      string
			UpdatedAt      string
			UserEmail      string
			UserName       *string
			ProductsCount  int
			OrdersCount    int
			CustomersCount int
			Revenue        float64
		}
		rows.Scan(&shop.ID, &shop.UserID, &shop.Name, &shop.Slug, &shop.CustomDomain,
			&shop.DomainVerified, &shop.IsActive, &shop.IsPublished, &shop.CreatedAt,
			&shop.UpdatedAt, &shop.UserEmail, &shop.UserName, &shop.ProductsCount,
			&shop.OrdersCount, &shop.CustomersCount, &shop.Revenue)

		shops = append(shops, map[string]interface{}{
			"id":              shop.ID,
			"user_id":         shop.UserID,
			"name":            shop.Name,
			"slug":            shop.Slug,
			"custom_domain":   shop.CustomDomain,
			"domain_verified": shop.DomainVerified,
			"is_active":       shop.IsActive,
			"is_published":    shop.IsPublished,
			"created_at":      shop.CreatedAt,
			"updated_at":      shop.UpdatedAt,
			"user_email":      shop.UserEmail,
			"user_name":       shop.UserName,
			"products_count":  shop.ProductsCount,
			"orders_count":    shop.OrdersCount,
			"customers_count": shop.CustomersCount,
			"revenue":         shop.Revenue,
		})
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))

	return c.JSON(models.PaginatedResponse{
		Data:       shops,
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	})
}

func AdminUpdateShop(c *fiber.Ctx) error {
	shopID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid shop ID"})
	}

	var updates map[string]interface{}
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	allowedFields := map[string]bool{
		"is_active": true, "is_published": true, "domain_verified": true,
		"custom_domain": true, "ssl_enabled": true,
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
	args = append(args, shopID)

	query := fmt.Sprintf("UPDATE shops SET %s WHERE id = $%d",
		strings.Join(setClauses, ", "), argIndex)

	_, err = database.Pool.Exec(context.Background(), query, args...)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update shop"})
	}

	return c.JSON(fiber.Map{"success": true})
}

func AdminDeleteShop(c *fiber.Ctx) error {
	shopID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid shop ID"})
	}

	_, err = database.Pool.Exec(context.Background(), "DELETE FROM shops WHERE id = $1", shopID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete shop"})
	}

	return c.JSON(fiber.Map{"success": true})
}

// ========================================
// DOMAIN VERIFICATION
// ========================================

func InitiateDomainVerification(c *fiber.Ctx) error {
	shopID, err := uuid.Parse(c.Params("shopId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid shop ID"})
	}

	var req models.VerifyDomainRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Clean domain
	domain := strings.ToLower(strings.TrimSpace(req.Domain))
	domain = strings.TrimPrefix(domain, "http://")
	domain = strings.TrimPrefix(domain, "https://")
	domain = strings.TrimPrefix(domain, "www.")

	// Generate verification records
	verificationToken := generateToken(32)
	txtRecord := "eshopbuilder-verify=" + verificationToken
	cnameRecord := shopID.String() + ".shops.eshopbuilder.sk"

	ctx := context.Background()

	// Save or update verification
	_, err = database.Pool.Exec(ctx,
		`INSERT INTO domain_verifications (shop_id, domain, txt_record, cname_record, status, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, 'pending', NOW(), NOW())
		 ON CONFLICT (shop_id) DO UPDATE SET domain = $2, txt_record = $3, cname_record = $4, status = 'pending', updated_at = NOW()`,
		shopID, domain, txtRecord, cnameRecord)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to initiate verification"})
	}

	// Update shop custom_domain
	database.Pool.Exec(ctx, "UPDATE shops SET custom_domain = $1, domain_verified = false, updated_at = NOW() WHERE id = $2", domain, shopID)

	return c.JSON(fiber.Map{
		"domain":       domain,
		"txt_record":   txtRecord,
		"cname_record": cnameRecord,
		"instructions": fmt.Sprintf("Add a TXT record with value '%s' OR a CNAME record pointing to '%s'", txtRecord, cnameRecord),
	})
}

func CheckDomainVerification(c *fiber.Ctx) error {
	shopID, err := uuid.Parse(c.Params("shopId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid shop ID"})
	}

	ctx := context.Background()

	var verification models.DomainVerification
	err = database.Pool.QueryRow(ctx,
		"SELECT id, shop_id, domain, txt_record, cname_record, status FROM domain_verifications WHERE shop_id = $1",
		shopID,
	).Scan(&verification.ID, &verification.ShopID, &verification.Domain, &verification.TXTRecord, &verification.CNAMERecord, &verification.Status)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No pending verification found"})
	}

	// Check TXT record
	txtRecords, err := net.LookupTXT(verification.Domain)
	txtVerified := false
	if err == nil {
		for _, txt := range txtRecords {
			if strings.Contains(txt, verification.TXTRecord) {
				txtVerified = true
				break
			}
		}
	}

	// Check CNAME record
	cnameVerified := false
	cname, err := net.LookupCNAME(verification.Domain)
	if err == nil && strings.Contains(cname, verification.CNAMERecord) {
		cnameVerified = true
	}

	verified := txtVerified || cnameVerified

	if verified {
		// Update verification status
		database.Pool.Exec(ctx,
			"UPDATE domain_verifications SET status = 'verified', verified_at = NOW(), updated_at = NOW() WHERE shop_id = $1",
			shopID)

		// Update shop
		database.Pool.Exec(ctx,
			"UPDATE shops SET domain_verified = true, ssl_enabled = true, updated_at = NOW() WHERE id = $1",
			shopID)
	}

	return c.JSON(fiber.Map{
		"verified":      verified,
		"txt_verified":  txtVerified,
		"cname_verified": cnameVerified,
		"domain":        verification.Domain,
	})
}

// ========================================
// TEMPLATES MANAGEMENT
// ========================================

func GetTemplates(c *fiber.Ctx) error {
	ctx := context.Background()
	category := c.Query("category", "")
	
	query := `SELECT id, name, slug, description, thumbnail, preview_url, category, 
	                 colors, fonts, layout, components, is_premium, is_active, usage_count, created_at
	          FROM shop_templates WHERE is_active = true`
	args := []interface{}{}

	if category != "" {
		query += " AND category = $1"
		args = append(args, category)
	}

	query += " ORDER BY usage_count DESC"

	rows, err := database.Pool.Query(ctx, query, args...)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}
	defer rows.Close()

	templates := []models.ShopTemplate{}
	for rows.Next() {
		var t models.ShopTemplate
		rows.Scan(&t.ID, &t.Name, &t.Slug, &t.Description, &t.Thumbnail, &t.PreviewURL,
			&t.Category, &t.Colors, &t.Fonts, &t.Layout, &t.Components, &t.IsPremium,
			&t.IsActive, &t.UsageCount, &t.CreatedAt)
		templates = append(templates, t)
	}

	return c.JSON(fiber.Map{"templates": templates})
}

func CreateTemplate(c *fiber.Ctx) error {
	var template models.ShopTemplate
	if err := c.BodyParser(&template); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	ctx := context.Background()

	err := database.Pool.QueryRow(ctx,
		`INSERT INTO shop_templates (name, slug, description, thumbnail, preview_url, category, colors, fonts, layout, components, is_premium, is_active, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
		 RETURNING id`,
		template.Name, template.Slug, template.Description, template.Thumbnail, template.PreviewURL,
		template.Category, template.Colors, template.Fonts, template.Layout, template.Components,
		template.IsPremium, true,
	).Scan(&template.ID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create template"})
	}

	return c.Status(fiber.StatusCreated).JSON(template)
}

func UpdateTemplate(c *fiber.Ctx) error {
	templateID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid template ID"})
	}

	var updates map[string]interface{}
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	allowedFields := map[string]bool{
		"name": true, "slug": true, "description": true, "thumbnail": true,
		"preview_url": true, "category": true, "colors": true, "fonts": true,
		"layout": true, "components": true, "is_premium": true, "is_active": true,
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
	args = append(args, templateID)

	query := fmt.Sprintf("UPDATE shop_templates SET %s WHERE id = $%d",
		strings.Join(setClauses, ", "), argIndex)

	_, err = database.Pool.Exec(context.Background(), query, args...)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update template"})
	}

	return c.JSON(fiber.Map{"success": true})
}

func DeleteTemplate(c *fiber.Ctx) error {
	templateID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid template ID"})
	}

	_, err = database.Pool.Exec(context.Background(), "DELETE FROM shop_templates WHERE id = $1", templateID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete template"})
	}

	return c.JSON(fiber.Map{"success": true})
}

// Helper function
func generateToken(length int) string {
	bytes := make([]byte, length)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}
