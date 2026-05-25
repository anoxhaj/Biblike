import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Biblike',
  slug: 'biblike',
  version: '1.4.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'automatic',
  scheme: 'biblike',
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
    [
      'expo-splash-screen',
      {
        backgroundColor: '#F7F3F7',
        image: './assets/images/splash-icon.png',
        dark: {
          image: './assets/images/splash-icon.png',
          backgroundColor: '#493149',
        },
        imageWidth: 200,
      },
    ],
    '@react-native-vector-icons/entypo',
    '@react-native-vector-icons/ionicons',
  ],
  extra: {
    eas: {
      projectId: 'e6c8a8a6-bb16-40fa-8cf9-80c1f2b24724',
    },
  },
});
