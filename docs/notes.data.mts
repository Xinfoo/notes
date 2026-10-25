import { createContentLoader } from 'vitepress'
import {
  normalizeDate,
  parseNoteSource,
  sortNotes
} from '../.vitepress/note-utils.mts'

export interface NoteIndexEntry {
  title: string
  updated: string
  url: string
}

export default createContentLoader('notes/*.md', {
  includeSrc: true,
  transform(data): NoteIndexEntry[] {
    const notes = data
      .filter((page) => page.url !== '/notes/' && page.url !== '/notes/index')
      .map((page) => {
        const fallback = decodeURIComponent(
          page.url.split('/').filter(Boolean).pop() || '未命名笔记'
        )
        const meta = parseNoteSource(page.src ?? '', fallback)
        const frontmatterTitle =
          typeof page.frontmatter.title === 'string'
            ? page.frontmatter.title
            : ''

        return {
          title: frontmatterTitle || meta.title,
          updated: normalizeDate(page.frontmatter.updated) || meta.updated,
          url: page.url
        }
      })

    return sortNotes(notes, (note) => note.url)
  }
})
