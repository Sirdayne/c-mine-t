<template>
  <div
    class="innovation-circle-about"
    :class="[isRtl && 'innovation-circle-about_rtl']"
  >
    <div class="innovation-circle-about__cover-wrp">
      <LazyImage
        class="innovation-circle-about__cover"
        :src="coverImage.src"
        :alt="coverImage.alt"
        :immediate="true"
      />
    </div>
    <div class="innovation-circle-about__desc-col">
      <div class="innovation-circle-about__desc">
        <p>
          Cointelegraph Innovation Circle is a vetted professional organization of founders, partners, C-suite
          executives, principal decision makers (VP or higher), and experts in the fields of blockchain technology,
          cryptocurrency, Web3, NFTs, and decentralization in industries such as finance, insurance, gaming, healthcare,
          and more.
        </p>
        <p>
          We provide a secure environment for members which includes access to industry-leading peers, member-led
          educational events, and unique publishing opportunities.
        </p>
        <p>
          We are committed to building strong connections and fostering meaningful interactions because we believe the
          human element is a critical key to success. Our two most important values are trust and cooperation, which is
          why our vetting process ensures every member is reputable.
        </p>
        <p>
          We believe cooperation and collaboration at this critical time will set the course for the future. Now is the
          time for blockchain leaders to come together in the Community of Trust. See if you
          <a href="https://hubs.ly/Q016wTpR0">qualify for membership</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ROOT } from '~/store/types';
import LazyImage from '~/components/Shared/LazyImage.vue';

export default {
  name: 'InnovationCircleAbout',
  components: {
    LazyImage,
  },
  props: {
    coverImage: {
      type: Object,
      default: () => ({ src: '/assets/img/innovation-circle.png', alt: 'Innovation Circle' }),
    },
    i18n: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.innovation-circle-about {
  background-color: #fafafa;
  padding: 12px 0 0;
}
.innovation-circle-about__cover-wrp {
  display: block;
  width: 100%;
  max-width: 220px;
  margin: 0 auto 12px;
}
.innovation-circle-about__cover {
  position: relative;
  display: block;
  width: 100%;
  height: 0;
  padding-top: 100%;
}
.innovation-circle-about__desc-col {
  padding: 0 12px 12px;
}
.innovation-circle-about__desc {
  font-size: 0.875rem;
}
.innovation-circle-about__desc p,
.innovation-circle-about__desc ul {
  margin: 10px 0;
}
.innovation-circle-about__desc p {
  font-weight: normal;
  font-size: inherit;
}
.innovation-circle-about__desc p:empty {
  display: none;
}
.innovation-circle-about__desc ul {
  padding-left: 24px;
}
.innovation-circle-about__desc li {
  font-weight: 600;
  font-size: inherit;
  color: #000;
}
.innovation-circle-about__desc a {
  text-decoration: none;
  font-size: inherit;
  font-weight: 600;
  color: #337ab7;
}
.innovation-circle-about__desc a:hover {
  text-decoration: underline;
  color: #23527c;
}
.innovation-circle-about__desc p:first-child,
.innovation-circle-about__desc ul:first-child,
.innovation-circle-about__desc li:first-child {
  margin-top: 0;
}
.innovation-circle-about__desc p:last-child,
.innovation-circle-about__desc ul:last-child,
.innovation-circle-about__desc li:last-child {
  margin-bottom: 0;
}
.innovation-circle-about_desc-only .innovation-circle-about__desc {
  padding: 12px;
}
.innovation-circle-about__cover .lazy-image__img {
  object-fit: contain;
}

.innovation-circle-about_rtl {
  direction: rtl;
}
.innovation-circle-about_rtl .innovation-circle-about__desc ul {
  padding-left: 0;
  padding-right: 24px;
}

@media (min-width: $sm) {
  .innovation-circle-about__cover-wrp {
    margin: 12px auto 24px;
  }
  .innovation-circle-about__desc-col {
    padding: 0 24px 24px;
  }
  .innovation-circle-about__desc {
    font-size: 1rem;
  }
  .innovation-circle-about_desc-only .innovation-circle-about__desc-col {
    padding: 24px;
  }
}
@media (min-width: $md) {
  .innovation-circle-about {
    display: flex;
    align-items: flex-start;
  }
  .innovation-circle-about__cover-wrp {
    flex-shrink: 0;
    width: 240px;
    margin: 48px;
  }
  .innovation-circle-about__desc-col {
    flex-grow: 1;
    padding: 48px 48px 48px 0;
  }
  .innovation-circle-about_desc-only {
    display: block;
  }
  .innovation-circle-about_desc-only .innovation-circle-about__desc-col {
    padding: 48px;
  }
}
</style>
