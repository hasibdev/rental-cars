<template>
  <div v-if="cardData" class="damages-view">
    <h5 class="damages-view__title">Photos of Handover</h5>
    <div class="damages-view__contents">
      <div v-for="photo in cardData" :key="photo.id" class="damages-view__img">
        <img :src="`${imageBaseUrl}/${photo.folder}/${photo.file_name}`" alt="gellary" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cardData: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
.damages-view {
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
    flex-wrap: wrap;
  }

  &__img {
    flex-basis: calc(100% / 3);
    overflow: hidden;
    padding-right: 1rem;
    padding-bottom: 1rem;
    aspect-ratio: 16/10;

    &:nth-child(3n + 0) {
      padding-right: 0;
    }

    img {
      border-radius: 4px;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
