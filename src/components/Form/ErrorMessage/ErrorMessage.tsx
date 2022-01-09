import { get } from 'lodash';
import { useFormContext } from 'react-hook-form';
import React from 'react';

export type Props = {
  name: string | string[];
  className?: string;
};

export const ErrorMessage = ({ name }: Props) => {
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
