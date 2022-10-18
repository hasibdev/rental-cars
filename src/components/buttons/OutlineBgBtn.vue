<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  text: String,
  loading: Boolean,
  disabled: Boolean,
  variant: {
    type: String,
    default: 'primary',
    validator: prop => ['primary', 'secondary', 'light', 'transparent', 'info', 'success', 'danger'].includes(prop)
  }
})
</script>

<template>
  <button :class="`btn btn-${variant}`" type="button" :disabled="disabled || loading">
    <div v-if="loading">
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span class="ms-2">Loading...</span>
    </div>
    <span v-else>
      <slot>{{ props.text }}</slot>
    </span>
  </button>
</template>


<style lang="scss" scoped>

.btn {
  font-size: 16px;
}
.btn.btn-primary {
  background-color: #d4e2fc;
  color: #276ef1;
  border-color: #A9C5F9;

  &:hover {
    // box-shadow: 0 0 8px rgba(0, 0, 0, 0.35);x
    border-color: #276ef1;
  }
}
</style>
