<template>
  <div class="subscriptions-modal">
    <div class="subscriptions-modal__header">
      <button
        class="subscriptions-modal__close-btn"
        @click.passive="closeClickHandler"
      />
    </div>
    <div class="subscriptions-modal__body">
      <div class="subscriptions-modal__col">
        <div class="subscriptions-modal__content-wrap">
          <div
            v-if="localI18n.modalTitle"
            class="subscriptions-modal__title"
          >
            {{ localI18n.modalTitle }}
          </div>
          <div
            v-if="localI18n.modalSubtitle"
            class="subscriptions-modal__subtitle"
          >
            {{ localI18n.modalSubtitle }}
          </div>
          <div
            v-if="localI18n.selectAllBtnLabel"
            class="subscriptions-modal__btn-wrap"
          >
            <Transition name="fade">
              <button
                v-if="!isAllSubscriptionsSelected"
                key="select-all-btn"
                class="subscriptions-modal__btn"
                @click.passive="selectAllHandler"
              >
                {{ localI18n.selectAllBtnLabel }}
              </button>
              <button
                v-else
                key="turn-off-all-btn"
                class="subscriptions-modal__btn"
                @click.passive="turnOffAllHandler"
              >
                {{ localI18n.turnOffBtnLabel }}
              </button>
            </Transition>
          </div>
        </div>
      </div>
      <div class="subscriptions-modal__col">
        <SubscriptionsModalList
          :list="subscriptionsList"
          class="subscriptions-modal__list"
          @select.passive="selectHandler"
        />
      </div>
    </div>
    <div class="subscriptions-modal__footer">
      <SubscriptionsModalForm
        :list="subscriptionsList"
        class="subscriptions-modal__form"
        @subscribed.passive="subscribedHandler"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SubscriptionsModalList from './SubscriptionsModalList';
import SubscriptionsModalForm from './SubscriptionsModalForm';

export default {
  name: 'SubscriptionsModal',
  components: {
    SubscriptionsModalForm,
    SubscriptionsModalList,
  },
  props: {
    subscriptionsList: {
      type: Array,
      default: () => [],
    },
    isAllSubscriptionsSelected: {
      type: Boolean,
    },
  },
  computed: {
    ...mapState('subscriptionsModal', {
      localI18n: ({ i18n }) => i18n,
    }),
    ...mapState('viewport', {
      isLargeBreakpoint: ({ breakpoint }) => breakpoint === 'LG',
    }),
  },
  methods: {
    closeClickHandler() {
      this.$emit('close');
    },
    selectHandler(payload) {
      this.$emit('select', payload);
    },
    selectAllHandler() {
      this.$emit('select-all');
    },
    turnOffAllHandler() {
      this.$emit('turn-off-all');
    },
    subscribedHandler() {
      this.$emit('subscribed');
    },
  },
};
</script>

<style lang="scss">
@use '~/assets/styles/_icons-common.scss' as common-icons;
@import '~/assets/styles/_vars.scss';

.subscriptions-modal {
  background-color: #ffffff;
  position: relative;
}
.subscriptions-modal__header,
.subscriptions-modal__body,
.subscriptions-modal__footer {
  box-sizing: border-box;
}
.subscriptions-modal__header {
  height: 55px;
}
.subscriptions-modal__body {
  padding: 0 10px 30px;
}
.subscriptions-modal__footer {
  padding: 30px 10px;
  background-color: #f6f6f6;
}
.subscriptions-modal__col {
  margin-top: 20px;
  position: relative;
}
.subscriptions-modal__title,
.subscriptions-modal__subtitle {
  color: #253137;
  text-align: center;
}
.subscriptions-modal__title {
  font-weight: bold;
  font-size: 1.625rem;
  line-height: 30px;
  letter-spacing: -0.02em;
}
.subscriptions-modal__subtitle {
  font-weight: normal;
  font-size: 1rem;
  line-height: 22px;
  letter-spacing: -0.01em;
  margin-top: 10px;
}
.subscriptions-modal__btn-wrap {
  margin-top: 25px;
  position: relative;
  height: 40px;
}
.subscriptions-modal__btn {
  background-color: #ebebeb;
  border-radius: 20px;
  border: none;
  box-sizing: border-box;
  color: #253137;
  display: block;
  font-size: 16px;
  font-weight: 600;
  height: 40px;
  letter-spacing: -0.01em;
  line-height: 24px;
  margin: 0 auto;
  outline: none;
  padding: 0 28px;
  position: absolute;
  text-align: center;
  left: 50%;
  white-space: nowrap;
  transform: translateX(-50%);
  transition: background-color 0.15s;
}
.subscriptions-modal__btn:active {
  background-color: #fabf2c;
}
.subscriptions-modal__close-btn {
  @include common-icons.cross(#92989b);
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 20px;
  border: none;
  background-color: transparent;
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0;
  outline: none;
}
.subscriptions-modal__close-btn:active {
  @include common-icons.cross(#2d2e30);
}
.subscriptions-modal__col:first-child,
.subscriptions-modal__subtitle:first-child,
.subscriptions-modal__btn-wrap:first-child {
  margin-top: 0;
}

@media (min-width: $md) {
  .subscriptions-modal__body,
  .subscriptions-modal__footer {
    padding-left: 98px;
    padding-right: 98px;
  }
}
@media (min-width: $lg) {
  .subscriptions-modal__header {
    height: 60px;
  }
  .subscriptions-modal__col {
    margin-top: 25px;
  }
  .subscriptions-modal__col:first-child {
    margin-top: 0;
  }
  .subscriptions-modal__body,
  .subscriptions-modal__footer {
    padding-left: 60px;
    padding-right: 60px;
  }
  .subscriptions-modal__close-btn {
    top: 5px;
    right: 5px;
  }
}

@media (hover: hover) {
  .subscriptions-modal__btn:hover {
    background-color: #fabf2c;
    cursor: pointer;
  }
  .subscriptions-modal__close-btn:hover {
    cursor: pointer;
    @include common-icons.cross(#2d2e30);
  }
}
</style>
