<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<template>
  <aside class="license-notice" aria-label="版权与许可">
    <p>
      Copyright © 2026 Xinfoo · 本文档采用
      <a :href="withBase('/license')">GFDL 1.3 or later</a> 许可
    </p>
  </aside>
</template>

<style scoped>
.license-notice {
  margin-top: 40px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.7;
}

.license-notice p {
  margin: 0;
}

.license-notice a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
