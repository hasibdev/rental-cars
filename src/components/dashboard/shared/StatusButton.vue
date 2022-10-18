<template>
  <div :class="`status-btn ${'status-btn--' + type}`">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: () => "primary",
      validator(value) {
        return ["primary", "success", "info", "warning", "danger", 'grey'].includes(
          value
        )
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.status-btn {
  padding: 8px;
  min-width: 85px;
  border-radius: 4px;
  border: 0;
  font-weight: 500;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &--success {
    background: #d0ffe5;
    color: #0be06b;
  }

  &--primary {
    background: #e3edff;
    color: #276ef1;
  }

  &--warning {
    background: #fff2e1;
    color: #ffa42f;
  }

  &--info {
    background: #f5e1ff;
    color: #b04cdf;
  }

  &--danger {
    background: #ffe1e1;
    color: #f56c6b;
  }

  &--grey {
    background: #eee;
    color: rgba(0, 0, 0, 0.6);
  }
}
</style>
