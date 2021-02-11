import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { CardContent, CardHeader } from '@material-ui/core';
import { FormMessages } from '../../components/form/messages';
import { Form } from '../../components/form/form';
import { GuestLayout } from '../../components/layout/guest';
import { Kratos, RecoveryProps } from '../../kratos';
import { asNextProps } from '../../helpers';

export default function Recovery({ link, messages }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <GuestLayout>
      <Head>
        <title>Recover your account</title>
      </Head>
      <div>
        <CardHeader title="Recover your account"/>
        <CardContent>
          <FormMessages messages={messages}/>
          {link && <Form form={link} submitLabel="Send recovery link"/>}
        </CardContent>
      </div>
    </GuestLayout>
  )
}

export const getServerSideProps: GetServerSideProps<RecoveryProps> = async context =>
  asNextProps(await Kratos.recovery(context));
