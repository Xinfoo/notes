# 笔记

一个持续积累的个人文档库，用来记录、整理和查阅自己的经验与资料。

站点使用 [VitePress](https://vitepress.dev/) 构建，内容以 Markdown 编写，构建后是可部署的静态站点。

## 用途

这个仓库不限定主题：系统配置、开发工具、命令速查、问题排查，以及其他任何值得留下的内容，都可以作为一篇笔记放进来。

所有笔记页面都在 `docs/notes/` 下维护。新增一个 Markdown 文件后，它会自动出现在：

- 右上角的“笔记”下拉栏
- 左侧的笔记列表
- 首页的“笔记索引”卡片

无需再手动修改导航或侧栏配置。

## 特点

- Markdown 写作，VitePress 静态生成
- 扁平化笔记列表，不做分类
- 自动读取标题与更新时间，按更新时间倒序生成索引
- Material Design 3 界面，支持浅色/深色模式
- 自托管 Noto Sans / Noto Sans SC 与 JetBrains Mono 字体
- 按钮、导航、卡片等带有 MD3 状态层和点击波纹动画

## 技术栈

- VitePress 2（最低要求 `2.0.0-alpha.20`，安装时取最新版本）
- Vue 3
- pnpm
- gray-matter（构建期解析 frontmatter）
- Material You CSS（第三方实现，见下方许可说明）

## 目录结构

```text
.
├── docs/
│   ├── index.md              # 首页与免责声明
│   ├── notes/                # 所有笔记
│   ├── templates/            # 笔记模板，不参与自动索引
│   ├── notes.data.mts        # 首页自动索引的数据加载器
│   └── public/               # 原样复制到站点根目录的静态资源
├── .vitepress/
│   ├── config.mts            # 站点配置、自动导航/侧栏
│   ├── note-utils.mts        # 标题与更新时间解析、排序
│   └── theme/                # 自定义 MD3 主题
│       └── vendor/           # 第三方 CSS 及其许可证
├── deploy/
│   └── nginx-example/        # Nginx 配置模板
└── package.json
```

## 本地开发

需要 Node.js 和 pnpm。

```bash
pnpm install
pnpm docs:dev
```

默认开发地址：<http://localhost:5173/>

构建与预览：

```bash
pnpm docs:build
pnpm docs:preview
```

站点启用了 `cleanUrls`，页面链接不带 `.html`。构建产物中仍是 `*.html` 文件，部署服务器需要把 `/foo` 映射到 `/foo.html`：Netlify、GitHub Pages 默认支持，Vercel 需在 `vercel.json` 中开启 `cleanUrls`。

## 部署

`deploy/nginx-example/` 下有一份基于 VitePress 官方示例改写的 Nginx 配置模板，供自建服务器部署时参考：

- `website.conf`：站点 server 配置，包含 HTTP → HTTPS 跳转、www 归一、HTTP/2、HTTP/3 和静态资源缓存；
- `headers.conf`：安全响应头，建议放到 `/etc/nginx/snippets/` 下，再在 server 或 location 里 `include`。

模板不能直接使用，需要先替换这些占位符：

| 占位符 | 替换为 |
| --- | --- |
| `example.com`、`www.example.com` | 你的域名 |
| `<SSL 证书路径>`、`<SSL 证书私钥路径>` | 证书和私钥文件 |
| `<VitePress dist 输出路径>` | `pnpm docs:build` 输出的 `dist` 目录 |
| `<headers.conf 的 Nginx 相对路径>` | 实际的 `include` 路径 |

### 注意事项

- `http2 on` 需要 nginx ≥ 1.25.1；HTTP/3 需要 ≥ 1.25.0 且编译时带 `--with-http_v3_module`（`nginx -V | grep http_v3` 可确认）；`ssl_reject_handshake` 需要 ≥ 1.19.4。
- HTTP/3 使用 UDP，防火墙需要放行 **443/UDP**；只开 TCP 443 时 QUIC 会静默失效，浏览器仍会回落到 HTTP/2。
- 证书要覆盖 `www` 和裸域，否则访问 www 的 301 会先报证书错误。
- HSTS 里的 `preload` 只是声明，需要到 [hstspreload.org](https://hstspreload.org/) 提交才会进入预加载列表；`includeSubDomains` 要求所有子域都能走 HTTPS，且提交后移除很慢，确认后再启用。
- 只启用 TLS 1.3 是有意取舍：更安全，但会拒绝部分旧客户端；需要兼容时改成 `TLSv1.2 TLSv1.3`。
- `expires` 与 `add_header Cache-Control` 并用时会产生两条缓存头，浏览器会自行合并，不影响缓存效果。
- 修改后先 `nginx -t` 校验，再 `systemctl reload nginx` 生效。

模板中的部分写法（例如 TLS 1.3-only、静态资源长缓存）是有意选择，不是遗漏；调整前请确认影响。

## 新增笔记

在 `docs/notes/` 下新建 Markdown 文件，或者直接复制模板过去再修改：[带注释模板](docs/templates/note-template.md) / [无注释模板](docs/templates/note-template-no-comments.md)。例如：

```md
---
title: 笔记标题
updated: 2026-10-25
---

# 笔记标题

正文内容。
```

标题读取优先级：

1. frontmatter 中的 `title`
2. 正文第一个一级标题
3. 文件名

`updated` 使用 **`YYYY-MM-DD`** 格式（月份和日期补零，只写日期、不带时间），只需要写在 frontmatter 里，站点会：

- 按该日期**倒序**排列顶部下拉栏、左侧栏和首页索引（日期相同则按 slug 排序，未填写日期的笔记排在最后）；
- 在正文一级标题后自动插入一行「上次更新时间：2026-10-25」，无需在正文中重复书写。

日期必须写成 `2026-06-25`，不要写成 `2026-6-25`。非补零格式不会被严格解析，可能被按本地时间解释后偏移一天（例如在 `Asia/Shanghai` 下 `2026-6-25` 会变成 `2026-06-24`），并且会影响排序。

frontmatter 由 gray-matter 解析，导航、首页和正文日期使用同一套标题与日期规则。

每次修改笔记后请同步更新该字段。**修改 `title` 或 `updated` 后，如果开发服务器正在运行，请重启一次 `pnpm docs:dev`**，让导航与侧栏配置重新生成；首页索引会随内容更新，正式构建时所有排序都会自动更新。新增、删除或重命名笔记后同理。

## 免责声明

本库内容均为 **个人经验总结**，有很强的个人风格，对他人可读性欠佳。

**在生产环境执行任何命令前，请务必理解其含义，并做好备份。**

## 许可证

本项目采用 **MIT License** 发布。正式许可证文本在仓库根目录的 `LICENSE` 文件中。

第三方资源：

- [material-you-css](https://github.com/hiratazx/material-you-css)：MIT License，位于 `.vitepress/theme/vendor/material-you-css/`，其许可证文件已随代码保留。
- Noto Sans、Noto Sans SC、JetBrains Mono：SIL Open Font License 1.1。
- VitePress：MIT License。
