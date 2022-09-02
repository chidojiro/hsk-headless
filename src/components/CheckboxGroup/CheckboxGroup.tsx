import { useControllableState } from '@/hooks';
import React from 'react';
import { Children } from '@/types';
import { CheckboxGroupChangeHandler, CheckboxGroupProvider, CheckboxGroupProviderValue } from './CheckboxGroupProvider';

export type CheckboxGroupProps = Children & {
  onChange?: (value: string[]) => void;
  value?: string[];
  defaultValue?: string[];
  error?: boolean;
};

export const CheckboxGroup = (props: CheckboxGroupProps) => {
  const { onChange: onChangeProp, defaultValue = [], value: valueProp, children } = props;

  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onChangeProp,
  });

  const handleChange: CheckboxGroupChangeHandler = React.useCallback(
    (targetValue, isChecked) => {
      let newValue: string[];
      if (isChecked) {
        newValue = [...value, targetValue];
      } else {
        newValue = value.filter(value => value !== targetValue);
      }

      onChangeProp?.(newValue);
      setValue(newValue);
    },
    [onChangeProp, setValue, value]
  );

  const providerValue = React.useMemo<CheckboxGroupProviderValue>(
    () => ({ handleChange, value, groupProps: props }),
    [handleChange, props, value]
  );

  return <CheckboxGroupProvider value={providerValue}>{children}</CheckboxGroupProvider>;
};
