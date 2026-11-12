# 笔记

一个持续积累的个人文档库，用来记录、整理和查阅自己的经验与资料。

站点使用 [VitePress](https://vitepress.dev/) 构建，内容以 Markdown 编写，构建后是可部署的静态站点。

## 用途

这个仓库不限定主题：系统配置、开发工具、命令速查、问题排查，以及其他任何值得留下的内容，都可以作为一篇笔记放进来。

笔记放在 `docs/` 下，目录结构就是分类结构：

- 直接放在 `docs/` 根目录的 Markdown 文件，URL 是 `/文件名`；
- 放在 `docs/<目录>/` 下的，URL 是 `/<目录>/文件名`，目录就是分类；
- 分类目录里的 `index.md` 既是分类页，也提供该分类在上一级索引中的名称；
- 分类下可以继续嵌套子目录，形成多级分类。

新增、删除文件或目录后，正式构建会自动更新导航、侧栏和索引；开发服务器需要重启一次，见下文。

## 特点

- Markdown 写作，VitePress 静态生成
- 目录即分类，支持多级嵌套
- 自动读取标题，按标题排序（中文按拼音在前，英文按字母在后）
- 文件夹按 `index.md` 的标题排序，排在同级文章前面
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
│   ├── index.md              # 首页
│   ├── *.md                  # 根目录的笔记，URL 为 /文件名
│   ├── <分类>/               # 分类目录（建议包含 index.md）
│   │   ├── index.md          # 分类页，title 决定分类名称
│   │   └── *.md              # 分类下的笔记
│   ├── notes.data.mts        # 首页和分类页的索引数据
│   └── public/               # 原样复制到站点根目录的静态资源
├── templates/                # 笔记与分类页模板，不参与构建
│   ├── note-template.md
│   ├── note-template-no-comments.md
│   ├── category-index.md
│   └── category-index-no-comments.md
├── .vitepress/
│   ├── config.mts            # 站点配置、自动导航/侧栏
│   ├── note-utils.mts        # 标题解析与排序
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

散文章直接放在 `docs/` 根目录，URL 是 `/文件名`。可以复制模板：[带注释模板](templates/note-template.md) / [无注释模板](templates/note-template-no-comments.md)。例如：

```md
---
title: 笔记标题
---

# 笔记标题

正文内容。
```

标题读取优先级：

1. frontmatter 中的 `title`
2. 正文第一个一级标题
3. 文件名

## 分类

把一个目录变成分类：

1. 在 `docs/` 下新建目录，目录名会出现在 URL 里，例如 `docs/system/` 对应 `/system/`；
2. 把分类页模板复制为 `docs/system/index.md`：[带注释](templates/category-index.md) / [无注释](templates/category-index-no-comments.md)；
3. 修改 `index.md` 的 `title`，它决定分类在首页、顶部导航和左侧栏里的名称；
4. 分类下的文章直接放进该目录；子分类再建子目录，重复以上步骤。

分类页只列出**直接子项**：子分类在前，然后是该目录下的文章。排序都按标题进行，规则是 `zh-CN` 排序：中文按拼音排在前面，英文按字母排在后面；文件夹用 `index.md` 的 `title` 参与排序。分类的 `title` 缺失时，依次回退到第一个一级标题和目录名。

没有 `index.md` 的目录仍然会构建，但不会出现在索引、导航和分类页中，构建时会打印警告；左侧栏里它仍会作为分组出现，其中的文章可以直接访问。

**新增、删除、重命名文件或目录后，如果开发服务器正在运行，请重启一次 `pnpm docs:dev`**，让导航和侧栏重新生成；正式构建时索引会自动更新。

## 免责声明

本库内容均为 **个人经验总结**，有很强的个人风格，对他人可读性欠佳。

**在生产环境执行任何命令前，请务必理解其含义，并做好备份。**

## 许可证

本项目采用 **MIT License** 发布。正式许可证文本在仓库根目录的 `LICENSE` 文件中。

第三方资源：

- [material-you-css](https://github.com/hiratazx/material-you-css)：MIT License，位于 `.vitepress/theme/vendor/material-you-css/`，其许可证文件已随代码保留。
- Noto Sans、Noto Sans SC、JetBrains Mono：SIL Open Font License 1.1。
- VitePress：MIT License。
