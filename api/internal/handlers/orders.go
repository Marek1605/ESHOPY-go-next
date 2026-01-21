package handlers

import (
	"context"
	"fmt"
	"strings"
	"time"

	"eshop-builder/internal/database"
	"eshop-builder/internal/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// ========================================
// ORDERS
// ========================================

func GetOrders(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	ctx := context.Background()
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 20)
	status := c.Query("status", "")
	search := c.Query("search", "")

	offset := (page - 1) * limit

	query := `
		SELECT o.id, o.order_number, o.status, o.payment_status, o.total, o.currency,
		       o.shipping_first_name, o.shipping_last_name, o.shipping_email,
		       o.created_at, o.updated_at,
		       COALESCE(c.email, o.billing_email) as customer_email
		FROM orders o
		LEFT JOIN customers c ON o.customer_id = c.id
		WHERE o.shop_id = $1
	`
	args := []interface{}{shopID}
	argIndex := 2

	if status != "" {
		query += fmt.Sprintf(" AND o.status = $%d", argIndex)
		args = append(args, status)
		argIndex++
	}

	if search != "" {
		query += fmt.Sprintf(" AND (o.order_number ILIKE $%d OR o.billing_email ILIKE $%d)", argIndex, argIndex)
		args = append(args, "%"+search+"%")
		argIndex++
	}

	var total int64
	countQuery := strings.Replace(query, "SELECT o.id, o.order_number", "SELECT COUNT(*)", 1)
	countQuery = strings.Split(countQuery, "FROM orders")[0] + "FROM orders" + strings.Split(countQuery, "FROM orders")[1]
	database.Pool.QueryRow(ctx, "SELECT COUNT(*) FROM orders WHERE shop_id = $1", shopID).Scan(&total)

	query += fmt.Sprintf(" ORDER BY o.created_at DESC LIMIT $%d OFFSET $%d", argIndex, argIndex+1)
	args = append(args, limit, offset)

	rows, err := database.Pool.Query(ctx, query, args...)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}
	defer rows.Close()

	orders := []map[string]interface{}{}
	for rows.Next() {
		var o struct {
			ID            uuid.UUID
			OrderNumber   string
			Status        string
			PaymentStatus string
			Total         float64
			Currency      string
			FirstName     *string
			LastName      *string
			Email         *string
			CreatedAt     time.Time
			UpdatedAt     time.Time
			CustomerEmail *string
		}
		rows.Scan(&o.ID, &o.OrderNumber, &o.Status, &o.PaymentStatus, &o.Total, &o.Currency,
			&o.FirstName, &o.LastName, &o.Email, &o.CreatedAt, &o.UpdatedAt, &o.CustomerEmail)

		orders = append(orders, map[string]interface{}{
			"id":             o.ID,
			"order_number":   o.OrderNumber,
			"status":         o.Status,
			"payment_status": o.PaymentStatus,
			"total":          o.Total,
			"currency":       o.Currency,
			"customer_name":  fmt.Sprintf("%s %s", ptrStr(o.FirstName), ptrStr(o.LastName)),
			"customer_email": o.CustomerEmail,
			"created_at":     o.CreatedAt,
		})
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))
	return c.JSON(models.PaginatedResponse{Data: orders, Page: page, Limit: limit, Total: total, TotalPages: totalPages})
}

