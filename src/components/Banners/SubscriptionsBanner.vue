<template>
  <div
    class="subscription-banner"
    :class="`subscription-banner_${place}`"
    @click.prevent="clickHandler"
  >
    <div
      v-if="i18n.indexSubscriptionsBannerTitle"
      class="subscription-banner__title"
    >
      {{ i18n.indexSubscriptionsBannerTitle }}
    </div>
    <div class="subscription-banner__btn-wrp">
      <button class="subscription-banner__btn">
        {{ i18n.indexSubscriptionsBannerButtonLabel }}
      </button>
    </div>
    <div class="subscription-banner__image-wrp">
      <img
        class="subscription-banner__image"
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
  name: 'SubscriptionsBanner',
  props: {
    i18n: {
      type: Object,
      default: () => ({}),
    },
    place: {
      type: String,
      default: 'index',
    },
    isInViewport: {
      type: Boolean,
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
      const { place } = this;
      return subscriptionsBannersEvents(place);
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

.subscription-banner {
  background: #f6f6f6;
  cursor: pointer;
  padding-top: 26px;
}
.subscription-banner__title {
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 28px;
  text-align: center;
  letter-spacing: -0.02em;
  color: #253137;
  margin: 0 34px;
}
.subscription-banner__btn-wrp {
  margin: 22px auto 0;
}
.subscription-banner__btn {
  height: 50px;
  background: #fabf2c;
  font-weight: 600;
  font-size: 1rem;
  line-height: 22px;
  text-align: center;
  color: #1a1b1d;
  max-width: 244px;
  border: none;
  box-sizing: border-box;
  padding: 0 4px;
  display: block;
  width: 100%;
  outline: none;
  cursor: pointer;
  margin: 0 auto;
  transition: background-color 0.15s, color 0.15s;
}
.subscription-banner__image-wrp {
  margin-top: 19px;
}
.subscription-banner__image {
  display: block;
  width: 100%;
}
.subscription-banner:active .subscription-banner__btn {
  background-color: #253137;
  color: #ffffff;
}

@media (min-width: $xs) {
  .subscription-banner {
    padding-top: 20px;
  }
  .subscription-banner__title {
    margin: 0 24px;
    font-size: 1.75rem;
  }
  .subscription-banner__btn-wrp {
    margin-top: 16px;
  }
  .subscription-banner__image-wrp {
    margin-top: 4px;
  }
}
@media (min-width: $sm) {
  .subscription-banner {
    padding: 0 20px 0 0;
    display: flex;
    align-items: center;
    background-color: #ffffff;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  }
  .subscription-banner__title,
  .subscription-banner__btn-wrp,
  .subscription-banner__image-wrp {
    margin: 0;
    flex: 0 0 33.33%;
  }
  .subscription-banner__title {
    font-size: 1.5rem;
  }
  .subscription-banner__btn {
    font-size: 0.875rem;
    max-width: 167px;
    padding: 0 30px;
    line-height: 16px;
    margin-right: 0;
    height: 45px;
  }
  .subscription-banner__image-wrp {
    order: -1;
  }
  .subscription-banner__image {
    max-width: 211px;
  }

  .subscription-banner_article_mobile .subscription-banner__title {
    font-size: 1.25rem;
    line-height: 22px;
  }
}
@media (min-width: $md) {
  .subscription-banner__title {
    flex-basis: 50%;
  }
  .subscription-banner__btn-wrp,
  .subscription-banner__image-wrp {
    flex-basis: 25%;
  }
}
@media (min-width: $lg) {
  .subscription-banner {
    justify-content: space-between;
    padding-right: 10px;
  }
  .subscription-banner__btn-wrp,
  .subscription-banner__title,
  .subscription-banner__image-wrp {
    flex-basis: auto;
  }
  .subscription-banner__title {
    font-weight: bold;
    font-size: 1.75rem;
    line-height: 32px;
    text-align: center;
    letter-spacing: -0.02em;
  }
  .subscription-banner__btn {
    max-width: none;
    font-size: 1.125rem;
    padding: 0 40px;
    width: auto;
    line-height: 25px;
  }
}

@media (hover: hover) {
  .subscription-banner:hover .subscription-banner__btn {
    background-color: #253137;
    color: #ffffff;
  }
}
</style>
