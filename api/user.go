package api

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/trucnt0/gomono/internal/usecase"
	"github.com/trucnt0/gomono/pkg/id"
	"github.com/trucnt0/gomono/pkg/jwt"
)

type createUserModel struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
}

type UserHanlder struct {
	usecase usecase.UserUseCase
}

func NewUserHandler(uu usecase.UserUseCase) *UserHanlder {
	return &UserHanlder{usecase: uu}
}

func (h *UserHanlder) Create(c *fiber.Ctx) error {
	newUser := new(createUserModel)
	if err := c.BodyParser(newUser); err != nil {
		return c.Status(http.StatusBadRequest).JSON(err)
	}

	res, err := h.usecase.CreateUser(&usecase.CreateLeadDTO{
		FirstName: newUser.FirstName,
		LastName:  newUser.LastName,
		Email:     newUser.Email,
	})

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(err)
	}

	return c.JSON(res)
}

func (h *UserHanlder) GetAll(c *fiber.Ctx) error {
	res, _ := h.usecase.GetAll()
	return c.JSON(res)
}

func (h *UserHanlder) Register(c *fiber.Ctx) error {
	acc := new(registerModel)
	if err := c.BodyParser(acc); err != nil {
		return err
	}

	res, err := h.usecase.CreateAccount(&usecase.CreateAccountDTO{
		FirstName: acc.FirstName,
		LastName:  acc.LastName,
		UserName:  acc.UserName,
		Email:     acc.Email,
		Password:  acc.Password,
	})

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(err)
	}

	return c.JSON(res)
}

func (h *UserHanlder) Login(c *fiber.Ctx) error {
	login := new(loginModel)
	if err := c.BodyParser(login); err != nil {
		return err
	}

	success, user, err := h.usecase.VerifyLogin(login.UserName, login.Password)

	if err != nil {
		return c.Status(http.StatusUnauthorized).JSON(err)
	}

	if !success {
		return c.Status(http.StatusUnauthorized).JSON("Invalid credentials")
	}

	token, refreshToken := jwt.GenerateToken(user)

	return c.Status(http.StatusOK).JSON(&tokenModel{
		Token:        token,
		RefreshToken: refreshToken,
	})
}

func (h *UserHanlder) Delete(c *fiber.Ctx) error {
	userId := id.FromString(c.Params("id"))
	err := h.usecase.Delete(userId)
	if err != nil {
		return c.SendStatus(http.StatusBadRequest)
	}
	return c.SendStatus(http.StatusOK)
}
