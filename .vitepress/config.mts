import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { normalizeDate, parseNoteSource, sortNotes } from './note-utils.mts'

const configDir = path.dirname(fileURLToPath(import.meta.url))
const notesDir = path.resolve(configDir, '../docs/notes')

const notes = fs.existsSync(notesDir)
  ? sortNotes(
      fs
        .readdirSync(notesDir)
        .filter((file) => file.endsWith('.md') && file !== 'index.md')
        .map((file) => {
          const slug = file.replace(/\.md$/, '')
          const { title, updated } = parseNoteSource(
            fs.readFileSync(path.join(notesDir, file), 'utf8'),
            slug
          )

          return { text: title, link: `/notes/${slug}`, updated }
        }),
      (note) => note.link
    ).map(({ text, link }) => ({ text, link }))
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
    },

    config(md) {
      // Render the update date from frontmatter right below the first H1.
      md.core.ruler.push('note-updated', (state) => {
        const { frontmatter, relativePath } = (state.env ?? {}) as {
          frontmatter?: Record<string, unknown>
          relativePath?: string
        }

        if (!relativePath?.startsWith('notes/')) return

        const updated = normalizeDate(frontmatter?.updated)
        if (!updated) return

        const headingIndex = state.tokens.findIndex(
          (token) => token.type === 'heading_open' && token.tag === 'h1'
        )
        if (headingIndex === -1) return

        const headingCloseIndex = state.tokens.findIndex(
          (token, index) =>
            index > headingIndex && token.type === 'heading_close'
        )
        if (headingCloseIndex === -1) return

        const open = new state.Token('paragraph_open', 'p', 1)
        open.attrSet('class', 'note-updated')

        const text = new state.Token('text', '', 0)
        text.content = `上次更新时间：${updated}`

        const inline = new state.Token('inline', '', 0)
        inline.content = text.content
        inline.children = [text]

        const close = new state.Token('paragraph_close', 'p', -1)

        state.tokens.splice(headingCloseIndex + 1, 0, open, inline, close)
      })
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
