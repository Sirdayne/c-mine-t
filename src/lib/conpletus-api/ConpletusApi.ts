import { type AxiosInstance, type AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ConpletusApiRequestInit<Data> {
  signal?: AbortSignal;
  data: Data;
}

export type MarketsProLeadCampaign = 'main' | 'inner';
interface MarketsProLead {
  email: string;
  campaign: MarketsProLeadCampaign;
}
class MarketsProLeadError extends Error {
  constructor(public readonly response: AxiosResponse) {
    super(`Status is ${response.status}`);
  }
}
export class ConpletusApi {
  constructor(private readonly _axios: AxiosInstance) {}

  /**
   * @note Never use it. Hack for PostContent.vue
   */
  __getAxios(): AxiosInstance {
    return this._axios;
  }

  private async _request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const result = await this._axios.request(config);
    return result.data;
  }

  public async getUserCountry(config?: ConpletusApiRequestInit<void>): Promise<{ country: string | null }> {
    return await this._axios.request({
      ...config,
      method: 'GET',
      url: 'request-country',
    });
  }

  public async submitMarketsProLead(lead: MarketsProLead, config?: ConpletusApiRequestInit<void>): Promise<void> {
    const result = await this._axios.request({
      ...config,
      method: 'POST',
      url: `/markets-pro-lead`,
      data: lead,
    });
    if (result.status !== 204) {
      throw new MarketsProLeadError(result);
    }
  }
}
