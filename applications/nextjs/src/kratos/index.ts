import { PublicApi, Configuration, AdminApi } from '@ory/kratos-client';
import { config } from '../config';
import { GetServerSidePropsContext } from 'next';
import { flowOrCallback, methodConfig, handleSoftError } from '../helpers';

export * from './interfaces';

export const kratosPublic = new PublicApi(new Configuration({
  basePath: config.kratos.public,
  baseOptions: {
    withCredentials: true,
  },
}));

export const kratosAdmin = new AdminApi(new Configuration({
  basePath: config.kratos.admin,
  baseOptions: {
    withCredentials: true,
  },
}));

export class Kratos {
  /**
   * Handle /auth/login
   * Ensure a Kratos flow is present, else, redirect to Kratos self-service login browser url
   * Return the required payload to render the Login form
   * @param context
   */
  static login(context: GetServerSidePropsContext) {
    return flowOrCallback(context, 'login', flowId =>
      kratosPublic.getSelfServiceLoginFlow(flowId)
        .then(({ data }) => ({
          ...data,
          oidc: methodConfig(data, 'oidc'),
          password: methodConfig(data, 'password'),
        }))
        .catch(handleSoftError('login')),
    );
  }

  /**
   * Handle /auth/registration
   * Ensure a Kratos flow is present, else, redirect to Kratos self-service registration browser url
   * Return the required payload to render the Registration form
   * @param context
   */
  static registration(context: GetServerSidePropsContext) {
    return flowOrCallback(context, 'registration', flowId =>
      kratosPublic.getSelfServiceRegistrationFlow(flowId)
        .then(({ data }) => ({
          ...data,
          oidc: methodConfig(data, 'oidc'),
          password: methodConfig(data, 'password'),
        }))
        .catch(handleSoftError('registration')),
    );
  }

  /**
   * Handle /auth/verify
   * Ensure a Kratos flow is present, else, redirect to Kratos self-service verification browser url
   * Return the required payload to render the Verification form
   * @param context
   */
  static verification(context: GetServerSidePropsContext) {
    return flowOrCallback(context, 'verification', flowId =>
      kratosPublic.getSelfServiceVerificationFlow(flowId)
        .then(({ data }) => ({
          ...data,
          link: methodConfig(data, 'link'),
        }))
        .catch(handleSoftError('verification')),
    );
  }

  /**
   * Handle /auth/recovery
   * Ensure a Kratos flow is present, else, redirect to Kratos self-service recovery browser url
   * Return the required payload to render the Recovery form
   * @param context
   */
  static recovery(context: GetServerSidePropsContext) {
    return flowOrCallback(context, 'recovery', flowId =>
      kratosPublic.getSelfServiceRecoveryFlow(flowId)
        .then(({ data }) => ({
          ...data,
          link: methodConfig(data, 'link'),
        }))
        .catch(handleSoftError('recovery')),
    );
  }

  /**
   * Handle /settings
   * Ensure a Kratos flow is present, else, redirect to Kratos self-service settings browser url
   * Return the required payload to render the Settings form
   * @param context
   */
  static settings(context: GetServerSidePropsContext) {
    return flowOrCallback(context, 'settings', flowId =>
      kratosAdmin.getSelfServiceSettingsFlow(flowId)
        .then(({ data }) => ({
          ...data,
          password: methodConfig(data, 'password'),
          profile: methodConfig(data, 'profile'),
          oidc: methodConfig(data, 'oidc'),
        }))
        .catch(handleSoftError('settings'))
    );
  }
}
