import { useControllable } from 'hooks';
import React from 'react';
import { Children } from 'types';
import { ChangeHandler, CheckboxGroupProvider } from './CheckboxGroupProvider';

export type CheckboxGroupProps = Children & {
  onChange?: (value: string[]) => void;
  value?: string[];
  defaultValue?: string[];
};

export const CheckboxGroup = (props: CheckboxGroupProps) => {
  const { onChange: onChangeProp, defaultValue = [], value: valueProp, children } = props;

  const [value, setValue] = useControllable({
    value: valueProp,
    defaultValue,
    onChange: onChangeProp,
  });

  const handleChange: ChangeHandler = React.useCallback(
    (targetValue, isChecked) => {
      let newValue;
      if (isChecked) {
        newValue = [...value, targetValue];
      } else {
        newValue = value.filter((value: any) => value !== targetValue);
      }

      onChangeProp?.(newValue);
      setValue(newValue);
    },
    [onChangeProp, setValue, value]
  );

  const providerValue = React.useMemo(() => ({ handleChange, value }), [handleChange, value]);

  return <CheckboxGroupProvider value={providerValue}>{children}</CheckboxGroupProvider>;
};
