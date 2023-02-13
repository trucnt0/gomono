package handlers

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/trucnt0/gomono/database"
	"github.com/trucnt0/gomono/entities"
	"github.com/trucnt0/gomono/utils"
	"golang.org/x/crypto/bcrypt"
)

type RegisterModel struct {
	UserName  string `json:"username"`
	Password  string `json:"password"`
	Email     string `json:"email"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

type LoginModel struct {
	UserName string `json:"username"`
	Password string `json:"password"`
}

type TokenModel struct {
	Token        string `json:"token"`
	RefreshToken string `json:"refreshToken"`
}

type RefreshTokenModel struct {
	RefreshToken string `json:"refreshToken"`
}

func Login(c *fiber.Ctx) error {
	login := new(LoginModel)
	if err := c.BodyParser(login); err != nil {
		return err
	}

	user := new(entities.User)
	database.Ctx.Where("user_name = ?", login.UserName).First(&user)

	if user == nil {
		return c.Status(http.StatusUnauthorized).SendString("Account does not exist.")
	}

	isPasswordMatched := checkPassword(login.Password, user.HashedPassword)
	if !isPasswordMatched {
		return c.Status(http.StatusUnauthorized).SendString("Password is invalid.")
	}

	token, refreshToken := utils.GenerateToken(user)

	return c.Status(http.StatusOK).JSON(&TokenModel{
		Token:        token,
		RefreshToken: refreshToken,
	})
}

func RegisterAccount(c *fiber.Ctx) error {
	acc := new(RegisterModel)
	if err := c.BodyParser(acc); err != nil {
		return err
	}

	hashedPassword, err := hashPassword(acc.Password)
	if err != nil {
		return err
	}

	user := &entities.User{
		FirstName:      acc.FirstName,
		LastName:       acc.LastName,
		Email:          acc.Email,
		UserName:       acc.UserName,
		HashedPassword: hashedPassword,
	}

	result := database.Ctx.Create(&user)

	if result.Error != nil {
		return result.Error
	}

	return c.Status(200).JSON(user)
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func checkPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
