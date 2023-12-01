<template>
  <nav :class="['search-nav', isRtl && 'search-nav__rtl']">
    <div
      class="search-nav__to-top"
      data-testid="search-to-top-button"
    >
      <a
        href="#"
        rel="noopener"
        @click.prevent="backToTop"
      >
        <span class="to-top-icon" />
        {{ i18n.backToTop }}
      </a>
    </div>
    <div
      v-if="hasMore"
      class="search-nav__load-more"
      data-testid="search-load-more-button"
    >
      <a
        href="#"
        rel="noopener"
        :class="{ loading }"
        @click.prevent="$emit('load-more')"
      >
        <div class="more-icon" />
        {{ loading ? i18n.postsLoading : i18n.postsLoadMore }}
      </a>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ROOT } from '~/store/types';

export default {
  name: 'SearchNavPanel',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    hasMore: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState({
      i18n: ({ i18n }) => i18n,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
  },
  methods: {
    backToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@use '~/assets/styles/_icons-common.scss' as icons;
@import '~/assets/styles/_vars.scss';

.search-nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 15px;
  min-height: 60px;

  &__to-top {
    display: none;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    z-index: 1000;

    @media (min-width: $sm) {
      display: inline-block;
    }

    a {
      color: #010101;
      font-size: 14px;
      background: none;
      text-decoration: none;
      display: flex;
      align-items: center;

      &:hover {
        text-decoration: underline;
      }

      .to-top-icon {
        width: 12px;
        height: 12px;
        margin-right: 8px;
        @include icons.arrow-up-smooth;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
  }

  &__load-more {
    a {
      color: #000;
      text-decoration: none;
      display: flex;
      align-items: center;
      font-size: 14px;
      white-space: nowrap;
      padding: 8px 10px;
      border: 2px solid transparent;
      background: transparent;

      &:hover {
        border: 2px solid #ffcd04;
        color: #010101;
      }

      &:active,
      &:focus {
        background: #ffcd04;
        color: #010101;
      }

      .more-icon {
        width: 12px;
        height: 12px;
        margin-right: 8px;
        @include icons.arrow-clockwise;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      }

      &.loading .more-icon {
        animation: spin infinite linear 1s;
      }
    }
  }

  &__rtl {
    .more-icon,
    .to-top-icon {
      margin-right: 0px;
      margin-left: 8px;
    }
  }
}
</style>

<style>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
