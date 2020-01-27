# Golang_Imageboard
![](https://github.com/harumaxy/golang_imageboard/workflows/Docker%20Image%20CI/badge.svg)

Goで作成した画像掲示板

Live Demo<br>
https://storage.googleapis.com/imageboard-frontpage8821/index.html

## サーバーサイド

Go 言語

- WebFrameWork : [gin-gonic/gin](https://github.com/gin-gonic/gin)
- ORM : [jinzhu/gorm](https://github.com/jinzhu/gorm)

## フロントページ

TypeScript<br>
`create-react-app`のボイラープレートから作成

- React
- Axios
- Material-UI

## ユーザー認証

IDaaS の Auth0 を使用<br>
https://auth0.com/

サーバーサイドにセッション情報を保持せず、<br>
クライアント側に jwt を持たせることでユーザー認証する。

これにより、web サーバーをステートレス化し、スケーラビリティが向上する。

## インフラ

Google Cloud Platform を使用

- Google Cloud Storage
- Google Kubernetes Engine (GKE)
- Cloud DNS

## Infrastructure as Code

GKE クラスタのノードをプロビジョニングするのに`Terraform`<br>
コンテナの管理に`Kubernetes`を使用

## コンテナ

バックエンドサーバーに Docker コンテナを使用<br>
マルチステージビルドで、実行ファイルを alpine linux を使用して image 化することで<br>
省サイズの実行環境(約 12MB)

# CI/CD
Github Actionsによるビルドとデプロイ


