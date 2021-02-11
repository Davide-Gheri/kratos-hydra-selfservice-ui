import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { CardContent, CardHeader } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Form } from '../../components/form/form';
import { FormMessages } from '../../components/form/messages';
import { GuestLayout } from '../../components/layout/guest';
import { Kratos, VerificationProps } from '../../kratos';
import { asNextProps } from '../../helpers';

export default function Verify({ link, state, messages }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <GuestLayout>
      <Head>
        <title>Verify your email</title>
      </Head>
      <div>
        <CardHeader title="Verify email"/>
        <CardContent>
          <FormMessages messages={messages}/>
          {state === 'passed_challenge' && (
            <Alert severity="success">Verification successful</Alert>
          )}
          {link && <Form form={link} submitLabel="Verify"/>}
        </CardContent>
      </div>
    </GuestLayout>
  )
}

export const getServerSideProps: GetServerSideProps<VerificationProps> = async context =>
  asNextProps(await Kratos.verification(context));
