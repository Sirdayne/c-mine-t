import { DeviceType } from './DeviceType';

// from src/assets/styles/_vars.scss
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 992;

export const detectDeviceTypeByWindowWidth = (windowWidth: number): DeviceType => {
  if (windowWidth < MOBILE_BREAKPOINT) return DeviceType.MOBILE;
  if (windowWidth < TABLET_BREAKPOINT) return DeviceType.TABLET;

  return DeviceType.DESKTOP;
};
