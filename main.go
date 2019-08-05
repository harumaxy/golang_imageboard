package main

import (
	"github.com/gin-gonic/gin"
	"github.com/golang_imageboard/handlers"
)

func main() {
	r := gin.Default()
	posts := r.Group("/posts")
	{
		pc := handlers.PostController{}
		posts.GET("", pc.List())
		posts.POST("", pc.Create())
		posts.GET("/:id", pc.Read())
		posts.PUT("/:id", pc.Update())
		posts.DELETE("/:id", pc.Delete())
	}
	r.Run()
}
