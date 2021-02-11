import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import {
  Button,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
  Typography
} from '@material-ui/core';
import { useAuth } from '../../contexts/auth.context';
import { GuestLayout } from '../../components/layout/guest';
import { Hydra, ConsentProps } from '../../hydra';
import { asNextProps } from '../../helpers';

const useStyles = makeStyles(theme => ({
  scopeContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(2),
  },
}));

export default function Authorize({ client, challenge, requestedScope }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { user } = useAuth();
  const classes = useStyles();

  return (
    <GuestLayout>
      <Head>
        <title>Authorize</title>
      </Head>
      <div>
        <CardHeader title="Authorize"/>
        <CardContent>
          <form method="POST">
            <Typography>
              Hi {user?.identity.traits.email}, Application {client.client_name || client.client_id} wants to access resources on your behalf and to:
            </Typography>

            <input name="challenge" type="hidden" value={challenge} />

            <Paper className={classes.scopeContainer}>
              <List dense disablePadding>
                {requestedScope.map(scope => (
                  <ListItem key={scope} dense divider>
                    <ListItemText primary={scope}/>
                    <input type="hidden" name="grant_scope" id={scope} value={scope}/>
                  </ListItem>
                ))}
              </List>
            </Paper>

            <FormControlLabel
              control={<Checkbox name="remember" value="1"/>}
              label="Remember me"
            />

            <div className={classes.buttonsContainer}>
              <Button type="submit" value="allow" name="submit">
                Deny
              </Button>
              <Button type="submit" value="allow" name="submit" variant="contained" color="primary">
                Allow
              </Button>
            </div>
          </form>
        </CardContent>
      </div>
    </GuestLayout>
  )
}

export const getServerSideProps: GetServerSideProps<ConsentProps> = async context =>
  asNextProps(await Hydra.consent(context));
