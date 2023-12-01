import { axiosTransport } from '~/api/transport/axiosTransport';
import { ARTISAN_URL, ERROR_MESSAGE, SUBSCRIBE_STOP_PHRASES } from '~/app.config';

const newsletterSubscriptionIdMapping = {
  markets_outlook: '63518681844418509',
  magazine: '63518521281218556',
  defi_newsletter: '63518580167149221',
  nifty_newsletter: '63518610776131095',
  law_decoded: '63518511686747533',
  one_minute_letter: '63518551307192135',
  week_in_review: '63518563605939751',
  crypto_biz: '63518622575756409',
  consulting_newsletter: '64408317476210640',
  altcoin_roundup: '65047164555888620',
};

export const subscribeMailList = async (list = []) => {
  let selectedSubscriptionListIds = [];
  let email;
  if (Array.isArray(list)) {
    list.map(({ url, email: usersEmail }) => {
      email = usersEmail;
      return Object.keys(newsletterSubscriptionIdMapping).map((SubscriptionListName) => {
        const response = {
          error: false,
          message: '',
          hasStopPhrases: false,
        };

        const newsletterSubscriptionId = newsletterSubscriptionIdMapping[SubscriptionListName];

        if (url.includes(SubscriptionListName)) {
          selectedSubscriptionListIds.push(newsletterSubscriptionId);
        } else {
          return response;
        }
        return selectedSubscriptionListIds;
      });
    });
  } else {
    selectedSubscriptionListIds = list.subscriptionIds;
    email = list.email;
  }

  const response = {
    status: 'error',
    errors: ERROR_MESSAGE,
    data: {
      email,
      list: selectedSubscriptionListIds,
    },
  };

  try {
    const { error, data = {} } = await axiosTransport.request({
      method: 'post',
      baseURL: ARTISAN_URL,
      url: '/v1/maillist/subscribe/',
      data: {
        email,
        list: selectedSubscriptionListIds,
      },
    });
    if (error) {
      return response;
    }
    response.status = data.result;
    response.errors = undefined;
    response.data = data;
    return response;
  } catch (e) {
    response.errors = e.message;
    return response;
  }
};

export const SUBSCRIBE_BASE_URL =
  'https://cointelegraph.us3.list-manage.com/subscribe/post-json?u=2c088712615955cd2f82aa968&id=';

export const isStringHasStopPhrases = (message, phrases = SUBSCRIBE_STOP_PHRASES) => {
  return phrases.reduce((acc, phrase) => message.indexOf(phrase) > -1 || acc, false);
};

export const subscribeMailchimpAudience = async (email) => {
  const response = {
    status: 'error',
    errors: ERROR_MESSAGE,
    data: {},
  };
  try {
    const { error, data = {} } = await axiosTransport.request({
      method: 'post',
      baseURL: ARTISAN_URL,
      url: '/v1/maillist/subscribe-mailchimp/',
      data: {
        email,
      },
    });
    if (error) {
      return response;
    }
    response.status = data.result;
    response.errors = undefined;
    response.data = data;
    return response;
  } catch (e) {
    response.errors = e.message;
    return response;
  }
};
