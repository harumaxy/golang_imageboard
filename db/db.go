package db

import (
	"github.com/jinzhu/gorm"
)

var (
	db  *gorm.DB
	err error
)

func Init() {
	gorm.Open(`user= password= dbname= sslmode=`)
}
