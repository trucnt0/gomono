package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/trucnt0/gomono/entities"
)

type CustomClaims struct {
	UserName string `json:"userName"`
	jwt.RegisteredClaims
}

func GenerateJwt(user *entities.User) (string, error) {
	claims := CustomClaims{
		user.UserName,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(5 * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "gomono",
			Audience:  []string{"client"},
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	var secret string = Env.SecretKey
	ss, err := token.SignedString([]byte(secret))

	return ss, err
}

func VerifyJwt(ss string) bool {
	secret := []byte(Env.SecretKey)
	token, _ := jwt.Parse(ss, func(token *jwt.Token) (interface{}, error) {
		return secret, nil
	})
	return token.Valid
}
