import Cookies, { CookieAttributes } from 'js-cookie';

const set = (key: string, value: string, options: CookieAttributes = {}) => {
  Cookies.set(key, value, options);
};

const get = (key: string, defaultValue = '') => {
  return Cookies.get(key) ?? defaultValue;
};

const remove = (key: string, options: CookieAttributes = {}) => {
  Cookies.remove(key, options);
};

const parse = (cookie: string) =>
  cookie
    ?.split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {} as Record<string, string>) ?? {};

export const CookiesUtils = {
  set,
  get,
  parse,
  remove,
};
