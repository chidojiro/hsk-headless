import { ReactUtils } from '@/utils';
import { CheckboxGroupProps } from './CheckboxGroup';

export type ChangeHandler = (value: string, isChecked: boolean) => void;

export type CheckboxGroupProviderValue = {
  value: string[];
  handleChange: ChangeHandler;
  groupProps: CheckboxGroupProps;
};

export const [CheckboxGroupProvider, useCheckboxGroupContext] = ReactUtils.createContext<CheckboxGroupProviderValue>();
