package api

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/trucnt0/gomono/internal/app"
	"github.com/trucnt0/gomono/pkg/id"
	"github.com/trucnt0/gomono/pkg/jwt"
)

type createUserModel struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
}

type loginModel struct {
	UserName string `json:"userName"`
	Password string `json:"password"`
}

type registerModel struct {
	createUserModel
	loginModel
}

type tokenModel struct {
	Token        string `json:"token"`
	RefreshToken string `json:"refreshToken"`
}

type UserHandler struct {
	app app.UserService
}

func NewUserHandler(uu app.UserService) *UserHandler {
	return &UserHandler{app: uu}
}

func (h *UserHandler) Create(c *fiber.Ctx) error {
	newUser := new(createUserModel)
	if err := c.BodyParser(newUser); err != nil {
		return c.Status(http.StatusBadRequest).JSON(err)
	}

	res, err := h.app.CreateUser(&app.CreateLeadDTO{
		FirstName: newUser.FirstName,
		LastName:  newUser.LastName,
		Email:     newUser.Email,
	})

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(err)
	}

	return c.JSON(res)
}

func (h *UserHandler) GetAll(c *fiber.Ctx) error {
	res, _ := h.app.GetAll()
	return c.JSON(res)
}

func (h *UserHandler) Register(c *fiber.Ctx) error {
	acc := new(registerModel)
	if err := c.BodyParser(acc); err != nil {
		return err
	}

	res, err := h.app.CreateAccount(&app.CreateAccountDTO{
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

func (h *UserHandler) Login(c *fiber.Ctx) error {
	login := new(loginModel)
	if err := c.BodyParser(login); err != nil {
		return err
	}

	success, user, err := h.app.VerifyLogin(login.UserName, login.Password)

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

func (h *UserHandler) Delete(c *fiber.Ctx) error {
	userId := id.FromString(c.Params("id"))
	err := h.app.Delete(userId)
	if err != nil {
		return c.SendStatus(http.StatusBadRequest)
	}
	return c.SendStatus(http.StatusOK)
}
