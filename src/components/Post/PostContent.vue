<template>
  <div
    ref="postContent"
    class="post-content"
    :class="[isAsia && 'post-content_asia', isRtl && 'post-content_rtl']"
    v-html="post"
  />
</template>

<script>
import { h } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { ROOT, IMAGE_MODAL, TICKERS } from '~/store/types';
import { insertElementBetweenContent } from '~/assets/helpers/insertElementBetweenContent';
import PostTickersLiveData from '~/components/Post/LiveData/PostTickersLiveData.vue';
import PodcastPlayer from '~/components/Podcasts/PodcastPlayer.vue';
import ArticleSubscriptionWidget from '../ArticleSubscriptionWidget/ArticleSubscriptionWidget.vue';
import CerosEmbed from './CerosEmbed.vue';
import PostInlineAdSlot from './PostInlineAdSlot.vue';
import { useChildVueAppFactory } from './useChildVueAppFactory';
import InstagramEmbed from '~/components/Post/InstagramEmbed.vue';
import { ChangellyWidget } from '~/features/changelly-widget';
import PostTagsList from '~/components/Post/PostTagsList.vue';
import { useFeatureManager } from '~/lib/feature-manager';
import { useAbortSignal } from '~/assets/libs/useAbortSignal';
import { MarketsProInlineWidget } from '~/features/markets-pro-lead-form';

