<script setup lang="ts">
import { computed } from 'vue';
import OptimizedImage from '~/lib/image/OptimizedImage.vue';
import LinkResolver from '~/components/Shared/LinkResolver.vue';
import { AboutTeamMember } from './AboutTeamMember';

const props = defineProps<{
  member: AboutTeamMember;
}>();

interface SocialLink {
  href: string;
  icon: 'email' | 'linkedin' | 'twitter';
}

const socialLinks = computed(() => {
  const { emailAddress, linkedinUrl, twitterUrl } = props.member;
  const socialLinks: SocialLink[] = [];

  if (twitterUrl)
    socialLinks.push({
      icon: 'twitter',
      href: twitterUrl,
    });

  if (emailAddress)
    socialLinks.push({
      icon: 'email',
      href: `mailto:${emailAddress}`,
    });

  if (linkedinUrl)
    socialLinks.push({
      icon: 'linkedin',
      href: linkedinUrl,
    });

  return socialLinks;
});
</script>

<template>
  <div
    data-testid="about-page-team-card"
    class="rounded-lg shadow overflow-hidden block max-w-[384px] border border-[#627f8c59]"
  >
    <LinkResolver
      :href="member.url"
      class="block"
    >
      <OptimizedImage
        data-testid="about-page-team-card-image"
        :src="member.avatarUrl"
        :width="384"
        :height="384"
        class="block object-cover sm:max-lg:h-auto"
      />
    </LinkResolver>
    <div
      :class="$style.ltr"
      class="py-4 px-5 w-full bg-white flex flex-col gap-[11px]"
    >
      <div class="flex flex-nowrap">
        <span
          data-testid="about-page-team-card-name"
          class="mr-auto font-semibold"
          >{{ member.name }}</span
        >
        <a
          v-for="socialLink of socialLinks"
          :key="socialLink.href"
          :href="socialLink.href"
          data-testid="about-page-team-card-social-link"
          target="_blank"
          class="mr-2 last:mr-0 w-6 h-6"
          @click.stop
        >
          <img
            :alt="socialLink.icon"
            :src="`/icons/about/${socialLink.icon}.svg`"
          />
        </a>
      </div>
      <div
        v-if="member.jobTitle"
        data-testid="about-page-team-card-job-title"
        class="text-fg-muted"
      >
        {{ member.jobTitle }}
      </div>
    </div>
  </div>
</template>
<style lang="scss" module>
.ltr {
  direction: ltr;
}
</style>
