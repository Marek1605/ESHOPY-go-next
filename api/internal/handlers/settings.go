package handlers

import (
	"context"
	"fmt"
	"strings"

	"eshop-builder/internal/database"
	"eshop-builder/internal/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// ========================================
// SETTINGS
// ========================================

func GetSettings(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	var settings models.ShopSettings
	err = database.Pool.QueryRow(context.Background(),
		`SELECT id, shop_id, company_name, ico, dic, ic_dph, bank_name, iban, swift,
		        invoice_prefix, invoice_next_number, invoice_footer, tax_rate, prices_include_tax,
		        min_order_value, order_notify_email, low_stock_threshold, terms_url, privacy_url
		 FROM shop_settings WHERE shop_id = $1`,
		shopID,
	).Scan(&settings.ID, &settings.ShopID, &settings.CompanyName, &settings.ICO, &settings.DIC, &settings.ICDPH,
		&settings.BankName, &settings.IBAN, &settings.SWIFT, &settings.InvoicePrefix, &settings.InvoiceNextNumber,
		&settings.InvoiceFooter, &settings.TaxRate, &settings.PricesIncludeTax, &settings.MinOrderValue,
		&settings.OrderNotifyEmail, &settings.LowStockThreshold, &settings.TermsURL, &settings.PrivacyURL)

	if err != nil {
		// Create default settings
		database.Pool.Exec(context.Background(),
			`INSERT INTO shop_settings (shop_id, invoice_prefix, invoice_next_number, tax_rate, prices_include_tax, low_stock_threshold)
			 VALUES ($1, 'FA', 1, 20, true, 5)`,
			shopID)
		return c.JSON(models.ShopSettings{ShopID: shopID, InvoicePrefix: "FA", InvoiceNextNumber: 1, TaxRate: 20, PricesIncludeTax: true})
	}

	return c.JSON(settings)
}

func UpdateSettings(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	var updates map[string]interface{}
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	allowedFields := map[string]bool{
		"company_name": true, "ico": true, "dic": true, "ic_dph": true,
		"bank_name": true, "iban": true, "swift": true,
		"invoice_prefix": true, "invoice_footer": true, "tax_rate": true, "prices_include_tax": true,
		"min_order_value": true, "order_notify_email": true, "low_stock_threshold": true,
		"terms_url": true, "privacy_url": true,
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
	args = append(args, shopID)

	query := fmt.Sprintf("UPDATE shop_settings SET %s WHERE shop_id = $%d",
		strings.Join(setClauses, ", "), argIndex)

	database.Pool.Exec(context.Background(), query, args...)
	return c.JSON(fiber.Map{"success": true})
}

// ========================================
// SHIPPING METHODS
// ========================================

func GetShippingMethods(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	rows, _ := database.Pool.Query(context.Background(),
		`SELECT id, name, description, price, free_above, is_active, position
		 FROM shipping_methods WHERE shop_id = $1 ORDER BY position`,
		shopID)
	defer rows.Close()

	methods := []models.ShippingMethod{}
	for rows.Next() {
		var m models.ShippingMethod
		rows.Scan(&m.ID, &m.Name, &m.Description, &m.Price, &m.FreeAbove, &m.IsActive, &m.Position)
		methods = append(methods, m)
	}

	return c.JSON(fiber.Map{"shipping_methods": methods})
}

func GetPublicShippingMethods(c *fiber.Ctx) error {
	shopSlug := c.Params("slug")
	ctx := context.Background()

	var shopID uuid.UUID
	err := database.Pool.QueryRow(ctx,
		"SELECT id FROM shops WHERE slug = $1 AND is_published = true AND is_active = true",
		shopSlug,
	).Scan(&shopID)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	rows, _ := database.Pool.Query(ctx,
		`SELECT id, name, description, price, free_above
		 FROM shipping_methods WHERE shop_id = $1 AND is_active = true ORDER BY position`,
		shopID)
	defer rows.Close()

	methods := []map[string]interface{}{}
	for rows.Next() {
		var id uuid.UUID
		var name string
		var desc *string
		var price float64
		var freeAbove *float64
		rows.Scan(&id, &name, &desc, &price, &freeAbove)
		methods = append(methods, map[string]interface{}{
			"id": id, "name": name, "description": desc, "price": price, "free_above": freeAbove,
		})
	}

	return c.JSON(fiber.Map{"shipping_methods": methods})
}

func CreateShippingMethod(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	var req models.ShippingMethod
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	var id uuid.UUID
	database.Pool.QueryRow(context.Background(),
		`INSERT INTO shipping_methods (shop_id, name, description, price, free_above, is_active, position, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, true, 0, NOW(), NOW()) RETURNING id`,
		shopID, req.Name, req.Description, req.Price, req.FreeAbove,
	).Scan(&id)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": id})
}

func UpdateShippingMethod(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	methodID, _ := uuid.Parse(c.Params("id"))

	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	var updates map[string]interface{}
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	allowedFields := map[string]bool{
		"name": true, "description": true, "price": true, "free_above": true, "is_active": true, "position": true,
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

	if len(setClauses) > 0 {
		setClauses = append(setClauses, "updated_at = NOW()")
		args = append(args, methodID, shopID)
		query := fmt.Sprintf("UPDATE shipping_methods SET %s WHERE id = $%d AND shop_id = $%d",
			strings.Join(setClauses, ", "), argIndex, argIndex+1)
		database.Pool.Exec(context.Background(), query, args...)
	}

	return c.JSON(fiber.Map{"success": true})
}

func DeleteShippingMethod(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	methodID, _ := uuid.Parse(c.Params("id"))

	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	database.Pool.Exec(context.Background(),
		"DELETE FROM shipping_methods WHERE id = $1 AND shop_id = $2", methodID, shopID)
	return c.JSON(fiber.Map{"success": true})
}

// ========================================
// PAYMENT METHODS
// ========================================

func GetPaymentMethods(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	rows, _ := database.Pool.Query(context.Background(),
		`SELECT id, type, name, description, config, is_active, is_test_mode, position
		 FROM payment_methods WHERE shop_id = $1 ORDER BY position`,
		shopID)
	defer rows.Close()

	methods := []models.PaymentMethod{}
	for rows.Next() {
		var m models.PaymentMethod
		rows.Scan(&m.ID, &m.Type, &m.Name, &m.Description, &m.Config, &m.IsActive, &m.IsTestMode, &m.Position)
		methods = append(methods, m)
	}

	return c.JSON(fiber.Map{"payment_methods": methods})
}

func GetPublicPaymentMethods(c *fiber.Ctx) error {
	shopSlug := c.Params("slug")
	ctx := context.Background()

	var shopID uuid.UUID
	err := database.Pool.QueryRow(ctx,
		"SELECT id FROM shops WHERE slug = $1 AND is_published = true AND is_active = true",
		shopSlug,
	).Scan(&shopID)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	rows, _ := database.Pool.Query(ctx,
		`SELECT id, type, name, description
		 FROM payment_methods WHERE shop_id = $1 AND is_active = true ORDER BY position`,
		shopID)
	defer rows.Close()

	methods := []map[string]interface{}{}
	for rows.Next() {
		var id uuid.UUID
		var pType, name string
		var desc *string
		rows.Scan(&id, &pType, &name, &desc)
		methods = append(methods, map[string]interface{}{
			"id": id, "type": pType, "name": name, "description": desc,
		})
	}

	return c.JSON(fiber.Map{"payment_methods": methods})
}

func CreatePaymentMethod(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	var req models.PaymentMethod
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	var id uuid.UUID
	database.Pool.QueryRow(context.Background(),
		`INSERT INTO payment_methods (shop_id, type, name, description, config, is_active, is_test_mode, position, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, true, true, 0, NOW(), NOW()) RETURNING id`,
		shopID, req.Type, req.Name, req.Description, req.Config,
	).Scan(&id)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": id})
}

func UpdatePaymentMethod(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	methodID, _ := uuid.Parse(c.Params("id"))

	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	var updates map[string]interface{}
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	allowedFields := map[string]bool{
		"name": true, "description": true, "config": true, "is_active": true, "is_test_mode": true, "position": true,
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

	if len(setClauses) > 0 {
		setClauses = append(setClauses, "updated_at = NOW()")
		args = append(args, methodID, shopID)
		query := fmt.Sprintf("UPDATE payment_methods SET %s WHERE id = $%d AND shop_id = $%d",
			strings.Join(setClauses, ", "), argIndex, argIndex+1)
		database.Pool.Exec(context.Background(), query, args...)
	}

	return c.JSON(fiber.Map{"success": true})
}

func DeletePaymentMethod(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	methodID, _ := uuid.Parse(c.Params("id"))

	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	database.Pool.Exec(context.Background(),
		"DELETE FROM payment_methods WHERE id = $1 AND shop_id = $2", methodID, shopID)
	return c.JSON(fiber.Map{"success": true})
}

// ========================================
// COUPONS
// ========================================

func GetCoupons(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	rows, _ := database.Pool.Query(context.Background(),
		`SELECT id, code, type, value, min_order_value, max_uses, used_count, starts_at, expires_at, is_active, created_at
		 FROM coupons WHERE shop_id = $1 ORDER BY created_at DESC`,
		shopID)
	defer rows.Close()

	coupons := []models.Coupon{}
	for rows.Next() {
		var coupon models.Coupon
		rows.Scan(&coupon.ID, &coupon.Code, &coupon.Type, &coupon.Value, &coupon.MinOrderValue,
			&coupon.MaxUses, &coupon.UsedCount, &coupon.StartsAt, &coupon.ExpiresAt, &coupon.IsActive, &coupon.CreatedAt)
		coupons = append(coupons, coupon)
	}

	return c.JSON(fiber.Map{"coupons": coupons})
}

func CreateCoupon(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	var req models.Coupon
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	var id uuid.UUID
	database.Pool.QueryRow(context.Background(),
		`INSERT INTO coupons (shop_id, code, type, value, min_order_value, max_uses, starts_at, expires_at, is_active, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW(), NOW()) RETURNING id`,
		shopID, strings.ToUpper(req.Code), req.Type, req.Value, req.MinOrderValue, req.MaxUses, req.StartsAt, req.ExpiresAt,
	).Scan(&id)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": id})
}

func UpdateCoupon(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	couponID, _ := uuid.Parse(c.Params("id"))

	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	var updates map[string]interface{}
	c.BodyParser(&updates)

	allowedFields := map[string]bool{
		"code": true, "type": true, "value": true, "min_order_value": true,
		"max_uses": true, "starts_at": true, "expires_at": true, "is_active": true,
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

	if len(setClauses) > 0 {
		args = append(args, couponID, shopID)
		query := fmt.Sprintf("UPDATE coupons SET %s, updated_at = NOW() WHERE id = $%d AND shop_id = $%d",
			strings.Join(setClauses, ", "), argIndex, argIndex+1)
		database.Pool.Exec(context.Background(), query, args...)
	}

	return c.JSON(fiber.Map{"success": true})
}

func DeleteCoupon(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	couponID, _ := uuid.Parse(c.Params("id"))

	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	database.Pool.Exec(context.Background(),
		"DELETE FROM coupons WHERE id = $1 AND shop_id = $2", couponID, shopID)
	return c.JSON(fiber.Map{"success": true})
}

// ========================================
// ANALYTICS
// ========================================

func GetAnalytics(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	period := c.QueryInt("period", 30)
	ctx := context.Background()

	var summary models.AnalyticsSummary

	database.Pool.QueryRow(ctx,
		`SELECT COALESCE(SUM(total), 0), COUNT(*) FROM orders 
		 WHERE shop_id = $1 AND payment_status IN ('paid', 'completed')
		 AND created_at >= NOW() - INTERVAL '1 day' * $2`,
		shopID, period,
	).Scan(&summary.TotalRevenue, &summary.TotalOrders)

	database.Pool.QueryRow(ctx,
		"SELECT COUNT(*) FROM customers WHERE shop_id = $1 AND created_at >= NOW() - INTERVAL '1 day' * $2",
		shopID, period,
	).Scan(&summary.NewCustomers)

	database.Pool.QueryRow(ctx,
		"SELECT COUNT(*) FROM customers WHERE shop_id = $1", shopID,
	).Scan(&summary.TotalCustomers)

	if summary.TotalOrders > 0 {
		summary.AverageOrderValue = summary.TotalRevenue / float64(summary.TotalOrders)
	}

	// Daily stats
	rows, _ := database.Pool.Query(ctx,
		`SELECT date, page_views, unique_visitors, orders, revenue
		 FROM daily_stats WHERE shop_id = $1 AND date >= NOW() - INTERVAL '1 day' * $2
		 ORDER BY date`,
		shopID, period)
	defer rows.Close()

	dailyStats := []models.DailyStats{}
	for rows.Next() {
		var s models.DailyStats
		rows.Scan(&s.Date, &s.PageViews, &s.UniqueVisitors, &s.Orders, &s.Revenue)
		dailyStats = append(dailyStats, s)
	}

	return c.JSON(models.AnalyticsResponse{
		Period:     period,
		Summary:    summary,
		DailyStats: dailyStats,
	})
}

func GetRevenueAnalytics(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	period := c.QueryInt("period", 30)
	ctx := context.Background()

	rows, _ := database.Pool.Query(ctx,
		`SELECT DATE(created_at) as date, SUM(total) as revenue, COUNT(*) as orders
		 FROM orders WHERE shop_id = $1 AND payment_status IN ('paid', 'completed')
		 AND created_at >= NOW() - INTERVAL '1 day' * $2
		 GROUP BY DATE(created_at) ORDER BY date`,
		shopID, period)
	defer rows.Close()

	data := []map[string]interface{}{}
	for rows.Next() {
		var date string
		var revenue float64
		var orders int
		rows.Scan(&date, &revenue, &orders)
		data = append(data, map[string]interface{}{
			"date": date, "revenue": revenue, "orders": orders,
		})
	}

	return c.JSON(fiber.Map{"data": data})
}

func GetProductAnalytics(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	ctx := context.Background()

	rows, _ := database.Pool.Query(ctx,
		`SELECT p.id, p.name, SUM(oi.quantity) as sold, SUM(oi.total) as revenue
		 FROM order_items oi
		 JOIN products p ON oi.product_id = p.id
		 JOIN orders o ON oi.order_id = o.id
		 WHERE p.shop_id = $1 AND o.payment_status IN ('paid', 'completed')
		 GROUP BY p.id, p.name
		 ORDER BY sold DESC LIMIT 10`,
		shopID)
	defer rows.Close()

	products := []models.ProductAnalytics{}
	for rows.Next() {
		var p models.ProductAnalytics
		rows.Scan(&p.ProductID, &p.Name, &p.Quantity, &p.Revenue)
		products = append(products, p)
	}

	return c.JSON(fiber.Map{"top_products": products})
}

// ========================================
// INVOICES
// ========================================

func GetInvoices(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	rows, _ := database.Pool.Query(context.Background(),
		`SELECT id, invoice_number, type, issue_date, due_date, status, total, currency, customer_name, order_number, created_at
		 FROM invoices WHERE shop_id = $1 ORDER BY created_at DESC`,
		shopID)
	defer rows.Close()

	invoices := []map[string]interface{}{}
	for rows.Next() {
		var id uuid.UUID
		var invNum, invType string
		var issueDate, dueDate, createdAt string
		var status string
		var total float64
		var currency string
		var customerName, orderNumber *string
		rows.Scan(&id, &invNum, &invType, &issueDate, &dueDate, &status, &total, &currency, &customerName, &orderNumber, &createdAt)
		invoices = append(invoices, map[string]interface{}{
			"id": id, "invoice_number": invNum, "type": invType, "issue_date": issueDate,
			"due_date": dueDate, "status": status, "total": total, "currency": currency,
			"customer_name": customerName, "order_number": orderNumber, "created_at": createdAt,
		})
	}

	return c.JSON(fiber.Map{"invoices": invoices})
}

func GetInvoice(c *fiber.Ctx) error {
	shopID, _ := uuid.Parse(c.Params("shopId"))
	invoiceID, _ := uuid.Parse(c.Params("id"))

	_, err := verifyShopOwnership(c, shopID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Shop not found"})
	}

	var invoice models.Invoice
	err = database.Pool.QueryRow(context.Background(),
		`SELECT id, invoice_number, type, issue_date, due_date, paid_at, status, subtotal, tax, total, currency,
		        supplier_name, supplier_address, supplier_city, supplier_zip, supplier_country, supplier_ico, supplier_dic, supplier_ic_dph, supplier_iban,
		        customer_name, customer_address, customer_city, customer_zip, customer_country, customer_ico, customer_dic, customer_ic_dph, customer_email,
		        items, note, order_id, order_number
		 FROM invoices WHERE id = $1 AND shop_id = $2`,
		invoiceID, shopID,
	).Scan(&invoice.ID, &invoice.InvoiceNumber, &invoice.Type, &invoice.IssueDate, &invoice.DueDate, &invoice.PaidAt, &invoice.Status,
		&invoice.Subtotal, &invoice.Tax, &invoice.Total, &invoice.Currency,
		&invoice.SupplierName, &invoice.SupplierAddress, &invoice.SupplierCity, &invoice.SupplierZip, &invoice.SupplierCountry,
		&invoice.SupplierICO, &invoice.SupplierDIC, &invoice.SupplierICDPH, &invoice.SupplierIBAN,
		&invoice.CustomerName, &invoice.CustomerAddress, &invoice.CustomerCity, &invoice.CustomerZip, &invoice.CustomerCountry,
		&invoice.CustomerICO, &invoice.CustomerDIC, &invoice.CustomerICDPH, &invoice.CustomerEmail,
		&invoice.Items, &invoice.Note, &invoice.OrderID, &invoice.OrderNumber)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Invoice not found"})
	}

	return c.JSON(invoice)
}

func GetInvoicePDF(c *fiber.Ctx) error {
	// TODO: Generate PDF
	return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{"error": "PDF generation not implemented"})
}

func GenerateInvoice(c *fiber.Ctx) error {
	// TODO: Generate invoice from order
	return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{"error": "Invoice generation not implemented"})
}

// ========================================
// PAYMENT WEBHOOKS
// ========================================

func GoPayWebhook(c *fiber.Ctx) error {
	// TODO: Handle GoPay webhook
	return c.JSON(fiber.Map{"status": "ok"})
}

func StripeWebhook(c *fiber.Ctx) error {
	// TODO: Handle Stripe webhook
	return c.JSON(fiber.Map{"status": "ok"})
}

func ComGateWebhook(c *fiber.Ctx) error {
	// TODO: Handle ComGate webhook
	return c.JSON(fiber.Map{"status": "ok"})
}

func CreateGoPayPayment(c *fiber.Ctx) error {
	return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{"error": "Not implemented"})
}

func CreateStripePayment(c *fiber.Ctx) error {
	return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{"error": "Not implemented"})
}

func CreateComGatePayment(c *fiber.Ctx) error {
	return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{"error": "Not implemented"})
}

func GetPaymentStatus(c *fiber.Ctx) error {
	return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{"error": "Not implemented"})
}

// ========================================
// STOREFRONT
// ========================================

func StorefrontHome(c *fiber.Ctx) error {
	shopSlug := c.Params("shopSlug")
	return c.Redirect("/s/" + shopSlug + "/products")
}

func StorefrontProducts(c *fiber.Ctx) error {
	return GetPublicProducts(c)
}

func StorefrontProduct(c *fiber.Ctx) error {
	return GetPublicProduct(c)
}

func StorefrontCategory(c *fiber.Ctx) error {
	return GetPublicCategories(c)
}

func StorefrontCart(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"cart": []interface{}{}})
}

func StorefrontAddToCart(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"success": true})
}

func StorefrontCheckout(c *fiber.Ctx) error {
	return CreatePublicOrder(c)
}
