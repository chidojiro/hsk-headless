import { ReactUtils } from '@/utils';
import { CheckboxGroupProps } from './CheckboxGroup';

export type CheckboxGroupChangeHandler = (value: string, isChecked: boolean) => void;

export type CheckboxGroupProviderValue = {
  value: string[];
  handleChange: CheckboxGroupChangeHandler;
  groupProps: CheckboxGroupProps;
};

export const [CheckboxGroupProvider, useCheckboxGroupContext] = ReactUtils.createContext<CheckboxGroupProviderValue>();
