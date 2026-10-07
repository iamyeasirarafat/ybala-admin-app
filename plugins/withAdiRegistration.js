const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Copies the Google Play Android Developer Verification (ADI) registration
 * snippet into android/app/src/main/assets so it ships inside the APK/AAB.
 *
 * android/ is gitignored (Continuous Native Generation), so the file lives in
 * assets/android/ and is copied in on every prebuild / EAS build.
 */

const SOURCE = path.join('assets', 'android', 'adi-registration.properties');

const withAdiRegistration = (config) =>
  withDangerousMod(config, [
    'android',
    async (cfg) => {
      const src = path.join(cfg.modRequest.projectRoot, SOURCE);
      const destDir = path.join(
        cfg.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'assets',
      );
      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(src, path.join(destDir, 'adi-registration.properties'));
      return cfg;
    },
  ]);

module.exports = withAdiRegistration;
