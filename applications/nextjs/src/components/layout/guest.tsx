import { FC } from 'react';
import { makeStyles, Paper } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
  },
  paper: {
    maxWidth: '500px',
    width: '80%',
  }
}));

export const GuestLayout: FC = ({ children }) => {
  const classes = useStyles();

  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        {children}
      </Paper>
    </main>
  )
}
