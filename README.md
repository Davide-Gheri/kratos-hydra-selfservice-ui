
## Ory.sh Kratos and Hydra integration example

Selfservice UI using Next.js

This branch shows an example infrastructure orchestrated using docker-compose that uses Traefik as proxy and exposes the Kratos and Hydra UI to `http://id.kratos.com`

* Selfservice UI responds to `/`
* Kratos Public API responds to `/k/kratos`
* Hydra Public API responds to `/k/hydra`

An example Third party application runs on `http://client.kratos-app.com`

It should be possible to expose UI, Kratos and Hydra on separate sub-domains, but [Ory Kratos docs discourages it](https://www.ory.sh/kratos/docs/debug/csrf/#running-on-separate-sub-domains)

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

Edit your `/etc/hosts` to point the custom domains to localhost:
```
127.0.0.1 id.kratos.com
127.0.0.1 client.kratos-app.com
127.0.0.1 mail.kratos.com
```

Start Traefik, Kratos, Hydra, Mysql, PhpMyAdmin, Mailslurper, Selfservice UI and example Client application
```shell
$ ./start.sh
```

Navigate to `http://id.kratos.com` to view the Kratos Selfservice UI

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
     --callbacks http://client.kratos-app.com/callback
```

Navigate to `http://client.kratos-app.com` to view the Client application and perform the OAuth2 authorization flow with Hydra
