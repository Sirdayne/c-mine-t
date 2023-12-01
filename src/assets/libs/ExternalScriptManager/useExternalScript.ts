import { computedAsync, type MaybeRefOrGetter, toValue, useMounted } from '@vueuse/core';
import { type Ref } from 'vue';
import { useAbortSignal } from '../useAbortSignal';
import { ExternalScriptManager } from './ExternalScriptManager';
import { captureError } from '~/lib/telemetry';

/**
 * Composable to add external script on site
 * Safe to use on SSR
 *
 * @param src same as <script src>
 * @returns flag indicates that script successfuly loaded
 */
export const useExternalScript = (src: MaybeRefOrGetter<string>): Readonly<Ref<boolean>> => {
  const externalScriptManager = new ExternalScriptManager();
  const mounted = useMounted();

  return computedAsync(
    async (onCancel) => {
      const signal = useAbortSignal(onCancel);
      const externalScript = externalScriptManager.add(toValue(src));

      onCancel(() => externalScript.destroy());

      try {
        await externalScript.waitLoaded(signal);
        return true;
      } catch (error) {
        captureError(error);
        return false;
      }
    },
    false,
    {
      lazy: false,
      evaluating: mounted,
    }
  );
};
