import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { copyToClipboard } from '~/lib/clipboard/copyToClipboard';

describe('copyToClipboard', () => {
  beforeEach(() => {
    let clipboardContents = '';

    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn((text: string) => {
          clipboardContents = text;
        }),
        readText: jest.fn(() => clipboardContents),
      },
    });
  });
  it('copied text to clipboard', async () => {
    copyToClipboard('test message');

    const message = await navigator.clipboard.readText();
    expect(message).toBe('test message');
  });
});
