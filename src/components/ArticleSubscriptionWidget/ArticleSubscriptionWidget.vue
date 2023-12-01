<template>
  <div
    class="group article-subscription shadow-default p-4 sm:py-6 sm:pl-6 sm:pr-3 rounded-lg overflow-x-hidden max-w-[644px]"
  >
    <div class="peer flex flex-row flex-nowrap sm:gap-x-4">
      <ArticleSubscriptionWidgetForm
        v-model.trim="email"
        :content="formContent"
        :error="errorMessage"
        :post-id="postId"
        :status="status"
        :type="props.type"
        :image-src-set="imageSrcSet"
        @submit="submitForm(mailList)"
        @reset-form="resetForm()"
        @focus="focused = true"
        @blur="handleBlur"
      />
      <div class="hidden sm:block">
        <div class="w-48 h-48">
          <OptimizedImage
            :width="imageSize"
            :height="imageSize"
            :srcset="imageSrcSet"
            :class="props.type"
            :src="formContent.image"
          />
        </div>
      </div>
    </div>
    <div
      v-if="deviceInfo.desktop || focused"
      class="mt-3 tos text-fg-muted text-uiXsWeak text-center sm:text-left"
      v-html="i18n.inArticleSubscriptionFormTos"
    />
  </div>
</template>

<script lang="ts" setup>
import { subscribeMailList } from '~/api/modules/subscriptions';
import ArticleSubscriptionWidgetForm from './ArticleSubscriptionWidgetForm';
import { computed, ref } from 'vue';
import { useStore } from '~/lib/framework';
import { buildOptimizedImageUrl, OptimizedImage } from '~/lib/image/';
import { useDeviceInfo } from '~/lib/device-detector';
const deviceInfo = useDeviceInfo();

const emit = defineEmits<{
  (e: 'subscribed'): void;
}>();

const props = withDefaults(
  defineProps<{
    type?: string;
    postId: string;
  }>(),
  {
    type: 'markets_outlook',
  }
);

const store = useStore();
const i18n = computed(() => store.state.i18n);

const focused = ref(false);

const handleBlur = () => {
  setTimeout(() => {
    focused.value = false;
  }, 0);
};

