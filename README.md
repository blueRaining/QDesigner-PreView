# QDesigner-PreView

QDesigner 的离线 3D 产品预览页面，用于独立展示由 [QDesigner](https://github.com/user/QDesigner) 编辑器导出的 3D 产品模型。

## 关于 QDesigner

**QDesigner** 是一款基于浏览器的离线 3D 产品设计与可视化工作站，核心能力包括：

- 加载和编辑 3D 产品模型（包装盒、瓶型、服装、瓷器等）
- 在网格上应用和配置 PBR 材质
- 内置基于图层的 UV 贴图编辑器，支持图片、文字、形状、SVG、工艺效果图层
- 集成 Google Gemini AI，支持智能生成背景场景和包装设计
- 交互式预览并导出为结构化 ZIP 存档

商用设计工具地址：[http://babylonjsx.cn/home.html#/home](http://babylonjsx.cn/home.html#/home)

## 项目说明

本项目是 QDesigner 的**离线预览子项目**，提供轻量级的只读 3D 模型查看能力，不包含编辑功能。适用于：

- 产品模型的独立展示页面
- 嵌入第三方页面的 3D 预览
- 设计成果的分享与演示

## 技术栈

| 分类 | 技术 |
|---|---|
| 框架 | React 18 |
| 语言 | TypeScript 5 |
| 构建工具 | Vite 5 |
| 3D 引擎 | Babylon.js 8.22.1（通过 RainViewer.js 封装） |
| 样式 | Less (CSS Modules) |
| ZIP 解压 | JSZip（从 public/libs 加载） |

## 项目结构

```
QDesigner-PreView/
├── public/
│   ├── icons/              # 网站图标
│   ├── libs/jszip.js       # JSZip 库
│   └── models/             # 内置演示模型
│       └── Packaging_box2/ # 默认包装盒模型
│           ├── config.json
│           ├── model.rain
│           ├── environment.env
│           ├── thumbnail.jpg
│           └── aiconfig.json
├── src/
│   ├── 3D/
│   │   ├── Preview.ts      # Viewer3D — 3D 预览引擎封装（单例）
│   │   └── RainViewer.d.ts  # RainViewer 类型声明
│   ├── components/
│   │   ├── Viewer.tsx       # 主预览组件（URL 参数解析 + 画布挂载）
│   │   └── Loading.tsx      # 3D 立方体加载动画
│   ├── utils/
│   │   └── loader.ts        # 模型加载工具（ZIP / config / URL）
│   ├── App.tsx              # 根组件
│   └── main.tsx             # 入口文件
├── index.html
├── vite.config.ts
└── package.json
```

## 使用方式

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

默认启动在 `http://localhost:3000`。

### 构建

```bash
npm run build
```

### URL 参数

通过 URL 查询参数指定要加载的模型，支持三种模式：

| 参数 | 说明 | 示例 |
|---|---|---|
| `zipUrl` | 加载远程 ZIP 存档（QDesigner 导出格式） | `?zipUrl=https://cdn.example.com/design.zip` |
| `configUrl` | 加载 config.json 配置文件，按相对路径获取模型和环境球 | `?configUrl=/models/Packaging_box2/config.json` |
| `modelUrl` | 直接加载模型文件 URL，可搭配 `envUrl` 指定环境球 | `?modelUrl=/model.rain&envUrl=/env.env` |

无参数时默认加载内置的 `public/models/Packaging_box2` 演示模型。

### config.json 格式

```json
{
  "model": "model.rain",
  "environment": "environment.env"
}
```

## 功能特性

- 支持 `.rain`（Babylon.js 场景文件）和 `.glb` 模型格式
- 支持 HDR/ENV 环境球加载
- 自动适配移动端（开启性能优化模式）
- 窗口自适应缩放
- 3D 立方体加载动画
- 支持从 QDesigner 导出的 ZIP 存档直接加载
