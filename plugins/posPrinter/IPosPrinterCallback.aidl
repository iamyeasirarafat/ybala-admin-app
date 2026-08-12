/**
 * Result callback for IPosPrinterService. Method order is part of the wire
 * contract — see the note in IPosPrinterService.aidl.
 *
 * Source: IposPrinterTestDemo (Jicai Q2 SDK), AIDL Version 1.0.0.
 */
package com.iposprinter.iposprinterservice;

interface IPosPrinterCallback {

    /** true on success, false on failure. */
    oneway void onRunResult(boolean isSuccess);

    /** Total printed length since power-on, in mm. */
    oneway void onReturnString(String result);
}
