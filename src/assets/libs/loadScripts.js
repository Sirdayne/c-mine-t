const asyncForEach = async (array, callback) => {
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < array.length; index++) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array);
  }
};

const scriptToLoad = (src) =>
  new Promise((resolve, reject) => {
    if (!src) {
      reject(new TypeError('Script `src` attribute is not defined'));
      return;
    }
    const script = document.createElement('script');
    script.onload = () => {
      document.head.removeChild(script);
      resolve();
    };
    script.onerror = (e) => {
      document.head.removeChild(script);
      reject(e);
    };
    script.defer = true;
    script.src = src;
    document.head.appendChild(script);
  });

/**
 * @deprecated use "ExternalScriptManager"
 */
export default (urlList) => {
  let counter = 0;
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    await asyncForEach(urlList, async (url) => {
      try {
        await scriptToLoad(url);
        counter += 1;
      } catch (e) {
        console.warn(e);
      }
    });
    resolve({ counter });
  });
};
