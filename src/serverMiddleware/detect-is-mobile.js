import isMobile from '../assets/libs/isMobile';

// special case of UC Browser
const UC_BROWSER_HEADER_KEY = 'x-ucbrowser-ua';

export default function userAgentMidleware(req, res, next) {
  let userAgent;
  const { headers } = req;
  userAgent = headers['user-agent'] || '';

  if (headers[UC_BROWSER_HEADER_KEY]) userAgent = headers[UC_BROWSER_HEADER_KEY];

  req.isMobile = isMobile(userAgent);
  next();
}
