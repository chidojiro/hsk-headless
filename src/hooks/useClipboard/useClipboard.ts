import copy from 'copy-to-clipboard';
import React from 'react';

export type UseClipboardOptions = {
  timeout?: number;
  format?: string;
};

export const useClipboard = (text: string, optionsOrTimeout: number | UseClipboardOptions = {}) => {
  const [isCopied, setIsCopied] = React.useState(false);

  const { timeout = 1500, ...copyOptions } =
    typeof optionsOrTimeout === 'number' ? { timeout: optionsOrTimeout } : optionsOrTimeout;

  const onCopy = React.useCallback(() => {
    const didCopy = copy(text, copyOptions);
    setIsCopied(didCopy);
  }, [text, copyOptions]);

  React.useEffect(() => {
    let timeoutId: number | null = null;

    if (isCopied) {
      timeoutId = window.setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [timeout, isCopied]);

  return React.useMemo(() => ({ value: text, onCopy, isCopied: isCopied }), [isCopied, onCopy, text]);
};
