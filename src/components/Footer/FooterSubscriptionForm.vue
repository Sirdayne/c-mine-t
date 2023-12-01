<template>
  <form
    class="footer-subscription-form"
    novalidate
    :class="[isRtl && 'footer-subscription-form_rtl']"
    @submit.prevent="handleSubmit"
  >
    <div class="footer-subscription-form__wrp">
      <label
        class="visually-hidden"
        for="footer-subscription-form-input"
      >
        {{ i18n.newsSubscriberEmail }}
      </label>
      <input
        id="footer-subscription-form-input"
        ref="input"
        v-model="email"
        class="input footer-subscription-form__input"
        type="email"
        :placeholder="i18n.subscribeEmailLabel"
        :disabled="isPending"
        data-testid="footer-subscription-form-input"
        @focus="handleInputFocus"
      />
      <button
        class="btn footer-subscription-form__btn"
        type="submit"
        :class="isPending && 'btn_pending'"
        :disabled="isPending"
        data-testid="footer-subscribe-submit-button"
      >
        {{ i18n.subscribeButtonCap }}
      </button>
    </div>
    <Transition name="appear-from-top">
      <span
        v-if="message"
        class="footer-subscription-form__popup"
        :class="hasError && 'footer-subscription-form__popup_error'"
        data-testid="footer-subscribe-notification"
        v-html="message"
      />
    </Transition>
  </form>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { validateEmail } from '~/assets/helpers/subscribe';
import { subscribeMailList } from '~/api/modules/subscriptions';
import { FOOTER_SUBSCRIBE_ACTIONS_BY_LANGUAGE } from '~/app.config';
import { footerSubscriptionFormEvents, pushDataLayerEvent } from '~/assets/helpers/dataLayerEvents';
import { ROOT } from '~/store/types';

const CLEAR_DELAY = 6000;

export default {
  name: 'FooterSubscriptionForm',
  data() {
    return {
      isPending: false,
      hasError: false,
      email: '',
      message: '',
    };
  },
  computed: {
    ...mapState({
      languageShort: ({ currentLanguage: { short } }) => short,
      i18n: ({ i18n }) => i18n,
    }),
    ...mapState('viewport', {
      isMobile: ({ userDeviceType: { any } }) => any,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),

    dataLayerEventData() {
      return footerSubscriptionFormEvents(this.isMobile);
    },
  },
  mounted() {
    this.clearMessageTimer = null;
  },
  beforeDestroy() {
    clearTimeout(this.clearMessageTimer);
  },
  methods: {
    async handleSubmit() {
      const email = this.email.trim();
      let subscriptionIds = FOOTER_SUBSCRIBE_ACTIONS_BY_LANGUAGE[this.languageShort];
      if (!Array.isArray(subscriptionIds)) subscriptionIds = [subscriptionIds];

      if (validateEmail(email)) {
        await this.submitForm({ email, subscriptionIds });
        pushDataLayerEvent({
          type: 'send',
          dataLayerEventData: this.dataLayerEventData,
        });
        return undefined;
      }
      this.message = this.i18n.subscribeError;
      this.hasError = true;
      return this.clearPopupOnTimeout();
    },
    async submitForm(mailList) {
      this.isPending = true;
      const { errors } = await subscribeMailList(mailList);
      this.hasError = Boolean(errors);
      if (!errors) {
        this.message = this.i18n.inArticleSubscriptionFormSuccessMsg;
        this.isSuccess = true;
        this.clearPopupOnTimeout({ resetEmail: true });
      } else {
        this.message = errors;
      }

      this.isPending = false;
    },
    clearPopupOnTimeout({ resetEmail = false, force = false } = {}) {
      clearTimeout(this.clearMessageTimer);
      const timeout = force ? 0 : CLEAR_DELAY;
      if (resetEmail) this.email = '';
      this.clearMessageTimer = setTimeout(() => {
        this.message = '';
        this.hasError = false;
      }, timeout);
    },
    handleInputFocus() {
      this.clearPopupOnTimeout({ force: true });
    },
  },
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';
.footer-subscription-form {
  position: relative;
}
.footer-subscription-form__wrp {
  display: flex;
  width: 100%;
  height: 50px;
  border-radius: 5px;
  overflow: hidden;
}
.footer-subscription-form__input {
  width: 100%;
  padding: 0 15px;
  color: #afbdc4;
  background: #253136;
  border-radius: 0;
}
.footer-subscription-form__input::-webkit-input-placeholder,
.footer-subscription-form__input::-moz-placeholder,
.footer-subscription-form__input:-ms-input-placeholder,
.footer-subscription-form__input:-moz-placeholder {
  color: #788287;
  opacity: 1;
  transition: transform 0.15s, opacity 0.15s;
}
.footer-subscription-form__input:focus {
  outline: none;
}
.footer-subscription-form__input:focus::-moz-placeholder,
.footer-subscription-form__input:focus:-ms-input-placeholder,
.footer-subscription-form__input:focus:-moz-placeholder,
.footer-subscription-form__input:focus::-webkit-input-placeholder {
  opacity: 0;
  transform: translateX(15px);
}
.footer-subscription-form__btn:hover {
  background: #2c3336;
  color: #fff;
}
.footer-subscription-form__btn {
  min-width: 110px;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1b1d;
  background-color: #fabf2b;
  transition: 0.25s ease-out;
}
@media (hover: hover) {
  .footer-subscription-form__btn:hover {
    color: #ffffff;
    background-color: #253136;
  }
}
.footer-subscription-form__btn:disabled {
  color: #ffffff;
  background-color: #253136;
  opacity: 1;
}
.footer-subscription-form__popup {
  position: absolute;
  bottom: calc(100% + 4px);
  z-index: 1;
  left: 0;
  width: 100%;
  padding: 5px 12px;
  box-sizing: border-box;
  font-size: 0.75rem;
  font-weight: 400;
  color: #ffffff;
  border-radius: 2px;
  background-color: #3abc98;
}
.footer-subscription-form__popup_error {
  background-color: #ff4a68;
}
.footer-subscription-form_rtl {
  direction: rtl;
}
.footer-subscription-form_rtl .footer-subscription-form__input:focus::-moz-placeholder,
.footer-subscription-form_rtl .footer-subscription-form__input:focus:-ms-input-placeholder,
.footer-subscription-form_rtl .footer-subscription-form__input:focus:-moz-placeholder,
.footer-subscription-form_rtl .footer-subscription-form__input:focus::-webkit-input-placeholder {
  transform: translateX(-15px);
}
@media (min-width: $lg) {
  .footer-subscription-form__btn {
    min-width: 130px;
    font-size: 1.125rem;
  }
}
</style>
