import { createContentLoader } from 'vitepress'

export interface NoteIndexEntry {
  title: string
  url: string
}

function titleFromSource(src: string | undefined, url: string): string {
  const h1 = src?.match(/^#\s+(.+?)\s*$/m)?.[1]
  const fallback = decodeURIComponent(url.split('/').filter(Boolean).pop() || '未命名笔记')
  return (h1 || fallback).replace(/[*_`]/g, '').trim()
}

export default createContentLoader('notes/*.md', {
  includeSrc: true,
  transform(data): NoteIndexEntry[] {
    return data
      .filter((page) => page.url !== '/notes/' && page.url !== '/notes/index')
      .map((page) => ({
        title:
          (page.frontmatter.title as string | undefined) ||
          titleFromSource(page.src, page.url),
        url: page.url
      }))
      .sort((a, b) => a.url.localeCompare(b.url))
  }
})
