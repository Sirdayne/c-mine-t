import { axiosTransport } from '~/api/transport/axiosTransport';
import { useContext } from '@nuxtjs/composition-api';

export interface Reaction {
  count: number;
  hasOwn: boolean;
  symbol: string;
}

export class ReactionsApi {
  constructor(
    /**
     * Post reactions Artisan API URL
     */
    readonly _reactionsArtisanURL: string,
    /**
     * Post reactions Conpletus API URL
     */
    readonly _reactionsConpletusURL: string
  ) {}
  async getReactions(postTranslateId: string): Promise<Reaction[]> {
    const { data } = await axiosTransport.request({
      method: 'GET',
      url: `${this._reactionsConpletusURL}reactions`,
      params: {
        postTranslateId,
      },
    });

    if (data instanceof Error) throw data;

    let rawReactions: unknown = data?.data;

    if (!Array.isArray(rawReactions)) rawReactions = [];

    // @ts-expect-error unsafe parse reactions from backend
    return rawReactions.map((rawReaction) => ({
      ...rawReaction,
      count: Number(rawReaction.count),
      symbol: decodeURIComponent(rawReaction.symbol),
    }));
  }

  async toggleReaction(postTranslateId: string, symbol: string): Promise<void> {
    const { data } = await axiosTransport.request({
      method: 'POST',
      url: `${this._reactionsArtisanURL}/v1/reaction/${postTranslateId}/`,
      params: {
        symbol,
      },
    });

    if (data instanceof Error) {
      throw Error;
    }

    return data;
  }
}

/**
 * Accessor for nuxt publicRuntimeConfig
 */
export const useReactionsApi = () => {
  const { $config } = useContext();
  const artisanUrl = $config.artisanUrl;
  const graphqlUrl = $config.graphqlUrl;
  return new ReactionsApi(artisanUrl, graphqlUrl);
};
