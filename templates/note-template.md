---
# 笔记标题
# - 显示在顶部「笔记」下拉栏、左侧栏和首页卡片中
# - 建议与正文一级标题保持一致
title: 笔记标题

# 页面摘要
# - 写入页面的 meta description
description: 页面摘要。

# 右侧「本页目录」层级
# - 只影响宽屏右侧目录，不影响正文标题、左侧笔记列表或首页索引
# - [2, 3]：显示 H2～H3（站点默认）
# - [2, 4]：显示 H2～H4，适合包含 H4 小节的笔记
# - 'deep'：显示 H2～H6
# - 2：只显示 H2
# - false：不显示右侧目录
# - 数组是闭区间，[2, 4] 表示 H2、H3、H4，不是只显示第 2 和第 4 级
# - 不写时使用 .vitepress/config.mts 中的 themeConfig.outline.level（[2, 3]）
# - 目录标题「本页目录」来自 themeConfig.outline.label，页面字段不能修改它
outline: [2, 3]
---
