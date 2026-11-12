# 时光记动态状态栏背景修复

## 目标效果

状态栏背景跟随当前页面顶部主题色，状态栏图标保持深色：

- 首页及默认页面：`#F8F7F2`（米黄色）
- 纪念日详情：`#F8DFE0`（浅粉色）
- 节日详情：`#F9E6D8`（浅橙色）
- 生日详情：`#DCEBDD`（浅绿色）
- 其他详情：`#DCEBDD`（浅绿色）

## 实现方式

- `src/lib/statusBar.ts` 是唯一前端主题/状态栏入口。
- 页面主题变化时，同步更新 Web 页面背景变量、状态栏深色图标样式和 Android 原生窗口背景。
- 新增 `ThemeStatusBarPlugin.java`：Android 15/16 强制 Edge-to-Edge 时，系统不再支持通过 `statusBarColor` 设置状态栏底色，因此由原生窗口 Decor 背景绘制透明状态栏后方的颜色；Android 14 及以下同时更新原生 `statusBarColor`。
- `MainActivity.java` 注册该插件，并将启动默认背景设为 `#F8F7F2`。
- `EventDetailPage.tsx` 按事件类别切换状态栏颜色，离开详情页恢复首页米黄色。

## 本地构建

```bash
npm install
npm run typecheck
npm run build
npx cap sync android
```

然后使用 Android Studio 打开 `android` 目录，重新构建并安装 APK。

注意：当前执行环境缺少 Rollup 的 Linux 可选原生依赖，且无法连接 Gradle 下载站，因此本次已完成 TypeScript 类型检查，但未能在此环境完成 Vite 打包和 Android Gradle 编译。请在本机安装依赖后执行上述命令完成构建。
