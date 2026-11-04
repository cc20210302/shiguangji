# 时光记 · 重要日子倒数

严格按照 Figma 设计稿 [`NcHGrNQdp2f6cK7RGXbYuK`](https://www.figma.com/design/NcHGrNQdp2f6cK7RGXbYuK/Untitled) 实现的前端项目：移动端 390 × 844，每个页面一个独立 `.tsx` 文件。

**技术栈**：React 19 + TypeScript + Vite 7 + React Router 7，样式为手写 CSS（设计令牌 + 组件样式），不依赖任何 UI 框架。

## 快速开始

```bash
npm install
npm run dev        # 开发预览 http://127.0.0.1:5273
npm run build      # 类型检查 + 生产构建
npm run preview    # 预览 dist
```

桌面浏览器会把页面放在居中的手机外框里（390 × 844）；窄屏 / 矮屏自动全屏铺满。

## 页面与路由

设计稿共 17 个画板，归并为 7 个页面（同一页面的不同类型 / 空态是同一文件的页面状态）：

| 设计稿画板 | 路由 | 文件 |
| --- | --- | --- |
| 首页 `1:96`（有数据）、`38:1094`（空态） | `/` | [HomePage.tsx](src/pages/HomePage.tsx) |
| 日历 `8:191`（空）、`67:16` / `69:134` / `74:243`（有记录） | `/calendar` | [CalendarPage.tsx](src/pages/CalendarPage.tsx) |
| 添加事件 `33:205` / `36:548` / `36:623` / `36:698`（生日 / 纪念日 / 节日 / 其他） | `/add/:category` | [AddEventPage.tsx](src/pages/AddEventPage.tsx) |
| 添加成功 `36:960` | `/add-success` | [AddSuccessPage.tsx](src/pages/AddSuccessPage.tsx) |
| 事件详情 `37:1042` / `75:619` / `75:657` / `76:695` | `/event/:eventId` | [EventDetailPage.tsx](src/pages/EventDetailPage.tsx) |
| 选择日期 `36:406` | `/date-picker` | [DatePickerPage.tsx](src/pages/DatePickerPage.tsx) |
| 选择记录方式 `75:469` | `/record-mode` | [RecordModePage.tsx](src/pages/RecordModePage.tsx) |

## 返回行为

**所有返回操作都回到上一个路由**（浏览器历史后退），统一由 [`useGoBack`](src/lib/navigation.ts) 实现：

- 页面左上角返回箭头（[BackButton.tsx](src/components/BackButton.tsx)）
- 选择日期 / 选择记录方式的遮罩点击、确定、选中选项
- 详情页删除后的回退、添加成功页的「继续添加」

仅在直接打开深层链接（没有历史记录）时才回退到兜底路由，避免卡在空白页。

## 设计还原

- 版心、间距、字号全部按设计稿坐标落地：内容区左右 16、状态栏 44、底部导航 56 + 安全区 34、卡片 358 宽、事件行 70 高、日历行距 45 等。
- 色板取自设计稿底部标注：`#f8f7f2`（背景）、`#dcebdd`（薄荷）、`#3d927a`（主绿）、`#f9e6d8`（蜜桃）、`#F8DFE0`（粉）、`#333a35`（文字），集中在 [tokens.css](src/styles/tokens.css)。
- 组件复用：状态栏、底部导航（含中间 FAB）、表单字段卡、分类图标、事件行 / 事件卡、滚轮选择器。

## 数据与日期

- 设计稿的「今天」是 **2026 年 10 月 29 日（星期四）**，`TODAY` 固定在该日，因此「12 天 / 11月10日」等文案与画板一致。
- 「每年重复 / 每月重复」的事件自动滚动到下一次发生的日期；已过期的单次事件显示「已经 N 天」。
- 数据保存在 `localStorage`（`shiguangji.events.v1`），首次打开写入 5 条设计稿示例数据；清空后首页与日历会呈现设计稿的空状态。

## 已知偏差

1. **插画为 SVG 重绘**：当前 Figma 账号为 Starter 计划，MCP 调用额度用尽，`get_screenshot` / `get_design_context` / `download_assets` 全部被服务端拒绝，位图素材（「四格 pastel 手绘贴纸场景」「淡雅绿意日历打卡成功插画」）无法导出。已按同色系手绘风在 [Illustrations.tsx](src/components/Illustrations.tsx) 中用 SVG 重绘，位置与尺寸与画板一致。
2. **个别数字与画板文字不同**：画板内部数据本身有矛盾（结婚纪念日 `2026年12月30日` 却写「96 天」、中秋节 `2026年9月16日` 在 10 月之后却写「8 天」）。代码按真实日期计算倒计时，因此这些数值会与画板略有出入。
3. **首页列表主标题用事件名称**：画板里该行是组件实例的占位文案「生日 / 11月10日」，实现为事件名称 + 日期，行高与尺寸保持一致。

## 目录结构

```
src/
├─ pages/          # 7 个页面，一页一文件
├─ components/     # 状态栏、底部导航、表单、卡片、图标、插画、滚轮
├─ lib/            # 日期、倒计时、返回、className
├─ store/          # EventsProvider（localStorage + 表单草稿）
├─ data/           # 类型、分类元信息、示例数据
└─ styles/         # tokens / global / components / pages
```

`shots/` 目录是逐页截图的核对图：`01`–`09` 为 390 × 844 移动端各页面与状态，`10-desktop.png` 为桌面窗口（1280 × 900）下的手机外框效果。
