import React, { ChangeEvent } from 'react';
import { CheckboxGroupContext, CheckboxGroupProvider } from '../CheckboxGroup';

type RenderPropState = {
  value: string;
  isChecked: boolean;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
};

export type Props = {
  value: string;
  shouldChange?: (e: ChangeEvent<HTMLInputElement>, checkboxGroupValue: string[]) => boolean | Promise<boolean>;
  children?: (state: RenderPropState) => React.ReactNode;
};

export const Option = (
  { value, shouldChange: shouldChangeProp, children }: Props,
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  const groupProviderValue = React.useContext<CheckboxGroupProvider>(CheckboxGroupContext);

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
