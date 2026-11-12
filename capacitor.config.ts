// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config : CapacitorConfig = {
	appId: 'com.example.shiguangji',
	appName: '时光记',
	webDir: 'dist',
	
	plugins: {
		SplashScreen: {
			launchShowDuration: 2000,
			launchAutoHide: true,
			backgroundColor: '#f8f7f2',
			androidScaleType: 'CENTER_CROP',
			showSpinner: false,
			splashFullScreen: true,
			splashImmersive: false,
		},
		StatusBar: {
			// LIGHT = dark (black) status-bar icons on a light background.
			overlaysWebView: true,
			style: 'LIGHT',
			backgroundColor: '#f8f7f2',
		},
	},
};

export default config;