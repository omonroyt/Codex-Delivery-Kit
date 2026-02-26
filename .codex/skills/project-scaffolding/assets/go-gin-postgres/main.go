package main

import (
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID           int
	Email        string
	PasswordHash string
	Role         string
}

type Payment struct {
	ID       int    `json:"id"`
	UserID   int    `json:"user_id"`
	Amount   int    `json:"amount"`
	Currency string `json:"currency"`
	Provider string `json:"provider"`
	Status   string `json:"status"`
}

type Message struct {
	ID      int    `json:"id"`
	Sender  int    `json:"sender_id"`
	Channel string `json:"channel"`
	Payload string `json:"payload"`
	Status  string `json:"status"`
}

var (
	users             = map[string]User{}
	usersByID         = map[int]User{}
	refreshTokenStore = map[string]int{}
	payments          = []Payment{}
	messages          = []Message{}
	userSeq           = 0
	paymentSeq        = 0
	messageSeq        = 0
	jwtSecret         = "change-me-go-secret"
)

func hashToken(value string) string {
	hash := sha256.Sum256([]byte(value))
	return hex.EncodeToString(hash[:])
}

func signToken(userID int, role, tokenType string, duration time.Duration) (string, error) {
	claims := jwt.MapClaims{
		"sub":        userID,
		"role":       role,
		"token_type": tokenType,
		"exp":        time.Now().Add(duration).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecret))
}

func authMiddleware(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if len(authHeader) < 8 || authHeader[:7] != "Bearer " {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing_token"})
		return
	}

	tokenString := authHeader[7:]
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})
	if err != nil || !token.Valid {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid_token"})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid_claims"})
		return
	}

	if claims["token_type"] != "access" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid_token_type"})
		return
	}

	c.Set("user_id", int(claims["sub"].(float64)))
	c.Set("role", claims["role"].(string))
	c.Next()
}

func roleMiddleware(expected string) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleAny, exists := c.Get("role")
		if !exists || roleAny.(string) != expected {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		c.Next()
	}
}

