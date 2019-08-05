package db

import (
	"log"

	"github.com/golang_imageboard/models"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var (
	db  *gorm.DB
	err error
)

func Init() {
	db, err = gorm.Open("postgres", `
	user=gorm 
	password=gorm 
	dbname=gorm
	sslmode=disable
	`)
	if err != nil {
		log.Fatalln(err)
	}
	db.AutoMigrate(&models.Post{})
	db.AutoMigrate(&models.Comment{})
}

func GetDB() *gorm.DB {
	return db
}

func CloseDB() {
	db.Close()
}
