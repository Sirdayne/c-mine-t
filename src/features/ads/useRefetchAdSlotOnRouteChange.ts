import { onBeforeUnmount, onMounted } from 'vue';
import { type MaybeRefOrGetter, toValue } from '@vueuse/core';
import { useRouter } from '~/lib/framework';
import { UseAdSlot } from './adslot/useAdSlot';

export const useRefetchAdSlotOnRouteChange = (adSlot: UseAdSlot, disabled: MaybeRefOrGetter<boolean>): void => {
  onMounted(() => {
    const router = useRouter();
    const unwatchRouter = router.afterEach(() => {
      if (toValue(disabled)) return;

      adSlot.trigger();
    });

    onBeforeUnmount(unwatchRouter);
  });
};
