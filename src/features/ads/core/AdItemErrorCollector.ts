export const enum AdItemErrors {
  UNKNOWN_CUSTOM_RENDERING_VIEW = 'unknown custom rendering view',
  UNKNOWN_WIDGET_TYPE = 'unknown widget type',
  UNKNOWN_STRETCH_TYPE = 'unknown stretch type',
  INVALID_CUSTOM_RENDERING_PROPS = 'invalid props',
  FAILED_TO_PARSE_OPTIONS = 'failed to parse options',
  FAILED_TO_PARSE_HTML_JSON = 'failed to parse html json',
}

export class AdItemErrorCollector {
  private readonly _errors: Set<AdItemErrors> = new Set();

  add(error: AdItemErrors): void {
    this._errors.add(error);
  }

  collect(): AdItemErrors[] {
    return [...this._errors];
  }
}
