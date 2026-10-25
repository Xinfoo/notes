import { createContentLoader } from 'vitepress'
import {
  parseNoteSource,
  slugFromUrl,
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
        const slug = slugFromUrl(page.url)
        const { title, updated } = parseNoteSource(page.src ?? '', slug)

        return { title, updated, url: page.url, slug }
      })

    return sortNotes(notes, (note) => note.slug).map(
      ({ title, updated, url }) => ({ title, updated, url })
    )
  }
})
