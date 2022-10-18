<template>
  <div class="stat-card">
    <div class="stat-card__icon">
      <slot />
    </div>
    <div class="stat-card__info">
      <p class="stat-card__title">{{ title }}</p>
      <h5 class="stat-card__value">{{ value }}</h5>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "title here",
    },
    value: {
      type: [String, Number],
      default: "000",
    },
  },
};
</script>

<style lang="scss" scoped>
.stat-card {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  border: 1px solid var(--color-light-grey-2);
  padding: 1rem;
  border-radius: 5px;

  &__icon {
    margin-right: 1.5rem;
  }

  &__title {
    font-size: 1rem;
    font-weight: 400;
    text-transform: capitalize;
    margin-bottom: 0.5rem;
    color: var(--color-text);
  }

  &__value {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 0;
    color: var(--color-text);
  }
}
</style>
