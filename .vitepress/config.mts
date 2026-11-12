import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type DefaultTheme } from 'vitepress'
import { compareTitles, parseNoteSource } from './note-utils.mts'

const configDir = path.dirname(fileURLToPath(import.meta.url))
const docsDir = path.resolve(configDir, '../docs')

/** Root-level names that would collide with generated routes or assets. */
const RESERVED_NAMES = new Set(['assets', 'public', '404'])

interface NoteItem {
  title: string
  link: string
  slug: string
}

interface DirItem {
  name: string
  title: string
  link: string
  hasIndex: boolean
  dirs: DirItem[]
  notes: NoteItem[]
}

function readTitle(file: string, fallback: string): string {
  return parseNoteSource(fs.readFileSync(file, 'utf8'), fallback).title
}

/**
 * A directory is a category. Its `index.md` provides the display name used in
 * the parent index and acts as the category page itself.
 */
function scanDir(absDir: string, relDir: string): DirItem {
  const entries = fs.readdirSync(absDir, { withFileTypes: true })
  const indexFile = path.join(absDir, 'index.md')
  const hasIndex = fs.existsSync(indexFile)
  const fallbackTitle = path.basename(absDir)
  const dirs: DirItem[] = []
  const notes: NoteItem[] = []

  for (const entry of entries) {
    const name = entry.name
    if (name.startsWith('.')) continue

    if (entry.isDirectory()) {
      // `public` is VitePress's static asset directory, not a category.
      if (!relDir && name === 'public') continue
      const childRel = relDir ? `${relDir}/${name}` : name
      dirs.push(scanDir(path.join(absDir, name), childRel))
      continue
    }

    if (!entry.isFile() || !name.endsWith('.md') || name === 'index.md') {
      continue
    }

    const slug = name.replace(/\.md$/, '')
    notes.push({
      title: readTitle(path.join(absDir, name), slug),
      link: relDir ? `/${relDir}/${slug}` : `/${slug}`,
      slug
    })
  }

  dirs.sort((a, b) => compareTitles(a.title, b.title))
  notes.sort((a, b) => compareTitles(a.title, b.title))

  return {
    name: path.basename(absDir),
    title: hasIndex ? readTitle(indexFile, fallbackTitle) : fallbackTitle,
    link: relDir ? `/${relDir}/` : '/',
    hasIndex,
    dirs,
    notes
  }
}

function warnMissingIndex(dir: DirItem, relDir: string): void {
  if (!dir.hasIndex) {
    console.warn(
      `[note-index] 目录缺少 index.md，不会出现在索引和导航中：docs/${relDir}`
    )
  }

  for (const child of dir.dirs) {
    warnMissingIndex(child, `${relDir}/${child.name}`)
  }
}

function toSidebarItem(dir: DirItem): DefaultTheme.SidebarItem {
  const items: DefaultTheme.SidebarItem[] = [
    ...dir.dirs.map(toSidebarItem),
    ...dir.notes.map((note) => ({ text: note.title, link: note.link }))
  ]

  const item: DefaultTheme.SidebarItem = {
    text: dir.title,
    collapsed: false
  }

  // A category without index.md has no page to link to, so it stays a group.
  if (dir.hasIndex) item.link = dir.link
  if (items.length) item.items = items

  return item
}

const root = scanDir(docsDir, '')

root.notes = root.notes.filter((note) => {
  if (!RESERVED_NAMES.has(note.slug)) return true
  console.warn(
    `[note-index] 笔记使用了保留名称，已从索引中忽略：docs/${note.slug}.md`
  )
  return false
})

root.dirs = root.dirs.filter((dir) => {
  if (!RESERVED_NAMES.has(dir.name)) return true
  console.warn(
    `[note-index] 分类使用了保留名称，已从索引中忽略：docs/${dir.name}/`
  )
  return false
})

for (const dir of root.dirs) {
  warnMissingIndex(dir, dir.name)
}

const navItems = [
  ...root.dirs
    .filter((dir) => dir.hasIndex)
    .map((dir) => ({ text: dir.title, link: dir.link })),
  ...root.notes.map((note) => ({ text: note.title, link: note.link }))
]

const noteNav = navItems.length
  ? [{ text: '笔记', activeMatch: '^/(?!$)', items: navItems }]
  : []

const sidebar: DefaultTheme.SidebarItem[] = [
  ...root.dirs.map(toSidebarItem),
  ...root.notes.map((note) => ({ text: note.title, link: note.link }))
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  srcDir: 'docs',
  cleanUrls: true,

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

    sidebar,

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
