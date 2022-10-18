<template>
  <div class="hero-brand">
    <div class="hero-brand__item">
      <img class="hero-brand__item__1" src="../../assets/images/brands/brand-1.svg" alt="brand logo" />
    </div>
    <div class="hero-brand__item">
      <img class="hero-brand__item__2" src="../../assets/images/brands/brand-2.svg" alt="brand logo" />
    </div>
    <div class="hero-brand__item">
      <img class="hero-brand__item__3" src="../../assets/images/brands/brand-3.svg" alt="brand logo" />
    </div>
    <div class="hero-brand__item">
      <img class="hero-brand__item__4" src="../../assets/images/brands/brand-4.svg" alt="brand logo" />
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeHeroBrands",
}
</script>

<style lang="scss" scoped>
.hero-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-gap: 2rem;
  margin-top: 3rem;

  @include responsive-max("sm") {
    grid-gap: 1rem;
  }

  &__item {
    height: 100%;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;

    &__1 {
      width: 59px;
      height: 57px;
    }

    &__2 {
      width: 72px;
      height: 72px;
    }

    &__3 {
      width: 80px;
      height: 45px;
    }

    &__4 {
      width: 62px;
      height: 62px;
    }
  }
}
</style>
