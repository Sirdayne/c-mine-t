import Big from 'big.js';
import { createErrorWithExtra } from '~/lib/telemetry';

const enum CryptoConversionDirection {
  CRYPTO_TO_FIAT = 'crypto-to-fiat',
  FIAT_TO_CRYPTO = 'fiat-to-crypto',
}

interface CryptoConversionConfig {
  baseCoin: string;
  quoteCoin: string;
  rate: Big;
  direction: CryptoConversionDirection;
}

export interface CryptoConversionResult {
  baseCoin: string;
  quoteCoin: string;
  baseToQuoteRate: string;
  quoteToBaseRate: string;
  convertedAmount: string;
}

// crypto coin always base, while f
// crypto coin => fiat coin => price
type AllRates = Record<string, Record<string, { price: number }>>;

/**
 * Helper to convert crypto-to-fiat or fiat-to-crypto
 * with given amount
 *
 * PS direction detected automatically
 */
export class CryptoConversionHelper {
  /**
   * @param _rates rates from ticker-api with ?full=true
   */
  constructor(private readonly _rates: AllRates) {}

  /**
   * @returns conversion result
   */
  convert(fromCoin: string, toCoin: string, amount: string): CryptoConversionResult {
    const { baseCoin, quoteCoin, rate, direction } = this._resolveConfig(fromCoin, toCoin);
    const convertedAmount = this._doConversion(rate, Big(amount), direction);

    if (convertedAmount.lte(0))
      throw createErrorWithExtra('failed to convert crypto', {
        fromCoin,
        toCoin,
        amount,
        rate,
        direction,
        resultBig: convertedAmount,
      });

    return {
      baseCoin,
      quoteCoin,
      baseToQuoteRate: rate.toString(),
      quoteToBaseRate: rate.pow(-1).toString(),
      convertedAmount: convertedAmount.toString(),
    };
  }

  private _resolveConfig(fromCoin: string, toCoin: string): CryptoConversionConfig {
    // try as crypto-to-fiat
    let direction = CryptoConversionDirection.CRYPTO_TO_FIAT;
    let rate = this._findPrice(fromCoin, toCoin);
    let baseCoin = fromCoin;
    let quoteCoin = toCoin;

    // try as fiat-to-crypto
    if (!rate) {
      [baseCoin, quoteCoin] = [toCoin, fromCoin];
      direction = CryptoConversionDirection.FIAT_TO_CRYPTO;
      rate = this._findPrice(toCoin, fromCoin);
    }

    if (!rate)
      throw createErrorWithExtra('no rate for given coins', {
        fromCoin,
        toCoin,
        rate,
        direction,
      });

    return {
      baseCoin,
      quoteCoin,
      rate: Big(rate),
      direction,
    };
  }

  private _findPrice(baseCoin: string, quoteCoin: string): number {
    return this._rates?.[baseCoin.toUpperCase()]?.[quoteCoin.toUpperCase()]?.price ?? null;
  }

  private _doConversion(price: Big, amount: Big, direction: CryptoConversionDirection): Big {
    switch (direction) {
      case CryptoConversionDirection.CRYPTO_TO_FIAT:
        return amount.mul(price);
      case CryptoConversionDirection.FIAT_TO_CRYPTO:
        return amount.div(price);
    }
  }
}
