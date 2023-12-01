import getProperty from '~/assets/libs/getProperty';
import filterNoneObjects from '~/assets/libs/filterNoneObjects';
import { getMappedPostPreview } from '~/assets/helpers/posts';
import { getFormattedDateString } from '~/assets/helpers/dateTime';

export const getMappedInnovationCircleData = (data, options = {}) => {
  if (!data || typeof data !== 'object') {
    return {
      posts: [],
      postsCount: 0,
      meta: null,
      alternates: [],
    };
  }
  const { languageDomain, languageCode, timeZone, pathname, languageShort } = options;
  const posts = getProperty(data, 'posts.data', []);
  const postsCount = getProperty(data, 'posts.postsCount', 0);
  const alternates = [];
  return {
    posts: filterNoneObjects(posts).map((item) =>
      getMappedPostPreview(
        item,
        {
          languageDomain,
          languageCode,
          timeZone,
          languageShort,
        },
        true
      )
    ),
    postsCount,
    meta: {
      url: pathname,
      title: 'Innovation Circle | Cointelegraph',
      description:
        'Cointelegraph Innovation Circle is a vetted professional organization of founders, partners, C-suite executives, principal decision makers (VP-level or higher), and experts in the fields of blockchain technology, cryptocurrency, Web3, NFTs, and decentralization in industries such as finance, insurance, gaming, healthcare, and more.',
      keywords: '',
      image: '',
      datePublished: getFormattedDateString(new Date()),
      dateModified: getFormattedDateString(new Date()),
    },
    alternates,
  };
};
