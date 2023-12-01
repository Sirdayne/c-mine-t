<template>
  <nav>
    <ol :class="$style['crumbs']">
      <li
        v-for="crumb in crumbs"
        :key="crumb.name"
        :class="$style['crumbs--item']"
        data-testid="podcast-breadcrumb-links"
      >
        <NuxtLink
          :to="crumb.path"
          :class="{
            [$style['crumbs--link']]: true,
            [$style['crumbs--link-active']]: crumb.path && isActiveLink(crumb.path),
          }"
        >
          <span :class="$style['capitalize']">{{ crumb.name }}</span>
        </NuxtLink>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute } from '~/lib/framework';
import { type Breadcrumb } from '~/components/Shared/Breadcrumbs.vue';

export default defineComponent({
  name: 'PodcastsBreadcrumbs',
  props: {
    title: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const route = useRoute();

    const fullPath = computed(() => route.value.fullPath);

    const crumbs = computed(() => {
      const result: Breadcrumb[] = [
        {
          name: 'home',
          path: '/',
        },
        {
          name: 'podcasts',
          path: '/podcasts',
        },
      ];

      if (props.title && fullPath.value) result.push({ name: props.title, path: fullPath.value });

      return result;
    });
    const isActiveLink = (currentPath: string) => {
      return currentPath === route.value.path;
    };

    return {
      isActiveLink,
      crumbs,
    };
  },
});
</script>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';
.crumbs {
  list-style: none;
  color: #fff;
  margin-bottom: 28px;
  margin-top: 0;
  padding-top: 24px;
  padding-left: 0;
  &--item {
    display: inline;
    &:after {
      content: url('/assets/img/dropdown-arrow.svg');
      width: 16px;
      height: 16px;
      opacity: 0.8;
      transform: rotate(-90deg);
      display: inline-flex;
      align-items: center;
      margin: 0 4px 0 8px;
    }
    &:last-child:after {
      content: '';
    }
  }
  &--link {
    text-decoration: none;
    font-size: 16px;
    line-height: 24px;
    color: $color-white;
    opacity: 0.7;
    font-style: normal;
    font-weight: 400;
    &-active {
      opacity: 1;
    }
    &:hover {
      color: $color-orange-500;
      text-decoration: underline;
      opacity: 1;
    }
  }
}
.capitalize {
  text-transform: capitalize;
}
</style>
