<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as entries } from '../../docs/notes.data.mts'

const { page } = useData()

const collator = new Intl.Collator('zh-CN', {
  numeric: true,
  sensitivity: 'base'
})

function byTitle(
  a: { title: string },
  b: { title: string }
): number {
  return collator.compare(a.title, b.title) || a.title.localeCompare(b.title)
}

/**
 * Directory represented by the current page:
 * `index.md` → '', `cat/index.md` → 'cat', `cat/sub/index.md` → 'cat/sub'.
 */
const currentDir = computed(() =>
  (page.value.relativePath ?? '').replace(/\/?index\.md$/, '')
)

function parentOf(dir: string): string {
  return dir.includes('/') ? dir.slice(0, dir.lastIndexOf('/')) : ''
}

const categories = computed(() =>
  entries
    .filter(
      (entry) => entry.isIndex && parentOf(entry.dir) === currentDir.value
    )
    .sort(byTitle)
)

const notes = computed(() =>
  entries
    .filter((entry) => !entry.isIndex && entry.dir === currentDir.value)
    .sort(byTitle)
)

const isEmpty = computed(
  () => categories.value.length === 0 && notes.value.length === 0
)
</script>

<template>
  <section
    v-if="!isEmpty"
    class="note-index"
    :aria-labelledby="currentDir ? undefined : 'note-index-title'"
  >
    <h2 v-if="!currentDir" id="note-index-title" class="note-index-title">
      笔记索引
    </h2>

    <nav class="note-index-grid" :aria-label="currentDir ? '子项' : '笔记索引'">
      <a
        v-for="category in categories"
        :key="category.url"
        class="note-index-card"
        :href="category.url"
      >
        <span class="note-index-copy">
          <span class="note-index-card-title">{{ category.title }}</span>
          <span class="note-index-kind">分类</span>
        </span>
        <span class="note-index-action">
          查看分类
          <span class="vpi-arrow-right" aria-hidden="true" />
        </span>
      </a>

      <a
        v-for="note in notes"
        :key="note.url"
        class="note-index-card"
        :href="note.url"
      >
        <span class="note-index-copy">
          <span class="note-index-card-title">{{ note.title }}</span>
        </span>
        <span class="note-index-action">
          打开笔记
          <span class="vpi-arrow-right" aria-hidden="true" />
        </span>
      </a>
    </nav>
  </section>

  <section v-else-if="currentDir" class="note-index">
    <p class="note-index-empty">这个分类还没有内容。</p>
  </section>
</template>
