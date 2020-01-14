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