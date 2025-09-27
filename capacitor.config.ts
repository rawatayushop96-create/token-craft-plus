import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.45dccddb42cf4d73991cc3acb797490a',
  appName: 'token-craft-plus',
  webDir: 'dist',
  server: {
    url: 'https://45dccddb-42cf-4d73-991c-c3acb797490a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e40af',
      androidSplashResourceName: 'splash',
      showSpinner: true,
      spinnerColor: '#ffffff'
    }
  }
};

export default config;