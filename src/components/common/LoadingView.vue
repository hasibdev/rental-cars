<script setup>

import { defineProps } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <!-- Loading -->
  <Loading v-if="props.loading" class="my-3" />

  <!-- Content Slot -->
  <slot v-else />
</template>


<style lang="scss" scoped>
</style>
