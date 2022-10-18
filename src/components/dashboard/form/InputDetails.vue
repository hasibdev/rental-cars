<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  value: {
    type: [String, Number],
    required: true
  },
  label: { type: String },
})

</script>

<template>
  <div class="row align-items-center">
    <div v-if="props.label" class="col-md-4">
      <label class="label">{{ label }}</label>
    </div>

    <div :class="`${props.label ? 'col-md-8' : 'col-md-12'}`">
      <p>{{ props.value }}</p>
    </div>
  </div>
</template>


<style lang="scss" scoped>
</style>