const formContent = computed(() => {
  switch (props.type) {
    case 'markets_outlook':
      return {
        image: 'https://s3.cointelegraph.com/storage/uploads/view/3c6021603a7455fadda1e3a4f4ee1e7a.svg',
        title: i18n.value.inArticleSubscriptionFormMarketsOutlookTitle,
        description: i18n.value.newsletterPageMarketsOutlookDescription,
        delivery: i18n.value.inArticleSubscriptionFormMarketsOutlookDelivery,
      };
    case 'magazine':
      return {
        image: 'https://s3.cointelegraph.com/storage/uploads/view/ad78a3a21df0310c8c128fc10a3b200d.svg',
        title: i18n.value.newsletterPageMagazineNewsletterTitle,
        description: i18n.value.newsletterPageMagazineNewsletterDescription,
        delivery: i18n.value.inArticleSubscriptionFormMagazineDelivery,
      };
    case 'defi_newsletter':
      return {
        image: 'https://s3.cointelegraph.com/storage/uploads/view/4e0b96413239cecf20ea5533e8db23dd.svg',
        title: i18n.value.inArticleSubscriptionFormDefiNewsletterTitle,
        description: i18n.value.newsletterPageDeFiNewsletterDescription,
        delivery: i18n.value.inArticleSubscriptionFormDefiNewsletterDelivery,
      };
    case 'nifty_newsletter':
      return {
        image: 'https://s3.cointelegraph.com/storage/uploads/view/0d86bc4aa7062cddf58cfe6c84268e02.svg',
        title: i18n.value.inArticleSubscriptionFormNiftyNewsletterTitle,
        description: i18n.value.newsletterPageNiftyNewsletterDescription,
        delivery: i18n.value.inArticleSubscriptionFormNiftyNewsletterDelivery,
      };
    case 'law_decoded':
      return {
        image: 'https://s3.cointelegraph.com/storage/uploads/view/f291987dfbab256f717e6866e31a8e62.svg',
        title: i18n.value.inArticleSubscriptionFormLawDecodedTitle,
        description: i18n.value.newsletterPageLawDecodedDescription,
        delivery: i18n.value.inArticleSubscriptionFormLawDecodedDelivery,
      };
    case 'one_minute_letter':
      return {
        image: 'https://s3.cointelegraph.com/storage/uploads/view/0444211fb578a3559c7026513b18ed7e.svg',
        title: i18n.value.newsletterPageOneMinuteLetterTitle,
        description: i18n.value.newsletterPageOneMinuteLetterDescription,
        delivery: i18n.value.inArticleSubscriptionFormOneMinuteLetterDelivery,
      };
    case 'week_in_review':
      return {
        image: 'https://s3.cointelegraph.com/storage/uploads/view/a5eba7e7e1750d05ebacf2c0194611f1.svg',
        title: i18n.value.newsletterPageWeekInReviewTitle,
        description: i18n.value.newsletterPageWeekInReviewDescription,
        delivery: i18n.value.inArticleSubscriptionFormWeekInReviewDelivery,
      };
    case 'crypto_biz':
      return {
        image: 'https://s3.cointelegraph.com/storage/uploads/view/51588c17a3928e263aa7f89025caab3f.svg',
        title: i18n.value.inArticleSubscriptionFormCryptoBizTitle,
        description: i18n.value.newsletterPageCryptoBizNewsletterDescription,
        delivery: i18n.value.inArticleSubscriptionFormCryptoBizDelivery,
      };
    case 'altcoin_roundup':
      return {
        image: 'https://s3.cointelegraph.com/storage/uploads/view/1526d9c0cf3b02f2bffe6b3589517afd.svg',
        title: i18n.value.newsletterPageAltcoinRoundupTitle,
        description: i18n.value.newsletterPageAltcoinRoundupDescription,
        delivery: i18n.value.newsletterPageAltcoinRoundupSubheading,
      };
    case 'consulting_newsletter':
    default:
      return {
        image: 'https://s3.cointelegraph.com/storage/uploads/view/410c9d036f809e693ccafbc2927a9382.svg',
        title: i18n.value.inArticleSubscriptionFormConsultingNewsletterTitle,
        description: i18n.value.newsletterPageDescription,
        delivery: i18n.value.newsletterPageConsultingNewsletterSubheading,
      };
  }
});

const email = ref('');
const status = ref<'init' | 'pending' | 'error' | 'success'>('init');
const errorMessage = ref('');

const mailList = computed(() => [
  {
    email: email.value,
    url: props.type,
  },
]);
const imageSize = ref(192);
const imageSrcSet = computed(() => {
  const x1 = buildOptimizedImageUrl({
    src: formContent.value.image,
    width: imageSize.value,
    height: imageSize.value,
  });
  const x2 = buildOptimizedImageUrl({
    src: formContent.value.image,
    width: imageSize.value * 2,
    height: imageSize.value * 2,
  });
  return `${x1} 1x, ${x2} 2x`;
});

const resetForm = () => {
  email.value = '';
  errorMessage.value = '';
  status.value = 'init';
};

const submitForm = async (mailList: { email: string; url: string }[]) => {
  if (!mailList.length) {
    return;
  }
  if (status.value === 'error') {
    resetForm();
    return;
  }
  status.value = 'pending';

  const { errors } = await subscribeMailList(mailList);
  if (!errors) {
    status.value = 'success';
    emit('subscribed');
  } else {
    status.value = 'error';
  }
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.article-subscription .tos a {
  @apply text-fg-muted underline decoration-fg-primaryDefault decoration-1 underline-offset-4 block sm:inline;
  border-bottom: none;
}

@media (min-width: $sm) {
  .magazine,
  .crypto_biz,
  .nifty_newsletter,
  .one_minute_letter,
  .week_in_review,
  .defi_newsletter {
    transform: translateX(-1rem);
  }
}
</style>
