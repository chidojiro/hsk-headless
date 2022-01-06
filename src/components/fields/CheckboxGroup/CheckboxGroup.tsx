import { useControllable } from 'hooks';
import { noop } from 'lodash';
import React from 'react';
import { Children } from 'types';
import { Option } from './Option';

export type Props = Children & {
  onChange?: (value: string[]) => void;
  value?: string[];
  defaultValue?: string[];
};

type ChangeHandler = (value: string, isChecked: boolean) => void;

export type CheckboxGroupProvider = {
  value: string[];
  handleChange: ChangeHandler;
};

export const CheckboxGroupContext = React.createContext<CheckboxGroupProvider>({
  value: [],
  handleChange: noop,
});

export const CheckboxGroup = (props: Props) => {
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

  return <CheckboxGroupContext.Provider value={providerValue}>{children}</CheckboxGroupContext.Provider>;
};

CheckboxGroup.Option = Option;
