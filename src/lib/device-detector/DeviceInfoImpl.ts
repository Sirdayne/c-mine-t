import { type Ref, unref } from 'vue';
import { DeviceInfo } from './core/DeviceInfo';
import { DeviceType } from './core/DeviceType';

/**
 * Device info impl that reacts to vue refs
 */
export class DeviceInfoImpl implements DeviceInfo {
  constructor(private readonly _deviceTypeRef: Ref<DeviceType>) {}

  get mobile(): boolean {
    return unref(this._deviceTypeRef) === DeviceType.MOBILE;
  }

  get tablet(): boolean {
    return unref(this._deviceTypeRef) === DeviceType.TABLET;
  }

  get desktop(): boolean {
    return unref(this._deviceTypeRef) === DeviceType.DESKTOP;
  }
}