func GetOrder(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	orderID, _ := uuid.Parse(c.Params("id"))

	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	ctx := context.Background()
	var order models.Order
	err = database.Pool.QueryRow(ctx,
		`SELECT id, order_number, status, payment_status, subtotal, shipping, tax, discount, total, currency,
		        shipping_first_name, shipping_last_name, shipping_address, shipping_city, shipping_zip, shipping_country, shipping_phone,
		        billing_first_name, billing_last_name, billing_address, billing_city, billing_zip, billing_country, billing_email,
		        payment_method, tracking_number, customer_note, internal_note, created_at, updated_at
		 FROM orders WHERE id = $1 AND shop_id = $2`,
		orderID, shopID,
	).Scan(&order.ID, &order.OrderNumber, &order.Status, &order.PaymentStatus, &order.Subtotal, &order.Shipping,
		&order.Tax, &order.Discount, &order.Total, &order.Currency,
		&order.ShippingFirstName, &order.ShippingLastName, &order.ShippingAddress, &order.ShippingCity, &order.ShippingZip, &order.ShippingCountry, &order.ShippingPhone,
		&order.BillingFirstName, &order.BillingLastName, &order.BillingAddress, &order.BillingCity, &order.BillingZip, &order.BillingCountry, &order.BillingEmail,
		&order.PaymentMethod, &order.TrackingNumber, &order.CustomerNote, &order.InternalNote, &order.CreatedAt, &order.UpdatedAt)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Order not found"})
	}

	// Get items
	itemRows, _ := database.Pool.Query(ctx,
		"SELECT id, name, sku, quantity, price, total FROM order_items WHERE order_id = $1", orderID)
	defer itemRows.Close()

	items := []models.OrderItem{}
	for itemRows.Next() {
		var item models.OrderItem
		itemRows.Scan(&item.ID, &item.Name, &item.SKU, &item.Quantity, &item.Price, &item.Total)
		items = append(items, item)
	}
	order.Items = items

	return c.JSON(order)
}

func UpdateOrder(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	orderID, _ := uuid.Parse(c.Params("id"))

	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	var updates map[string]interface{}
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	allowedFields := map[string]bool{
		"status": true, "payment_status": true, "tracking_number": true, "internal_note": true,
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
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "No valid fields"})
	}

	setClauses = append(setClauses, "updated_at = NOW()")
	args = append(args, orderID, shopID)

	query := fmt.Sprintf("UPDATE orders SET %s WHERE id = $%d AND shop_id = $%d",
		strings.Join(setClauses, ", "), argIndex, argIndex+1)

	database.Pool.Exec(context.Background(), query, args...)
	return c.JSON(fiber.Map{"success": true})
}

func CancelOrder(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	orderID, _ := uuid.Parse(c.Params("id"))

	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	database.Pool.Exec(context.Background(),
		"UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = $1 AND shop_id = $2",
		orderID, shopID)

	return c.JSON(fiber.Map{"success": true})
}

func CreatePublicOrder(c *fiber.Ctx) error {
	shopSlug := c.Params("slug")
	ctx := context.Background()

	var shopID uuid.UUID
	var currency string
	err := database.Pool.QueryRow(ctx,
		"SELECT id, currency FROM shops WHERE slug = $1 AND is_published = true AND is_active = true",
		shopSlug,
	).Scan(&shopID, &currency)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	var req models.CreateOrderRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	// Generate order number
	orderNumber := fmt.Sprintf("ORD-%d", time.Now().UnixNano()/1000000)

	// Calculate totals
	var subtotal float64
	for _, item := range req.Items {
		var price float64
		database.Pool.QueryRow(ctx, "SELECT price FROM products WHERE id = $1", item.ProductID).Scan(&price)
		subtotal += price * float64(item.Quantity)
	}

	// Get shipping cost
	var shippingCost float64 = 0
	if req.ShippingMethod != "" {
		database.Pool.QueryRow(ctx,
			"SELECT price FROM shipping_methods WHERE shop_id = $1 AND name = $2",
			shopID, req.ShippingMethod,
		).Scan(&shippingCost)
	}

	total := subtotal + shippingCost

	// Create order
	var orderID uuid.UUID
	err = database.Pool.QueryRow(ctx,
		`INSERT INTO orders (shop_id, order_number, status, payment_status, subtotal, shipping, total, currency,
		                     shipping_first_name, shipping_last_name, shipping_address, shipping_city, shipping_zip, shipping_country, shipping_phone,
		                     billing_first_name, billing_last_name, billing_address, billing_city, billing_zip, billing_country, billing_email,
		                     payment_method, shipping_method, customer_note, created_at, updated_at)
		 VALUES ($1, $2, 'pending', 'pending', $3, $4, $5, $6,
		         $7, $8, $9, $10, $11, $12, $13,
		         $14, $15, $16, $17, $18, $19, $20,
		         $21, $22, $23, NOW(), NOW())
		 RETURNING id`,
		shopID, orderNumber, subtotal, shippingCost, total, currency,
		req.Shipping.FirstName, req.Shipping.LastName, req.Shipping.Address, req.Shipping.City, req.Shipping.Zip, req.Shipping.Country, req.Shipping.Phone,
		req.Billing.FirstName, req.Billing.LastName, req.Billing.Address, req.Billing.City, req.Billing.Zip, req.Billing.Country, req.Billing.Email,
		req.PaymentMethod, req.ShippingMethod, req.CustomerNote,
	).Scan(&orderID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create order"})
	}

	// Add items
	for _, item := range req.Items {
		var name string
		var price float64
		database.Pool.QueryRow(ctx,
			"SELECT name, price FROM products WHERE id = $1", item.ProductID,
		).Scan(&name, &price)

		database.Pool.Exec(ctx,
			`INSERT INTO order_items (order_id, product_id, name, quantity, price, total)
			 VALUES ($1, $2, $3, $4, $5, $6)`,
			orderID, item.ProductID, name, item.Quantity, price, price*float64(item.Quantity))
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"order_id":     orderID,
		"order_number": orderNumber,
		"total":        total,
	})
}

