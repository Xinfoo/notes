/**
 * Shared note metadata helpers.
 *
 * The site config (navigation/sidebar), the homepage content loader and the
 * markdown renderer all resolve note metadata through this module, so titles,
 * dates and ordering stay consistent.
 */

import matter from 'gray-matter'

export interface NoteMeta {
  title: string
  updated: string
}

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

/**
 * Resolve title and update date from already parsed frontmatter and content.
 *
 * Title priority: frontmatter `title` → first H1 → fallback.
 */
export function resolveNoteMeta(
  frontmatter: Record<string, unknown>,
  content: string,
  fallback: string
): NoteMeta {
  const titleValue = frontmatter.title
  const frontmatterTitle =
    typeof titleValue === 'string' || typeof titleValue === 'number'
      ? String(titleValue)
      : titleValue instanceof Date && !Number.isNaN(titleValue.getTime())
        ? titleValue.toISOString().slice(0, 10)
        : ''
  const heading = content.match(H1_RE)?.[1] ?? ''

  return {
    title:
      cleanTitle(frontmatterTitle) ||
      cleanTitle(heading) ||
      cleanTitle(fallback),
    updated: normalizeDate(frontmatter.updated)
  }
}

/**
 * Parse a note's raw source. Uses the same gray-matter parser as VitePress, so
 * multiline, quoted and escaped frontmatter values are handled consistently.
 */
export function parseNoteSource(raw: string, fallback: string): NoteMeta {
  const { data, content } = matter(raw)
  return resolveNoteMeta(data, content, fallback)
}

/**
 * Derive a canonical slug from a page URL, independent of `.html` and of
 * percent-encoding. Used for title fallbacks and tie-breaking.
 */
export function slugFromUrl(url: string): string {
  const segment = url.split('/').filter(Boolean).pop() ?? ''
  let decoded = segment

  try {
    decoded = decodeURIComponent(segment)
  } catch {
    // Keep the raw segment when it is not valid percent-encoding.
  }

  return decoded.replace(/\.html$/, '') || '未命名笔记'
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
