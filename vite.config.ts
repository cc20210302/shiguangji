import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pxToViewport from 'postcss-px-to-viewport-8-plugin'
import { VitePWA } from 'vite-plugin-pwa' // 🌟 1. 引入 PWA 插件

export default defineConfig({
  plugins: [
    react(),
    // 🌟 2. 配置 PWA 插件
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   manifest: {
    //     name: '时光记',
    //     short_name: '时光记',
    //     description: '记录每一个重要的日子',
    //     theme_color: '#f8f7f2',
    //     background_color: '#f8f7f2',
    //     display: 'standalone', // 核心：全屏运行，没有浏览器地址栏
    //     icons: [
    //       {
    //         src: 'pwa-192x192.png', // 对应 public 目录下的文件名
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'pwa-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       }
    //     ]
    //   }
    // })
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