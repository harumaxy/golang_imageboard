# golang_imageboard
Golang API Server + React で作成した画像掲示板

Live Demo  
https://storage.googleapis.com/imageboard-frontpage8821/index.html


# プロジェクト構成

go v1.11 から導入されたGo moduleと、  
create-react-appで生成したwebpackプロジェクトのモノレポ構成です。

- フロントページ : React + Typescript + Material UI
- バックエンド : Golang + Docker


# 言語

- Typescript : 型安全なAltJs
- Go言語 : シンプルな構文 & 低依存で高速なシングルバイナリ実行ファイルを出力する

# コンセプト
クラウドネイティブな運用を意識しています。

画像&コメントの投稿を受け付けるサーバーはDockerを採用

- alpineを利用したミニマムな実行環境(12MB)
- ステートレスで並行性が高い
- 環境変数を利用した設定の注入により、再利用性と秘匿性を確保

また、ユーザー認証にIDaasのAuth0を利用しています。

# CI/CD
Github Actionsによるビルドとデプロイを利用する予定です。

![](https://github.com/harumaxy/golang_imageboard/workflows/Docker%20Image%20CI/badge.svg)


