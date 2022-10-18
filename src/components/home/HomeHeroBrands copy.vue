<template>
  <div class="hero-brand">
    <div v-for="brand in brands" :key="brand.id" class="hero-brand__item">
      <img :src="require(`@/assets/images/brands/${brand.logo}`)" alt="brand logo" />
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeHeroBrands",
  data() {
    return {
      brands: [
        {
          id: 1,
          logo: "1.png",
        },
        {
          id: 2,
          logo: "2.png",
        },
        {
          id: 3,
          logo: "3.png",
        },
        {
          id: 4,
          logo: "4.png",
        },
      ],
    }
  },
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
    height: 70px;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
