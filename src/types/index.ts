export type HTMLElementOrHTMLElementRef = HTMLElement | React.RefObject<HTMLElement>;

export type WithAsProps<
  TProps,
  TDefaultElement extends keyof JSX.IntrinsicElements,
  TCustomElement extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements
> =
  | (TProps & { as: TCustomElement } & JSX.IntrinsicElements[TCustomElement])
  | (TProps & JSX.IntrinsicElements[TDefaultElement]);

export type ValueTransformProps<T = any> = {
  valueAs?: (value: T) => any;
  changeAs?: (value: any) => T;
};

export type Option<TValue = string> = { label: React.ReactNode; value: TValue } & Record<string, any>;

export type ClassName = {
  className?: string;
};

export type Children = {
  children?: React.ReactNode;
};

export type Fn = (...args: any[]) => any;

export type OpenClose = {
  open?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
};

export type Override<TOriginal, TOverride> = Omit<TOriginal, keyof TOverride> & TOverride;
