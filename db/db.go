package db

import (
	"fmt"
	"log"

	"golang_imageboard/models"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/kelseyhightower/envconfig"
)

var (
	db  *gorm.DB
	err error
)

type PostgresEnv struct {
	Postgres_user     string `default:"gorm"`
	Postgres_password string `default:"gorm"`
	Postgres_dbname   string `default:"gorm"`
	Postgres_host     string `default:"localhost"`
}

func Init() {
	var pgenv PostgresEnv
	envconfig.Process("", &pgenv)

	db, err = gorm.Open("postgres",
		fmt.Sprintf(`
			user=%s 
			password=%s 
			dbname=%s
			host=%s
			sslmode=disable
	`, pgenv.Postgres_user, pgenv.Postgres_password, pgenv.Postgres_dbname, pgenv.Postgres_host))
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
