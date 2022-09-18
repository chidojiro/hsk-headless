import { useControllableState } from '@/hooks';
import React from 'react';
import { CheckboxGroupChangeHandler, CheckboxGroupProvider, CheckboxGroupProviderValue } from './CheckboxGroupProvider';

type CheckboxGroupRenderPropState = {
  selection: 'none' | 'partial' | 'all';
  toggleSelectAll: () => void;
};

export type CheckboxGroupProps = {
  onChange?: (value: string[]) => void;
  value?: string[];
  defaultValue?: string[];
  error?: boolean;
  children?: React.ReactNode | ((state: CheckboxGroupRenderPropState) => void);
};

export const CheckboxGroup = (props: CheckboxGroupProps) => {
  const { onChange: onChangeProp, defaultValue = [], value: valueProp, children } = props;

  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onChangeProp,
  });

  const availableValueRef = React.useRef<string[]>([]);

  const registerValue = React.useCallback((value: string) => {
    availableValueRef.current = [...availableValueRef.current, value];

    return availableValueRef.current;
  }, []);

  const unregisterValue = React.useCallback((toBeUnregisteredValue: string) => {
    availableValueRef.current = availableValueRef.current.filter(value => value !== toBeUnregisteredValue);

    return availableValueRef.current;
  }, []);

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
    () => ({ handleChange, value, groupProps: props, registerValue, unregisterValue }),
    [handleChange, value, props, registerValue, unregisterValue]
  );

  const selection = (() => {
    if (value.length === availableValueRef.current.length) return 'all';
    if (value.length > 0) return 'partial';
    return 'none';
  })();

  const toggleSelectAll = React.useCallback(() => {
    if (selection === 'none') {
      setValue(availableValueRef.current);
    } else {
      setValue([]);
    }
  }, [selection, setValue]);

  return (
    <CheckboxGroupProvider value={providerValue}>
      {typeof children === 'function' ? children({ selection, toggleSelectAll }) : children}
    </CheckboxGroupProvider>
  );
};
