import { axiosTransport } from '~/api/transport/axiosTransport';
import { CerosForm } from '~/features/advertise-form/types';
import { useContext } from '@nuxtjs/composition-api';
import { MaybeRef } from '@vueuse/core';
import { unref } from 'vue';

export class AdvertiseApi {
  constructor(
    /**
     * Ceros advertise  Conpletus API URL
     */
    readonly _advertiseArtisanURL: string
  ) {}

  async sendAdvertiseFormData(form: MaybeRef<CerosForm>, clientId: string): Promise<void[]> {
    const formattedClientId = clientId.substring(6);
    const { data } = await axiosTransport.request({
      method: 'POST',
      url: `${this._advertiseArtisanURL}/v1/client/feedback/`,
      data: {
        ...unref(form),
        ClientID: formattedClientId,
      },
    });
    if (data instanceof Error) {
      throw Error;
    }
    return data;
  }
}

export const useAdvertiseApi = () => {
  const { $config } = useContext();
  const artisanUrl = $config.artisanUrl;
  return new AdvertiseApi(artisanUrl);
};
