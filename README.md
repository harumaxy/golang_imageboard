# golang_imageboard
Golang API Server + React で作成した画像掲示板


# プロジェクト構成

フロントページ : React + Typescript + Material UI
バックエンド : Golang + Docker

# コンセプト
クラウドネイティブな構成を意識しています。

画像&コメントの投稿を受け付けるサーバーはDockerコンテナを採用
- ステートレスで並行性が高い
- 環境変数を利用した設定の注入による、再利用性と秘匿性を確保


# CI/CD
Github Actionsによるビルドとデプロイを利用する予定です。

![](https://github.com/harumaxy/golang_imageboard/workflows/Docker%20Image%20CI/badge.svg)
