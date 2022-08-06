import { get } from 'lodash-es';
import { useFormContext } from 'react-hook-form';
import React from 'react';

export type ErrorMessageProps = {
  name: string | string[];
  className?: string;
};

export const ErrorMessage = ({ name }: ErrorMessageProps) => {
  const {
    formState: { errors },
  } = useFormContext();

  let errorMessage;
  for (const _name of [name].flat()) {
    errorMessage = get(errors, _name)?.message;
    if (errorMessage) break;
  }

  return <>{errorMessage}</>;
};
