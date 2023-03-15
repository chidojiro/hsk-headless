import { useMountEffect } from '@/hooks';
import { Fn } from '@/types';
import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '../useQuery';

export const useUrlState = <T>(paramKey: string, defaultValue?: T) => {
  const [param, _setParam] = useState(defaultValue);

  const query = useQuery();

  useMountEffect(() => {
    const paramValue = query.get(paramKey);

    if (paramKey?.length) {
      _setParam(paramValue);
    }
  });

  const setParam: typeof _setParam = useCallback(
    valueOrCallback => {
      if (typeof valueOrCallback === 'function') {
        return _setParam(prev => {
          const newValue = (valueOrCallback as Fn)(prev);

          query.set(paramKey, newValue);

          return (valueOrCallback as Fn)(prev);
        });
      }

      query.set(paramKey, (valueOrCallback as any).toString());

      return _setParam(valueOrCallback);
    },
    [paramKey, query]
  );

  return useMemo(() => [param, setParam], [param, setParam]);
};
