<template>
  <div
    class="subscriptions-modal-item"
    :class="item.isSelected && 'subscriptions-modal-item_selected'"
    @click.passive="clickHandler"
    @mouseenter.passive="mouseenterHandler"
    @mouseleave.passive="mouseleaveHandler"
  >
    <div class="subscriptions-modal-item__checkbox" />
    <div class="subscriptions-modal-item__text-wrp">
      <div
        v-if="item.modalListItemName"
        class="subscriptions-modal-item__name"
      >
        {{ item.modalListItemName }}
      </div>
      <div
        v-if="item.modalListItemDescription"
        class="subscriptions-modal-item__description"
      >
        <span class="subscriptions-modal-item__description-desktop">
          {{ item.modalListItemDescription }}
        </span>
        <span class="subscriptions-modal-item__description-mobile">
          {{ item.modalListItemDescriptionMobile }}
        </span>
      </div>
      <div
        v-if="item.modalListItemRegularity"
        class="subscriptions-modal-item__regularity"
      >
        {{ item.modalListItemRegularity }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubscriptionsModalItem',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    clickHandler() {
      const { item } = this;
      this.$emit('select', item);
    },
    mouseenterHandler() {
      const { item } = this;
      this.$emit('mouseenter', item);
    },
    mouseleaveHandler() {
      this.$emit('mouseleave', {});
    },
  },
};
</script>

<style lang="scss">
@use '~/assets/styles/_icons-subscriptions-modal.scss' as icons;
@import '~/assets/styles/_vars.scss';

.subscriptions-modal-item {
  background: #ffffff;
  border: 1px solid #ebebeb;
  box-sizing: border-box;
  padding: 15px;
  display: flex;
  align-items: center;
  transition: background-color 0.15s, border-color 0.15s;
}
.subscriptions-modal-item__checkbox {
  width: 24px;
  height: 24px;
  background: #ffffff;
  border: 1px solid #ebebeb;
  box-sizing: border-box;
  flex: 0 0 24px;
  transition: border-color 0.15s;
}
.subscriptions-modal-item__text-wrp {
  margin-left: 10px;
  flex-grow: 1;
}
.subscriptions-modal-item__name,
.subscriptions-modal-item__description {
  color: #253137;
  line-height: 20px;
}
.subscriptions-modal-item__description,
.subscriptions-modal-item__regularity {
  margin-top: 5px;
}
.subscriptions-modal-item__name {
  font-weight: 600;
  font-size: 16px;
}
.subscriptions-modal-item__description {
  font-weight: 400;
  font-size: 14px;
  letter-spacing: -0.01em;
}
.subscriptions-modal-item__description-desktop {
  display: none;
}
.subscriptions-modal-item__regularity {
  font-size: 0.75rem;
  color: #253137;
  font-weight: 600;
}
.subscriptions-modal-item__description:first-child,
.subscriptions-modal-item__regularity:first-child {
  margin-top: 0;
}
.subscriptions-modal-item__text-wrp:first-child {
  margin-left: 0;
}

.subscriptions-modal-item_selected {
  background-color: #fabf2c;
  border-color: #fabf2c;
}
.subscriptions-modal-item_selected .subscriptions-modal-item__checkbox {
  @include icons.check();
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 16px;
  border-color: #ffffff;
}

@media (min-width: $md) {
  .subscriptions-modal-item {
    padding: 10px 10px 10px 15px;
  }
}
@media (min-width: $lg) {
  .subscriptions-modal-item {
    align-items: center;
  }
  .subscriptions-modal-item__description-mobile {
    display: none;
  }
  .subscriptions-modal-item__description-desktop {
    display: inline;
  }
}

@media (hover: hover) {
  .subscriptions-modal-item {
    cursor: pointer;
  }
  .subscriptions-modal-item:hover {
    background: #f6f6f6;
  }
  .subscriptions-modal-item_selected:hover {
    background-color: #fabf2c;
  }
}
</style>
