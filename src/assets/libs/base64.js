export const encodeToBase64 = (input) => {
  if (!input) {
    return '';
  }
  const string = input.toString();
  let output = '';
  if (process.server) {
    output = Buffer.from(string, 'binary').toString('base64');
  } else {
    output = window.btoa(string);
  }
  return output;
};
