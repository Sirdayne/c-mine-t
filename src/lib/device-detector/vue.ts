import { onMounted, ref } from 'vue';
import { useContext } from '@nuxtjs/composition-api';
import { useEventListener } from '@vueuse/core';
import { createInjection, useTransferRef, whenIdle } from '~/lib/shared';
import { type DeviceInfo } from './core/DeviceInfo';
import { DeviceType } from './core/DeviceType';
import { detectDeviceTypeByUserAgent } from './core/detectDeviceTypeByUserAgent';
import { detectDeviceTypeByWindowWidth } from './core/detectDeviceTypeByWindowWidth';
import { DeviceInfoImpl } from './DeviceInfoImpl';

const useDetectDeviceTypeByUserAgent = (): DeviceType => {
  const ctx = useContext();
  let userAgent = '';
  if (process.server && ctx.req) userAgent = ctx.req.headers['user-agent'] || '';
  if (process.client) userAgent = navigator.userAgent;

  // mobile by default
  if (!userAgent) return DeviceType.MOBILE;

  return detectDeviceTypeByUserAgent(userAgent);
};

/**
 * should be initialized only once
 *
 * TODO: refactor to pinia
 */
const _useDeviceInfoFactory = (): DeviceInfo => {
  const deviceTypeRef = ref(DeviceType.MOBILE);
  useTransferRef(deviceTypeRef, 'deviceType');

  deviceTypeRef.value = useDetectDeviceTypeByUserAgent();

  onMounted(async () => {
    const updateDeviceTypeByWindowWidth = (): void => {
      deviceTypeRef.value = detectDeviceTypeByWindowWidth(window.innerWidth);
    };

    /**
     * To prevent hydration mismatch,
     * "deviceTypeRef" should update only
     * when Vue hydrated and idle
     *
     * This allows to safely resize window
     * during bundle load and execution
     */
    await whenIdle();
    updateDeviceTypeByWindowWidth();
    useEventListener(window, 'resize', updateDeviceTypeByWindowWidth);
  });

  return new DeviceInfoImpl(deviceTypeRef);
};

const injection = createInjection<DeviceInfo>('device-info');

export const provideDeviceInfo = (deviceInfo = _useDeviceInfoFactory()): void => {
  injection.provide(deviceInfo);
};

export const useDeviceInfo = injection.use;
