export const mapCharts = (data) => {
  const result = {};

  // eslint-disable-next-line array-callback-return
  Object.keys(data.data).map((coin) => {
    // eslint-disable-next-line array-callback-return
    Object.keys(data.data[coin]).map((currency) => {
      result[`${coin}-${currency}`] = data.data[coin][currency].INDEX;
    });
  });

  return result;
};
