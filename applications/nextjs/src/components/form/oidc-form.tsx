import React, { useMemo } from 'react';
import { LoginFlowMethodConfig, FormField as KFormField } from '@ory/kratos-client';
import { Button, makeStyles } from '@material-ui/core';
import { FormMessages } from './messages';
import { FormField } from './fields';

export interface OidcFormProps {
  form: LoginFlowMethodConfig;
}

const useStyles = makeStyles(theme => ({
  buttonContainer: {
    paddingBottom: theme.spacing(3),
  },
}));

export const OidcForm: React.FC<OidcFormProps> = ({ form }) => {
  const classes = useStyles();
  const { formFields, providers } = useMemo<{ formFields: KFormField[]; providers: KFormField[] }>(() => {
    return form.fields.reduce((acc, field) => {
      if (['provider'].includes(field.name)) {
        acc.providers.push(field);
      } else if (field.name !== 'link') {
        acc.formFields.push(field);
      }
      return acc;
    }, { formFields: [], providers: [] });
  }, [form]);

  return (
    <div>
      <FormMessages messages={form.messages}/>
      <form action={form.action} method={form.method}>
        {formFields.map(field => <FormField key={field.name} field={field}/>)}
        {providers.map(provider => (
          <div key={provider.value.toString()} className={classes.buttonContainer}>
            <Button
              type={provider.type as any}
              name={provider.name}
              value={provider.value.toString()}
              variant="contained"
            >
              Login with {provider.value}
            </Button>
          </div>
        ))}
      </form>
    </div>
  )
}
