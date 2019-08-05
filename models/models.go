package models

import (
	"github.com/jinzhu/gorm"
)

type Post struct {
	gorm.Model
	Title       string    `json:"title"`
	Author      string    `json:"author"`
	Description string    `json:"description"`
	ImageSrc    string    `json:"image_src"`
	Comments    []Comment `json:"comments" gorm:"foreignkey:PostID"`
}

type Comment struct {
	gorm.Model
	PostID uint   `json:"post_id"`
	Author string `json:"author"`
	Body   string `json:"body"`
}
