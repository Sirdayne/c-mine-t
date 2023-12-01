<template>
  <Story title="AdSlotView">
    <Variant title="Image + link">
      <AdSlotView
        :config="{
          aspectRatio: 130 / 2320,
        }"
        :state="leaderboardAdSlotState"
        place="fake-ad-slot"
      />
    </Variant>

    <Variant title="Raw HTML">
      <AdSlotView
        :state="rawBodyAdSlotState"
        place="fake-raw-html"
      />
    </Variant>

    <Variant title="Stretch promo">
      <AdSlotView
        :state="stretchPromoAdSlotState"
        place="fake-stretch"
      />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { AdItemBuilder } from './core/AdItemBuilder';
import { createLoadedState } from './adslot/AdSlotState';
import { CustomRenderingViews } from './core/CustomRenderingViews';
import AdSlotView from './AdSlotView.vue';

const leaderboardAdSlotState = createLoadedState(
  new AdItemBuilder().setRedirectUrl('https://example.com').setImageUrl('https://via.placeholder.com/2320x130').build()
);

const rawBodyAdSlotState = createLoadedState(new AdItemBuilder().setBody(`<h1>Example html banner</h1>`).build());

const stretchPromoAdSlotState = createLoadedState(
  new AdItemBuilder()
    .setRedirectUrl('https://example.com')
    .setImageUrl('https://s3.cointelegraph.com/storage/uploads/view/d5360890c4c6d2032d87476054755794.jpg')
    .appendCustomRenderingItem({
      view: CustomRenderingViews.STRETCH_PROMO,
      props: {
        title: 'Title',
        description: '<em>description</em>',
      },
    })
    .build()
);
</script>

<docs lang="md">
# AdSlotView story

AdSlotView is renderer for AdItems

It handles basic ads like clickable image (image+link) or raw HTML insertion

Also it renders custom rendering

In client code you should use "AdSlot.vue" facade,
that handles consuming banners from different sources
</docs>
