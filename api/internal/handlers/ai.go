package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"eshop-builder/internal/database"
	"eshop-builder/internal/middleware"
	"eshop-builder/internal/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"

type AnthropicMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type AnthropicRequest struct {
	Model     string             `json:"model"`
	MaxTokens int                `json:"max_tokens"`
	System    string             `json:"system,omitempty"`
	Messages  []AnthropicMessage `json:"messages"`
}

type AnthropicResponse struct {
	Content []struct {
		Type string `json:"type"`
		Text string `json:"text"`
	} `json:"content"`
	Usage struct {
		InputTokens  int `json:"input_tokens"`
		OutputTokens int `json:"output_tokens"`
	} `json:"usage"`
}

func callAnthropic(systemPrompt, userPrompt string) (string, int, error) {
	apiKey := os.Getenv("ANTHROPIC_API_KEY")
	if apiKey == "" {
		return "", 0, fmt.Errorf("ANTHROPIC_API_KEY not set")
	}

	reqBody := AnthropicRequest{
		Model:     "claude-sonnet-4-20250514",
		MaxTokens: 2048,
		System:    systemPrompt,
		Messages: []AnthropicMessage{
			{Role: "user", Content: userPrompt},
		},
	}

	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("POST", ANTHROPIC_API_URL, bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-api-key", apiKey)
	req.Header.Set("anthropic-version", "2023-06-01")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", 0, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var anthropicResp AnthropicResponse
	if err := json.Unmarshal(body, &anthropicResp); err != nil {
		return "", 0, err
	}

	if len(anthropicResp.Content) == 0 {
		return "", 0, fmt.Errorf("empty response from Anthropic")
	}

	totalTokens := anthropicResp.Usage.InputTokens + anthropicResp.Usage.OutputTokens
	return anthropicResp.Content[0].Text, totalTokens, nil
}

func saveAIGeneration(userID, shopID uuid.UUID, genType, prompt, response string, tokens int, model string) {
	database.Pool.Exec(context.Background(),
		`INSERT INTO ai_generations (user_id, shop_id, type, prompt, response, tokens_used, model, created_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
		userID, shopID, genType, prompt, response, tokens, model)
}

// AIGenerate - generic AI generation endpoint
func AIGenerate(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var req models.AIGenerateRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	systemPrompt := "Si AI asistent pre e-shop platformu. Odpovedáš v slovenčine. Buď stručný a profesionálny."
	
	response, tokens, err := callAnthropic(systemPrompt, req.Prompt)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "AI generation failed"})
	}

	saveAIGeneration(userID, uuid.Nil, req.Type, req.Prompt, response, tokens, "claude-sonnet-4-20250514")

	return c.JSON(fiber.Map{
		"response":    response,
		"tokens_used": tokens,
	})
}

// AIProductDescription - generate product description
func AIProductDescription(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var req struct {
		ProductName  string   `json:"product_name"`
		Category     string   `json:"category"`
		Keywords     []string `json:"keywords"`
		Style        string   `json:"style"` // professional, casual, luxury, playful
		IncludeSEO   bool     `json:"include_seo"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	systemPrompt := `Si expertný copywriter pre e-commerce. Vytváraš pútavé popisy produktov v slovenčine.
Tvoje popisy sú:
- SEO optimalizované
- Zdôrazňujú benefity pre zákazníka
- Obsahujú jasné call-to-action
- Prispôsobené cieľovej skupine

Vždy odpovedaj v JSON formáte:
{
  "short_description": "Krátky popis (max 160 znakov)",
  "description": "Plný popis produktu (HTML formát s <p>, <ul>, <li> tagmi)",
  "meta_title": "SEO title (max 60 znakov)",
  "meta_description": "SEO meta description (max 160 znakov)",
  "keywords": ["kľúčové", "slová"]
}`

	keywords := ""
	if len(req.Keywords) > 0 {
		keywords = fmt.Sprintf("Kľúčové slová: %v", req.Keywords)
	}

	userPrompt := fmt.Sprintf(`Vytvor popis produktu:
Názov: %s
Kategória: %s
Štýl: %s
%s`, req.ProductName, req.Category, req.Style, keywords)

	response, tokens, err := callAnthropic(systemPrompt, userPrompt)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "AI generation failed"})
	}

	// Parse JSON response
	var result map[string]interface{}
	if err := json.Unmarshal([]byte(response), &result); err != nil {
		// If not valid JSON, return raw response
		result = map[string]interface{}{
			"description": response,
		}
	}

	saveAIGeneration(userID, uuid.Nil, "product_description", userPrompt, response, tokens, "claude-sonnet-4-20250514")

	return c.JSON(fiber.Map{
		"result":      result,
		"tokens_used": tokens,
	})
}

