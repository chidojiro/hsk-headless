const sleep = (time: number) => new Promise(resolve => setTimeout(() => resolve(null), time))

const PromiseUtils = { sleep }

export default PromiseUtils
