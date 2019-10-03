package auth

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"gopkg.in/yaml.v2"

	jwtmiddleware "github.com/auth0/go-jwt-middleware"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type Auth0Setting struct {
	AUTH0_CLIENT_ID string `yaml:"AUTH0_CLIENT_ID"`
	AUTH0_DOMAIN    string `yaml:"AUTH0_DOMAIN"`
}

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

var (
	globalJwtMiddleWare *jwtmiddleware.JWTMiddleware
	settings            Auth0Setting
)

// 公開鍵を取得する
func getPemCert(token *jwt.Token) (string, error) {
	cert := ""
	resp, err := http.Get(settings.AUTH0_DOMAIN + ".well-known/jwks.json")
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

func NewAuthMiddleware() gin.HandlerFunc {
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
	initSetting()
	// jwt認証ミドルウェアを作成
	jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {

			// aud を検証
			aud := settings.AUTH0_CLIENT_ID
			checkAudience := token.Claims.(jwt.MapClaims).VerifyAudience(aud, false)
			if !checkAudience {
				return token, errors.New("Invalid audience.")
			}
			// iss を検証
			iss := settings.AUTH0_DOMAIN
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

// YAMLファイルに書かれたドメイン情報を読み込む
func initSetting() {
	// Auth0のドメインやクライアントIDをグローバル変数のsettingに読み込む
	buf, err := ioutil.ReadFile("./setting.yml") // main.goからの相対パス
	if err != nil {
		panic(err)
	}
	err = yaml.Unmarshal(buf, &settings)
}
