import React from 'react';
import { FormField as KFormField } from '@ory/kratos-client';
import { TextField } from '@material-ui/core';

export interface FormFieldProps {
  field: KFormField;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ field, className }) => {
  const hasLabel = field.type !== 'hidden';
  const messages = field.messages || [];
  const hasError = messages.filter(message => message.type === 'error').length > 0;

  if (field.type === 'hidden') {
    return (
      <input
        type={field.type}
        defaultValue={field.value as any}
        name={field.name}
        disabled={field.disabled}
        required={field.required}
        pattern={field.pattern}
      />
    )
  }

  return (
    <div className={className}>
      <TextField
        type={field.type || 'text'}
        label={hasLabel && field.name}
        defaultValue={field.value}
        name={field.name}
        disabled={field.disabled}
        required={field.required}
        fullWidth
        variant="outlined"
        inputProps={{
          pattern: field.pattern,
        }}
        error={hasError}
        helperText={messages[0]?.text}
      />
    </div>
  )
}
