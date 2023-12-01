import { BREAKPOINTS } from '~/app.config';

export const getBreakpointName = (width = 0) => {
  let breakpointName;
  switch (true) {
    case width <= 479:
      breakpointName = BREAKPOINTS.XXS;
      break;
    case width >= 480 && width <= 767:
      breakpointName = BREAKPOINTS.XS;
      break;
    case width >= 768 && width <= 991:
      breakpointName = BREAKPOINTS.SM;
      break;
    case width >= 992 && width <= 1199:
      breakpointName = BREAKPOINTS.MD;
      break;
    case width >= 1200:
      breakpointName = BREAKPOINTS.LG;
      break;
    default:
      breakpointName = BREAKPOINTS.XS;
  }
  return breakpointName;
};
