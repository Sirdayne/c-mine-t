<script setup lang="ts">
import { useStore } from '~/lib/framework';
import { computed } from 'vue';
import LinkResolver from '~/components/Shared/LinkResolver.vue';
import { ListItem } from '~/features/app-header/ListItem';

defineProps<{
  list: ListItem[];
}>();

const store = useStore();
const languageShort = computed(() => store.state.currentLanguage.short);
</script>

<template>
  <ul class="asia-menu-drawer-part__category-list">
    <li
      v-for="listItem in list"
      :key="listItem.id"
      class="asia-menu-drawer-part__category-item"
    >
      <a
        v-if="listItem.url && listItem.isExternal"
        class="asia-menu-drawer-part__category-name asia-menu-drawer-part__category-name_link"
        :class="!listItem.children.length && 'asia-menu-drawer-part__category-name_alone'"
        :href="listItem.url"
        :target="listItem.target"
      >
        {{ listItem.title }}
      </a>
      <LinkResolver
        v-else-if="listItem.url"
        class="asia-menu-drawer-part__category-name asia-menu-drawer-part__category-name_link"
        :class="!listItem.children.length && 'asia-menu-drawer-part__category-name_alone'"
        :to="listItem.url"
        :language-short="languageShort"
      >
        {{ listItem.title }}
      </LinkResolver>
      <span
        v-else
        class="asia-menu-drawer-part__category-name"
      >
        {{ listItem.title }}
      </span>
      <ul
        v-if="listItem.children.length"
        class="asia-menu-drawer-part__list"
      >
        <li
          v-for="item in listItem.children"
          :key="item.id"
          class="asia-menu-drawer-part__item"
        >
          <a
            v-if="item.url && item.isExternal"
            :href="item.url"
            :title="item.title"
            :target="listItem.target"
            class="asia-menu-drawer-part__item-link"
          >
            {{ item.title }}
          </a>
          <LinkResolver
            v-else
            class="asia-menu-drawer-part__item-link"
            :to="item.url"
            :language-short="languageShort"
          >
            {{ item.title }}
          </LinkResolver>
        </li>
      </ul>
    </li>
  </ul>
</template>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';

.asia-menu-drawer-part__category-list,
.asia-menu-drawer-part__list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.asia-menu-drawer-part__category-item:not(:first-child) {
  margin-top: 23px;
}
.asia-menu-drawer-part__item:not(:first-child) {
  margin-top: 10px;
}
.asia-menu-drawer-part__category-name,
.asia-menu-drawer-part__item-link {
  text-decoration: none;
  font-size: 0.75rem;
}
.asia-menu-drawer-part__category-name {
  color: #ffb405;
}
.asia-menu-drawer-part__item-link {
  color: #ffffff;
  font-weight: 600;
  line-height: 18px;
}

@media (max-width: $xxs) {
  .asia-menu-drawer-part__item-link {
    font-size: 0.75rem;
  }
}
</style>
