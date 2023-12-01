<template>
  <div
    class="privacy-policy"
    :class="[isRtl && 'privacy-policy_rtl']"
  >
    <div class="container privacy-policy__wrp">
      <p
        class="privacy-policy__text"
        v-html="i18n.privacyPolicyText"
      />
      <button
        class="btn privacy-policy__accept-btn"
        type="button"
        @click="handleClose('accept')"
      >
        <span class="btn__wrp">
          <span class="btn__cap">
            {{ i18n.privacyPolicyCap }}
          </span>
        </span>
      </button>
      <button
        class="btn privacy-policy__close-btn"
        type="button"
        @click="handleClose('close')"
      >
        <span class="btn__wrp">
          <span class="btn__icon privacy-policy__close-icon" />
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { ROOT, SETTINGS } from '~/store/types';

export default {
  name: 'PrivacyPolicy',
  props: {
    i18n: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
  },
  methods: {
    ...mapActions('settings', {
      handleClose: SETTINGS.SET_PRIVACY_POLICY_HIDDEN,
    }),
  },
};
</script>

<style scoped lang="scss">
@use '~/assets/styles/_icons-common.scss' as icons;
@import '~/assets/styles/_vars.scss';

.privacy-policy {
  position: relative;
  width: 100%;
  padding: 15px 20px;
  box-sizing: border-box;
  color: #253137;
  background-color: rgba(37, 49, 55, 0.9);

  @media (min-width: $md) {
    padding-left: 0;
    padding-right: 0;
    background-color: #1d262b;
  }
}
.privacy-policy__wrp {
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: $md) {
    flex-direction: row;
  }
}
.privacy-policy__text {
  flex-grow: 1;
  margin: 0 0 10px;
  color: #eceff1;
  font-size: 0.75rem;
  line-height: 1.5;
  text-align: center;

  @media (min-width: $md) {
    margin-bottom: 0;
    font-size: 1rem;
    text-align: initial;
  }
}
.privacy-policy__accept-btn {
  flex-shrink: 0;
  min-width: 145px;
  padding: 12px 30px;
  text-transform: uppercase;
  font-size: 0.625rem;
  font-weight: 700;
  color: #253137;
  background-color: #fabf2b;
  border: 1px solid transparent;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: color 0.15s, border-color 0.15s, background-color 0.15s;

  @media (min-width: $md) {
    font-size: 0.75rem;
    margin-left: 18px;
  }
}
.privacy-policy__accept-btn:hover {
  @media (min-width: $md) {
    color: #ffffff;
    background-color: #253136;
    border-color: #465a65;
  }
}
.privacy-policy__close-btn {
  flex-shrink: 0;
  position: absolute;
  top: 8px;
  right: 8px;
  color: #a0afb7;

  @media (min-width: $md) {
    display: block;
    position: relative;
    top: auto;
    right: auto;
    margin-left: 18px;
  }
}
.privacy-policy__close-icon {
  @include icons.cross(#a0afb7);
  width: 8px;
  height: 8px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;

  @media (min-width: $md) {
    width: 16px;
    height: 16px;
  }
}
.privacy-policy_rtl {
  direction: rtl;
}
.privacy-policy_rtl .privacy-policy__close-btn {
  right: auto;
  left: 8px;

  @media (min-width: $md) {
    left: auto;
    margin-left: 0;
    margin-right: 18px;
  }
}
</style>

<style lang="scss">
.privacy-policy__text a {
  text-decoration: none;
  color: #fabf2c;
  border-bottom: 1px solid #fabf2c;
  transition: border-color 0.15s;
}
.privacy-policy__text a:hover {
  border-bottom-color: transparent;
}
</style>
