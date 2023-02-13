package utils

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/trucnt0/gomono/entities"
)

type CustomClaims struct {
	UserName string `json:"userName"`
	jwt.RegisteredClaims
}

func GenerateToken(user *entities.User) (toekn, refreshToken string) {
	tk := jwt.New(jwt.SigningMethodHS256)
	claims := tk.Claims.(jwt.MapClaims)
	claims["sub"] = user.ID
	claims["name"] = fmt.Sprintf("%s %s", user.FirstName, user.LastName)
	claims["email"] = user.Email
	claims["exp"] = time.Now().Add(time.Minute * 60).Unix()
	tokenString, err := tk.SignedString([]byte(Env.SecretKey))
	if err != nil {
		panic("Failed to generate token")
	}

	refreshTk := jwt.New(jwt.SigningMethodHS256)
	claims = refreshTk.Claims.(jwt.MapClaims)
	claims["sub"] = user.ID
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

	refreshTokenString, err := refreshTk.SignedString([]byte(Env.SecretKey))
	if err != nil {
		panic("Failed to generate refresh token")
	}

	return tokenString, refreshTokenString
}

func VerifyToken(ss string) bool {
	secret := []byte(Env.SecretKey)
	token, _ := jwt.Parse(ss, func(token *jwt.Token) (interface{}, error) {
		return secret, nil
	})
	return token.Valid
}
