export interface StaticPromoButtonDefinition {
  /**
   * @example "binance", "aml"
   */
  promoButtonType: string;

  /**
   * CSS unit for "color" property of label
   */
  labelColor?: string;

  /**
   * CSS unit for "background-color" property
   */
  backgroundColor?: string;

  /**
   * CSS unit for "background-image" property
   */
  backgroundImage?: string;
}

/**
 * All known promo buttons that configured in Dashboard
 */
const STATIC_PROMO_BUTTON_DEFINITION_REGISTRY: StaticPromoButtonDefinition[] = [
  {
    promoButtonType: 'nexo',
    labelColor: '#fafafa',
    backgroundImage: 'linear-gradient(-61deg, #13a0d3 0%, #2853c3 100%)',
  },
  {
    promoButtonType: 'crypto',
    backgroundColor: '#002d72',
  },
  {
    promoButtonType: 'etoro',
    labelColor: '#fafafa',
    backgroundColor: '#6aac0e',
  },
  {
    promoButtonType: 'etoro2',
    labelColor: '#fafafa',
    backgroundColor: '#6aac0e',
  },
  {
    promoButtonType: 'etoro3',
    labelColor: '#fafafa',
    backgroundColor: '#6aac0e',
  },
  {
    promoButtonType: 'hitbtc',
    labelColor: '#fafafa',
    backgroundColor: '#0a4451',
  },
  {
    promoButtonType: 'changelly',
    backgroundColor: '#10d078',
  },
  {
    promoButtonType: 'tokenbox',
    backgroundColor: '#5244d4',
  },
  {
    promoButtonType: 'binance',
    backgroundColor: '#2b2f36',
  },
  {
    promoButtonType: 'ledger',
    backgroundColor: '#40ccb4',
  },
  {
    promoButtonType: 'okex',
    backgroundColor: '#013d70',
  },
  {
    promoButtonType: 'syncbond',
    backgroundColor: '#3ab1c2',
  },
  {
    promoButtonType: 'bybit',
    labelColor: '#ffb11a',
    backgroundColor: '#15192a',
  },
  {
    promoButtonType: 'bybit2',
    labelColor: '#15192a',
    backgroundColor: '#f7a600',
  },
  {
    promoButtonType: 'coinapp',
    backgroundColor: '#010149',
  },
  {
    promoButtonType: 'nbc',
    backgroundColor: '#00106e',
  },
  {
    promoButtonType: 'exodus',
    backgroundColor: '#00bfff',
  },
  {
    promoButtonType: 'coinsmart',
    backgroundColor: '#29206c',
  },
  {
    promoButtonType: 'aml',
    backgroundImage: 'linear-gradient(105.12deg, #af00db 20.28%, #0085ff 112.15%)',
  },
  {
    promoButtonType: 'coinsquare',
    backgroundColor: '#0000ff',
  },
  {
    promoButtonType: 'stoic',
    backgroundColor: '#3252ff',
  },
  {
    promoButtonType: 'coinloan',
    backgroundImage: '#007aff',
  },
  {
    promoButtonType: 'crypto-com',
    backgroundColor: '#11346e',
  },
  {
    promoButtonType: 'coinbase',
    backgroundColor: '#0052ff',
  },
  {
    promoButtonType: 'nebeus',
    backgroundColor: '#096333',
  },
  {
    promoButtonType: 'kucoin',
    backgroundColor: '#12192c',
  },
  {
    promoButtonType: 'crescent',
    backgroundColor: '#3b1c50',
  },
  {
    promoButtonType: 'uphold',
    backgroundColor: '#38ce57',
  },
  {
    promoButtonType: 'xgo',
    backgroundColor: '#f6f3e7',
    labelColor: '#000000',
  },
  {
    promoButtonType: 'bitget',
    backgroundColor: '#1da2b4',
  },
];

/**
 * @param promoButtonType promo button type like "xgo", "changelly", etc
 */
export const findStaticPromoButtonDefinition = (promoButtonType: unknown): StaticPromoButtonDefinition | null => {
  return STATIC_PROMO_BUTTON_DEFINITION_REGISTRY.find((def) => def.promoButtonType === promoButtonType) || null;
};

/**
 * for legacy i18n loading strategy need to pass
 * all registered promo buttons translation keys
 */
export const resolveAllStaticPromoButtonI18nSlugs = (): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const { promoButtonType } of STATIC_PROMO_BUTTON_DEFINITION_REGISTRY) {
    const keys = [`${promoButtonType}.btn.label`, `${promoButtonType}.btn.text`];

    for (const key of keys) {
      result[key] = key;
    }
  }

  return result;
};
