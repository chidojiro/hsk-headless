export type ClassName = {
  className?: string;
};

export type Dict = Record<string, any>;

export type Children = {
  children?: React.ReactNode;
};

export type Fn = (...args: any[]) => any;

export type OpenClose = {
  open?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
};

export type NullOrUndefined = null | undefined;
