<template>
  <div
    class="header-mobile-search"
    tabindex="-1"
    :class="isRtl && 'header-mobile-search_rtl'"
    @click.self="handleClose"
  >
    <form
      class="container header-mobile-search-form"
      autocomplete="off"
      data-testid="search-input-mobile-submit"
      @submit.prevent="handleSubmit"
    >
      <button
        class="btn header-mobile-search-form__btn"
        type="submit"
      >
        <span class="btn__wrp">
          <span class="btn header-mobile-search-form__magnifier-icon" />
        </span>
      </button>
      <label class="header-mobile-search-form__label">
        <input
          ref="searchInput"
          v-model="searchQuery"
          :placeholder="i18n.searchButtonCap"
          class="input header-mobile-search-form__input"
          type="text"
          name="query"
          data-testid="search-input-mobile"
          autocomplete="off"
          autofocus
        />
      </label>
      <button
        class="btn header-mobile-search-form__btn"
        @click.prevent="handleClose"
      >
        <span class="btn__wrp">
          <span class="btn header-mobile-search-form__cross-icon" />
        </span>
      </button>
    </form>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { ROOT, MENU, VIEWPORT } from '~/store/types';

const SEARCH_URL = '/search';

export default {
  name: 'HeaderMobileSearch',
  data() {
    return {
      searchQuery: '',
    };
  },
  computed: {
    ...mapState({
      i18n: ({ i18n }) => i18n,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
    ...mapState('menu', {
      isSearchOpened: ({ isSearchOpened }) => isSearchOpened,
    }),
  },
  watch: {
    isSearchOpened(newValue) {
      return newValue ? this.$refs.searchInput.focus() : this.clearQuery();
    },
  },
  methods: {
    ...mapActions('menu', {
      closeSearch: MENU.CLOSE_SEARCH,
    }),
    ...mapActions('viewport', {
      lockScroll: VIEWPORT.SET_LOCK_SCROLL,
    }),
    handleClose() {
      this.closeSearch();
      this.lockScroll(false);
    },
    handleSubmit() {
      const query = encodeURI(this.searchQuery.trim());
      if (!query.length) {
        this.$refs.searchInput.focus();
        return;
      }
      this.handleClose();
      const { name } = this.$refs.searchInput;
      window.location.href = `${SEARCH_URL}?${name}=${query}`;
    },
    clearQuery() {
      this.searchQuery = '';
    },
  },
};
</script>

<style scoped lang="scss">
@use '~/assets/styles/_icons-common.scss' as icons;
@import '~/assets/styles/_vars.scss';

.header-mobile-search {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  will-change: transform;
  animation: search-slide 0.3s cubic-bezier(0.7, 0, 0.3, 1) both;
}
.header-mobile-search-form {
  position: relative;
  display: flex;
  justify-content: center;
  height: 47px;
  align-items: center;
  width: 100%;
  min-width: 100%;
  padding: 8px 20px;
  background-color: #ffffff;
}
.header-mobile-search-form__btn {
  display: block;
  width: 30px;
  height: 20px;
}
.header-mobile-search-form__magnifier-icon,
.header-mobile-search-form__cross-icon {
  width: 14px;
  height: 14px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.header-mobile-search-form__magnifier-icon {
  @include icons.magnifier;
}
.header-mobile-search-form__cross-icon {
  @include icons.cross;
}
.header-mobile-search-form__label {
  width: 100%;
  height: 20px;
  padding: 0 15px;
  margin: 0 15px;
}
.header-mobile-search-form__input {
  width: 100%;
  height: 20px;
  line-height: 20px;
  font-size: 1rem;
  border: none;
  outline: none;
}
</style>
