export default (options = {}) => {
  const { inputValue, defaultValue } = options;
  try {
    return JSON.parse(inputValue);
  } catch (e) {
    return defaultValue;
  }
};
