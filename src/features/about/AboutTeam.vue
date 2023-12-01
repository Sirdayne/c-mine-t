<script setup lang="ts">
import { computed, unref } from 'vue';
import { useStore } from '~/lib/framework';
import { CtTogglePill } from '~/lib/ui';
import { AboutTeamDocument, useQuery } from '~/graphql';
import type { AboutTeamMember } from './AboutTeamMember';
import type { Author } from '~/graphql/generated';

import AboutTeamMemberCard from './AboutTeamMemberCard.vue';
import { translatePropsOrExclude } from './translatePropsOrExclude';
import { useRouteQuery } from '~/assets/libs/nuxtComposables';

interface Option {
  label: string;
  id: 'authors' | 'management-team' | 'local-team';
}

const store = useStore();
const i18n = computed(() => store.state.i18n);

const options = computed(() => {
  const options: Option[] = [
    {
      id: 'authors',
      label: 'about.team.options.authors',
    },
    {
      id: 'management-team',
      label: 'about.team.options.management-team',
    },
  ];

  if (!store.getters['IS_EN'])
    options.unshift({
      id: 'local-team',
      label: 'about.team.options.local-team',
    });

  return translatePropsOrExclude(unref(i18n), ['label'], options);
});

const parseSelectedOptionId = (selectedId: string | null, options: Option[]): Option['id'] | null => {
  const firstOptionId = options[0]?.id || null;
  const exists = options.some((nextOption) => nextOption.id === selectedId);

  if (!exists) return firstOptionId;

  return selectedId as Option['id'];
};

const selectedOptionIdByUrl = useRouteQuery('members-of', '');

const selectedOptionId = computed<Option['id'] | null>({
  get() {
    return parseSelectedOptionId(unref(selectedOptionIdByUrl), unref(options));
  },
  set(value) {
    selectedOptionIdByUrl.value = value || '';
  },
});

const aboutTeamQuery = useQuery({
  query: AboutTeamDocument,
  variables: {
    short: computed(() => store.state.currentLanguage.short),
  },
});

const members = computed(() => {
  const data = unref(aboutTeamQuery.data)?.locale;
  const result: AboutTeamMember[] = [];

  const mapGraphqlMember = (member: {
    id: string;
    title: string;
    photo: string;
    email: string;
    twitter: string;
    linkedin: string;
    job_title: string;
  }): AboutTeamMember => ({
    id: member.id,
    name: member.title,
    avatarUrl: member.photo,
    url: null,
    emailAddress: member.email,
    twitterUrl: member.twitter,
    linkedinUrl: member.linkedin,
    jobTitle: member.job_title,
  });

  const fillWithGraphqlMembers = (
    graphqlTeamMembers: (
      | {
          id: string;
          title: string;
          photo: string;
          email: string;
          twitter: string;
          linkedin: string;
          job_title: string;
        }
      | null
      | undefined
    )[]
  ): void => {
    for (const graphqlTeamMember of graphqlTeamMembers) {
      if (graphqlTeamMember) result.push(mapGraphqlMember(graphqlTeamMember));
    }
  };

  const formatAuthors = (authors: Author[], withJobTitle: boolean = true) => {
    const res = [];
    for (const graphqlAuthor of authors ?? []) {
      const translate = graphqlAuthor?.authorTranslates?.[0];

      if (!(graphqlAuthor && translate && graphqlAuthor.avatar && translate.showInAuthors && translate.name)) continue;

      res.push({
        id: graphqlAuthor.id,
        avatarUrl: graphqlAuthor.avatar,
        name: translate.name,
        url: `/authors/${graphqlAuthor.slug}`,
        jobTitle: withJobTitle ? 'Author' : null,
        twitterUrl: graphqlAuthor.twitter ?? null,
        emailAddress: graphqlAuthor.email ?? null,
        linkedinUrl: graphqlAuthor.linkedin ?? null,
      });
    }
    return res;
  };

  switch (unref(selectedOptionId)) {
    case 'local-team': {
      const localTeam = data?.localTeam ?? [];
      const localAuthors = (data?.localAuthors ?? []).filter((author): author is Author => author !== null);
      result.push(...formatAuthors(localAuthors));
      fillWithGraphqlMembers(localTeam);
      break;
    }

    case 'authors': {
      const authors = (data?.authors ?? []).filter((author): author is Author => author !== null);
      result.push(...formatAuthors(authors, false));
      break;
    }

    case 'management-team': {
      fillWithGraphqlMembers(data?.team ?? []);
      break;
    }

    default:
      break;
  }
  return result;
});
</script>

<template>
  <div>
    <div class="max-w-[46rem] my-5 md:my-6">
      <div class="flex flex-wrap gap-2">
        <CtTogglePill
          v-for="option of options"
          :key="option.id"
          :data-testid="`about-page-tab-${option.id}`"
          link
          :href="`?members-of=${option.id}`"
          :active="option.id === selectedOptionId"
          size="md"
          @click.native.prevent="selectedOptionId = option.id"
        >
          {{ option.label }}
        </CtTogglePill>
      </div>
    </div>

    <div
      data-testid="about-page-team-grid"
      class="grid gap-[16px] md:gap-5"
      :class="$style['about-team-members-grid']"
    >
      <AboutTeamMemberCard
        v-for="member of members"
        :key="member.id"
        :member="member"
      />
    </div>
  </div>
</template>

<style module lang="scss">
@import '~/assets/styles/_vars.scss';

.about-team-members-grid {
  --about-team-member-grid-column-width: 384px;
  --about-team-member-grid-column-count: 1;

  grid-template-columns: repeat(
    var(--about-team-member-grid-column-count),
    minmax(auto, var(--about-team-member-grid-column-width))
  );

  @media (min-width: $sm) {
    --about-team-member-grid-column-count: 2;
  }

  @media (min-width: $lg) {
    --about-team-member-grid-column-count: 3;
  }
}
</style>
