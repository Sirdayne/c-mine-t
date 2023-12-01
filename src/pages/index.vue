<script>
import { h, defineComponent } from 'vue';
import { useFeatureManager } from '~/lib/feature-manager';
import { useDeviceInfo } from '~/lib/device-detector';

const AsiaMobileIndex = () => import('~/components/RouterViews/Index/AsiaMobile.vue');
const DefaultIndex = () => import('~/components/RouterViews/Index/Index.vue');

export default defineComponent({
  name: 'MainPage',

  setup() {
    const featureManager = useFeatureManager();
    const deviceInfo = useDeviceInfo();

    return () =>
      h(featureManager.isEnabled('asia_mobile_layout') && deviceInfo.mobile ? AsiaMobileIndex : DefaultIndex);
  },
});
</script>
