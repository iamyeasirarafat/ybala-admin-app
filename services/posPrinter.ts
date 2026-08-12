import { NativeModules, Platform } from 'react-native';
import { setPrinterTransport } from './printer';

interface PosPrinterNativeModule {
  isConnected(): Promise<boolean>;
  getStatus(): Promise<number>;
  printBase64(base64: string): Promise<boolean>;
}

const native: PosPrinterNativeModule | undefined =
  NativeModules.PosPrinter as PosPrinterNativeModule | undefined;

/** Vendor status codes from IPosPrinterService.getPrinterStatus(). */
export const PRINTER_STATUS = {
  NORMAL: 0,
  PAPERLESS: 1,
  THP_HIGH_TEMPERATURE: 2,
  MOTOR_HIGH_TEMPERATURE: 3,
  BUSY: 4,
  ERROR_UNKNOWN: 5,
  /** Not a vendor code: the service is not bound. */
  NOT_BOUND: -1,
} as const;

export const describePrinterStatus = (status: number): string => {
  switch (status) {
    case PRINTER_STATUS.NORMAL:
      return 'Ready';
    case PRINTER_STATUS.PAPERLESS:
      return 'Out of paper';
    case PRINTER_STATUS.THP_HIGH_TEMPERATURE:
      return 'Print head too hot';
    case PRINTER_STATUS.MOTOR_HIGH_TEMPERATURE:
      return 'Motor too hot';
    case PRINTER_STATUS.BUSY:
      return 'Busy';
    case PRINTER_STATUS.ERROR_UNKNOWN:
      return 'Printer error';
    case PRINTER_STATUS.NOT_BOUND:
      return 'Printer service unavailable';
    default:
      return `Unknown status ${status}`;
  }
};

export const getPrinterStatus = (): Promise<number> =>
  native ? native.getStatus() : Promise.resolve(PRINTER_STATUS.NOT_BOUND);

/**
 * Base64 without Buffer (not available in React Native) and without a
 * `String.fromCharCode(...bytes)` spread, which blows the call-stack limit on
 * a receipt-sized array.
 */
const toBase64 = (bytes: Uint8Array): string => {
  const CHARS =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let out = '';

  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = bytes[i + 1];
    const b2 = bytes[i + 2];

    out += CHARS[b0 >> 2];
    out += CHARS[((b0 & 0x03) << 4) | ((b1 ?? 0) >> 4)];
    out += b1 === undefined ? '=' : CHARS[((b1 & 0x0f) << 2) | ((b2 ?? 0) >> 6)];
    out += b2 === undefined ? '=' : CHARS[b2 & 0x3f];
  }

  return out;
};

/**
 * Registers the built-in printer as the receipt transport.
 *
 * Safe to call unconditionally: on a device without the vendor service (or on
 * iOS), the native module is absent and no transport is registered, which
 * leaves printReceipt logging its preview instead of failing.
 */
export const initPosPrinter = (): void => {
  if (Platform.OS !== 'android' || !native) {
    console.log('PosPrinter: native module unavailable; receipts will log only');
    return;
  }

  setPrinterTransport(async (bytes) => {
    await native.printBase64(toBase64(bytes));
  });
};
