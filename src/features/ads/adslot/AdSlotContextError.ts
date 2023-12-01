export enum AdSlotContextErrorReason {
  /**
   * No context provided for custom rendering component
   */
  NO_CONTEXT_PROVIDED = 'no ad slot context provided',

  /**
   * When custom rendering component received props for another view
   */
  VIEW_MISMATCH = 'view mismatch',

  /**
   * No custom rendering item provided
   */
  NO_CUSTOM_RENDERING_ITEM = 'no custom rendering item',
}

export class AdSlotContextError extends Error {
  constructor(public readonly reason: AdSlotContextErrorReason) {
    super();
    this.name = 'AdSlotContextError';
  }
}
