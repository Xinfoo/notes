import { createContentLoader } from 'vitepress'
import { parseNoteSource } from '../.vitepress/note-utils.mts'

export interface NoteIndexEntry {
  title: string
  url: string
  /** Directory the page belongs to: '' for the root, 'cat' for cat/, 'cat/sub' for cat/sub/. */
  dir: string
  /** True for a directory's index.md, which is rendered as a category page. */
  isIndex: boolean
}

function splitUrl(url: string): {
  dir: string
  isIndex: boolean
  fallback: string
} {
  const isIndex = url.endsWith('/')
  const clean = url.replace(/^\/+|\/+$/g, '')
  const parts = clean.split('/').filter(Boolean)

  return {
    dir: isIndex ? parts.join('/') : parts.slice(0, -1).join('/'),
    isIndex,
    fallback: parts.at(-1) ?? ''
  }
}

export default createContentLoader(['**/*.md', '!public/**'], {
  includeSrc: true,
  transform(data): NoteIndexEntry[] {
    return data
      .filter((page) => page.url !== '/')
      .map((page) => {
        const { dir, isIndex, fallback } = splitUrl(page.url)
        const { title } = parseNoteSource(page.src ?? '', fallback)

        return { title, url: page.url, dir, isIndex }
      })
  }
})
