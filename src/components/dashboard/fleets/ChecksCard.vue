<template>
  <div class="checks">
    <h3 class="checks__title">Checks</h3>
    <ul class="checks__list">
      <li
        v-for="(check, index) in 4"
        :key="check"
        class="checks__list-item"
      >
        <h5 class="checks-title">{{ index + 1 }}. Main Inspection</h5>
        <span class="checks-date">Novembar 2023</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.checks {
  padding: 1rem 0;
  border: 1px solid var(--color-light-grey-2);
  border-radius: 5px;
  margin-bottom: 1.5rem;

  &__title {
    font-size: 1.2rem;
    font-weight: 500;
    text-transform: capitalize;
    color: var(--color-heading);
    margin-bottom: 1rem;
    padding: 0 1rem;
  }
  &__list {
    height: 145px;
    overflow: auto;
    scrollbar-width: thin;
    padding: 0 1rem;

    &::-webkit-scrollbar {
      width: 0.25rem;
    }
    &::-webkit-scrollbar-track {
      background-color: #fff;
      -webkit-border-radius: 0.625rem;
      border-radius: 0.625rem;
    }
    &::-webkit-scrollbar-thumb {
      -webkit-border-radius: 0.625rem;
      border-radius: 0.625rem;
      background: #dadce0;
    }

    &-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      &:not(:last-child) {
        margin-bottom: 1rem;
      }

      .checks-title {
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 0;
        margin-right: 1.5rem;
      }

      .checks-date {
        font-size: 1rem;
        font-weight: 400;
        color: var(--color-grey);
      }
    }
  }
}
</style>
