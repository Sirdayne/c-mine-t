<template>
  <div
    :class="{
      [$style['ceros-advertise-form-field']]: true,
      [$style['ceros-advertise-form-field--error']]: validationError,
    }"
  >
    <label
      :for="name"
      :class="$style['ceros-advertise-form-field__label']"
    >
      {{ labelText }}
    </label>
    <input
      :id="name"
      :value="value"
      :name="name"
      :disabled="disabled"
      :placeholder="placeholder"
      :class="$style['ceros-advertise-form-field__input']"
      @change="$emit('updateValue', $event.target.value)"
    />
    <p
      v-if="validationError"
      :class="$style['ceros-advertise-form-field__error-message']"
    >
      Invalid {{ name }}
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'CerosAdvertiseFormField',

  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      default: null,
    },
    label: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    validationError: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const labelText = computed(() => {
      let labelText = props.label;

      if (props.required) labelText += ' *';

      return labelText;
    });

    return {
      labelText,
    };
  },
});
</script>

<style lang="scss" module>
@import '~/assets/styles/_vars.scss';
@import '~/assets/styles/_mixins.scss';

//gray from vars not that colors
$color-gray-100-local: #fafafa;
$color-gray-200-local: #f1f3f4;
$color-gray-500-local: #afbac0;

.ceros-advertise-form-field {
  position: relative;
  margin-top: 48px;
  display: flex;
  flex-direction: column;

  &__input,
  &__label {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 19px;
    width: 100%;
  }

  &__input {
    outline: none;
    transition: 0.2s ease-in-out;
    box-sizing: border-box;
    background: $color-gray-100-local;
    border: 1px solid $color-gray-150;
    border-radius: 4px;
    padding: 12px;
    color: $color-cyan-blue;
    @include section-title(16px, 400, 24px);

    &::placeholder {
      color: $color-gray-600;
    }

    &:focus {
      background: $color-white;
      border: 1px solid $color-gray-500-local;
    }

    &:disabled {
      background: $color-gray-200-local;
      border: 1px solid $color-gray-150;
    }
  }

  &__label {
    top: -24px;
    left: 0;
    right: 0;
    color: $color-gray-700;
    display: flex;
    align-items: center;
    position: absolute;
    cursor: text;
    transition: 0.2s ease-in-out;
    box-sizing: border-box;
  }

  &--error {
    display: flex;

    .ceros-advertise-form-field {
      &__label {
        color: $color-red-500;
      }

      &__input {
        border: 1px solid $color-red-500;
      }
    }
  }

  &__error-message {
    color: $color-red-500;
    padding: 0;
    margin: 8px 0 0 0;
    @include section-title(14px, 400, 18px);
  }
}

// removed blue chrome input with autocomplete background
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px $color-gray-100-local inset !important;
}
</style>
