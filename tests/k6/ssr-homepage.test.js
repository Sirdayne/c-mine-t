/**
 * Test SSR timings
 */

/* eslint-disable import/extensions,import/no-unresolved */

import { check, sleep, group } from 'k6';
import http from 'k6/http';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { tagWithCurrentStageProfile } from 'https://jslib.k6.io/k6-utils/1.3.0/index.js';

// 30 min = 38k requests; 1 min = 1.25k

// /**
//  * @param {number} usersPerHour How much users visits site hourly
//  * @returns K6 stage
//  */
// function stageFromGoogleAnalyticsHourlyUsers(usersPerHour) {
//   return { duration: '1m', target: usersPerHour / 60 };
// }

function getHomepage() {
  return http.get('https://cointelegraph.com');
}

export const options = {
  batchPerHost: 1,
  throw: true,
  noConnectionReuse: true,
  noVUConnectionReuse: true,
  // discardResponseBodies: true,
  thresholds: {
    // http_req_duration: ['avg<=1000']
  },
  stages: [{ duration: '1m', target: 1000 }],
};

export function setup() {
  // await bundle require
  getHomepage();
  sleep(5);
}

export default function () {
  tagWithCurrentStageProfile();

  group('front page', () => {
    const response = getHomepage();

    check(response, { 'status equals 200': (r) => r.status === 200 });

    sleep(2);
  });
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: ' ', enableColors: false }),
    './tests/k6/reports/ssr-homepage.html': htmlReport(data),
  };
}
