import { ExpoConfig } from 'expo/config';

// EAS Build sets this automatically for cloud builds (development / preview /
// production, matching the profile names in eas.json). It's undefined for
// local `expo start` / `expo prebuild`, where "development" is the right
// default (sandbox APNs entitlement).
const easBuildProfile = process.env.EAS_BUILD_PROFILE;
const oneSignalMode = easBuildProfile === 'production' ? 'production' : 'development';

const config: ExpoConfig = {
  name: 'ybala_admin_app',
  slug: 'ybala_admin_app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'ybalaadminapp',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.ybala.adminApp',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: 'com.ybala.adminApp',
    googleServicesFile: './google-services.json',
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'onesignal-expo-plugin',
      {
        mode: oneSignalMode,
        sounds: ['./assets/sounds/order_alert.wav'],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: '088c52d3-0d5c-4c38-bd72-f1de72ca144e',
    },
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  updates: {
    url: 'https://u.expo.dev/088c52d3-0d5c-4c38-bd72-f1de72ca144e',
  },
};

export default config;
