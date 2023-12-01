export const footerSubscriptionFormEvents = (isMobile = true) => {
  const event = 'form';
  return {
    send: {
      event,
      eventCategory: event,
      eventAction: isMobile ? 'mobile subscribe-footer' : 'subscribe-footer',
      eventLabel: 'send',
    },
  };
};

export const sidebarSubscriptionFormEvents = (eventLabel = 'daily') => {
  const event = 'form';
  return {
    send: {
      event,
      eventCategory: event,
      eventAction: 'subscribe-digest',
      eventLabel,
    },
  };
};

export const subscriptionsFormEvents = (eventLabel = '') => {
  const event = 'Subscription';
  return {
    send: {
      event,
      eventCategory: event,
      eventAction: 'Send',
      eventLabel,
    },
  };
};

export const subscriptionsBannersEvents = (eventLabel = '{{ placement }}') => {
  const event = 'Subscription';
  return {
    impression: {
      event,
      eventCategory: event,
      eventAction: 'Impression',
      eventLabel,
    },
    click: {
      event,
      eventCategory: event,
      eventAction: 'Click',
      eventLabel,
    },
  };
};

export const postBlockShowEvents = (event = 'Blockshow') => {
  return {
    impression: {
      event,
      eventCategory: event,
      eventAction: 'Banner',
      eventLabel: 'Impression',
    },
  };
};

export const virtualPageviewEvents = ({
  event = 'VirtualPageview',
  url = '',
  title = '',
  category = '',
  tags = [],
} = {}) => {
  return {
    pageview: {
      event,
      virtualPageURL: url,
      virtualPageTitle: title,
      categorynews: category,
      tags,
    },
  };
};

export const userEvents = (userId = undefined) => {
  return {
    transitions: { userId },
  };
};

export const stickyAdsEvents = (event = 'EventLabel') => ({
  hide: {
    event,
    eventCategory: event,
    eventAction: 'Widget',
    eventLabel: 'Hide',
  },
  impression: {
    event,
    eventCategory: event,
    eventAction: 'Widget',
    eventLabel: 'Impression',
  },
});

export const mainPageLinksEvent = (eventText) => {
  pushDataLayerEvent({
    type: 'click',
    dataLayerEventData: {
      click: {
        event: 'linkClick',
        eventCategory: 'Click',
        eventAction: 'Click',
        from: eventText,
      },
    },
  });
};

export const pushDataLayerEvent = ({ type = '', dataLayerEventData = {} } = {}) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('pushDataLayerEvent:', type, dataLayerEventData);
  }
  if (
    !type ||
    typeof window.dataLayer !== 'object' ||
    typeof window.dataLayer.push !== 'function' ||
    !Object.keys(dataLayerEventData).includes(type)
  ) {
    return;
  }
  window.dataLayer.push(dataLayerEventData[type]);
};

export const pushVirtualPageView = ({ url = '', title = '', category = '', tags = [] } = {}) => {
  const mapTags = (tag) => tag.title;
  return pushDataLayerEvent({
    type: 'pageview',
    dataLayerEventData: virtualPageviewEvents({
      event: 'VirtualPageview',
      url,
      title,
      category,
      tags: Array.isArray(tags) ? tags.map(mapTags) : [],
    }),
  });
};
