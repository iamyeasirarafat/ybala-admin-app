import { renderEscPos, renderPreview } from '@/utils/receipt/render';
import { ReceiptElement } from '@/utils/receipt/orderReceipt';

/**
 * Sends a raw ESC/POS byte stream to the printer.
 *
 * This is the one hardware-specific seam in the receipt pipeline: everything
 * upstream (layout, totals, byte encoding) is device-independent and testable,
 * so swapping transports means replacing only this function.
 *
 * Wiring depends on how the POS exposes its built-in printer:
 *   - Bluetooth SPP  -> write the bytes to the paired serial socket
 *   - USB / serial   -> write to the vendor's device node
 *   - Vendor SDK     -> hand the bytes to its "raw command" entry point
 *     (Sunmi: `sendRAWData`, iMin: `sendRAWData`, Epson: `addCommand`)
 */
export type PrinterTransport = (bytes: Uint8Array) => Promise<void>;

let transport: PrinterTransport | null = null;

export const setPrinterTransport = (next: PrinterTransport | null) => {
  transport = next;
};

export const hasPrinterTransport = (): boolean => transport !== null;

/**
 * Prints a receipt document, or logs the rendered layout when no transport is
 * registered.
 *
 * Never throws: a failed print must not roll back an order status change that
 * already succeeded on the server. Callers get a boolean so they can surface
 * a "reprint" affordance instead.
 */
export const printReceipt = async (
  elements: ReceiptElement[],
): Promise<boolean> => {
  if (!transport) {
    // Until the device transport is wired, this is the only way to see what
    // would have been printed — the preview is the exact 32-column layout.
    console.log(
      `Printer: no transport registered; receipt preview follows\n${renderPreview(elements)}`,
    );
    return false;
  }

  try {
    await transport(renderEscPos(elements));
    return true;
  } catch (error) {
    console.error('Printer: failed to print receipt', error);
    return false;
  }
};
