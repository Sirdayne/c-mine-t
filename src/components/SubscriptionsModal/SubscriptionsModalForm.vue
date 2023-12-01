<template>
  <div
    class="subscriptions-modal-form"
    :class="hasError && 'subscriptions-modal-form_has-error'"
  >
    <div class="subscriptions-modal-form__body">
      <form
        class="subscriptions-modal-form__form-el"
        @submit.prevent="submitHandler"
      >
        <div class="subscriptions-modal-form__input-wrp">
          <label
            for="subscriptions-email"
            class="subscriptions-modal-form__input-label"
          >
            <input
              id="subscriptions-email"
              v-model="email"
              type="text"
              name="email"
              :disabled="isPending"
              :placeholder="localI18n.formInputPlaceholder"
              class="subscriptions-modal-form__input"
            />
          </label>
          <Transition name="appear-from-top">
            <span
              v-if="message"
              class="subscriptions-modal-form__popup"
              v-html="message"
            />
          </Transition>
        </div>
        <div class="subscriptions-modal-form__btn-wrp">
          <button
            type="submit"
            :disabled="isPending"
            class="subscriptions-modal-form__btn"
          >
            {{ localI18n.formInputSubmitBtnLabel }}
          </button>
        </div>
      </form>
    </div>
    <div
      v-if="localI18n.formTosText"
      class="subscriptions-modal-form__footer"
    >
      <div
        class="subscriptions-modal-form__tos"
        v-html="localI18n.formTosText"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { validateEmail } from '~/assets/helpers/subscribe';
import { buildActionUrl } from '~/assets/helpers/subscriptions';
import { subscribeMailList } from '~/api/modules/subscriptions';

const CLEAR_DELAY = 6000;

export default {
  name: 'SubscriptionsModalForm',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
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
    }),
    ...mapState('subscriptionsModal', {
      localI18n: ({ i18n }) => i18n,
    }),
    mailList() {
      const { email } = this;
      return this.list
        .filter(({ isSelected }) => isSelected)
        .map(({ modalListItemListId }) => ({
          email,
          url: buildActionUrl(modalListItemListId),
        }));
    },
  },
  mounted() {
    this.clearMessageTimer = null;
  },
  beforeDestroy() {
    clearTimeout(this.clearMessageTimer);
  },
  methods: {
    async submitHandler() {
      const { mailList, localI18n, isPending } = this;
      if (isPending) {
        return undefined;
      }
      const email = this.email.trim();
      if (validateEmail(email) && mailList.length) {
        await this.submitForm(email, this.mailList);
        return undefined;
      }
      if (!mailList.length) {
        this.message = localI18n.formNoItemsMessage;
        this.hasError = true;
      } else {
        this.message = localI18n.formSubscribeError;
        this.hasError = true;
      }
      return this.clearPopupOnTimeout();
    },
    async submitForm(email, mailList) {
      if (!mailList.length) {
        return;
      }
      this.isPending = true;
      const { errors } = await subscribeMailList(mailList);
      const hasError = Boolean(errors);
      this.hasError = hasError;
      if (!errors) {
        this.message = this.localI18n.formSubscribeSuccess;
        this.$emit('subscribed');
      } else {
        this.message = errors;
      }
      this.clearPopupOnTimeout({ resetEmail: !hasError });
      this.isPending = false;
    },
    clearPopupOnTimeout({ resetEmail = false, force = false } = {}) {
      clearTimeout(this.clearMessageTimer);
      const timeout = force ? 0 : CLEAR_DELAY;
      if (resetEmail) {
        this.email = '';
      }
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

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.subscriptions-modal-form__footer {
  margin-top: 20px;
}
.subscriptions-modal-form__input-wrp,
.subscriptions-modal-form__btn-wrp {
  margin-top: 10px;
  position: relative;
}
.subscriptions-modal-form__popup {
  position: absolute;
  bottom: 100%;
  z-index: 1;
  left: 0;
  padding: 5px 12px;
  box-sizing: border-box;
  font-size: 0.75rem;
  font-weight: 400;
  color: #ffffff;
  border-radius: 2px;
  background-color: #3abc98;
}
.subscriptions-modal-form__input,
.subscriptions-modal-form__btn {
  border: none;
  outline: none;
  width: 100%;
  height: 50px;
  display: block;
  padding: 0 28px;
  text-align: center;
  box-sizing: border-box;
}
.subscriptions-modal-form__input {
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0.01em;
  color: #253137;
  border: 1px solid transparent;
  box-sizing: border-box;
  transition: border-color 0.15s;
}
.subscriptions-modal-form__input::placeholder,
.subscriptions-modal-form__input::-webkit-input-placeholder,
.subscriptions-modal-form__input::-moz-placeholder,
.subscriptions-modal-form__input:-ms-input-placeholder,
.subscriptions-modal-form__input:-moz-placeholder {
  opacity: 1;
  font-weight: normal;
  color: #828f96;
}
.subscriptions-modal-form__btn {
  background: #fabf2c;
  font-size: 16px;
  font-style: normal;
  line-height: 22px;
  transition: background-color 0.15s, color 0.15s;
}
.subscriptions-modal-form__btn:active {
  background-color: #253137;
  color: #ffffff;
}
.subscriptions-modal-form__btn:disabled,
.subscriptions-modal-form__btn:disabled:active {
  background: rgba(250, 191, 44, 0.75);
}
.subscriptions-modal-form__tos {
  font-weight: normal;
  font-size: 13px;
  line-height: 20px;
  text-align: center;
  color: #798b95;
}
.subscriptions-modal-form__tos a {
  text-decoration: underline;
  color: #253137;
  transition: color 0.15s;
}
.subscriptions-modal-form__tos a:active {
  color: #fabf2c;
}
.subscriptions-modal-form__footer:first-child,
.subscriptions-modal-form__input-wrp:first-child,
.subscriptions-modal-form__btn-wrp:first-child {
  margin-top: 0;
}

.subscriptions-modal-form_has-error .subscriptions-modal-form__input {
  border-color: #ff4a68;
}
.subscriptions-modal-form_has-error .subscriptions-modal-form__popup {
  background-color: #ff4a68;
}

@media (min-width: $sm) {
  .subscriptions-modal-form__form-el {
    display: flex;
  }
  .subscriptions-modal-form__input-wrp {
    flex-grow: 1;
  }
  .subscriptions-modal-form__btn-wrp {
    margin-top: 0;
    margin-left: 20px;
  }
  .subscriptions-modal-form__btn {
    min-width: 220px;
  }
  .subscriptions-modal-form__input {
    text-align: left;
    padding-left: 20px;
    padding-right: 20px;
  }
  .subscriptions-modal-form__tos br {
    display: none;
  }
}
@media (min-width: $md) {
  .subscriptions-modal-form__input {
    border-right-width: 0;
  }
  .subscriptions-modal-form__btn-wrp {
    margin-left: 0;
  }
  .subscriptions-modal-form__btn {
    min-width: auto;
  }
}
@media (min-width: $lg) {
  .subscriptions-modal-form__btn {
    font-size: 18px;
    padding-left: 23px;
    padding-right: 23px;
  }
}

@media (hover: hover) {
  .subscriptions-modal-form__btn:hover {
    background-color: #253137;
    color: #ffffff;
    cursor: pointer;
  }
  .subscriptions-modal-form__btn:disabled:hover {
    background: rgba(250, 191, 44, 0.75);
  }
  .subscriptions-modal-form__tos a:hover {
    color: #fabf2c;
  }
}
</style>
