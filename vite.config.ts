import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy' // 🌟 引入兼容插件
import pxToViewport from 'postcss-px-to-viewport-8-plugin'

export default defineConfig({
	plugins: [
		react(),
		// 🌟 添加兼容旧版浏览器的配置
		legacy({
			targets: ['defaults', 'ios >= 12', 'safari >= 12'],
			additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
		}),
	],
	server: {
		host: '0.0.0.0',
		port: 5273,
		watch: {
			ignored: ['**/*.tmp', '**/*.tmpdir/**', '**/*.zip'],
		},
	},
	css: {
		postcss: {
			plugins: [
				pxToViewport({
					unitToConvert: 'px',
					viewportWidth: 390,
					unitPrecision: 5,
					propList: ['*'],
					viewportUnit: 'vw',
					fontViewportUnit: 'vw',
					selectorBlackList: [],
					minPixelValue: 1,
					mediaQuery: false,
					replace: true,
					exclude: [/node_modules/],
				})
			]
		}
	},
})