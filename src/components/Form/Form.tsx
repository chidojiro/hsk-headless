import { useDisclosure } from '@/hooks';
import { createContext, DetailedHTMLProps, FormHTMLAttributes, ReactNode, useContext } from 'react';
import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';

export type FormProps<T extends FieldValues> = Omit<
  DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
  'onSubmit'
> & {
  children: ReactNode;
  onSubmit?: SubmitHandler<T>;
  methods: UseFormReturn<T>;
};

const FormForceRerendererContext = createContext(() => null);

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

export const useFormForceRerenderer = () => useContext(FormForceRerendererContext);
