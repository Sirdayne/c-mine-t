import { logLibs } from '~/assets/helpers/log';

export default (element) => {
  if (!element) {
    logLibs.warn('`element` is undefined');
  }
  const boundingRect = element.getBoundingClientRect();
  const { top, left } = boundingRect;
  const scrollLeft = window.pageXOffset || window.document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || window.document.documentElement.scrollTop;
  return {
    top: top + scrollTop,
    left: left + scrollLeft,
    boundingRect,
  };
};
