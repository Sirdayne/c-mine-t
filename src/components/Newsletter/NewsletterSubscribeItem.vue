<template>
  <label class="subscription-item">
    <div class="subscription-item__icon">
      <img
        :src="subscriptionData.pictogramSrc"
        alt=""
      />
    </div>
    <div class="subscription-item__body">
      <h4 class="subscription-item__body--header">{{ i18n[subscriptionData.title] }}</h4>
      <span class="subscription-item__body--subheading">{{ i18n[subscriptionData.subheading] }}</span>
      <p class="subscription-item__body--desc">
        {{ i18n[subscriptionData.description] }}
      </p>
    </div>
    <div class="subscription-item__select">
      <input
        :ref="subscriptionData.value"
        type="checkbox"
        :value="subscriptionData.value"
        @change="updateValue($event.target.value)"
      />
      <span class="checkmark" />
    </div>
  </label>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'NewsletterSubscribeItem',
  props: {
    subscriptionData: {
      type: Object,
      default: () => {},
    },
    allSelected: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      i18n: ({ i18n }) => i18n,
    }),
  },
  watch: {
    allSelected() {
      if (this.allSelected && !this.$refs[this.subscriptionData.value].checked) {
        this.toggleRefCheckedStatus();
        this.updateValue(this.subscriptionData.value);
      } else if (!this.allSelected && !this.$refs[this.subscriptionData.value].checked) {
        this.toggleRefCheckedStatus();
        this.updateValue(this.subscriptionData.value);
      } else if (!this.allSelected && this.$refs[this.subscriptionData.value].checked) {
        this.toggleRefCheckedStatus();
        this.updateValue(this.subscriptionData.value);
      } else if (this.allSelected && this.$refs[this.subscriptionData.value].checked) {
        this.toggleRefCheckedStatus(true);
      }
    },
  },
  methods: {
    updateValue(val) {
      this.$emit('update', val);
    },
    toggleRefCheckedStatus(val) {
      this.$refs[this.subscriptionData.value].checked = val ?? !this.$refs[this.subscriptionData.value].checked;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_vars.scss';
.subscription-item {
  flex: 1 0 41%;
  margin-bottom: 10px;
  position: relative;
  margin-top: 10px;
  padding: 16px 16px 48px;
  border: solid 1px #e3e6e7;
  border-radius: 10px;
  display: flex;
  align-content: space-between;
  justify-content: space-between;
  align-items: stretch;
  max-width: 49%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
  min-height: 155px;
  &:nth-child(odd) {
    margin-right: 10px;
  }
  &:nth-child(even) {
    margin-left: 10px;
  }
  @media only screen and (max-width: 991px) {
    max-width: 100%;
    flex-basis: fit-content;
    justify-content: normal;
    &:nth-child(odd) {
      margin-right: 0;
    }
    &:nth-child(even) {
      margin-left: 0;
    }
  }
  @media only screen and (max-width: $xs) {
    min-height: 100%;
  }
}
.subscription-item__icon {
  text-align: center;
  margin-right: 4px;
  height: fit-content;
}
.subscription-item__icon img {
  width: 120px;
  height: 120px;
}
.subscription-item__body {
  flex: 1;
  height: fit-content;
  &--header {
    margin-top: 0;
    margin-bottom: 4px;
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 23px;
    color: $color-cyan-blue;
  }
  &--subheading {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: $color-gray-700;
  }
  &--desc {
    color: $color-gray-700;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 0;
    margin-top: 12px;
  }
  @media only screen and (max-width: $xs) {
    &--header {
      font-size: 18px;
      line-height: 22px;
      margin-right: 27px;
    }
    &--subheading {
      font-size: 12px;
      line-height: 18px;
    }
    &--desc {
      font-size: 14px;
      line-height: 22px;
    }
  }
}
.subscription-item__select {
  position: absolute;
  top: 20px;
  right: 0;
}
.subscription-item__select input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.subscription-item__select .checkmark {
  position: absolute;
  height: 24px;
  width: 24px;
  border: solid 1.5px #c8d0d3;
  border-radius: 6px;
  right: 16px;
  box-sizing: content-box;
}
.subscription-item__select .checkmark:after {
  content: '';
  position: absolute;
  display: none;
}
.subscription-item__select input:checked ~ .checkmark:after {
  display: block;
}
.subscription-item__select input:checked ~ .checkmark {
  background-color: #fff;
  border: 1.5px solid $color-gray-400;
  box-sizing: content-box;
}
.subscription-item__select .checkmark:after {
  left: 50%;
  top: 50%;
  width: 5px;
  height: 10px;
  border: solid #a07303;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg) translate(-100%, -30%);
  -ms-transform: rotate(45deg) translate(-100%, -30%);
  transform: rotate(45deg) translate(-100%, -30%);
}
.subscription-item:has(input[type='checkbox']:checked) {
  background: $color-orange-500;
}
</style>
