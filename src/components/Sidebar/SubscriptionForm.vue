<template>
  <form
    class="subscription-form"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <span
      v-if="i18n.newsSubscriberTitle"
      class="subscription-form__title"
      v-html="i18n.newsSubscriberTitle"
    />
    <div
      v-if="isEn"
      class="subscription-form__choices"
    >
      <div class="subscription-form__choice">
        <Checkbox
          v-model="dailySubscription"
          class="subscription-form__checkbox"
          :cap="i18n.newsSubscriberDaily"
          :disabled="isPending"
        />
      </div>
      <div class="subscription-form__choice">
        <Checkbox
          v-model="weeklySubscription"
          class="subscription-form__checkbox"
          :cap="i18n.newsSubscriberWeekly"
          :disabled="isPending"
        />
      </div>
    </div>
    <label class="subscription-form__label">
      <input
        ref="input"
        v-model="email"
        class="input subscription-form__input"
        :class="message && 'subscription-form__input_has-popover'"
        type="email"
        :placeholder="i18n.newsSubscriberPlaceholder"
        :disabled="isPending"
        @focus="handleInputFocus"
      />
      <Transition name="fade-in-up">
        <span
          v-if="message"
          class="subscription-form__popover"
          :class="hasError && 'subscription-form__popover_error'"
          v-html="message"
        />
      </Transition>
    </label>
    <div class="subscription-form__action">
      <button
        class="btn subscription-form__submit-btn"
        type="submit"
        :class="isPending && 'btn_pending'"
        :disabled="isPending"
      >
        <span class="btn__wrp">
          <span class="btn__cap">
            {{ i18n.newsSubscriberSubscribe }}
          </span>
          <span class="btn__spinner" />
        </span>
      </button>
    </div>
  </form>
</template>

<script>
import find from 'lodash/find';
import { mapState } from 'vuex';
import getProperty from '~/assets/libs/getProperty';
import { validateEmail, submitForm } from '~/assets/helpers/subscribe';
import { pushDataLayerEvent, sidebarSubscriptionFormEvents } from '~/assets/helpers/dataLayerEvents';
import { DEFAULT_LANGUAGE, SUBSCRIBE_ACTIONS_BY_LANGUAGE } from '~/app.config';
import Checkbox from '~/components/Shared/Checkbox.vue';

const CLEAR_DELAY = 6000;

