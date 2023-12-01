import { getCurrentInstance } from 'vue';

export interface CookieOptions {
  maxAge: number;
  httpOnly: boolean;
  secure: boolean;
}

export interface Cookies {
  get(name: string): string;
  set(name: string, value: string | number, options: CookieOptions): void;
}

export const useCookies = (): Cookies => {
  const inst = getCurrentInstance();

  // TODO: ge rid of "cookie-universal-nuxt"
  // @ts-expect-error unsafe access to "cookie-universal-nuxt"
  const adapter = inst?.proxy.$cookies;

  return adapter as Cookies;
};
