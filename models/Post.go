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
	Comments    []Comment `json:"comments"`
}
