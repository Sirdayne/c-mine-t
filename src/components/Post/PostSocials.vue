<template>
  <div :class="$style['post-socials']">
    <h3 :class="$style['post-socials__title']">Join us on social networks</h3>
    <div :class="$style['post-socials__wrapper']">
      <template v-for="social in socialLinks">
        <PostSocial
          :key="social.id"
          :social="social"
          :class="$style['post-socials__link']"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from '~/lib/framework';
import PostSocial from '~/components/Post/PostSocial.vue';

export default defineComponent({
  name: 'PostSocials',
  components: { PostSocial },
  setup() {
    const store = useStore();
    const socialLinks = computed(() => store.state.settings.socials?.socialsPostContent);

    return {
      socialLinks,
    };
  },
});
</script>

<style lang="scss" module>
@use '~/assets/styles/_icons-socials.scss' as social-icons;
@import '~/assets/styles/_vars.scss';
@import '~/assets/styles/_mixins.scss';

.post-socials {
  border: 1px solid $color-gray-150;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  @media (min-width: $xs) {
    padding: 24px;
  }
  @media (min-width: $sm) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  @media (min-width: $md) {
    margin-left: 74px;
  }

  &__title {
    margin: 0 16px 12px 0;
    color: $color-black-950;
    @include section-title($size: 16px, $line-height: 24px);
    @media (min-width: $sm) {
      @include section-title($size: 18px, $line-height: 24px);

      margin-bottom: 0;
    }
  }
  &__wrapper {
    display: flex;
  }
  &__link {
    margin: 0 3px;
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
