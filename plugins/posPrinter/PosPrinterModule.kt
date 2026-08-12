package com.ybala.adminApp.posprinter

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.IBinder
import android.util.Base64
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.iposprinter.iposprinterservice.IPosPrinterCallback
import com.iposprinter.iposprinterservice.IPosPrinterService

/**
 * Bridges the Q2/Q21 built-in thermal printer to JS.
 *
 * The printer is reached by binding to a service in the vendor's pre-installed
 * firmware app — there is no serial node or Bluetooth socket involved, despite
 * what some vendor datasheets claim.
 */
class PosPrinterModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val SERVICE_PACKAGE = "com.iposprinter.iposprinterservice"
        private const val SERVICE_ACTION = "com.iposprinter.iposprinterservice.IPosPrintService"

        /**
         * Pixel rows fed after the receipt so it clears the tear bar. 8 dots/mm,
         * so 160 dots is 20mm — the value the vendor's own demo uses everywhere.
         * This device has no auto-cutter; the feed is what makes it tearable.
         */
        private const val TEAR_FEED_DOTS = 160

        // getPrinterStatus() return codes. These differ from several vendor
        // datasheets in circulation, which list 1 as "normal" — 0 is normal.
        private const val STATUS_NORMAL = 0
    }

    private var printer: IPosPrinterService? = null

    private val connection = object : ServiceConnection {
        override fun onServiceConnected(name: ComponentName?, service: IBinder?) {
            printer = IPosPrinterService.Stub.asInterface(service)
        }

        override fun onServiceDisconnected(name: ComponentName?) {
            printer = null
        }
    }

    init {
        bind()
    }

    override fun getName() = "PosPrinter"

    private fun bind() {
        val intent = Intent().apply {
            setPackage(SERVICE_PACKAGE)
            action = SERVICE_ACTION
        }
        reactContext.bindService(intent, connection, Context.BIND_AUTO_CREATE)
    }

    /** No-op callback: results are reported through the Promise instead. */
    private fun noopCallback() = object : IPosPrinterCallback.Stub() {
        override fun onRunResult(isSuccess: Boolean) {}
        override fun onReturnString(result: String?) {}
    }

    @ReactMethod
    fun isConnected(promise: Promise) {
        promise.resolve(printer != null)
    }

    /**
     * Resolves the raw vendor status code, or -1 when the service is not bound.
     * Callers map the code; see STATUS_* above.
     */
    @ReactMethod
    fun getStatus(promise: Promise) {
        val service = printer
        if (service == null) {
            promise.resolve(-1)
            return
        }
        try {
            promise.resolve(service.getPrinterStatus())
        } catch (e: Exception) {
            promise.reject("STATUS_FAILED", e.message, e)
        }
    }

    /**
     * Prints a base64-encoded ESC/POS byte stream.
     *
     * Base64 rather than an int array because ReadableArray marshalling of a
     * few thousand bytes one boxed Double at a time is measurably slow, and a
     * receipt is a few KB.
     */
    @ReactMethod
    fun printBase64(base64: String, promise: Promise) {
        val service = printer
        if (service == null) {
            // Re-attempt the bind so a printer that was unavailable at startup
            // (service still booting) recovers without an app restart.
            bind()
            promise.reject("NOT_BOUND", "Printer service is not bound")
            return
        }

        try {
            val status = service.getPrinterStatus()
            if (status != STATUS_NORMAL) {
                promise.reject("NOT_READY", "Printer status $status")
                return
            }

            val bytes = Base64.decode(base64, Base64.DEFAULT)
            val callback = noopCallback()

            // ESC/POS command stream. printRawData() is for dot/bitmap data and
            // would render this as garbage pixels.
            service.sendUserCMDData(bytes, callback)

            // Nothing has physically printed yet — every call above only fills
            // the buffer. This commits it and feeds clear of the tear bar.
            service.printerPerformPrint(TEAR_FEED_DOTS, callback)

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("PRINT_FAILED", e.message, e)
        }
    }

    override fun invalidate() {
        try {
            reactContext.unbindService(connection)
        } catch (_: IllegalArgumentException) {
            // Already unbound; nothing to do.
        }
        printer = null
        super.invalidate()
    }
}
