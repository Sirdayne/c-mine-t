<template>
  <div
    class="subscriptions"
    @click.passive="overlayClickHandler"
  >
    <div class="subscriptions__modal-wrp">
      <SubscriptionsModal
        v-if="!isSubscribed"
        :local-i18n="localI18n"
        :subscriptions-list="subscriptionsList"
        :is-all-subscriptions-selected="isAllSubscriptionsSelected"
        class="subscriptions__modal subscriptions__modal_subscriptions"
        @select-all.passive="selectAllClickHandler"
        @turn-off-all.passive="turnOffAllClickHandler"
        @select.passive="onItemSelectHandler"
        @subscribed.passive="subscribedHandler"
        @close.passive="handleClose"
      />
      <SubscriptionsSuccessModal
        v-else
        :local-i18n="localI18n"
        :selected-items="selectedItems"
        class="subscriptions__modal subscriptions__modal_success"
        @close.passive="handleClose"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { MENU, SUBSCRIPTIONS_MODAL, VIEWPORT } from '~/store/types';
import { pushDataLayerEvent, subscriptionsFormEvents } from '~/assets/helpers/dataLayerEvents';
import scrollTo from '~/assets/libs/scrollTo';

export default {
  name: 'Subscriptions',
  components: {
    SubscriptionsModal: () => import('./SubscriptionsModal'),
    SubscriptionsSuccessModal: () => import('./SubscriptionsSuccessModal'),
  },
  data() {
    return {
      isSubscribed: false,
      selectedItemsIds: [],
    };
  },
  computed: {
    ...mapState({
      languageShort: ({ currentLanguage: { short } }) => short,
    }),
    ...mapState('subscriptionsModal', {
      listItems: ({ listItems }) => listItems,
      localI18n: ({ i18n }) => i18n,
    }),
    ...mapState('menu', {
      scrollBeforeOpened: ({ scrollBeforeOpened }) => scrollBeforeOpened,
    }),
    ...mapState('viewport', {
      scrollTop: ({ scrollTop }) => scrollTop,
    }),
    ...mapGetters('viewport', {
      isDesktop: VIEWPORT.IS_LARGE_WIDTH,
    }),
    subscriptionsList() {
      const { selectedItemsIds } = this;
      return this.listItems.map((item) => ({
        ...item,
        isSelected: selectedItemsIds.includes(item.id),
      }));
    },
    isAllSubscriptionsSelected() {
      const { subscriptionsList, selectedItemsIds } = this;
      return subscriptionsList.length === selectedItemsIds.length;
    },
    selectedItems() {
      const { subscriptionsList, selectedItemsIds } = this;
      return subscriptionsList.filter(({ id }) => selectedItemsIds.includes(id));
    },
  },
  watch: {
    isDesktop(newValue, prevValue) {
      return typeof prevValue === 'boolean' && prevValue === newValue ? undefined : this.toggleScrollLock(newValue);
    },
  },
  mounted() {
    if (!this.isDesktop) {
      this.setScrollBeforeOpened(this.scrollTop);
      this.lockScroll(true);
      this.setOverlayVisibility(true);
      scrollTo({
        destination: 0,
        duration: 0,
      });
    }
  },
  methods: {
    ...mapActions('subscriptionsModal', {
      setIsShown: SUBSCRIPTIONS_MODAL.SET_IS_SHOWN,
    }),
    ...mapActions('menu', {
      setScrollBeforeOpened: MENU.SET_SCROLL_BEFORE_OPENED,
    }),
    ...mapActions('viewport', {
      lockScroll: VIEWPORT.SET_LOCK_SCROLL,
      setOverlayVisibility: VIEWPORT.SET_OVERLAY_VISIBILITY,
    }),
    onItemSelectHandler({ id }) {
      const { selectedItemsIds } = this;
      if (selectedItemsIds.includes(id)) {
        this.selectedItemsIds = selectedItemsIds.filter((itemId) => itemId !== id);
        return;
      }
      this.selectedItemsIds = [...selectedItemsIds, id];
    },
    selectAllClickHandler() {
      this.selectedItemsIds = this.subscriptionsList.map((_, i) => i);
    },
    turnOffAllClickHandler() {
      this.selectedItemsIds = [];
    },
    handleClose() {
      this.lockScroll(false);
      this.$nextTick(() => {
        if (!this.isDesktop) {
          this.restoreScroll();
        }
        this.setIsShown(false);
        this.$emit('close');
      });
    },
    subscribedHandler() {
      this.isSubscribed = true;
      const dataLayerEventData = this.getDataLayerEventData();
      pushDataLayerEvent({
        type: 'send',
        dataLayerEventData,
      });
    },
    restoreScroll() {
      scrollTo({
        destination: this.scrollBeforeOpened,
        duration: 0,
      });
    },
    overlayClickHandler(e) {
      return !e.target.closest('.subscriptions__modal') && this.handleClose();
    },
    toggleScrollLock(isDesktop = false) {
      if (!isDesktop) {
        this.setScrollBeforeOpened(this.scrollTop);
        this.lockScroll(true);
        this.setOverlayVisibility(true);
      } else {
        this.lockScroll(false);
        this.$nextTick(this.restoreScroll);
      }
    },
    getDataLayerEventData() {
      const { selectedItems, isAllSubscriptionsSelected } = this;
      const eventLabels = !isAllSubscriptionsSelected
        ? selectedItems.map(({ modalListItemName }) => modalListItemName)
        : ['All'];
      return subscriptionsFormEvents(eventLabels.join(','));
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_vars.scss';

.subscriptions {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: table;
  height: 100vh;
}
.subscriptions__modal-wrp {
  display: table-cell;
  vertical-align: middle;
}
.subscriptions__modal {
  margin: auto;
}
.subscriptions__modal_subscriptions {
  max-width: 790px;
}
.subscriptions__modal_success {
  max-width: 400px;
}

.subscriptions_with-inner-scroll {
  display: block;
  bottom: 0;
  overflow-y: scroll;
}
.subscriptions_with-inner-scroll .subscriptions__modal-wrp {
  display: block;
}

@media (min-width: $md) {
  .subscriptions {
    position: fixed;
    bottom: 0;
    z-index: 3;
    display: flex;
    min-height: 100vh;
    overflow-y: scroll;
    background-color: rgba(0, 0, 0, 0.45);
  }
  .subscriptions__modal-wrp {
    margin: auto;
    width: 100%;
    display: block;
  }
}
</style>
