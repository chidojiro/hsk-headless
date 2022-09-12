const get = <T = unknown>(key: string, defaultValue?: T) => {
  try {
    const storedValue: T | null = JSON.parse(localStorage.getItem(key) as any);

    return storedValue ?? defaultValue;
  } catch {
    return defaultValue;
  }
};

const set = <T = unknown>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const clear = () => localStorage.clear();

const remove = (key: string) => localStorage.removeItem(key);

export const LocalStorageUtils = { get, set, clear, remove };
