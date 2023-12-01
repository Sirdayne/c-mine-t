export default (callback, wait = 100, immediate = false) => {
  let timeout = null;
  let initialCall = true;
  return () => {
    const callNow = immediate && initialCall;
    const next = (...args) => {
      callback.apply(this, args);
      timeout = null;
    };
    if (callNow) {
      initialCall = false;
      next();
    }
    if (!timeout) {
      timeout = setTimeout(next, wait);
    }
  };
};
