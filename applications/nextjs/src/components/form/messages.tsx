import React from 'react';
import { Message } from '@ory/kratos-client';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  messageContainer: {
    paddingBottom: theme.spacing(2),
  },
  message: {
    marginBottom: theme.spacing(2),
  },
}));

export const FormMessages: React.FC<{ messages?: Message[] }> = ({ messages }) => {
  const classes = useStyles();

  if (!messages?.length) {
    return null;
  }

  return (
    <div className={classes.messageContainer}>
      {messages.map(message => (
        <Alert key={message.id} severity={message.type as any || undefined} className={classes.message}>
          {message.text}
        </Alert>
      ))}
    </div>
  )
}