// ========================================
// CUSTOMERS
// ========================================

func GetCustomers(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	ctx := context.Background()
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 20)
	search := c.Query("search", "")
	offset := (page - 1) * limit

	query := `
		SELECT c.id, c.email, c.first_name, c.last_name, c.phone, c.city, c.country,
		       c.accepts_marketing, c.created_at,
		       (SELECT COUNT(*) FROM orders WHERE customer_id = c.id) as orders_count,
		       (SELECT COALESCE(SUM(total), 0) FROM orders WHERE customer_id = c.id AND payment_status = 'paid') as total_spent
		FROM customers c
		WHERE c.shop_id = $1
	`
	args := []interface{}{shopID}
	argIndex := 2

	if search != "" {
		query += fmt.Sprintf(" AND (c.email ILIKE $%d OR c.first_name ILIKE $%d OR c.last_name ILIKE $%d)", argIndex, argIndex, argIndex)
		args = append(args, "%"+search+"%")
		argIndex++
	}

	var total int64
	database.Pool.QueryRow(ctx, "SELECT COUNT(*) FROM customers WHERE shop_id = $1", shopID).Scan(&total)

	query += fmt.Sprintf(" ORDER BY c.created_at DESC LIMIT $%d OFFSET $%d", argIndex, argIndex+1)
	args = append(args, limit, offset)

	rows, _ := database.Pool.Query(ctx, query, args...)
	defer rows.Close()

	customers := []map[string]interface{}{}
	for rows.Next() {
		var c models.Customer
		var ordersCount int
		var totalSpent float64
		rows.Scan(&c.ID, &c.Email, &c.FirstName, &c.LastName, &c.Phone, &c.City, &c.Country,
			&c.AcceptsMarketing, &c.CreatedAt, &ordersCount, &totalSpent)
		customers = append(customers, map[string]interface{}{
			"id":                c.ID,
			"email":             c.Email,
			"name":              fmt.Sprintf("%s %s", ptrStr(c.FirstName), ptrStr(c.LastName)),
			"phone":             c.Phone,
			"city":              c.City,
			"country":           c.Country,
			"accepts_marketing": c.AcceptsMarketing,
			"orders_count":      ordersCount,
			"total_spent":       totalSpent,
			"created_at":        c.CreatedAt,
		})
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))
	return c.JSON(models.PaginatedResponse{Data: customers, Page: page, Limit: limit, Total: total, TotalPages: totalPages})
}

