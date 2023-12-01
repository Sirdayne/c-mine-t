import Vue, { defineComponent, h, onScopeDispose, type VNode } from 'vue';
import { provideAdbutlerManager, useAdbutlerManager } from '~/lib/adbutler';
import { provideDeviceInfo, useDeviceInfo } from '~/lib/device-detector';
import { useRouter, useStore } from '~/lib/framework';
import { provideClient, useClient } from '~/graphql';
import { provideConpletusApi, useConpletusApi } from '~/lib/conpletus-api';

export interface ChildVueAppConfig {
  target: string | HTMLElement;
  render: () => VNode;
}

export interface ChildVueAppFactory {
  createApp(config: ChildVueAppConfig): Vue;
}

/**
 * Dumb component that renders passed render function
 * Required because provided context can be injected
 * only in child components
 */
const Renderer = defineComponent({
  name: 'Renderer',

  // eslint-disable-next-line vue/require-prop-types
  props: ['render'],

  setup(props) {
    return props.render;
  },
});

/**
 * like `new Vue()`, but re-provides all context - store, router, adbutler, etc
 *
 * TODO: should be replaced with <Teleport /> during migration to Vue3
 * WARNING: created vms automatically destroyed before unmount
 *
 * @return Vue app factory that d
 */
export const useChildVueAppFactory = (): ChildVueAppFactory => {
  const store = useStore();
  const router = useRouter();
  const client = useClient();
  const adbutlerManager = useAdbutlerManager();
  const deviceInfo = useDeviceInfo();
  const conpletusApi = useConpletusApi();

  const vms = new Set<Vue>();

  onScopeDispose(() => {
    for (const vm of vms) vm.$destroy();
  });

  return new (class ChildVueAppFactoryImpl implements ChildVueAppFactory {
    createApp({ target, render }: ChildVueAppConfig): Vue {
      const vm = new Vue({
        name: 'ChildVueApp',
        store,
        router,

        setup() {
          provideDeviceInfo(deviceInfo);
          provideAdbutlerManager(adbutlerManager);
          provideClient(client);
          provideConpletusApi(conpletusApi.__getAxios());

          return () =>
            h(Renderer, {
              props: {
                render,
              },
            });
        },
      });

      vms.add(vm);
      vm.$mount(target);

      return vm;
    }
  })();
};
