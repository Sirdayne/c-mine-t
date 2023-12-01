import { type InjectionKey } from 'vue';
import { injectLocal, provideLocal } from '@vueuse/core';

export interface Injection<T> {
  provide(value: T): void;
  use(): T;
}

/**
 * provide/inject wrapper with injecting in same scope
 * @param key
 */
export const createInjection = /*@__PURE__*/ <T>(key: string): Injection<T> => {
  const injectionKey: InjectionKey<T> = Symbol(key);

  return {
    provide: (value) => provideLocal(injectionKey, value),

    use: () => {
      const value = injectLocal(injectionKey);

      if (typeof value === 'undefined') throw new Error(`"${key}" not provided`);

      return value;
    },
  };
};
