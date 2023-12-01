import { describe, expect, it } from '@jest/globals';
import { buildOptimizedImageUrl } from './buildOptimizedImageUrl';

const EXAMPLE_IMAGE_URL = 'https://s3.cointelegraph.com/storage/uploads/view/b047f51d2b432d557098db927fc5dc48.png';

describe('buildOptimizedImage', () => {
  // broken by migration to legacy resize
  it.skip('returns URL for optimized version of image', () => {
    const optimizedImageUrl = buildOptimizedImageUrl({
      src: EXAMPLE_IMAGE_URL,
      width: 300,
      height: 400,
    });

    // contains cloudflare resizer path
    expect(optimizedImageUrl).toContain('/cdn-cgi/image/');

    // format detection option should be enabled
    expect(optimizedImageUrl).toContain('format=auto');

    // fallback to original image when something went wrong
    expect(optimizedImageUrl).toContain('onerror=redirect');

    // original image URL included
    expect(optimizedImageUrl).toContain(EXAMPLE_IMAGE_URL);

    // given size should be passed too
    expect(optimizedImageUrl).toContain('width=300');
    expect(optimizedImageUrl).toContain('height=400');
  });
});
