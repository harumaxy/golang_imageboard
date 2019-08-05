package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/golang_imageboard/db"
	"github.com/golang_imageboard/models"
)

// Comment 型エイリアス
type Comment = models.Comment

// CommentController CRUDメソッドを集約するstruct
type CommentController struct{}

// Create Postに対してコメントを投稿
func (cc CommentController) Create() gin.HandlerFunc {
	return func(c *gin.Context) {
		var com Comment
		id := c.Param("id")
		if err := c.BindJSON(&com); err != nil {
			handleError(c, err)
			return
		}

		postID, err := strconv.Atoi(id)
		if err != nil {
			handleError(c, err)
			return
		}
		com.PostID = uint(postID)
		db := db.GetDB()
		if err := db.Save(&com).Error; err != nil {
			handleError(c, err)
			return
		}

		c.JSON(201, com)
	}
}

// List Comment一覧を取得
func (cc CommentController) List() gin.HandlerFunc {
	return func(c *gin.Context) {
		db := db.GetDB()
		id := c.Param("id")
		var p Post
		var comments []Comment
		if err := db.First(&p, id).Error; err != nil {
			handleError(c, err)
			return
		}
		if err := db.Model(&p).Related(&comments).Error; err != nil {
			handleError(c, err)
			return
		}

		c.JSON(200, comments)
		return
	}
}

// Update コメントを更新
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

// Delete コメントを削除
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
