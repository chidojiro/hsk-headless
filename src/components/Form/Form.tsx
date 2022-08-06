import { useDisclosure } from 'hooks';
import React from 'react';
import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';

export type FormProps<T = any> = Omit<
  React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
  'onSubmit'
> & {
  children: React.ReactNode;
  onSubmit?: SubmitHandler<T>;
  methods: UseFormReturn<T>;
};

const FormForceRerendererContext = React.createContext(() => null);

export const Form = <TFieldValues extends FieldValues>({
  children,
  onSubmit,
  methods,
  ...props
}: FormProps<TFieldValues>) => {
  const disclosure = useDisclosure();

  const value = disclosure.toggle;

  return (
    <FormForceRerendererContext.Provider value={value as any}>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit && methods.handleSubmit(onSubmit)} {...props}>
          {children}
        </form>
      </FormProvider>
    </FormForceRerendererContext.Provider>
  );
};

export const useFormForceRerenderer = () => React.useContext(FormForceRerendererContext);
