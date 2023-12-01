import { type Banner as GraphQLBanner } from '~/graphql';

export const FAKE_GRAPHQL_BANNER_WITH_EDITORS_CHOICE_WIDGET: GraphQLBanner = {
  cacheKey: 'en.BannerType.469',
  id: '469',
  bannerType: 'widget',
  bannerPlace: 'side',
  bannerUrl: 'editors-choice-widget',
  bannerImage: null,
  bannerTitle: "Editor's choice sidebar widget",
  bannerWeight: 1,
  bannerComment: "Editor's choice sidebar widget",
  bannerPriority: 0,
  bannerCode: '',
  bannerOptions: '{}',
  post: null,
  __typename: 'Banner',
};

export const FAKE_GRAPHQL_BANNER_WITH_ADBUTLER_SNIPPET: GraphQLBanner = {
  cacheKey: 'en.BannerType.227',
  id: '227',
  bannerType: 'adbutler',
  bannerPlace: 'leaderboard',
  bannerUrl: '',
  bannerImage: null,
  bannerTitle: 'leaderboard',
  bannerWeight: 1,
  bannerComment: 'leaderboard',
  bannerPriority: 12,
  bannerCode:
    "<!-- Leaderboard [async] -->\r\n<script type=\"text/javascript\">if (!window.AdButler){(function(){var s = document.createElement(\"script\"); s.async = true; s.type = \"text/javascript\";s.src = 'https://servedbyadbutler.com/app.js';var n = document.getElementsByTagName(\"script\")[0]; n.parentNode.insertBefore(s, n);}());}</script>\r\n<script type=\"text/javascript\">\r\nvar AdButler = AdButler || {}; AdButler.ads = AdButler.ads || [];\r\nvar abkw = window.abkw || '';\r\nvar plc351403 = window.plc351403 || 0;\r\ndocument.write('<'+'div id=\"placement_351403_'+plc351403+'\"></'+'div>');\r\nAdButler.ads.push({handler: function(opt){ AdButler.register(169476, 351403, [1160,65], 'placement_351403_'+opt.place, opt); }, opt: { place: plc351403++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});\r\n</script>",
  bannerOptions: '{}',
  post: null,
  __typename: 'Banner',
};

export const FAKE_GRAPHQL_BANNER_WITH_ADBUTLER_URL: GraphQLBanner = {
  cacheKey: 'en.BannerType.1393',
  id: '1393',
  bannerType: 'stretch',
  bannerPlace: 'index_mobile_new',
  bannerUrl: 'adbutler://588843',
  bannerImage: '',
  bannerTitle: '',
  bannerWeight: 1,
  bannerComment: 'promo',
  bannerPriority: 0,
  bannerCode: '',
  bannerOptions: '{}',
  post: null,
  __typename: 'Banner',
};

export const FAKE_GRAPHQL_BANNER_WITH_STRETCH_YOUTUBE: GraphQLBanner = {
  cacheKey: 'it.BannerType.558',
  id: '558',
  bannerType: 'stretch',
  bannerPlace: 'index',
  bannerUrl: 'https://youtu.be/t5V05fetKvM',
  bannerImage: 'https://www.youtube.com/user/cointelegraph',
  bannerTitle: 'Bitcoin, crypto...Will you be my Valentine?',
  bannerWeight: 1,
  bannerComment: 'youtube',
  bannerPriority: 0,
  bannerCode: 'A love letter from Cointelegraph. ',
  bannerOptions: '[]',
  post: null,
  __typename: 'Banner',
};

export const FAKE_GRAPHQL_BANNER_WITH_YOUTUBE: GraphQLBanner = {
  cacheKey: 'it.BannerType.334',
  id: '334',
  bannerType: 'html5',
  bannerPlace: 'side',
  bannerUrl: 'https://youtu.be/t5V05fetKvM',
  bannerImage: null,
  bannerTitle: 'youtube',
  bannerWeight: 1,
  bannerComment: 'youtube',
  bannerPriority: 1,
  bannerCode:
    '<iframe width="320" height="215" src="https://youtu.be/t5V05fetKvM?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>',
  bannerOptions: '[]',
  post: null,
  __typename: 'Banner',
};

export const FAKE_GRAPHQL_BANNER_WITH_STATIC_PROMO_BUTTON_AS_WIDGET: GraphQLBanner = {
  cacheKey: 'it.BannerType.1376',
  id: '1376',
  bannerType: 'widget',
  bannerPlace: 'side',
  bannerUrl: 'xgo-button',
  bannerImage: '',
  bannerTitle: 'xgo (dashboard)',
  bannerWeight: 1,
  bannerComment: 'xgo (dashboard)',
  bannerPriority: 7,
  bannerCode: 'https://xgo.com/referral/606e7672c980d972',
  bannerOptions: '{}',
  post: null,
  __typename: 'Banner',
};

export const FAKE_GRAPHQL_BANNER_WITH_PROMO_BUTTON_STACK: GraphQLBanner = {
  cacheKey: 'it.BannerType.1123',
  id: '1123',
  bannerType: 'promo_button_stack',
  bannerPlace: 'promo_button_stack_index_mobile',
  bannerUrl: '',
  bannerImage: '',
  bannerTitle: 'Stack Main',
  bannerWeight: 1,
  bannerComment: 'Stack Main',
  bannerPriority: 1,
  bannerCode: '',
  bannerOptions: '{}',
  post: null,
  __typename: 'Banner',
};
