package auth

import (
	"errors"
	"time"

	"github.com/verasthiago/tickets-generator/shared/models"

	"github.com/dgrijalva/jwt-go"
)

type JWTClaim struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	ID       string `json:"id"`
	IsAdmin  bool   `json:"isadmin"`
	CPF      string `json:"cpf`
	jwt.StandardClaims
}

func GenerateJWT(user *models.User, jwtKey string, expirationTime time.Time) (string, error) {
	claims := &JWTClaim{
		Email:    user.Email,
		Username: user.Username,
		ID:       user.ID,
		IsAdmin:  user.IsAdmin,
		CPF:      user.CPF,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtKey))
}

func ValidateToken(signedToken, jwtKey string) error {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&JWTClaim{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtKey), nil
		},
	)

	if err != nil {
		return err
	}

	claims, ok := token.Claims.(*JWTClaim)
	if !ok {
		return errors.New("couldn't parse claims")
	}

	if claims.ExpiresAt < time.Now().Local().Unix() {
		return errors.New("token expired")
	}

	return nil
}

func GetJWTClaimFromToken(signedToken, jwtKey string) (*JWTClaim, error) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&JWTClaim{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtKey), nil
		},
	)
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(*JWTClaim)
	if !ok {
		return nil, errors.New("couldn't parse claims")
	}
	return claims, nil
}
