package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/golang_imageboard/db"
	"github.com/golang_imageboard/models"
)

// Post 使いやすいようstructをrename
type Post models.Post

// PostController CRUDメソッドを集約するstruct
type PostController struct{}

func (pc PostController) Create() gin.HandlerFunc {
	return func(c *gin.Context) {
		var p Post
		if err := c.BindJSON(&p); err != nil {
			handleError(c, err)
		}

		db := db.GetDB()
		if err := db.Save(&p).Error; err != nil {
			handleError(c, err)
		}
		c.JSON(201, p)
	}
}

func (pc PostController) Read() gin.HandlerFunc {
	return func(c *gin.Context) {
		var p Post
		id := c.Param("id")
		db := db.GetDB()

		if err := db.First(&p, id).Error; err != nil {
			handleError(c, err)
		}
		c.JSON(200, p)
	}
}

func (pc PostController) List() gin.HandlerFunc {
	return func(c *gin.Context) {
		var list []Post
		db := db.GetDB()

		if err := db.Find(&list).Error; err != nil {
			handleError(c, err)
		}
		c.JSON(200, list)
	}
}

func (pc PostController) Update() gin.HandlerFunc {
	return func(c *gin.Context) {
		var newp Post
		if err := c.BindJSON(&newp); err != nil {
			handleError(c, err)
		}

		var oldp Post
		db := db.GetDB()
		id := c.Param("id")
		if err := db.Find(&oldp, id).Error; err != nil {
			handleError(c, err)
		}

		oldp.Title = newp.Title
		oldp.Description = newp.Description
		oldp.ImageSrc = newp.ImageSrc
		if err := db.Save(&oldp).Error; err != nil {
			handleError(c, err)
		}
		c.JSON(200, oldp)
	}
}

func (pc PostController) Delete() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		db := db.GetDB()
		var p Post
		if err := db.First(&p, id).Error; err != nil {
			handleError(c, err)
		}
		if err := db.Delete(&p).Error; err != nil {
			handleError(c, err)
		}
		c.JSON(204, p)
	}
}

func handleError(c *gin.Context, err error) {
	c.JSON(500, gin.H{
		"message": err.Error(),
	})
}
