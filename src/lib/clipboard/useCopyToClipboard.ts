import { copyToClipboard } from '~/lib/clipboard/copyToClipboard';

export function useCopyToClipboard(): (text: string) => Promise<void> {
  return (text: string) => copyToClipboard(text);
}