export default {
  name: 'SubscriptionForm',
  components: {
    Checkbox,
  },
  data() {
    return {
      isPending: false,
      hasError: false,
      dailySubscription: true,
      weeklySubscription: false,
      email: '',
      message: '',
    };
  },
  computed: {
    ...mapState({
      languageShort: ({ currentLanguage: { short } }) => short,
      i18n: ({ i18n }) => i18n,
    }),
    actionsUrls() {
      const { languageShort: currentShort } = this;
      const { short: defaultShort } = DEFAULT_LANGUAGE;
      const currentSubscribeList = getProperty(SUBSCRIBE_ACTIONS_BY_LANGUAGE, currentShort, []);
      return Array.isArray(currentSubscribeList) && currentSubscribeList.length
        ? currentSubscribeList
        : getProperty(SUBSCRIBE_ACTIONS_BY_LANGUAGE, defaultShort, []);
    },
    isEn() {
      return this.languageShort === 'en';
    },
    dataLayerEventData() {
      return sidebarSubscriptionFormEvents(this.dataLayerEventLabel);
    },
    dataLayerEventLabel() {
      const { dailySubscription, weeklySubscription } = this;
      switch (true) {
        case dailySubscription && weeklySubscription:
          return 'weekly/daily';
        case weeklySubscription && !dailySubscription:
          return 'weekly';
        default:
          return 'daily';
      }
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
      const urls = this.getSubscriptionUrls();
      if (validateEmail(email)) {
        await this.submitForm(email, urls);
        pushDataLayerEvent({
          type: 'send',
          dataLayerEventData: this.dataLayerEventData,
        });
        return undefined;
      }
      this.message = this.i18n.newsSubscriberError;
      this.hasError = true;
      return this.clearPopupOnTimeout();
    },
    async submitForm(email = '', urls = []) {
      if (!urls.length) return;
      this.isPending = true;
      const { message, error, hasStopPhrases } = await submitForm(email, ...urls);
      if (error && !hasStopPhrases) {
        this.message = message;
        this.hasError = true;
      }
      if (hasStopPhrases || !error) {
        this.message = this.i18n.newsSubscriberSuccess;
        this.success = true;
      }
      this.clearPopupOnTimeout({ resetEmail: true });
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
    getSubscriptionUrls() {
      const urls = [];
      const { url: dailyUrl } = find(this.actionsUrls, { slug: 'daily' }) || {};
      const { url: weeklyUrl } = find(this.actionsUrls, { slug: 'weekly' }) || {};
      if (!this.isEn || (!this.dailySubscription && !this.weeklySubscription)) {
        return this.actionsUrls.map(({ url }) => url);
      }
      if (this.dailySubscription && dailyUrl) {
        urls.push(dailyUrl);
      }
      if (this.weeklySubscription && weeklyUrl) {
        urls.push(weeklyUrl);
      }
      return urls;
    },
    handleInputFocus() {
      this.clearPopupOnTimeout({ force: true });
    },
  },
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/_vars.scss';

.subscription-form {
  display: block;
  width: 100%;
  padding: 24px 20px 20px;
  box-sizing: border-box;
  border: 1px solid #465a65;
  border-radius: 2px;
}
.subscription-form__title {
  display: block;
  margin-bottom: 24px;
  text-transform: uppercase;
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 32px;
  color: #324149;
}
.subscription-form__choices {
  display: flex;
  width: 100%;
  margin-bottom: 24px;
}
.subscription-form__choice {
  width: 50%;
}
.subscription-form__checkbox {
  max-width: 100%;
}
.subscription-form__label {
  display: block;
  position: relative;
}
.subscription-form__input {
  display: block;
  width: 100%;
  padding: 10px 15px;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: normal;
  color: #465a65;
  background-color: #ffffff;
  border: 1px solid #bababa;
  border-radius: 2px;
  transition: border-color 0.15s;
}
.subscription-form__input:focus {
  border-color: #465a65;
}
.subscription-form__input_has-popover {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.subscription-form__input::-webkit-input-placeholder {
  font-size: 0.875rem;
  font-weight: 300;
  line-height: normal;
  color: #afbdc4;
}
.subscription-form__input::-moz-placeholder {
  font-size: 0.875rem;
  font-weight: 300;
  line-height: normal;
  color: #afbdc4;
}
.subscription-form__input:-ms-input-placeholder {
  font-size: 0.875rem;
  font-weight: 300;
  line-height: normal;
  color: #afbdc4;
}
.subscription-form__input:-moz-placeholder {
  font-size: 0.875rem;
  font-weight: 300;
  line-height: normal;
  color: #afbdc4;
}
.subscription-form__action {
  position: relative;
  margin-top: 24px;
}
.subscription-form__submit-btn {
  width: 100%;
  padding: 13px 10px;
  box-sizing: border-box;
  text-transform: uppercase;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
  color: #ffffff;
  background-color: #3a464a;
  transition: background-color 0.15s, opacity 0.15s;
}
.subscription-form__submit-btn:hover {
  color: #eceff1;
  background-color: #253137;
}
.subscription-form__submit-btn:disabled {
  color: #ffffff;
  background-color: #253136;
  opacity: 1;
}
.subscription-form__popover {
  position: absolute;
  top: 100%;
  z-index: 1;
  width: 100%;
  margin-top: -1px;
  padding: 5px 13px;
  box-sizing: border-box;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1;
  color: #ffffff;
  background-color: #3abc98;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
}
.subscription-form__popover_error {
  background-color: #ff4a68;
}

@media (min-width: $lg) {
  .subscription-form__title {
    font-size: 1.875rem;
  }
}
</style>
