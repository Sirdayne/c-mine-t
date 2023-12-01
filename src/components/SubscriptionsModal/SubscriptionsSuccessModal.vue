<template>
  <div class="subscriptions-success-modal">
    <div class="subscriptions-success-modal__header">
      <button
        class="subscriptions-success-modal__close-btn"
        @click.passive="closeClickHandler"
      />
    </div>
    <div class="subscriptions-success-modal__body">
      <div
        v-if="localI18n.successModalTitle"
        class="subscriptions-success-modal__title"
      >
        {{ localI18n.successModalTitle }}
      </div>
      <div
        v-if="localI18n.successModalNotice"
        class="subscriptions-success-modal__notice"
      >
        {{ localI18n.successModalNotice }}
      </div>
      <div
        v-if="selectedItems"
        class="subscriptions-success-modal__items"
      >
        <div
          v-for="item in selectedItems"
          :key="item.id"
          class="subscriptions-success-modal__item-name"
        >
          {{ item.modalListItemName }}
        </div>
      </div>
      <button
        class="subscriptions-success-modal__btn"
        @click.passive="closeClickHandler"
      >
        {{ localI18n.successModalBtnLabel }}
      </button>
    </div>
    <div class="subscriptions-success-modal__footer">
      <img
        class="subscriptions-success-modal__footer-image"
        src="https://s3.cointelegraph.com/storage/uploads/view/f1031d811aa60a6661b435ad45d94ef1.png"
        srcset="
          https://s3.cointelegraph.com/storage/uploads/view/f1031d811aa60a6661b435ad45d94ef1.png 1x,
          https://s3.cointelegraph.com/storage/uploads/view/3095c197b91f1148f452d41453fd1971.png 2x
        "
        :alt="localI18n.successModalTitle"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubscriptionsSuccessModal',
  props: {
    selectedItems: {
      type: Array,
      default: () => [],
    },
    localI18n: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    closeClickHandler() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
@use '~/assets/styles/_icons-common.scss' as common-icons;

.subscriptions-success-modal {
  background-color: #ffffff;
}
.subscriptions-success-modal__header,
.subscriptions-success-modal__body,
.subscriptions-success-modal__footer {
  box-sizing: border-box;
}
.subscriptions-success-modal__header {
  height: 35px;
  position: relative;
}
.subscriptions-success-modal__body {
  padding-left: 40px;
  padding-right: 40px;
}
.subscriptions-success-modal__footer {
  margin-top: 30px;
  height: 0;
  position: relative;
  padding-top: 33.333%;
  box-sizing: border-box;
}
.subscriptions-success-modal__title,
.subscriptions-success-modal__notice {
  margin-top: 10px;
}
.subscriptions-success-modal__items {
  margin-top: 16px;
}
.subscriptions-success-modal__item-name {
  margin-top: 16px;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #253137;
}
.subscriptions-success-modal__title {
  font-weight: bold;
  font-size: 26px;
  line-height: 30px;
  letter-spacing: -0.02em;
  color: #253137;
}
.subscriptions-success-modal__notice {
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.01em;
  color: #798b95;
}
.subscriptions-success-modal__btn {
  height: 50px;
  background: #fabf2c;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  color: #1a1b1d;
  border: none;
  box-sizing: border-box;
  padding: 0 18px;
  display: block;
  width: 100%;
  margin-top: 32px;
  transition: background-color 0.15s, color 0.15s;
}
.subscriptions-success-modal__btn:active {
  background-color: #253137;
  color: #ffffff;
}
.subscriptions-success-modal__close-btn {
  @include common-icons.cross(#92989b);
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 20px;
  border: none;
  background-color: transparent;
  position: absolute;
  top: 10px;
  right: 10px;
  outline: none;
  padding: 0;
}
.subscriptions-success-modal__close-btn:active {
  @include common-icons.cross(#2d2e30);
}
.subscriptions-success-modal__footer-image {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.subscriptions-success-modal__title:first-child,
.subscriptions-success-modal__notice:first-child,
.subscriptions-success-modal__item-name:first-child,
.subscriptions-success-modal__items:first-child,
.subscriptions-success-modal__btn:first-child {
  margin-top: 0;
}

@media (hover: hover) {
  .subscriptions-success-modal__btn:hover {
    background-color: #253137;
    color: #ffffff;
    cursor: pointer;
  }
  .subscriptions-success-modal__close-btn:hover {
    cursor: pointer;
    @include common-icons.cross(#2d2e30);
  }
}
</style>
