import Head from 'next/head';
import NextLink from 'next/link';
import { CardContent, CardHeader, Typography, Link } from '@material-ui/core';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Form } from '../../components/form/form';
import { FormMessages } from '../../components/form/messages';
import { OidcForm } from '../../components/form/oidc-form';
import { useAuth } from '../../contexts/auth.context';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { GuestLayout } from '../../components/layout/guest';
import { Kratos, LoginProps } from '../../kratos';
import { asNextProps } from '../../helpers';

export default function Login({ password: passwordForm, oidc: oidcForm, messages, returnTo }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  const registrationUrl = useMemo(() => {
    const urlParams = new URLSearchParams();
    returnTo && urlParams.set('return_to', returnTo);

    return `/auth/registration?${urlParams.toString()}`;
  }, [returnTo]);

  return (
    <GuestLayout>
      <Head>
        <title>Login</title>
      </Head>
      <div>
        <CardHeader title="Login"/>
        <CardContent>
          <FormMessages messages={messages}/>
          {passwordForm && <Form form={passwordForm} submitLabel="Login"/>}
          {oidcForm && <OidcForm form={oidcForm}/>}
          <Typography color="textSecondary">
            Forgot your password?:{' '}
            <NextLink href="/auth/recovery" passHref>
              <Link>Recover it</Link>
            </NextLink>
          </Typography>
          <Typography color="textSecondary">
            No account?{' '}
            <NextLink href={registrationUrl} passHref>
              <Link>Register</Link>
            </NextLink>
          </Typography>
        </CardContent>
      </div>
    </GuestLayout>
  )
}

export const getServerSideProps: GetServerSideProps<LoginProps> = async (context) =>
  asNextProps(await Kratos.login(context));
