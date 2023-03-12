package repository

import (
	"github.com/google/uuid"
	"github.com/trucnt0/gomono/internal/domain"
	"gorm.io/gorm"
)

type userRepositoryImpl struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) domain.UserRepository {
	return &userRepositoryImpl{db}
}

func (repo *userRepositoryImpl) Create(user *domain.User) (*domain.User, error) {
	res := repo.DB.Create(user)
	return user, res.Error
}

func (repo *userRepositoryImpl) Update(id uuid.UUID, user *domain.User) error {
	var entity domain.User
	res := repo.DB.First(&entity)

	if res.Error != nil {
		return res.Error
	}

	entity.FirstName = user.FirstName
	entity.LastName = user.LastName
	entity.Email = user.Email

	//TODO: change username & password ?

	res = repo.DB.Save(&entity)

	return res.Error
}

func (repo *userRepositoryImpl) Delete(id uuid.UUID) error {
	res := repo.DB.Delete(&domain.User{}, id)
	return res.Error
}

func (repo *userRepositoryImpl) GetByID(id uuid.UUID) (*domain.User, error) {
	var entity *domain.User
	res := repo.DB.First(&entity, id)
	return entity, res.Error
}

func (repo *userRepositoryImpl) GetByUserName(userName string) (*domain.User, error) {
	var entity *domain.User
	res := repo.DB.Where("user_name = ?", userName).First(&entity)
	return entity, res.Error
}

func (repo *userRepositoryImpl) GetAll() ([]domain.User, error) {
	var entities []domain.User
	res := repo.DB.Find(&entities)
	return entities, res.Error
}
