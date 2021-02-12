import { GetServerSidePropsContext } from 'next';
import { AcceptConsentRequest, AcceptLoginRequest, AdminApi, Configuration, RejectRequest } from '@ory/hydra-client';
import { Session } from '@ory/kratos-client';
import getRawBody from 'raw-body';
import crypto from 'crypto';
import { config } from '../config';
import { kratosPublic } from '../kratos';

export * from './interfaces';

export const hydraAdmin = new AdminApi(new Configuration({
  basePath: config.hydra.admin,
  baseOptions: {
    withCredentials: true,
  },
}));

/**
 * Generate the Kratos self-service login url appending a custom return_to query param
 * @param baseReturnTo
 */
function loginUrl(baseReturnTo: string) {
  const state = crypto.randomBytes(48).toString('hex')
  const returnTo = new URL(baseReturnTo, config.self);
  returnTo.searchParams.set('hydra_login_state', state);
  const redirectTo = new URL('/self-service/login/browser', config.kratos.browser);
  // redirectTo.searchParams.set('refresh', 'true');
  redirectTo.searchParams.set('return_to', returnTo.toString());

  return redirectTo.toString();
}

/**
 * Create the Hydra session
 * @param requestedScope
 * @param context
 */
function createHydraSession(requestedScope: string[] = [], context: Session) {
  const verifiableAddresses = context.identity.verifiable_addresses || [];
  if (
    requestedScope.indexOf('email') === -1 ||
    verifiableAddresses.length === 0
  ) {
    return {}
  }

  return {
    id_token: {
      email: verifiableAddresses[0].value as Object,
    },
  }
}

/**
 * Since NextJs does not parse the POST body, we need to do it manually
 * @param context
 */
async function getBody(context: GetServerSidePropsContext) {
  const bodyString = await getRawBody(context.req);
  return new URLSearchParams(bodyString.toString('utf-8'));
}

export class Hydra {
  /**
   * Handle /oauth/login
   * Ensure a Hydra login_challenge is present (the request comes from Hydra)
   * Handle the request, accepting it if possible or redirecting to /auth/login if necessary
   * @param context
   */
  static login(context: GetServerSidePropsContext) {
    const req = context.req;
    const url = new URL(req.url, config.self);

    const hydraChallenge = url.searchParams.get('login_challenge');
    if (!hydraChallenge) {
      throw new Error('No challenge');
    }

    return hydraAdmin.getLoginRequest(hydraChallenge)
      .then(({ data }) => {
        if (data.skip) {
          const acceptLoginRequest: AcceptLoginRequest = {
            subject: data.subject.toString(),
          };
          return hydraAdmin.acceptLoginRequest(hydraChallenge, acceptLoginRequest)
            .then(({ data }) => data.redirect_to);
        }

        const loginState = url.searchParams.get('hydra_login_state');
        if (!loginState) {
          return loginUrl(req.url);
        }
        const kratosSessionCookie = req.cookies.ory_kratos_session;
        if (!kratosSessionCookie) {
          return loginUrl(req.url);
        }

        return kratosPublic.whoami(`ory_kratos_session=${kratosSessionCookie}`)
          .then(({ data }) => {
            const subject = data.id;
            const acceptLoginRequest: AcceptLoginRequest = {
              subject,
              context: data,
            }
            return hydraAdmin.acceptLoginRequest(hydraChallenge, acceptLoginRequest)
              .then(({ data }) => data.redirect_to);
          });
      })
      .catch(e => {
        console.log(e);
        throw e;
      });
  }

  /**
   * Handle /oauth/authorize
   * @param context
   */
  static consent(context: GetServerSidePropsContext) {
    if (context.req.method === 'POST') {
      return this.postConsent(context);
    }
    return this.getConsent(context);
  }

  /**
   * Handle GET request to /oauth/authorize
   * Ensure a Hydra consent_challenge is present (the request comes from Hydra)
   * Handle the request, accepting it if possible or showing the consent page
   * @param context
   * @private
   */
  private static async getConsent(context: GetServerSidePropsContext) {
    const req = context.req;
    const url = new URL(req.url, config.self);
    const challenge = url.searchParams.get('consent_challenge');
    if (!challenge) {
      throw new Error('Missing challenge');
    }

    return hydraAdmin.getConsentRequest(challenge)
      .then(({ data }): any => {
        if (data.skip || (data.client.metadata as any).firstParty) {
          const acceptConsentRequest: AcceptConsentRequest = {
            grant_scope: data.requested_scope,
            grant_access_token_audience: data.requested_access_token_audience,
            session: createHydraSession(data.requested_scope, data.context as Session),
          }
          return hydraAdmin.acceptConsentRequest(challenge, acceptConsentRequest)
            .then(({ data }) => data.redirect_to);
        }

        return {
          challenge,
          requestedScope: data.requested_scope,
          user: data.subject,
          client: data.client,
        }
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }

  /**
   * Handle POST request to /oauth/authorize
   * Reject or accept the request based on the User choice
   * @param context
   * @private
   */
  private static async postConsent(context: GetServerSidePropsContext) {
    const body = await getBody(context);
    const challenge = body.get('challenge');
    if (body.get('submit') !== 'allow') {
      const rejectConsentRequest: RejectRequest = {
        error: 'access_denied',
        error_description: 'The resource owner denied the request',
      };
      return hydraAdmin.rejectConsentRequest(challenge, rejectConsentRequest)
        .then(({ data }) => data.redirect_to);
    }

    const grantScope = body.getAll('grant_scope');

    return hydraAdmin.getConsentRequest(challenge)
      .then(({ data }) => {
        const acceptConsentRequest: AcceptConsentRequest = {
          grant_scope: grantScope,
          grant_access_token_audience: data.requested_access_token_audience,
          remember: !!body.get('remember'),
          remember_for: 3600,
          session: createHydraSession(data.requested_scope, data.context as Session),
        }
        return hydraAdmin.acceptConsentRequest(challenge, acceptConsentRequest)
          .then(({ data }) => data.redirect_to);
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }
}
