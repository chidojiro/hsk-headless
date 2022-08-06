import { noop } from 'lodash-es';
import React from 'react';
import { useControllable } from 'hooks';
import { Children } from 'types';
import { Option } from './Option';

export type Props = Children & {
  onChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
};

export type RadioGroupProvider = {
  value?: string;
  handleChange: (value: string) => void;
};

export const RadioGroupContext = React.createContext<RadioGroupProvider>({
  value: undefined,
  handleChange: noop,
});

export const RadioGroup = (props: Props) => {
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

  return <RadioGroupContext.Provider value={providerValue}>{children}</RadioGroupContext.Provider>;
};

RadioGroup.Option = Option;
