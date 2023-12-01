<template>
  <nav
    class="footer-navigation"
    :class="[isRtl && 'footer-navigation_rtl']"
  >
    <div
      v-for="item in list"
      :key="item.id"
      class="footer-navigation__wrp"
    >
      <span class="footer-navigation__cap">
        {{ item.title }}
      </span>
      <ul
        v-if="item.children && item.children.length"
        class="footer-navigation__list"
      >
        <li
          v-for="subItem in item.children"
          :key="subItem.id"
          class="footer-navigation__item"
        >
          <a
            v-if="subItem.url && subItem.isExternal"
            class="footer-navigation__link"
            rel="noopener"
            :target="subItem.target"
            :href="subItem.url"
            data-testid="footer-link"
          >
            <span class="footer-navigation__link-cap">
              {{ subItem.title }}
              <span
                v-if="subItem.badgeType"
                class="footer-navigation__link-badge"
                :class="`footer-navigation__link-badge_${subItem.badgeType}`"
              >
                {{ i18n[subItem.badgeI18nKey] }}
              </span>
            </span>
          </a>
          <LinkResolver
            v-else-if="subItem.url"
            class="footer-navigation__link"
            :to="subItem.url"
            :language-short="languageShort"
            data-testid="footer-link"
          >
            <span class="footer-navigation__link-cap">
              {{ subItem.title }}
            </span>
            <span
              v-if="subItem.badgeType"
              class="footer-navigation__link-badge"
              :class="`footer-navigation__link-badge_${subItem.badgeType}`"
            >
              {{ i18n[subItem.badgeI18nKey] }}
            </span>
          </LinkResolver>
          <span
            v-else
            class="footer-navigation__mock"
          >
            <span class="footer-navigation__link-cap">
              {{ subItem.title }}
            </span>
            <span
              v-if="subItem.badgeType"
              class="footer-navigation__link-badge"
              :class="`footer-navigation__link-badge_${subItem.badgeType}`"
            >
              {{ i18n[subItem.badgeI18nKey] }}
            </span>
          </span>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ROOT } from '~/store/types';
import LinkResolver from '~/components/Shared/LinkResolver';

export default {
  name: 'FooterNavigation',
  components: {
    LinkResolver,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    i18n: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState({
      languageShort: ({ currentLanguage: { short } }) => short,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
    }),
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.footer-navigation {
  align-items: stretch;
  justify-content: space-between;
  margin: 0 -16px;
}
.footer-navigation__wrp {
  max-width: 154px;
  padding: 0 16px;
  box-sizing: border-box;
}
.footer-navigation__cap {
  font-size: 0.8125rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #798b95;
  font-weight: bold;
}
.footer-navigation__list {
  display: block;
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
}
.footer-navigation__item {
  padding: 6px 0;
  margin-bottom: 5px;
}
.footer-navigation__link {
  position: relative;
  display: block;
  text-decoration: none;
  font-size: 0.875rem;
  color: #fafafa;
  transition: color 0.15s;
}
.footer-navigation__link:hover {
  color: #ffcd04;
}
.footer-navigation__mock {
  position: relative;
  display: block;
  font-size: 0.875rem;
  font-weight: 300;
  color: #5d8092;
  cursor: default;
}
.footer-navigation__link-badge {
  position: absolute;
  top: 50%;
  padding: 0 4px 0 0;
  text-transform: uppercase;
  line-height: 16px;
  font-size: 0.563rem;
  color: #253137;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  transform: translate(17px, -50%) translateZ(0);
  transition: transform 0.25s, color 0.15s;
}
.footer-navigation__link-badge::before {
  content: '';
  position: absolute;
  top: 0;
  left: -8px;
  width: 0;
  height: 0;
  border: solid 8px transparent;
  border-left-width: 0;
  border-right-color: inherit;
}
.footer-navigation__link-badge_new,
.footer-navigation__link-badge_partner {
  background-color: #ffcd04;
  border-color: #ffcd04;
  color: #000;
}
.footer-navigation__link-badge_soon {
  background-color: #5d8092;
  border-color: #5d8092;
  color: #afbdc4;
}
.footer-navigation__link:hover .footer-navigation__link-badge,
.footer-navigation__mock:hover .footer-navigation__link-badge {
  transform: translate(12px, -50%) translateZ(0);
}
.footer-navigation_rtl {
  direction: rtl;
}
@media (min-width: $lg) {
  .footer-navigation__item {
    margin-bottom: 1px;
  }
  .footer-navigation__wrp {
    max-width: 192px;
  }
}
.footer-navigation_rtl .footer-navigation__link-badge {
  left: 0;
  right: auto;
  padding-left: 4px;
  padding-right: 0;
}
.footer-navigation_rtl .footer-navigation__link-badge::before {
  left: auto;
  right: -8px;
  border: solid 8px transparent;
  border-right-width: 0;
  border-left-color: inherit;
}
.footer-navigation_rtl .footer-navigation__link:hover .footer-navigation__link-badge,
.footer-navigation_rtl .footer-navigation__mock:hover .footer-navigation__link-badge {
  transform: translate(4px, -50%) translateZ(0);
}
</style>