// AISEOGenerate - generate SEO content
func AISEOGenerate(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var req struct {
		PageType    string `json:"page_type"` // product, category, homepage, about
		Title       string `json:"title"`
		Description string `json:"description"`
		Keywords    string `json:"keywords"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	systemPrompt := `Si SEO expert pre slovenský e-commerce trh. Vytváraš optimalizované SEO texty.

Vždy odpovedaj v JSON formáte:
{
  "meta_title": "Optimalizovaný title tag (max 60 znakov)",
  "meta_description": "Meta description (max 160 znakov)",
  "h1": "Hlavný nadpis stránky",
  "keywords": ["primárne", "sekundárne", "long-tail"],
  "suggestions": ["Tip na zlepšenie 1", "Tip 2"]
}`

	userPrompt := fmt.Sprintf(`Vytvor SEO obsah pre:
Typ stránky: %s
Názov/Téma: %s
Popis: %s
Existujúce kľúčové slová: %s`, req.PageType, req.Title, req.Description, req.Keywords)

	response, tokens, err := callAnthropic(systemPrompt, userPrompt)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "AI generation failed"})
	}

	var result map[string]interface{}
	if err := json.Unmarshal([]byte(response), &result); err != nil {
		result = map[string]interface{}{"raw": response}
	}

	saveAIGeneration(userID, uuid.Nil, "seo", userPrompt, response, tokens, "claude-sonnet-4-20250514")

	return c.JSON(fiber.Map{
		"result":      result,
		"tokens_used": tokens,
	})
}

// AIShopBuilder - generate shop design suggestions
func AIShopBuilder(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var req models.AIShopBuilderRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	systemPrompt := `Si UI/UX dizajnér špecializovaný na e-commerce. Navrhuješ moderné, konverzné e-shopy.

Na základe typu biznisu a cieľovej skupiny navrhni:
1. Farebnú paletu (primárna, sekundárna, akcentová farba)
2. Typografiu (font pre nadpisy a text)
3. Celkový štýl a layout
4. Popis obchodu

Odpovedaj v JSON formáte:
{
  "description": "Profesionálny popis obchodu v slovenčine (2-3 vety)",
  "colors": {
    "primary": "#hexcode",
    "secondary": "#hexcode", 
    "accent": "#hexcode"
  },
  "fonts": {
    "heading": "Názov fontu",
    "body": "Názov fontu"
  },
  "style_notes": "Poznámky k dizajnu",
  "layout_suggestions": ["Návrh 1", "Návrh 2"]
}`

	userPrompt := fmt.Sprintf(`Navrhni dizajn pre e-shop:
Typ biznisu: %s
Názov: %s
Popis: %s
Cieľová skupina: %s
Preferovaný štýl: %s
Produkty: %v`,
		req.BusinessType, req.BusinessName, req.Description,
		req.TargetAudience, req.Style, req.Products)

	response, tokens, err := callAnthropic(systemPrompt, userPrompt)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "AI generation failed"})
	}

	var suggestions map[string]interface{}
	if err := json.Unmarshal([]byte(response), &suggestions); err != nil {
		// Try to extract JSON from response
		suggestions = map[string]interface{}{
			"description": "Váš nový e-shop je pripravený!",
			"colors": map[string]string{
				"primary":   "#3B82F6",
				"secondary": "#1E40AF",
				"accent":    "#F59E0B",
			},
			"fonts": map[string]string{
				"heading": "Inter",
				"body":    "Inter",
			},
		}
	}

	saveAIGeneration(userID, uuid.Nil, "shop_builder", userPrompt, response, tokens, "claude-sonnet-4-20250514")

	return c.JSON(fiber.Map{
		"suggestions": suggestions,
		"tokens_used": tokens,
	})
}

// AIChat - conversational AI for customization
func AIChat(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var req struct {
		Message string                 `json:"message"`
		Context map[string]interface{} `json:"context"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	contextJSON, _ := json.Marshal(req.Context)

	systemPrompt := fmt.Sprintf(`Si priateľský AI asistent pre tvorbu e-shopov. Pomáhaš používateľom vytvárať a upravovať ich online obchody.

Aktuálny kontext e-shopu:
%s

Môžeš pomôcť s:
- Výberom farieb a dizajnu
- Písaním popisov produktov
- SEO optimalizáciou
- Nastavením obchodu
- Radami pre zvýšenie predaja

Odpovedaj v slovenčine, buď priateľský a nápomocný. Ak navrhuješ zmeny, vysvetli prečo.`, string(contextJSON))

	response, tokens, err := callAnthropic(systemPrompt, req.Message)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "AI chat failed"})
	}

	saveAIGeneration(userID, uuid.Nil, "chat", req.Message, response, tokens, "claude-sonnet-4-20250514")

	return c.JSON(fiber.Map{
		"response":    response,
		"tokens_used": tokens,
	})
}

// AITranslate - translate content
func AITranslate(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var req struct {
		Text       string `json:"text"`
		FromLang   string `json:"from_lang"`
		ToLang     string `json:"to_lang"`
		Context    string `json:"context"` // product, category, general
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	systemPrompt := `Si profesionálny prekladateľ pre e-commerce. Prekladáš texty tak, aby zneli prirodzene a boli vhodné pre online predaj. Zachovávaj formátovanie (HTML tagy).`

	userPrompt := fmt.Sprintf(`Prelož nasledujúci text z %s do %s.
Kontext: %s

Text na preklad:
%s`, req.FromLang, req.ToLang, req.Context, req.Text)

	response, tokens, err := callAnthropic(systemPrompt, userPrompt)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Translation failed"})
	}

	saveAIGeneration(userID, uuid.Nil, "translate", userPrompt, response, tokens, "claude-sonnet-4-20250514")

	return c.JSON(fiber.Map{
		"translation": response,
		"tokens_used": tokens,
	})
}
