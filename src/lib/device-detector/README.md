# device-detector

Universal device detection

On SSR detects from User-Agent (from request headers)

On client side by breakpoints

## Quirks

1. Breakpoint detection runs only after hydration to prevent mismatch

## Usage

```typescript
import { defineComponent, h } from 'vue';
import { provideDeviceInfo, useDeviceInfo, DeviceInfo } from '~/lib/device-detector';

class FakeDeviceInfo implements DeviceInfo {
  readonly mobile = true;
  readonly desktop = false;
}

const Root = defineComponent({
  setup() {
    /**
     * root component should always provide device info
     */

    /**
     * default device info resolving
     */
    provideDeviceInfo();

    /**
     * fake data for testing
     */
    provideDeviceInfo(new FakeDeviceInfo());

    return () => h(Descendant);
  },
});

const Descendant = defineComponent({
  setup() {
    /**
     * descendants do injection
     */
    const deviceInfo = useDeviceInfo();

    return () => {
      if (deviceInfo.mobile) return 'mobile!';
      if (deviceInfo.desktop) return 'desktop!';

      return 'impossible state';
    };
  },
});
```