export default {
  name: 'PostContent',
  props: {
    /**
     * Post (article) body in HTML
     */
    post: {
      type: String,
      default: '',
    },
    mimicBlock: {
      type: String,
      default: '',
    },
    slug: {
      type: String,
      default: null,
    },
    isFirst: {
      type: Boolean,
      default: true,
    },
    postId: {
      type: String,
      required: true,
    },

    /**
     * @type {import('~/features/changelly-widget').ChangellyWidgetViewModel}
     */
    changellyWidgetViewModel: {
      type: Object,
      default: null,
    },

    isPromo: {
      type: Boolean,
      default: false,
    },

    postTagsList: {
      type: Array,
      default: () => [],
    },

    isDefined: {
      type: Boolean,
      default: false,
    },

    /**
     * Init tickers live data or not
     * */
    withoutLiveData: {
      type: Boolean,
      default: false,
    },

    withoutInlineAd: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isLiveDataExist: false,
    };
  },

  computed: {
    ...mapGetters('tickers', {
      coins: TICKERS.POST_COINS,
    }),
    ...mapGetters({
      isRtl: ROOT.IS_RTL,
      isAsia: ROOT.IS_ASIA,
    }),
    marketsTag() {
      return this.postTagsList.find((tag) => tag.slug === 'markets');
    },
  },
  watch: {
    coins: {
      handler() {
        if (this.coins?.length && this.$refs.postContent) {
          this.initTickerLiveData(this.$refs.postContent);
        }
      },
      immediate: true,
    },
  },
  mounted() {
    document.documentElement.style.scrollBehavior = 'smooth';
    this.bindedImages = new Set();
    this.bindImageZoomEvents();

    const featureManager = useFeatureManager();
    const signal = useAbortSignal();

    const subscriptionWidgetEnabled = featureManager.isEnabled('subscription_widget');

    const childVueAppFactory = useChildVueAppFactory();
    this._childVueAppFactory = childVueAppFactory;

    const contentEl = this.$refs.postContent;

    if (contentEl) {
      (async () => {
        await this.changellyWidgetViewModel?.waitReady(signal);

        this.initInlineAdSlot(childVueAppFactory, contentEl);
        this.initTickerLiveData(contentEl);
        this.initTemplateWidgets(
          childVueAppFactory,
          contentEl,
          this.changellyWidgetViewModel,
          subscriptionWidgetEnabled
        );
        this.insertPostTagsBeforeDisclaimer(childVueAppFactory, contentEl);
        this.wrapTableOfContentsLinksText(contentEl);
        this.$emit('contentReady', contentEl);
        this.setGuideTablesWrap(contentEl);
      })();
    }

    this.renderMimicBlock();
  },

  beforeDestroy() {
    document.documentElement.style.scrollBehavior = 'auto';
    this.isLiveDataExist = false;
    this.$el.removeEventListener('click', this.handleLinkClick, false);
    this.unbindImageZoomEvents();
  },

  methods: {
    ...mapActions('imageModal', {
      setImageModalIsShown: IMAGE_MODAL.SET_IS_SHOWN,
      setImageModalData: IMAGE_MODAL.SET_DATA,
    }),
    setGuideTablesWrap(contentEl) {
      const tableList = contentEl.getElementsByTagName('table');
      if (!tableList) return;

      for (const table of tableList) {
        const itemParentClassName = table?.parentElement?.className;

        if (itemParentClassName !== 'table-responsive') {
          const wrapper = document.createElement('div');

          wrapper.setAttribute('class', 'table-responsive');

          table?.parentNode?.insertBefore(wrapper, table);
          wrapper.appendChild(table);
        }
      }
    },

    /**
     * @param {HTMLElement} contentEl
     * @returns {HTMLElement|null} element which text starts with "Disclaimer."
     */
    findPromoDisclaimerBlock(contentEl) {
      const divs = [...contentEl.querySelectorAll('div')].reverse();

      for (const div of divs) {
        if (div.textContent.trim().startsWith('Disclaimer.')) {
          return div;
        }
      }

      return null;
    },

    /**
     * post hashtags before disclaimer
     *
     * @see https://jira.cointelegraph.com/browse/CDT-3113
     * @param {import('./useCreateChildVueAppFactory').ChildVueAppFactory} childVueAppFactory
     * @param {HTMLElement} contentEl
     */
    insertPostTagsBeforeDisclaimer(childVueAppFactory, contentEl) {
      const promoDisclaimerEl = this.findPromoDisclaimerBlock(contentEl);

      if (!(this.isPromo && promoDisclaimerEl)) return;

      const target = document.createElement('span');
      target.setAttribute('data-ct-widget', 'hashtags');

      promoDisclaimerEl.before(target);

      this.$emit('beforeInsertPostTags');

      const gap = '12px !important';
      const border = '1px solid #eae9e9 !important';

      childVueAppFactory.createApp({
        target,
        render: () =>
          h(PostTagsList, {
            props: {
              postId: this.postId,
              tagsList: this.postTagsList,
            },
            style: {
              marginTop: gap,
              paddingTop: gap,
              marginBottom: gap,
              paddingBottom: gap,
              borderTop: border,
              borderBottom: border,
              marginLeft: '0 !important',
            },
          }),
      });
    },

    handleImageClick(e) {
      e.preventDefault();
      const { src = '', alt = '' } = e.target || {};
      this.setImageModalData({ src, alt });
      this.setImageModalIsShown({ isImageModalOpened: true });
    },
    bindImageZoomEvents() {
      Array.from(this.$el.querySelectorAll('img')).forEach((el) => {
        if (el.parentNode.tagName !== 'A') {
          el.addEventListener('click', this.handleImageClick);
          this.bindedImages.add(el);
        }
      });
    },

    unbindImageZoomEvents() {
      this.bindedImages.forEach((el) => {
        el.removeEventListener('click', this.handleImageClick);
      });
      this.bindedImages.clear();
    },

    /**
     * init inline ad slot
     * @param {import('./useCreateChildVueAppFactory').ChildVueAppFactory} childVueAppFactory
     * @param {HTMLElement} contentElement
     */
    initInlineAdSlot(childVueAppFactory, contentElement) {
      if (!this.isFirst || this.withoutInlineAd) return;

      const target = document.createElement('span');
      target.setAttribute('data-ct-widget', 'inline-ad');
      insertElementBetweenContent(contentElement, target);

      this._childVueAppFactory.createApp({
        target,
        render: () =>
          h(PostInlineAdSlot, {
            props: {
              postSlug: this.slug,
            },
          }),
      });
    },

    /**
     * Starts widgets from template tags
     * @param {import('./useCreateChildVueAppFactory').ChildVueAppFactory} childVueAppFactory
     * @param {HTMLElement} contentEl
     * @param {null|import('~/features/changelly-widget').ChangellyWidgetViewModel} changellyWidgetVM
     * @param {boolean} subscriptionWidgetEnabled
     */
    initTemplateWidgets(childVueAppFactory, contentEl, changellyWidgetVM, subscriptionWidgetEnabled) {
      const hasChangellyWidget =
        changellyWidgetVM !== null && changellyWidgetVM.isAllowed() && changellyWidgetVM.getTargetCoin() !== null;

      let subscriptionWidgetFoundAndEnabled = false;

      for (const target of contentEl.querySelectorAll('template')) {
        const widgetAttr = target.getAttribute('data-ct-widget') || target.getAttribute('data-name');

        switch (widgetAttr) {
          case 'ceros': {
            const src = target.getAttribute('data-ceros-src');
            const aspectRatio = target.getAttribute('data-ceros-aspect-ratio');
            const mobileAspectRatio = target.getAttribute('data-ceros-mobile-aspect-ratio');

            childVueAppFactory.createApp({
              target,
              render: () =>
                h(CerosEmbed, {
                  props: {
                    src,
                    aspectRatio,
                    mobileAspectRatio,
                  },
                }),
            });

            break;
          }

          case 'buzzsprout': {
            const podcastId = target.getAttribute('data-buzzsprout-podcast-id');

            childVueAppFactory.createApp({
              target,
              render: () =>
                h(PodcastPlayer, {
                  props: {
                    podcastId: Number(podcastId),
                    playerType: 'large',
                  },
                }),
            });

            break;
          }

          case 'subscription_form':
          default: {
            subscriptionWidgetFoundAndEnabled = subscriptionWidgetEnabled;

            if (!hasChangellyWidget && subscriptionWidgetEnabled) {
              if (this.marketsTag) {
                childVueAppFactory.createApp({
                  target,
                  render: () => h(MarketsProInlineWidget),
                });
              } else {
                const type = target.getAttribute('data-type');
                childVueAppFactory.createApp({
                  target,
                  render: () =>
                    h(ArticleSubscriptionWidget, {
                      props: {
                        type,
                        postId: this.postId,
                      },
                    }),
                });
              }
            }

            break;
          }

          case 'instagram': {
            const instagramPostId = target.getAttribute('data-instagram-post-id');

            childVueAppFactory.createApp({
              target,
              render: () =>
                h(InstagramEmbed, {
                  props: {
                    postId: instagramPostId,
                  },
                }),
            });

            break;
          }
        }
      }

      if (subscriptionWidgetFoundAndEnabled && hasChangellyWidget) {
        const target = document.createElement('span');
        contentEl.appendChild(target);

        childVueAppFactory.createApp({
          target,
          render: () => {
            const targetCoin = changellyWidgetVM.getTargetCoin();

            if (!targetCoin) return h('span');

            return h(ChangellyWidget, {
              props: {
                targetCoin,
              },
            });
          },
        });
      }
    },

    initTickerLiveData(contentElement) {
      if (this.withoutLiveData) return;

      for (const linkElement of contentElement.querySelectorAll('a')) {
        this.coins?.forEach((coin) => {
          if (
            (!this.isInsideStoryWidget(linkElement) &&
              coin.name === linkElement.innerText &&
              linkElement.href.includes(coin.url)) ||
            (linkElement.classList.contains('live-data') && linkElement.href.includes(coin.url))
          ) {
            if (!linkElement.classList.contains('live-data')) this.removeBracketsAroundLiveData(linkElement);
            this.$emit('needTickersToRender', true);
            this.isLiveDataExist = true;

            this._childVueAppFactory.createApp({
              target: linkElement,
              render: () =>
                h(PostTickersLiveData, {
                  props: {
                    coinName: coin.name,
                  },
                }),
            });
          }
        });
      }
    },
    removeBracketsAroundLiveData(linkElement) {
      linkElement.previousSibling.data = linkElement.previousSibling.data.substring(
        0,
        linkElement.previousSibling.data.length - 1
      );
      linkElement.nextSibling.data = linkElement.nextSibling.data.substring(1);
    },

    isInsideStoryWidget(linkElement) {
      const storyWidgetElement = document.getElementById('story-widget');
      return storyWidgetElement?.contains(linkElement);
    },
    renderMimicBlock() {
      if (this.$props.mimicBlock === 'mimic.block.under.article') return;
      const subscription = this.$el.querySelector('.article-subscription-widget');
      if (subscription) {
        subscription.insertAdjacentHTML('beforebegin', this.$props.mimicBlock);
      } else {
        this.$el.insertAdjacentHTML('beforeend', this.$props.mimicBlock);
      }
    },
    wrapTableOfContentsLinksText(contentElement) {
      if (!this.isDefined) return;
      /**
       * Wrap link text in span to underline only text not all link
       * */
      const toc = contentElement.querySelector('[data-ct-widget="table-of-contents"]');

      for (const linkElement of toc.childNodes) {
        const wrap = document.createElement('span');
        wrap.setAttribute('data-ct-widget', 'table-of-contents-link-text');
        linkElement.insertBefore(wrap, linkElement.firstChild);
        wrap.appendChild(linkElement.childNodes[1]);
      }
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';
@import '~/assets/styles/components/_post-widget--related.scss';
@import '~/assets/styles/components/_defined-post-template.scss';
@import '~/assets/styles/components/_explained-post-template.scss';
@import '~/assets/styles/_mixins.scss';

.post-content > :not(div) {
  color: #000000;
  overflow-wrap: break-word;
  word-break: break-word;
  word-wrap: break-word;
}

.post-content a {
  color: #000;
  text-decoration: none;
  border-bottom: 3px solid #fb0;
  transition: border-bottom-color 0.15s linear;
}

p.post-content__disclaimer {
  color: #a9a9a9;
  font-size: 11px;
}

.post-content h1,
.post-content h2,
.post-content h3,
.post-content h4,
.post-content h5,
.post-content h6 {
  line-height: 1.575;
  color: inherit;
  margin: 16px 0;
}

.post-content h1,
.post-content h2,
.post-content h3 {
  font-weight: 700;
}

.post-content h1 {
  font-size: 1.1875rem;
}

.post-content h2 {
  font-size: 1.125rem;
}

.post-content h3 {
  font-size: 1.0625rem;
}

.post-content h4,
.post-content h5,
.post-content h6 {
  font-weight: 600;
  font-size: 1rem;
}

.post-content h1:first-child,
.post-content h2:first-child,
.post-content h3:first-child,
.post-content h4:first-child,
.post-content h5:first-child,
.post-content h6:first-child {
  margin-top: 0;
  line-height: 1.775;
}

.post-content h1:last-child,
.post-content h2:last-child,
.post-content h3:last-child,
.post-content h4:last-child,
.post-content h5:last-child,
.post-content h6:last-child {
  margin-bottom: 0;
}

.post-content > p {
  line-height: 1.775;
  margin: 0;
}

.post-content > p.post-content__accent {
  background-color: #f0f0f0;
  font-weight: bold;
}

.post-content > p.post-content__accent_small {
  padding: 8px 21px;
  color: #465a65;
}

.post-content > p.post-content__accent_big {
  padding: 21px;
  font-size: 1.25rem;
  color: #253137;
  text-align: center;
  margin: 20px 0 0 0;
  text-transform: uppercase;
}

.post-content ul:not(:first-child),
.post-content ol:not(:first-child),
.post-content p:not(:first-child) {
  margin-top: 16px;
}

.post-content ul:not(:last-child),
.post-content ol:not(:last-child),
.post-content > p:not(:last-child) {
  margin-bottom: 16px;
}

.post-content ul,
.post-content ol {
  padding: 0;
  list-style: none;
}

.post-content ol {
  counter-reset: counter;
}

.post-content li {
  font-size: 1rem;
  line-height: 1.775;
  font-weight: 400;
  color: inherit;
  position: relative;
  padding-left: 32px;
}

.post-content li:not(:first-child) {
  margin-top: 12px;
}

.post-content ul li::before {
  content: '';
  display: block;
  position: absolute;
  width: 6px;
  height: 6px;
  right: calc(100% - 18px);
  top: 13px;
  border-radius: 50%;
  background-color: #000000;
}

.post-content ol li::before {
  counter-increment: counter;
  content: counter(counter) '.';
  position: absolute;
  right: calc(100% - 26px);
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
}

.post-content > :not(div) a {
  @include link-color-accent();
}

.post-content > :not(div) img {
  display: block;
  max-width: 100%;
  height: auto;
  cursor: zoom-in;
}

.post-content > :not(div) a img {
  cursor: pointer;
}

.post-content blockquote {
  position: relative;
  margin: 16px 0;
  padding: 30px 0 15px 24px;
  font-size: 1.05rem;
  font-weight: normal;
  line-height: 1.5;
}

.post-content blockquote::before {
  content: '';
  width: 22px;
  height: 22px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 35'%3E%3Cpath d='M1.152 15.234V0H14.93v12.044c0 6.505-.782 11.247-2.303 14.143-1.975 3.903-5.141 6.84-9.46 8.813L0 29.88c2.632-1.091 4.565-2.77 5.8-4.994 1.233-2.224 1.932-5.414 2.056-9.652zm21.07 0V0H36v12.044c0 6.505-.781 11.247-2.303 14.143-1.974 3.903-5.141 6.84-9.46 8.813l-3.126-5.12c2.632-1.133 4.566-2.77 5.8-4.994 1.233-2.224 1.932-5.414 2.056-9.652z' fill='%23dfe0e1'/%3E%3C/svg%3E%0A");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  position: absolute;
  transform: rotate(180deg);
  left: 0;
  top: 0;
}

.post-content figcaption {
  font-style: italic;
}

.post-content figure {
  margin: 0;
}

.post-content blockquote p {
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
}

.post-content blockquote p:not(:first-child) {
  margin-top: 16px;
}

.post-content .embed-responsive {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 56.25%;
}

.post-content .embed-responsive iframe {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.post-content_rtl {
  direction: rtl;
}

.post-content_rtl li {
  padding-left: 0;
  padding-right: 32px;
}

.post-content_rtl ul li::before {
  left: calc(100% - 18px);
  right: auto;
}

.post-content_rtl ol li::before {
  left: calc(100% - 26px);
  right: auto;
}

.post-content_rtl blockquote {
  padding-left: 0;
  padding-right: 24px;
}

.post-content_rtl blockquote::before {
  left: auto;
  right: 16px;
}

.post-content .post-promo-widget {
  margin: 16px 0;

  a {
    display: block;
    background: url('https://s3.cointelegraph.com/storage/uploads/view/fea9ad6bc27f12af4a1edb7a46145bcd.png') no-repeat;
    background-size: contain;
    background-position: center;
    min-height: 120px;
    text-indent: -5000px;
  }
}

.post-content .post-promo-widget-btse a {
  background-image: url('https://s3.cointelegraph.com/storage/uploads/view/6d8e35946ddea35bf6559848ff0b9cf0.png');
}

@media (min-width: $sm) {
  .post-content h1 {
    font-size: 1.625rem;
  }

  .post-content h2 {
    font-size: 1.5625rem;
  }

  .post-content h3 {
    font-size: 1.5rem;
  }

  .post-content blockquote {
    padding: 30px 60px;
    margin-left: 0;
    margin-right: 0;
    font-weight: 600;
    line-height: 1.775;
  }

  .post-content blockquote::before {
    top: 27px;
    left: 0;
    width: 36px;
    height: 35px;
  }

  .post-content_rtl blockquote::before {
    left: auto;
    right: 0;
  }

  .post-content .post-promo-widget {
    a {
      background-image: url('https://s3.cointelegraph.com/storage/uploads/view/7fdf8d6675ba407ce71c0fcc72736d84.png');
      min-height: 120px;
    }
  }

  .post-content .post-promo-widget-btse a {
    background-image: url('https://s3.cointelegraph.com/storage/uploads/view/20424b2f4d46b9ed222182fec91eabab.png');
    min-height: 120px;
  }
}

@media (min-width: $md) {
  .post-content {
    margin-left: 74px;
  }

  .post-content h2 {
    font-size: 1.625rem;
  }

  .post-content_asia > p,
  .post-content blockquote p {
    font-size: 1.125rem;
  }

  .post-content_rtl {
    margin-left: 0;
    margin-right: 74px;
  }

  .post-content blockquote {
    font-size: 1.125rem;
  }

  .post-content .post-promo-widget {
    a {
      background-image: url('https://s3.cointelegraph.com/storage/uploads/view/c0380c4a3137ea5d7e428acbc8756a1c.png');
      min-height: 100px;
    }
  }

  .post-content .post-promo-widget-btse a {
    background-image: url('https://s3.cointelegraph.com/storage/uploads/view/85f5f277dcdc80f6cbbfb8300f8f335d.png');
    min-height: 100px;
  }
}

@media (min-width: $lg) {
  .post-content_asia > p,
  .post-content blockquote p {
    font-size: 1.25rem;
  }

  .post-content .post-promo-widget {
    a {
      background-image: url('https://s3.cointelegraph.com/storage/uploads/view/741620b0021e30fa0faaae0691086257.png');
      min-height: 120px;
    }
  }

  .post-content .post-promo-widget-btse a {
    background-image: url('https://s3.cointelegraph.com/storage/uploads/view/36eca2b14390001640df64b5976fc6b6.png');
    min-height: 120px;
  }
}

.post-content .table-responsive {
  max-width: 100%;
  overflow-x: auto;
  padding-bottom: 20px;
}

.post-content_rtl {
  [data-ct-widget='explained-block-title'] {
    @media (min-width: $sm) {
      margin-left: 0;
      margin-right: 56px !important;
    }
  }
}
</style>
