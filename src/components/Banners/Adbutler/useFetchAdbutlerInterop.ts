import { AdbutlerCompositeKey, useAdbutlerManager } from '~/lib/adbutler';
import { ADBUTLER_ID } from '~/app.config';
import { useAbortSignal } from '~/assets/libs/useAbortSignal';
import { getMappedAdbutlerData } from '~/assets/helpers/banners';

export type FetchAdbutlerInterop = (bannerOptions: unknown) => Promise<unknown>;

export const useFetchAdbutlerInterop = (): FetchAdbutlerInterop => {
  const manager = useAdbutlerManager();

  // @ts-expect-error unsafe shitty helper
  const fetchAdbutlerInterop = async (bannerOptions) => {
    const zoneId = bannerOptions?.adbutlerZoneId || null;
    const place = bannerOptions?.place || '';

    if (!zoneId) return null;

    const signal = useAbortSignal();
    const key = new AdbutlerCompositeKey(String(ADBUTLER_ID), String(zoneId));
    const placement = await manager.getPlacement(key, signal);
    return getMappedAdbutlerData(
      {
        placement_1: placement,
      },
      {
        place,
      }
    );
  };

  return fetchAdbutlerInterop as never;
};
