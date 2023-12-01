<template>
  <form
    class="box-border w-full flex flex-col justify-between"
    @submit.prevent="onSubmitHandler"
  >
    <div class="mb-4 sm:mb-6">
      <div class="flex items-end mb-4 sm:mb-2">
        <div class="grow">
          <div class="text-uiXsDefault sm:text-uiSDefault text-fg-secondaryDefault mb-1 sm:mb-2">
            {{ i18n.inArticleSubscriptionFormEnjoy }}
          </div>
          <div
            class="text-headlineMl sm:text-headlineXl text-fg-strong sm:min-h-[56px]"
            v-html="content.title"
          />
        </div>
        <div class="flex sm:hidden items-end grow-0 shrink-0 basis-24 h-1 ml-2">
          <OptimizedImage
            :class="props.type"
            :height="96"
            :src="content.image"
            :srcset="imageSrcSet"
            :width="96"
            class="absolute"
          />
        </div>
      </div>
      <div class="text-bodyS text-fg-default">
        {{ `${content.description} ${content.delivery}` }}
      </div>
    </div>
    <div class="block sm:flex gap-x-1">
      <input
        id="input"
        ref="input"
        :data-gtm-locator="`article_${postId}_clickon_email_address`"
        :disabled="formDisabled"
        :placeholder="i18n.inArticleSubscriptionFormInputPlaceholder"
        :value="value"
        class="w-full px-3 py-2 mb-1 sm:mb-0 rounded border border-border-default focus-visible:border-border-active focus-visible:outline-0 text-uiMWeak h-10 invalid:border-error-default"
        type="email"
        @input="onInput"
        @focus="onFocus"
        @blur="emit('blur')"
      />
      <CtButton
        :data-gtm-locator="`article_clickon_subscribe_${postId}`"
        :disabled="formDisabled"
        :icon-position="status === 'success' ? 'left' : 'none'"
        :label="buttonText"
        :class="{ 'bg-border-default border-0': props.status === 'error' }"
        class="text-center sm:shrink-0 sm:min-w-[8rem] w-full sm:w-auto"
        icon-name="ok"
        round="default"
        size="md"
        :type="status === 'error' ? 'secondary' : 'primary'"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
import { useStore } from '~/lib/framework';
import { computed, ref } from 'vue';
import { CtButton } from '~/lib/ui';
import { buildOptimizedImageUrl, OptimizedImage } from '~/lib/image';

interface Props {
  value: string;
  type: string;
  postId: string;
  status: 'init' | 'pending' | 'error' | 'success';
  error: string;
  content: {
    image: string;
    title: string;
    description: string;
    delivery: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  type: 'markets_outlook',
});
const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'input', val: string): void;
  (e: 'reset-form'): void;
  (e: 'focus'): void;
  (e: 'blur'): void;
}>();

const store = useStore();
const i18n = computed<Record<string, string>>(() => store.state.i18n);

const input = ref<HTMLInputElement | null>(null);

const emailFilled = computed(() => Boolean(props.value));
const formDisabled = computed(() => props.status === 'pending' || props.status === 'success');

const buttonText = computed(() => {
  switch (props.status) {
    case 'pending':
      return i18n.value.inArticleSubscriptionFormProcessing;
    case 'error':
      return i18n.value.inNewsletterSubscriptionFormButtonError;
    case 'success':
      return i18n.value.inArticleSubscriptionFormComplete;
    case 'init':
    default:
      return i18n.value.inArticleSubscriptionFormBtnLabel;
  }
});

const imageSize = ref(96);
const imageSrcSet = computed(() => {
  const x1 = buildOptimizedImageUrl({
    src: props.content.image,
    width: imageSize.value,
    height: imageSize.value,
  });
  const x2 = buildOptimizedImageUrl({
    src: props.content.image,
    width: imageSize.value * 2,
    height: imageSize.value * 2,
  });
  return `${x1} 1x, ${x2} 2x`;
});

const onSubmitHandler = () => {
  if (emailFilled.value) {
    emit('submit');
  }
  input.value?.focus();
};
const onInput = ({ target }: any) => {
  emit('input', target.value);
};
const onFocus = () => {
  emit('focus');
  if (props.status === 'error') {
    emit('reset-form');
  }
};
</script>
