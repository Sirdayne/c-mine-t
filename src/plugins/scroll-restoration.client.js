export default () => {
  if (process.client && typeof history === 'object') {
    history.scrollRestoration = 'auto';
  }
};
