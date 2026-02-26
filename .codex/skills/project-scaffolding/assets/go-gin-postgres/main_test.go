package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHealth(t *testing.T) {
	router := buildRouter()
	req, _ := http.NewRequest(http.MethodGet, "/health", nil)
	res := httptest.NewRecorder()
	router.ServeHTTP(res, req)
	if res.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", res.Code)
	}
}

func TestAuthFlow(t *testing.T) {
	users = map[string]User{}
	usersByID = map[int]User{}
	refreshTokenStore = map[string]int{}
	payments = []Payment{}
	messages = []Message{}
	userSeq = 0
	paymentSeq = 0
	messageSeq = 0

	router := buildRouter()

	registerPayload := []byte(`{"email":"test@example.com","password":"strongpass123","name":"Test"}`)
	registerReq, _ := http.NewRequest(http.MethodPost, "/auth/register", bytes.NewBuffer(registerPayload))
	registerReq.Header.Set("Content-Type", "application/json")
	registerRes := httptest.NewRecorder()
	router.ServeHTTP(registerRes, registerReq)
	if registerRes.Code != http.StatusCreated {
		t.Fatalf("expected register 201, got %d", registerRes.Code)
	}

	loginPayload := []byte(`{"email":"test@example.com","password":"strongpass123"}`)
	loginReq, _ := http.NewRequest(http.MethodPost, "/auth/login", bytes.NewBuffer(loginPayload))
	loginReq.Header.Set("Content-Type", "application/json")
	loginRes := httptest.NewRecorder()
	router.ServeHTTP(loginRes, loginReq)
	if loginRes.Code != http.StatusOK {
		t.Fatalf("expected login 200, got %d", loginRes.Code)
	}

	var loginBody map[string]any
	if err := json.Unmarshal(loginRes.Body.Bytes(), &loginBody); err != nil {
		t.Fatalf("invalid login response: %v", err)
	}
	refreshToken, ok := loginBody["refresh_token"].(string)
	if !ok || refreshToken == "" {
		t.Fatal("missing refresh_token in login response")
	}

	refreshPayload := []byte(`{"refresh_token":"` + refreshToken + `"}`)
	refreshReq, _ := http.NewRequest(http.MethodPost, "/auth/refresh", bytes.NewBuffer(refreshPayload))
	refreshReq.Header.Set("Content-Type", "application/json")
	refreshRes := httptest.NewRecorder()
	router.ServeHTTP(refreshRes, refreshReq)
	if refreshRes.Code != http.StatusOK {
		t.Fatalf("expected refresh 200, got %d", refreshRes.Code)
	}
}
