import { createContext } from '@/utils';
import { CheckboxGroupProps } from './CheckboxGroup';

export type CheckboxGroupChangeHandler = (value: string, isChecked: boolean) => void;

export type CheckboxGroupProviderValue = {
  value: string[];
  handleChange: CheckboxGroupChangeHandler;
  groupProps: CheckboxGroupProps;
  registerValue: (value: string) => void;
  unregisterValue: (value: string) => void;
};

export const [CheckboxGroupProvider, useCheckboxGroupContext] = createContext<CheckboxGroupProviderValue>();
