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
			backgroundColor: "#f8f7f2", // 建议和首页保持一致
			androidScaleType: "CENTER_CROP",
			showSpinner: false,
			splashFullScreen: true,
			      splashImmersive: false, // 建议设为 false，避免与全屏模式冲突
		},
		EdgeToEdge: {
			backgroundColor: '#f8f7f2', 
			    statusBarColor: '#00000000',
			    navigationBarColor: '#00000000'
		},
		SystemBars: {
			insetsHandling: 'disable', // 关键：禁用内置边距处理，交由 EdgeToEdge 接管
		},
	},
};

export default config;