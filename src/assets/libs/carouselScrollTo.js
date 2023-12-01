import { getNormalizedScrollLeft, setNormalizedScrollLeft } from 'normalize-scroll-left';
import easeInOutQuad from './easeInOutQuad';

const carouselScrollTo = (element, to, duration, direction = 'ltr') => {
  const start = getNormalizedScrollLeft(element, direction);
  const change = to - start;
  const increment = 20;
  let currentTime = 0;
  const animateScroll = () => {
    currentTime += increment;
    const scrollLeftValue = easeInOutQuad(currentTime, start, change, duration);
    setNormalizedScrollLeft(element, scrollLeftValue, direction);
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    } else {
      setNormalizedScrollLeft(element, to, direction);
    }
  };
  animateScroll();
};

export default carouselScrollTo;
