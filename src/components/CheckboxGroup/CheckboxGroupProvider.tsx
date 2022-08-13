import { ReactUtils } from '@/utils';

export type ChangeHandler = (value: string, isChecked: boolean) => void;

export type CheckboxGroupProviderValue = {
  value: string[];
  handleChange: ChangeHandler;
};

export const [CheckboxGroupProvider, useCheckboxGroupContext] = ReactUtils.createContext<CheckboxGroupProviderValue>();
