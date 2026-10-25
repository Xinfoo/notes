/**
 * Shared note metadata helpers.
 *
 * Both the site config (navigation/sidebar) and the homepage content loader use
 * these functions so title extraction and ordering stay consistent.
 */

export interface NoteMeta {
  title: string
  updated: string
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/
const TITLE_RE = /^title:\s*(.+?)\s*$/m
const UPDATED_RE = /^updated:\s*(.+?)\s*$/m
const H1_RE = /^#\s+(.+?)\s*$/m

function cleanTitle(value: string): string {
  return value
    .replace(/^["']|["']$/g, '')
    .replace(/[*_`]/g, '')
    .trim()
}

/**
 * Normalize a frontmatter date to `YYYY-MM-DD`.
 *
 * Accepts the value as written in frontmatter (a string) and as parsed by
 * gray-matter (a `Date`), so quoted and unquoted dates both work.
 */
export function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? ''
      : value.toISOString().slice(0, 10)
  }

  if (typeof value !== 'string') return ''

  const isoDate = value.match(/\d{4}-\d{2}-\d{2}/)?.[0]
  if (isoDate) return isoDate

  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp)
    ? ''
    : new Date(timestamp).toISOString().slice(0, 10)
}

export function parseNoteSource(raw: string, fallback: string): NoteMeta {
  const frontmatter = raw.match(FRONTMATTER_RE)?.[1] ?? ''
  const title =
    frontmatter.match(TITLE_RE)?.[1] ?? raw.match(H1_RE)?.[1] ?? fallback

  return {
    title: cleanTitle(title),
    updated: normalizeDate(frontmatter.match(UPDATED_RE)?.[1])
  }
}

/**
 * Sort notes by update date, newest first. Notes without a valid date go last.
 * Ties are broken by `getKey` so the order is stable across builds.
 */
export function sortNotes<T extends { updated: string }>(
  notes: T[],
  getKey: (note: T) => string
): T[] {
  return [...notes].sort((a, b) => {
    const byUpdated = b.updated.localeCompare(a.updated)
    if (byUpdated !== 0) return byUpdated
    return getKey(a).localeCompare(getKey(b), 'zh-CN')
  })
}
