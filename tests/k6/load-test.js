import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

export const requests = new Counter('http_reqs');

export const options = {
  discardResponseBodies: true,
  insecureSkipTLSVerify: true,
  stages: [
    // warm caches
    { target: 1, duration: '5s' },
    { target: 20, duration: '1m' },
    { target: 100, duration: '1m' },
    { target: 0, duration: '1m' },
  ],
  thresholds: {
    http_reqs: ['count < 500'],
  },
};

export default function () {
  const res = http.get('http://localhost:3000', {
    headers: {
      host: 'cointelegraph.com',
      accept: 'text/html',
      'user-agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'accept-enconding': 'gzip, deflate, br',
    },
    tags: {
      name: 'site en prod main page',
    },
  });

  sleep(1);

  const checkRes = check(res, {
    'status is 200': (r) => r.status === 200,
    // 'response body': (r) => r.body.indexOf('Feel free to browse') !== -1,
  });
}
