import copy from 'copy-to-clipboard';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type UseClipboardOptions = {
  timeout?: number;
  format?: string;
};

export const useClipboard = (text: string, optionsOrTimeout: number | UseClipboardOptions = {}) => {
  const [isCopied, setIsCopied] = useState(false);

  const { timeout = 1500, ...copyOptions } =
    typeof optionsOrTimeout === 'number' ? { timeout: optionsOrTimeout } : optionsOrTimeout;

  const onCopy = useCallback(() => {
    const didCopy = copy(text, copyOptions);
    setIsCopied(didCopy);
  }, [text, copyOptions]);

  useEffect(() => {
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

  return useMemo(() => ({ value: text, onCopy, isCopied: isCopied }), [isCopied, onCopy, text]);
};
