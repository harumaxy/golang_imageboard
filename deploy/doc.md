# 参考


## Terraform
[TerraformによるGCP環境の管理](https://gist.github.com/MisaKondo/cb46b0ecd106e9c824a641b14954b8e1)
[Terraform で GKE を構築する - Qiita](https://qiita.com/takasp/items/8104c175232e74217cc3)
[TerraformのtfstateファイルをGCSで管理する - Qiita](https://qiita.com/kawakawaryuryu/items/58d8afbb21155c2e9572)
[Terafform入門 on GCP その１ - Qiita](https://qiita.com/yagince/items/c2ef99e770f559720eec)

## Kubernetes
[これでもかって言うくらいコピペでKubernetes(Google Kubernetes Engine)に環境変数の設定からRailsアプリケーションのmigrateも考慮したデプロイが動くコマンドを書いていく - Qiita](https://qiita.com/chimame/items/4ac6bdd948a995ca0adf)
[Kubernetes Secret - Qiita](https://qiita.com/propella/items/e6a6fd1f77a6e4417fda)


# VSCode : Terraform拡張機能
[feat: Terraform 0.12 support (was hcl2 support) · Issue #157 · mauve/vscode-terraform](https://github.com/mauve/vscode-terraform/issues/157)

実験的に language server protcolが利用できる

1. cmd + shift + P
2. Terraform : Enable/Disable Language Server


# kubectl

準備

ローカルシェルでkubectlを使う

```bash
gcloud components install kubectl
gcloud container clusters get-credentials --region asia-northeast1 <cluster-name>
```

# kubernetesで利用する環境変数

[Kubernetes Secret - Qiita](https://qiita.com/propella/items/e6a6fd1f77a6e4417fda)

.envファイルからコマンドで生成すると楽

`kubectl create secret generic my-secret --from-env-file=path/to/bar.env`

`my-secret` は KubernetesのConfig&Storageリソースの一種である `Secret` 名

下のような形で使う

```yaml
~~~
    spec:
      containers:
        - name: web-server
          image: harumaxy/golang_imageboard:latest
          ports:
            - containerPort: 8080
          env:
            - name: AUTH0_CLIENT_ID
              valueFrom:
                secretKeyRef:
                  name: my-secret           # Secret リソース名
                  key: AUTH0_CLIENT_ID      # Secretに登録されている変数
~~~
```

Secretに保存されている値全てを使って、envを構成することもできる(envFrom:)

```yaml
~~~
    spec:
      containers:
        - name: web-server
          image: harumaxy/golang_imageboard:latest
          ports:
            - containerPort: 8080
          env:
            - secretRef:
                name: my-secret  # Secret名
~~~
```

# Secretリソースの暗号化

`kubesec` を使う
`gcloud` コマンドと同じ認証情報を使うので、Secretや使ったキー、コマンドを丸上げしても
GCPアカウントで認証しなければ複合できないので安全

```bash
brew install kubesec

# 暗号化
kubesec encrypt -i secret.yml \
  --key=gcp:projects/thematic-bee-252602/locations/global/keyRings/sample-keyring/cryptoKeys/kubesec-key
  --cleartext

# 復号化
# KubernetesにSecretリソースを登録するには値がbase64 encodeされていなければならないので、
# そのまま登録するなら--cleartextはいらない
kubesec decryspt -i secret.yml --cleartext
```


# Ingress
[Kubernetes（GKE）でHTTPS通信する方法 - Qiita](https://qiita.com/kwbt/items/914b3ffab1e9b4e3c1a4)
[k8sのingressにsecret経由で証明書を設定する - Qiita](https://qiita.com/Sho2010@github/items/7069f3b5ce71edf4b9f9)
[kubernetesにingressを導入する方法 - Qiita](https://qiita.com/Hirata-Masato/items/8e6b4536b6f1b23c5270)


フロントエンドページをhttpsで配信する場合、バックエンドのAPIサーバーが
httpだと`Mixed Contents`になってしまい、エラーが出る。

LoadBalancerではなく、Ingressを使ってサービスの外部公開エンドポイントを作成することで、
https対応できる。

## Let's encrypt でssl証明書とキーを取得

[無料SSL入門「Let's Encrypt」とは？設定で挫折しない！使い方解説 | カゴヤのサーバー研究室](https://www.kagoya.jp/howto/webhomepage/lets-encrypt/)


Let's Encrypt = 無料で利用できるSSLサーバー証明書
アメリカの非営利団体ISRGにより2016年より提供されている。

SSL証明書の発行・インストール・更新を自動化したため、無料で提供できている

クライアントソフトの `certbot` を使って証明書を発行できる。

## certbot
Let's Encrypt クライアントCLI
[MacOS に CertBot を入れて Let's Encrypt 証明書を作ってみる - Corredor](http://neos21.hatenablog.com/entry/2019/03/11/080000)


```bash
brew install certbot
sudo certbot certonly --manual --domain <SSL認証したいドメイン.com>
```

## acme-challenge

終了すると、**長い文字列**と**長いアドレス**が表示される。
そこで一旦操作を止めて、`acme-challenge`を行って自分がそのドメインを持っていることを証明しなければならない。

アドレスにアクセスして、文字列をレスポンスとして受け取れるようにする。

```javascript
/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.helloWorld = (req, res) => {
  let message = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  res.status(200).send(message);
};
```
~~めんどくさいので、Google Cloud Functions で手っ取り早く作る~~
DNSレコードのCNAMEは、サブドメインでしか使えないのでCloud Functionsにリダイレクトできなかった。

仕方ないので、普通にCompute Engineでインスタンスを立てる

1. Compute Engin > dockerを使う > nginx
2. インスタンスにアクセス(ssh or ブラウザ) > `docker exec -it <コンテナ名> bash`
3. `/usr/share/nginx/html` 以下の `.well-known/acme-challenge` にファイルを設置する。

できたら、DNSのAレコードをGCEインスタンスに向ける。(終わったら消す)

`http://<ドメイン>/.well-known/acme-challenge/yyyyyyyyyyyyyyyyyyyyyyyyy`


### 完了したら
コンソール上に、ローカルにダウンロードされた `.pem` ファイルのパスが出る。

- `/etc/letsencrypt/live/ドメイン/fullchain.pem`
  - サーバ証明書 と 中間CA証明書 が結合された証明書ファイル

- `/etc/letsencrypt/live/ドメイン/privkey.pem`
  - priv = private
  - 秘密鍵ファイル

`/etc/letsencrypt/live` 配下のファイルはシンボリックリンクで、実態は `/etc/letsencrypt/archive/ドメイン` 以下にある。


# 証明書ファイルの中身を理解する

[RSA鍵、証明書のファイルフォーマットについて - Qiita](https://qiita.com/kunichiko/items/12cbccaadcbf41c72735)

`.pem` はエンコーディングを示す。(Privacy Enhanced Mail)
中身はテキストファイルとして開ける。ファイルの先頭が`-- BEGIN...` で始まっているのが特徴

- `.csr` : 証明書要求ファイル
- `.cer` : 証明書ファイル (certificate)
- `.key` : 鍵ファイル

これらの拡張子は便宜上で、中身はPEMとかDERだったりする(つまり、ただのテキストファイル)


## certbotの出力ファイル
必要なのは**証明書ファイル** と **鍵ファイル** だけだが、実態は4つのファイルがある

- fullchain : 2つの証明書を結合した **証明書ファイル**
  - cert.pem : サーバ証明書ファイル。Let's Encrypt(中間認証局)まで辿れる
  - chain.pem : 中間CA証明書。 母体のルート認証局であるIdenTrustまで辿れる。信頼性を理解できる。
  - 2つをcatでつなぐことで、信頼性を確認できる証明書になる
- privkey.pem
  - 公開鍵は秘密鍵から生成できるが、逆はできない
  - サーバーが秘密鍵を持つ、クライアントには公開鍵が配られる
  - 暗号化は誰でもできる、復号化はサーバーしかできない