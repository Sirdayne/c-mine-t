export default (array = []) => {
  if (!Array.isArray(array)) {
    throw new TypeError('Input `array` is not instance of `Array`');
  }
  const result = [];
  array.forEach((item) => {
    if (item === undefined || item === null) {
      return;
    }
    if (typeof item !== 'object') {
      return;
    }
    result.push(item);
  });
  return result;
};
