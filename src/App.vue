<script setup>
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n({ useScope: 'global' })
document.documentElement.setAttribute('lang', locale.value)

const route = useRoute()
</script>

<template>
  <component :is="route.meta.layout">
    <router-view />
  </component>
</template>
