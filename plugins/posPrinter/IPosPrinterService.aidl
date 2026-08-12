/**
 * Vendor interface for the Q2/Q21 built-in thermal printer.
 *
 * DO NOT REORDER OR EDIT THE METHODS. AIDL assigns each method a transaction
 * ID from its declaration order, so this file must match the service's own
 * interface byte for byte — a reordered copy compiles fine and then silently
 * invokes the wrong method at runtime.
 *
 * Source: IposPrinterTestDemo (Jicai Q2 SDK), AIDL Version 1.0.0.
 */
package com.iposprinter.iposprinterservice;

import com.iposprinter.iposprinterservice.IPosPrinterCallback;
import android.graphics.Bitmap;

interface IPosPrinterService {
    /**
     * 0:PRINTER_NORMAL, 1:PRINTER_PAPERLESS, 2:PRINTER_THP_HIGH_TEMPERATURE,
     * 3:PRINTER_MOTOR_HIGH_TEMPERATURE, 4:PRINTER_IS_BUSY, 5:PRINTE_ERROR_UNKNOWN
     */
    int getPrinterStatus();

    void printerInit(in IPosPrinterCallback callback);

    void setPrinterPrintDepth(int depth, in IPosPrinterCallback callback);

    void setPrinterPrintFontType(String typeface, in IPosPrinterCallback callback);

    void setPrinterPrintFontSize(int fontsize, in IPosPrinterCallback callback);

    void setPrinterPrintAlignment(int alignment, in IPosPrinterCallback callback);

    void printerFeedLines(int lines, in IPosPrinterCallback callback);

    void printBlankLines(int lines, int height, in IPosPrinterCallback callback);

    void printText(String text, in IPosPrinterCallback callback);

    void printSpecifiedTypeText(String text, String typeface, int fontsize, in IPosPrinterCallback callback);

    void PrintSpecFormatText(String text, String typeface, int fontsize, int alignment, IPosPrinterCallback callback);

    void printColumnsText(in String[] colsTextArr, in int[] colsWidthArr, in int[] colsAlign, int isContinuousPrint, in IPosPrinterCallback callback);

    void printBitmap(int alignment, int bitmapSize, in Bitmap mBitmap, in IPosPrinterCallback callback);

    void printBarCode(String data, int symbology, int height, int width, int textposition, in IPosPrinterCallback callback);

    void printQRCode(String data, int modulesize, int mErrorCorrectionLevel, in IPosPrinterCallback callback);

    /** Raw dot/bitmap data. For ESC/POS command streams use sendUserCMDData. */
    void printRawData(in byte[] rawPrintData, in IPosPrinterCallback callback);

    /** Print using ESC/POS commands. */
    void sendUserCMDData(in byte[] data, in IPosPrinterCallback callback);

    /**
     * Commits the queued content. Nothing physically prints until this runs —
     * every method above only buffers. `feedlines` is in pixel rows.
     */
    void printerPerformPrint(int feedlines, in IPosPrinterCallback callback);
}
