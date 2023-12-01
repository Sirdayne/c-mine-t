<template>
  <form
    ref="form"
    class="header-search"
    :class="[isRtl && 'header-search_rtl', isAsia && 'header-search_asia']"
    tabindex="-1"
    autocomplete="off"
    @submit.prevent="handleSubmit"
    @click.capture.stop="handleClick"
  >
    <label class="header-search__label">
      <input
        ref="searchInput"
        v-model="searchQuery"
        class="input header-search__input"
        type="text"
        name="query"
        data-testid="search-input"
        autocomplete="off"
      />
    </label>
    <button
      class="btn header-search__submit-btn"
      type="submit"
      data-testid="search-input-submit-button"
    >
      {{ i18n.searchButtonCap }}
    </button>
  </form>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ROOT } from '~/store/types';

const SEARCH_URL = '/search';

export default {
  name: 'HeaderSearch',
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
      isAsia: ROOT.IS_ASIA,
    }),
  },
  mounted() {
    this.bindOutsideClick();
  },
  beforeDestroy() {
    this.unbindOutsideClick();
  },
  methods: {
    handleClick: () => {},
    handleSubmit() {
      const query = encodeURI(this.searchQuery.trim());
      if (!query.length) {
        this.$refs.searchInput.focus();
        return;
      }
      const { name } = this.$refs.searchInput;
      this.$router.push({ path: SEARCH_URL, query: { [name]: query } });
      setTimeout(() => {
        this.searchQuery = '';
        this.$emit('close-search');
      }, 1000);
    },
    focus() {
      const searchInput = this.$refs.searchInput;
      if (!searchInput || typeof searchInput.focus !== 'function') {
        return;
      }
      searchInput.focus();
    },
    bindOutsideClick() {
      document.addEventListener('click', this.handleOutsideClick);
    },
    unbindOutsideClick() {
      document.removeEventListener('click', this.handleOutsideClick);
    },
    handleOutsideClick() {
      this.$emit('close-search');
    },
  },
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';

.header-search {
  width: 320px;
  display: flex;
  padding: $gutter;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #253137;
  outline: none;
  backface-visibility: hidden;
  transform-origin: center 0 0;
}
.header-search__label {
  flex-grow: 1;
  display: block;
  width: 70%;
}
.header-search__input {
  padding: 8px 16px;
  background-color: #ffffff;
  width: 100%;
}
.header-search__submit-btn {
  min-width: 30%;
  text-align: center;
  flex-shrink: 0;
  padding: 0 16px;
  box-sizing: border-box;
  font-size: 0.875rem;
  font-weight: bold;
  color: #233138;
  background-color: #ffc200;
  transition: color 0.15s, background-color 0.15s;
}
.header-search__submit-btn:hover {
  color: #ffffff;
  background-color: #162025;
}
.header-search_rtl {
  direction: rtl;
}
</style>
