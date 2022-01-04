const parse = <T = any>(data: string, defaultValue?: T) => {
  try {
    return JSON.parse(data);
  } catch {
    return defaultValue || data;
  }
};

const stringify = JSON.stringify;

export const JsonUtils = {
  parse,
  stringify,
};