func GetCustomer(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	customerID, _ := uuid.Parse(c.Params("id"))

	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	ctx := context.Background()
	var customer models.Customer
	err = database.Pool.QueryRow(ctx,
		`SELECT id, email, first_name, last_name, phone, address, city, zip, country,
		        accepts_marketing, notes, created_at, updated_at
		 FROM customers WHERE id = $1 AND shop_id = $2`,
		customerID, shopID,
	).Scan(&customer.ID, &customer.Email, &customer.FirstName, &customer.LastName, &customer.Phone,
		&customer.Address, &customer.City, &customer.Zip, &customer.Country,
		&customer.AcceptsMarketing, &customer.Notes, &customer.CreatedAt, &customer.UpdatedAt)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Customer not found"})
	}

	// Get orders
	database.Pool.QueryRow(ctx,
		"SELECT COUNT(*), COALESCE(SUM(total), 0) FROM orders WHERE customer_id = $1 AND payment_status = 'paid'",
		customerID,
	).Scan(&customer.OrdersCount, &customer.TotalSpent)

	return c.JSON(customer)
}

func UpdateCustomer(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	customerID, _ := uuid.Parse(c.Params("id"))

	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	var updates map[string]interface{}
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	allowedFields := map[string]bool{
		"first_name": true, "last_name": true, "phone": true, "address": true,
		"city": true, "zip": true, "country": true, "accepts_marketing": true, "notes": true,
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
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "No valid fields"})
	}

	setClauses = append(setClauses, "updated_at = NOW()")
	args = append(args, customerID, shopID)

	query := fmt.Sprintf("UPDATE customers SET %s WHERE id = $%d AND shop_id = $%d",
		strings.Join(setClauses, ", "), argIndex, argIndex+1)

	database.Pool.Exec(context.Background(), query, args...)
	return c.JSON(fiber.Map{"success": true})
}

// ========================================
// CATEGORIES
// ========================================

func GetCategories(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	rows, _ := database.Pool.Query(context.Background(),
		`SELECT c.id, c.name, c.slug, c.description, c.image, c.position, c.is_active,
		        (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count
		 FROM categories c WHERE c.shop_id = $1 ORDER BY c.position, c.name`,
		shopID)
	defer rows.Close()

	categories := []map[string]interface{}{}
	for rows.Next() {
		var id uuid.UUID
		var name, slug string
		var desc, image *string
		var position int
		var isActive bool
		var productCount int
		rows.Scan(&id, &name, &slug, &desc, &image, &position, &isActive, &productCount)
		categories = append(categories, map[string]interface{}{
			"id":            id,
			"name":          name,
			"slug":          slug,
			"description":   desc,
			"image":         image,
			"position":      position,
			"is_active":     isActive,
			"product_count": productCount,
		})
	}

	return c.JSON(fiber.Map{"categories": categories})
}

func CreateCategory(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	var req struct {
		Name        string  `json:"name"`
		Slug        string  `json:"slug"`
		Description *string `json:"description"`
		Image       *string `json:"image"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	slug := req.Slug
	if slug == "" {
		slug = generateSlug(req.Name)
	}

	var id uuid.UUID
	err = database.Pool.QueryRow(context.Background(),
		`INSERT INTO categories (shop_id, name, slug, description, image, is_active, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW()) RETURNING id`,
		shopID, req.Name, slug, req.Description, req.Image,
	).Scan(&id)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create category"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": id, "slug": slug})
}

func UpdateCategory(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	categoryID, _ := uuid.Parse(c.Params("id"))

	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	var updates map[string]interface{}
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	allowedFields := map[string]bool{
		"name": true, "slug": true, "description": true, "image": true, "position": true, "is_active": true,
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
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "No valid fields"})
	}

	setClauses = append(setClauses, "updated_at = NOW()")
	args = append(args, categoryID, shopID)

	query := fmt.Sprintf("UPDATE categories SET %s WHERE id = $%d AND shop_id = $%d",
		strings.Join(setClauses, ", "), argIndex, argIndex+1)

	database.Pool.Exec(context.Background(), query, args...)
	return c.JSON(fiber.Map{"success": true})
}

func DeleteCategory(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	categoryID, _ := uuid.Parse(c.Params("id"))

	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	database.Pool.Exec(context.Background(),
		"DELETE FROM categories WHERE id = $1 AND shop_id = $2",
		categoryID, shopID)

	return c.JSON(fiber.Map{"success": true})
}

// Helper function
func ptrStr(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}
