import { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import URI from 'urijs';

type QueryValue = string | string[];

export const useQuery = () => {
  const history = useHistory();
  const { search, pathname } = useLocation();

  const get = useCallback(
    (key: string) => {
      const uri = new URI(search);
      return uri.query(true)[key];
    },
    [search]
  );

  const add = useCallback(
    (key: string, value: QueryValue) => {
      const uri = new URI(search);

      const newSearch = uri.addQuery(key, value).href();

      history.push({ pathname, search: newSearch });
    },
    [history, pathname, search]
  );

  const set = useCallback(
    (key: string, value: QueryValue) => {
      const uri = new URI(search);

      const newSearch = uri.setQuery(key, value).href();

      history.push({ pathname, search: newSearch });
    },
    [history, pathname, search]
  );

  const remove = useCallback(
    (key: string, value: QueryValue) => {
      const uri = new URI(search);

      [value].flat().forEach(v => {
        uri.removeQuery(key, v);
      });

      const newSearch = uri.href();

      history.push({ pathname, search: newSearch });
    },
    [history, pathname, search]
  );

  return useMemo(() => ({ get, add, set, remove }), [add, get, remove, set]);
};
