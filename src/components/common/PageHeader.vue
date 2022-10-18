<template>
  <div class="page-header">
    <h2 class="page-header__title">{{ title }}</h2>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.page-header {
  padding: 2rem 0;
  margin-top: 1rem;
}

.page-header__title {
  font-size: 2.2rem;
  font-weight: 600;
  text-transform: capitalize;
  color: var(--color-heading);
}
</style>
