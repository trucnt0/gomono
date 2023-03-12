package usecase

import (
	"fmt"

	"github.com/go-playground/validator"
	"github.com/google/uuid"
	"github.com/samber/lo"
	"github.com/trucnt0/gomono/internal/domain"
	"golang.org/x/crypto/bcrypt"
)

var validate validator.Validate

type UserDTO struct {
	ID        uuid.UUID `json:"id"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	FullName  string    `json:"fullName"`
	Email     string    `json:"email"`
}

type CreateAccountDTO struct {
	FirstName string `json:"firstName" validate:"required"`
	LastName  string `json:"lastName" validate:"required"`
	UserName  string `json:"userName" validate:"required"`
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required,gte=8"`
}

type CreateLeadDTO struct {
	FirstName string `json:"firstName" validate:"required"`
	LastName  string `json:"lastName" validate:"required"`
	Email     string `json:"email" validate:"required,email"`
}

type UserUseCase interface {
	CreateAccount(dto *CreateAccountDTO) (*UserDTO, error)
	CreateUser(dto *CreateLeadDTO) (*UserDTO, error)
	GetAll() ([]UserDTO, error)
	VerifyLogin(userName, password string) (bool, *domain.User, error)
	Delete(id uuid.UUID) error
}

type userUseCaseImpl struct {
	userRepo domain.UserRepository
}

func NewUserUseCase(userRepo domain.UserRepository) UserUseCase {
	return &userUseCaseImpl{
		userRepo: userRepo,
	}
}

func (u *userUseCaseImpl) CreateAccount(dto *CreateAccountDTO) (*UserDTO, error) {

	// Validation
	errs := validate.Struct(&dto)
	if errs != nil {
		for _, err := range errs.(validator.ValidationErrors) {
			//TODO:
			fmt.Println(err.Namespace())
			fmt.Println(err.Field())
			fmt.Println(err.StructNamespace())
			fmt.Println(err.StructField())
			fmt.Println(err.Tag())
			fmt.Println(err.ActualTag())
			fmt.Println(err.Kind())
			fmt.Println(err.Type())
			fmt.Println(err.Value())
			fmt.Println(err.Param())
			fmt.Println()
		}
		return nil, errs
	}

	hashedPassword, err := hashPassword(dto.Password)

	if err != nil {
		return nil, err
	}

	user := &domain.User{
		FirstName:      dto.FirstName,
		LastName:       dto.LastName,
		Email:          dto.Email,
		UserName:       dto.UserName,
		HashedPassword: hashedPassword,
	}
	u.userRepo.Create(user)

	return &UserDTO{ID: user.ID}, nil
}

func (u *userUseCaseImpl) CreateUser(dto *CreateLeadDTO) (*UserDTO, error) {
	errs := validate.Struct(&dto)
	if errs != nil {
		return nil, errs
	}

	user := &domain.User{
		FirstName: dto.FirstName,
		LastName:  dto.LastName,
		Email:     dto.Email,
	}
	u.userRepo.Create(user)
	return &UserDTO{ID: user.ID}, nil
}

func (u *userUseCaseImpl) GetAll() ([]UserDTO, error) {
	users, _ := u.userRepo.GetAll()
	res := lo.Map(users, func(user domain.User, index int) UserDTO {
		return UserDTO{
			ID:        user.ID,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			FullName:  user.GetFullName(),
			Email:     user.Email,
		}
	})
	return res, nil
}

func (u *userUseCaseImpl) VerifyLogin(userName, password string) (bool, *domain.User, error) {
	user, err := u.userRepo.GetByUserName(userName)
	if err != nil {
		return false, nil, err
	}

	isMatched := checkPassword(password, user.HashedPassword)
	return isMatched, user, nil
}

func (u *userUseCaseImpl) Delete(id uuid.UUID) error {
	res := u.userRepo.Delete(id)
	return res
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func checkPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
