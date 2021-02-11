import express from 'express';
import { AuthorizationCode } from 'simple-oauth2';

const clientId = 'next-client';
const clientSecret = 'secret';
const hydraUrl = 'http://127.0.0.1:4444';

const scope = 'openid offline';
const state = 'staticState';

const config = {
    client: {
        id: clientId,
        secret: clientSecret,
    },
    auth: {
        tokenHost: hydraUrl,
        tokenPath: '/oauth2/token',
        authorizeHost: hydraUrl,
        authorizePath: '/oauth2/auth',
    },
};

const oauth2Client = new AuthorizationCode(config);

const selfUrl = 'http://127.0.0.1:5550';
const redirectUri = new URL('/callback', selfUrl).toString();

const app = express();

app.get('/', (req, res) => {
    const url = oauth2Client.authorizeURL({
        redirect_uri: redirectUri,
        scope,
        state,
    });

    res.end(`<a href="${url}">Login with Hydra</a>`);
});

app.get('/callback', (req, res) => {
    oauth2Client.getToken({
        code: req.query.code,
        redirect_uri: redirectUri,
        scope,
    }).then(token => {
        res.json(token);
    }).catch(err => {
        console.log(err);
        res.json({ err: err.data ? err.data.payload : err.message });
    });
});

app.listen(5550, () => console.log('ready 5550'));
