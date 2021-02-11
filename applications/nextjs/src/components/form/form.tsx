import React from 'react';
import { LoginFlowMethodConfig } from '@ory/kratos-client';
import { FormMessages } from './messages';
import { FormField } from './fields';
import { Button, makeStyles } from '@material-ui/core';

export interface FormProps {
  form: LoginFlowMethodConfig;
  submitLabel?: string;
}

const useStyles = makeStyles(theme => ({
  formContainer: {
    paddingBottom: theme.spacing(2),
  },
  field: {
    paddingBottom: theme.spacing(3),
  },
}));

export const Form: React.FC<FormProps> = ({ form, submitLabel = 'Submit' }) => {
  const classes = useStyles();
  return (
    <div className={classes.formContainer}>
      <FormMessages messages={form.messages}/>
      <form action={form.action} method={form.method}>
        {form.fields.map(field => <FormField key={field.name} field={field} className={classes.field}/>)}
        <Button color="primary" variant="contained" type="submit">{submitLabel}</Button>
      </form>
    </div>
  )
}
