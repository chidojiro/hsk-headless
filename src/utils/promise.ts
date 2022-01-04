const sleep = (time: number) => new Promise(resolve => setTimeout(() => resolve(null), time));

export const PromiseUtils = { sleep };
