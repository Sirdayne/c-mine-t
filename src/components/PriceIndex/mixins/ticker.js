import axios from 'axios';
import { mapState } from 'vuex';
import { intlFormat } from 'date-fns';
import { localeFormatter } from '~/assets/libs/dateTimeUtils';

export const ticker = {
  computed: {
    ...mapState({
      currentLanguage: ({ currentLanguage }) => currentLanguage,
    }),
  },
  methods: {
    async getData(url) {
      const { data, status, statusText } = await axios.get(url);
      if (status === 200) {
        return data.original ? data.original : data;
      }
      const error = new Error(statusText);
      error.code = status;
      throw error;
    },
    customFormatter(dateObj) {
      return intlFormat(
        dateObj,
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        },
        { locale: localeFormatter(this.currentLanguage.short) }
      );
    },
  },
};
