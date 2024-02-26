import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'rezepte.app',
  appName: 'RezepteApp',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
