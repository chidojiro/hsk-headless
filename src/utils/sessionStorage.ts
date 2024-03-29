const get = <T = unknown>(key: string, defaultValue?: T) => {
  try {
    const storedValue: T | null = JSON.parse(sessionStorage.getItem(key) as any);

    return storedValue ?? defaultValue;
  } catch {
    return defaultValue;
  }
};

const set = <T = unknown>(key: string, data: T) => {
  sessionStorage.setItem(key, JSON.stringify(data));
};

const clear = () => sessionStorage.clear();

const remove = (key: string) => sessionStorage.removeItem(key);

export const SessionStorage = { get, set, clear, remove };
