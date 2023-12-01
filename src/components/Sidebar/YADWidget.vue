<template>
  <div
    id="yad-widget"
    :class="$style['yad-widget__wrapper']"
  >
    <iframe
      src="https://widget.yad.finance/1/exchange/ETH/DAI?theme='light'"
      title="yad-widget"
      height="508"
      :class="$style['yad-widget__frame']"
    />
  </div>
</template>

<style module lang="scss">
.yad-widget {
  &__wrapper {
    border-radius: 20px;
    box-shadow: -5px 5px 60px rgba(0, 0, 0, 0.1);
  }
  &__frame {
    border-radius: 20px;
    border: none;
    width: 100%;
  }
}
</style>
