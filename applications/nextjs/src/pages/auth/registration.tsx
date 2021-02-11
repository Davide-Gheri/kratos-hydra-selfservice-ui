import { useEffect } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NextLink from 'next/link';
import { CardContent, CardHeader, Typography, Link } from '@material-ui/core';
import { FormMessages } from '../../components/form/messages';
import { Form } from '../../components/form/form';
import { OidcForm } from '../../components/form/oidc-form';
import { useAuth } from '../../contexts/auth.context';
import { GuestLayout } from '../../components/layout/guest';
import { Kratos, RegistrationProps } from '../../kratos';
import { asNextProps } from '../../helpers';

export default function Registration({ password: passwordForm, oidc: oidcForm, messages }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  return (
    <GuestLayout>
      <Head>
        <title>Register</title>
      </Head>
      <div>
        <CardHeader title="Registration"/>
        <CardContent>
          <FormMessages messages={messages}/>
          {passwordForm && <Form form={passwordForm} submitLabel="Register"/>}
          {oidcForm && <OidcForm form={oidcForm}/>}
          <Typography color="textSecondary">
            Already have an account?{' '}
            <NextLink href="/auth/login" passHref>
              <Link>Login</Link>
            </NextLink>
          </Typography>
        </CardContent>
      </div>
    </GuestLayout>
  )
}

export const getServerSideProps: GetServerSideProps<RegistrationProps> = async (context) =>
  asNextProps(await Kratos.registration(context));
