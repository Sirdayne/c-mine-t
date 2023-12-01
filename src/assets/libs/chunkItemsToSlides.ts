export type Chunk<T> = { index: number; item: T }[];

export const iterateChunks = function* <T>(items: T[], chunkSize: number): Iterable<Chunk<T>> {
  let chunk: Chunk<T> = [];

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];

    chunk.push({ index, item });

    if (chunk.length === chunkSize) {
      yield chunk;
      chunk = [];
    }
  }

  if (chunk.length > 0) yield chunk;
};

export const chunkItemsToSlides = <T>(items: T[], chunkSize: number): Chunk<T>[] => [
  ...iterateChunks(items, chunkSize),
];
