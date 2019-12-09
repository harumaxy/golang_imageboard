package main

import (
	"golang_imageboard/auth"
	"golang_imageboard/db"
	"golang_imageboard/handlers"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	env_load()

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	authMiddleware := auth.NewAuthMiddleware()

	posts := r.Group("/posts")
	{
		pc := handlers.PostController{}
		posts.GET("", pc.List())
		posts.POST("", authMiddleware, pc.Create())
		posts.GET("/:id", pc.Read())
		posts.PUT("/:id", authMiddleware, pc.Update())
		posts.DELETE("/:id", authMiddleware, pc.Delete())
	}
	comments := r.Group("posts/:id/comments")
	{
		cc := handlers.CommentController{}
		comments.GET("", cc.List())
		comments.POST("" /*, authMiddleware*/, cc.Create())
		comments.PUT("/:commentID", authMiddleware, cc.Update())
		comments.DELETE("/:commentID", authMiddleware, cc.Delete())
	}
	r.Static("/images", "./images")
	db.Init()
	defer db.CloseDB()
	r.Run(":8080")
}

func env_load() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}
