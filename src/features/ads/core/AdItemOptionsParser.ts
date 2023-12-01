import * as t from 'typed';
import { type Banner as GraphQLBanner } from '~/graphql';
import { type AdItemOptions } from './AdItemOptions';

const optionsSchema = t.object({
  widgetHeight: t.defaulted(t.nullable(t.asNumber()), null),
  categorySlug: t.defaulted(t.nullable(t.asString()), null),
});

export class AdItemOptionsParser {
  parse(banner: GraphQLBanner): AdItemOptions {
    const parsed = this._tryParseJson(banner.bannerOptions);
    const result = optionsSchema(parsed);
    return t.unwrapOr(result, this._createEmpty());
  }

  private _createEmpty(): AdItemOptions {
    return {
      widgetHeight: null,
      categorySlug: null,
    };
  }

  private _tryParseJson(json: unknown): unknown {
    try {
      if (typeof json === 'string' && json.length > 0) {
        return JSON.parse(json);
      }
    } catch (error) {
      // TODO: how should we deal with it here?
    }
  }
}
