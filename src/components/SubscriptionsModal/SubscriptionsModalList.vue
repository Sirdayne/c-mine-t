<template>
  <div class="subscriptions-modal-list">
    <SubscriptionsModalItem
      v-for="(item, index) in list"
      :key="index"
      :item="item"
      class="item-modal-list__item"
      @select.passive="onSelectHandler"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SubscriptionsModalItem from './SubscriptionsModalItem';

export default {
  name: 'SubscriptionsModalList',
  components: {
    SubscriptionsModalItem,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState('subscriptionsModal', {
      localI18n: ({ i18n }) => i18n,
    }),
  },
  methods: {
    onSelectHandler(payload) {
      this.$emit('select', payload);
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.item-modal-list__item {
  margin-top: 15px;
}
.item-modal-list__item:first-child {
  margin-top: 0;
}
</style>
