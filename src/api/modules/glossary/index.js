import { fetchQuery } from '~/api/modules/shared';
import GlossaryPageQuery from '~/graphql/queries/glossaryPage.graphql';
import getProperty from '~/assets/libs/getProperty';

export const fetchGlossary = async (options = {}) => {
  const { languageShort, apolloTransport } = options;
  const { status, errors, data } = await fetchQuery({
    defaultData: {
      user: null,
    },
    query: GlossaryPageQuery,
    languageShort,
    apolloTransport,
    fetchPolicy: 'no-cache',
    sentryTag: 'fetch-glossary',
  });
  const glossary = getProperty(data, 'glossary', null);
  return {
    status,
    errors,
    glossary,
  };
};
