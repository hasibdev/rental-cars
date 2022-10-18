<template>
  <div class="damages">
    <h3 class="damages__title">Damages</h3>
    <div class="damages__img">
      <img src="@/assets/images/car-art.png" alt="damages" />
    </div>
    <p class="damages__dsc">
      Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
      Velit officia consequat duis enim velit mollit. Exercitation veniam
      consequat sunt nostrud amet.amet sint. Velit officia consequat duis enim
      velit mollit. Exercitation veniam consequat sunt nostrud amet.
      Exercitation veniam consequat sunt nostrud amet.
    </p>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.damages {
  padding: 1rem 0;
  border: 1px solid var(--color-light-grey-2);
  border-radius: 5px;

  &__title {
    padding: 0 1rem;
    font-size: 1.2rem;
    font-weight: 500;
    text-transform: capitalize;
    color: var(--color-heading);
    margin-bottom: 0.875rem;
  }

  &__img {
    width: 100%;
    height: auto;
    text-align: center;

    img {
      width: 90%;
      height: auto;
      border-radius: 5px;
      margin-bottom: 0.875rem;
    }
  }

  &__dsc {
    padding: 0 1rem;
    font-size: 1rem;
    color: var(--color-text);
    margin-bottom: 0;
    border-top: 1px solid var(--color-light-grey-2);
    padding-top: 0.75rem;
    height: 133px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;

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
  }
}
</style>
