import { type AdItem } from '../core/AdItem';

export enum AdSlotStatus {
  LOADED = 'loaded',
  PENDING = 'pending',
  FAILED = 'failed',
}

export enum AdSlotFailureReason {
  ADBLOCKED = 'adblocked', // adblock prevented
  NO_CONTENT = 'empty', // empty ad slot
  UNKNOWN = 'unknown', // any unknown reason
}

export interface AdSlotPendingState {
  status: AdSlotStatus.PENDING;
  adItem: null;
  reason: null;
}

export interface AdSlotFailedState {
  status: AdSlotStatus.FAILED;
  adItem: null;
  reason: AdSlotFailureReason;
}

export interface AdSlotLoadedState {
  status: AdSlotStatus.LOADED;
  adItem: AdItem;
  reason: null;
}

export type AdSlotState = AdSlotPendingState | AdSlotFailedState | AdSlotLoadedState;

export const createPendingState = (): AdSlotPendingState => ({
  status: AdSlotStatus.PENDING,
  adItem: null,
  reason: null,
});

export const createFailedState = (reason: AdSlotFailureReason): AdSlotFailedState => ({
  status: AdSlotStatus.FAILED,
  adItem: null,
  reason,
});

export const createLoadedState = (adItem: AdItem): AdSlotLoadedState => ({
  status: AdSlotStatus.LOADED,
  adItem,
  reason: null,
});
