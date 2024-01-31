import { CapacitorConfig } from '@capacitor/cli';
import {environment} from "./src/environments/environment";

const config: CapacitorConfig = {
  appId: 'urban.parking.mobility',
  appName: 'Parking Mobility',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    GoogleMaps: {
      apiKey: environment.MAPS_API_KEY
    }
  }
};

export default config;
