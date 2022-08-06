import React from 'react';
import { useControllable } from 'hooks';
import { Children } from 'types';
import { RadioGroupProvider } from './RadioGroupProvider';

export type RadioGroupProps = Children & {
  onChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
};

export const RadioGroup = (props: RadioGroupProps) => {
  const { value: valueProp, onChange: onChangeProp, defaultValue, children } = props;
  const [value, setValue] = useControllable({ value: valueProp, onChange: onChangeProp, defaultValue });

  const handleChange = React.useCallback(
    (value: string) => {
      setValue?.(value);
      onChangeProp?.(value);
    },
    [onChangeProp, setValue]
  );

  const providerValue = React.useMemo(() => ({ handleChange, value, groupProps: props }), [handleChange, props, value]);

  return <RadioGroupProvider value={providerValue}>{children}</RadioGroupProvider>;
};
