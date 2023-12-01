<template>
  <form
    v-if="!formSubmitted"
    :class="$style['ct-advertise-form']"
    @submit.prevent="onSubmit"
  >
    <button
      :class="$style['ct-advertise-form__close']"
      data-testid="close-advertise-form-btn"
      @click="closeModal"
    >
      <img src="/assets/img/tickers/close.svg" />
    </button>
    <fieldset :class="$style['ct-advertise-form__wrapper']">
      <legend
        :class="$style['ct-advertise-form__title']"
        data-testid="advertise-form-title"
      >
        Advertise with us
      </legend>
      <AdvertiseFormField
        v-for="(field, index) in cerosFormFields"
        :key="index"
        :value.sync="cerosForm[field.name]"
        required
        :type="field.type"
        :label="field.label"
        :name="field.name"
        :placeholder="field.placeholder"
        :validation-error="currentFieldError(field.name)"
        :disabled="formDisabled"
        :data-testid="`advertise-form-${field.name}`"
        @updateValue="(newValue) => updateFormField(field.name, newValue)"
      />
      <p :class="$style['ct-advertise-form__description']">
        It is recommended to use corporate email as such requests are processed on a priority basis
      </p>

      <button
        :class="$style['ct-advertise-form__contact-us']"
        type="submit"
        data-testid="advertise-submit-btn"
        :disabled="formDisabled"
      >
        Submit Request
      </button>
    </fieldset>
  </form>
  <AdvertiseSuccessBlock
    v-else
    @closeModal="closeModal"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import AdvertiseFormField from './AdvertiseFormField.vue';
import { CEROS_ADVERTISE_FIELDS } from '~/features/advertise-form/AdvertiseFields';
import { CerosForm } from '~/features/advertise-form/types';
import { useAdvertiseApi } from '~/features/advertise-form/AdvertiseApi';
import AdvertiseSuccessBlock from '~/features/advertise-form/AdvertiseSuccessBlock.vue';
import { useStore } from '~/lib/framework';
import { useCookies } from '~/lib/cookies';

interface Error {
  name: string;
  message: string;
}

export default defineComponent({
  name: 'AdvertiseForm',
  components: {
    AdvertiseSuccessBlock,
    AdvertiseFormField,
  },

  setup(_, { emit }) {
    const cerosAdvertiseApi = useAdvertiseApi();
    const cerosFormFields = CEROS_ADVERTISE_FIELDS;
    const cookieManager = useCookies();
    const store = useStore();

    const currentLanguage = computed(() => store.state.currentLanguage);
    const currentRegion = computed(() => {
      return currentLanguage.value.name === 'Universal' ? 'English' : currentLanguage.value.name;
    });
    const formDisabled = ref(false);

    const formSubmitted = ref(false);
    const cerosForm = ref<CerosForm>({
      name: '',
      email: '',
      messenger: 'Telegram',
      messaging: '',
      website: '',
      region: currentRegion.value,
    });

    const errors = ref<Array<Error>>([]);
    const updateError = (fieldName: string) => {
      errors.value = errors.value.filter((localError) => localError.name !== fieldName);
    };
    const pushValidationError = (fieldName: string) => {
      errors.value.push({
        name: fieldName,
        message: `Invalid ${fieldName}`,
      });
    };
    const currentFieldError = (fieldName: string) => {
      return !!errors.value?.find((error) => error.name === fieldName);
    };
    const checkFieldValidation = (fieldName: string, fieldValue: string, regex: RegExp) => {
      const notValid = fieldValue ? !regex.test(fieldValue) : false;
      notValid ? pushValidationError(fieldName) : updateError(fieldName);
    };
    const updateFormField = (fieldName: string, fieldValue: string) => {
      cerosForm.value[fieldName] = inputValidation(fieldName, fieldValue);
    };

    const inputValidation = (fieldName: string, inputValue: string) => {
      inputValue.toLowerCase();
      if (inputValue.length) {
        return currentFieldValidation(fieldName, inputValue);
      }
    };

    // WARN: temporary decision => need to find lib or smth to work with form validation
    const currentFieldValidation = (fieldName: string, fieldValue: string) => {
      const emailRegex = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      const nameRegex = new RegExp(/^[a-z ,.'-]+$/i);
      const usernameRegex = new RegExp(/^@[a-z0-9 ,.'-_]+$/i);
      const urlRegex = new RegExp(
        /^(?:(?:https?:)?\/\/)?(?:(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?:[/?#]\S*)?$/i
      );

      switch (fieldName) {
        case 'email':
          checkFieldValidation(fieldName, fieldValue, emailRegex);
          return fieldValue;
        case 'name':
          checkFieldValidation(fieldName, fieldValue, nameRegex);
          return fieldValue;
        case 'messaging':
          checkFieldValidation(fieldName, fieldValue, usernameRegex);
          return fieldValue;
        default:
          checkFieldValidation(fieldName, fieldValue, urlRegex);
          return fieldValue;
      }
    };
    const validateFields = () => {
      for (const key in cerosForm.value) {
        if (!cerosForm.value[key]) pushValidationError(key);
      }
    };

    const disableFormToggle = () => {
      formDisabled.value = !formDisabled.value;
    };
    const closeModal = () => {
      formSubmitted.value = false;
      emit('closeModal');
    };
    const onSubmit = async (): Promise<void> => {
      validateFields();
      if (!errors.value?.length) {
        disableFormToggle();
        await cerosAdvertiseApi.sendAdvertiseFormData(cerosForm, cookieManager.get('_ga'));
        await disableFormToggle();
        formSubmitted.value = true;
        for (const fieldName in cerosForm.value) {
          if (fieldName !== 'region' && fieldName !== 'messenger') {
            cerosForm.value[fieldName] = '';
          }
        }
      }
    };

    return {
      onSubmit,
      cerosFormFields,
      cerosForm,
      updateError,
      formSubmitted,
      updateFormField,
      currentFieldError,
      formDisabled,
      closeModal,
    };
  },
});
</script>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';
@import '~/assets/styles/_mixins.scss';

.ct-advertise-form {
  padding: 24px;
  position: relative;
  & * {
    font-family: inherit;
  }
  &__close {
    position: absolute;
    right: 8px;
    top: 8px;
    border: none;
    background: none;
    cursor: pointer;
    outline: none;
  }
  &__wrapper {
    border: none;
    padding: 0;
    margin: 0;
  }
  &__title {
    font-style: normal;
    @include section-title(23px, 700, 29px);
  }
  &__description {
    margin: 24px 0 0 0;
    @include section-title(14px, 400, 18px);
    color: $color-gray-700;
  }
  &__contact-us {
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

    &:disabled {
      opacity: 0.8;
    }
  }
}
</style>
