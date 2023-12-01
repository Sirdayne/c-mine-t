export interface ChangellyCoinMappings {
  // changelly coin => title substrings
  byTitle: Record<string, string[]>;

  // changelly coin => tag slugs
  byTags: Record<string, string[]>;
}
