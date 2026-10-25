import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

const configDir = path.dirname(fileURLToPath(import.meta.url))
const notesDir = path.resolve(configDir, '../docs/notes')

function readNoteTitle(file: string): string {
  const raw = fs.readFileSync(path.join(notesDir, file), 'utf8')
  const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const title = frontmatter?.[1].match(/^title:\s*(.+?)\s*$/m)?.[1]
  const heading = raw.match(/^#\s+(.+?)\s*$/m)?.[1]
  const fallback = file.replace(/\.md$/, '')

  return (title || heading || fallback)
    .replace(/^["']|["']$/g, '')
    .replace(/[*_`]/g, '')
    .trim()
}

const notes = fs.existsSync(notesDir)
  ? fs
      .readdirSync(notesDir)
      .filter((file) => file.endsWith('.md') && file !== 'index.md')
      .sort()
      .map((file) => ({
        text: readNoteTitle(file),
        link: `/notes/${file.replace(/\.md$/, '')}`
      }))
  : []

const noteNav = notes.length
  ? [{ text: '笔记', activeMatch: '^/notes/', items: notes }]
  : []

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  srcDir: 'docs',

  title: '笔记',
  description: '一个持续积累的个人文档库。',

  head: [['link', { rel: 'icon', href: '/icon.png', type: 'image/png' }]],

  markdown: {
    theme: {
      light: 'material-theme-lighter',
      dark: 'material-theme'
    },
    codeCopyButton: {
      tooltipText: '复制代码',
      copiedText: '已复制'
    }
  },

  themeConfig: {
    logo: '/icon.png',

    nav: [{ text: '首页', link: '/' }, ...noteNav],

    sidebar: notes,

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/Xinfoo/notes',
        ariaLabel: 'GitHub 仓库'
      }
    ],

    outline: {
      level: [2, 3],
      label: '本页目录'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    mobileMenuLabel: '菜单',
    navMenuLabel: '主导航',
    skipToContentLabel: '跳至内容',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    notFound: {
      title: '页面不存在',
      quote: '这里没有你要找的内容，不如回到首页看看。',
      linkText: '返回首页'
    }
  }
})
