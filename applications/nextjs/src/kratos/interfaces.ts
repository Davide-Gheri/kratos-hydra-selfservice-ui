import {
  LoginFlow,
  LoginFlowMethodConfig, RecoveryFlow, RecoveryFlowMethodConfig,
  RegistrationFlow,
  RegistrationFlowMethodConfig, SettingsFlow, SettingsFlowMethodConfig,
  VerificationFlow, VerificationFlowMethodConfig
} from '@ory/kratos-client';

export interface LoginFlowWithMethod extends LoginFlow {
  password?: LoginFlowMethodConfig;
  oidc?: LoginFlowMethodConfig;
}

export interface RegistrationFlowWithMethod extends RegistrationFlow {
  password?: RegistrationFlowMethodConfig;
  oidc?: RegistrationFlowMethodConfig;
}

export interface VerificationFlowWithMethod extends VerificationFlow {
  link?: VerificationFlowMethodConfig;
}

export interface RecoveryFlowWithMethod extends RecoveryFlow {
  link?: RecoveryFlowMethodConfig;
}

export interface SettingsFlowWithMethod extends SettingsFlow {
  password?: SettingsFlowMethodConfig;
  profile?: SettingsFlowMethodConfig;
  oidc?: SettingsFlowMethodConfig;
}

export type LoginProps = LoginFlowWithMethod;
export type RegistrationProps = RegistrationFlowWithMethod;
export type VerificationProps = VerificationFlowWithMethod;
export type RecoveryProps = RecoveryFlowWithMethod;
export type SettingsProps = SettingsFlowWithMethod;
