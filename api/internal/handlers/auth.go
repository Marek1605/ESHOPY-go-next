package handlers

import (
	"context"
	"os"
	"time"

	"eshop-builder/internal/database"
	"eshop-builder/internal/middleware"
	"eshop-builder/internal/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func getJWTSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "your-super-secret-key-change-in-production"
	}
	return []byte(secret)
}

// Register creates a new user
func Register(c *fiber.Ctx) error {
	var req models.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.Email == "" || req.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Email and password are required"})
	}

	if len(req.Password) < 6 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Password must be at least 6 characters"})
	}

	ctx := context.Background()

	// Check if user exists
	var exists bool
	database.Pool.QueryRow(ctx,
		"SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)",
		req.Email,
	).Scan(&exists)

	if exists {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Email already registered"})
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
	}

	// Create user
	var user models.User
	err = database.Pool.QueryRow(ctx,
		`INSERT INTO users (email, password_hash, name, role, plan, is_active, created_at, updated_at)
		 VALUES ($1, $2, $3, 'user', 'starter', true, NOW(), NOW())
		 RETURNING id, email, name, role, plan, is_active, created_at, updated_at`,
		req.Email, string(hashedPassword), req.Name,
	).Scan(&user.ID, &user.Email, &user.Name, &user.Role, &user.Plan, &user.IsActive, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user"})
	}

	// Generate tokens
	token, refreshToken, err := generateTokens(user.ID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate tokens"})
	}

	return c.Status(fiber.StatusCreated).JSON(models.AuthResponse{
		Token:        token,
		RefreshToken: refreshToken,
		User:         user,
	})
}

// Login authenticates a user
func Login(c *fiber.Ctx) error {
	var req models.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.Email == "" || req.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Email and password are required"})
	}

	ctx := context.Background()

	var user models.User
	var passwordHash string
	err := database.Pool.QueryRow(ctx,
		`SELECT id, email, password_hash, name, role, plan, is_active, created_at, updated_at
		 FROM users WHERE email = $1`,
		req.Email,
	).Scan(&user.ID, &user.Email, &passwordHash, &user.Name, &user.Role, &user.Plan, &user.IsActive, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	if !user.IsActive {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Account is disabled"})
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	// Update last login
	database.Pool.Exec(ctx, "UPDATE users SET last_login_at = NOW() WHERE id = $1", user.ID)

	// Generate tokens
	token, refreshToken, err := generateTokens(user.ID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate tokens"})
	}

	return c.JSON(models.AuthResponse{
		Token:        token,
		RefreshToken: refreshToken,
		User:         user,
	})
}

// RefreshToken generates new tokens
func RefreshToken(c *fiber.Ctx) error {
	var req struct {
		RefreshToken string `json:"refresh_token"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Parse refresh token
	token, err := jwt.Parse(req.RefreshToken, func(token *jwt.Token) (interface{}, error) {
		return getJWTSecret(), nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid refresh token"})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token claims"})
	}

	userIDStr, ok := claims["user_id"].(string)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid user ID in token"})
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid user ID format"})
	}

	// Check if user still exists and is active
	ctx := context.Background()
	var isActive bool
	err = database.Pool.QueryRow(ctx,
		"SELECT is_active FROM users WHERE id = $1",
		userID,
	).Scan(&isActive)

	if err != nil || !isActive {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User not found or inactive"})
	}

	// Generate new tokens
	newToken, newRefreshToken, err := generateTokens(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate tokens"})
	}

	return c.JSON(fiber.Map{
		"token":         newToken,
		"refresh_token": newRefreshToken,
	})
}

// GetCurrentUser returns the current user profile
func GetCurrentUser(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var user models.User
	err := database.Pool.QueryRow(context.Background(),
		`SELECT id, email, name, role, plan, is_active, last_login_at, created_at, updated_at
		 FROM users WHERE id = $1`,
		userID,
	).Scan(&user.ID, &user.Email, &user.Name, &user.Role, &user.Plan, &user.IsActive, &user.LastLoginAt, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	// Get shops count
	database.Pool.QueryRow(context.Background(),
		"SELECT COUNT(*) FROM shops WHERE user_id = $1", userID,
	).Scan(&user.ShopsCount)

	return c.JSON(user)
}

// UpdateCurrentUser updates the current user profile
func UpdateCurrentUser(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var req struct {
		Name            *string `json:"name"`
		Email           *string `json:"email"`
		CurrentPassword *string `json:"current_password"`
		NewPassword     *string `json:"new_password"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	ctx := context.Background()

	// If changing password, verify current password
	if req.NewPassword != nil && *req.NewPassword != "" {
		if req.CurrentPassword == nil || *req.CurrentPassword == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Current password required"})
		}

		var currentHash string
		database.Pool.QueryRow(ctx,
			"SELECT password_hash FROM users WHERE id = $1", userID,
		).Scan(&currentHash)

		if err := bcrypt.CompareHashAndPassword([]byte(currentHash), []byte(*req.CurrentPassword)); err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Current password is incorrect"})
		}

		// Hash new password
		newHash, err := bcrypt.GenerateFromPassword([]byte(*req.NewPassword), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
		}

		database.Pool.Exec(ctx,
			"UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
			string(newHash), userID)
	}

	// Update other fields
	if req.Name != nil {
		database.Pool.Exec(ctx,
			"UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2",
			*req.Name, userID)
	}

	if req.Email != nil {
		// Check if email is already taken
		var exists bool
		database.Pool.QueryRow(ctx,
			"SELECT EXISTS(SELECT 1 FROM users WHERE email = $1 AND id != $2)",
			*req.Email, userID,
		).Scan(&exists)

		if exists {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Email already in use"})
		}

		database.Pool.Exec(ctx,
			"UPDATE users SET email = $1, updated_at = NOW() WHERE id = $2",
			*req.Email, userID)
	}

	return c.JSON(fiber.Map{"success": true})
}

func generateTokens(userID uuid.UUID) (string, string, error) {
	// Access token (15 minutes)
	accessClaims := jwt.MapClaims{
		"user_id": userID.String(),
		"exp":     time.Now().Add(15 * time.Minute).Unix(),
		"iat":     time.Now().Unix(),
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenString, err := accessToken.SignedString(getJWTSecret())
	if err != nil {
		return "", "", err
	}

	// Refresh token (7 days)
	refreshClaims := jwt.MapClaims{
		"user_id": userID.String(),
		"exp":     time.Now().Add(7 * 24 * time.Hour).Unix(),
		"iat":     time.Now().Unix(),
		"type":    "refresh",
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshTokenString, err := refreshToken.SignedString(getJWTSecret())
	if err != nil {
		return "", "", err
	}

	return accessTokenString, refreshTokenString, nil
}
