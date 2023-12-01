<template>
  <div class="newsletter-page__popup">
    <form @submit.prevent="submitHandler">
      <div class="newsletter-popup-container">
        <div
          v-if="!isSuccess"
          class="newsletter-popup__details"
        >
          <p>
            You have selected {{ checkedSubscriptions.length }} newsletter{{
              checkedSubscriptions.length > 1 ? 's' : ''
            }}.
          </p>
          <p>
            {{
              checkedSubscriptions.length > 9
                ? i18n.newsletterPagePopupDetailsEnter
                : i18n.newsletterPagePopupDetailsMore
            }}
          </p>
        </div>
        <div
          v-if="isSuccess"
          class="newsletter-subscription-widget-form__success-msg"
          v-html="i18n.inArticleSubscriptionFormSuccessMsg"
        />
        <div
          v-if="!isSuccess"
          class="newsletter-popup__form"
        >
          <Transition name="fade-in-up">
            <div
              v-if="hasError"
              class="newsletter-subscription-widget-form__error-msg"
            >
              {{ i18n.inArticleSubscriptionFormEmailErrorMsg }}
            </div>
          </Transition>
          <Transition
            mode="out-in"
            name="fade"
          >
            <div
              v-if="!isSuccess"
              class="newsletter-popup__input-panel"
            >
              <input
                id="input"
                ref="input"
                type="email"
                :placeholder="i18n.newsSubscriberPlaceholder"
                :value="email"
                :disabled="pending"
                @input="inputHandler"
                @focus.passive="clearMessage(true)"
                @change="changeHandler($event)"
              />
              <button
                type="submit"
                :disabled="pending"
              >
                {{ i18n.inArticleSubscriptionFormBtnLabel }}
              </button>
            </div>
          </Transition>
          <p
            v-if="!isSuccess"
            class="newsletter-popup__terms-text"
          >
            By filling out this form, you agree to our
            <a
              target="_blank"
              href="/terms-and-privacy"
            >
              Terms of Services and Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { validateEmail } from '~/assets/helpers/subscribe';
import { buildActionUrl } from '~/assets/helpers/subscriptions';
import { subscribeMailList } from '~/api/modules/subscriptions';

const MESSAGE_CLEAR_DELAY = 6000;

export default {
  name: 'NewsletterSubscriptionPopup',
  props: {
    checkedSubscriptions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      email: '',
      pending: false,
      hasError: false,
      isSuccess: false,
      message: '',
    };
  },
  computed: {
    ...mapState({
      i18n: ({ i18n }) => i18n,
    }),
    mailList() {
      const { email, checkedSubscriptions } = this;
      return checkedSubscriptions.map((t) => ({
        email,
        url: buildActionUrl(t),
      }));
    },
  },
  methods: {
    changeHandler(e) {
      this.email = e.target.value;
    },
    async submitHandler() {
      if (!this.email) this.$refs.input.focus();

      const { pending, email, mailList } = this;
      if (pending) {
        return;
      }
      if (validateEmail(email)) {
        await this.submitForm(email, mailList);
      } else {
        this.hasError = true;
        this.message = this.i18n.inArticleSubscriptionFormEmailErrorMsg;
        this.scheduleClearMessage();
      }
    },
    async submitForm(email, mailList) {
      if (!mailList.length) {
        return;
      }
      this.pending = true;
      const { errors } = await subscribeMailList(mailList);
      this.hasError = Boolean(errors);
      if (errors) {
        this.message = errors;
      } else {
        this.message = this.i18n.inArticleSubscriptionFormSuccessMsg;
        this.isSuccess = true;
        this.email = '';
        this.$emit('subscribed');
      }
      this.scheduleClearMessage();
      this.pending = false;
    },
    clearMessage() {
      this.message = '';
      this.hasError = false;
      this.isSuccess = false;
    },
    scheduleClearMessage(force = false) {
      clearTimeout(this.messageTimer);
      const timeout = force ? 0 : MESSAGE_CLEAR_DELAY;
      this.messageTimer = setTimeout(() => {
        this.clearMessage();
      }, timeout);
    },
    inputHandler({ target }) {
      this.$emit('input', target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_vars.scss';
.newsletter-page__popup {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: block;
  background-color: #f1f3f4;
  z-index: 1;
  border-radius: 20px 20px 0 0;
}
.newsletter-popup-container {
  display: flex;
  width: 60%;
  margin: 0 auto;
  padding: 40px 0 20px;
  align-content: space-between;
  justify-content: space-between;
  @media screen and (max-width: $xs) {
    width: 90%;
    flex-direction: column;
    padding: 20px;
  }
}
.newsletter-popup__details {
  width: 45%;
}
.newsletter-popup__details p {
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 26px;
  color: #171a1c;
  margin: 0;
}
.newsletter-popup__form {
  width: 52%;
}
.newsletter-popup__input-panel {
  display: flex;
  align-content: space-between;
  justify-content: space-between;
}
.newsletter-popup__input-panel input[type='email'] {
  padding: 15px 20px;
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  border: none;
  outline: none;
  border-radius: 10px;
  width: -webkit-fill-available;
  margin-right: 10px;
}
.newsletter-popup__input-panel button {
  background: #fabf2c;
  border-radius: 10px;
  padding: 12px 45px;
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 24px;
  color: #171a1c;
  border: none;
  outline: none;
  cursor: pointer;
}

.newsletter-popup__terms-text {
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 17px;
  text-align: center;
  color: #35434a;
  margin-top: 13px;
  margin-bottom: 0;
}
.newsletter-popup__terms-text a {
  font-weight: 600;
  color: #35434a;
  text-decoration: underline;
}
.newsletter-subscription-widget-form__error-msg {
  margin: 10px 0;
  font-style: italic;
  color: #c00000;
}
.newsletter-subscription-widget-form__success-msg {
  margin: 10px auto;
  text-align: center;
  font-style: italic;
  font-weight: 700;
  font-size: 20px;
  line-height: 26px;
  color: #171a1c;
}
@media only screen and (min-width: $sm) and (max-width: $md) {
  .newsletter-popup-container {
    width: 90%;
    flex-wrap: wrap;
    flex-direction: column;
  }
  .newsletter-popup__details {
    width: 100%;
    text-align: center;
    padding-bottom: 20px;
  }
  .newsletter-popup__form {
    width: 100%;
  }
}
@media only screen and (min-width: $md) and (max-width: $lg) {
  .newsletter-popup-container {
    width: 90%;
  }
}

@media only screen and (max-width: $sm) {
  .newsletter-popup__details {
    width: 100%;
    text-align: center;
    padding-bottom: 20px;
  }
  .newsletter-popup__form {
    width: 100%;
  }
  .newsletter-popup__input-panel {
    flex-wrap: wrap;
    flex-direction: column;
  }
  .newsletter-popup__input-panel input {
    margin-right: 0 !important;
    margin-bottom: 10px;
  }
  .newsletter-popup__input-panel button {
    margin-bottom: 50px;
  }
}
</style>
