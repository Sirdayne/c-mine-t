import { axiosTransport } from '~/api/transport/axiosTransport';
import { CohDonations } from '~/components/Coh/types';

const COH_API_URL = 'https://coh-backend.cointelegraph.com/';
export class CohAPI {
  constructor(
    /**
     * CoH API URL
     */
    readonly _reactionsCohURL: string
  ) {}

  /**
   * Return list of donations and total amount
   * */
  async getDonations(): Promise<CohDonations> {
    const { data } = await axiosTransport.request({
      method: 'GET',
      baseURL: this._reactionsCohURL,
    });

    if (data instanceof Error) throw data;

    return data;
  }

  async setDonation(details): Promise<void> {
    const { data } = await axiosTransport.request({
      method: 'POST',
      url: this._reactionsCohURL,
      data: {
        ...details,
      },
    });

    if (data instanceof Error) {
      throw Error;
    }

    return data;
  }
}

export const useCohApi = () => {
  const cohUrl = COH_API_URL;
  return new CohAPI(cohUrl);
};
