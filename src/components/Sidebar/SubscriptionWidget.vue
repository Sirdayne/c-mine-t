<template>
  <div
    class="subscription-widget"
    @click.prevent="clickHandler"
  >
    <div
      v-if="customOptions.title"
      class="subscription-widget__title"
    >
      {{ customOptions.title }}
    </div>
    <div
      v-if="customOptions.btnLabel"
      class="subscription-widget__btn-wrap"
    >
      <button class="subscription-widget__btn">
        {{ customOptions.btnLabel }}
      </button>
    </div>
    <div class="subscription-widget__image-wrap">
      <img
        class="subscription-widget__image"
        src="https://s3.cointelegraph.com/storage/uploads/view/f1031d811aa60a6661b435ad45d94ef1.png"
        srcset="
          https://s3.cointelegraph.com/storage/uploads/view/f1031d811aa60a6661b435ad45d94ef1.png 1x,
          https://s3.cointelegraph.com/storage/uploads/view/3095c197b91f1148f452d41453fd1971.png 2x
        "
        alt=""
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { SUBSCRIPTIONS_MODAL } from '~/store/types';
import { pushDataLayerEvent, subscriptionsBannersEvents } from '~/assets/helpers/dataLayerEvents';

export default {
  name: 'SubscriptionWidget',
  props: {
    widgetOptions: {
      type: Object,
      default: () => ({}),
    },
    isInViewport: {
      type: Boolean,
    },
  },
  computed: {
    customOptions() {
      const { options = {} } = this.widgetOptions;
      return options;
    },
  },
  watch: {
    isInViewport: {
      handler(newValue) {
        return newValue && this.pushImpressionEvent();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions('subscriptionsModal', {
      setIsShown: SUBSCRIPTIONS_MODAL.SET_IS_SHOWN,
    }),
    clickHandler() {
      this.setIsShown(true);
      this.pushClickEvent();
    },
    getDataLayerEventData() {
      const { widgetOptions } = this;
      return subscriptionsBannersEvents(widgetOptions.place);
    },
    pushClickEvent() {
      const dataLayerEventData = this.getDataLayerEventData();
      pushDataLayerEvent({
        type: 'click',
        dataLayerEventData,
      });
    },
    pushImpressionEvent() {
      const dataLayerEventData = this.getDataLayerEventData();
      pushDataLayerEvent({
        type: 'impression',
        dataLayerEventData,
      });
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.subscription-widget {
  background: #f6f6f6;
  cursor: pointer;
  padding-top: 26px;
}
.subscription-widget__title {
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 28px;
  text-align: center;
  letter-spacing: -0.02em;
  color: #253137;
  margin: 0 34px;
}
.subscription-widget__btn-wrap {
  margin: 22px auto 0;
}
.subscription-widget__btn {
  height: 50px;
  background: #fabf2c;
  font-weight: 600;
  font-size: 1rem;
  line-height: 22px;
  text-align: center;
  color: #1a1b1d;
  border: none;
  box-sizing: border-box;
  padding: 0 18px;
  display: block;
  outline: none;
  cursor: pointer;
  margin: 0 auto;
  transition: background-color 0.15s, color 0.15s;
}
.subscription-widget__btn:active {
  background-color: #253137;
  color: #ffffff;
}
.subscription-widget__image-wrap {
  margin-top: 19px;
}
.subscription-widget__image {
  display: block;
  width: 100%;
}

@media (min-width: $lg) {
  .subscription-widget__btn {
    font-size: 1.125rem;
    max-width: none;
    padding-left: 34px;
    padding-right: 34px;
    width: auto;
  }
}

@media (hover: hover) {
  .subscription-widget:hover .subscription-widget__btn {
    background-color: #253137;
    color: #ffffff;
  }
}
</style>
