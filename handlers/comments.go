package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/golang_imageboard/db"
	"github.com/golang_imageboard/models"
)

// Comment 型エイリアス
type Comment = models.Comment

// CommentController CRUDメソッドを集約するstruct
type CommentController struct{}

func (cc CommentController) Create() gin.HandlerFunc {
	return func(c *gin.Context) {
		var com Comment
		if err := c.BindJSON(&com); err != nil {
			handleError(c, err)
		}

		var p Post
		id := c.Param("id")
		db := db.GetDB()
		if err := db.First(&p, id).Error; err != nil {
			handleError(c, err)
			return
		}

		p.Comments = append(p.Comments, com)

		if err := db.Save(p).Error; err != nil {
			handleError(c, err)
			return
		}

		c.JSON(201, com)
	}
}

func (cc CommentController) List() gin.HandlerFunc {
	return func(c *gin.Context) {
		db := db.GetDB()
		id := c.Param("id")
		var p Post
		if err := db.First(&p, id).Error; err != nil {
			handleError(c, err)
			return
		}

		c.JSON(200, p.Comments)
		return
	}
}

func (cc CommentController) Update() gin.HandlerFunc {
	return func(c *gin.Context) {
		var newCom Comment
		var oldCom Comment
		db := db.GetDB()
		id := c.Param("id")
		commentID := c.Param("commentID")
		if err := db.Where("post_id = ?", id).First(&oldCom, commentID).Error; err != nil {
			handleError(c, err)
			return
		}
		if err := c.BindJSON(&newCom); err != nil {
			handleError(c, err)
			return
		}
		oldCom.Author = newCom.Author
		oldCom.Body = newCom.Body
		db.Save(&oldCom)

		c.JSON(200, oldCom)

	}
}

func (cc CommentController) Delete() gin.HandlerFunc {
	return func(c *gin.Context) {
		var com Comment
		db := db.GetDB()
		id := c.Param("id")
		commentID := c.Param("commentID")
		if err := db.Where("post_id = ?", id).First(&com, commentID).Error; err != nil {
			handleError(c, err)
			return
		}
		db.Delete(com)
		c.JSON(204, gin.H{
			"message": "deleted",
		})
	}
}
