import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Biblike',
  slug: 'biblike',
  version: '1.3',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'automatic',
  scheme: 'biblike',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#F7F3F7',
    dark: {
      image: './assets/images/splash-icon.png',
      backgroundColor: '#F7F3F7',
    },
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.anoxhaj.biblike',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#F7F3F7',
    },
    package: 'com.anoxhaj.biblike',
  },
  plugins: [
    'expo-router',
    'expo-dev-client',
    [
      'expo-sqlite',
      {
        enableFTS: true,
        useSQLCipher: true,
        android: {
          enableFTS: true,
          useSQLCipher: true,
        },
        ios: {
          customBuildFlags: ['-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1'],
        },
      },
    ],
  ],
  extra: {
    eas: {
      projectId: 'e6c8a8a6-bb16-40fa-8cf9-80c1f2b24724',
    },
  },
});
