<script setup>
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

const props = defineProps({
  text: String,
  loading: Boolean,
  disabled: Boolean,
  outlined: Boolean,
  variant: {
    type: String,
    default: 'dark',
    validator: prop => ['primary', 'secondary', 'light', 'transparent', 'info', 'success', 'danger', 'dark'].includes(prop)
  }
})
</script>

<template>
  <button :class="`btn ${outlined ? `btn-outline-${variant}` : `btn-${variant}`} `" type="button" :disabled="disabled || loading">
    <div v-if="loading">
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span class="ms-2">{{t('button.loading')}}...</span>
    </div>
    <span v-else>
      <slot>{{ props.text }}</slot>
    </span>
  </button>
</template>


<style lang="scss" scoped>
.btn {
  font-size: 16px;
  height: 42px;
}
@media only screen and (max-width: 768px) {
  .btn {
    font-size: 13px;
  }
}
.btn.btn-primary {
  background-color: var(--color-secondary);
  color: var(--color-white);

  &:hover {
    // box-shadow: 0 0 8px rgba(0, 0, 0, 0.35);x
    border-color: var(--color-secondary);
  }
}
.btn.btn-light {
  background: #eee;
  border-color: #ddd;
  &:hover {
    border-color: #eee;
  }
}
.btn.btn-dark {
  background: #000;
  &:hover {
    background: #000;
  }
}
.btn.btn-danger {
  background: #f25037;
  &:hover {
    background: #f25037;
    border-color: #f25037;
  }
}
</style>
