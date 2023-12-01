<template>
  <div class="image-modal">
    <Transition name="fade">
      <div
        v-if="isImageModalOpened"
        class="image-modal__container"
        :class="!isTouchDevice && 'image-modal__wrap'"
        @click="onClose($event)"
      >
        <img
          ref="image"
          :src="src"
          :alt="alt"
          :style="!isTouchDevice && imageStyles"
          :class="isImageReady && 'image-modal__image_visible'"
          class="image-modal__image"
        />
        <div
          :class="isImageReady && 'image-modal__nav_visible'"
          class="image-modal__nav"
        >
          <button
            v-if="!isTouchDevice"
            class="image-modal__btn"
            @click.prevent="onZoomOutHandler"
          >
            <span class="image-modal__icon image-modal__icon_minus" />
          </button>
          <button
            v-if="!isTouchDevice"
            class="image-modal__btn"
            @click.prevent="onZoomInHandler"
          >
            <span class="image-modal__icon image-modal__icon_plus" />
          </button>
          <button
            class="image-modal__btn image-modal__btn_close"
            @click.prevent="onCloseHandler"
          >
            <span class="image-modal__icon image-modal__icon_close" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { IMAGE_MODAL } from '~/store/types';

export default {
  name: 'ImageModal',
  data() {
    return {
      currentWidth: 0,
      naturalWidth: 0,
      zoomStep: 0,
      isImageReady: false,
    };
  },
  computed: {
    ...mapState('viewport', {
      viewportWidth: ({ viewportWidth }) => viewportWidth,
      userDeviceType: ({ userDeviceType }) => userDeviceType,
    }),
    ...mapState('imageModal', {
      isImageModalOpened: ({ isImageModalOpened }) => isImageModalOpened,
      src: ({ data: { src } }) => src,
      alt: ({ data: { alt } }) => alt,
    }),
    imageStyles() {
      return {
        width: `${50 + this.zoomStep * 10}vw`,
      };
    },
    isTouchDevice() {
      const { userDeviceType } = this;
      return userDeviceType.phone || userDeviceType.tablet;
    },
  },
  watch: {
    isImageModalOpened(newValue) {
      return newValue ? this.$nextTick(this.bindOnLoad) : undefined;
    },
  },
  created() {
    this.pinchZoom = null;
  },
  beforeDestroy() {
    this.cleanUp();
  },
  methods: {
    ...mapActions('imageModal', {
      setIsModalShown: IMAGE_MODAL.SET_IS_SHOWN,
      setModalData: IMAGE_MODAL.SET_DATA,
    }),
    onClose($event) {
      if ($event.target.nodeName === 'DIV') {
        this.onCloseHandler();
      }
    },
    bindOnLoad() {
      const { image } = this.$refs;
      image.onload = this.imageOnloadHandler;
      if (this.isTouchDevice) {
        this.initPinchZoom(image);
      }
    },
    initPinchZoom(image) {
      import('pinch-zoom-js').then((module) => {
        const PinchZoom = module.default;
        this.pinchZoom = new PinchZoom(image, {
          use2d: false,
          onDragEnd: (object) => {
            const { offset, initialOffset, zoomFactor } = object;
            if (zoomFactor === 1) {
              const diff = Math.abs(offset.y - initialOffset.y);
              if (diff > 100) {
                this.onCloseHandler();
              } else {
                this.pinchZoom.resetOffset();
              }
            }
          },
        });
      });
    },
    onCloseHandler() {
      this.setIsModalShown({
        isImageModalOpened: false,
      });
    },
    onZoomInHandler() {
      if (this.zoomStep < 5) {
        this.zoomStep += 1;
      }
    },
    onZoomOutHandler() {
      if (this.zoomStep) {
        this.zoomStep -= 1;
      }
    },
    imageOnloadHandler() {
      this.naturalWidth = this.$refs.image.naturalWidth;
      this.currentWidth = this.$refs.image.width;
      this.isImageReady = true;
    },
    cleanUp() {
      if (this.pinchZoom) {
        this.pinchZoom.disable();
        this.pinchZoom = null;
      }
      this.setModalData({});
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.image-modal__container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 6;
  background-color: rgba(0, 0, 0, 0.7);
}
.image-modal__wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
.image-modal__nav {
  position: fixed;
  right: 24px;
  display: flex;
  top: -100%;
  transition: top 0.6s 0.3s;
  z-index: 2;
}
.image-modal__nav_visible {
  top: 24px;
}
.image-modal__btn {
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  border-radius: 2px;
  background-color: #253137;
  color: #ffffff;
  position: relative;
  margin-left: 16px;
  transition: background-color 0.3s;
}
.image-modal__btn:hover {
  background-color: #465a65;
}
.image-modal__btn_close {
  margin-left: 32px;
}
.image-modal__btn:not(.image-modal__btn_close) {
  display: none;
}
.image-modal__image {
  height: auto;
  transition: opacity 0.15s 0.15s;
  opacity: 0;
  position: relative;
  z-index: -1;
  transform-style: preserve-3d;
}
.image-modal__image_visible {
  opacity: 1;
  z-index: 1;
  min-width: 100%;
}
.image-modal__icon {
  display: block;
  width: 24px;
  height: 24px;
  position: relative;
}
.image-modal__icon_minus::before,
.image-modal__icon_plus::before,
.image-modal__icon_plus::after,
.image-modal__icon_close::before,
.image-modal__icon_close::after {
  content: '';
  width: 14px;
  height: 2px;
  border-radius: 1px;
  background-color: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.image-modal__icon_plus::after {
  transform: rotateZ(90deg) translate(-50%, -50%);
  transform-origin: left top;
}
.image-modal__icon_close::before,
.image-modal__icon_close::after {
  transform-origin: left top;
}
.image-modal__icon_close::before {
  transform: rotateZ(45deg) translate(-50%, -50%);
}
.image-modal__icon_close::after {
  transform: rotateZ(-45deg) translate(-50%, -50%);
}
@media (min-width: $md) {
  .image-modal__image_visible {
    min-width: 686px;
  }
  .image-modal__btn:not(.image-modal__btn_close) {
    display: block;
  }
}
</style>
