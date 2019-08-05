package models

import "github.com/jinzhu/gorm"

type Comment struct {
	gorm.Model
	Author string `json:"author"`
	Body   string `json:"body"`
}
