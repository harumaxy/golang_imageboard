package main

import (
	"golang_imageboard/db"
	"golang_imageboard/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.Use(cors.Default())

	posts := r.Group("/posts")
	{
		pc := handlers.PostController{}
		posts.GET("", pc.List())
		posts.POST("", pc.Create())
		posts.GET("/:id", pc.Read())
		posts.PUT("/:id", pc.Update())
		posts.DELETE("/:id", pc.Delete())
	}
	comments := r.Group("posts/:id/comments")
	{
		cc := handlers.CommentController{}
		comments.GET("", cc.List())
		comments.POST("", cc.Create())
		comments.PUT("/:commentID", cc.Update())
		comments.DELETE("/:commentID", cc.Delete())
	}
	r.Static("/images", "./images")
	db.Init()
	defer db.CloseDB()
	r.Run(":8080")
}
