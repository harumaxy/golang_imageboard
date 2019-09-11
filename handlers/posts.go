package handlers

import (
	"context"
	"encoding/json"
	"golang_imageboard/db"
	"golang_imageboard/models"
	"io"
	"log"

	"cloud.google.com/go/storage"
	"github.com/gin-gonic/gin"
)

const imagePath = "./images"
const staticRoot = "http://localhost:8080/images/"
const bucketname = "images8821"

// Post 使いやすいようstructをrename
type Post = models.Post

// PostController CRUDメソッドを集約するstruct
type PostController struct{}

// Create クロージャーでPost作成のためのハンドラを返す
func (pc PostController) Create() gin.HandlerFunc {
	// Createリクエストは、投稿情報のjsonである"formData"と画像ファイル本体の"image"の2種類が
	// multipart/form-dataで送られてくるものとする
	return func(c *gin.Context) {

		// Todo : storageへのアップロード
		saveImageToBucketObject(c)

		_, header, _ := c.Request.FormFile("image")
		fileName := header.Filename
		// jsonパース + Post作成
		jsonStr := c.Request.FormValue("formData")
		var p Post
		json.Unmarshal([]byte(jsonStr), &p)
		// ImageSrcは、Staticルートから保存場所までのパス
		p.ImageSrc = staticRoot + fileName

		db := db.GetDB()
		if err := db.Save(&p).Error; err != nil {
			handleError(c, err)
			return
		}
		c.JSON(201, p)
	}
}

// Read 1件のPostを返す
func (pc PostController) Read() gin.HandlerFunc {
	return func(c *gin.Context) {
		var p Post
		id := c.Param("id")
		db := db.GetDB()

		if err := db.First(&p, id).Error; err != nil {
			handleError(c, err)
			return
		}
		var comments []Comment
		db.Model(&p).Related(&comments)
		p.Comments = comments
		c.JSON(200, p)
	}
}

// List 全件のPostをlistで返す
func (pc PostController) List() gin.HandlerFunc {
	return func(c *gin.Context) {
		var list []Post
		db := db.GetDB()

		if err := db.Find(&list).Error; err != nil {
			handleError(c, err)
			return
		}
		c.JSON(200, list)
	}
}

// Update タイトルと投稿者名と画像のurlを更新する
func (pc PostController) Update() gin.HandlerFunc {
	return func(c *gin.Context) {
		var newp Post
		if err := c.BindJSON(&newp); err != nil {
			handleError(c, err)
			return
		}

		var oldp Post
		db := db.GetDB()
		id := c.Param("id")
		if err := db.Find(&oldp, id).Error; err != nil {
			handleError(c, err)
			return
		}

		oldp.Title = newp.Title
		oldp.Description = newp.Description
		oldp.ImageSrc = newp.ImageSrc
		if err := db.Save(&oldp).Error; err != nil {
			handleError(c, err)
			return
		}
		c.JSON(200, oldp)
	}
}

// Delete 投稿を消す
func (pc PostController) Delete() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		db := db.GetDB()
		var p Post
		if err := db.First(&p, id).Error; err != nil {
			handleError(c, err)
			return
		}
		if err := db.Delete(&p).Error; err != nil {
			handleError(c, err)
			return
		}
		c.JSON(204, p)
	}
}

func handleError(c *gin.Context, err error) {
	c.JSON(500, gin.H{
		"message": err.Error(),
	})
}

func saveImageToBucketObject(c *gin.Context) {
	// リクエストから画像の取得
	image, header, _ := c.Request.FormFile("image")
	fileName := header.Filename

	// Cloud Storage クライアント作成
	ctx := context.Background()
	client, err := storage.NewClient(ctx)
	if err != nil {
		// handleError(c, err)
		return
	}
	// バケットオブジェクトを取得
	bkt := client.Bucket(bucketname)
	obj := bkt.Object(fileName)
	writer := obj.NewWriter(ctx)

	// コピー
	if _, err := io.Copy(writer, image); err != nil {
		log.Fatal("Cloud Strageへの保存が失敗")
	}
	if err := writer.Close(); err != nil {
		log.Fatal("バケットオブジェクトのWriteを閉じるのに失敗")
	}

}
