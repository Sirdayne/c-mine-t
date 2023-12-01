export default (napTime = 500) => {
  return new Promise((resolve) => {
    setTimeout(resolve, napTime);
  });
};
