package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// ========================================
// USER & AUTH MODELS
// ========================================

type UserRole string

const (
	RoleSuperAdmin UserRole = "super_admin"
	RoleAdmin      UserRole = "admin"
	RoleUser       UserRole = "user"
)

type User struct {
	ID           uuid.UUID  `json:"id"`
	Email        string     `json:"email"`
	PasswordHash string     `json:"-"`
	Name         *string    `json:"name"`
	Role         UserRole   `json:"role"`
	Plan         string     `json:"plan"`
	IsActive     bool       `json:"is_active"`
	LastLoginAt  *time.Time `json:"last_login_at"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	// Computed fields
	ShopsCount   int        `json:"shops_count,omitempty"`
	TotalRevenue float64    `json:"total_revenue,omitempty"`
}

// ========================================
// SHOP TEMPLATES
// ========================================

type ShopTemplate struct {
	ID           uuid.UUID       `json:"id"`
	Name         string          `json:"name"`
	Slug         string          `json:"slug"`
	Description  *string         `json:"description"`
	Thumbnail    string          `json:"thumbnail"`
	PreviewURL   *string         `json:"preview_url"`
	Category     string          `json:"category"` // fashion, electronics, food, general, etc.
	Colors       json.RawMessage `json:"colors"`   // {"primary": "#...", "secondary": "#...", ...}
	Fonts        json.RawMessage `json:"fonts"`    // {"heading": "...", "body": "..."}
	Layout       json.RawMessage `json:"layout"`   // Layout configuration
	Components   json.RawMessage `json:"components"` // Which components to show
	IsPremium    bool            `json:"is_premium"`
	IsActive     bool            `json:"is_active"`
	UsageCount   int             `json:"usage_count"`
	CreatedAt    time.Time       `json:"created_at"`
	UpdatedAt    time.Time       `json:"updated_at"`
}

// ========================================
// SHOP MODEL (Extended)
// ========================================

type Shop struct {
	ID              uuid.UUID  `json:"id"`
	UserID          uuid.UUID  `json:"user_id"`
	TemplateID      *uuid.UUID `json:"template_id"`
	Name            string     `json:"name"`
	Slug            string     `json:"slug"`
	Description     *string    `json:"description"`
	Logo            *string    `json:"logo"`
	Favicon         *string    `json:"favicon"`
	Currency        string     `json:"currency"`
	Language        string     `json:"language"`
	Timezone        string     `json:"timezone"`
	
	// Design
	PrimaryColor    string          `json:"primary_color"`
	SecondaryColor  string          `json:"secondary_color"`
	AccentColor     string          `json:"accent_color"`
	FontHeading     string          `json:"font_heading"`
	FontBody        string          `json:"font_body"`
	CustomCSS       *string         `json:"custom_css"`
	LayoutConfig    json.RawMessage `json:"layout_config"`
	
	// Contact
	Email           *string    `json:"email"`
	Phone           *string    `json:"phone"`
	Address         *string    `json:"address"`
	City            *string    `json:"city"`
	Zip             *string    `json:"zip"`
	Country         string     `json:"country"`
	
	// Social
	Facebook        *string    `json:"facebook"`
	Instagram       *string    `json:"instagram"`
	Twitter         *string    `json:"twitter"`
	YouTube         *string    `json:"youtube"`
	TikTok          *string    `json:"tiktok"`
	
	// SEO
	MetaTitle       *string    `json:"meta_title"`
	MetaDescription *string    `json:"meta_description"`
	MetaKeywords    *string    `json:"meta_keywords"`
	GoogleAnalytics *string    `json:"google_analytics"`
	FacebookPixel   *string    `json:"facebook_pixel"`
	
	// Status
	IsActive        bool       `json:"is_active"`
	IsPublished     bool       `json:"is_published"`
	SetupCompleted  bool       `json:"setup_completed"`
	SetupStep       int        `json:"setup_step"`
	
	// Domain
	CustomDomain    *string    `json:"custom_domain"`
	DomainVerified  bool       `json:"domain_verified"`
	DomainDNSRecord *string    `json:"domain_dns_record"`
	SSLEnabled      bool       `json:"ssl_enabled"`
	
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
	
	// Relations
	User            *User           `json:"user,omitempty"`
	Template        *ShopTemplate   `json:"template,omitempty"`
	ProductsCount   int             `json:"products_count,omitempty"`
	OrdersCount     int             `json:"orders_count,omitempty"`
	CustomersCount  int             `json:"customers_count,omitempty"`
	TotalRevenue    float64         `json:"total_revenue,omitempty"`
}

// ========================================
// DOMAIN VERIFICATION
// ========================================

type DomainVerification struct {
	ID          uuid.UUID `json:"id"`
	ShopID      uuid.UUID `json:"shop_id"`
	Domain      string    `json:"domain"`
	TXTRecord   string    `json:"txt_record"`
	CNAMERecord string    `json:"cname_record"`
	Status      string    `json:"status"` // pending, verified, failed
	VerifiedAt  *time.Time `json:"verified_at"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ========================================
// AI GENERATION HISTORY
// ========================================

type AIGeneration struct {
	ID          uuid.UUID       `json:"id"`
	ShopID      uuid.UUID       `json:"shop_id"`
	UserID      uuid.UUID       `json:"user_id"`
	Type        string          `json:"type"` // product_description, seo, design, chat
	Prompt      string          `json:"prompt"`
	Response    string          `json:"response"`
	TokensUsed  int             `json:"tokens_used"`
	Model       string          `json:"model"`
	Metadata    json.RawMessage `json:"metadata"`
	CreatedAt   time.Time       `json:"created_at"`
}

// ========================================
// CATEGORY MODEL
// ========================================

type Category struct {
	ID          uuid.UUID  `json:"id"`
	ShopID      uuid.UUID  `json:"shop_id"`
	ParentID    *uuid.UUID `json:"parent_id"`
	Name        string     `json:"name"`
	Slug        string     `json:"slug"`
	Description *string    `json:"description"`
	Image       *string    `json:"image"`
	Position    int        `json:"position"`
	IsActive    bool       `json:"is_active"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	// Relations
	Products     []Product  `json:"products,omitempty"`
	ProductCount int        `json:"product_count,omitempty"`
	Children     []Category `json:"children,omitempty"`
}

// ========================================
// PRODUCT MODEL
// ========================================

type Product struct {
	ID               uuid.UUID        `json:"id"`
	ShopID           uuid.UUID        `json:"shop_id"`
	CategoryID       *uuid.UUID       `json:"category_id"`
	Name             string           `json:"name"`
	Slug             string           `json:"slug"`
	Description      *string          `json:"description"`
	ShortDescription *string          `json:"short_description"`
	Price            float64          `json:"price"`
	ComparePrice     *float64         `json:"compare_price"`
	CostPrice        *float64         `json:"cost_price"`
	SKU              *string          `json:"sku"`
	Barcode          *string          `json:"barcode"`
	Quantity         int              `json:"quantity"`
	TrackInventory   bool             `json:"track_inventory"`
	AllowBackorder   bool             `json:"allow_backorder"`
	Weight           *float64         `json:"weight"`
	Width            *float64         `json:"width"`
	Height           *float64         `json:"height"`
	Length           *float64         `json:"length"`
	MetaTitle        *string          `json:"meta_title"`
	MetaDescription  *string          `json:"meta_description"`
	IsActive         bool             `json:"is_active"`
	IsFeatured       bool             `json:"is_featured"`
	AIGenerated      bool             `json:"ai_generated"`
	CreatedAt        time.Time        `json:"created_at"`
	UpdatedAt        time.Time        `json:"updated_at"`
	// Relations
	Images           []ProductImage   `json:"images,omitempty"`
	Variants         []ProductVariant `json:"variants,omitempty"`
	Category         *Category        `json:"category,omitempty"`
}

type ProductImage struct {
	ID        uuid.UUID `json:"id"`
	ProductID uuid.UUID `json:"product_id"`
	URL       string    `json:"url"`
	Alt       *string   `json:"alt"`
	Position  int       `json:"position"`
	CreatedAt time.Time `json:"created_at"`
}

type ProductVariant struct {
	ID        uuid.UUID       `json:"id"`
	ProductID uuid.UUID       `json:"product_id"`
	Name      string          `json:"name"`
	SKU       *string         `json:"sku"`
	Price     float64         `json:"price"`
	Quantity  int             `json:"quantity"`
	Options   json.RawMessage `json:"options"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
}

// ========================================
// CUSTOMER MODEL
// ========================================

type Customer struct {
	ID               uuid.UUID  `json:"id"`
	ShopID           uuid.UUID  `json:"shop_id"`
	Email            string     `json:"email"`
	PasswordHash     *string    `json:"-"`
	FirstName        *string    `json:"first_name"`
	LastName         *string    `json:"last_name"`
	Phone            *string    `json:"phone"`
	Address          *string    `json:"address"`
	City             *string    `json:"city"`
	Zip              *string    `json:"zip"`
	Country          string     `json:"country"`
	AcceptsMarketing bool       `json:"accepts_marketing"`
	Notes            *string    `json:"notes"`
	IsVerified       bool       `json:"is_verified"`
	LastOrderAt      *time.Time `json:"last_order_at"`
	CreatedAt        time.Time  `json:"created_at"`
	UpdatedAt        time.Time  `json:"updated_at"`
	// Computed
	OrdersCount      int        `json:"orders_count,omitempty"`
	TotalSpent       float64    `json:"total_spent,omitempty"`
}

// ========================================
// ORDER MODEL
// ========================================

type Order struct {
	ID                uuid.UUID    `json:"id"`
	ShopID            uuid.UUID    `json:"shop_id"`
	CustomerID        *uuid.UUID   `json:"customer_id"`
	OrderNumber       string       `json:"order_number"`
	Status            string       `json:"status"`
	PaymentStatus     string       `json:"payment_status"`
	Subtotal          float64      `json:"subtotal"`
	Shipping          float64      `json:"shipping"`
	Tax               float64      `json:"tax"`
	Discount          float64      `json:"discount"`
	Total             float64      `json:"total"`
	Currency          string       `json:"currency"`
	ShippingFirstName *string      `json:"shipping_first_name"`
	ShippingLastName  *string      `json:"shipping_last_name"`
	ShippingCompany   *string      `json:"shipping_company"`
	ShippingAddress   *string      `json:"shipping_address"`
	ShippingCity      *string      `json:"shipping_city"`
	ShippingZip       *string      `json:"shipping_zip"`
	ShippingCountry   *string      `json:"shipping_country"`
	ShippingPhone     *string      `json:"shipping_phone"`
	BillingFirstName  *string      `json:"billing_first_name"`
	BillingLastName   *string      `json:"billing_last_name"`
	BillingCompany    *string      `json:"billing_company"`
	BillingAddress    *string      `json:"billing_address"`
	BillingCity       *string      `json:"billing_city"`
	BillingZip        *string      `json:"billing_zip"`
	BillingCountry    *string      `json:"billing_country"`
	BillingPhone      *string      `json:"billing_phone"`
	BillingEmail      *string      `json:"billing_email"`
	PaymentMethod     *string      `json:"payment_method"`
	PaymentID         *string      `json:"payment_id"`
	ShippingMethod    *string      `json:"shipping_method"`
	ShippingMethodID  *uuid.UUID   `json:"shipping_method_id"`
	TrackingNumber    *string      `json:"tracking_number"`
	CustomerNote      *string      `json:"customer_note"`
	InternalNote      *string      `json:"internal_note"`
	CouponCode        *string      `json:"coupon_code"`
	CouponID          *uuid.UUID   `json:"coupon_id"`
	CreatedAt         time.Time    `json:"created_at"`
	UpdatedAt         time.Time    `json:"updated_at"`
	// Relations
	Items             []OrderItem  `json:"items,omitempty"`
	Customer          *Customer    `json:"customer,omitempty"`
}

type OrderItem struct {
	ID             uuid.UUID       `json:"id"`
	OrderID        uuid.UUID       `json:"order_id"`
	ProductID      *uuid.UUID      `json:"product_id"`
	VariantID      *uuid.UUID      `json:"variant_id"`
	Name           string          `json:"name"`
	SKU            *string         `json:"sku"`
	Quantity       int             `json:"quantity"`
	Price          float64         `json:"price"`
	Total          float64         `json:"total"`
	VariantName    *string         `json:"variant_name"`
	VariantOptions json.RawMessage `json:"variant_options"`
}

// ========================================
// SHIPPING & PAYMENT METHODS
// ========================================

type ShippingMethod struct {
	ID          uuid.UUID `json:"id"`
	ShopID      uuid.UUID `json:"shop_id"`
	Name        string    `json:"name"`
	Description *string   `json:"description"`
	Price       float64   `json:"price"`
	FreeAbove   *float64  `json:"free_above"`
	IsActive    bool      `json:"is_active"`
	Position    int       `json:"position"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type PaymentMethod struct {
	ID           uuid.UUID       `json:"id"`
	ShopID       uuid.UUID       `json:"shop_id"`
	Type         string          `json:"type"` // gopay, stripe, comgate, cod, bank_transfer
	Name         string          `json:"name"`
	Description  *string         `json:"description"`
	Config       json.RawMessage `json:"config"`
	IsActive     bool            `json:"is_active"`
	IsTestMode   bool            `json:"is_test_mode"`
	Position     int             `json:"position"`
	CreatedAt    time.Time       `json:"created_at"`
	UpdatedAt    time.Time       `json:"updated_at"`
}

// ========================================
// COUPONS
// ========================================

type Coupon struct {
	ID               uuid.UUID  `json:"id"`
	ShopID           uuid.UUID  `json:"shop_id"`
	Code             string     `json:"code"`
	Type             string     `json:"type"` // percentage, fixed
	Value            float64    `json:"value"`
	MinOrderValue    *float64   `json:"min_order_value"`
	MaxUses          *int       `json:"max_uses"`
	UsedCount        int        `json:"used_count"`
	StartsAt         *time.Time `json:"starts_at"`
	ExpiresAt        *time.Time `json:"expires_at"`
	IsActive         bool       `json:"is_active"`
	CreatedAt        time.Time  `json:"created_at"`
	UpdatedAt        time.Time  `json:"updated_at"`
}

// ========================================
// SHOP SETTINGS
// ========================================

type ShopSettings struct {
	ID                uuid.UUID `json:"id"`
	ShopID            uuid.UUID `json:"shop_id"`
	CompanyName       *string   `json:"company_name"`
	ICO               *string   `json:"ico"`
	DIC               *string   `json:"dic"`
	ICDPH             *string   `json:"ic_dph"`
	BankName          *string   `json:"bank_name"`
	IBAN              *string   `json:"iban"`
	SWIFT             *string   `json:"swift"`
	InvoicePrefix     string    `json:"invoice_prefix"`
	InvoiceNextNumber int       `json:"invoice_next_number"`
	InvoiceFooter     *string   `json:"invoice_footer"`
	TaxRate           float64   `json:"tax_rate"`
	PricesIncludeTax  bool      `json:"prices_include_tax"`
	MinOrderValue     *float64  `json:"min_order_value"`
	OrderNotifyEmail  *string   `json:"order_notify_email"`
	LowStockThreshold int       `json:"low_stock_threshold"`
	TermsURL          *string   `json:"terms_url"`
	PrivacyURL        *string   `json:"privacy_url"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

// ========================================
// ANALYTICS
// ========================================

type DailyStats struct {
	ID             uuid.UUID `json:"id"`
	ShopID         uuid.UUID `json:"shop_id"`
	Date           time.Time `json:"date"`
	PageViews      int       `json:"page_views"`
	UniqueVisitors int       `json:"unique_visitors"`
	Orders         int       `json:"orders"`
	Revenue        float64   `json:"revenue"`
	ConversionRate float64   `json:"conversion_rate"`
}

// ========================================
// SUPER ADMIN STATS
// ========================================

type PlatformStats struct {
	TotalUsers        int     `json:"total_users"`
	TotalShops        int     `json:"total_shops"`
	ActiveShops       int     `json:"active_shops"`
	TotalProducts     int     `json:"total_products"`
	TotalOrders       int     `json:"total_orders"`
	TotalRevenue      float64 `json:"total_revenue"`
	MonthlyRevenue    float64 `json:"monthly_revenue"`
	NewUsersThisMonth int     `json:"new_users_this_month"`
	NewShopsThisMonth int     `json:"new_shops_this_month"`
}

// ========================================
// REQUEST/RESPONSE DTOs
// ========================================

type RegisterRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
	Name     string `json:"name"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type AuthResponse struct {
	Token        string `json:"token"`
	RefreshToken string `json:"refresh_token"`
	User         User   `json:"user"`
}

type CreateShopRequest struct {
	Name        string     `json:"name" validate:"required,min=2"`
	Slug        string     `json:"slug"`
	Description *string    `json:"description"`
	TemplateID  *uuid.UUID `json:"template_id"`
	Currency    string     `json:"currency"`
	Language    string     `json:"language"`
	Category    string     `json:"category"` // shop category for AI suggestions
}

type AIShopBuilderRequest struct {
	BusinessType    string   `json:"business_type"`
	BusinessName    string   `json:"business_name"`
	Description     string   `json:"description"`
	TargetAudience  string   `json:"target_audience"`
	Products        []string `json:"products"`
	ColorPreference string   `json:"color_preference"`
	Style           string   `json:"style"` // modern, classic, minimal, bold
}

type ResetPasswordRequest struct {
	UserID      uuid.UUID `json:"user_id" validate:"required"`
	NewPassword string    `json:"new_password" validate:"required,min=6"`
}

type UpdateUserRequest struct {
	Name     *string   `json:"name"`
	Email    *string   `json:"email"`
	Plan     *string   `json:"plan"`
	IsActive *bool     `json:"is_active"`
	Role     *UserRole `json:"role"`
}

type VerifyDomainRequest struct {
	Domain string `json:"domain" validate:"required"`
}

type PaginatedResponse struct {
	Data       interface{} `json:"data"`
	Page       int         `json:"page"`
	Limit      int         `json:"limit"`
	Total      int64       `json:"total"`
	TotalPages int         `json:"total_pages"`
}

type AIGenerateRequest struct {
	Type    string          `json:"type" validate:"required"`
	Prompt  string          `json:"prompt"`
	Context json.RawMessage `json:"context"`
}
