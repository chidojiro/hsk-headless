import React, { ChangeEvent } from 'react';
import { useCheckboxGroupContext } from './CheckboxGroupProvider';

type RenderPropState = {
  value: string;
  isChecked: boolean;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
};

export type CheckboxGroupOptionProps = {
  value: string;
  shouldChange?: (e: ChangeEvent<HTMLInputElement>, checkboxGroupValue: string[]) => boolean | Promise<boolean>;
  children?: (state: RenderPropState) => React.ReactNode;
};

export const CheckboxGroupOption = (
  { value, shouldChange: shouldChangeProp, children }: CheckboxGroupOptionProps,
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  const groupProviderValue = useCheckboxGroupContext();

  const isChecked = groupProviderValue.value.includes(value);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async e => {
    const isChecked = e.target.checked;
    const value = e.target.value;

    const shouldChange = (await shouldChangeProp?.(e, groupProviderValue.value)) ?? true;

    if (shouldChange) {
      groupProviderValue?.handleChange(value, isChecked);
    }
  };

  return <>{children?.({ value, isChecked, handleChange })}</>;
};
