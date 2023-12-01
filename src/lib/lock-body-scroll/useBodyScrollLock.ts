import { onBeforeUnmount, onMounted } from 'vue';

export const useBodyScrollLock = (): void => {
  const lockBodyScroll = (val: boolean) => {
    const body = document.body;
    val ? (body.style.overflowY = 'hidden') : (body.style.overflowY = 'scroll');
  };

  onMounted(() => {
    lockBodyScroll(true);
  });

  onBeforeUnmount(() => {
    lockBodyScroll(false);
  });
};
