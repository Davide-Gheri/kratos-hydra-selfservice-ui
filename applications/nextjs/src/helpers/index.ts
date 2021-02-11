import { LoginFlow, RecoveryFlow, RegistrationFlow, SettingsFlow, VerificationFlow } from '@ory/kratos-client';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { config } from '../config';
import { AxiosError } from 'axios';

export type FlowName = 'login' | 'registration' | 'verification' | 'recovery' | 'settings';

/**
 * Get the flow method
 * @param flow
 * @param key
 */
export function methodConfig (
  flow:
    | LoginFlow
    | RegistrationFlow
    | RecoveryFlow
    | SettingsFlow
    | VerificationFlow,
  key: string,
) {
  if (flow.active && flow.active !== key) {
    // The flow has an active method but it is not the one we're looking at -> return empty
    return null;
  }

  if (!flow.methods[key]) {
    // The flow method is apparently not configured -> return empty
    return null;
  }

  return flow.methods[key].config;
}

/**
 * Check if NextJs context has the flow query parameter
 * if not, return the self-service url to the requested flow
 * @param context
 * @param flowName
 */
export function contextHasFlow(context: GetServerSidePropsContext, flowName: FlowName) {
  const req = context.req;
  const url = new URL(req.url, config.kratos.browser);

  if (!url.searchParams.has('flow')) {
    return new URL(`/self-service/${flowName}/browser`, config.kratos.browser);
  }
  return url.searchParams.get('flow');
}

/**
 * If the NextJs context does not have the flow query parameter, return the requested flow url
 * Else, return the passed callback
 * @param context
 * @param flowName
 * @param cb
 */
export function flowOrCallback<P>(context: GetServerSidePropsContext, flowName: FlowName, cb: (flowId: string) => Promise<P>) {
  const flowOrReturnUrl = contextHasFlow(context, flowName);
  if (flowOrReturnUrl instanceof URL) {
    return flowOrReturnUrl.toString();
  }
  return cb(flowOrReturnUrl);
}

export function isAxiosError(error: Error | AxiosError): error is AxiosError {
  return 'isAxiosError' in error && !!error.isAxiosError;
}

/**
 * Handle Kratos error
 * If it is an AxiosError and is 403,404 or 410, return the requested flow url
 * @param flowName
 */
export function handleSoftError(flowName: FlowName) {
  return (error: Error | AxiosError) => {
    if (
      isAxiosError(error)
      && [403, 404, 410].includes(error.response.status)
    ) {
      return new URL(`/self-service/${flowName}/browser`, config.kratos.browser).toString();
    }
    throw error;
  }
}

/**
 * Convert the passed data to NextJs GetServerSideProps return type
 * @param dataOrReturnUrl
 */
export function asNextProps<P>(dataOrReturnUrl: string | P): GetServerSidePropsResult<P> {
  if (typeof dataOrReturnUrl === 'string') {
    return {
      redirect: {
        statusCode: 302,
        destination: dataOrReturnUrl,
      }
    }
  }

  return {
    props: dataOrReturnUrl,
  }
}
