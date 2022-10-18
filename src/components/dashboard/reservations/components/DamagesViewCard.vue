<template>
  <div v-if="cardData" class="damages-view">
    <h5 class="damages-view__title">
      Damage description <br />
      at Handover
    </h5>
    <div class="damages-view__contents">
      <p class="damages-view__desc">
        {{ cardData.damages_content }}
      </p>
      <div class="damages-view__img">
        <img :src="`${imageBaseUrl}/documents/${cardData.damages_art}`" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cardData: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
.damages-view {
  margin-bottom: 2rem;
  &__title {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-gray);
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  &__contents {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  &__desc {
    border: 1px solid var(--color-light-grey);
    padding: 1rem;
    border-radius: 4px;
    margin-right: 2rem;
    width: 30%;
    min-height: 350px;
    margin-bottom: 0;
  }

  &__img {
    flex: 1;
    height: 350px;
    border: 1px solid var(--color-light-grey);
    border-radius: 4px;
    overflow: hidden;
    aspect-ratio: 16/10;
    padding: 0.75rem;
    background-color: var(--color-light-grey);

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 4px;
    }
  }
}
</style>
