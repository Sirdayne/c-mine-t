import { logLibs } from '~/assets/helpers/log';
import easeInOutQuad from '~/assets/libs/easeInOutQuad';

const DESTINATION = 0;
const DURATION = 300;
const SAFE_FRAME = 20;
const STEP = 16;

export const getScrollTop = () => {
  return (
    window.document.documentElement.scrollTop ||
    window.document.body.parentNode.scrollTop ||
    window.document.body.scrollTop
  );
};
const setScrollTop = (amount) => {
  window.document.documentElement.scrollTop = amount;
  window.document.body.parentNode.scrollTop = amount;
  window.document.body.scrollTop = amount;
};
export const getDocumentHeight = () => {
  return Math.max(
    window.document.body.scrollHeight,
    window.document.body.offsetHeight,
    window.document.documentElement.clientHeight,
    window.document.documentElement.scrollHeight,
    window.document.documentElement.offsetHeight
  );
};

/**
 * scrollTo
 *
 * @param {Object} [options]
 * @param {number|Element} [options.destination=0]
 * @param {number} [options.duration=300]
 * @param {number} [options.safeFrame=20]
 * @param {number} [options.step=20]
 * @param {boolean} [options.cancelIfAlreadyVisible=false]
 *
 * @return {Promise}
 * */
export default (options = {}) => {
  let destination = options.destination;
  let duration = options.duration;
  let safeFrame = options.safeFrame;
  let step = options.step;
  const cancelIfAlreadyVisible = options.cancelIfAlreadyVisible;
  if (destination === undefined) {
    destination = DESTINATION;
  }
  if (duration === undefined || !(duration >= 0)) {
    duration = DURATION;
  }
  if (safeFrame === undefined || !(safeFrame >= 0)) {
    safeFrame = SAFE_FRAME;
  }
  if (step === undefined || !(step > 0)) {
    step = STEP;
  }
  const startScrollTop = getScrollTop();
  const maxScrollTop = getDocumentHeight() - window.innerHeight;
  // exception: `window.document` aka `<html>` is instance of HTMLDocument
  const isDestinationHTML = destination instanceof Element;
  const isDestinationNumber = typeof destination === 'number';
  if (!isDestinationHTML && !isDestinationNumber) {
    logLibs.warn('`destination` is not a number or HTMLElement');
    return Promise.resolve();
  }
  if (isDestinationHTML) {
    const { top, bottom } = destination.getBoundingClientRect();
    if (top > window.innerHeight) {
      destination = bottom + startScrollTop + safeFrame - window.innerHeight;
    } else {
      destination = top + startScrollTop - safeFrame;
    }
  }
  destination = Math.min(maxScrollTop, Math.max(0, destination));
  return new Promise((resolve) => {
    if (duration === 0) {
      setScrollTop(destination - safeFrame);
      resolve();
      return;
    }
    if (cancelIfAlreadyVisible && destination > startScrollTop && destination < startScrollTop + window.innerHeight) {
      resolve();
      return;
    }
    let currentTime = 0;
    let userInteracted = false;
    let lastScrollValue = null;
    const handleUserInteraction = () => {
      window.document.removeEventListener('mousedown', handleUserInteraction);
      window.document.removeEventListener('touchstart', handleUserInteraction);
      window.document.removeEventListener('focus', handleUserInteraction);
      userInteracted = true;
    };
    window.document.addEventListener('mousedown', handleUserInteraction);
    window.document.addEventListener('touchstart', handleUserInteraction);
    window.document.addEventListener('focus', handleUserInteraction);
    const scrollTopChange = destination - startScrollTop;
    const animateScroll = () => {
      if (userInteracted) {
        resolve();
        return;
      }
      currentTime += step;
      const scrollValue = easeInOutQuad(currentTime, startScrollTop, scrollTopChange, duration);
      if (scrollValue === lastScrollValue) {
        window.document.removeEventListener('mousedown', handleUserInteraction);
        window.document.removeEventListener('touchstart', handleUserInteraction);
        window.document.removeEventListener('focus', handleUserInteraction);
        resolve();
        return;
      }
      lastScrollValue = scrollValue;
      setScrollTop(scrollValue);
      if (currentTime < duration) {
        if (typeof window.requestAnimationFrame === 'function') {
          window.requestAnimationFrame(animateScroll);
        } else {
          animateScroll();
        }
      } else {
        window.document.removeEventListener('mousedown', handleUserInteraction);
        window.document.removeEventListener('touchstart', handleUserInteraction);
        window.document.removeEventListener('focus', handleUserInteraction);
        resolve();
      }
    };
    animateScroll();
  });
};
