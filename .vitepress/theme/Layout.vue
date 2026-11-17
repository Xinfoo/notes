<script setup lang="ts">
import DefaultTheme from 'vitepress/theme-without-fonts'
import LicenseNotice from './LicenseNotice.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-after>
      <LicenseNotice />
    </template>
  </Layout>
</template>
