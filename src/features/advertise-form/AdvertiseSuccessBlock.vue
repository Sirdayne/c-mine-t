<template>
  <div
    :class="$style['ad-success-modal']"
    data-testid="advertise-success-block"
  >
    <h3
      :class="$style['ad-success-modal__title']"
      data-testid="advertise-success-title"
    >
      Thank you for submitting the form
    </h3>
    <p
      :class="$style['ad-success-modal__description']"
      data-testid="advertise-success-description"
    >
      We will contact you shortly using only cointelegraph.com domain name addresses. Any person using an email address
      with a different domain name is likely a fraud.
    </p>
    <button
      :class="$style['ad-success-modal__close-btn']"
      type="submit"
      data-testid="close-advertise-form-btn"
      @click="$emit('closeModal')"
    >
      Close
    </button>
  </div>
</template>

<script>
export default {
  name: 'AdvertiseSuccessBlock',
};
</script>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';
@import '~/assets/styles/_mixins.scss';
.ad-success-modal {
  padding: 230px 58px;
  text-align: center;
  &__title {
    @include section-title(23px, 700, 29px);
    color: $color-gray-950;
    margin: 0;
  }
  &__description {
    @include section-title(16px, 400, 24px);
    color: $color-gray-600;
    margin: 12px 0 0 0;
  }
  &__close-btn {
    display: block;
    width: 100%;
    padding: 12px;
    background: #fabf2c;
    border-radius: 5px;
    @include section-title(16px, 600, 24px);
    color: $color-gray-950;
    border: none;
    cursor: pointer;
    margin-top: 24px;
  }
}
</style>
