<template>
  <a
    :href="redirectUrl"
    target="_blank"
    class="trade-santa-banner"
  >
    <img
      src="https://s3.cointelegraph.com/storage/uploads/view/162eeac3a9cd75782877e7d7014db39f.svg"
      class="trade-santa-banner__close"
      alt=""
      @click.prevent="$emit('close')"
    />
    <img
      src="https://s3.cointelegraph.com/storage/uploads/view/ad141b5cd6a4729431a51fea2e6b8f58.svg"
      alt=""
      class="trade-santa-banner__chart"
    />
    <img
      src="https://s3.cointelegraph.com/storage/uploads/view/299843dc3dec243c2e84b2f8e2848111.svg"
      alt=""
      class="trade-santa-banner__text"
    />
    <img
      src="https://s3.cointelegraph.com/storage/uploads/view/b1527c8df458864622bbcab3a07d0139.svg"
      alt=""
      class="trade-santa-banner__btn"
    />
    <img
      src="https://s3.cointelegraph.com/storage/uploads/view/17da9d14c5329257424e04cfd0bd864c.svg"
      alt=""
      class="trade-santa-banner__logo"
    />
    <img
      src="https://s3.cointelegraph.com/storage/uploads/view/90da9adc196519f3ed0e9501f96ee45a.svg"
      alt=""
      class="trade-santa-banner__e1 ts-animation-rotate"
    />
    <img
      src="https://s3.cointelegraph.com/storage/uploads/view/23e2815006ff4a6c0bfe29d0e2f20f92.svg"
      alt=""
      class="trade-santa-banner__e2 ts-animation-rotate"
    />
    <img
      src="https://s3.cointelegraph.com/storage/uploads/view/c5be1b0e634ae465c620dba25ebaa3ea.svg"
      alt=""
      class="trade-santa-banner__e3 ts-animation-rotate"
    />
    <img
      src="https://s3.cointelegraph.com/storage/uploads/view/d3c64dca729599247cf86e714f913852.svg"
      alt=""
      class="trade-santa-banner__e4 ts-animation-rotate"
    />
    <span class="trade-santa-banner__santa">
      <img
        src="https://s3.cointelegraph.com/storage/uploads/view/153ad7008073a19bd70c88c852325420.svg"
        alt=""
      />
    </span>
  </a>
</template>

<script>
export default {
  name: 'TradeSantaBanner',
  props: {
    redirectUrl: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.trade-santa-banner {
  width: 275px;
  height: 275px;
  transform-origin: 100% 100%;
  transition-duration: 0.2s;
  transition-property: width, bottom;
  position: inherit;
  transform: translate(-100%, -100%) scale(0.58);
}
.trade-santa-banner:hover {
  width: 700px;
}
.trade-santa-banner:before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  height: 235px;
  width: calc(100% - 40px);
  border-radius: 235px;
  margin: auto;
  background: #ffe03a;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.25);
}
.trade-santa-banner__santa {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  height: 235px;
  width: calc(100% - 40px);
  border-radius: 235px;
  overflow: hidden;
  margin: auto;
}
.trade-santa-banner__santa * {
  position: absolute;
  bottom: 0;
  left: 40px;
}
.trade-santa-banner:hover .trade-santa-banner__santa * {
  left: 90px;
  transition: all 0.1s;
}
.trade-santa-banner__chart {
  position: absolute;
  top: 115px;
  left: 0;
}
.trade-santa-banner:hover .trade-santa-banner__chart {
  left: 50px;
  transition: all 0.3s;
}
.trade-santa-banner__logo {
  position: absolute;
  top: 45px;
  left: 40px;
  transform: scale(0.75);
}
.trade-santa-banner:hover .trade-santa-banner__logo {
  left: 90px;
  transform: scale(1);
  transition: all 0.3s;
}
.trade-santa-banner__text {
  opacity: 0;
  position: absolute;
  top: 50px;
  right: 60px;
  transform: scale(1.1);
}
.trade-santa-banner__btn {
  opacity: 0;
  position: absolute;
  top: 180px;
  right: 150px;
  z-index: 1;
  transform: scale(1.2);
}
.trade-santa-banner:hover .trade-santa-banner__text,
.trade-santa-banner:hover .trade-santa-banner__btn {
  opacity: 0.9;
  transition: all 0.3s;
}
.trade-santa-banner__btn:hover {
  opacity: 1 !important;
  transform: scale(1.025);
}

.trade-santa-banner__e1 {
  position: absolute;
  top: 100px;
  left: 40px;
  animation-delay: -0.25s !important;
}
.trade-santa-banner:hover .trade-santa-banner__e1 {
  left: 90px;
  transition: all 0.3s;
}
.trade-santa-banner__e2 {
  position: absolute;
  top: 35px;
  left: 140px;
  animation-delay: -0.5s !important;
}
.trade-santa-banner:hover .trade-santa-banner__e2 {
  left: 190px;
  transition: all 0.3s;
}
.trade-santa-banner__e3 {
  position: absolute;
  top: 50px;
  left: 220px;
  animation-delay: -0.75s !important;
}
.trade-santa-banner:hover .trade-santa-banner__e3 {
  left: 300px;
  transition: all 0.3s;
}
.trade-santa-banner__e4 {
  opacity: 0;
  position: absolute;
  top: 140px;
  right: 70px;
  animation-delay: -1s !important;
}
.trade-santa-banner:hover .trade-santa-banner__e4 {
  opacity: 1;
  transition: all 0.3s;
}
.trade-santa-banner__close {
  position: absolute;
  top: 10px;
  right: 10px;
  transition: all 0.3s;
  transform: rotate(0deg) scale(1.6);
}
.trade-santa-banner__close:hover {
  transform: rotate(360deg) scale(1.6);
}
.ts-animation-rotate {
  animation: ts-rotate 1s infinite linear;
}
@keyframes ts-rotate {
  0% {
    transform: rotate(0) scale(1);
  }
  25% {
    transform: rotate(25deg) scale(1.1);
  }
  75% {
    transform: rotate(-25deg) scale(1.1);
  }
  100% {
    transform: rotate(0) scale(1);
  }
}
</style>
