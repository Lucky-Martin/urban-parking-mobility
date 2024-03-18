import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.parkingmobility.app',
  appName: 'Parking Mobility',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      clientId: '982984420131-fm0adl20cjg8d4cesgncadfc6uv3t018.apps.googleusercontent.com',
      iosClientId: '982984420131-o5709pbl22gfol043sefl93ho064m3ui.apps.googleusercontent.com'
    },
  }
};

export default config;
