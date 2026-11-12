/**
 * Shared note metadata helpers.
 *
 * The site config (navigation/sidebar) and the homepage content loader both
 * resolve note titles through this module, so labels and ordering stay
 * consistent. Titles are read from frontmatter first, then the first H1, then
 * the file or directory name.
 */

import matter from 'gray-matter'

export interface NoteMeta {
  title: string
}

const H1_RE = /^#\s+(.+?)\s*$/m

/**
 * Title collation for the mixed Chinese/English case: Chinese titles are
 * ordered by pinyin and come before Latin titles, which are ordered A–Z.
 */
const titleCollator = new Intl.Collator('zh-CN', {
  numeric: true,
  sensitivity: 'base'
})

export function compareTitles(a: string, b: string): number {
  return titleCollator.compare(a, b) || a.localeCompare(b)
}

function cleanTitle(value: string): string {
  return value
    .replace(/^["']|["']$/g, '')
    .replace(/[*_`]/g, '')
    .trim()
}

/**
 * Resolve a title from already parsed frontmatter and content.
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
      : ''
  const heading = content.match(H1_RE)?.[1] ?? ''

  return {
    title:
      cleanTitle(frontmatterTitle) ||
      cleanTitle(heading) ||
      cleanTitle(fallback)
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
