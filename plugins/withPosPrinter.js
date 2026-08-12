const {
  withAndroidManifest,
  withAppBuildGradle,
  withDangerousMod,
  withMainApplication,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Installs the Q2/Q21 built-in thermal printer native module.
 *
 * The android/ directory is gitignored (Continuous Native Generation), so the
 * AIDL and Kotlin sources cannot simply live there — a prebuild or EAS build
 * would wipe them. This plugin copies them in on every prebuild instead, which
 * is what makes the integration survive a clean checkout.
 */

const AIDL_PACKAGE_PATH = path.join(
  'com',
  'iposprinter',
  'iposprinterservice',
);
const MODULE_PACKAGE = 'com.ybala.adminApp.posprinter';
const SERVICE_PACKAGE = 'com.iposprinter.iposprinterservice';

const SOURCES = path.join(__dirname, 'posPrinter');

const copySources = (config) =>
  withDangerousMod(config, [
    'android',
    async (cfg) => {
      const root = cfg.modRequest.platformProjectRoot;
      const main = path.join(root, 'app', 'src', 'main');

      // AIDL must sit under a directory tree matching its package, or the
      // Android build will not generate the stubs.
      const aidlDir = path.join(main, 'aidl', AIDL_PACKAGE_PATH);
      fs.mkdirSync(aidlDir, { recursive: true });
      for (const file of ['IPosPrinterService.aidl', 'IPosPrinterCallback.aidl']) {
        fs.copyFileSync(
          path.join(SOURCES, file),
          path.join(aidlDir, file),
        );
      }

      const javaDir = path.join(
        main,
        'java',
        ...MODULE_PACKAGE.split('.'),
      );
      fs.mkdirSync(javaDir, { recursive: true });
      for (const file of ['PosPrinterModule.kt', 'PosPrinterPackage.kt']) {
        fs.copyFileSync(path.join(SOURCES, file), path.join(javaDir, file));
      }

      return cfg;
    },
  ]);

/**
 * Registers the package with React Native. In-project modules are not
 * autolinked, so without this the module never reaches JS.
 */
const registerPackage = (config) =>
  withMainApplication(config, (cfg) => {
    let contents = cfg.modResults.contents;
    const importLine = `import ${MODULE_PACKAGE}.PosPrinterPackage`;

    if (!contents.includes(importLine)) {
      contents = contents.replace(
        /^(package .*\n)/m,
        `$1\n${importLine}\n`,
      );
    }

    const addLine = '              add(PosPrinterPackage())';
    if (!contents.includes('add(PosPrinterPackage())')) {
      contents = contents.replace(
        /(PackageList\(this\)\.packages\.apply\s*\{\n)/,
        `$1${addLine}\n`,
      );
    }

    cfg.modResults.contents = contents;
    return cfg;
  });

/**
 * Android Gradle Plugin 8+ ships with the AIDL build feature switched off, so
 * the .aidl files are copied in but never compiled — the generated Stub /
 * asInterface classes simply do not exist and the Kotlin module fails with
 * "Unresolved reference". Nothing turns this on implicitly.
 */
const enableAidl = (config) =>
  withAppBuildGradle(config, (cfg) => {
    let contents = cfg.modResults.contents;
    if (contents.includes('aidl true')) return cfg;

    contents = contents.replace(
      /^android\s*\{/m,
      'android {\n    buildFeatures {\n        aidl true\n    }\n',
    );

    cfg.modResults.contents = contents;
    return cfg;
  });

/**
 * Android 11+ hides other packages unless they are declared. Without this
 * <queries> entry bindService silently fails on Android 11 devices — which is
 * exactly the fleet this app targets.
 */
const addServiceQuery = (config) =>
  withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;

    manifest.queries = manifest.queries ?? [];
    const hasQuery = manifest.queries.some((q) =>
      (q.package ?? []).some(
        (p) => p.$?.['android:name'] === SERVICE_PACKAGE,
      ),
    );
    if (hasQuery) return cfg;

    // Merge into the existing <queries> element (expo-router adds one) rather
    // than appending a second: duplicate <queries> tags in one manifest are
    // not something AAPT2 reliably accepts.
    if (manifest.queries.length === 0) manifest.queries.push({});
    const target = manifest.queries[0];
    target.package = target.package ?? [];
    target.package.push({ $: { 'android:name': SERVICE_PACKAGE } });

    return cfg;
  });

module.exports = (config) =>
  addServiceQuery(enableAidl(registerPackage(copySources(config))));
