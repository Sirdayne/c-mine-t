const EMPTY_ID = 1;
const MAX_ID = 32767;

/**
 * Generates unique ID for each AdSlot state
 *
 * Need to re-init (VDOM, DOM and lifecycle) for custom rendering components
 * when they changed
 *
 * WARNING: instance should be unique per AdSlot component
 */
export class AdItemKeyGenerator {
  private readonly _cache = new WeakMap<object, number>();
  private _lastId = EMPTY_ID;

  private _nextId(): number {
    const lastId = this._lastId;
    const nextId = lastId === MAX_ID ? 0 : lastId + 1;

    return (this._lastId = nextId);
  }

  private _reset(): number {
    return (this._lastId = EMPTY_ID);
  }

  for(adItem: object): number {
    let id = this._cache.get(adItem);

    if (typeof id === 'undefined') {
      id = this._nextId();
      this._cache.set(adItem, id);
    }

    return id;
  }
}
