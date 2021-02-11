import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { CardContent, CardHeader, makeStyles, Paper, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { FormMessages } from '../components/form/messages';
import { Form } from '../components/form/form';
import { AuthenticatedLayout } from '../components/layout/authenticated';
import { Kratos, SettingsProps } from '../kratos';
import { asNextProps } from '../helpers';

const useStyles = makeStyles(theme => ({
  settingsTitle: {
    paddingBottom: theme.spacing(2),
  },
  settingsPaper: {
    marginBottom: theme.spacing(2),
  },
}))

export default function Settings({ messages, password, profile, state }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const classes = useStyles();

  return (
    <AuthenticatedLayout>
      <Head>
        <title>Settings</title>
      </Head>
      <main>
        <Typography variant="h5" className={classes.settingsTitle}>Settings</Typography>
        <div className={classes.settingsPaper}>
          <FormMessages messages={messages}/>
          {state === 'success' && (
            <Alert severity="success">Settings saved</Alert>
          )}
        </div>
        <Paper className={classes.settingsPaper}>
          <CardHeader title="Profile" titleTypographyProps={{ variant: 'h6' }}/>
          <CardContent>
            {profile && <Form form={profile} submitLabel="Save"/>}
          </CardContent>
        </Paper>
        <Paper className={classes.settingsPaper}>
          <CardHeader title="Change password" titleTypographyProps={{ variant: 'h6' }}/>
          <CardContent>
            {password && <Form form={password} submitLabel="Save"/> }
          </CardContent>
        </Paper>
      </main>
    </AuthenticatedLayout>
  )
}

export const getServerSideProps: GetServerSideProps<SettingsProps> =async context =>
  asNextProps(await Kratos.settings(context));
