<template>
  <div :class="['search-box', isRtl && 'search-box__rtl']">
    <h1
      class="search-box__title"
      data-testid="search-title"
    >
      {{ i18n.searchTitle }}
    </h1>
    <form
      class="search-box__form"
      @submit.prevent="submit"
    >
      <div class="search-box__form-input">
        <input
          id="search"
          v-model="search"
          type="text"
          name="query"
          :placeholder="i18n.searchButtonCap"
          data-testid="search-input"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ROOT } from '~/store/types';

export default {
  name: 'SearchBox',
  props: {
    query: {
      type: String || undefined,
      default: '',
    },
  },
  data() {
    return {
      search: decodeURI(this.query || ''),
    };
  },
  computed: {
    ...mapState({
      i18n: ({ i18n }) => i18n,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
  },
  watch: {
    query(query) {
      this.search = query;
    },
  },
  methods: {
    submit() {
      this.$router.push({
        path: '/search',
        query: { query: encodeURI(this.search) },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@use '~/assets/styles/_icons-common.scss' as icons;
@import '~/assets/styles/_vars.scss';

.search-box {
  -webkit-box-shadow: 0 1px 2px 0 rgb(0 0 0 / 20%);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 20%);
  background: #fff;
  border-radius: 5px;
  padding: 20px;

  &__title {
    position: relative;
    margin: 0 0 24px;
    padding-bottom: 12px;
    font-size: 1.875rem;
    line-height: 1.1;
    color: #010101;
    font-weight: 600;
    margin-right: 16px;

    &::after {
      content: '';
      background: #ffcd04;
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      width: 15%;
      max-width: 50px;
      min-width: 30px;
    }
  }

  &__form {
    margin: 20px 0 0 0;

    &-input {
      p {
        margin: 0;
        color: #010101;
      }
    }

    input {
      @include icons.magnifier(#a2a3a5);
      display: block;
      width: 100%;
      box-sizing: border-box;
      border-radius: 3px;
      border: 1px solid #cccccc;
      margin-right: 15px;
      background-position: 10px 9px;
      background-attachment: scroll;
      background-repeat: no-repeat;
      background-size: 13px;
      height: 34px;
      padding: 6px 12px;
      padding-left: 32px;
      font-size: 14px;
      font-family: inherit;
      line-height: 1.42857143;
      color: #555555;
      -webkit-box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
      box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
      transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;

      &:focus {
        outline: none;
        -webkit-box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%), 0 0 8px rgb(102 175 233 / 60%);
        box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%), 0 0 8px rgb(102 175 233 / 60%);
      }

      @media (min-width: $sm) {
        display: inline-block;
        width: auto;
      }
    }
  }

  &__rtl {
    .search-box__title::after {
      right: 0;
    }

    input {
      padding-left: 6px;
      padding-right: 32px;
      background-position: calc(100% - 10px) 10px;
    }
  }
}
</style>
