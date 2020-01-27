package auth

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"

	jwtmiddleware "github.com/auth0/go-jwt-middleware"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/kelseyhightower/envconfig"
)

type Jwks struct {
	Keys []JSONWebKeys `json:"keys"`
}

// Auth0の公開鍵のjsonオブジェクトの形式
type JSONWebKeys struct {
	Kty string   `json:"kty"`
	Kid string   `json:"kid"`
	Use string   `json:"use"`
	N   string   `json:"n"`
	E   string   `json:"e"`
	X5c []string `json:"x5c"`
}

type Auth0Env struct {
	AUTH0_CLIENT_ID string `default:""`
	AUTH0_DOMAIN    string `default:""`
}

var (
	globalJwtMiddleWare *jwtmiddleware.JWTMiddleware
	auth0env            Auth0Env
)

func NewAuthMiddleware() gin.HandlerFunc {
	envconfig.Process("", &auth0env)
	initMiddleware()
	return func(c *gin.Context) {
		// Get the client secret key
		err := globalJwtMiddleWare.CheckJWT(c.Writer, c.Request)
		if err != nil {
			// Token not found
			fmt.Println(err)
			c.Abort()
			c.Writer.WriteHeader(http.StatusUnauthorized)
			c.Writer.Write([]byte("Unauthorized"))
			return
		}
	}
}

func initMiddleware() {
	// jwt認証ミドルウェアを作成
	jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {

			// aud を検証
			aud := "https://golang-imageboard-8821.tk"
			checkAudience := token.Claims.(jwt.MapClaims).VerifyAudience(aud, false)
			if !checkAudience {
				return token, errors.New("Invalid audience.")
			}
			// iss を検証
			iss := auth0env.AUTH0_DOMAIN
			checkIss := token.Claims.(jwt.MapClaims).VerifyIssuer(iss, false)
			if !checkIss {
				return token, errors.New("Invalid issuer.")
			}

			cert, err := getPemCert(token)
			if err != nil {
				log.Fatalf("could not get cert: %+v", err)
			}

			result, _ := jwt.ParseRSAPublicKeyFromPEM([]byte(cert))
			return result, nil
		},
		SigningMethod: jwt.SigningMethodRS256,
	})

	// globalに使うミドルウェアを初期化
	globalJwtMiddleWare = jwtMiddleware

	// ... the rest of the code below this function doesn't change yet
}

// 公開鍵を取得する
func getPemCert(token *jwt.Token) (string, error) {
	cert := ""
	resp, err := http.Get(auth0env.AUTH0_DOMAIN + ".well-known/jwks.json")
	if err != nil {
		return cert, err
	}
	defer resp.Body.Close()

	var jwks = Jwks{}
	err = json.NewDecoder(resp.Body).Decode(&jwks)

	if err != nil {
		return cert, err
	}

	x5c := jwks.Keys[0].X5c
	for k, v := range x5c {
		if token.Header["kid"] == jwks.Keys[k].Kid {
			cert = "-----BEGIN CERTIFICATE-----\n" + v + "\n-----END CERTIFICATE-----"
		}
	}

	if cert == "" {
		return cert, errors.New("unable to find appropriate key.")
	}

	return cert, nil
}
