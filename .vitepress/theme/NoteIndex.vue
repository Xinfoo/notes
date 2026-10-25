<script setup lang="ts">
import { data as notes } from '../../docs/notes.data.mts'
</script>

<template>
  <section v-if="notes.length" class="note-index" aria-labelledby="note-index-title">
    <h2 id="note-index-title" class="note-index-title">笔记索引</h2>

    <nav class="note-index-grid" aria-label="笔记索引">
      <a
        v-for="note in notes"
        :key="note.url"
        class="note-index-card"
        :href="note.url"
      >
        <span class="note-index-card-title">{{ note.title }}</span>
        <span class="note-index-action">
          打开笔记
          <span class="vpi-arrow-right" aria-hidden="true" />
        </span>
      </a>
    </nav>
  </section>
</template>
