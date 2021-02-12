import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AuthorizationNotifier,
  AuthorizationRequest, AuthorizationResponse,
  AuthorizationServiceConfiguration, BaseTokenRequestHandler, GRANT_TYPE_AUTHORIZATION_CODE,
  RedirectRequestHandler, TokenRequest, TokenResponse
} from '@openid/appauth';
import { config } from './config';

interface AppProps {}

function App({}: AppProps) {
  const [authConfig, setAuthConfig] = useState<AuthorizationServiceConfiguration | null>(null);
  const authHandler = useRef<RedirectRequestHandler>();
  const [codeResponse, setCodeResponse] = useState<[AuthorizationRequest, AuthorizationResponse] | null>(null);
  const [tokenResponse, setTokenResponse] = useState<TokenResponse | null>();

  useEffect(() => {
    if (codeResponse && authConfig) {
      const [req, res] = codeResponse;
      const extras = req.internal;
      const request = new TokenRequest({
        client_id: config.clientId,
        redirect_uri: req.redirectUri,
        grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
        code: res.code,
        refresh_token: undefined,
        extras: extras,
      });
      const tokenHandler = new BaseTokenRequestHandler();
      tokenHandler.performTokenRequest(authConfig, request)
        .then(data => {
          setTokenResponse(data);
        })
        .catch(console.log);
    }
  }, [codeResponse, authConfig]);

  useEffect(() => {
    AuthorizationServiceConfiguration.fetchFromIssuer(config.hydra.public)
      .then(conf => {
        setAuthConfig(conf);
      })
      .catch(console.log);

    const notifier = new AuthorizationNotifier();
    authHandler.current = new RedirectRequestHandler();
    authHandler.current.setAuthorizationNotifier(notifier);
    notifier.setAuthorizationListener((request, response, error) => {
      if (response) {
        setCodeResponse([request, response]);
      }
    });

    authHandler.current.completeAuthorizationRequestIfPossible();
  }, []);

  const hydraLogin = useCallback(() => {
    if (authHandler.current && authConfig) {
      const request = new AuthorizationRequest({
        client_id: config.clientId,
        redirect_uri: window.location.origin + '/callback',
        scope: 'openid offline',
        response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
        state: '1234567890',
        extras: {response_mode: 'fragment'},
      });

      authHandler.current?.performAuthorizationRequest(authConfig, request);
    }
  }, [authConfig]);

  return (
    <div className="App">
      {!codeResponse && <button onClick={hydraLogin}>Login with Hydra</button>}
      {tokenResponse && (
        <div>
          <code>
            <pre>
              {JSON.stringify(tokenResponse, null, 2)}
            </pre>
          </code>
        </div>
      )}
    </div>
  );
}

export default App;
