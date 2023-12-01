export class StoryWidgetMissingPostError extends Error {
  constructor(public readonly postSlug: string) {
    super('missing post for story widget');

    this.name = 'StoryWidgetMissingPostError';
  }
}
