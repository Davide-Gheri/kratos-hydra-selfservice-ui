import { FC } from 'react';
import { AppBar, IconButton, Link, makeStyles, Toolbar, Tooltip } from '@material-ui/core';
import NextLink from 'next/link';
import { ExitToApp, Settings } from '@material-ui/icons';
import { config } from '../../config';

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
  },
  toolbarSpacer: theme.mixins.toolbar,
  main: {
    padding: theme.spacing(2),
  },
}));

export const AuthenticatedLayout: FC = ({ children }) => {
  const classes = useStyles();

  return (
    <>
      <AppBar>
        <Toolbar>
          <NextLink href="/" passHref>
            <Link color="inherit" variant="h5" className={classes.title}>
              Kratos Auth
            </Link>
          </NextLink>

          <NextLink href="/settings" passHref>
            <IconButton component="a" color="inherit">
              <Tooltip title="Settings">
                <Settings/>
              </Tooltip>
            </IconButton>
          </NextLink>

          <NextLink href={new URL('/k/kratos/self-service/browser/flows/logout', config.kratos.browser).toString()} passHref>
            <IconButton component="a" color="inherit">
              <Tooltip title="Logout">
                <ExitToApp/>
              </Tooltip>
            </IconButton>
          </NextLink>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbarSpacer}/>
      <main className={classes.main}>
        {children}
      </main>
    </>
  )
}
