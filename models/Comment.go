package models

import "github.com/jinzhu/gorm"

type Comment struct {
	gorm.Model
	PostID uint   `json:"postid"`
	Author string `json:"author"`
	Body   string `json:"body"`
}
