import { fetchQuery } from '~/api/modules/shared';
import qrCodeQuery from '~/graphql/queries/qrCode.graphql';
import getProperty from '~/assets/libs/getProperty';

export const fetchQrCode = async (options = {}) => {
  const { url, languageShort, apolloTransport } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      qrCode: {
        image: null,
      },
    },
    query: qrCodeQuery,
    variables: {
      url,
    },
    languageShort,
    apolloTransport,
    sentryTag: 'fetch-qr-code',
  });
  const qrCode = getProperty(data, 'qrCode', {});
  return {
    status,
    errors,
    data: qrCode,
  };
};
