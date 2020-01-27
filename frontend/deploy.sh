gsutil rsync  -d -r build gs://imageboard-frontpage8821/
gsutil acl ch -r -u AllUsers:R gs://imageboard-frontpage8821/
