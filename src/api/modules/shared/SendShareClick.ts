import { ARTISAN_URL } from '~/app.config';
import { axiosTransport } from '~/api/transport/axiosTransport';

export interface SharesOptions {
  translationId: string;
  target: string;
}

export const sendShareSocialMediaClick = async (options: SharesOptions): Promise<void> => {
  const { translationId, target } = options;
  const { data } = await axiosTransport.request({
    method: 'GET',
    url: `${ARTISAN_URL}/v1/share/${translationId}/`,
    params: {
      target,
    },
  });

  if (data instanceof Error) {
    throw Error;
  }
};