func buildRouter() *gin.Engine {
	router := gin.Default()

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"service": "go-gin-postgres-api",
		})
	})

	router.POST("/auth/register", func(c *gin.Context) {
		var body struct {
			Email    string `json:"email"`
			Password string `json:"password"`
			Name     string `json:"name"`
		}
		if err := c.ShouldBindJSON(&body); err != nil || body.Email == "" || body.Password == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "email_and_password_required"})
			return
		}
		if _, exists := users[body.Email]; exists {
			c.JSON(http.StatusConflict, gin.H{"error": "email_already_exists"})
			return
		}
		hash, _ := bcrypt.GenerateFromPassword([]byte(body.Password), 10)
		userSeq++
		user := User{
			ID:           userSeq,
			Email:        body.Email,
			PasswordHash: string(hash),
			Role:         "user",
		}
		users[user.Email] = user
		usersByID[user.ID] = user
		c.JSON(http.StatusCreated, gin.H{"user": gin.H{"id": user.ID, "email": user.Email, "role": user.Role}})
	})

	router.POST("/auth/login", func(c *gin.Context) {
		var body struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_payload"})
			return
		}
		user, exists := users[body.Email]
		if !exists || bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(body.Password)) != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid_credentials"})
			return
		}
		accessToken, _ := signToken(user.ID, user.Role, "access", 15*time.Minute)
		refreshToken, _ := signToken(user.ID, user.Role, "refresh", 7*24*time.Hour)
		refreshTokenStore[hashToken(refreshToken)] = user.ID
		c.JSON(http.StatusOK, gin.H{
			"access_token":  accessToken,
			"refresh_token": refreshToken,
			"user":          gin.H{"id": user.ID, "email": user.Email, "role": user.Role},
		})
	})

	router.POST("/auth/refresh", func(c *gin.Context) {
		var body struct {
			RefreshToken string `json:"refresh_token"`
		}
		if err := c.ShouldBindJSON(&body); err != nil || body.RefreshToken == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "refresh_token_required"})
			return
		}
		token, err := jwt.Parse(body.RefreshToken, func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtSecret), nil
		})
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid_refresh_token"})
			return
		}
		claims := token.Claims.(jwt.MapClaims)
		if claims["token_type"] != "refresh" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid_token_type"})
			return
		}
		hash := hashToken(body.RefreshToken)
		userID, exists := refreshTokenStore[hash]
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "refresh_token_not_found"})
			return
		}
		role := claims["role"].(string)
		accessToken, _ := signToken(userID, role, "access", 15*time.Minute)
		c.JSON(http.StatusOK, gin.H{"access_token": accessToken})
	})

	auth := router.Group("/")
	auth.Use(authMiddleware)
	{
		auth.GET("/auth/me", func(c *gin.Context) {
			userID := c.MustGet("user_id").(int)
			user := usersByID[userID]
			c.JSON(http.StatusOK, gin.H{"user": gin.H{"id": user.ID, "email": user.Email, "role": user.Role}})
		})

		auth.POST("/payments/checkout", func(c *gin.Context) {
			var body struct {
				Amount   int    `json:"amount"`
				Currency string `json:"currency"`
				Provider string `json:"provider"`
			}
			if err := c.ShouldBindJSON(&body); err != nil || body.Amount <= 0 {
				c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_amount"})
				return
			}
			paymentSeq++
			payment := Payment{
				ID:       paymentSeq,
				UserID:   c.MustGet("user_id").(int),
				Amount:   body.Amount,
				Currency: body.Currency,
				Provider: body.Provider,
				Status:   "PENDING",
			}
			if payment.Currency == "" {
				payment.Currency = "USD"
			}
			if payment.Provider == "" {
				payment.Provider = "mock"
			}
			payments = append(payments, payment)
			c.JSON(http.StatusCreated, gin.H{
				"payment":     payment,
				"next_action": "connect_real_payment_provider",
			})
		})

		auth.POST("/messages/send", func(c *gin.Context) {
			var body struct {
				Payload string `json:"payload"`
				Channel string `json:"channel"`
			}
			if err := c.ShouldBindJSON(&body); err != nil || body.Payload == "" {
				c.JSON(http.StatusBadRequest, gin.H{"error": "payload_required"})
				return
			}
			messageSeq++
			message := Message{
				ID:      messageSeq,
				Sender:  c.MustGet("user_id").(int),
				Channel: body.Channel,
				Payload: body.Payload,
				Status:  "QUEUED",
			}
			if message.Channel == "" {
				message.Channel = "in_app"
			}
			messages = append(messages, message)
			c.JSON(http.StatusCreated, gin.H{
				"message":     message,
				"next_action": "connect_queue_or_provider",
			})
		})

		auth.GET("/admin/users", roleMiddleware("admin"), func(c *gin.Context) {
			all := make([]gin.H, 0, len(usersByID))
			for _, user := range usersByID {
				all = append(all, gin.H{"id": user.ID, "email": user.Email, "role": user.Role})
			}
			c.JSON(http.StatusOK, gin.H{"users": all})
		})
	}

	return router
}

func seedAdmin() {
	adminEmail := os.Getenv("SEED_ADMIN_EMAIL")
	if adminEmail == "" {
		adminEmail = "admin@example.com"
	}
	adminPassword := os.Getenv("SEED_ADMIN_PASSWORD")
	if adminPassword == "" {
		adminPassword = "admin123456"
	}
	if _, exists := users[adminEmail]; exists {
		return
	}
	hash, _ := bcrypt.GenerateFromPassword([]byte(adminPassword), 10)
	userSeq++
	admin := User{
		ID:           userSeq,
		Email:        adminEmail,
		PasswordHash: string(hash),
		Role:         "admin",
	}
	users[admin.Email] = admin
	usersByID[admin.ID] = admin
}

func main() {
	_ = godotenv.Load()
	if secret := os.Getenv("JWT_SECRET"); secret != "" {
		jwtSecret = secret
	}
	seedAdmin()

	port := 8080
	if value := os.Getenv("PORT"); value != "" {
		if parsed, err := strconv.Atoi(value); err == nil {
			port = parsed
		}
	}

	router := buildRouter()
	_ = router.Run(":" + strconv.Itoa(port))
}

