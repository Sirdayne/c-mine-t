export class StoryWidgetSameSlugError extends Error {
  constructor(public readonly storySlug: string, public readonly postSlug: string) {
    super('story widget adbutler returned the same key as for the containing article');

    this.name = 'StoryWidgetSameSlugError';
  }
}
