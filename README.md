
## Ory.sh Kratos and Hydra integration example

Selfservice UI using Next.js

### Start

Setup environment variables
```shell
cp .env.example .env
```

Edit `.env` as preferred, available env variables:
* **SECRET**: Kratos and Hydra cookie secret
* **PAIRWISE_SALT**: Hydra pairwise salt
* **OIDC_ENABLED**: enable/disable Kratos oidc method
* **GITHUB_CLIENT_ID**: Github Kratos oidc, client id
* **GITHUB_CLIENT_SECRET**: Github Kratos oidc, client secret
* **GITLAB_CLIENT_ID**: Gitlab Kratos oidc, client id
* **GITLAB_CLIENT_SECRET**: Gitlab Kratos oidc, client secret

Start Kratos, Hydra, Mysql, PhpMyAdmin and Mailslurper
```shell
$ ./start.sh
```

Install UI dependencies
```shell
$ yarn install
```

Start Selfservice UI
```shell
$ cd applications/nextjs && yarn build && yarn start
```
Or start with the development server
```shell
$ cd applications/nextjs && yarn dev
```

Navigate to `http://127.0.0.1:4455` to view the Kratos Selfservice UI

### Test Hydra integration

Generate a client
```shell
 docker-compose exec hydra \
 hydra clients create \
     --endpoint http://127.0.0.1:4445 \
     --id next-client \
     --secret secret \
     --grant-types authorization_code,refresh_token \
     --response-types code,id_token \
     --scope openid,offline \
     --callbacks http://127.0.0.1:5550/callback
```

Start the client application
```shell
$ cd applications/client-app && yarn start
```

Navigate to `http://localhost:5550` to view the Client application and perform the OAuth2 authorization flow with Hydra and Kratos as identity management system

