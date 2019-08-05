package models

import (
	"github.com/jinzhu/gorm"
)

type Post struct {
	gorm.Model
	Title       string    `json:"title"`
	Author      string    `json:"author"`
	Description string    `json:"description"`
	ImageSrc    string    `json:"imagesrc"`
	Comments    []Comment `json:"comments" gorm:"foreignkey:PostID;association_foreignkey:PostID"`
}

type Comment struct {
	gorm.Model
	PostID uint   `json:"postid"`
	Author string `json:"author"`
	Body   string `json:"body"`
}
